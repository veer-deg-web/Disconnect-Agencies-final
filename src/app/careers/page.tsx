'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  CheckCircle2, 
  Send, 
  FileText, 
  Briefcase, 
  Mail, 
  Phone, 
  User, 
  MessageSquare 
} from 'lucide-react';
import ColorBends from '@/components/ColorBends';
import ShinyText from '@/components/Shared/ShinyText/ShinyText';
import './Careers.css';

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'AI/ML Engineer',
  'Project Manager',
  'Marketing Specialist',
  'Sales Representative'
];

export default function CareersPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    message: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      setResume(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('role', formData.role);
    data.append('message', formData.message);
    data.append('resume', resume);

    try {
      const res = await fetch('/api/career/apply', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit application');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="careers-page">
      {/* Brand Logo Top Right */}
      <div className="careers-logo" onClick={() => router.push("/")}>
        <Image
          src="/assets/Home/HeroNavbar/photo/logo.webp"
          alt="Disconnect"
          width={116}
          height={36}
          priority
        />
      </div>

      {/* Dynamic Background */}
      <div className="careers-background">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent
          autoRotate={0}
        />
      </div>

      <div className="careers-content">
        <header className="careers-header">
          <motion.span 
            className="careers-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Join Our Team
          </motion.span>
          <motion.h1 
            className="careers-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ShinyText
              text="Shape the Future With Us"
              speed={3}
              color="#b5b5b5"
              shineColor="#ffffff"
            />
          </motion.h1>
          <motion.p 
            className="careers-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ShinyText
               text="We're looking for visionary minds to help us build extraordinary digital solutions."
               speed={5}
               color="rgba(255, 255, 255, 0.5)"
               shineColor="#ffffff"
               spread={150}
            />
          </motion.p>
        </header>

        <motion.div 
          className="careers-form-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {submitted ? (
            <div className="success-message">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="success-icon"
              >
                <CheckCircle2 size={64} />
              </motion.div>
              <h2 className="success-title">Application Received!</h2>
              <p className="success-text">
                Thank you for applying. Our team will review your profile and get back to you soon.
              </p>
              <button 
                className="reset-btn"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', role: '', message: '' });
                  setResume(null);
                }}
              >
                Apply for another role
              </button>
            </div>
          ) : (
            <form className="careers-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label"><User size={14} style={{marginRight: '6px'}} /> Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-input" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label"><Mail size={14} style={{marginRight: '6px'}} /> Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="john@example.com" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label"><Phone size={14} style={{marginRight: '6px'}} /> Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-input" 
                    placeholder="+91 98765 43210" 
                    required 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label"><Briefcase size={14} style={{marginRight: '6px'}} /> Desired Role</label>
                  <select 
                    name="role"
                    className="form-select" 
                    required 
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select a role</option>
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label"><MessageSquare size={14} style={{marginRight: '6px'}} /> Cover Message</label>
                <textarea 
                  name="message"
                  className="form-textarea" 
                  placeholder="Tell us why you're a great fit..." 
                  rows={4} 
                  required 
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label"><FileText size={14} style={{marginRight: '6px'}} /> Resume (PDF)</label>
                <div className="file-upload-wrapper">
                  {!resume ? (
                    <div 
                      className="file-upload-area"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="upload-icon" />
                      <span className="upload-text">Click to upload your resume</span>
                      <span className="upload-hint">Max file size: 5MB (PDF only)</span>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".pdf"
                        className="file-input"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div className="selected-file-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={18} color="#FF5C00" />
                        <span>{resume.name}</span>
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>
                          ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={() => setResume(null)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  style={{ color: '#ff4d4d', fontSize: '14px', textAlign: 'center' }}
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}
