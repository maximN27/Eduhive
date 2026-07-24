import React from 'react';
import { useApp } from '../context/AppContext';

export default function SavedPostItem({ post }) {
  const { toggleSavePost } = useApp();

  return (
    <div className="group relative p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {post.subjectName}
        </span>
        <button
          onClick={() => toggleSavePost(post.id)}
          className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
          title="Remove from saved posts"
        >
          <svg className="w-4 h-4 fill-amber-400 text-amber-400 hover:fill-rose-400 hover:text-rose-400 transition-colors" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <h4 className="text-xs font-semibold text-slate-200 mt-2 line-clamp-2 group-hover:text-white leading-snug">
        {post.title}
      </h4>

      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-900">
        <span className="flex items-center gap-1.5 truncate">
          <img src={post.author.avatar} alt={post.author.name} className="w-3.5 h-3.5 rounded-full object-cover" />
          <span className="truncate">{post.author.name}</span>
        </span>
        <span className="font-mono text-indigo-400 font-medium shrink-0">
          ▲ {post.upvotes}
        </span>
      </div>
    </div>
  );
}
