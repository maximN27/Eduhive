import React, { useEffect, useRef } from 'react';
import { GraduationCapIcon, TeacherIcon, BriefcaseIcon, ShieldCheckIcon } from './AuthIcons';

export default function RoleSelectionModal({ isOpen, onClose, onSelectRole }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Keyboard accessibility and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus management
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRoleClick = (role) => {
    onSelectRole(role);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl p-6 md:p-8 rounded-3xl border shadow-2xl relative transition-all animate-in zoom-in-95 duration-200"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
        aria-describedby="role-modal-description"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-sm font-bold theme-text-muted hover:theme-text-primary hover:bg-slate-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          aria-label="Close role selection modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center border shadow-sm" style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)', color: 'var(--primary)' }}>
            <GraduationCapIcon className="w-6 h-6" />
          </div>
          <h2 id="role-modal-title" className="text-xl md:text-2xl font-bold tracking-tight theme-text-primary">
            Choose your role
          </h2>
          <p id="role-modal-description" className="text-xs md:text-sm theme-text-muted mt-1">
            How are you joining EduHive? Select your profile type to continue.
          </p>
        </div>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Student */}
          <div 
            onClick={() => handleRoleClick('student')}
            className="group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:border-blue-500 hover:shadow-lg cursor-pointer text-left"
            style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRoleClick('student'); } }}
          >
            <div>
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <GraduationCapIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary mb-1">
                Student
              </h3>
              <p className="text-xs theme-text-muted leading-relaxed">
                Learn, discuss and access resources with peers.
              </p>
            </div>
            <button 
              type="button"
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer"
            >
              Create student account
            </button>
          </div>

          {/* 2. Professor */}
          <div 
            onClick={() => handleRoleClick('teacher')}
            className="group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:border-emerald-500 hover:shadow-lg cursor-pointer text-left relative"
            style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRoleClick('teacher'); } }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <TeacherIcon className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <ShieldCheckIcon className="w-3 h-3" />
                  Required
                </span>
              </div>
              <h3 className="text-base font-bold theme-text-primary mb-1">
                Professor
              </h3>
              <p className="text-xs theme-text-muted leading-relaxed">
                Teach and verify academic knowledge.
              </p>
            </div>
            <button 
              type="button"
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white transition-colors cursor-pointer"
            >
              Apply as professor
            </button>
          </div>

          {/* 3. Professional */}
          <div 
            onClick={() => handleRoleClick('professional')}
            className="group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:border-purple-500 hover:shadow-lg cursor-pointer text-left relative"
            style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRoleClick('professional'); } }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <BriefcaseIcon className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <ShieldCheckIcon className="w-3 h-3" />
                  Required
                </span>
              </div>
              <h3 className="text-base font-bold theme-text-primary mb-1">
                Professional
              </h3>
              <p className="text-xs theme-text-muted leading-relaxed">
                Mentor students and share experience.
              </p>
            </div>
            <button 
              type="button"
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white transition-colors cursor-pointer"
            >
              Apply as professional
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
