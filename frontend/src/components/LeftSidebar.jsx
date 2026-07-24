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
    clearFilters
  } = useApp();

  const currentTags = activeSubject
    ? tags[activeSubject] || []
    : Object.values(tags).flat();

  // Helper to map tag name to semantic color pills
  const getTagPillStyles = (tagId, isActive) => {
    if (isActive) {
      return {
        backgroundColor: 'var(--primary)',
        color: '#FFFFFF',
        borderColor: 'var(--primary)'
      };
    }

    const lower = tagId.toLowerCase();
    if (lower.includes('algorithm') || lower.includes('dsa') || lower.includes('sys-design') || lower.includes('os')) {
      return { backgroundColor: 'var(--tag-blue-bg)', color: 'var(--tag-blue-text)', borderColor: 'transparent' };
    }
    if (lower.includes('ml') || lower.includes('neural') || lower.includes('llm') || lower.includes('python')) {
      return { backgroundColor: 'var(--tag-purple-bg)', color: 'var(--tag-purple-text)', borderColor: 'transparent' };
    }
    if (lower.includes('calculus') || lower.includes('linear') || lower.includes('probability') || lower.includes('discrete')) {
      return { backgroundColor: 'var(--tag-orange-bg)', color: 'var(--tag-orange-text)', borderColor: 'transparent' };
    }
    if (lower.includes('react') || lower.includes('tailwind') || lower.includes('backend') || lower.includes('typescript')) {
      return { backgroundColor: 'var(--tag-cyan-bg)', color: 'var(--tag-cyan-text)', borderColor: 'transparent' };
    }
    if (lower.includes('quantum') || lower.includes('circuit') || lower.includes('electromagnetics')) {
      return { backgroundColor: 'var(--tag-yellow-bg)', color: 'var(--tag-yellow-text)', borderColor: 'transparent' };
    }
    return { backgroundColor: 'var(--tag-teal-bg)', color: 'var(--tag-teal-text)', borderColor: 'transparent' };
  };

  return (
    <aside className="w-full space-y-3.5">
      
      {/* Subject Section */}
      <div className="theme-card p-3.5">
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xs font-bold tracking-wider uppercase theme-text-secondary">
              Academic Subjects
            </h2>
          </div>
          {activeSubject && (
            <button
              onClick={() => handleSelectSubject(activeSubject)}
              className="text-[11px] font-semibold hover:underline transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* All Subjects Option */}
          <button
            onClick={() => handleSelectSubject(null)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{
              backgroundColor: activeSubject === null ? 'var(--primary-light)' : 'transparent',
              color: activeSubject === null ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeSubject === null ? '700' : '500'
            }}
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
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group"
                style={{
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: isActive ? '700' : '500'
                }}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </span>
                  <span className="truncate">{subject.name}</span>
                </div>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--primary)' : 'var(--surface-main)',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)'
                  }}
                >
                  {subject.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtopic Tags Section */}
      <div className="theme-card p-5">
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <h2 className="text-xs font-bold tracking-wider uppercase theme-text-secondary">
              Subtopics
            </h2>
          </div>
          {activeTag && (
            <button
              onClick={() => handleSelectTag(activeTag)}
              className="text-[11px] font-semibold hover:underline transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              Clear Tag
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {currentTags.map((tagItem) => {
            const isActive = activeTag === tagItem.id;
            const pillStyle = getTagPillStyles(tagItem.id, isActive);
            return (
              <button
                key={tagItem.id}
                onClick={() => handleSelectTag(tagItem.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                style={pillStyle}
              >
                <span>#{tagItem.name}</span>
                <span className="text-[10px] opacity-70">({tagItem.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Clear Banner */}
      {(activeSubject || activeTag) && (
        <div 
          className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium"
          style={{
            backgroundColor: 'var(--primary-light)',
            borderColor: 'var(--primary-border)',
            color: 'var(--primary)'
          }}
        >
          <span>Active filter applied</span>
          <button
            onClick={clearFilters}
            className="font-bold underline hover:opacity-80"
          >
            Clear All
          </button>
        </div>
      )}

    </aside>
  );
}
