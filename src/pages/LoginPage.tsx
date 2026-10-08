import React, { useState, useEffect } from 'react';
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
  XCircle
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, signup, loginWithGoogle, loginAsGuest, checkUsernameAvailability, requestPasswordReset, resetPasswordWithToken } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
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

  // Response & status states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; username?: string; email?: string; password?: string; resetToken?: string; newPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced Username availability checker (300ms)
  useEffect(() => {
    if (mode !== 'signup') return;
    const clean = username.trim().toLowerCase();
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

  // Check URL hash for reset token parameters (e.g., #reset-password?token=rst_12345)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('reset-password') || hash.includes('token=')) {
      const match = hash.match(/token=([^&]+)/);
      if (match && match[1]) {
        setResetTokenInput(decodeURIComponent(match[1]));
        setMode('reset');
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    const cleanEmail = email.trim();
    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();

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
        errors.email = 'Email or username is required.';
      } else if (mode !== 'login' && (!cleanEmail.includes('@') || !cleanEmail.includes('.'))) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    if (mode === 'login' || mode === 'signup') {
      if (!password) {
        errors.password = 'Password is required.';
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
        await login(email.trim(), password.trim());
        if (onSuccess) onSuccess();
      } else if (mode === 'signup') {
        await signup(name.trim(), username.trim().toLowerCase(), email.trim(), password);
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        const res = await requestPasswordReset(email.trim());
        setSuccessMessage(res.message);
      } else if (mode === 'reset') {
        const res = resetPasswordWithToken(resetTokenInput.trim(), newPasswordInput);
        setSuccessMessage(res.message);
        setTimeout(() => {
          setMode('login');
          setSuccessMessage(null);
          setPassword('');
          setNewPasswordInput('');
          setConfirmPasswordInput('');
        }, 2000);
      }
    } catch (err: any) {
      setError(err?.message || 'Operation failed. Please try again.');
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
      setError(err?.message || 'Google authentication failed.');
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
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 75%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {/* ALGOrise Logo Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <Logo size="lg" variant="full" showTagline />
        </div>

        {/* Authentication Card */}
        <div
          className="card"
          style={{
            width: '100%',
            padding: '28px 24px',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Mode Switcher Tabs for Login & Signup */}
          {(mode === 'login' || mode === 'signup') && (
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-elevated)',
                padding: '4px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                  setFieldErrors({});
                }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: mode === 'login' ? 'var(--accent-primary)' : 'transparent',
                  color: mode === 'login' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMessage(null);
                  setFieldErrors({});
                }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: mode === 'signup' ? 'var(--accent-primary)' : 'transparent',
                  color: mode === 'signup' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Form Header Title */}
          <div style={{ marginBottom: '18px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Set New Password'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
              {mode === 'login' && 'Sign in to access your saved DSA progress & code solutions'}
              {mode === 'signup' && 'Join ALGOrise to unlock visualizers & track your interview prep'}
              {mode === 'forgot' && 'Enter your account email to receive a password reset link'}
              {mode === 'reset' && 'Enter your reset token and new password to restore account access'}
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
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
              <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Auth Button (Login & Signup modes) */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '11px 16px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginBottom: '18px'
                }}
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
                  marginBottom: '18px'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  or with email
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
              </div>
            </>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name field (Signup mode) */}
            {mode === 'signup' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 16,
                        height: 16,
                        color: 'var(--text-muted)'
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setName(val);
                        if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                        // Auto candidate username if username empty
                        if (!username) {
                          const cand = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
                          if (cand.length >= 3) setUsername(cand.substring(0, 30));
                        }
                      }}
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        backgroundColor: 'var(--bg-input)',
                        border: `1px solid ${fieldErrors.name ? '#EF4444' : 'var(--border-subtle)'}`,
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {fieldErrors.name && (
                    <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.name}</span>
                  )}
                </div>

                {/* Username field (Signup mode) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Username
                    </label>
                    {usernameStatus.checking && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> Checking...
                      </span>
                    )}
                    {!usernameStatus.checking && username.trim() && usernameStatus.reason === 'available' && (
                      <span style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle2 style={{ width: 12, height: 12 }} /> @{username.trim().toLowerCase()} is available
                      </span>
                    )}
                    {!usernameStatus.checking && username.trim() && (usernameStatus.reason === 'taken' || usernameStatus.reason === 'invalid_format') && (
                      <span style={{ fontSize: '0.72rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <XCircle style={{ width: 12, height: 12 }} /> {usernameStatus.message}
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <AtSign
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 16,
                        height: 16,
                        color: 'var(--text-muted)'
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="alexrivera"
                      value={username}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                        setUsername(val);
                        if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: undefined }));
                      }}
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        backgroundColor: 'var(--bg-input)',
                        border: `1px solid ${
                          fieldErrors.username || (username.trim() && usernameStatus.reason && usernameStatus.reason !== 'available')
                            ? '#EF4444'
                            : username.trim() && usernameStatus.reason === 'available'
                            ? '#10B981'
                            : 'var(--border-subtle)'
                        }`,
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {fieldErrors.username && (
                    <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.username}</span>
                  )}
                </div>
              </>
            )}

            {/* Email / Username field (Login, Signup, Forgot modes) */}
            {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {mode === 'login' ? 'Email Address or @Username' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 16,
                      height: 16,
                      color: 'var(--text-muted)'
                    }}
                  />
                  <input
                    type={mode === 'login' ? 'text' : 'email'}
                    required
                    placeholder={mode === 'login' ? 'alex@example.com or @alexrivera' : 'alex@example.com'}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      backgroundColor: 'var(--bg-input)',
                      border: `1px solid ${fieldErrors.email ? '#EF4444' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
                {fieldErrors.email && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.email}</span>
                )}
              </div>
            )}

            {/* Password field (Login & Signup modes) */}
            {(mode === 'login' || mode === 'signup') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError(null);
                        setSuccessMessage(null);
                        setFieldErrors({});
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-primary)',
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
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 16,
                      height: 16,
                      color: 'var(--text-muted)'
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      backgroundColor: 'var(--bg-input)',
                      border: `1px solid ${fieldErrors.password ? '#EF4444' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '2px' }}>{fieldErrors.password}</span>
                )}
              </div>
            )}

            {/* Reset Token & New Password fields (Reset mode) */}
            {mode === 'reset' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Reset Token
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 16,
                        height: 16,
                        color: 'var(--text-muted)'
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="rst_..."
                      value={resetTokenInput}
                      onChange={(e) => setResetTokenInput(e.target.value)}
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 16,
                        height: 16,
                        color: 'var(--text-muted)'
                      }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 38px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 16,
                        height: 16,
                        color: 'var(--text-muted)'
                      }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Main Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px 16px',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isSubmitting ? 0.75 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <span>
                  {mode === 'login' && 'Signing in...'}
                  {mode === 'signup' && 'Creating Account...'}
                  {mode === 'forgot' && 'Sending Reset Link...'}
                  {mode === 'reset' && 'Resetting Password...'}
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

          {/* Continue as Guest Option (Login & Signup modes) */}
          {(mode === 'login' || mode === 'signup') && (
            <div style={{ marginTop: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  or try without account
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isSubmitting}
                className="btn btn-outline"
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderColor: 'rgba(234, 179, 8, 0.4)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(234, 179, 8, 0.05)'
                }}
              >
                <User style={{ width: 15, height: 15, color: '#EAB308' }} />
                <span>Continue as Guest</span>
              </button>
              <p
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  marginTop: '6px',
                  marginBottom: 0
                }}
              >
                Guest session is temporary. Solved problems, streak, & history will not be saved permanently.
              </p>
            </div>
          )}

          {/* Back to Login link for Forgot & Reset modes */}
          {(mode === 'forgot' || mode === 'reset') && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                  setFieldErrors({});
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
