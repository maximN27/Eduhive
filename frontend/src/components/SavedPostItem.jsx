import React from 'react';
import { useApp } from '../context/AppContext';

export default function SavedPostItem({ post }) {
  const { toggleSavePost } = useApp();

  return (
    <div className="group relative p-2.5 rounded-xl border transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-start justify-between gap-2">
        <span 
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
          style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
        >
          {post.subjectName}
        </span>
        <button
          onClick={() => toggleSavePost(post.id)}
          className="theme-text-muted hover:text-rose-500 transition-colors p-0.5"
          title="Remove bookmark"
        >
          <svg className="w-4 h-4 fill-current text-amber-500 hover:text-rose-500 transition-colors" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <h4 className="text-xs font-semibold theme-text-primary mt-2 line-clamp-2 leading-snug group-hover:underline">
        {post.title}
      </h4>

      <div className="flex items-center justify-between text-[10px] theme-text-muted mt-2.5 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <span className="flex items-center gap-1.5 truncate">
          <img src={post.author.avatar} alt={post.author.name} className="w-3.5 h-3.5 rounded-full object-cover" />
          <span className="truncate">{post.author.name}</span>
        </span>
        <span className="font-mono font-bold" style={{ color: 'var(--primary)' }}>
          ▲ {post.upvotes}
        </span>
      </div>
    </div>
  );
}
