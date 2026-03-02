'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  LogOut,
  HelpCircle,
  ChevronRight,
  CalendarClock,
  Save,
  Link2,
  MailPlus,
  Check,
  Circle,
  CheckCircle2,
  User,
} from 'lucide-react';
import './Admin.css';

/* ── Types ── */
type Category = 'general' | 'cloud' | 'uiux' | 'webdev' | 'appdev' | 'aimodels' | 'seo';
type AdminSection = 'faq' | 'bookings' | 'users';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'cloud', label: 'Cloud / Agency' },
  { value: 'uiux', label: 'UI/UX' },
  { value: 'webdev', label: 'Web Dev' },
  { value: 'appdev', label: 'App Dev' },
  { value: 'aimodels', label: 'AI Models' },
  { value: 'seo', label: 'SEO' },
];

interface FeedbackRecord {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    isVerified?: boolean;
  };
  content: string;
  isTestimonial: boolean;
  category?: Category | string;
  rating?: number;
  createdAt: string;
}

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
}

interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: Category;
  order: number;
}

interface BookingSettings {
  meetingLink: string;
  adminEmails: string[];
}

interface BookingRecord {
  _id: string;
  name: string;
  email: string;
  category: string;
  serviceTitle: string;
  dateIso: string;
  dateLabel: string;
  time: string;
  notes: string;
  meetingLink: string;
  adminRemark?: string;
  status?: 'pending' | 'completed';
  createdAt: string;
}

/* ── Helper: auth headers ── */
function authHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' };
}

