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
import StoreProvider from '@/store/StoreProvider';
import {
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useGetBookingSettingsQuery,
  useUpdateBookingSettingsMutation,
  useGetBookingsQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetFeedbacksQuery,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation
} from '@/store/adminApi';
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
  isFeatured?: boolean;
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
  const { data, error: queryError, isLoading } = useGetFaqsQuery();
  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaqMutation, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs: Faq[] = data?.faqs || [];
  const loading = isLoading;
  const saving = isAdding || isUpdating || isDeleting;
  const errorObj = queryError as any;
  const errorOut = errorObj?.data?.error || errorObj?.error || '';

  const [errorLocal, setErrorLocal] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [deleteFaq, setDeleteFaq] = useState<Faq | null>(null);

  const error = errorOut || errorLocal;

  const handleAdd = async (body: { question: string; answer: string; category: Category }) => {
    try {
      setErrorLocal('');
      await addFaq(body).unwrap();
      setShowAdd(false);
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to add FAQ');
    }
  };

  const handleEdit = async (body: { question: string; answer: string; category: Category }) => {
    if (!editFaq) return;
    try {
      setErrorLocal('');
      await updateFaq({ id: editFaq._id, ...body }).unwrap();
      setEditFaq(null);
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to edit FAQ');
    }
  };

  const handleDelete = async () => {
    if (!deleteFaq) return;
    try {
      setErrorLocal('');
      await deleteFaqMutation(deleteFaq._id).unwrap();
      setDeleteFaq(null);
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to delete FAQ');
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
  const { data: settingsData, isLoading: isLoadingSettings } = useGetBookingSettingsQuery();
  const { data: bookingsData, isLoading: isLoadingBookings } = useGetBookingsQuery();
  
  const [updateSettings, { isLoading: isSavingSettings }] = useUpdateBookingSettingsMutation();
  const [updateBookingMutation, { isLoading: isUpdatingBooking }] = useUpdateBookingMutation();
  const [deleteBookingMutation, { isLoading: isDeletingBooking }] = useDeleteBookingMutation();

  const settings: BookingSettings = settingsData?.settings || { meetingLink: '', adminEmails: [] };
  const bookings: BookingRecord[] = bookingsData?.bookings || [];

  const [draftLink, setDraftLink] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [bookingBusyId, setBookingBusyId] = useState<string | null>(null);
  const [remarksDraft, setRemarksDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  // Sync draft strings when data loads
  useEffect(() => {
    if (settingsData?.settings) {
      setDraftLink(settingsData.settings.meetingLink || '');
    }
  }, [settingsData]);

  useEffect(() => {
    if (bookingsData?.bookings) {
      const initialRemarks: Record<string, string> = {};
      bookingsData.bookings.forEach((booking: BookingRecord) => {
        initialRemarks[booking._id] = booking.adminRemark || '';
      });
      setRemarksDraft(initialRemarks);
    }
  }, [bookingsData]);

  const loading = isLoadingSettings || isLoadingBookings;
  const saving = isSavingSettings || isUpdatingBooking || isDeletingBooking;

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
    // We update via local state mutation then sync to API
    saveSettingsLocally({ ...settings, adminEmails: [...settings.adminEmails, safe] });
    setDraftEmail('');
  };

  const removeAdminEmail = (email: string) => {
    saveSettingsLocally({ ...settings, adminEmails: settings.adminEmails.filter((value) => value !== email) });
  };

  const saveSettingsLocally = async (newSettings: BookingSettings) => {
    setError('');
    setOk('');
    try {
      await updateSettings(newSettings).unwrap();
      setOk('Booking settings saved successfully.');
    } catch (err: any) {
      setError(err?.data?.error || err.message || 'Failed to save settings');
    }
  };

  const saveSettings = async () => {
    saveSettingsLocally({
      meetingLink: draftLink,
      adminEmails: settings.adminEmails,
    });
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
      await updateBookingMutation({ id, ...payload }).unwrap();
      setOk(successMessage);
    } catch (err: any) {
      setError(err?.data?.error || err.message || 'Failed to update booking');
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
      await deleteBookingMutation(id).unwrap();
      setOk('Booking deleted.');
    } catch (err: any) {
      setError(err?.data?.error || err.message || 'Failed to delete booking');
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
  const { data: usersData, isLoading: loading, error: queryError } = useGetUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users: UserRecord[] = usersData?.users || [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorLocal, setErrorLocal] = useState('');
  const [search, setSearch] = useState('');

  const errorObj = queryError as any;
  const errorOut = errorObj?.data?.error || errorObj?.error || '';
  const error = errorOut || errorLocal;

  const toggleVerify = async (id: string, current: boolean) => {
    setBusyId(id);
    setErrorLocal('');
    try {
      await updateUser({ id, isVerified: !current }).unwrap();
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to toggle verification');
    } finally {
      setBusyId(null);
    }
  };

  const toggleSuspend = async (id: string, current: boolean) => {
    setBusyId(id);
    setErrorLocal('');
    try {
      await updateUser({ id, isSuspended: !current }).unwrap();
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to toggle suspension');
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setBusyId(id);
    setErrorLocal('');
    try {
      await deleteUserMutation(id).unwrap();
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to delete user');
    } finally {
      setBusyId(null);
    }
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
  const { data: feedbackData, isLoading: loading, error: queryError } = useGetFeedbacksQuery();
  const [updateFeedback, { isLoading: isUpdating }] = useUpdateFeedbackMutation();
  const [deleteFeedbackMutation, { isLoading: isDeleting }] = useDeleteFeedbackMutation();

  const feedbacks: FeedbackRecord[] = feedbackData?.feedbacks || [];
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorLocal, setErrorLocal] = useState('');
  const [okLocal, setOkLocal] = useState('');

  const errorObj = queryError as any;
  const errorOut = errorObj?.data?.error || errorObj?.error || '';
  const error = errorOut || errorLocal;
  const ok = okLocal;

  const toggleTestimonial = async (id: string, currentStatus: boolean, newCategory?: string) => {
    setSavingId(id);
    setErrorLocal('');
    setOkLocal('');

    try {
      const payload: any = { id, isFeatured: !currentStatus };
      if (newCategory) payload.category = newCategory;

      await updateFeedback(payload).unwrap();
      setOkLocal('Feedback updated successfully.');
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to update feedback');
    } finally {
      setSavingId(null);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    setSavingId(id);
    setErrorLocal('');
    setOkLocal('');

    try {
      await deleteFeedbackMutation(id).unwrap();
      setOkLocal('Feedback deleted successfully.');
    } catch (err: any) {
      setErrorLocal(err?.data?.error || err.message || 'Failed to delete feedback');
    } finally {
      setSavingId(null);
    }
  };

  const updateCategoryInstantly = async (id: string, isFeatured: boolean | undefined, newCategory: string) => {
      // Fire-and-forget background update by RTK query (cache gets naturally invalidated and repopulated)
      updateFeedback({ id, isFeatured: !!isFeatured, category: newCategory }).catch(console.error);
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
                        updateCategoryInstantly(f._id, f.isFeatured, newCat);
                      }}
                    >
                      <option value="General">General</option>
                      <option value="Home">Home</option>
                      <option value="Cloud">Cloud</option>
                      <option value="WebDev">WebDev</option>
                      <option value="AppDev">AppDev</option>
                      <option value="SEO">SEO</option>
                      <option value="AI">AI</option>
                    </select>
                  </div>
                </div>
                <div className="adm-faq-actions" style={{ flexDirection: 'column', gap: '8px' }}>
                  <button 
                    className="adm-btn adm-btn--outline" 
                    onClick={() => toggleTestimonial(f._id, f.isFeatured || false, f.category)}
                    disabled={savingId === f._id}
                    title={f.isFeatured ? "Remove from Testimonials" : "Feature as Testimonial"}
                    style={{ 
                      borderColor: f.isFeatured ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.2)",
                      color: f.isFeatured ? "#86efac" : "inherit"
                    }}
                  >
                    {savingId === f._id ? (
                      <div className="adm-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                    ) : f.isFeatured ? (
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
    <StoreProvider>
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
    </StoreProvider>
  );
}
