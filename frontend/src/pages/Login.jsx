import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EduHiveLogo from '../components/EduHiveLogo';
import { 
  MailIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  ArrowRightIcon, 
  GoogleIcon, 
  GitHubIcon,
  CommunityIcon,
  VerifiedIcon,
  ResourceIcon
} from '../components/AuthIcons';

export const Login = ({ onOpenRoleModal }) => {
  const { login } = useAuth();

  // Remember me initial email restore
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Messages
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('eduhive_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setServerError('');
    setInfoMessage('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');
    setInfoMessage('');

    try {
      await login({ email: email.trim(), password });

      // Handle Remember Me storage
      if (rememberMe) {
        localStorage.setItem('eduhive_remembered_email', email.trim());
      } else {
        localStorage.removeItem('eduhive_remembered_email');
      }
    } catch (err) {
      setServerError(err.message || 'Login failed. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setServerError('');
    setInfoMessage('Password recovery will be available soon.');
  };

  const handleSocialLogin = (provider) => {
    setServerError('');
    setInfoMessage(`${provider} login will be available soon.`);
  };

  return (
    <div 
      className="min-h-dvh flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      {/* Main Centered Auth Container */}
      <div 
        className="w-full max-w-5xl rounded-3xl border shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 max-h-none lg:max-h-[85dvh]"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        
        {/* LEFT PANEL */}
        <div 
          className="relative p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-slate-50 dark:from-slate-900/90 dark:via-blue-950/40 dark:to-slate-900 border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {/* Subtle Decorative Gradient Shapes */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          {/* Top Header & Logo */}
          <div className="relative z-10">
            <EduHiveLogo showText={true} className="w-9 h-9" textClassName="text-2xl font-black tracking-tight" />
            
            <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
              style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}>
              YOUR ACADEMIC COMMUNITY
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight theme-text-primary">
              Learn, discuss and{' '}
              <span style={{ color: 'var(--primary)' }}>grow together.</span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm theme-text-muted leading-relaxed max-w-md">
              Connect with students, trusted professors and experienced professionals in one learning platform.
            </p>
          </div>

          {/* Feature List */}
          <div className="relative z-10 my-6 space-y-3.5">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl border transition-all hover:bg-white/60 dark:hover:bg-slate-800/40" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <CommunityIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold theme-text-primary">Learning communities</h2>
                <p className="text-[11px] sm:text-xs theme-text-muted">Ask questions and exchange knowledge.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl border transition-all hover:bg-white/60 dark:hover:bg-slate-800/40" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <VerifiedIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold theme-text-primary">Verified contributors</h2>
                <p className="text-[11px] sm:text-xs theme-text-muted">Learn from trusted academic experts.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl border transition-all hover:bg-white/60 dark:hover:bg-slate-800/40" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ResourceIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold theme-text-primary">Useful resources</h2>
                <p className="text-[11px] sm:text-xs theme-text-muted">Discover organized learning materials.</p>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 text-[11px] theme-text-muted font-medium">
            © 2026 EduHive. All rights reserved.
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight theme-text-primary">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm theme-text-muted mt-1">
                Sign in to continue to EduHive
              </p>
            </div>

            {/* General Server Error Message */}
            {serverError && (
              <div 
                className="mb-5 p-3.5 rounded-2xl border bg-rose-500/10 border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2"
                role="alert"
                aria-live="assertive"
              >
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* Info Message (For OAuth / Password Recovery) */}
            {infoMessage && (
              <div 
                className="mb-5 p-3.5 rounded-2xl border bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-2"
                role="status"
                aria-live="polite"
              >
                <span>ℹ️</span>
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="login-email" 
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5 theme-text-secondary"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-muted">
                    <MailIcon className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl theme-text-primary transition-all outline-none"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: emailError ? '1px solid var(--danger)' : '1px solid var(--input-border)'
                    }}
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="mt-1 text-[11px] text-rose-500 font-medium" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="login-password" 
                    className="block text-xs font-bold uppercase tracking-wider theme-text-secondary"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold transition-opacity hover:opacity-80 cursor-pointer"
                    style={{ color: 'var(--primary)' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-muted">
                    <LockIcon className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl theme-text-primary transition-all outline-none"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: passwordError ? '1px solid var(--danger)' : '1px solid var(--input-border)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center theme-text-muted hover:theme-text-primary cursor-pointer"
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="mt-1 text-[11px] text-rose-500 font-medium" role="alert">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs theme-text-secondary select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <span>{loading ? 'Signing in...' : 'Continue'}</span>
                {!loading && <ArrowRightIcon className="w-4 h-4" />}
              </button>
            </form>

            {/* Social Login Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }} />
              <span className="text-[11px] theme-text-muted uppercase tracking-wider font-semibold">
                or continue with
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }} />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-500/5 theme-text-primary cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-500/5 theme-text-primary cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <GitHubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Bottom Switch to Register Link */}
          <div className="mt-6 text-center text-xs theme-text-muted font-medium">
            New to EduHive?{' '}
            <button
              type="button"
              onClick={onOpenRoleModal}
              className="font-bold underline transition-opacity hover:opacity-80 cursor-pointer p-0 border-0 bg-transparent"
              style={{ color: 'var(--primary)' }}
            >
              Create account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
