import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EduHiveLogo from '../components/EduHiveLogo';
import { MailIcon, LockIcon, ShieldCheckIcon } from '../components/AuthIcons';

export const Signup = ({ selectedRole = 'student', onBackToLogin, onChangeRole }) => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    college: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleLabels = {
    student: 'Student',
    teacher: 'Professor',
    professional: 'Professional'
  };

  const currentRoleLabel = roleLabels[selectedRole] || 'Student';

  // Role specific content config
  const getRoleConfig = () => {
    switch (selectedRole) {
      case 'teacher':
        return {
          heading: 'Apply as a professor',
          emailLabel: 'Official institutional email',
          emailPlaceholder: 'professor@university.edu',
          collegeLabel: 'College or university',
          collegePlaceholder: 'e.g. MIT Department of CS',
          verificationNotice: 'Professor accounts may require verification before receiving a verified badge.'
        };
      case 'professional':
        return {
          heading: 'Apply as a professional',
          emailLabel: 'Work email',
          emailPlaceholder: 'name@company.com',
          collegeLabel: 'Company or organization',
          collegePlaceholder: 'e.g. Google / Microsoft',
          verificationNotice: 'Professional accounts may require verification before receiving a verified badge.'
        };
      case 'student':
      default:
        return {
          heading: 'Create your student account',
          emailLabel: 'Email address',
          emailPlaceholder: 'student@university.edu',
          collegeLabel: 'College or institution',
          collegePlaceholder: 'e.g. Stanford University',
          verificationNotice: null
        };
    }
  };

  const config = getRoleConfig();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        username: formData.username.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: selectedRole, // sending normalized backend role ('student', 'teacher', or 'professional')
        college: formData.college.trim()
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-dvh flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div 
        className="w-full max-w-lg rounded-3xl border shadow-xl p-6 sm:p-8 md:p-10 transition-all"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <EduHiveLogo showText={true} className="w-8 h-8" textClassName="text-xl font-extrabold tracking-tight" />
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs font-bold theme-text-muted hover:theme-text-primary flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back to login
          </button>
        </div>

        {/* Selected Role Badge & Switcher */}
        <div className="mb-6 flex items-center justify-between p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs theme-text-muted">Selected role:</span>
            <span 
              className="text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider"
              style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
            >
              {currentRoleLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onChangeRole}
            className="text-xs font-bold underline transition-opacity hover:opacity-80 cursor-pointer"
            style={{ color: 'var(--primary)' }}
          >
            Change role
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight theme-text-primary">
            {config.heading}
          </h1>
          <p className="text-xs theme-text-muted mt-1">
            Join EduHive to collaborate and share academic resources
          </p>
        </div>

        {/* Verification Notice for Professor / Professional */}
        {config.verificationNotice && (
          <div className="mb-5 p-3.5 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-start gap-2.5">
            <ShieldCheckIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{config.verificationNotice}</span>
          </div>
        )}

        {/* Server Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl border bg-rose-500/10 border-rose-500/30 text-rose-500 text-xs font-medium" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 theme-text-secondary">
                Username *
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="alex_rivera"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl theme-text-primary transition-all outline-none"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
              />
            </div>

            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 theme-text-secondary">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl theme-text-primary transition-all outline-none"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 theme-text-secondary">
              {config.emailLabel} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-muted">
                <MailIcon className="w-4.5 h-4.5" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={config.emailPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl theme-text-primary transition-all outline-none"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 theme-text-secondary">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-muted">
                <LockIcon className="w-4.5 h-4.5" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="•••••••• (min 6 chars)"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl theme-text-primary transition-all outline-none"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
              />
            </div>
          </div>

          {/* Organization / College Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 theme-text-secondary">
              {config.collegeLabel}
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder={config.collegePlaceholder}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl theme-text-primary transition-all outline-none"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {loading ? 'Creating Account...' : `Register as ${currentRoleLabel}`}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs theme-text-muted font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-bold underline transition-opacity hover:opacity-80 cursor-pointer p-0 border-0 bg-transparent"
            style={{ color: 'var(--primary)' }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