/* ─────────────────────────────────────────────
   FAQ FORM MODAL
───────────────────────────────────────────── */
function FaqFormModal({
  initial,
  onSave,
  onClose,
  loading,
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
    <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="adm-modal" onSubmit={handleSubmit}>
        <div className="adm-modal-head">
          <h2 className="adm-modal-title">{initial?._id ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <button type="button" className="adm-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-field">
            <label className="adm-label">Category</label>
            <select className="adm-select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label">Question</label>
            <input
              className="adm-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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
              onChange={(e) => setAnswer(e.target.value)}
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
  faq,
  onConfirm,
  onClose,
  loading,
}: {
  faq: Faq;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
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
function FaqSection({ category }: { category: 'all' | Category }) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [deleteFaq, setDeleteFaq] = useState<Faq | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/faq', { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setFaqs(data.faqs);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
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
      setFaqs((prev) => [...prev, data.faq]);
      setShowAdd(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to add FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (body: { question: string; answer: string; category: Category }) => {
    if (!editFaq) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'PUT', headers: authHeader(), body: JSON.stringify({ id: editFaq._id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setFaqs((prev) => prev.map((f) => (f._id === editFaq._id ? data.faq : f)));
      setEditFaq(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to edit FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteFaq) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'DELETE', headers: authHeader(), body: JSON.stringify({ id: deleteFaq._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setFaqs((prev) => prev.filter((f) => f._id !== deleteFaq._id));
      setDeleteFaq(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to delete FAQ');
    } finally {
      setSaving(false);
    }
  };

  const filtered = faqs.filter((f) => {
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

      <div className="adm-stats">
        {[
          { label: 'Total FAQs', value: faqs.length },
          ...CATEGORIES.map((c) => ({ label: c.label, value: faqs.filter((f) => f.category === c.value).length })),
        ].map((s) => (
          <div className="adm-stat-card" key={s.label}>
            <span className="adm-stat-label">{s.label}</span>
            <span className="adm-stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      {error && <div className="adm-error-bar">{error}</div>}

      <div className="adm-table-wrap">
        <div className="adm-table-header">
          <span className="adm-table-heading">
            {category === 'all' ? 'All FAQs' : `${CATEGORIES.find((c) => c.value === category)?.label ?? category} FAQs`}
            &nbsp;({filtered.length})
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="adm-search-wrap">
              <Search size={13} />
              <input
                className="adm-search-input"
                placeholder="Search FAQs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  <button className="adm-btn adm-btn--ghost" title="Edit" onClick={() => setEditFaq(faq)}>
                    <Pencil size={14} />
                  </button>
                  <button className="adm-btn adm-btn--danger" title="Delete" onClick={() => setDeleteFaq(faq)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <FaqFormModal onSave={handleAdd} onClose={() => setShowAdd(false)} loading={saving} />}
      {editFaq && (
        <FaqFormModal
          initial={editFaq}
          onSave={handleEdit}
          onClose={() => setEditFaq(null)}
          loading={saving}
        />
      )}
      {deleteFaq && (
        <DeleteModal faq={deleteFaq} onConfirm={handleDelete} onClose={() => setDeleteFaq(null)} loading={saving} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOOKING ADMIN SECTION
───────────────────────────────────────────── */
function BookingAdminSection() {
  const [settings, setSettings] = useState<BookingSettings>({ meetingLink: '', adminEmails: [] });
  const [draftLink, setDraftLink] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bookingBusyId, setBookingBusyId] = useState<string | null>(null);
  const [remarksDraft, setRemarksDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setOk('');

    try {
      const [settingsRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/booking-settings', { headers: authHeader() }),
        fetch('/api/admin/bookings', { headers: authHeader() }),
      ]);

      const settingsData = await settingsRes.json();
      const bookingsData = await bookingsRes.json();

      if (!settingsRes.ok) throw new Error(settingsData.error || 'Failed to load booking settings');
      if (!bookingsRes.ok) throw new Error(bookingsData.error || 'Failed to load bookings');

      setSettings(settingsData.settings);
      setDraftLink(settingsData.settings.meetingLink || '');
      const safeBookings = (bookingsData.bookings || []) as BookingRecord[];
      setBookings(safeBookings);
      const initialRemarks: Record<string, string> = {};
      safeBookings.forEach((booking) => {
        initialRemarks[booking._id] = booking.adminRemark || '';
      });
      setRemarksDraft(initialRemarks);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to load booking section');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addAdminEmail = () => {
    const safe = draftEmail.trim().toLowerCase();
    if (!safe) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe)) {
      setError('Enter a valid admin email');
      return;
    }
    if (settings.adminEmails.includes(safe)) {
      setError('Email already added');
      return;
    }

    setError('');
    setSettings((prev) => ({ ...prev, adminEmails: [...prev.adminEmails, safe] }));
    setDraftEmail('');
  };

  const removeAdminEmail = (email: string) => {
    setSettings((prev) => ({
      ...prev,
      adminEmails: prev.adminEmails.filter((value) => value !== email),
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setOk('');

    try {
      const res = await fetch('/api/admin/booking-settings', {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({
          meetingLink: draftLink,
          adminEmails: settings.adminEmails,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setSettings(data.settings);
      setDraftLink(data.settings.meetingLink || '');
      setOk('Booking settings saved successfully.');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateBooking = async (
    id: string,
    payload: { adminRemark?: string; status?: 'pending' | 'completed' },
    successMessage: string
  ) => {
    setBookingBusyId(id);
    setError('');
    setOk('');

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ id, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update booking');

      setBookings((prev) => prev.map((b) => (b._id === id ? data.booking : b)));
      setOk(successMessage);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to update booking');
    } finally {
      setBookingBusyId(null);
    }
  };

  const saveRemark = (booking: BookingRecord) => {
    const remark = remarksDraft[booking._id] || '';
    updateBooking(booking._id, { adminRemark: remark }, 'Remark updated successfully.');
  };

  const markCompleted = (booking: BookingRecord) => {
    updateBooking(
      booking._id,
      { status: booking.status === 'completed' ? 'pending' : 'completed' },
      booking.status === 'completed' ? 'Booking marked as pending.' : 'Booking marked as completed.'
    );
  };

  const deleteBooking = async (id: string) => {
    setBookingBusyId(id);
    setError('');
    setOk('');
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'DELETE',
        headers: authHeader(),
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete booking');

      setBookings((prev) => prev.filter((b) => b._id !== id));
      setOk('Booking deleted.');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to delete booking');
    } finally {
      setBookingBusyId(null);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Booking Management</h1>
          <p className="adm-page-subtitle">Manage meeting link, admin notifications, and scheduled calls</p>
        </div>
      </div>

      {error && <div className="adm-error-bar">{error}</div>}
      {ok && <div className="adm-ok-bar">{ok}</div>}

      <div className="adm-booking-grid">
        <section className="adm-settings-card">
          <h2 className="adm-table-heading">Scheduler Settings</h2>

          <div className="adm-field" style={{ marginTop: '14px' }}>
            <label className="adm-label">Meeting Link</label>
            <div className="adm-inline-input">
              <Link2 size={14} />
              <input
                className="adm-search-input"
                value={draftLink}
                onChange={(e) => setDraftLink(e.target.value)}
                placeholder="https://meet.google.com/your-room"
              />
            </div>
          </div>

          <div className="adm-field" style={{ marginTop: '14px' }}>
            <label className="adm-label">Admin Notification Emails</label>
            <div className="adm-email-row">
              <input
                className="adm-input"
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                placeholder="admin@example.com"
              />
              <button className="adm-btn adm-btn--outline" onClick={addAdminEmail} type="button">
                <MailPlus size={14} /> Add
              </button>
            </div>
            <div className="adm-chip-row">
              {settings.adminEmails.map((email) => (
                <span key={email} className="adm-chip">
                  {email}
                  <button type="button" onClick={() => removeAdminEmail(email)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button className="adm-btn adm-btn--primary" onClick={saveSettings} disabled={saving || loading}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </section>

        <section className="adm-settings-card">
          <h2 className="adm-table-heading">Recent Scheduled Calls ({bookings.length})</h2>

          {loading ? (
            <div className="adm-loader" style={{ padding: '24px 0 6px' }}>
              <div className="adm-spinner" />
              <div>Loading bookings…</div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="adm-empty" style={{ padding: '26px 12px' }}>
              <CalendarClock size={34} />
              <p className="adm-empty-text">No bookings yet</p>
            </div>
          ) : (
            <div className="adm-booking-list">
              {bookings.map((booking) => (
                <article key={booking._id} className="adm-booking-item">
                  <div className="adm-booking-head">
                    <strong>{booking.name}</strong>
                    <span>{new Date(booking.createdAt).toLocaleString('en-US')}</span>
                  </div>
                  <div className={`adm-status-pill ${booking.status === 'completed' ? 'done' : 'pending'}`}>
                    {booking.status === 'completed' ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    {booking.status === 'completed' ? 'Completed' : 'Pending'}
                  </div>
                  <p><b>Email:</b> {booking.email}</p>
                  <p><b>Service:</b> {booking.serviceTitle}</p>
                  <p><b>Schedule:</b> {booking.dateLabel} • {booking.time}</p>
                  <p><b>Meeting Link:</b> {booking.meetingLink}</p>
                  {booking.notes ? <p><b>Notes:</b> {booking.notes}</p> : null}
                  <div className="adm-booking-remark">
                    <label className="adm-label">Admin Remark</label>
                    <textarea
                      className="adm-textarea"
                      rows={3}
                      value={remarksDraft[booking._id] || ''}
                      onChange={(e) =>
                        setRemarksDraft((prev) => ({ ...prev, [booking._id]: e.target.value }))
                      }
                      placeholder="Add remarks..."
                    />
                  </div>
                  <div className="adm-booking-actions">
                    <button
                      type="button"
                      className="adm-btn adm-btn--outline"
                      onClick={() => saveRemark(booking)}
                      disabled={bookingBusyId === booking._id}
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn--primary"
                      onClick={() => markCompleted(booking)}
                      disabled={bookingBusyId === booking._id}
                    >
                      {booking.status === 'completed' ? <Circle size={13} /> : <Check size={13} />}
                      {booking.status === 'completed' ? 'Reopen' : 'Completed'}
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn--danger"
                      onClick={() => deleteBooking(booking._id)}
                      disabled={bookingBusyId === booking._id}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   USER ADMIN SECTION
   (SUSPEND, VERIFY, DELETE)
───────────────────────────────────────────── */
function UserAdminSection() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      console.log('Admin Panel - Loaded users:', data.users);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleVerify = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({ id, isVerified: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
    } catch (err: any) { alert(err.message); }
    finally { setBusyId(null); }
  };

  const toggleSuspend = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({ id, isSuspended: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
    } catch (err: any) { alert(err.message); }
    finally { setBusyId(null); }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setBusyId(id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: authHeader(),
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err: any) { alert(err.message); }
    finally { setBusyId(null); }
  };

  const filtered = users.filter(u => 
    (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">User Management</h1>
          <p className="adm-page-subtitle">Verify, suspend or delete application users</p>
        </div>
      </div>

      <div className="adm-search-wrap" style={{ maxWidth: '400px', marginBottom: '20px' }}>
        <Search size={13} />
        <input 
          className="adm-search-input" 
          placeholder="Search by name or email…" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="adm-error-bar">{error}</div>}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan={4}><div className="adm-loader">Loading...</div></td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={4}><div className="adm-empty">No users found</div></td></tr>
            ) : filtered.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {u.avatar ? (
                      <img src={u.avatar} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.name[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {u.name}
                        {u.isVerified && <CheckCircle2 size={12} fill="#3b82f6" color="#fff" />}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>{u.role}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{u.email}</div>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>{u.phone}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {u.isSuspended && <span className="adm-status-pill pending" style={{ color: '#ef4444' }}>Suspended</span>}
                    {u.isVerified && <span className="adm-status-pill done">Verified</span>}
                    {!u.isVerified && !u.isSuspended && <span className="adm-status-pill" style={{ opacity: 0.4 }}>Active</span>}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="adm-btn adm-btn--outline" onClick={() => toggleVerify(u._id, u.isVerified)} disabled={busyId === u._id} title="Toggle Verification">
                       {u.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button className="adm-btn adm-btn--outline" onClick={() => toggleSuspend(u._id, u.isSuspended)} disabled={busyId === u._id} title="Toggle Suspension">
                       {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button className="adm-btn adm-btn--danger" onClick={() => deleteUser(u._id)} disabled={busyId === u._id}>
                       <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEEDBACK ADMIN SECTION
───────────────────────────────────────────── */
function FeedbackAdminSection() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/feedback', { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load feedbacks');
      setFeedbacks(data.feedbacks || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleTestimonial = async (id: string, currentStatus: boolean, newCategory?: string) => {
    setSavingId(id);
    setError('');
    setOk('');

    try {
      const payload: any = { id, isTestimonial: !currentStatus };
      if (newCategory) payload.category = newCategory;

      const res = await fetch('/api/admin/feedback', {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update feedback');
      
      setFeedbacks((prev) => prev.map((f) => (f._id === id ? data.feedback : f)));
      setOk('Feedback updated successfully.');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to update feedback');
    } finally {
      setSavingId(null);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    setSavingId(id);
    setError('');
    setOk('');

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'DELETE',
        headers: authHeader(),
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete feedback');
      
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      setOk('Feedback deleted successfully.');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to delete feedback');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Feedback & Testimonials</h1>
          <p className="adm-page-subtitle">Manage user feedback and feature them as testimonials</p>
        </div>
      </div>

      {error && <div className="adm-error-bar">{error}</div>}
      {ok && <div className="adm-ok-bar">{ok}</div>}

      <div className="adm-table-wrap" style={{ marginTop: '24px' }}>
        <div className="adm-table-header">
          <span className="adm-table-heading">All Feedbacks ({feedbacks.length})</span>
        </div>

        {loading ? (
          <div className="adm-loader">
            <div className="adm-spinner" />
            <div>Loading feedbacks…</div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="adm-empty">
            <HelpCircle size={42} />
            <p className="adm-empty-text">No feedbacks found</p>
          </div>
        ) : (
          <div className="adm-faq-list">
            {feedbacks.map((f, i) => (
              <div className="adm-faq-item" key={f._id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: '4px' }}>
                   {f.user?.avatar ? (
                     <img src={f.user.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                   ) : (
                     <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                       {f.user?.name ? f.user.name.charAt(0).toUpperCase() : '?'}
                     </div>
                   )}
                </div>
                <div className="adm-faq-body" style={{ flex: 1 }}>
                  <p className="adm-faq-question" style={{ marginBottom: '4px' }}>
                    {f.user?.name || 'Unknown User'} 
                    {f.user?.isVerified && <CheckCircle2 size={12} fill="#3b82f6" color="#fff" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} />}
                    <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>
                      ({f.user?.email || 'No email'}) • {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="adm-faq-answer" style={{ color: "rgba(255,255,255,0.85)" }}>{f.content}</p>
                  
                  {/* Category Selection Dropdown */}
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Category:</span>
                    <select 
                      className="adm-select" 
                      style={{ padding: '4px 8px', fontSize: '13px', width: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      value={f.category || 'General'}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        // Optimistically update local state & submit API req to persist new category quietly without changing testimonial state
                        setFeedbacks(prev => prev.map(item => item._id === f._id ? { ...item, category: newCat } : item));
                        
                        // Fire-and-forget background update
                        fetch('/api/admin/feedback', {
                          method: 'PUT',
                          headers: authHeader(),
                          body: JSON.stringify({ id: f._id, isTestimonial: f.isTestimonial, category: newCat }),
                        }).catch(console.error);
                      }}
                    >
                      <option value="General">General</option>
                      <option value="Home">Home</option>
                      <option value="Cloud">Cloud</option>
                      <option value="WebDev">WebDev</option>
                      <option value="SEO">SEO</option>
                      <option value="AI">AI</option>
                    </select>
                  </div>
                </div>
                <div className="adm-faq-actions" style={{ flexDirection: 'column', gap: '8px' }}>
                  <button 
                    className="adm-btn adm-btn--outline" 
                    onClick={() => toggleTestimonial(f._id, f.isTestimonial, f.category)}
                    disabled={savingId === f._id}
                    title={f.isTestimonial ? "Remove from Testimonials" : "Feature as Testimonial"}
                    style={{ 
                      borderColor: f.isTestimonial ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.2)",
                      color: f.isTestimonial ? "#86efac" : "inherit"
                    }}
                  >
                    {savingId === f._id ? (
                      <div className="adm-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                    ) : f.isTestimonial ? (
                      <><CheckCircle2 size={13} /> Featured</>
                    ) : (
                      <><Circle size={13} /> Feature</>
                    )}
                  </button>
                  <button 
                    className="adm-btn adm-btn--danger" 
                    onClick={() => deleteFeedback(f._id)}
                    disabled={savingId === f._id}
                    title="Delete Feedback"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN ADMIN CLIENT
═══════════════════════════════════════════════════════ */
export default function AdminClient() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');
  const [section, setSection] = useState<AdminSection | 'feedback'>('faq');
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

    setUserName(n);
    setAuthorized(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setUserName('');
    setAuthorized(false);
    router.replace('/');
  };

  if (!hydrated) return null;
  if (!authorized) return null;

  return (
    <div className="adm-root">
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
        <aside className="adm-sidebar">
          <span className="adm-sidebar-label">Content</span>

          <div className="adm-sidebar-group">
            <button
              className={`adm-sidebar-item ${section === 'faq' && category === 'all' ? 'active' : ''}`}
              onClick={() => {
                setSection('faq');
                setCategory('all');
              }}
            >
              <HelpCircle size={15} /> All FAQs
              {section === 'faq' && category === 'all' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>

            <button
              className={`adm-sidebar-item ${section === 'bookings' ? 'active' : ''}`}
              onClick={() => setSection('bookings')}
            >
              <CalendarClock size={15} /> Bookings
              {section === 'bookings' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>

            <button
              className={`adm-sidebar-item ${section === 'feedback' ? 'active' : ''}`}
              onClick={() => setSection('feedback')}
            >
              <HelpCircle size={15} /> Feedback
              {section === 'feedback' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>

            <button
              className={`adm-sidebar-item ${section === 'users' ? 'active' : ''}`}
              onClick={() => setSection('users')}
            >
              <User size={15} /> Users
              {section === 'users' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>

            <div className="adm-sidebar-group-title">Categories</div>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                className={`adm-sidebar-subitem ${section === 'faq' && category === c.value ? 'active' : ''}`}
                onClick={() => {
                  setSection('faq');
                  setCategory(c.value);
                }}
              >
                {c.label}
                {section === 'faq' && category === c.value && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </button>
            ))}
          </div>
        </aside>

        <main className="adm-main">
          {section === 'faq' && <FaqSection category={category} />}
          {section === 'bookings' && <BookingAdminSection />}
          {section === 'feedback' && <FeedbackAdminSection />}
          {section === 'users' && <UserAdminSection />}
        </main>
      </div>
    </div>
  );
}
