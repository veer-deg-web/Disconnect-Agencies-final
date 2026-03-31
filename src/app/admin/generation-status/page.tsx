"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface JobStatus {
  status: string;
  processedBlogs: number;
  totalBlogs: number;
  successCount: number;
  failureCount: number;
  logs: string[];
  currentTask: string;
  startedAt: string;
  finishedAt: string | null;
}

export default function GenerationStatusPage() {
  const [job] = useState<JobStatus | null>(null);
  const [error] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // interval and fetchStatus were removed here to stop unnecessary 404s
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [job?.logs]);

  const getProgress = () => {
    if (!job || job.totalBlogs === 0) return 0;
    return Math.round((job.processedBlogs / job.totalBlogs) * 100);
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    generating: "text-purple-400",
    seeding: "text-pink-400",
    completed: "text-green-400",
    failed: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              AI Pipeline Ops
            </h1>
            <p className="text-gray-400 mt-2">ACID-Compliant Blog Generation Tracking</p>
          </div>
          <div className="text-right">
            <div className={cn("text-lg font-mono uppercase tracking-widest", job ? statusColors[job.status] : "text-gray-500")}>
              {job?.status || "Checking..."}
            </div>
            <div className="text-xs text-gray-500 mt-1">Live Status Updating every 3s</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Processed" value={job?.processedBlogs || 0} sub={`of ${job?.totalBlogs || 0} total`} />
          <StatCard title="Success" value={job?.successCount || 0} sub="Blogs Created" color="text-green-400" />
          <StatCard title="Failures" value={job?.failureCount || 0} sub="Errors Logged" color="text-red-400" />
          <StatCard title="Uptime" value={job?.startedAt ? new Date(job.startedAt).toLocaleTimeString() : "--:--"} sub="Job Started" />
        </div>

        {/* Progress Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Data Processing Pipeline</h2>
            <span className="text-2xl font-mono text-blue-400">{getProgress()}%</span>
          </div>
          
          <div className="h-4 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="mt-6 flex items-center space-x-3 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm italic">Current Task: {job?.currentTask || "Idle"}</span>
          </div>
        </div>

        {/* Logs Console */}
        <div className="bg-[#0e0e11] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[400px]">
          <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-sm font-mono text-gray-400 uppercase tracking-wider">Terminal Logs</span>
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 custom-scrollbar">
            {job?.logs.map((log, i) => (
              <div key={i} className="flex space-x-4 border-l-2 border-white/5 pl-4 hover:border-blue-500/30 transition-colors">
                <span className="text-gray-600 select-none">[{i + 1}]</span>
                <span className={cn(
                  log.includes("Error") ? "text-red-400" : 
                  log.includes("success") ? "text-green-400" : 
                  "text-gray-300"
                )}>
                  {log}
                </span>
              </div>
            ))}
            {!job?.logs.length && <div className="text-gray-600">Waiting for events...</div>}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Styling for scrollbar */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
        `}</style>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, color = "text-white" }: { title: string, value: string | number, sub: string, color?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all group">
      <p className="text-sm text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">{title}</p>
      <p className={cn("text-3xl font-bold mb-1", color)}>{value}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
}
