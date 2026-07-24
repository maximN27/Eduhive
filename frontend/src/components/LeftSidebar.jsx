import React from 'react';
import { useApp } from '../context/AppContext';

export default function LeftSidebar() {
  const {
    subjects,
    tags,
    activeSubject,
    activeTag,
    handleSelectSubject,
    handleSelectTag,
    clearFilters,
    openProfile
  } = useApp();

  // Get active subtopic tags list
  const currentTags = activeSubject
    ? tags[activeSubject] || []
    : Object.values(tags).flat();

  return (
    <aside className="w-full space-y-6">
      
      {/* Quick Profile Navigation Card */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl">
        <button
          onClick={openProfile}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 hover:from-indigo-600/40 hover:to-cyan-500/30 border border-indigo-500/40 text-white text-xs font-bold transition-all shadow-md group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base group-hover:scale-110 transition-transform">👤</span>
            <span>My Academic Profile</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 font-mono">
            View &gt;
          </span>
        </button>
      </div>
      
      {/* Subject Section (Communities) */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
              Subjects
            </h2>
          </div>
          {activeSubject && (
            <button
              onClick={() => handleSelectSubject(activeSubject)}
              className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {/* All Subjects Option */}
          <button
            onClick={() => handleSelectSubject(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubject === null
                ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base">📚</span>
              <span>All Subjects</span>
            </span>
          </button>

          {/* List of Subjects */}
          {subjects.map((subject) => {
            const isActive = activeSubject === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => handleSelectSubject(subject.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </span>
                  <span className="truncate">{subject.name}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                }`}>
                  {subject.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtopic Tags Section */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
              Subtopic Tags
            </h2>
          </div>
          {activeTag && (
            <button
              onClick={() => handleSelectTag(activeTag)}
              className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Clear Tag
            </button>
          )}
        </div>

        {activeSubject ? (
          <p className="text-[11px] text-slate-400 mb-2">
            Showing subtopics for <span className="text-indigo-300 font-semibold">{subjects.find(s => s.id === activeSubject)?.name}</span>
          </p>
        ) : (
          <p className="text-[11px] text-slate-400 mb-2">
            Popular subtopics across all subjects
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {currentTags.map((tagItem) => {
            const isActive = activeTag === tagItem.id;
            return (
              <button
                key={tagItem.id}
                onClick={() => handleSelectTag(tagItem.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>#{tagItem.name}</span>
                <span className="text-[9px] opacity-70">({tagItem.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Filter Reset Banner if active */}
      {(activeSubject || activeTag) && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
          <span>Filters active</span>
          <button
            onClick={clearFilters}
            className="font-bold underline hover:text-white"
          >
            Clear All
          </button>
        </div>
      )}

    </aside>
  );
}
