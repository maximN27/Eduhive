import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SavedPostItem from './SavedPostItem';
import SavedResourceItem from './SavedResourceItem';

export default function RightSidebar() {
  const { savedPosts = [], savedResources = [] } = useApp();
  const [libraryTab, setLibraryTab] = useState('resources'); // 'posts' | 'resources'
  const [mentorTab, setMentorTab] = useState('mentors'); // 'mentors' | 'progress'

  const sampleResources = [
    {
      id: 'res-1',
      title: 'DSA Complete Cheat Sheet & Complexity Chart',
      subject: 'Computer Science',
      size: '2.5 MB',
      type: 'PDF Guide',
      icon: '📄'
    },
    {
      id: 'res-2',
      title: 'Transformer Architecture & Attention Paper (...)',
      subject: 'Data Science & AI',
      size: '3.1 MB',
      type: 'Research Paper',
      icon: '📘'
    },
    {
      id: 'res-3',
      title: 'Linear Algebra 3Blue1Brown Notes & Equations',
      subject: 'Mathematics',
      size: '1.9 MB',
      type: 'Interactive Note',
      icon: '✏️'
    }
  ];

  const allResources = [...savedResources, ...sampleResources.filter(s => !savedResources.some(r => r.id === s.id))];

  return (
    <aside className="w-full no-scrollbar min-h-[calc(100vh-100px)] overflow-y-auto pl-5 border-l theme-border pb-6 space-y-4">
      
      {/* 1. SAVED RESOURCES SECTION (ON TOP) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2 border-b theme-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-cyan-500">📁</span>
            <h2 className="text-xs font-extrabold tracking-wider uppercase theme-text-secondary">
              Saved Resources
            </h2>
          </div>
          <span className="text-xs font-mono font-bold theme-text-muted px-2 py-0.5 rounded bg-slate-500/10">
            {allResources.length}
          </span>
        </div>

        {allResources.length === 0 ? (
          <div className="text-center py-4 theme-text-muted text-xs italic">
            No study resources saved.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
            {allResources.map(resource => (
              <SavedResourceItem key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>

      {/* 2. SAVED POSTS SECTION (BELOW) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between pb-2 border-b theme-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-cyan-500">🔖</span>
            <h2 className="text-xs font-extrabold tracking-wider uppercase theme-text-secondary">
              Saved Posts
            </h2>
          </div>
          <span className="text-xs font-mono font-bold theme-text-muted px-2 py-0.5 rounded bg-slate-500/10">
            {savedPosts.length}
          </span>
        </div>

        {savedPosts.length === 0 ? (
          <div className="text-center py-4 theme-text-muted text-xs italic">
            No saved posts yet. Click bookmark on any post to save it here!
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
            {savedPosts.map(post => (
              <SavedPostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
