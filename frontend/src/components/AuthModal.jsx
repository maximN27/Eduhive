import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthModal({ isOpen, onClose }) {
  const { authMode, setAuthMode, handleLogin, handleRegister } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('Student');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        const res = await handleLogin(email, password);
        if (!res.success) {
          setErrorMsg(res.message || 'Login failed. Please check credentials.');
        } else {
          onClose();
        }
      } else {
        const res = await handleRegister({
          username,
          name,
          email,
          password,
          college,
          role
        });
        if (!res.success) {
          setErrorMsg(res.message || 'Registration failed. Please try again.');
        } else {
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md p-6 rounded-3xl border shadow-2xl relative transition-all"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-xs font-bold theme-text-muted hover:theme-text-primary"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎓</span>
            <h2 className="text-lg font-bold theme-text-primary">
              {authMode === 'login' ? 'Sign In to EduHive' : 'Create Scholar Account'}
            </h2>
          </div>
          <p className="text-xs theme-text-muted">
            {authMode === 'login'
              ? 'Access academic posts, join communities & sync your study streak'
              : 'Join thousands of students and academic researchers'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alex_rivera"
                    className="w-full border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">
                    College / Institution
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="MIT"
                    className="w-full border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">
                    Academic Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
                  >
                    <option value="Student">Student</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Professor">Professor</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@eduhive.edu"
              className="w-full border rounded-xl px-3.5 py-2 text-xs theme-text-primary focus:outline-none"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-xl px-3.5 py-2 text-xs theme-text-primary focus:outline-none"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md mt-2"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {submitting ? 'Authenticating...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-5 pt-4 border-t text-center text-xs theme-text-muted" style={{ borderColor: 'var(--border-color)' }}>
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => { setErrorMsg(''); setAuthMode('register'); }}
                className="font-bold underline hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                Register Now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => { setErrorMsg(''); setAuthMode('login'); }}
                className="font-bold underline hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
