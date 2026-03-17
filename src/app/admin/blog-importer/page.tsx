"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Play, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ScrollText, 
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import "../Admin.css";

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
        
        if (data && data.type === "importer") {
          setActiveJob(data);
          if (data.status === "completed" || data.status === "failed") {
            clearInterval(interval);
          }
        } else if (activeJob) {
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

  const _statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    generating: "text-purple-400",
    seeding: "text-pink-400",
    completed: "text-green-400",
    failed: "text-red-400",
  };

  return (
    <div className="adm-root" style={{ minHeight: '100vh', background: '#0a0a12' }}>
      <main className="adm-main">
        <div className="adm-page-header">
          <div>
            <span className="adm-page-title">Blog Importer</span>
            <p className="adm-page-subtitle">Professional content pipeline. Scrape any website, rewrite with Gemini Flash, and seed directly as drafts.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Controls Panel */}
          <section className="adm-table-wrap" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="adm-table-heading" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={18} /> Configuration
            </h2>
            
            <form onSubmit={handleStartImport} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="adm-field">
                <label className="adm-label">Website Blog URL</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/blog"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    className="adm-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <Globe size={16} style={{ position: 'absolute', left: '14px', top: '12px', opacity: 0.4 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="adm-field">
                  <label className="adm-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="adm-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-field">
                  <label className="adm-label">Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="adm-input"
                  />
                </div>
              </div>

              {error && <div className="adm-error-bar">{error}</div>}

              <button
                type="submit"
                disabled={isStarting || !!(activeJob && (activeJob.status === "generating" || activeJob.status === "seeding"))}
                className="adm-btn adm-btn--primary"
                style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}
              >
                {isStarting ? (
                  <Loader2 size={18} className="adm-spinner" style={{ margin: 0 }} />
                ) : (
                  <Play size={18} />
                )}
                &nbsp;{isStarting ? "Starting..." : "Start Import"}
              </button>
            </form>

            {/* Quick Stats */}
            {activeJob && (activeJob.status !== "pending") && (
              <div className="adm-stats" style={{ marginTop: '16px', gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid' }}>
                <div className="adm-stat-card" style={{ minWidth: 0, textAlign: 'center' }}>
                  <span className="adm-stat-label">Found</span>
                  <span className="adm-stat-value" style={{ fontSize: '20px' }}>{activeJob.totalBlogs}</span>
                </div>
                <div className="adm-stat-card" style={{ minWidth: 0, textAlign: 'center' }}>
                  <span className="adm-stat-label">Done</span>
                  <span className="adm-stat-value" style={{ fontSize: '20px', color: '#a78bfa' }}>{activeJob.processedBlogs}</span>
                </div>
                <div className="adm-stat-card" style={{ minWidth: 0, textAlign: 'center' }}>
                  <span className="adm-stat-label">Success</span>
                  <span className="adm-stat-value" style={{ fontSize: '20px', color: '#22c55e' }}>{activeJob.successCount}</span>
                </div>
              </div>
            )}
          </section>

          {/* Status & Logs Panel */}
          <section className="adm-table-wrap" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="adm-table-header" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="adm-table-heading">Live Job Monitor</span>
              {activeJob && (
                <div className={cn("adm-status-pill", activeJob.status === 'completed' ? 'done' : activeJob.status === 'failed' ? 'pending' : '')} 
                     style={activeJob.status === 'failed' ? { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' } : {}}>
                  {activeJob.status === "completed" ? (
                    <CheckCircle2 size={12} />
                  ) : activeJob.status === "failed" ? (
                    <XCircle size={12} />
                  ) : (
                    <Loader2 size={12} className="adm-spinner" style={{ margin: 0 }} />
                  )}
                  {activeJob.status}
                </div>
              )}
            </div>

            {!activeJob ? (
              <div className="adm-empty" style={{ flex: 1 }}>
                <ScrollText size={48} />
                <p className="adm-empty-text">No Active Import</p>
                <p className="adm-empty-sub">Enter a URL and click &quot;Start Import&quot; to see logs here.</p>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid #1e1535', fontSize: '13px', color: '#7c6fb0' }}>
                  <b>Current Task:</b> {activeJob.currentTask}
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#050508', fontFamily: 'monospace', fontSize: '12px', color: '#b4a8de', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activeJob.logs.map((log, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ color: '#4a3f70', opacity: 0.5, width: '24px', flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ opacity: 0.9 }}>{log}</span>
                    </div>
                  ))}
                  {(activeJob.status === "generating" || activeJob.status === "seeding") && (
                    <div style={{ color: '#7c3aed', opacity: 0.6, fontSize: '11px', marginTop: '8px', fontStyle: 'italic' }}>
                      Waiting for next heartbeat...
                    </div>
                  )}
                </div>

                {/* Progress Footer */}
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #7c3aed, #ec4899)', 
                      width: `${activeJob.totalBlogs > 0 ? (activeJob.processedBlogs / activeJob.totalBlogs) * 100 : 0}%`,
                      transition: 'width 0.5s ease'
                    }} 
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', color: '#4a3f70', fontSize: '12px' }}>
          <AlertCircle size={14} />
          <span>Articles are generated using Gemini AI. Each import may take several minutes.</span>
        </div>
      </main>
    </div>
  );
}
