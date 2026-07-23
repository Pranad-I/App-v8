'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, LogIn, Shield, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ParticleCanvas } from '@/components/ParticleCanvas';

// ── Matrix Rain Streaks ────────────────────────────────────────────────────

function MatrixStreaks() {
  const items = [
    { left: '8%',  delay: '0s',    dur: '4.2s', chars: '10101 01101 00111' },
    { left: '18%', delay: '1.1s',  dur: '5s',   chars: '11010 10001' },
    { left: '72%', delay: '0.4s',  dur: '4.6s', chars: '00110 11100 01011' },
    { left: '85%', delay: '2s',    dur: '3.8s', chars: '10110 00101' },
    { left: '93%', delay: '0.8s',  dur: '5.3s', chars: '01001 11010 10110' },
    { left: '3%',  delay: '1.7s',  dur: '4.9s', chars: '11001 00111' },
    { left: '56%', delay: '3s',    dur: '4.1s', chars: '10100 01110 11001' },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute top-0 font-mono text-[9px] text-[#0a6bc9] opacity-0 whitespace-nowrap"
          style={{
            left: item.left,
            writingMode: 'vertical-rl',
            animation: `login-stream-down ${item.dur} linear ${item.delay} infinite`,
          }}
        >
          {item.chars}
        </div>
      ))}
    </div>
  );
}

// ── Animated Shield ────────────────────────────────────────────────────────

