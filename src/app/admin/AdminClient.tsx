'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Settings,
  Video,
  Briefcase,
  FileText,
} from 'lucide-react';

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
  useDeleteFeedbackMutation,
  useGetCareerApplicationsQuery,
  useUpdateCareerApplicationMutation,
  useDeleteCareerApplicationMutation,
  useCreateBlogMutation,
} from '@/store/adminApi';
import './Admin.css';

/* ── Types ── */
type Category = 'general' | 'cloud' | 'uiux' | 'webdev' | 'appdev' | 'aimodels' | 'seo';
type AdminSection = 'faq' | 'bookings' | 'users' | 'settings' | 'careers' | 'blog';

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
  } | string;
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
  category: Category | string;
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

interface CareerApplicationRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  resumeUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

/* ── Helper: auth headers ── */


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
  onSave: (data: { question: string; answer: string; category: Category | string }) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [question, setQuestion] = useState(initial?.question || '');
  const [answer, setAnswer] = useState(initial?.answer || '');
  const [category, setCategory] = useState<Category | string>(initial?.category || 'general');

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

/* ─────────────────────────────────────────────
   FAQ SECTION
───────────────────────────────────────────── */
function FaqSection({ category }: { category: 'all' | Category }) {
  const { data, error: queryError, isLoading } = useGetFaqsQuery();
  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaqMutation, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs: Faq[] = (data?.faqs as unknown as Faq[]) || [];
  const loading = isLoading;
  const saving = isAdding || isUpdating || isDeleting;
  const errorObj = queryError as { data?: { error?: string }; error?: string };
  const errorOut = errorObj?.data?.error || errorObj?.error || '';

  const [errorLocal, setErrorLocal] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);

  const error = errorOut || errorLocal;

  const handleAdd = async (body: { question: string; answer: string; category: Category | string }) => {
    try {
      setErrorLocal('');
      await addFaq(body).unwrap();
      setShowAdd(false);
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to add FAQ';
      setErrorLocal(errorMsg);
    }
  };

  const handleEdit = async (body: { question: string; answer: string; category: Category | string }) => {
    if (!editFaq) return;
    try {
      setErrorLocal('');
      await updateFaq({ id: editFaq._id, ...body }).unwrap();
      setEditFaq(null);
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to edit FAQ';
      setErrorLocal(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setErrorLocal('');
      await deleteFaqMutation(id).unwrap();
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to delete FAQ';
      setErrorLocal(errorMsg);
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
          <span className="adm-page-title">FAQ Management</span>
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
                  <button className="adm-btn adm-btn--danger" title="Delete" onClick={() => handleDelete(faq._id)}>
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
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMsg);
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
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to update booking';
      setError(errorMsg);
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
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to delete booking';
      setError(errorMsg);
    } finally {
      setBookingBusyId(null);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <span className="adm-page-title">Booking Management</span>
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
  const [updateUser] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();

  const users: UserRecord[] = usersData?.users || [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorLocal, setErrorLocal] = useState('');
  const [search, setSearch] = useState('');

  const errorObj = queryError as { data?: { error?: string }; error?: string };
  const errorOut = errorObj?.data?.error || errorObj?.error || '';
  const error = errorOut || errorLocal;

  const toggleVerify = async (id: string, current: boolean) => {
    setBusyId(id);
    setErrorLocal('');
    try {
      await updateUser({ id, isVerified: !current }).unwrap();
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to toggle verification';
      setErrorLocal(errorMsg);
    } finally {
      setBusyId(null);
    }
  };

  const toggleSuspend = async (id: string, current: boolean) => {
    setBusyId(id);
    setErrorLocal('');
    try {
      await updateUser({ id, isSuspended: !current }).unwrap();
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to toggle suspension';
      setErrorLocal(errorMsg);
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (id: string) => {
    setBusyId(id);
    setErrorLocal('');
    try {
      await deleteUserMutation(id).unwrap();
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to delete user';
      setErrorLocal(errorMsg);
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
          <span className="adm-page-title">User Management</span>
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
                      <Image src={u.avatar} alt={u.name} width={32} height={32} style={{ borderRadius: '50%' }} />
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
  const [updateFeedback] = useUpdateFeedbackMutation();
  const [deleteFeedbackMutation] = useDeleteFeedbackMutation();

  const feedbacks: FeedbackRecord[] = (feedbackData?.feedbacks as unknown as FeedbackRecord[]) || [];
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorLocal, setErrorLocal] = useState('');
  const [okLocal, setOkLocal] = useState('');

  const errorObj = queryError as { data?: { error?: string }; error?: string };
  const errorOut = errorObj?.data?.error || errorObj?.error || '';
  const error = errorOut || errorLocal;
  const ok = okLocal;

  const toggleTestimonial = async (id: string, currentFeatured: boolean, isTestimonial: boolean | undefined, category?: string) => {
    setSavingId(id);
    setErrorLocal('');
    setOkLocal('');

    try {
      // Logic: If we are turning on "Featured", we MUST also turn on "isTestimonial" (approval).
      // If we are turning off "Featured", we keep it as a "Testimonial" (approved) unless we want to unapprove it too.
      // However, usually "Feature" in this UI means "Make it show up".
      // Let's make it so toggling Featured to true also sets isTestimonial to true.
      const newStatus = !currentFeatured;
      const payload: { id: string; isFeatured: boolean; isTestimonial: boolean; category?: string } = { 
        id, 
        isFeatured: newStatus,
        isTestimonial: newStatus ? true : (isTestimonial ?? false) // If featuring, definitely make it a testimonial.
      };
      if (category) payload.category = category;

      await updateFeedback(payload).unwrap();
      setOkLocal('Feedback updated successfully.');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to update feedback';
      setErrorLocal(errorMsg);
    } finally {
      setSavingId(null);
    }
  };

  const deleteFeedback = async (id: string) => {
    setSavingId(id);
    setErrorLocal('');
    setOkLocal('');

    try {
      await deleteFeedbackMutation(id).unwrap();
      setOkLocal('Feedback deleted successfully.');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to delete feedback';
      setErrorLocal(errorMsg);
    } finally {
      setSavingId(null);
    }
  };

  const updateCategoryInstantly = async (id: string, isFeatured: boolean | undefined, isTestimonial: boolean | undefined, newCategory: string) => {
      // Fire-and-forget background update by RTK query (cache gets naturally invalidated and repopulated)
      updateFeedback({ id, isFeatured: !!isFeatured, isTestimonial: !!isTestimonial, category: newCategory }).catch(console.error);
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <span className="adm-page-title">Feedback & Testimonials</span>
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
            {feedbacks.map((f) => {
              const userObj = typeof f.user === 'object' ? f.user : null;
              return (
                <div className="adm-faq-item" key={f._id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, marginTop: '4px' }}>
                    {userObj?.avatar ? (
                      <Image src={userObj.avatar} alt={userObj.name || 'Avatar'} width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {userObj?.name ? userObj.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div className="adm-faq-body" style={{ flex: 1 }}>
                    <p className="adm-faq-question" style={{ marginBottom: '4px' }}>
                      {userObj?.name || 'Unknown User'} 
                      {userObj?.isVerified && <CheckCircle2 size={12} fill="#3b82f6" color="#fff" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} />}
                      <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>
                        ({userObj?.email || 'No email'}) • {new Date(f.createdAt).toLocaleDateString()}
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
                          updateCategoryInstantly(f._id, f.isFeatured, f.isTestimonial, newCat);
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
                      onClick={() => toggleTestimonial(f._id, f.isFeatured || false, f.isTestimonial, f.category)}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAREERS ADMIN SECTION
───────────────────────────────────────────── */
function CareersAdminSection() {
  const { data: careerData, isLoading: loading, error: queryError } = useGetCareerApplicationsQuery();
  const [updateStatus] = useUpdateCareerApplicationMutation();
  const [deleteApplication] = useDeleteCareerApplicationMutation();

  const applications: CareerApplicationRecord[] = careerData?.applications || [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorLocal, setErrorLocal] = useState('');
  const [okLocal, setOkLocal] = useState('');
  const [search, setSearch] = useState('');

  const errorObj = queryError as { data?: { error?: string }; error?: string };
  const errorOut = errorObj?.data?.error || errorObj?.error || '';
  const error = errorOut || errorLocal;

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    setBusyId(id);
    setErrorLocal('');
    setOkLocal('');
    try {
      await updateStatus({ id, status }).unwrap();
      setOkLocal(`Application marked as ${status}`);
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to update status';
      setErrorLocal(errorMsg);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setErrorLocal('');
    setOkLocal('');
    try {
      await deleteApplication(id).unwrap();
      setOkLocal('Application deleted successfully');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'data' in err 
        ? (err as { data: { error: string } }).data.error 
        : err instanceof Error ? err.message : 'Failed to delete application';
      setErrorLocal(errorMsg);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = applications.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) || 
    app.role.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <span className="adm-page-title">Career Applications</span>
          <p className="adm-page-subtitle">Review job applications, download resumes, and manage hiring status</p>
        </div>
      </div>

      <div className="adm-search-wrap" style={{ maxWidth: '400px', marginBottom: '20px' }}>
        <Search size={13} />
        <input 
          className="adm-search-input" 
          placeholder="Search by name, role, or email…" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="adm-error-bar">{error}</div>}
      {okLocal && <div className="adm-ok-bar">{okLocal}</div>}

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loader">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">No applications found</div>
        ) : (
          <div className="adm-booking-list">
            {filtered.map((app) => (
              <article key={app._id} className="adm-booking-item" style={{ borderLeft: `4px solid ${app.status === 'accepted' ? '#22c55e' : app.status === 'rejected' ? '#ef4444' : '#f59e0b'}` }}>
                <div className="adm-booking-head">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '16px' }}>{app.name}</strong>
                    <span style={{ fontSize: '13px', opacity: 0.6 }}>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`adm-status-pill ${app.status === 'accepted' ? 'done' : app.status === 'rejected' ? 'danger' : 'pending'}`} 
                       style={{ 
                         background: app.status === 'accepted' ? 'rgba(34,197,94,0.1)' : app.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                         color: app.status === 'accepted' ? '#22c55e' : app.status === 'rejected' ? '#ef4444' : '#f59e0b'
                       }}>
                    {app.status === 'accepted' ? <CheckCircle2 size={12} /> : app.status === 'rejected' ? <X size={12} /> : <Circle size={12} />}
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                  <p><b>Role:</b> {app.role}</p>
                  <p><b>Email:</b> {app.email}</p>
                  <p><b>Phone:</b> {app.phone}</p>
                  <p>
                    <b>Resume:</b> 
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FF5C00', textDecoration: 'underline', marginLeft: '6px' }}>
                      Download PDF
                    </a>
                  </p>
                </div>
                
                <div className="adm-booking-remark" style={{ marginTop: '12px' }}>
                  <label className="adm-label">Cover Message</label>
                  <p style={{ fontSize: '14px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', lineHeight: 1.5 }}>
                    {app.message}
                  </p>
                </div>

                <div className="adm-booking-actions" style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className="adm-btn adm-btn--outline"
                    onClick={() => handleUpdateStatus(app._id, 'accepted')}
                    disabled={busyId === app._id || app.status === 'accepted'}
                    style={{ color: '#22c55e' }}
                  >
                    <CheckCircle2 size={13} /> Accept
                  </button>
                  <button
                    type="button"
                    className="adm-btn adm-btn--outline"
                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                    disabled={busyId === app._id || app.status === 'rejected'}
                    style={{ color: '#ef4444' }}
                  >
                    <X size={13} /> Reject
                  </button>
                  <button
                    type="button"
                    className="adm-btn adm-btn--danger"
                    onClick={() => handleDelete(app._id)}
                    disabled={busyId === app._id}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GOOGLE CALENDAR CONNECT SECTION
───────────────────────────────────────────── */
function GoogleCalendarSection() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/auth/google/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.connected) {
          setStatus('connected');
          setEmail(data.email || '');
        } else {
          setStatus('disconnected');
        }
      })
      .catch(() => setStatus('disconnected'));
  }, []);

  const handleConnect = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as admin.');
      return;
    }
    // Pass JWT as a query param — window.location.href can't send headers,
    // so the connect route reads the token from ?token= instead.
    setNotice('Redirecting to Google…');
    window.location.href = `/api/auth/google/connect?token=${encodeURIComponent(token)}`;
  };


  return (
    <div>
      <div className="adm-page-header">
        <div>
          <span className="adm-page-title">Google Calendar</span>
          <p className="adm-page-subtitle">Connect your Google account to generate real Meet links for every booking</p>
        </div>
      </div>

      <div className="adm-booking-grid">
        <section className="adm-settings-card">
          <h2 className="adm-table-heading">Connection Status</h2>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {status === 'loading' && (
              <div className="adm-loader">
                <div className="adm-spinner" />
                <div>Checking connection…</div>
              </div>
            )}

            {status === 'connected' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 18px',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: '10px',
              }}>
                <Video size={20} color="#86efac" />
                <div>
                  <div style={{ fontWeight: 600, color: '#86efac' }}>Connected ✓</div>
                  <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '2px' }}>{email}</div>
                </div>
              </div>
            )}

            {status === 'disconnected' && (
              <div style={{
                padding: '14px 18px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                color: 'rgba(252,165,165,0.9)',
                fontSize: '14px',
              }}>
                ⚠ No Google account connected. Booking submissions will fail until you connect.
              </div>
            )}

            {notice && (
              <div style={{ fontSize: '13px', opacity: 0.6 }}>{notice}</div>
            )}

            <div>
              <button
                className="adm-btn adm-btn--primary"
                onClick={handleConnect}
                disabled={status === 'loading'}
                style={{ gap: '8px' }}
              >
                <Video size={14} />
                {status === 'connected' ? 'Reconnect Google Account' : 'Connect Google Account'}
              </button>
              <p style={{ marginTop: '10px', fontSize: '12px', opacity: 0.45, lineHeight: 1.6 }}>
                You&apos;ll be redirected to Google to authorise calendar access.<br />
                After approval you&apos;ll return here automatically.
              </p>
            </div>
          </div>
        </section>

        <section className="adm-settings-card">
          <h2 className="adm-table-heading">How it works</h2>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', lineHeight: 1.7, opacity: 0.75 }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ flexShrink: 0, fontWeight: 700, color: 'rgba(147,197,253,0.9)' }}>1.</span>
              <span>Click <strong>Connect Google Account</strong> and authorise calendar access.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ flexShrink: 0, fontWeight: 700, color: 'rgba(147,197,253,0.9)' }}>2.</span>
              <span>Your refresh token is securely stored in the database.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ flexShrink: 0, fontWeight: 700, color: 'rgba(147,197,253,0.9)' }}>3.</span>
              <span>Every booking automatically creates a Google Calendar event with a unique <code style={{ background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: '4px' }}>meet.google.com</code> link.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ flexShrink: 0, fontWeight: 700, color: 'rgba(147,197,253,0.9)' }}>4.</span>
              <span>The Meet link is emailed to the client and stored in the booking record.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BLOG ADMIN SECTION
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   BLOG IMPORT SECTION (JSON COPY-PASTE)
───────────────────────────────────────────── */
const BLOG_ACTION_CATEGORIES = [
  'auto',
  'General',
  'Web Development',
  'AI & Data',
  'Engineering',
  'Cloud',
  'UI/UX Design',
  'Mobile Development',
  'SEO',
  'Business',
];

