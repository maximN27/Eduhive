import React from 'react';
import { useApp } from '../context/AppContext';
import SavedPostItem from './SavedPostItem';
import SavedResourceItem from './SavedResourceItem';

export default function RightSidebar() {
  const { savedPosts = [], savedResources = [] } = useApp();

  return (
    <aside className="w-full space-y-3.5">
      
      {/* 1. Saved Posts Section */}
      <div className="theme-card p-3.5">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-xs font-bold tracking-wider uppercase theme-text-secondary">
              Saved Posts
            </h2>
          </div>
          <span 
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
            style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
          >
            {savedPosts.length}
          </span>
        </div>

        {savedPosts.length === 0 ? (
          <div className="text-center py-6 theme-text-muted text-xs">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            No saved posts yet.<br />Click bookmark on any post to save it here!
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
            {savedPosts.map(post => (
              <SavedPostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* 2. Saved Resources Section */}
      <div className="theme-card p-3.5">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xs font-bold tracking-wider uppercase theme-text-secondary">
              Saved Resources
            </h2>
          </div>
          <span 
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
            style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
          >
            {savedResources.length}
          </span>
        </div>

        {savedResources.length === 0 ? (
          <div className="text-center py-6 theme-text-muted text-xs">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            No study resources saved.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
            {savedResources.map(resource => (
              <SavedResourceItem key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
