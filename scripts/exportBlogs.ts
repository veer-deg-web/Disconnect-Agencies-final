import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import mongoose from "mongoose";

type ExportableBlog = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  author: string;
  status: "draft" | "published";
  source: "scraped" | "ai-generated" | "manual";
  sourceUrl?: string;
  faq: Array<{ question: string; answer: string }>;
};

function parseArgs(argv: string[]) {
  const options = {
    mongoUri: process.env.MONGODB_URI || "",
    out: "blogs.json",
    status: "published",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--mongo-uri" && argv[index + 1]) {
      options.mongoUri = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === "--out" && argv[index + 1]) {
      options.out = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === "--status" && argv[index + 1]) {
      options.status = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.mongoUri) {
    throw new Error(
      "Set MONGODB_URI or pass --mongo-uri to export blogs from the source MongoDB database."
    );
  }

  await mongoose.connect(options.mongoUri);

  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection was established without an active database handle.");
  }

  const filter =
    options.status === "all" ? {} : { status: options.status };

  const blogs = (await mongoose.connection.db
    .collection("blogs")
    .find(filter)
    .sort({ createdAt: -1 })
    .project({
      _id: 0,
      title: 1,
      slug: 1,
      content: 1,
      excerpt: 1,
      featuredImage: 1,
      category: 1,
      tags: 1,
      metaTitle: 1,
      metaDescription: 1,
      createdAt: 1,
      author: 1,
      status: 1,
      source: 1,
      sourceUrl: 1,
      faq: 1,
    })
    .toArray()) as ExportableBlog[];

  const outputPath = path.isAbsolute(options.out)
    ? options.out
    : path.resolve(process.cwd(), options.out);

  await fs.writeFile(outputPath, JSON.stringify(blogs, null, 2), "utf8");

  console.log(`Exported ${blogs.length} blog(s) to ${outputPath}`);

  await mongoose.disconnect();
}

main().catch(async (error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Blog export failed with an unknown error."
  );
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
