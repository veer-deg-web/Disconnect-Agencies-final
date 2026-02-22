'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  Eye, EyeOff, X, ArrowLeft,
  Mail, Lock, User, Phone,
  KeyRound, ShieldCheck, RefreshCw,
} from 'lucide-react';
import './Auth.css';

/* ─────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────── */
const ParticleCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];
    const mouse = { x: null as number | null, y: null as number | null };
    let raf: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from(
        { length: Math.floor((canvas.width * canvas.height) / 9000) },
        () => ({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7,
          r: Math.random() * 2 + 0.5,
        })
      );
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const R = (canvas.width / 80) * (canvas.height / 80);
      for (const p of particles) {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) {
            if (mouse.x < p.x && p.x < canvas.width - p.r * 10) p.x += 3;
            if (mouse.x > p.x && p.x > p.r * 10) p.x -= 3;
            if (mouse.y < p.y && p.y < canvas.height - p.r * 10) p.y += 3;
            if (mouse.y > p.y && p.y > p.r * 10) p.y -= 3;
          }
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ff5a00';
        ctx.shadowColor = '#ff8a00';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      const LINK = Math.min(canvas.width, canvas.height) * 0.15;
      for (let a = 0; a < particles.length; a++)
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(255,138,0,${(1 - d / LINK) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    const mm = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const mo = () => { mouse.x = null; mouse.y = null; };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseout', mo);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseout', mo);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={ref} className="auth-canvas" />;
};

/* ─────────────────────────────────────────────
   REUSABLE INPUT
───────────────────────────────────────────── */
const Input = ({
  icon: Icon, type = 'text', placeholder, value, onChange, required = true, autoFocus = false,
}: {
  icon: React.FC<{ size?: number }>; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean; autoFocus?: boolean;
}) => (
  <div className="auth-input-wrap">
    <span className="auth-input-icon"><Icon size={15} /></span>
    <input
      type={type} placeholder={placeholder} value={value}
      required={required} autoFocus={autoFocus}
      onChange={e => onChange(e.target.value)}
      className="auth-input"
    />
  </div>
);

