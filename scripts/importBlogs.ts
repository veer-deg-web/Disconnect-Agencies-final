import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import mongoose from "mongoose";
import dbConnect from "../src/lib/mongodb";
import Blog from "../src/models/Blog";
import {
  prepareBlogImport,
  PreparedBlogImport,
  RawBlogImport,
} from "../src/lib/blogImport";

interface ImportFailure {
  index: number;
  title: string;
  slug: string;
  reason: string;
}

function parseArgs(argv: string[]) {
  const options = {
    file: "blogs.json",
    dryRun: false,
    mongoUri: process.env.MONGODB_URI || "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--file" && argv[index + 1]) {
      options.file = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === "--dry-run") {
      options.dryRun = true;
    }

    if (value === "--mongo-uri" && argv[index + 1]) {
      options.mongoUri = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

async function readBlogsFile(filePath: string): Promise<RawBlogImport[]> {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  const fileContents = await fs.readFile(absolutePath, "utf8");
  const parsed = JSON.parse(fileContents);

  if (!Array.isArray(parsed)) {
    throw new Error("blogs.json must contain an array of blog objects.");
  }

  return parsed as RawBlogImport[];
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const blogs = await readBlogsFile(options.file);

  if (!options.mongoUri) {
    throw new Error(
      "Set MONGODB_URI or pass --mongo-uri to target the production MongoDB database."
    );
  }

  process.env.MONGODB_URI = options.mongoUri;

  await dbConnect();

  const existingSlugs = new Set(
    (
      await Blog.find({}, { slug: 1, _id: 0 })
        .lean()
        .exec()
    ).map((blog) => String(blog.slug))
  );
  const processedSlugs = new Set<string>();

  const failures: ImportFailure[] = [];
  const documentsToInsert: PreparedBlogImport[] = [];

  for (const [index, rawBlog] of blogs.entries()) {
    const prepared = prepareBlogImport(rawBlog);
    const title = prepared.blog.title || rawBlog.title || `Blog ${index + 1}`;
    let slug = prepared.blog.slug;

    if (processedSlugs.has(slug) || existingSlugs.has(slug)) {
      let suffix = 2;
      while (processedSlugs.has(`${slug}-${suffix}`) || existingSlugs.has(`${slug}-${suffix}`)) {
        suffix += 1;
      }
      slug = `${slug}-${suffix}`;
      prepared.blog.slug = slug;
    }

    processedSlugs.add(slug);

    const blockingIssues = prepared.issues.filter((issue) => issue.severity === "error");

    if (blockingIssues.length > 0) {
      failures.push({
        index,
        title: String(title),
        slug,
        reason: blockingIssues.map((issue) => issue.message).join(" "),
      });
      continue;
    }

    documentsToInsert.push({
      ...prepared.blog,
      slug,
      createdAt: prepared.blog.createdAt,
    });

    const warnings = prepared.issues
      .filter((issue) => issue.severity === "warning")
      .map((issue) => issue.message);

    if (warnings.length > 0) {
      console.log(`WARN [${slug}] ${warnings.join(" | ")}`);
    }
  }

  console.log(`Prepared ${documentsToInsert.length} blog(s) from ${blogs.length} input record(s).`);

  let insertedCount = 0;

  if (!options.dryRun && documentsToInsert.length > 0) {
    for (const [index, blog] of documentsToInsert.entries()) {
      try {
        await Blog.create(blog);
        insertedCount += 1;
        existingSlugs.add(String(blog.slug));
        console.log(`OK [${index}] ${blog.slug}`);
      } catch (error) {
        failures.push({
          index,
          title: String(blog.title),
          slug: String(blog.slug),
          reason:
            error instanceof Error ? error.message : "Insert failed with an unknown error.",
        });
      }
    }

    console.log(`Inserted ${insertedCount} blog(s) into MongoDB.`);
  } else if (options.dryRun) {
    console.log("Dry run enabled: no blogs were inserted.");
  }

  if (failures.length > 0) {
    console.error(`Failed to import ${failures.length} blog(s):`);
    failures.forEach((failure) => {
      console.error(`- [${failure.index}] ${failure.slug} :: ${failure.reason}`);
    });
    process.exitCode = 1;
  } else {
    console.log("All blogs processed successfully.");
  }

  await mongoose.disconnect();
}

main().catch(async (error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Blog import failed with an unknown error."
  );
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