function ShieldIllustration() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center select-none">
      {/* Outer pulse rings */}
      <div className="absolute h-[340px] w-[340px] rounded-full border border-[#0a3a5e]/30"
        style={{ animation: 'ping 3.5s ease-in-out infinite' }} />
      <div className="absolute h-[280px] w-[280px] rounded-full border border-[#0a4d80]/35"
        style={{ animation: 'ping 3.5s ease-in-out infinite 0.7s' }} />
      <div className="absolute h-[220px] w-[220px] rounded-full border border-[#0a6bc9]/25"
        style={{ animation: 'ping 3.5s ease-in-out infinite 1.4s' }} />

      {/* Rotating orbit rings */}
      <svg
        className="login-spin-slow absolute h-[300px] w-[300px]"
        viewBox="0 0 300 300" fill="none"
      >
        <circle cx="150" cy="150" r="138" stroke="#0a3d70" strokeWidth="1" strokeDasharray="10 18" />
        <circle cx="150" cy="150" r="115" stroke="#0a4d8a" strokeWidth="0.6" strokeDasharray="5 22" />
      </svg>
      <svg
        className="login-spin-reverse absolute h-[230px] w-[230px]"
        viewBox="0 0 230 230" fill="none"
      >
        <circle cx="115" cy="115" r="105" stroke="#0d60a8" strokeWidth="1" strokeDasharray="14 9" />
      </svg>

      {/* Orbit dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = 138;
        const cx = 150 + r * Math.cos((deg * Math.PI) / 180);
        const cy = 150 + r * Math.sin((deg * Math.PI) / 180);
        return (
          <svg
            key={deg}
            className="login-spin-slow absolute h-[300px] w-[300px] pointer-events-none"
            viewBox="0 0 300 300" fill="none"
          >
            <circle cx={cx} cy={cy} r="3.5" fill="#0a6bc9">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin={`${deg / 90 * 0.5}s`} />
            </circle>
            <circle cx={cx} cy={cy} r="7" stroke="#0a6bc9" strokeWidth="0.8" opacity="0.35" />
          </svg>
        );
      })}

      {/* Main Shield body */}
      <div className="login-float relative z-10">
        <svg className="h-[280px] w-[244px]" viewBox="0 0 244 280" fill="none">
          <defs>
            <linearGradient id="sg1" x1="122" y1="6" x2="122" y2="264" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#031c38" />
              <stop offset="100%" stopColor="#010d1c" />
            </linearGradient>
            <linearGradient id="sg2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#0d7acc" stopOpacity="0.45" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <clipPath id="shieldClip">
              <path d="M122 6 L228 46 L228 140 C228 192 175 238 122 260 C69 238 16 192 16 140 L16 46 Z" />
            </clipPath>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Shield outer */}
          <path d="M122 6 L228 46 L228 140 C228 192 175 238 122 260 C69 238 16 192 16 140 L16 46 Z"
            fill="url(#sg1)" stroke="#1a5fa0" strokeWidth="2" />
          {/* Shield inner border (dashed) */}
          <path d="M122 20 L216 56 L216 140 C216 186 167 228 122 248 C77 228 28 186 28 140 L28 56 Z"
            fill="none" stroke="#0a4d8a" strokeWidth="0.8" strokeDasharray="5 10" opacity="0.7" />

          {/* Network connection lines */}
          <line x1="88" y1="94" x2="122" y2="78" stroke="#0a5fa0" strokeWidth="0.9" />
          <line x1="122" y1="78" x2="156" y2="94" stroke="#0a5fa0" strokeWidth="0.9" />
          <line x1="88" y1="94" x2="74" y2="114" stroke="#0a5fa0" strokeWidth="0.9" />
          <line x1="156" y1="94" x2="170" y2="114" stroke="#0a5fa0" strokeWidth="0.9" />
          <line x1="88" y1="94" x2="156" y2="94" stroke="#0a5fa0" strokeWidth="0.9" />
          <line x1="74" y1="114" x2="88" y2="94" stroke="#0a5fa0" strokeWidth="0.9" strokeDasharray="3 4" />

          {/* Network nodes */}
          {([[88,94],[122,78],[156,94],[74,114],[170,114]] as [number,number][]).map(([cx,cy],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="4.5" fill="#0d7acc" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="8" stroke="#0d7acc" strokeWidth="0.7" opacity="0.4" />
            </g>
          ))}

          {/* Lock body */}
          <rect x="86" y="132" width="72" height="60" rx="6" fill="#041830" stroke="#0d7acc" strokeWidth="1.5" />
          {/* Lock shackle */}
          <path d="M98 132 L98 114 C98 92 146 92 146 114 L146 132"
            fill="none" stroke="#0d7acc" strokeWidth="5.5" strokeLinecap="round" />
          {/* Lock keyhole circle */}
          <circle cx="122" cy="156" r="9" fill="#0d7acc" filter="url(#glow)" />
          {/* Lock keyhole stem */}
          <rect x="118" y="164" width="8" height="14" rx="3" fill="#0d7acc" />

          {/* Scan line */}
          <rect
            x="16" y="0" width="212" height="6"
            fill="url(#sg2)"
            clipPath="url(#shieldClip)"
            style={{ animation: 'login-scan-line 3.2s ease-in-out infinite' }}
          />

          {/* Corner accent lines */}
          <line x1="16" y1="90" x2="40" y2="90" stroke="#0a6bc9" strokeWidth="0.8" opacity="0.5" />
          <line x1="16" y1="100" x2="32" y2="100" stroke="#0a6bc9" strokeWidth="0.8" opacity="0.3" />
          <line x1="228" y1="90" x2="204" y2="90" stroke="#0a6bc9" strokeWidth="0.8" opacity="0.5" />
          <line x1="228" y1="100" x2="212" y2="100" stroke="#0a6bc9" strokeWidth="0.8" opacity="0.3" />
        </svg>
      </div>

      {/* Floating data nodes */}
      {[
        { x: '12%', y: '18%', d: '0s',   s: 'h-2 w-2' },
        { x: '82%', y: '28%', d: '0.9s', s: 'h-1.5 w-1.5' },
        { x: '6%',  y: '68%', d: '1.7s', s: 'h-2.5 w-2.5' },
        { x: '88%', y: '72%', d: '0.5s', s: 'h-1.5 w-1.5' },
        { x: '48%', y: '8%',  d: '1.3s', s: 'h-2 w-2' },
        { x: '20%', y: '85%', d: '2.1s', s: 'h-1 w-1' },
        { x: '75%', y: '12%', d: '0.3s', s: 'h-1.5 w-1.5' },
      ].map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.s} rounded-full bg-[#0d7acc]`}
          style={{
            left: p.x, top: p.y,
            animation: `pulse 2.5s ease-in-out ${p.d} infinite`,
            boxShadow: '0 0 8px #0d7acc, 0 0 16px rgba(13,122,204,0.4)',
          }}
        />
      ))}
    </div>
  );
}

// ── Hexagonal Grid Background ─────────────────────────────────────────────

