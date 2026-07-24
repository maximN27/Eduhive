import React from 'react';
import { useApp } from '../context/AppContext';

export default function SavedResourceItem({ resource }) {
  const { toggleSaveResource } = useApp();

  return (
    <div className="group relative p-3.5 rounded-xl border transition-all flex items-start gap-3 hover:-translate-y-0.5" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
      <div 
        className="w-8 h-8 rounded-lg border flex items-center justify-center text-base shrink-0 transition-transform group-hover:scale-105"
        style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)' }}
      >
        {resource.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--primary)' }}>
            {resource.type}
          </span>
          <button
            onClick={() => toggleSaveResource(resource.id)}
            className="theme-text-muted hover:text-rose-500 transition-colors"
            title="Remove resource"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h4 className="text-xs font-semibold theme-text-primary mt-0.5 truncate group-hover:underline">
          {resource.title}
        </h4>

        <div className="flex items-center justify-between text-[10px] theme-text-muted mt-1">
          <span>{resource.subject}</span>
          <span className="font-mono">{resource.size}</span>
        </div>
      </div>
    </div>
  );
}
