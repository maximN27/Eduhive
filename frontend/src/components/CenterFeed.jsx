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
      
      {/* Feed Control Bar: Filters & Sorting */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl mb-6 flex flex-wrap items-center justify-between gap-3">
        
        {/* Sorting Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFeedSort('latest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              feedSort === 'latest'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔥 Latest
          </button>
          <button
            onClick={() => setFeedSort('trending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              feedSort === 'trending'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📈 Trending
          </button>
          <button
            onClick={() => setFeedSort('top')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              feedSort === 'top'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⭐ Top Rated
          </button>
        </div>

        {/* Counter Info */}
        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="font-bold text-slate-100">{posts.length}</span> of {allPostsCount} posts
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeSubject || activeTag || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-4 px-1">
          <span className="text-xs font-semibold text-slate-400">Active Filters:</span>

          {activeSubjectObj && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <span>{activeSubjectObj.icon} {activeSubjectObj.name}</span>
              <button onClick={() => handleSelectSubject(activeSubject)} className="hover:text-white font-bold">✕</button>
            </span>
          )}

          {activeTag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              <span>#{activeTag}</span>
              <button onClick={() => handleSelectTag(activeTag)} className="hover:text-white font-bold">✕</button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <span>"{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-white font-bold">✕</button>
            </span>
          )}

          <button
            onClick={clearFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Post Creation Box */}
      <CreatePostBox />

      {/* Posts List */}
      {posts.length > 0 ? (
        <div>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-200 mb-1">No Posts Found</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
            No posts matched your current search or topic filter criteria. Try clearing filters or create a new post!
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
}
