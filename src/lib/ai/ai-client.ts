import { GoogleGenerativeAI } from "@google/generative-ai";
import { createHash } from "crypto";
import { logAIUsage, calculateEstimatedCost } from "./ai-tracker";

// Types
export interface AIRequestOptions {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  responseMimeType?: string;
  cache?: boolean;
}

export interface AIResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  cached: boolean;
}

// Queue / Throttling state
const requestQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;
const MIN_INTERVAL_MS = 3000;
let lastRequestTime = 0;

// Deduplication / Caching state
const activeRequests = new Map<string, Promise<AIResponse>>();
const responseCache = new Map<string, AIResponse>();

function getPromptHash(prompt: string, model: string): string {
  return createHash("sha256").update(`${model}:${prompt}`).digest("hex");
}

export class AIClient {
  private _genAI: GoogleGenerativeAI | null = null;

  private get genAI(): GoogleGenerativeAI {
    if (!this._genAI) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error("GEMINI_API_KEY is missing from environment");
      this._genAI = new GoogleGenerativeAI(key);
    }
    return this._genAI;
  }

  async request(options: AIRequestOptions): Promise<AIResponse> {
    const hash = getPromptHash(options.prompt, options.model);

    // 1. Check Cache
    if (options.cache !== false && responseCache.has(hash)) {
      return { ...responseCache.get(hash)!, cached: true };
    }

    // 2. Check Deduplication (active requests)
    if (activeRequests.has(hash)) {
      console.log(`[AI-CLIENT] Deduplicating request for hash ${hash.substring(0, 8)}`);
      return activeRequests.get(hash)!;
    }

    // 3. Queue the request
    const requestPromise = new Promise<AIResponse>((resolve, reject) => {
      requestQueue.push(async () => {
        try {
          const result = await this.executeBufferedRequest(options);
          responseCache.set(hash, result);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          activeRequests.delete(hash);
        }
      });
      this.processQueue();
    });

    activeRequests.set(hash, requestPromise);
    return requestPromise;
  }

  private async processQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLast = now - lastRequestTime;
      
      if (timeSinceLast < MIN_INTERVAL_MS) {
        await new Promise(r => setTimeout(r, MIN_INTERVAL_MS - timeSinceLast));
      }

      const nextTask = requestQueue.shift();
      if (nextTask) {
        lastRequestTime = Date.now();
        await nextTask();
      }
    }

    isProcessingQueue = false;
  }

  private async executeBufferedRequest(options: AIRequestOptions): Promise<AIResponse> {
    const startTime = Date.now();
    try {
      const model = this.genAI.getGenerativeModel({
        model: options.model,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 4096,
          responseMimeType: options.responseMimeType,
        },
      });

      const result = await model.generateContent(options.prompt);
      const response = result.response;
      const text = response.text();
      
      const inputTokens = options.prompt.length / 4; 
      const outputTokens = text.length / 4;

      const latency = Date.now() - startTime;
      const cost = calculateEstimatedCost(options.model, inputTokens, outputTokens);

      logAIUsage({
        timestamp: new Date().toISOString(),
        model: options.model,
        promptHash: getPromptHash(options.prompt, options.model),
        inputTokens,
        outputTokens,
        costEstimate: cost,
        latencyMs: latency,
        status: "success",
      });

      return {
        text,
        inputTokens,
        outputTokens,
        model: options.model,
        cached: false,
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      logAIUsage({
        timestamp: new Date().toISOString(),
        model: options.model,
        promptHash: getPromptHash(options.prompt, options.model),
        inputTokens: 0,
        outputTokens: 0,
        costEstimate: 0,
        latencyMs: latency,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export const aiClient = new AIClient();
