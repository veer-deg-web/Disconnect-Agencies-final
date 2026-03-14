import { NextRequest, NextResponse } from "next/server";
import { createJob, finishJob } from "@/lib/acidJob";
import { importFromExternalUrl } from "@/lib/blogGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingUrl, category, limit } = body;

    if (!listingUrl) {
      return NextResponse.json({ error: "listingUrl is required" }, { status: 100 });
    }

    const { job, lockId } = await createJob("importer");

    // Fire and forget
    void (async () => {
      try {
        const result = await importFromExternalUrl(
          listingUrl,
          category,
          1, // maxPages
          limit || 20,
          job._id.toString(),
          lockId
        );

        await finishJob(job._id, lockId, "completed", `Import finished. Created: ${result.created}, Skipped: ${result.skipped}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await finishJob(job._id, lockId, "failed", `Fatal error: ${msg}`);
      }
    })();

    return NextResponse.json({
      message: "Import job started",
      jobId: job._id,
      lockId
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