function HexGrid() {
  const hexes: { cx: number; cy: number; s: string }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 20; col++) {
      const x = col * 80 + (row % 2 === 0 ? 0 : 40);
      const y = row * 70;
      hexes.push({ cx: x, cy: y, s: `${(row * 3 + col * 7) % 5}s` });
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]">
      <svg className="absolute top-0 left-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {hexes.map((h, i) => (
          <polygon
            key={i}
            points={`${h.cx},${h.cy - 28} ${h.cx + 24},${h.cy - 14} ${h.cx + 24},${h.cy + 14} ${h.cx},${h.cy + 28} ${h.cx - 24},${h.cy + 14} ${h.cx - 24},${h.cy - 14}`}
            fill="none"
            stroke="#0a6bc9"
            strokeWidth="0.8"
            className="login-hex-drift"
            style={{ animationDelay: h.s }}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Corner Circuit Traces ─────────────────────────────────────────────────

function CircuitTraces() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute left-0 top-0 h-[380px] w-[380px] opacity-[0.12]" viewBox="0 0 380 380" fill="none">
        <path d="M0 70 L70 70 L70 110 L150 110 L150 70 L230 70 L230 150 L300 150" stroke="#0a5fa0" strokeWidth="1" />
        <path d="M0 150 L40 150 L40 190 L110 190 L110 230 L190 230" stroke="#0a5fa0" strokeWidth="1" />
        <path d="M90 0 L90 55 L130 55 L130 90 L190 90 L190 35 L290 35" stroke="#0a5fa0" strokeWidth="1" />
        <circle cx="70"  cy="70"  r="4" fill="#0a6bc9" />
        <circle cx="150" cy="110" r="4" fill="#0a6bc9" />
        <circle cx="230" cy="70"  r="4" fill="#0a6bc9" />
        <circle cx="110" cy="190" r="3" fill="#0a6bc9" />
        <circle cx="130" cy="55"  r="3" fill="#0a6bc9" />
        <circle cx="190" cy="35"  r="3" fill="#0a6bc9" />
      </svg>
      <svg className="absolute bottom-0 right-0 h-[380px] w-[380px] opacity-[0.12]" viewBox="0 0 380 380" fill="none">
        <path d="M380 300 L310 300 L310 260 L230 260 L230 300 L150 300 L150 210" stroke="#0a5fa0" strokeWidth="1" />
        <path d="M380 200 L340 200 L340 160 L260 160 L260 120 L180 120" stroke="#0a5fa0" strokeWidth="1" />
        <path d="M290 380 L290 325 L250 325 L250 265 L190 265" stroke="#0a5fa0" strokeWidth="1" />
        <circle cx="310" cy="300" r="4" fill="#0a6bc9" />
        <circle cx="230" cy="260" r="4" fill="#0a6bc9" />
        <circle cx="260" cy="160" r="3" fill="#0a6bc9" />
        <circle cx="250" cy="325" r="3" fill="#0a6bc9" />
      </svg>
      {/* Center top and bottom subtle glows */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#012a55]/25 blur-[80px]" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#011e3c]/25 blur-[80px]" />
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#010f20]/30 blur-[100px]" />
    </div>
  );
}

// ── Glitch Title ──────────────────────────────────────────────────────────

function GlitchTitle({ text }: { text: string }) {
  return (
    <h1
      className="relative mb-1.5 text-3xl font-bold tracking-wider text-[#026dc8] login-glow-text"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      <span
        className="relative z-10 inline-block"
        style={{ animation: 'login-glitch 7s ease-in-out infinite' }}
      >
        {text}
      </span>
    </h1>
  );
}

