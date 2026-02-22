'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Pencil, Trash2, X,
  Search, LogOut, HelpCircle, ChevronRight,
} from 'lucide-react';
import './Admin.css';

/* ── Types ── */
type Category = 'general' | 'cloud' | 'uiux' | 'webdev' | 'appdev' | 'aimodels' | 'seo';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'general',  label: 'General' },
  { value: 'cloud',    label: 'Cloud / Agency' },
  { value: 'uiux',    label: 'UI/UX' },
  { value: 'webdev',  label: 'Web Dev' },
  { value: 'appdev',  label: 'App Dev' },
  { value: 'aimodels',label: 'AI Models' },
  { value: 'seo',     label: 'SEO' },
];

interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: Category;
  order: number;
}

/* ── Helper: auth headers ── */
function authHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' };
}

/* ─────────────────────────────────────────────
   SIGN-IN GATE
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   FAQ FORM MODAL
───────────────────────────────────────────── */
function FaqFormModal({
  initial, onSave, onClose, loading,
}: {
  initial?: Partial<Faq>;
  onSave: (data: { question: string; answer: string; category: Category }) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [question, setQuestion] = useState(initial?.question || '');
  const [answer, setAnswer] = useState(initial?.answer || '');
  const [category, setCategory] = useState<Category>(initial?.category || 'general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    onSave({ question: question.trim(), answer: answer.trim(), category });
  };

  return (
    <div
      className="adm-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form className="adm-modal" onSubmit={handleSubmit}>
        <div className="adm-modal-head">
          <h2 className="adm-modal-title">{initial?._id ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <button type="button" className="adm-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-field">
            <label className="adm-label">Category</label>
            <select
              className="adm-select"
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label">Question</label>
            <input
              className="adm-input"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. How does AI automation help my business?"
              required
              autoFocus
            />
          </div>
          <div className="adm-field">
            <label className="adm-label">Answer</label>
            <textarea
              className="adm-textarea"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Write the answer here…"
              required
              rows={5}
            />
          </div>
        </div>
        <div className="adm-modal-footer">
          <button type="button" className="adm-btn adm-btn--outline" onClick={onClose}>Cancel</button>
          <button
            type="submit"
            disabled={loading || !question.trim() || !answer.trim()}
            className="adm-btn adm-btn--primary"
          >
            {loading ? 'Saving…' : initial?._id ? 'Save Changes' : 'Add FAQ'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DELETE CONFIRM MODAL
───────────────────────────────────────────── */
function DeleteModal({
  faq, onConfirm, onClose, loading,
}: {
  faq: Faq;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="adm-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="adm-modal">
        <div className="adm-modal-head">
          <h2 className="adm-modal-title">Delete FAQ</h2>
          <button className="adm-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-modal-body">
          <p className="adm-confirm-text">
            Are you sure you want to delete this FAQ? This action cannot be undone.
            <span className="adm-confirm-q">"{faq.question}"</span>
          </p>
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn adm-btn--outline" onClick={onClose}>Cancel</button>
          <button
            className="adm-btn adm-btn--primary"
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FAQ SECTION
───────────────────────────────────────────── */
function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [deleteFaq, setDeleteFaq] = useState<Faq | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/faq', { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setFaqs(data.faqs);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (body: { question: string; answer: string; category: Category }) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST', headers: authHeader(), body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setFaqs(prev => [...prev, data.faq]);
      setShowAdd(false);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = async (body: { question: string; answer: string; category: Category }) => {
    if (!editFaq) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'PUT', headers: authHeader(),
        body: JSON.stringify({ id: editFaq._id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setFaqs(prev => prev.map(f => f._id === editFaq._id ? data.faq : f));
      setEditFaq(null);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteFaq) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'DELETE', headers: authHeader(),
        body: JSON.stringify({ id: deleteFaq._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setFaqs(prev => prev.filter(f => f._id !== deleteFaq._id));
      setDeleteFaq(null);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const filtered = faqs.filter(f => {
    const matchCat = category === 'all' || f.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });



  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">FAQ Management</h1>
          <p className="adm-page-subtitle">Add, edit or remove frequently asked questions</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add FAQ
        </button>
      </div>

      {/* Stats */}
      <div className="adm-stats">
        {[
          { label: 'Total FAQs', value: faqs.length },
          ...CATEGORIES.map(c => ({ label: c.label, value: faqs.filter(f => f.category === c.value).length })),
        ].map(s => (
          <div className="adm-stat-card" key={s.label}>
            <span className="adm-stat-label">{s.label}</span>
            <span className="adm-stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      {error && <div className="adm-error-bar">{error}</div>}

      {/* Table */}
      <div className="adm-table-wrap">
        <div className="adm-table-header">
           <span className="adm-table-heading">
            {category === 'all' ? 'All FAQs' : `${CATEGORIES.find(c => c.value === category)?.label ?? category} FAQs`}
            &nbsp;({filtered.length})
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="adm-tabs">
              <button
                className={`adm-tab${category === 'all' ? ' active' : ''}`}
                onClick={() => setCategory('all')}
              >
                All
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  className={`adm-tab${category === c.value ? ' active' : ''}`}
                  onClick={() => setCategory(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="adm-search-wrap">
              <Search size={13} />
              <input
                className="adm-search-input"
                placeholder="Search FAQs…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="adm-loader">
            <div className="adm-spinner" />
            <div>Loading FAQs…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <HelpCircle size={42} />
            <p className="adm-empty-text">No FAQs found</p>
            <p className="adm-empty-sub">
              {search ? 'Try a different search term' : 'Click "Add FAQ" to create your first one'}
            </p>
          </div>
        ) : (
          <div className="adm-faq-list">
            {filtered.map((faq, i) => (
              <div className="adm-faq-item" key={faq._id}>
                <div className="adm-faq-num">{i + 1}</div>
                <div className="adm-faq-body">
                  <p className="adm-faq-question">{faq.question}</p>
                  <p className="adm-faq-answer">{faq.answer}</p>
                </div>
                <div className="adm-faq-actions">
                  <button
                    className="adm-btn adm-btn--ghost"
                    title="Edit"
                    onClick={() => setEditFaq(faq)}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="adm-btn adm-btn--danger"
                    title="Delete"
                    onClick={() => setDeleteFaq(faq)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <FaqFormModal onSave={handleAdd} onClose={() => setShowAdd(false)} loading={saving} />
      )}
      {editFaq && (
        <FaqFormModal
          initial={editFaq}
          onSave={handleEdit}
          onClose={() => setEditFaq(null)}
          loading={saving}
        />
      )}
      {deleteFaq && (
        <DeleteModal
          faq={deleteFaq}
          onConfirm={handleDelete}
          onClose={() => setDeleteFaq(null)}
          loading={saving}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN ADMIN CLIENT
═══════════════════════════════════════════════════════ */
export default function AdminClient() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const n = localStorage.getItem('userName') || '';

    setHydrated(true);

    if (!t || role !== 'admin') {
      router.replace('/');
      return;
    }

    setToken(t);
    setUserName(n);
    setAuthorized(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserName('');
    setAuthorized(false);
    router.replace('/');
  };

  if (!hydrated) return null;
  if (!authorized) return null;

  return (
    <div className="adm-root">
      {/* Header */}
      <header className="adm-header">
        <div className="adm-header-left">
          <div className="adm-header-logo">DA</div>
          <span className="adm-header-title">Disconnect Agencies</span>
          <span className="adm-header-badge">Admin</span>
        </div>
        <div className="adm-header-right">
          {userName && <span className="adm-header-user">Hi, {userName}</span>}
          <button className="adm-btn adm-btn--logout" onClick={handleLogout}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      <div className="adm-layout">
        {/* Sidebar */}
        <aside className="adm-sidebar">
          <span className="adm-sidebar-label">Content</span>
          <button className="adm-sidebar-item active">
            <HelpCircle size={15} /> FAQ
            <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />
          </button>
        </aside>

        {/* Main */}
        <main className="adm-main">
          <FaqSection />
        </main>
      </div>
    </div>
  );
}
