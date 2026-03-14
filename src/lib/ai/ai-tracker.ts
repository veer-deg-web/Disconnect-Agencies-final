export interface AIUsageLog {
  timestamp: string;
  model: string;
  promptHash: string;
  inputTokens: number;
  outputTokens: number;
  costEstimate: number;
  latencyMs: number;
  status: "success" | "error";
  error?: string;
}

const COST_RATES: Record<string, { input: number; output: number }> = {
  "gemini-2.0-flash": { input: 0.15 / 1000000, output: 0.60 / 1000000 },
  "gemini-1.5-flash": { input: 0.075 / 1000000, output: 0.30 / 1000000 },
  "default": { input: 0.1 / 1000000, output: 0.4 / 1000000 },
};

export function calculateEstimatedCost(model: string, inputTokens: number, outputTokens: number): number {
  const rate = COST_RATES[model] || COST_RATES["default"];
  return (inputTokens * rate.input) + (outputTokens * rate.output);
}

// Simple in-memory logger for this session
// In a production app, this would write to a database or a file
const logs: AIUsageLog[] = [];

export function logAIUsage(log: AIUsageLog) {
  logs.push(log);
  // Log to console for visibility during dev
  console.log(`[AI-TRACKER] ${log.model} | Tokens: ${log.inputTokens}/${log.outputTokens} | Cost: $${log.costEstimate.toFixed(6)} | Latency: ${log.latencyMs}ms`);
}

export function getAIStats() {
  const totalCost = logs.reduce((sum, log) => sum + log.costEstimate, 0);
  const totalRequests = logs.length;
  const totalInputTokens = logs.reduce((sum, log) => sum + log.inputTokens, 0);
  const totalOutputTokens = logs.reduce((sum, log) => sum + log.outputTokens, 0);

  return {
    totalCost,
    totalRequests,
    totalInputTokens,
    totalOutputTokens,
    logs: logs.slice(-10), // Keep last 10 logs
  };
}
