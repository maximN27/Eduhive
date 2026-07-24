import React from 'react';

export default function EduHiveLogo({ className = 'w-8 h-8', showText = true, textClassName = 'text-xl font-black tracking-tight' }) {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div 
        className={`${className} rounded-xl p-1.5 shadow-sm flex items-center justify-center transition-transform hover:scale-105 shrink-0`}
        style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF' }}
        aria-hidden="true"
      >
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      </div>
      {showText && (
        <span className={textClassName}>
          <span style={{ color: 'var(--text-primary)' }}>Edu</span>
          <span style={{ color: 'var(--primary)' }}>Hive</span>
        </span>
      )}
    </div>
  );
}
