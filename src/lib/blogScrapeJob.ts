import { scrapeAndRewrite, type ScrapeProgress } from "@/lib/blogGenerator";

export type BlogScrapeJobStatus = "idle" | "running" | "stopping" | "stopped" | "completed" | "failed";

export interface BlogScrapeJobState extends ScrapeProgress {
  jobId: string;
  status: BlogScrapeJobStatus;
  stopRequested: boolean;
  startedAt: string | null;
  endedAt: string | null;
  errors: string[];
}

const createInitialState = (): BlogScrapeJobState => ({
  jobId: "",
  status: "idle",
  phase: "done",
  total: 0,
  processed: 0,
  created: 0,
  skipped: 0,
  stopRequested: false,
  startedAt: null,
  endedAt: null,
  errors: [],
});

const globalStore = globalThis as typeof globalThis & {
  __blogScrapeJobState?: BlogScrapeJobState;
};

if (!globalStore.__blogScrapeJobState) {
  globalStore.__blogScrapeJobState = createInitialState();
}

function getStateRef(): BlogScrapeJobState {
  return globalStore.__blogScrapeJobState as BlogScrapeJobState;
}

function setState(next: BlogScrapeJobState) {
  globalStore.__blogScrapeJobState = next;
}

export function getBlogScrapeJobState(): BlogScrapeJobState {
  return getStateRef();
}

export function startBlogScrapeJob(
  maxPages: number = 100,
  maxArticles: number = Number.MAX_SAFE_INTEGER,
  category?: string
): BlogScrapeJobState {
  const current = getStateRef();
  if (current.status === "running" || current.status === "stopping") {
    return current;
  }

  const jobId = `scrape-${Date.now()}`;
  const initial: BlogScrapeJobState = {
    ...createInitialState(),
    jobId,
    status: "running",
    phase: "collecting",
    stopRequested: false,
    startedAt: new Date().toISOString(),
  };
  setState(initial);

  void (async () => {
    try {
      const result = await scrapeAndRewrite(
        maxPages,
        maxArticles,
        (progress) => {
          const prev = getStateRef();
          setState({
            ...prev,
            phase: progress.phase,
            total: progress.total,
            processed: progress.processed,
            created: progress.created,
            skipped: progress.skipped,
            currentTitle: progress.currentTitle,
            currentUrl: progress.currentUrl,
            lastError: progress.lastError,
          });
        },
        () => getStateRef().stopRequested,
        category
      );

      const prev = getStateRef();
      setState({
        ...prev,
        status: result.stopped ? "stopped" : "completed",
        phase: "done",
        stopRequested: false,
        lastError: result.stopped ? "Scrape stopped by admin" : prev.lastError,
        endedAt: new Date().toISOString(),
        errors: result.errors,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown scrape job error";
      const prev = getStateRef();
      setState({
        ...prev,
        status: prev.stopRequested ? "stopped" : "failed",
        phase: "done",
        stopRequested: false,
        lastError: msg,
        endedAt: new Date().toISOString(),
        errors: [...prev.errors, msg],
      });
    }
  })();

  return initial;
}

export function requestStopBlogScrapeJob(): BlogScrapeJobState {
  const current = getStateRef();
  if (current.status !== "running") {
    return current;
  }

  const next: BlogScrapeJobState = {
    ...current,
    status: "stopping",
    stopRequested: true,
    lastError: "Stopping scrape...",
  };
  setState(next);
  return next;
}
