'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, LogOut, Camera, Save, ArrowLeft, Trash2, Calendar, MessageSquare, Pencil, X, CheckCircle2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import './Profile.css';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  isVerified?: boolean;
}

interface Booking {
  _id: string;
  serviceTitle: string;
  category: string;
  dateLabel: string;
  time: string;
  meetingLink: string;
  status: string;
  createdAt: string;
}

interface Feedback {
  _id: string;
  content: string;
  rating?: number;
  category?: string;
  createdAt: string;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'feedbacks'>('profile');
  
  // Profile State
  const [editName, setEditName] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bookings & Feedbacks State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  
  // Feedback Edit State
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [editFeedbackContent, setEditFeedbackContent] = useState('');
  const [editFeedbackRating, setEditFeedbackRating] = useState<number>(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState<number>(0);
  
  // Crop States
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setEditName(data.user.name);
          setPreviewAvatar(data.user.avatar || null);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          router.push('/');
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (activeTab === 'bookings') {
        fetch('/api/user/bookings', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { if (data.bookings) setBookings(data.bookings); })
            .catch(console.error);
    }

    if (activeTab === 'feedbacks') {
        fetch('/api/user/feedback', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { if (data.feedbacks) setFeedbacks(data.feedbacks); })
            .catch(console.error);
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    window.dispatchEvent(new Event("storage"));
    router.push('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setPreviewAvatar(croppedImage);
      setIsCropping(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
      setError('Failed to crop image');
    }
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setImageToCrop(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const removeAvatar = () => {
    setPreviewAvatar('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const saveProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          avatar: previewAvatar === null ? profile?.avatar : previewAvatar
        })
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setSuccess('Profile updated successfully');
        localStorage.setItem('userName', data.user.name); // Update localstorage name
        if (data.user.avatar) {
            localStorage.setItem('userAvatar', data.user.avatar);
        } else {
            localStorage.removeItem('userAvatar');
        }
        
        // Emitting storage event to sync HeroNavbar instantly
        window.dispatchEvent(new Event("storage"));
        
        // Optional quick sync for safety
        setTimeout(() => {
            window.location.reload();
        }, 1200);

      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch {
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFeedback = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/user/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, content: editFeedbackContent, rating: editFeedbackRating })
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbacks((prev: Feedback[]) => prev.map((f: Feedback) => f._id === id ? data.feedback : f));
        setEditingFeedbackId(null);
      }
    } catch (err) {
      console.error('Update Feedback Error:', err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/user/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setFeedbacks((prev: Feedback[]) => prev.filter((f: Feedback) => f._id !== id));
      }
    } catch (err) {
      console.error('Delete Feedback Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="profile-page-wrapper">
      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        Profile
      </h1>
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={18} /> Back
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-tabs">
            <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={16} /> Profile
            </button>
            <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
              <Calendar size={16} /> My Bookings
            </button>
            <button className={`tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`} onClick={() => setActiveTab('feedbacks')}>
              <MessageSquare size={16} /> My Feedback
            </button>
          </div>
          
          {error && activeTab === 'profile' && <div className="profile-error">{error}</div>}
          {success && activeTab === 'profile' && <div className="profile-success">{success}</div>}

          <div className="profile-content">
            {activeTab === 'profile' && (
              <>
            <div className="avatar-section">
              <div className="avatar-outer">
                <div className="avatar-preview">
                  {previewAvatar ? (
                    <Image src={previewAvatar} alt="Profile" width={100} height={100} className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <button 
                  className="avatar-edit-btn" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Change photo"
                >
                  <Camera size={16} />
                </button>
                {previewAvatar && (
                    <button 
                      className="avatar-remove-btn" 
                      onClick={removeAvatar}
                      title="Remove photo"
                    >
                      <Trash2 size={16} />
                    </button>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <p className="avatar-hint">Recommended size: 256x256px. Max 2MB.</p>
            </div>

            <div className="info-section">
              <div className="form-group">
                <label>Name</label>
                <div className="name-wrapper">
                    <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your Name"
                    style={{ flex: 1 }}
                    />
                    {profile.isVerified && (
                        <CheckCircle2 className="verified-badge" size={20} />
                    )}
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  disabled 
                  className="disabled-input"
                />
              </div>

              <button 
                className="save-btn" 
                onClick={saveProfile}
                disabled={saving || (editName === profile.name && previewAvatar === (profile.avatar || null))}
              >
                {saving ? (
                  <span className="btn-content"><div className="spinner small"></div> Saving...</span>
                ) : (
                  <span className="btn-content"><Save size={16} /> Save Changes</span>
                )}
              </button>
            </div>
            </>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="tab-pane">
                <h2 style={{ marginBottom: '16px', color: '#fff' }}>My Bookings</h2>
                {bookings.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>You have no scheduled bookings yet.</p>
                ) : (
                    <div className="list-grid">
                        {bookings.map((b: Booking) => (
                            <div key={b._id} className="list-card">
                                <h4>{b.serviceTitle} <span className="category-badge">{b.category}</span></h4>
                                <p><strong>Date:</strong> {b.dateLabel} at {b.time}</p>
                                <p><strong>Status:</strong> <span className={b.status}>{b.status}</span></p>
                                <a href={b.meetingLink} target="_blank" rel="noreferrer" className="meeting-link">Open Meeting Link</a>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            )}

            {/* Feedbacks Tab */}
            {activeTab === 'feedbacks' && (
              <div className="tab-pane">
                <h2 style={{ marginBottom: '16px', color: '#fff' }}>My Feedbacks</h2>
                {feedbacks.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>You haven&apos;t left any feedback yet.</p>
                ) : (
                    <div className="list-grid">
                        {feedbacks.map((f: Feedback) => (
                            <div key={f._id} className="list-card">
                                {editingFeedbackId === f._id ? (
                                    <div className="edit-form">
                                        <textarea 
                                            value={editFeedbackContent} 
                                            onChange={(e) => setEditFeedbackContent(e.target.value)}
                                            rows={4}
                                        />
                                        <div className="edit-actions">
                                            <div style={{ display: 'flex', gap: '4px', fontSize: '18px', cursor: 'pointer' }}>
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                  key={star}
                                                  onClick={() => setEditFeedbackRating(star)}
                                                  onMouseEnter={() => setFeedbackHoverRating(star)}
                                                  onMouseLeave={() => setFeedbackHoverRating(0)}
                                                  style={{
                                                    color: (feedbackHoverRating || editFeedbackRating) >= star ? "#fbbf24" : "rgba(255,255,255,0.2)",
                                                    transition: "color 0.2s"
                                                  }}
                                                >
                                                  ★
                                                </span>
                                              ))}
                                            </div>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                              <button onClick={() => setEditingFeedbackId(null)} className="cancel-btn"><X size={14}/></button>
                                              <button onClick={() => handleUpdateFeedback(f._id)} className="save-mini-btn"><Save size={14}/></button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="card-content">&quot;{f.content}&quot;</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                                {f.category || 'General'} • {f.rating || 5}/5 ★
                                            </span>
                                            <div className="card-actions">
                                                <button onClick={() => {
                                                    setEditingFeedbackId(f._id);
                                                    setEditFeedbackContent(f.content);
                                                    setEditFeedbackRating(f.rating || 5);
                                                }} title="Edit"><Pencil size={14}/></button>
                                                <button onClick={() => handleDeleteFeedback(f._id)} className="danger" title="Delete"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {isCropping && imageToCrop && (
        <div className="crop-modal-backdrop">
          <div className="crop-modal">
            <div className="crop-modal-header">
              <h2 className="crop-modal-title">Edit Profile Photo</h2>
              <button className="back-btn" onClick={cancelCrop}><X size={18} /></button>
            </div>
            
            <div className="crop-container">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="crop-controls">
              <div className="slider-group">
                <label>Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="crop-slider"
                />
              </div>
            </div>

            <div className="crop-modal-footer">
              <button className="logout-btn" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px 20px', borderRadius: '8px' }} onClick={cancelCrop}>
                Cancel
              </button>
              <button className="save-btn" style={{ margin: 0, padding: '10px 24px' }} onClick={handleApplyCrop}>
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