interface ImportLog {
  id: string;
  title: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
}

function BlogImportSection() {
  const [createBlog] = useCreateBlogMutation();
  const [jsonInput, setJsonInput] = useState('');
  const [importCategory, setImportCategory] = useState('Web Development');
  const [isImporting, setIsImporting] = useState(false);
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });

  const handleImport = async () => {
    setError('');
    setLogs([]);
    setStats({ total: 0, success: 0, failed: 0 });

    let data: any[];
    try {
      const parsed = JSON.parse(jsonInput);
      data = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      setError('Invalid JSON format. Please check your input.');
      return;
    }

    if (data.length === 0) {
      setError('JSON array is empty.');
      return;
    }

    setIsImporting(true);
    setStats({ total: data.length, success: 0, failed: 0 });

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const logId = Math.random().toString(36).substring(7);
      const title = item.title || `Entry ${i + 1}`;

      setLogs(prev => [{ id: logId, title, status: 'pending' }, ...prev]);

      try {
        await createBlog({
          ...item,
          category: importCategory, // Override or default to selected category
          status: 'published' // Default to published for batch imports
        }).unwrap();

        setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'success' } : l));
        setStats(s => ({ ...s, success: s.success + 1 }));
      } catch (err: any) {
        console.error('IMPORT ERROR FOR:', title, err);
        const errMsg = err?.data?.error || err?.message || 'Failed to create';
        setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'failed', error: errMsg } : l));
        setStats(s => ({ ...s, failed: s.failed + 1 }));
      }
    }

    setIsImporting(false);
    setJsonInput('');
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <span className="adm-page-title">Blog JSON Importer</span>
          <p className="adm-page-subtitle">Paste a JSON array of blogs to upload them in batch to a category.</p>
        </div>
      </div>

      <div className="adm-booking-grid">
        <section className="adm-settings-card">
          <h2 className="adm-table-heading">1. Select Category</h2>
          <div className="adm-field" style={{ marginTop: '14px' }}>
            <select
              className="adm-select"
              value={importCategory}
              onChange={(e) => setImportCategory(e.target.value)}
            >
              {BLOG_ACTION_CATEGORIES.filter(c => c !== 'auto').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <h2 className="adm-table-heading" style={{ marginTop: '24px' }}>2. Paste JSON Content</h2>
          <div className="adm-field" style={{ marginTop: '14px' }}>
            <textarea
              className="adm-textarea"
              rows={15}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[
  { "title": "Example Blog", "content": "HTML content...", "excerpt": "summary..." },
  ...
]'
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </div>

          {error && <div className="adm-error-bar">{error}</div>}

          <button
            className="adm-btn adm-btn--primary"
            onClick={handleImport}
            disabled={isImporting || !jsonInput.trim()}
            style={{ marginTop: '10px', width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            {isImporting ? <div className="adm-spinner" style={{ width: '16px', height: '16px' }} /> : <Plus size={16} />}
            &nbsp;{isImporting ? 'Importing...' : 'Start Batch Import'}
          </button>
        </section>

        <section className="adm-settings-card">
          <h2 className="adm-table-heading">Import Status</h2>
          
          <div className="adm-stats" style={{ margin: '14px 0', gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="adm-stat-card" style={{ padding: '12px' }}>
              <span className="adm-stat-label">Total</span>
              <span className="adm-stat-value" style={{ fontSize: '18px' }}>{stats.total}</span>
            </div>
            <div className="adm-stat-card" style={{ padding: '12px' }}>
              <span className="adm-stat-label" style={{ color: '#22c55e' }}>Success</span>
              <span className="adm-stat-value" style={{ fontSize: '18px', color: '#22c55e' }}>{stats.success}</span>
            </div>
            <div className="adm-stat-card" style={{ padding: '12px' }}>
              <span className="adm-stat-label" style={{ color: '#ef4444' }}>Failed</span>
              <span className="adm-stat-value" style={{ fontSize: '18px', color: '#ef4444' }}>{stats.failed}</span>
            </div>
          </div>

          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto', 
            background: 'rgba(0,0,0,0.2)', 
            borderRadius: '8px',
            padding: '10px'
          }}>
            {logs.length === 0 ? (
              <p style={{ opacity: 0.4, textAlign: 'center', padding: '20px', fontSize: '13px' }}>No logs yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {logs.map((log) => (
                  <div key={log.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '12px',
                    padding: '6px 10px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '4px',
                    borderLeft: `3px solid ${log.status === 'success' ? '#22c55e' : log.status === 'failed' ? '#ef4444' : '#f59e0b'}`
                  }}>
                    <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      {log.title}
                    </span>
                    <span style={{ 
                      color: log.status === 'success' ? '#22c55e' : log.status === 'failed' ? '#ef4444' : '#f59e0b',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {log.status.toUpperCase()}
                      {log.error && <span style={{ opacity: 0.6, fontWeight: 'normal', marginLeft: '6px' }}>({log.error})</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN ADMIN CLIENT
═══════════════════════════════════════════════════════ */
export default function AdminClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');
  const [section, setSection] = useState<AdminSection | 'feedback'>('faq');
  const [hydrated, setHydrated] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [googleBanner, setGoogleBanner] = useState('');
  const pageTitle =
    section === 'faq'
      ? 'FAQ Management'
      : section === 'bookings'
      ? 'Booking Management'
      : section === 'feedback'
      ? 'Feedback & Testimonials'
      : section === 'careers'
      ? 'Career Applications'
      : section === 'users'
      ? 'User Management'
      : section === 'blog'
      ? 'Blog Management'
      : 'Google Calendar';

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

  useEffect(() => {
    const session = searchParams.get('session');
    if (session === 'expired') {
      setGoogleBanner('⚠ Session expired. Please sign in again.');
    }
  }, [searchParams]);

  // Handle ?google= redirect from OAuth callback
  useEffect(() => {
    const g = searchParams.get('google');
    if (g === 'connected') {
      setSection('settings');
      setGoogleBanner('✅ Google account connected successfully! Meet links will now be generated automatically.');
    } else if (g === 'denied') {
      setGoogleBanner('❌ Google authorisation was denied. Please try again.');
    } else if (g === 'no_refresh_token') {
      setGoogleBanner('⚠ Google did not return a refresh token. Please revoke access at myaccount.google.com/permissions and try again.');
    } else if (g === 'error') {
      setGoogleBanner('❌ An error occurred during Google authorisation. Check logs.');
    }
    if (g) {
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('google');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setUserName('');
    setAuthorized(false);
    router.replace('/');
  };

  if (!hydrated || !authorized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div className="adm-spinner" style={{ width: '36px', height: '36px', borderWidth: '3px' }} />
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading admin panel…</span>
      </div>
    );
  }


  return (
    <div className="admin-container">
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
              className={`adm-sidebar-item ${section === 'careers' ? 'active' : ''}`}
              onClick={() => setSection('careers')}
            >
              <Briefcase size={15} /> Careers
              {section === 'careers' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>

            <button
              className={`adm-sidebar-item ${section === 'users' ? 'active' : ''}`}
              onClick={() => setSection('users')}
            >
              <User size={15} /> Users
              {section === 'users' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>

            <button
              className={`adm-sidebar-item ${section === 'blog' && 'active'}`}
              onClick={() => setSection('blog')}
            >
              <FileText size={15} /> Blog Management
              {section === 'blog' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>

            <button
              className={`adm-sidebar-item ${section === 'settings' ? 'active' : ''}`}
              onClick={() => setSection('settings')}
            >
              <Settings size={15} /> Google Calendar
              {section === 'settings' && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
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
          <h1 className="adm-sr-only">{pageTitle}</h1>
          {googleBanner && (
            <div
              className={googleBanner.startsWith('✅') ? 'adm-ok-bar' : 'adm-error-bar'}
              style={{ margin: '0 0 16px 0', borderRadius: '8px' }}
            >
              {googleBanner}
              <button
                onClick={() => setGoogleBanner('')}
                style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, color: 'inherit' }}
              >
                ✕
              </button>
            </div>
          )}
          {section === 'faq' && <FaqSection category={category} />}
          {section === 'bookings' && <BookingAdminSection />}
          {section === 'feedback' && <FeedbackAdminSection />}
          {section === 'careers' && <CareersAdminSection />}
          {section === 'users' && <UserAdminSection />}
          {section === 'settings' && <GoogleCalendarSection />}
          {section === 'blog' && <BlogImportSection />}
        </main>
      </div>
      </div>

  );
}
