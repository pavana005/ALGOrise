import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import {
  Mail,
  Lock,
  User,
  AtSign,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  Loader2,
  XCircle,
  Code2,
  Terminal,
  Cpu,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const {
    login,
    signup,
    loginWithGoogle,
    loginAsGuest,
    checkUsernameAvailability,
    requestPasswordReset,
    resetPasswordWithToken
  } = useAuth();

  // Determine initial mode from current path or hash
  const getInitialMode = (): 'login' | 'signup' | 'forgot' | 'reset' => {
    const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
    if (path.includes('signup') || hash.includes('signup')) return 'signup';
    if (path.includes('forgot') || hash.includes('forgot')) return 'forgot';
    if (path.includes('reset') || hash.includes('reset') || hash.includes('token=')) return 'reset';
    return 'login';
  };

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(getInitialMode);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Username live availability checking state
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
    reason?: 'invalid_format' | 'taken' | 'available';
  }>({ checking: false });

  // Forgot / Reset Password state
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [generatedResetToken, setGeneratedResetToken] = useState<string | null>(null);

  // Response & status states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    resetToken?: string;
    newPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mode switcher with history sync
  const switchMode = useCallback((newMode: 'login' | 'signup' | 'forgot' | 'reset') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setGeneratedResetToken(null);
    setFieldErrors({});

    const targetPath =
      newMode === 'signup'
        ? '/signup'
        : newMode === 'forgot'
        ? '/forgot-password'
        : newMode === 'reset'
        ? '/reset-password'
        : '/login';

    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, []);

  // Listen for browser popstate & hashchange to keep mode in sync
  useEffect(() => {
    const handleLocationChange = () => {
      const detected = getInitialMode();
      setMode(detected);
      const hash = window.location.hash;
      if (hash.includes('token=')) {
        const match = hash.match(/token=([^&]+)/);
        if (match && match[1]) {
          setResetTokenInput(decodeURIComponent(match[1]));
          setMode('reset');
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Debounced Username availability checker (300ms)
  useEffect(() => {
    if (mode !== 'signup') return;
    const clean = username.trim().toLowerCase().replace(/^@/, '');
    if (!clean) {
      setUsernameStatus({ checking: false });
      return;
    }

    setUsernameStatus({ checking: true });
    const timer = setTimeout(() => {
      const res = checkUsernameAvailability(clean);
      setUsernameStatus({
        checking: false,
        available: res.available,
        message: res.message,
        reason: res.reason
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [username, mode, checkUsernameAvailability]);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    const cleanEmail = email.trim();
    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');

    if (mode === 'signup') {
      if (!cleanName) {
        errors.name = 'Full name is required.';
      }

      if (!cleanUsername) {
        errors.username = 'Username is required.';
      } else {
        const availCheck = checkUsernameAvailability(cleanUsername);
        if (!availCheck.available) {
          errors.username = availCheck.message;
        }
      }
    }

    if (mode === 'login' || mode === 'signup' || mode === 'forgot') {
      if (!cleanEmail) {
        errors.email = mode === 'login' ? 'Enter your username or email address.' : 'Email address is required.';
      } else if (mode !== 'login' && (!cleanEmail.includes('@') || !cleanEmail.includes('.'))) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    if (mode === 'login' || mode === 'signup') {
      if (!password) {
        errors.password = 'Enter your password.';
      } else if (mode === 'signup' && password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      }
    }

    if (mode === 'reset') {
      if (!resetTokenInput.trim()) {
        errors.resetToken = 'Reset token is required.';
      }
      if (!newPasswordInput) {
        errors.newPassword = 'New password is required.';
      } else if (newPasswordInput.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters.';
      } else if (newPasswordInput !== confirmPasswordInput) {
        errors.newPassword = 'Passwords do not match.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
        if (onSuccess) onSuccess();
      } else if (mode === 'signup') {
        await signup(name.trim(), username.trim().toLowerCase().replace(/^@/, ''), email.trim(), password);
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        const res = await requestPasswordReset(email.trim());
        setSuccessMessage(res.message);
        if (res.resetToken) {
          setGeneratedResetToken(res.resetToken);
        }
      } else if (mode === 'reset') {
        const res = resetPasswordWithToken(resetTokenInput.trim(), newPasswordInput);
        setSuccessMessage(res.message);
        setTimeout(() => {
          switchMode('login');
          setPassword('');
          setNewPasswordInput('');
          setConfirmPasswordInput('');
        }, 2000);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication operation failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Google authentication could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      await loginAsGuest();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Could not start guest session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-root-container">
      <style>{`
        .login-root-container {
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-page, #0B0F17);
          background-image: 
            radial-gradient(circle at 12% 20%, rgba(59, 130, 246, 0.14) 0%, transparent 45%),
            radial-gradient(circle at 88% 80%, rgba(236, 72, 153, 0.10) 0%, transparent 40%),
            radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 28px 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          color: var(--text-primary, #F8FAFC);
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
          box-sizing: border-box;
        }

        .login-main-layout {
          width: 100%;
          max-width: 1120px;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 48px;
          align-items: center;
        }

        @media (max-width: 960px) {
          .login-main-layout {
            grid-template-columns: 1fr;
            max-width: 480px;
            gap: 24px;
          }
          .login-hero-desktop {
            display: none !important;
          }
          .login-hero-mobile {
            display: flex !important;
          }
        }

        @media (min-width: 961px) {
          .login-hero-mobile {
            display: none !important;
          }
        }

        .login-card {
          background-color: var(--bg-card, #131C2E);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-subtle, #1E293B);
          border-radius: 18px;
          padding: 32px 28px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03);
          transition: border-color var(--transition-normal);
        }

        .login-card:focus-within {
          border-color: rgba(59, 130, 246, 0.4);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary, #94A3B8);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          width: 17px;
          height: 17px;
          color: var(--text-muted, #64748B);
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .custom-input {
          width: 100%;
          height: 44px;
          padding: 0 14px 0 42px;
          background-color: var(--bg-input, #0D1117);
          border: 1px solid var(--border-medium, #334155);
          border-radius: 10px;
          color: var(--text-primary, #F8FAFC);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .custom-input::placeholder {
          color: var(--placeholder-text, #64748B);
          opacity: 0.85;
        }

        .custom-input:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
          background-color: #0E1524;
        }

        .custom-input:focus + .input-icon,
        .input-wrapper:focus-within .input-icon {
          color: #38BDF8;
        }

        .custom-input.input-error {
          border-color: #EF4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
        }

        .custom-input.input-success {
          border-color: #10B981 !important;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted, #64748B);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .password-toggle-btn:hover {
          color: var(--text-primary, #F8FAFC);
          background-color: rgba(255, 255, 255, 0.06);
        }

        .primary-action-btn {
          width: 100%;
          height: 44px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%);
          border: none;
          border-radius: 10px;
          color: #FFFFFF;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .primary-action-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
          transform: translateY(-1px);
        }

        .primary-action-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .primary-action-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }

        .google-auth-btn {
          width: 100%;
          height: 44px;
          background-color: var(--bg-elevated, #1E293B);
          border: 1px solid var(--border-medium, #334155);
          border-radius: 10px;
          color: var(--text-primary, #F8FAFC);
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .google-auth-btn:hover:not(:disabled) {
          background-color: #26334D;
          border-color: #475569;
          transform: translateY(-1px);
        }

        .google-auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .hero-feature-card {
          background: rgba(19, 28, 46, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .hero-feature-card:hover {
          background: rgba(19, 28, 46, 0.85);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="login-main-layout">
        {/* Left Column: Hero & Platform Showcase (Desktop) */}
        <div className="login-hero-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Logo & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Logo size="lg" variant="full" showTagline />
          </div>

          {/* Headline & Value Proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '20px',
                color: '#38BDF8',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                width: 'fit-content'
              }}
            >
              <Sparkles style={{ width: 14, height: 14, color: '#EC4899' }} />
              <span>Interactive Algorithmic Learning</span>
            </div>

            <h1
              style={{
                fontSize: '2.3rem',
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
                margin: 0,
                color: 'var(--text-primary, #F8FAFC)'
              }}
            >
              Understand the logic.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Master the code.
              </span>
            </h1>

            <p
              style={{
                fontSize: '0.96rem',
                color: 'var(--text-secondary, #94A3B8)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '480px'
              }}
            >
              Algorise combines verified coding challenges, multi-language execution judges, step-by-step visualizers, and a 1,700+ technical interview question bank into one cohesive learning ecosystem.
            </p>
          </div>

          {/* Feature Highlight Cards Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="hero-feature-card">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Code2 style={{ width: 18, height: 18, color: '#38BDF8' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  3,088 Curated Problems
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  3 progressive difficulty tiers with verified test cases.
                </div>
              </div>
            </div>

            <div className="hero-feature-card">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Terminal style={{ width: 18, height: 18, color: '#EC4899' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Multi-Language Judge
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Real-time execution across 7 languages with stdin capture.
                </div>
              </div>
            </div>

            <div className="hero-feature-card">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Cpu style={{ width: 18, height: 18, color: '#A78BFA' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Algorithm Visualizers
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Interactive state steppers for arrays, trees & graphs.
                </div>
              </div>
            </div>

            <div className="hero-feature-card">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck style={{ width: 18, height: 18, color: '#34D399' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Forensic Crime Lab
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  100 realistic debugging scenarios with stack traces.
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '10px 16px',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid var(--border-subtle, #1E293B)',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: 'var(--text-muted, #64748B)'
            }}
          >
            <Layers style={{ width: 15, height: 15, color: '#38BDF8' }} />
            <span><strong style={{ color: 'var(--text-primary)' }}>3,088</strong> Problems</span>
            <span>•</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>7</strong> Languages</span>
            <span>•</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>1,700+</strong> Interview Qs</span>
            <span>•</span>
            <span style={{ color: '#10B981', fontWeight: 600 }}>100% Verified</span>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {/* Mobile Header Branding */}
          <div className="login-hero-mobile" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center', marginBottom: '4px' }}>
            <Logo size="md" variant="full" showTagline />
          </div>

          <div className="login-card">
            {/* Mode Switcher Tabs for Login & Signup */}
            {(mode === 'login' || mode === 'signup') && (
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-elevated, #1E293B)',
                  padding: '4px',
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => switchMode('login')}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: mode === 'login' ? '#3B82F6' : 'transparent',
                    color: mode === 'login' ? '#FFFFFF' : 'var(--text-secondary, #94A3B8)',
                    boxShadow: mode === 'login' ? '0 2px 8px rgba(59, 130, 246, 0.35)' : 'none'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'signup'}
                  onClick={() => switchMode('signup')}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: mode === 'signup' ? '#3B82F6' : 'transparent',
                    color: mode === 'signup' ? '#FFFFFF' : 'var(--text-secondary, #94A3B8)',
                    boxShadow: mode === 'signup' ? '0 2px 8px rgba(59, 130, 246, 0.35)' : 'none'
                  }}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Form Header Title */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary, #F8FAFC)', margin: 0, letterSpacing: '-0.02em' }}>
                {mode === 'login' && 'Welcome back'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot' && 'Reset your password'}
                {mode === 'reset' && 'Set new password'}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '4px', marginBottom: 0 }}>
                {mode === 'login' && 'Sign in to continue your learning journey.'}
                {mode === 'signup' && 'Join Algorise to unlock visualizers & track your interview prep.'}
                {mode === 'forgot' && 'Enter your account email or username to receive reset instructions.'}
                {mode === 'reset' && 'Enter your reset token and new password to restore account access.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#EF4444',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '18px'
                }}
              >
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div
                role="status"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#10B981',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{successMessage}</span>
                </div>
                {mode === 'forgot' && generatedResetToken && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetTokenInput(generatedResetToken);
                      switchMode('reset');
                    }}
                    className="primary-action-btn"
                    style={{
                      height: '34px',
                      fontSize: '0.78rem',
                      padding: '0 12px',
                      marginTop: '4px',
                      width: 'fit-content'
                    }}
                  >
                    <span>Proceed to Set New Password</span>
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                )}
              </div>
            )}

            {/* Google OAuth Button (Login & Signup modes) */}
            {(mode === 'login' || mode === 'signup') && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="google-auth-btn"
                  aria-label="Continue with Google"
                >
                  <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.36 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '18px 0'
                  }}
                >
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle, #1E293B)' }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    or with credentials
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle, #1E293B)' }} />
                </div>
              </>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Full Name field (Signup mode) */}
              {mode === 'signup' && (
                <div className="input-group">
                  <label htmlFor="auth-name" className="input-label">
                    Full Name
                  </label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      id="auth-name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setName(val);
                        if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                        if (!username) {
                          const cand = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
                          if (cand.length >= 3) setUsername(cand.substring(0, 30));
                        }
                      }}
                      className={`custom-input ${fieldErrors.name ? 'input-error' : ''}`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <span style={{ fontSize: '0.74rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.name}</span>
                  )}
                </div>
              )}

              {/* Username field (Signup mode) */}
              {mode === 'signup' && (
                <div className="input-group">
                  <div className="input-label-row">
                    <label htmlFor="auth-username" className="input-label">
                      Username
                    </label>
                    {usernameStatus.checking && (
                      <span style={{ fontSize: '0.72rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> Checking...
                      </span>
                    )}
                    {!usernameStatus.checking && username.trim() && usernameStatus.reason === 'available' && (
                      <span id="auth-username-status" style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle2 style={{ width: 12, height: 12 }} /> @{username.trim().toLowerCase().replace(/^@/, '')} is available
                      </span>
                    )}
                    {!usernameStatus.checking && username.trim() && (usernameStatus.reason === 'taken' || usernameStatus.reason === 'invalid_format') && (
                      <span style={{ fontSize: '0.72rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <XCircle style={{ width: 12, height: 12 }} /> {usernameStatus.message}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <AtSign className="input-icon" />
                    <input
                      id="auth-username"
                      type="text"
                      autoComplete="username"
                      required
                      placeholder="alexrivera"
                      value={username}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                        setUsername(val);
                        if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: undefined }));
                      }}
                      className={`custom-input ${
                        fieldErrors.username || (username.trim() && usernameStatus.reason && usernameStatus.reason !== 'available')
                          ? 'input-error'
                          : username.trim() && usernameStatus.reason === 'available'
                          ? 'input-success'
                          : ''
                      }`}
                    />
                  </div>
                  {fieldErrors.username && (
                    <span style={{ fontSize: '0.74rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.username}</span>
                  )}
                </div>
              )}

              {/* Email / Username field (Login, Signup, Forgot modes) */}
              {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
                <div className="input-group">
                  <label htmlFor="auth-email-username" className="input-label">
                    {mode === 'login' ? 'Username or Email' : 'Email Address'}
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      id="auth-email-username"
                      type={mode === 'login' ? 'text' : 'email'}
                      autoComplete={mode === 'login' ? 'username' : 'email'}
                      required
                      placeholder={mode === 'login' ? 'alex@example.com or @alexrivera' : 'alex@example.com'}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      className={`custom-input ${fieldErrors.email ? 'input-error' : ''}`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <span style={{ fontSize: '0.74rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.email}</span>
                  )}
                </div>
              )}

              {/* Password field (Login & Signup modes) */}
              {(mode === 'login' || mode === 'signup') && (
                <div className="input-group">
                  <div className="input-label-row">
                    <label htmlFor="auth-password" className="input-label">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#38BDF8',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      required
                      placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      className={`custom-input ${fieldErrors.password ? 'input-error' : ''}`}
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span style={{ fontSize: '0.74rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.password}</span>
                  )}
                </div>
              )}

              {/* Reset Token & New Password fields (Reset mode) */}
              {mode === 'reset' && (
                <>
                  <div className="input-group">
                    <label htmlFor="auth-reset-token" className="input-label">
                      Reset Token
                    </label>
                    <div className="input-wrapper">
                      <KeyRound className="input-icon" />
                      <input
                        id="auth-reset-token"
                        type="text"
                        required
                        placeholder="rst_..."
                        value={resetTokenInput}
                        onChange={(e) => setResetTokenInput(e.target.value)}
                        className="custom-input"
                        style={{ fontFamily: 'monospace', fontSize: '0.84rem' }}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="auth-new-password" className="input-label">
                      New Password
                    </label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        id="auth-new-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="custom-input"
                        style={{ paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle-btn"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="auth-confirm-password" className="input-label">
                      Confirm New Password
                    </label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        id="auth-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        minLength={6}
                        placeholder="Re-enter new password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="custom-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-action-btn"
                style={{ marginTop: '8px' }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                    <span>
                      {mode === 'login' && 'Signing In...'}
                      {mode === 'signup' && 'Creating Account...'}
                      {mode === 'forgot' && 'Sending Reset Link...'}
                      {mode === 'reset' && 'Resetting Password...'}
                    </span>
                  </span>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Email'}
                      {mode === 'reset' && 'Reset Password'}
                    </span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper (Login mode) */}
            {mode === 'login' && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-elevated, #1E293B)',
                  border: '1px dashed var(--border-medium, #334155)',
                  borderRadius: '10px'
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary, #94A3B8)', marginBottom: '6px' }}>
                  Quick Demo Accounts (Click to Auto-fill):
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('pav005');
                      setPassword('Secret_._05');
                      setError(null);
                      setFieldErrors({});
                    }}
                    style={{
                      fontSize: '0.74rem',
                      padding: '5px 10px',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      color: '#38BDF8',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      transition: 'all 0.15s ease'
                    }}
                    title="Username: pav005 | Password: Secret_._05 (Full Admin Privileges)"
                  >
                    Admin (pav005)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('demo@algorise.io');
                      setPassword('password123');
                      setError(null);
                      setFieldErrors({});
                    }}
                    style={{
                      fontSize: '0.74rem',
                      padding: '5px 10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      transition: 'all 0.15s ease'
                    }}
                    title="Email: demo@algorise.io | Password: password123 (Verified Student)"
                  >
                    Demo User (demo@algorise.io)
                  </button>
                </div>
              </div>
            )}

            {/* Guest Mode Option (Login & Signup modes) */}
            {(mode === 'login' || mode === 'signup') && (
              <div style={{ marginTop: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle, #1E293B)' }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    or explore without account
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle, #1E293B)' }} />
                </div>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    height: '42px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    borderRadius: '10px',
                    color: 'var(--text-primary, #F8FAFC)',
                    backgroundColor: 'rgba(234, 179, 8, 0.06)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <User style={{ width: 16, height: 16, color: '#EAB308' }} />
                  <span>Continue as Guest</span>
                </button>
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted, #64748B)',
                    textAlign: 'center',
                    marginTop: '8px',
                    marginBottom: 0,
                    lineHeight: 1.4
                  }}
                >
                  Guest sessions are temporary and isolated. Solved problems and streak history will not be saved permanently.
                </p>
              </div>
            )}

            {/* Back to Login Link for Forgot & Reset modes */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div style={{ marginTop: '18px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38BDF8',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft style={{ width: 15, height: 15 }} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            )}

            {/* Bottom Switch Footer */}
            {(mode === 'login' || mode === 'signup') && (
              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary, #94A3B8)' }}>
                {mode === 'login' ? (
                  <span>
                    New to Algorise?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38BDF8',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Create an account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38BDF8',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
