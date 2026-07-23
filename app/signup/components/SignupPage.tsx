'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, Mail, UserPlus, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { TermsModal } from '@/components/TermsModal';

export function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  function validate(): string | null {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!email.includes('@')) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (!acceptedTerms) return 'You must accept the Terms and Conditions to create an account.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add your project URL and anon key to .env.local to enable sign-up.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            accepted_terms: true,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Could not create your account. Please try again.');
        return;
      }

      setSuccess(true);
      if (data.session) {
        // Email confirmation is disabled on this project — session is active immediately.
        setTimeout(() => router.push('/dashboard'), 1200);
      } else {
        // Default Supabase behavior: a confirmation email was sent.
        setNeedsEmailConfirm(true);
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#000812] px-4 py-6"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      <ParticleCanvas />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[560px] items-center justify-center rounded-[14px] border border-[#0e2a42]/60 shadow-[inset_0_0_140px_rgba(0,26,52,0.35)]">
        <div className="login-card-enter w-full max-w-[460px] px-6 py-10">
          <header className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <svg className="h-[56px] w-[47px]" viewBox="0 0 62 74" fill="none">
                <defs>
                  <linearGradient id="signupLogoSG" x1="31" y1="3" x2="31" y2="72" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0a2244" />
                    <stop offset="100%" stopColor="#030e1c" />
                  </linearGradient>
                </defs>
                <path d="M31 3 L58 13 L58 38 C58 56 45 68 31 72 C17 68 4 56 4 38 L4 13 Z"
                  fill="url(#signupLogoSG)" stroke="#1a5fa0" strokeWidth="1.5" />
                <circle cx="31" cy="38" r="10" fill="#041830" stroke="#0d7acc" strokeWidth="1.2" />
              </svg>
              <div className="flex items-end leading-none" style={{ lineHeight: 1 }}>
                <span className="text-[38px] font-bold text-[#e9eaea]" style={{ fontFamily: 'var(--font-inter)' }}>ML</span>
                <span className="mx-1 mb-[1px] text-[28px] font-bold text-[#005dc9]" style={{ fontFamily: 'var(--font-orbitron)' }}>a</span>
                <span className="text-[38px] text-[#e6e7e7]" style={{ fontFamily: 'var(--font-audiowide)' }}>NDS</span>
              </div>
            </div>
            <p className="mb-1 text-[10px] tracking-[0.22em] text-[#86909a]">CREATE YOUR ACCOUNT</p>
            <p className="text-sm font-medium text-[#02619e]">Monitor. Detect. Protect.</p>
          </header>

          {!needsEmailConfirm ? (
            <>
              {error && (
                <div className="mb-4 rounded border border-[#4a0f14] bg-[#1a0407]/80 px-4 py-2.5 text-sm text-[#ff6b6b]">
                  {error}
                </div>
              )}
              {!isSupabaseConfigured && (
                <div className="mb-4 rounded border border-[#4d3a0a] bg-[#1a1403]/80 px-4 py-2.5 text-[13px] text-[#e0b93d]">
                  Supabase isn&apos;t configured yet, so sign-up is disabled. Add
                  <code className="mx-1 rounded bg-black/30 px-1 py-0.5 text-[12px]">NEXT_PUBLIC_SUPABASE_URL</code>
                  and
                  <code className="mx-1 rounded bg-black/30 px-1 py-0.5 text-[12px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  to <code className="rounded bg-black/30 px-1 py-0.5 text-[12px]">.env.local</code>.
                </div>
              )}
              {success && !needsEmailConfirm && (
                <div className="mb-4 flex items-center gap-2 rounded border border-[#0a4d2a] bg-[#031a0e]/80 px-4 py-2.5 text-sm text-[#22c55e]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
                  Account created. Redirecting to dashboard...
                </div>
              )}

              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <div className="relative group">
                  <User className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#0084ff] transition-colors group-focus-within:text-[#4daeff]" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="login-input h-[58px] w-full rounded-md border-2 border-[#1a2a3e] bg-[#010913] pl-12 pr-4 text-lg text-[#b6d0ee] placeholder:text-[#4d5c6d] transition-all duration-300"
                    autoComplete="name"
                  />
                </div>

                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#0084ff] transition-colors group-focus-within:text-[#4daeff]" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input h-[58px] w-full rounded-md border-2 border-[#1a2a3e] bg-[#010913] pl-12 pr-4 text-lg text-[#b6d0ee] placeholder:text-[#4d5c6d] transition-all duration-300"
                    autoComplete="email"
                  />
                </div>

                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#0084ff] transition-colors group-focus-within:text-[#4daeff]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input h-[58px] w-full rounded-md border-2 border-[#1a2a3e] bg-[#010913] pl-12 pr-11 text-lg text-[#b6d0ee] placeholder:text-[#4d5c6d] transition-all duration-300"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4d5c6d] hover:text-[#8ea8c9]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#0084ff] transition-colors group-focus-within:text-[#4daeff]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="login-input h-[58px] w-full rounded-md border-2 border-[#1a2a3e] bg-[#010913] pl-12 pr-4 text-lg text-[#b6d0ee] placeholder:text-[#4d5c6d] transition-all duration-300"
                    autoComplete="new-password"
                  />
                </div>

                <label className="mt-1 flex items-start gap-2.5 text-[13px] text-[#8ea8c9]">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#1a2a3e] bg-[#010913] accent-[#0f7fff]"
                  />
                  <span>
                    I agree to the{' '}
                    <button type="button" onClick={() => setShowTerms(true)} className="font-semibold text-[#4daeff] hover:underline">
                      Terms and Conditions
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="group relative mt-2 flex h-[60px] w-full items-center justify-center gap-3 overflow-hidden rounded-md text-lg font-bold tracking-wider text-[#c8ddf0] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_6px_32px_rgba(5,96,209,0.5)] active:scale-[0.99] disabled:opacity-80 disabled:hover:scale-100"
                  style={{
                    background: success
                      ? 'linear-gradient(180deg, #0d9e4f 0%, #0a7a3c 100%)'
                      : 'linear-gradient(180deg, #0f7fff 0%, #0560d1 100%)',
                    boxShadow: '0 4px 24px rgba(5,96,209,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  {loading
                    ? <Loader2 className="h-5 w-5 animate-spin" />
                    : success
                    ? <Shield className="h-5 w-5" />
                    : <UserPlus className="h-5 w-5" />}
                  <span>{loading ? 'CREATING ACCOUNT...' : success ? 'ACCOUNT CREATED' : 'SIGN UP'}</span>
                </button>
              </form>

              <p className="mt-5 text-center text-[13px] text-[#607089]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[#4daeff] hover:underline">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            <div className="rounded-lg border border-[#1a2a3e] bg-[#050b14] p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0d9e4f]/20">
                <CheckCircle2 className="h-6 w-6 text-[#2ecc71]" />
              </div>
              <h2 className="text-base font-bold text-[#c8ddf0]">Check your email</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8ea8c9]">
                We&apos;ve sent a confirmation link to <span className="font-medium text-[#b6d0ee]">{email}</span>.
                Confirm your address to finish creating your account.
              </p>
              <Link
                href="/login"
                className="mt-5 flex items-center justify-center rounded-md border border-[#1a2a3e] py-2 text-sm font-medium text-[#8ea8c9] hover:bg-[#0a1420]"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </section>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </main>
  );
}
