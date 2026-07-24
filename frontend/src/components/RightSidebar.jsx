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

  return (
    <aside className="w-full space-y-4 no-scrollbar max-h-[calc(100vh-100px)] overflow-y-auto pr-0.5">
      
      {/* 1. LIBRARY Card (Tabbed Saved Posts & Saved Resources) */}
      <div className="theme-card p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b theme-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-cyan-500">📚</span>
            <h2 className="text-[11px] font-extrabold tracking-wider uppercase theme-text-secondary">
              LIBRARY
            </h2>
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-500/10 border theme-border">
          <button
            onClick={() => setLibraryTab('posts')}
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
              libraryTab === 'posts'
                ? 'bg-cyan-500/20 text-cyan-600 border border-cyan-500/30'
                : 'theme-text-muted hover:theme-text-primary'
            }`}
          >
            Saved Posts
          </button>
          <button
            onClick={() => setLibraryTab('resources')}
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
              libraryTab === 'resources'
                ? 'bg-cyan-500/20 text-cyan-600 border border-cyan-500/30'
                : 'theme-text-muted hover:theme-text-primary'
            }`}
          >
            Saved Resources
          </button>
        </div>

        {/* Tab Content */}
        {libraryTab === 'posts' ? (
          <div>
            {savedPosts.length === 0 ? (
              <div className="text-center py-6 theme-text-muted text-xs italic">
                No saved posts yet.<br />Click bookmark on any post to save it here!
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                {savedPosts.map(post => (
                  <SavedPostItem key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {savedResources.length === 0 && sampleResources.length === 0 ? (
              <div className="text-center py-6 theme-text-muted text-xs italic">
                No study resources saved.
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                {[...savedResources, ...sampleResources.filter(s => !savedResources.some(r => r.id === s.id))].map(resource => (
                  <SavedResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </aside>
  );
}
