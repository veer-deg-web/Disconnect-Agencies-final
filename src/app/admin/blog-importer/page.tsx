"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Layers, 
  Play, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ScrollText, 
  ArrowRight,
  Plus,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobStatus {
  _id: string;
  status: "pending" | "generating" | "seeding" | "completed" | "failed";
  totalBlogs: number;
  processedBlogs: number;
  successCount: number;
  failureCount: number;
  currentTask: string;
  logs: string[];
}

export default function BlogImporterPage() {
  const [listingUrl, setListingUrl] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [limit, setLimit] = useState(10);
  const [categories, setCategories] = useState<string[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [activeJob, setActiveJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    fetch("/api/admin/blogs/categories")
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  // Poll for job status
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const poll = async () => {
      try {
        const res = await fetch("/api/admin/generation-status");
        if (!res.ok) return;
        const data = await res.json();
        
        // Only care about "importer" jobs or the most recent one
        if (data && data.type === "importer") {
          setActiveJob(data);
          if (data.status === "completed" || data.status === "failed") {
            clearInterval(interval);
          }
        } else if (activeJob) {
          // If we had an active job but the API returns something else (new job type?), stop polling
          // Or just update if it's the same ID
          if (data && data._id === activeJob._id) {
            setActiveJob(data);
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    if (activeJob && (activeJob.status === "generating" || activeJob.status === "seeding" || activeJob.status === "pending")) {
      interval = setInterval(poll, 3000);
    }

    return () => clearInterval(interval);
  }, [activeJob]);

  const handleStartImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingUrl) return;

    setIsStarting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/blogs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingUrl, category, limit }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start import");

      // Set active job to start polling
      setActiveJob({
        _id: data.jobId,
        status: "pending",
        totalBlogs: 0,
        processedBlogs: 0,
        successCount: 0,
        failureCount: 0,
        currentTask: "Initializing...",
        logs: ["Starting job..."]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsStarting(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    generating: "text-purple-400",
    seeding: "text-pink-400",
    completed: "text-green-400",
    failed: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="relative space-y-2">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              Blog Importer
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">
              Professional content pipeline. Scrape any website, rewrite with Gemini Flash, and seed directly as drafts for review.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-500/5 transition-colors duration-700" />
              
              <form onSubmit={handleStartImport} className="space-y-6 relative">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-white/60 flex items-center gap-2 px-1">
                    <Globe className="w-4 h-4 text-purple-400" />
                    Website Blog URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/blog"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2 px-1">
                      <Layers className="w-4 h-4 text-purple-400" />
                      Category
                    </label>
                    <div className="relative group">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-[#121212] text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-white/60 transition-colors">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2 px-1">
                      <Plus className="w-4 h-4 text-purple-400" />
                      Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={limit}
                      onChange={(e) => setLimit(parseInt(e.target.value))}
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isStarting || !!(activeJob && (activeJob.status === "generating" || activeJob.status === "seeding"))}
                  className={cn(
                    "w-full py-5 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]",
                    isStarting || (activeJob && (activeJob.status === "generating" || activeJob.status === "seeding"))
                      ? "bg-white/10 text-white/40 border border-white/5 cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                  )}
                >
                  {isStarting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                  {isStarting ? "Starting..." : "Start Import"}
                </button>
              </form>
            </div>

            {/* Quick Stats */}
            {activeJob && (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 grid grid-cols-3 gap-4">
                <div className="text-center space-y-1">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Discovered</p>
                  <p className="text-2xl font-bold">{activeJob.totalBlogs}</p>
                </div>
                <div className="text-center space-y-1 border-x border-white/5">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Processed</p>
                  <p className="text-2xl font-bold text-purple-400">{activeJob.processedBlogs}</p>
                </div>
                <div className="text-center space-y-1 font-mono">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider font-sans">Success</p>
                  <p className="text-2xl font-bold text-green-400">+{activeJob.successCount}</p>
                </div>
              </div>
            )}
          </div>

          {/* Status & Logs Panel */}
          <div className="lg:col-span-1 border border-white/0" /> {/* Spacer */}
          
          <div className="lg:col-span-6 space-y-6">
            {!activeJob ? (
              <div className="h-[500px] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center text-white/20">
                  <ScrollText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-white/60 font-medium">No Active Import</p>
                  <p className="text-white/30 text-sm max-w-[240px]">Paste a URL and start the process to see live logs and progress here.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">
                
                {/* Status Bar */}
                <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      activeJob.status === "failed" ? "bg-red-500/10" : 
                      activeJob.status === "completed" ? "bg-green-500/10" : "bg-purple-500/10"
                    )}>
                      {activeJob.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : activeJob.status === "failed" ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/50 uppercase tracking-widest">Job Status</p>
                      <p className={cn("text-lg font-bold capitalize", statusColors[activeJob.status])}>
                        {activeJob.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-white/50 uppercase tracking-widest leading-tight">Current Activity</p>
                    <p className="text-white font-medium truncate max-w-[200px]">{activeJob.currentTask}</p>
                  </div>
                </div>

                {/* Logs Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {activeJob.logs.map((log, i) => (
                    <div key={i} className="flex gap-4 group hover:bg-white/[0.02] -mx-2 px-2 py-1 rounded transition-colors duration-200">
                      <span className="text-white/20 select-none w-8">{i + 1}</span>
                      <span className="text-white/70 leading-relaxed whitespace-pre-wrap">{log}</span>
                    </div>
                  ))}
                  {(activeJob.status === "generating" || activeJob.status === "seeding") && (
                    <div className="flex gap-4 px-2 py-1 items-center italic text-purple-400/60 animate-pulse">
                      <span className="w-8"></span>
                      <span>Waiting for next heartbeat...</span>
                    </div>
                  )}
                </div>

                {/* Footer Progress */}
                <div className="p-1.5 bg-white/[0.05]">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-white transition-all duration-1000 ease-in-out"
                      style={{ 
                        width: `${activeJob.totalBlogs > 0 ? (activeJob.processedBlogs / activeJob.totalBlogs) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Disclaimer */}
            <p className="text-[#666] text-xs font-medium px-4 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Note: Articles are rewritten to 1000+ words. Ensure high limit settings for bulk imports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