// ── Main Login Page ────────────────────────────────────────────────────────

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(true);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [shaking, setShaking]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [showForgot, setShowForgot]     = useState(false);
  const [resetEmail, setResetEmail]     = useState('');
  const [resetSent, setResetSent]       = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]     = useState('');
  const btnRef = useRef<HTMLButtonElement>(null);

  function triggerError(msg: string) {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  }

  function triggerRipple(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    ripple.style.cssText = `
      position:absolute; border-radius:50%; background:rgba(255,255,255,0.25);
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      pointer-events:none; transform:scale(0); opacity:0.6;
      animation: login-ripple 0.6s ease-out forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  async function handleResetPassword() {
    if (!resetEmail.includes('@')) return;
    if (!isSupabaseConfigured) {
      setResetError('Supabase is not configured, so password reset emails cannot be sent yet.');
      return;
    }
    setResetLoading(true);
    setResetError('');
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
      });
      if (resetErr) {
        setResetError(resetErr.message);
        return;
      }
      setResetSent(true);
    } catch {
      setResetError('Something went wrong. Please try again.');
    } finally {
      setResetLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      triggerError('Please enter your credentials.');
      return;
    }
    if (!isSupabaseConfigured) {
      triggerError('Supabase is not configured. Add your project URL and anon key to .env.local to enable sign-in.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        triggerError(authError.message || 'Invalid credentials. Please try again.');
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch {
      triggerError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#000812] px-4 py-6"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {/* Layered background */}
      <HexGrid />
      <CircuitTraces />
      <ParticleCanvas />
      <MatrixStreaks />

      {/* Outer border container */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1440px] items-center justify-center rounded-[14px] border border-[#0e2a42]/60 shadow-[inset_0_0_140px_rgba(0,26,52,0.35)]">

        <div className="relative grid w-full max-w-[1180px] grid-cols-1 items-center gap-8 px-6 py-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12 lg:px-14 lg:py-12">

          {/* Left: Shield */}
          <aside className="hidden h-full items-center justify-center lg:flex">
            <ShieldIllustration />
          </aside>

          {/* Right: Form */}
          <div className="login-logo-enter flex flex-col items-center">

            {/* Logo */}
            <header className="mb-8 flex w-full max-w-[652px] flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                {/* Shield icon */}
                <svg className="h-[74px] w-[62px]" viewBox="0 0 62 74" fill="none">
                  <defs>
                    <linearGradient id="logoSG" x1="31" y1="3" x2="31" y2="72" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0a2244" />
                      <stop offset="100%" stopColor="#030e1c" />
                    </linearGradient>
                  </defs>
                  <path d="M31 3 L58 13 L58 38 C58 56 45 68 31 72 C17 68 4 56 4 38 L4 13 Z"
                    fill="url(#logoSG)" stroke="#1a5fa0" strokeWidth="1.5" />
                  <path d="M31 3 L58 13 L58 38 C58 56 45 68 31 72 C17 68 4 56 4 38 L4 13 Z"
                    fill="none" stroke="#0d7acc" strokeWidth="0.8" opacity="0.5" />
                  {([[22,28],[31,22],[40,28],[19,36],[43,36]] as [number,number][]).map(([cx,cy],i) => (
                    <circle key={i} cx={cx} cy={cy} r="2.5" fill="#0d7acc" />
                  ))}
                  <line x1="22" y1="28" x2="31" y2="22" stroke="#0a5fa0" strokeWidth="0.8" />
                  <line x1="31" y1="22" x2="40" y2="28" stroke="#0a5fa0" strokeWidth="0.8" />
                  <line x1="22" y1="28" x2="19" y2="36" stroke="#0a5fa0" strokeWidth="0.8" />
                  <line x1="40" y1="28" x2="43" y2="36" stroke="#0a5fa0" strokeWidth="0.8" />
                  <line x1="22" y1="28" x2="40" y2="28" stroke="#0a5fa0" strokeWidth="0.8" />
                  <rect x="22" y="40" width="18" height="14" rx="2" fill="#041830" stroke="#0d7acc" strokeWidth="1" />
                  <path d="M25 40 L25 35 C25 30 37 30 37 35 L37 40" fill="none" stroke="#0d7acc" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="31" cy="46" r="2.5" fill="#0d7acc" />
                </svg>

                {/* Brand wordmark */}
                <div className="flex items-end leading-none" style={{ lineHeight: 1 }}>
                  <span className="text-[52px] font-bold text-[#e9eaea]" style={{ fontFamily: 'var(--font-inter)' }}>
                    ML
                  </span>
                  <span className="mx-1.5 mb-[2px] text-[38px] font-bold text-[#005dc9]"
                    style={{ fontFamily: 'var(--font-orbitron)' }}>
                    a
                  </span>
                  <span className="text-[52px] text-[#e6e7e7]"
                    style={{ fontFamily: 'var(--font-audiowide)' }}>
                    NDS
                  </span>
                </div>
              </div>

              <p className="mb-1 text-[11px] tracking-[0.22em] text-[#86909a]">
                INTELLIGENT MULTI-LAYER NETWORK DEFENCE SYSTEM
              </p>
              <p className="text-base font-medium text-[#02619e] login-glow-text">
                Monitor. Detect.Protect.
              </p>
            </header>

            {/* Card */}
            <div
              className={`login-card-enter w-full max-w-[635px] rounded-[13px] border border-[#1d2c3f] bg-[#040f1b]/95 shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(10,107,201,0.06)] ${
                shaking ? 'login-shake' : ''
              } ${success ? 'login-success' : ''}`}
              style={{ willChange: 'transform' }}
            >
              <div className="px-6 py-8 md:px-10 md:py-9">
                <div className="mx-auto flex max-w-[552px] flex-col">

                  {/* Header */}
                  <div className="mb-7 text-center">
                    <GlitchTitle text="WELCOME BACK" />
                    <p className="text-[17px] text-[#737e8c]">
                      Sign in to access your network dashboard
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 flex items-center gap-2 rounded border border-[#3a1520] bg-[#130810]/80 px-4 py-2.5 text-sm text-[#ff5566]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5566]" />
                      {error}
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div className="mb-4 flex items-center gap-2 rounded border border-[#0a4d2a] bg-[#031a0e]/80 px-4 py-2.5 text-sm text-[#22c55e]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
                      Authentication successful. Redirecting to dashboard...
                    </div>
                  )}

                  {!isSupabaseConfigured && (
                    <div className="mb-4 rounded border border-[#4d3a0a] bg-[#1a1403]/80 px-4 py-2.5 text-[13px] text-[#e0b93d]">
                      Supabase isn&apos;t configured yet, so sign-in is disabled. Add
                      <code className="mx-1 rounded bg-black/30 px-1 py-0.5 text-[12px]">NEXT_PUBLIC_SUPABASE_URL</code>
                      and
                      <code className="mx-1 rounded bg-black/30 px-1 py-0.5 text-[12px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                      to <code className="rounded bg-black/30 px-1 py-0.5 text-[12px]">.env.local</code>.
                    </div>
                  )}

                  {/* Form */}
                  <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

                    {/* Email field */}
                    <div className="relative group">
                      <User className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#0084ff] transition-colors group-focus-within:text-[#4daeff]" />
                      <input
                        type="email"
                        placeholder="Username / Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input h-[66px] w-full rounded-md border-2 border-[#1a2a3e] bg-[#010913] pl-12 pr-4 text-xl text-[#b6d0ee] placeholder:text-[#4d5c6d] transition-all duration-300"
                        style={{ fontFamily: 'var(--font-inter)' }}
                        autoComplete="email"
                      />
                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-[#026dc8] to-[#4daeff] transition-all duration-300 group-focus-within:w-full" />
                    </div>

                    {/* Password field */}
                    <div className="relative group">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#0084ff] transition-colors group-focus-within:text-[#4daeff]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input h-[66px] w-full rounded-md border border-[#1a2a3e] bg-[#010913] pl-12 pr-12 text-xl text-[#b6d0ee] placeholder:text-[#4c5b6d] transition-all duration-300"
                        style={{ fontFamily: 'var(--font-inter)' }}
                        autoComplete="current-password"
                      />
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-[#026dc8] to-[#4daeff] transition-all duration-300 group-focus-within:w-full" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#607089] transition-all duration-200 hover:text-[#8ea8c9] hover:scale-110"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword
                          ? <EyeOff className="h-5 w-5" />
                          : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="mt-1 flex items-center justify-between gap-4">
                      <label className="flex cursor-pointer items-center gap-2 group">
                        <div
                          className="flex h-[14px] w-[14px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border transition-all duration-200 group-hover:scale-110"
                          style={{
                            borderColor: rememberMe ? '#0f7fff' : '#0466a1',
                            backgroundColor: rememberMe ? '#0f7fff' : 'transparent',
                            boxShadow: rememberMe ? '0 0 8px rgba(15,127,255,0.5)' : 'none',
                          }}
                          onClick={() => setRememberMe(!rememberMe)}
                        >
                          {rememberMe && (
                            <svg viewBox="0 0 10 8" className="h-2.5 w-2.5" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[17px] text-[#838e9b] group-hover:text-[#a0afc2] transition-colors">
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-[17px] text-[#0466a1] transition-all duration-200 hover:text-[#1f8ce5] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Login button */}
                    <button
                      ref={btnRef}
                      type="submit"
                      disabled={loading || success}
                      onClick={triggerRipple}
                      className="group relative mt-1 flex h-[71px] w-full items-center justify-center gap-3 overflow-hidden rounded-md text-2xl font-bold tracking-wider text-[#c8ddf0] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_6px_32px_rgba(5,96,209,0.5)] active:scale-[0.99] disabled:opacity-80 disabled:hover:scale-100"
                      style={{
                        background: success
                          ? 'linear-gradient(180deg, #0d9e4f 0%, #0a7a3c 100%)'
                          : 'linear-gradient(180deg, #0f7fff 0%, #0560d1 100%)',
                        boxShadow: '0 4px 24px rgba(5,96,209,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                        fontFamily: 'var(--font-inter)',
                      }}
                    >
                      {/* Shimmer sweep */}
                      <span
                        className="absolute top-0 h-full w-24 skew-x-12 bg-white/10 opacity-0 group-hover:opacity-100"
                        style={{ animation: 'login-btn-shimmer 1.6s ease-in-out infinite' }}
                      />
                      {loading
                        ? <Loader2 className="relative z-10 h-6 w-6 animate-spin" />
                        : success
                        ? <Shield className="relative z-10 h-6 w-6" style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }} />
                        : <LogIn className="relative z-10 h-6 w-6" />}
                      <span className="relative z-10">
                        {loading ? 'AUTHENTICATING...' : success ? 'ACCESS GRANTED' : 'LOGIN'}
                      </span>
                    </button>
                  </form>

                  {/* Secure access divider */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1f2e40] to-transparent" />
                    <span className="text-[11px] tracking-[0.2em] text-[#4d5e72]">SECURE ACCESS</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1f2e40] to-transparent" />
                  </div>
                  <div className="mt-3 flex justify-center">
                    <Shield
                      className="h-6 w-6 text-[#0084ff]"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0,132,255,0.7))' }}
                    />
                  </div>
                  <p className="mt-4 text-center text-[13px] text-[#607089]">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-semibold text-[#4daeff] hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-4 flex items-center justify-center gap-3 text-[13px] text-[#495768]">
              <span>MLaNDS v1.0.0</span>
              <span className="h-3 w-px bg-[#2a3a4e]" />
              <span className="text-[#475464]">Protecting your network, 24/7</span>
            </footer>
          </div>
        </div>
      </section>

      {showForgot && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4"
          onClick={() => { setShowForgot(false); setResetSent(false); setResetEmail(''); }}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-[#1a2a3e] bg-[#050b14] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!resetSent ? (
              <>
                <h2 className="text-lg font-bold text-[#c8ddf0]">Reset your password</h2>
                <p className="mt-1 text-[13px] text-[#607089]">
                  Enter your account email and we&apos;ll send you a link to reset your password.
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-4 h-11 w-full rounded-md border border-[#1a2a3e] bg-[#010913] px-3 text-sm text-[#b6d0ee] placeholder:text-[#4c5b6d] outline-none focus:border-[#0f7fff]"
                />
                {resetError && <p className="mt-2 text-[12px] text-red-400">{resetError}</p>}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowForgot(false); setResetEmail(''); setResetError(''); }}
                    className="flex-1 rounded-md border border-[#1a2a3e] py-2 text-sm font-medium text-[#8ea8c9] hover:bg-[#0a1420]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!resetEmail.includes('@') || resetLoading}
                    onClick={handleResetPassword}
                    className="flex-1 rounded-md bg-[#0f7fff] py-2 text-sm font-semibold text-white hover:bg-[#0560d1] disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0d9e4f]/20">
                  <LogIn className="h-5 w-5 text-[#2ecc71]" />
                </div>
                <h2 className="text-base font-bold text-[#c8ddf0]">Check your email</h2>
                <p className="mt-1 text-[13px] text-[#607089]">
                  If an account exists for {resetEmail}, a reset link is on its way.
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setResetSent(false); setResetEmail(''); }}
                  className="mt-4 w-full rounded-md border border-[#1a2a3e] py-2 text-sm font-medium text-[#8ea8c9] hover:bg-[#0a1420]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