/* ─────────────────────────────────────────────
   PASSWORD INPUT
───────────────────────────────────────────── */
const PwInput = ({
  placeholder, value, onChange, show, toggle, autoFocus = false,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
  show: boolean; toggle: () => void; autoFocus?: boolean;
}) => (
  <div className="auth-input-wrap">
    <span className="auth-input-icon"><Lock size={15} /></span>
    <input
      type={show ? 'text' : 'password'} placeholder={placeholder}
      value={value} required autoFocus={autoFocus}
      onChange={e => onChange(e.target.value)}
      className="auth-input auth-input--pw"
    />
    <button type="button" onClick={toggle} className="auth-pw-toggle">
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   BUTTONS
───────────────────────────────────────────── */
const PrimaryBtn = ({
  onClick, disabled, children, type = 'button',
}: {
  onClick?: () => void; disabled?: boolean; children: React.ReactNode; type?: 'button' | 'submit';
}) => (
  <button type={type} onClick={onClick} disabled={disabled} className="auth-btn auth-btn--primary">
    {children}
  </button>
);
const OutlineBtn = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} className="auth-btn auth-btn--outline">{children}</button>
);

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const fmtTime = (s: number) => {
  const m = Math.floor(s / 60), sec = s % 60;
  return m ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`;
};
const validatePw = (p: string) => {
  if (p.length < 8) return 'At least 8 characters required';
  if (!/[A-Z]/.test(p)) return 'Include at least one uppercase letter';
  if (!/[a-z]/.test(p)) return 'Include at least one lowercase letter';
  if (!/[0-9]/.test(p)) return 'Include at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(p)) return 'Include at least one special character';
  return '';
};

/* ─────────────────────────────────────────────
   MODAL WRAPPER
───────────────────────────────────────────── */
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="auth-modal-backdrop">
    <div className="auth-modal-card">
      <button onClick={onClose} className="auth-modal-close"><X size={20} /></button>
      {children}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   OTP INPUT
───────────────────────────────────────────── */
const OtpInput = ({ value, onChange, length = 4 }: { value: string; onChange: (v: string) => void; length?: number }) => (
  <input
    type="text" inputMode="numeric" maxLength={length} autoFocus
    value={value} onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
    placeholder={'—'.repeat(length)}
    className="auth-otp-input"
  />
);

/* ─────────────────────────────────────────────
   RESEND ROW
───────────────────────────────────────────── */
const ResendRow = ({ timer, onResend, loading }: { timer: number; onResend: () => void; loading: boolean }) => (
  <p className="auth-resend-row">
    {timer > 0 ? (
      <>Resend in <span className="auth-resend-timer">{fmtTime(timer)}</span></>
    ) : (
      <button type="button" onClick={onResend} disabled={loading} className="auth-resend-btn">
        <RefreshCw size={13} /> Resend OTP
      </button>
    )}
  </p>
);

/* ─────────────────────────────────────────────
   FORM PANELS — defined OUTSIDE AuthClient
   so React does NOT remount them on re-renders.
   This fixes the "can't type more than one char"
   bug caused by component identity changing.
───────────────────────────────────────────── */
type SignInProps = {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPw: boolean; togglePw: () => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgot: () => void;
};
const SignInPanel = ({ email, setEmail, password, setPassword, showPw, togglePw, loading, onSubmit, onForgot }: SignInProps) => (
  <form onSubmit={onSubmit} className="auth-form auth-form--signin">
    <Input icon={Mail} type="text" placeholder="Email or Phone" value={email} onChange={setEmail} />
    <PwInput placeholder="Password" value={password} onChange={setPassword} show={showPw} toggle={togglePw} />
    <div className="auth-forgot-link">
      <button type="button" onClick={onForgot}>Forgot password?</button>
    </div>
    <PrimaryBtn type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</PrimaryBtn>
  </form>
);

type SignUpProps = {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  confirmPassword: string; setConfirmPassword: (v: string) => void;
  showPw: boolean; togglePw: () => void;
  showCPw: boolean; toggleCPw: () => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};
const SignUpPanel = ({ name, setName, email, setEmail, phone, setPhone, password, setPassword, confirmPassword, setConfirmPassword, showPw, togglePw, showCPw, toggleCPw, loading, onSubmit }: SignUpProps) => (
  <form onSubmit={onSubmit} className="auth-form">
    <Input icon={User} placeholder="Full Name" value={name} onChange={setName} />
    <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
    <Input icon={Phone} type="tel" placeholder="Phone Number" value={phone}
      onChange={v => setPhone(v.replace(/\D/g, '').slice(0, 15))} />
    <PwInput placeholder="Password" value={password} onChange={setPassword} show={showPw} toggle={togglePw} />
    <PwInput placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} show={showCPw} toggle={toggleCPw} />
    <PrimaryBtn type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create Account'}</PrimaryBtn>
  </form>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function AuthClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  /* form fields */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const cardRefDesktop = useRef<HTMLDivElement>(null);
  const cardRefMobile = useRef<HTMLDivElement>(null);

  /* 3D Tilt Effect handlers */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * 8;
    const rotateY = ((x / rect.width) - 0.5) * -8;

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-4px)
    `;
  };

  const resetTilt = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  /* email OTP */
  const [otpModal, setOtpModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(600);
  const [registeredEmail, setRegisteredEmail] = useState('');

  /* forgot password */
  const [fpModal, setFpModal] = useState(false);
  const [fpStep, setFpStep] = useState<'id' | 'otp' | 'reset'>('id');
  const [fpId, setFpId] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpTimer, setFpTimer] = useState(900);
  const [fpPw, setFpPw] = useState('');
  const [fpCPw, setFpCPw] = useState('');
  const [showFpPw, setShowFpPw] = useState(false);
  const [showFpCPw, setShowFpCPw] = useState(false);

  /* timers */
  useEffect(() => {
    if (!otpModal || otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpModal, otpTimer]);

  useEffect(() => {
    if (!fpModal || fpStep !== 'otp' || fpTimer <= 0) return;
    const t = setTimeout(() => setFpTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [fpModal, fpStep, fpTimer]);

  const redirect = () => {
    const url = localStorage.getItem('redirectAfterLogin') || searchParams?.get('redirect') || '/';
    localStorage.removeItem('redirectAfterLogin');
    router.push(url);
  };

  /* ── sign in ── */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');
    if (!password) return toast.error('Please enter your password');
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/login', { emailOrPhone: email.trim(), password });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      toast.success('Logged in!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userRole', data.user.role ?? 'user');
      setTimeout(redirect, 800);
    } catch (err: any) { toast.error(err.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  /* ── sign up ── */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawPhone = phone.replace(/\D/g, '').slice(0, 15);
    if (!name.trim()) return toast.error('Please enter your name');
    if (!email.trim()) return toast.error('Please enter your email');
    if (rawPhone.length < 7 || rawPhone.length > 15) return toast.error('Phone must be 7–15 digits');
    const pwErr = validatePw(password);
    if (pwErr) return toast.error(pwErr);
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/signup/initiate', {
        name: name.trim(), email: email.trim(), phone: rawPhone, password,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setRegisteredEmail(email.trim());
      setEmailOtp(''); setOtpError(''); setOtpTimer(600);
      toast.success('OTP sent! Check your email.');
      setOtpModal(true);
    } catch (err: any) { toast.error(err.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  /* ── verify email OTP ── */
  const handleVerifyOtp = async () => {
    if (emailOtp.length !== 4) { setOtpError('Enter the 4-digit OTP'); return; }
    setLoading(true); setOtpError('');
    try {
      const res = await apiClient.post('/api/auth/signup/verify-email', { email: email.trim(), emailOtp });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');
      if (data.token) {
        toast.success('Account created! Logging you in…');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userRole', data.user.role ?? 'user');
        setOtpModal(false);
        setTimeout(redirect, 1200);
      } else {
        toast.success('Verified! Please sign in.');
        setOtpModal(false); setMode('signin');
      }
    } catch (err: any) { setOtpError(err.message || 'OTP verification failed'); }
    finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/signup/resend-otp', { email: email.trim(), type: 'email' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Resend failed');
      toast.success('New OTP sent!');
      setOtpTimer(600); setEmailOtp(''); setOtpError('');
    } catch (err: any) { toast.error(err.message || 'Resend failed'); }
    finally { setLoading(false); }
  };

  /* ── forgot password ── */
  const closeFp = () => {
    setFpModal(false); setFpStep('id'); setFpId(''); setFpOtp('');
    setFpPw(''); setFpCPw(''); setFpTimer(900);
  };
  const fpSendOtp = async () => {
    if (!fpId.trim()) return toast.error('Enter your email or phone');
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/forgot-password/initiate', { identifier: fpId.trim() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      toast.success('OTP sent!');
      setFpStep('otp'); setFpTimer(900); setFpOtp('');
    } catch (err: any) { toast.error(err.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };
  const fpVerifyOtp = async () => {
    const isPhone = /^\d{10,15}$/.test(fpId.trim());
    const len = isPhone ? 4 : 6;
    if (fpOtp.length !== len) return toast.error(`Enter the ${len}-digit OTP`);
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/forgot-password/verify-otp', { identifier: fpId.trim(), otp: fpOtp.trim() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      toast.success('OTP verified!');
      setFpStep('reset');
    } catch (err: any) { toast.error(err.message || 'Invalid OTP'); }
    finally { setLoading(false); }
  };
  const fpReset = async () => {
    if (!fpPw || !fpCPw) return toast.error('Fill in both password fields');
    if (fpPw !== fpCPw) return toast.error('Passwords do not match');
    const err = validatePw(fpPw);
    if (err) return toast.error(err);
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/forgot-password/reset', {
        identifier: fpId.trim(), otp: fpOtp.trim(), newPassword: fpPw,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      toast.success('Password reset! Please sign in.');
      closeFp(); setMode('signin');
    } catch (err: any) { toast.error(err.message || 'Reset failed'); }
    finally { setLoading(false); }
  };
  const fpResend = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/forgot-password/resend-otp', { identifier: fpId.trim() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Resend failed');
      toast.success('OTP resent!');
      setFpTimer(900); setFpOtp('');
    } catch (err: any) { toast.error(err.message || 'Resend failed'); }
    finally { setLoading(false); }
  };

  const STEPS = ['id', 'otp', 'reset'] as const;
  const stepIdx = STEPS.indexOf(fpStep);

  /* shared props for sign-in/sign-up panels */
  const signInProps: SignInProps = {
    email, setEmail, password, setPassword,
    showPw, togglePw: () => setShowPw(v => !v),
    loading, onSubmit: handleSignIn, onForgot: () => setFpModal(true),
  };
  const signUpProps: SignUpProps = {
    name, setName, email, setEmail, phone, setPhone,
    password, setPassword, confirmPassword, setConfirmPassword,
    showPw, togglePw: () => setShowPw(v => !v),
    showCPw, toggleCPw: () => setShowCPw(v => !v),
    loading, onSubmit: handleSignUp,
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { zIndex: 2147483647, fontFamily: 'inherit' } }} />
      <ParticleCanvas />

      {/* ────────── DESKTOP ────────── */}
      <div className="auth-page auth-desktop">
        <div 
          ref={cardRefDesktop}
          className={`auth-card-desktop${mode === 'signup' ? ' is-signup' : ''}`}
          onMouseMove={(e) => handleMouseMove(e, cardRefDesktop)}
          onMouseLeave={() => resetTilt(cardRefDesktop)}
        >

          {/* Sign-in form — visible by default, hidden when signup */}
          <div className="auth-form-panel auth-form-panel--signin">
            <div className="auth-form-inner">
              <div className="auth-form-header">
                <h1>Welcome Back</h1>
                <p>Sign in to continue your journey</p>
              </div>
              <SignInPanel {...signInProps} />
            </div>
          </div>

          {/* Sign-up form — hidden by default, visible when signup */}
          <div className="auth-form-panel auth-form-panel--signup">
            <div className="auth-form-inner">
              <div className="auth-form-header">
                <h1>Create Account</h1>
                <p>Fill in the details below to get started</p>
              </div>
              <SignUpPanel {...signUpProps} />
            </div>
          </div>

          {/* Violet overlay panel */}
          <div className="auth-overlay-panel">
            <div className="auth-overlay-inner">
              <div className="auth-overlay-dots" />
              <div className="auth-overlay-side auth-overlay-side--left">
                <div className="auth-logo auth-logo--overlay"><img src="/logo.png" alt="Disconnect Agencies" /></div>
                <h2>Welcome Back!</h2>
                <p>Already have an account?<br />Sign in to continue.</p>
                <OutlineBtn onClick={() => setMode('signin')}>Sign In</OutlineBtn>
              </div>
              <div className="auth-overlay-side auth-overlay-side--right">
                <div className="auth-logo auth-logo--overlay"><img src="/logo.png" alt="Disconnect Agencies" /></div>
                <h2>New Here?</h2>
                <p>Create a free account and<br />start your journey today.</p>
                <OutlineBtn onClick={() => setMode('signup')}>Sign Up</OutlineBtn>
              </div>
            </div>
          </div>

          <button onClick={() => router.back()} className="auth-back-btn">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      {/* ────────── MOBILE ────────── */}
      <div className="auth-page auth-mobile">
        <div className="auth-mobile-inner">
          <button onClick={() => router.back()} className="auth-back-btn-mobile">
            <ArrowLeft size={14} /> Back
          </button>
          <div 
            ref={cardRefMobile}
            className="auth-card-mobile"
            onMouseMove={(e) => handleMouseMove(e, cardRefMobile)}
            onMouseLeave={() => resetTilt(cardRefMobile)}
          >
            <div className="auth-logo auth-logo--mobile"><img src="/logo.png" alt="Disconnect Agencies" /></div>
            <h1 className="auth-mobile-title">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="auth-mobile-subtitle">
              {mode === 'signin' ? 'Sign in to continue your journey' : 'Fill in the details to get started'}
            </p>
            <div className="auth-tabs">
              {(['signin', 'signup'] as const).map(m => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`auth-tab-btn${mode === m ? ' active' : ''}`}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
            {mode === 'signin' ? <SignInPanel {...signInProps} /> : <SignUpPanel {...signUpProps} />}
          </div>
        </div>
      </div>

      {/* ────────── EMAIL OTP MODAL ────────── */}
      {otpModal && (
        <Modal onClose={() => { setOtpModal(false); setOtpError(''); }}>
          <div className="auth-modal-header">
            <div className="auth-modal-icon"><ShieldCheck size={26} /></div>
            <h2>Verify Your Email</h2>
            <p className="auth-modal-desc">
              We sent a 4-digit code to <span>{registeredEmail || email}</span>
            </p>
          </div>
          {otpError && <div className="auth-otp-error">{otpError}</div>}
          <div className="auth-modal-body">
            <OtpInput value={emailOtp} onChange={setEmailOtp} length={4} />
            <PrimaryBtn onClick={handleVerifyOtp} disabled={loading || emailOtp.length !== 4}>
              {loading ? 'Verifying…' : 'Verify & Complete Registration'}
            </PrimaryBtn>
            <ResendRow timer={otpTimer} onResend={handleResendOtp} loading={loading} />
          </div>
        </Modal>
      )}

      {/* ────────── FORGOT PASSWORD MODAL ────────── */}
      {fpModal && (
        <Modal onClose={closeFp}>
          <div className="auth-modal-header">
            <div className="auth-modal-icon"><KeyRound size={24} /></div>
            <h2>
              {fpStep === 'id' && 'Forgot Password'}
              {fpStep === 'otp' && 'Enter OTP'}
              {fpStep === 'reset' && 'New Password'}
            </h2>
            <div className="auth-steps">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className={`auth-step-dot${stepIdx >= i ? ' done' : ''}`}>{i + 1}</div>
                  {i < 2 && <div className={`auth-step-line${stepIdx > i ? ' done' : ''}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {fpStep === 'id' && (
            <div className="auth-modal-body">
              <p className="auth-modal-hint">Enter your email or phone number to receive a reset code.</p>
              <Input icon={Mail} placeholder="Email or Phone" value={fpId} onChange={setFpId} autoFocus />
              <PrimaryBtn onClick={fpSendOtp} disabled={loading}>{loading ? 'Sending…' : 'Send Reset Code'}</PrimaryBtn>
            </div>
          )}

          {fpStep === 'otp' && (() => {
            const isPhone = /^\d{10,15}$/.test(fpId.trim());
            const len = isPhone ? 4 : 6;
            return (
              <div className="auth-modal-body">
                <p className="auth-modal-hint">Enter the {len}-digit code sent to <span>{fpId}</span></p>
                <OtpInput value={fpOtp} onChange={setFpOtp} length={len} />
                <PrimaryBtn onClick={fpVerifyOtp} disabled={loading || fpOtp.length !== len}>
                  {loading ? 'Verifying…' : 'Verify Code'}
                </PrimaryBtn>
                <ResendRow timer={fpTimer} onResend={fpResend} loading={loading} />
              </div>
            );
          })()}

          {fpStep === 'reset' && (
            <div className="auth-modal-body">
              <p className="auth-modal-hint">Choose a strong new password.</p>
              <PwInput placeholder="New Password" value={fpPw} onChange={setFpPw}
                show={showFpPw} toggle={() => setShowFpPw(v => !v)} autoFocus />
              <PwInput placeholder="Confirm New Password" value={fpCPw} onChange={setFpCPw}
                show={showFpCPw} toggle={() => setShowFpCPw(v => !v)} />
              <ul className="auth-pw-hints">
                {['8+ characters', 'Uppercase & lowercase', 'Number', 'Special character'].map(r => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <PrimaryBtn onClick={fpReset} disabled={loading}>{loading ? 'Resetting…' : 'Reset Password'}</PrimaryBtn>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
