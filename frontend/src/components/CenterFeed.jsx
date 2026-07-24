import React from 'react';
import { useApp } from '../context/AppContext';
import CreatePostBox from './CreatePostBox';
import PostCard from './PostCard';

export default function CenterFeed() {
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
      
      {/* Feed Control Bar: Sorting & Counter */}
      <div className="theme-card p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        
        {/* Sorting Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setFeedSort('latest')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: feedSort === 'latest' ? 'var(--primary)' : 'transparent',
              color: feedSort === 'latest' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            🔥 Latest
          </button>
          <button
            onClick={() => setFeedSort('trending')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: feedSort === 'trending' ? 'var(--primary)' : 'transparent',
              color: feedSort === 'trending' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            📈 Trending
          </button>
          <button
            onClick={() => setFeedSort('top')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: feedSort === 'top' ? 'var(--primary)' : 'transparent',
              color: feedSort === 'top' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            ⭐ Top Rated
          </button>
        </div>

        {/* Counter Info */}
        <div className="text-xs font-medium theme-text-muted">
          Showing <span className="font-bold theme-text-primary">{posts.length}</span> of {allPostsCount} posts
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

    </section>
  );
}
