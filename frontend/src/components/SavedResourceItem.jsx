import React from 'react';
import { useApp } from '../context/AppContext';

export default function SavedResourceItem({ resource }) {
  const { toggleSaveResource } = useApp();

  return (
    <div className="group relative p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
        {resource.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-mono text-cyan-400">
            {resource.type}
          </span>
          <button
            onClick={() => toggleSaveResource(resource.id)}
            className="text-slate-500 hover:text-rose-400 transition-colors"
            title="Remove saved resource"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h4 className="text-xs font-semibold text-slate-200 mt-0.5 truncate group-hover:text-cyan-300">
          {resource.title}
        </h4>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
          <span>{resource.subject}</span>
          <span className="font-mono text-slate-400">{resource.size}</span>
        </div>
      </div>
    </div>
  );
}
