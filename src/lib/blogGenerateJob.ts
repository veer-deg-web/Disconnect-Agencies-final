import { generateNewBlog } from "@/lib/blogGenerator";

export type BlogGenerateJobStatus = "idle" | "running" | "completed" | "failed";

export interface BlogGenerateJobState {
  jobId: string;
  status: BlogGenerateJobStatus;
  total: number;
  processed: number;
  created: number;
  failed: number;
  currentTopic?: string;
  lastError?: string;
  errors: string[];
  startedAt: string | null;
  endedAt: string | null;
}

const createInitialState = (): BlogGenerateJobState => ({
  jobId: "",
  status: "idle",
  total: 0,
  processed: 0,
  created: 0,
  failed: 0,
  currentTopic: "",
  lastError: "",
  errors: [],
  startedAt: null,
  endedAt: null,
});

const globalStore = globalThis as typeof globalThis & {
  __blogGenerateJobState?: BlogGenerateJobState;
};

if (!globalStore.__blogGenerateJobState) {
  globalStore.__blogGenerateJobState = createInitialState();
}

function getStateRef(): BlogGenerateJobState {
  return globalStore.__blogGenerateJobState as BlogGenerateJobState;
}

function setState(next: BlogGenerateJobState) {
  globalStore.__blogGenerateJobState = next;
}

export function getBlogGenerateJobState(): BlogGenerateJobState {
  return getStateRef();
}

function getTopicForIndex(baseTopic: string, index: number, total: number): string | undefined {
  const trimmed = baseTopic.trim();
  if (!trimmed) return undefined;
  if (total === 1) return trimmed;
  return `${trimmed} (Part ${index + 1})`;
}

export function startBlogGenerateJob(
  count: number,
  topic: string,
  category?: string
): BlogGenerateJobState {
  const current = getStateRef();
  if (current.status === "running") {
    return current;
  }

  const total = Math.min(50, Math.max(1, count));
  const initial: BlogGenerateJobState = {
    ...createInitialState(),
    jobId: `generate-${Date.now()}`,
    status: "running",
    total,
    startedAt: new Date().toISOString(),
  };
  setState(initial);

  void (async () => {
    let processed = 0;
    let created = 0;
    let failed = 0;
    const errors: string[] = [];

    const concurrency = Math.min(
      8,
      Math.max(1, parseInt(process.env.BLOG_AI_GENERATE_CONCURRENCY || "4"))
    );
    const workerCount = Math.min(concurrency, total);
    let cursor = 0;

    const emit = (currentTopic?: string, lastError?: string) => {
      const prev = getStateRef();
      setState({
        ...prev,
        total,
        processed,
        created,
        failed,
        currentTopic: currentTopic || prev.currentTopic,
        lastError: lastError || prev.lastError,
        errors: [...errors],
      });
    };

    try {
      await Promise.all(
        Array.from({ length: workerCount }, async () => {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const index = cursor++;
            if (index >= total) break;

            const scopedTopic = getTopicForIndex(topic, index, total);
            try {
              const result = await generateNewBlog(scopedTopic, category);
              if (result.blog) {
                created++;
              } else {
                failed++;
                if (result.error) errors.push(result.error);
              }
            } catch (err) {
              failed++;
              const msg = err instanceof Error ? err.message : "Unknown generation error";
              errors.push(msg);
              emit(scopedTopic, msg);
            } finally {
              processed++;
              emit(scopedTopic);
            }
          }
        })
      );

      const prev = getStateRef();
      setState({
        ...prev,
        status: failed === total ? "failed" : "completed",
        processed,
        created,
        failed,
        errors,
        endedAt: new Date().toISOString(),
        lastError: failed === total ? (errors[errors.length - 1] || "All generations failed") : prev.lastError,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected generation failure";
      const prev = getStateRef();
      setState({
        ...prev,
        status: "failed",
        processed,
        created,
        failed: failed + 1,
        lastError: msg,
        errors: [...errors, msg],
        endedAt: new Date().toISOString(),
      });
    }
  })();

  return initial;
}
