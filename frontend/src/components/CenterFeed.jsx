import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CreatePostBox from './CreatePostBox';
import PostCard from './PostCard';
import { ResourcesTab } from './ResourcesTab';

export default function CenterFeed() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'resources'
  const {
    posts,
    allPostsCount,
    subjects,
    activeSubject,
    activeTag,
    searchQuery,
    feedSort,
    setFeedSort,
    handleSelectSubject,
    handleSelectTag,
    setSearchQuery,
    clearFilters
  } = useApp();

  const activeSubjectObj = subjects.find(s => s.id === activeSubject);

  return (
    <section className="w-full flex-1 max-w-full">
      
      {/* Top Tab Switcher */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'theme-card theme-text-secondary hover:theme-text-primary'
          }`}
        >
          💬 Discussion Feed
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'resources'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'theme-card theme-text-secondary hover:theme-text-primary'
          }`}
        >
          🌐 External Resources (YouTube • GitHub • arXiv)
        </button>
      </div>

      {activeTab === 'resources' ? (
        <ResourcesTab />
      ) : (
        <>
      
      {/* Feed Control Bar: Counter on Left, Sorting Tabs on Right */}
      <div className="theme-card p-2.5 mb-3.5 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Counter Info */}
        <div className="text-xs font-medium theme-text-muted pl-1">
          Showing <span className="font-bold theme-text-primary">{posts.length}</span> of {allPostsCount} posts
        </div>

        {/* Right: Sorting Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl border ml-auto" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setFeedSort('latest')}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              backgroundColor: feedSort === 'latest' ? 'var(--primary)' : 'transparent',
              color: feedSort === 'latest' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            🔥 Latest
          </button>
          <button
            onClick={() => setFeedSort('trending')}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              backgroundColor: feedSort === 'trending' ? 'var(--primary)' : 'transparent',
              color: feedSort === 'trending' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            📈 Trending
          </button>
          <button
            onClick={() => setFeedSort('top')}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              backgroundColor: feedSort === 'top' ? 'var(--primary)' : 'transparent',
              color: feedSort === 'top' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            ⭐ Top Rated
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeSubject || activeTag || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-4 px-1">
          <span className="text-xs font-semibold theme-text-muted">Active Filters:</span>

          {activeSubjectObj && (
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
            >
              <span>{activeSubjectObj.icon} {activeSubjectObj.name}</span>
              <button onClick={() => handleSelectSubject(activeSubject)} className="font-bold hover:opacity-80">✕</button>
            </span>
          )}

          {activeTag && (
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
            >
              <span>#{activeTag}</span>
              <button onClick={() => handleSelectTag(activeTag)} className="font-bold hover:opacity-80">✕</button>
            </span>
          )}

          {searchQuery && (
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            >
              <span>"{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="font-bold hover:opacity-80">✕</button>
            </span>
          )}

          <button
            onClick={clearFilters}
            className="text-xs font-semibold underline hover:opacity-80 ml-1"
            style={{ color: 'var(--primary)' }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Post Creation Widget */}
      <CreatePostBox />

      {/* Posts List */}
      {posts.length > 0 ? (
        <div>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="theme-card p-10 text-center">
          <div 
            className="w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)', color: 'var(--primary)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold theme-text-primary mb-1">No Posts Found</h3>
          <p className="text-xs theme-text-muted mb-4 max-w-sm mx-auto">
            No posts matched your current search or topic filter. Try clearing filters or create a new post!
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      </>
      )}

    </section>
  );
}
