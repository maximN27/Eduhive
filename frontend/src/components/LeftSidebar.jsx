import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LeftSidebar() {
  const {
    user,
    subjects,
    tags,
    activeSubject,
    activeTag,
    handleSelectSubject,
    handleSelectTag,
    navigateToProfile,
    clearFilters
  } = useApp();

  // State to track expanded subject accordions
  const [expandedSubjects, setExpandedSubjects] = useState({
    'mathematics': true,
    'cs': false,
    'physics': false,
    'ee': false
  });

  const toggleExpand = (subId, e) => {
    e.stopPropagation();
    setExpandedSubjects(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  const mathSubTopics = [
    { id: 'fundamental', name: 'Fundamental', icon: '📐' },
    { id: 'calculus', name: 'Calculus III', icon: '∫x' },
    { id: 'algebra', name: 'Algebra (Linear & Abstract)', icon: '∯' },
    { id: 'discrete', name: 'Discrete Mathematics', icon: '∄' },
    { id: 'probability', name: 'Probability & Statistics', icon: '📊' },
    { id: 'other', name: 'Other sub-categories', icon: '📑' },
    { id: 'pandas', name: 'Pandas & NumPy', icon: '🐼' },
    { id: 'react', name: 'React 19 Hooks', icon: '⚛️' },
    { id: 'graphql', name: 'REST & GraphQL', icon: '🕸️' },
    { id: 'quantum-math', name: 'Quantum Mathematics', icon: '⚛️' },
    { id: 'electromagnetism', name: 'Electromagnetism', icon: '🧲' }
  ];

  return (
    <aside className="w-full no-scrollbar min-h-[calc(100vh-100px)] overflow-y-auto pr-4 border-r theme-border pb-6 space-y-5">
      
      {/* Quick User Profile Card */}
      {user && (
        <div 
          onClick={navigateToProfile}
          className="theme-card p-3.5 flex items-center gap-3 cursor-pointer hover:border-indigo-500/40 hover:scale-[1.01] transition-all"
        >
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0" 
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold theme-text-primary truncate">{user.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">⚡ {user.reputation} XP</span>
              <span className="text-[9px] theme-text-muted">• Profile</span>
            </div>
          </div>
        </div>
      )}

      {/* Subject Tree Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b theme-border">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xs font-extrabold tracking-wider uppercase theme-text-secondary">
              Academic Subjects
            </h2>
          </div>
          {activeSubject && (
            <button
              onClick={() => handleSelectSubject(null)}
              className="text-[11px] font-semibold text-indigo-500 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Root Node: All Subjects */}
        <div className="space-y-1">
          <button
            onClick={() => handleSelectSubject(null)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeSubject === null
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🎨</span>
              <span>All Subjects</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-500/10 theme-text-muted font-mono font-bold">
              30
            </span>
          </button>

          {/* Subject List */}
          <div className="space-y-1 pt-1">
            {subjects.map((sub) => {
              const isSelected = activeSubject === sub.id;
              const isExpanded = Boolean(expandedSubjects[sub.id]);

              return (
                <div key={sub.id} className="space-y-0.5">
                  <div
                    onClick={() => handleSelectSubject(sub.id)}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0 text-base">{sub.icon}</span>
                      <span className="truncate tracking-tight">{sub.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-mono font-bold theme-text-muted px-2 py-0.5 rounded bg-slate-500/10">
                        {sub.count}
                      </span>
                      {sub.id === 'mathematics' && (
                        <button
                          onClick={(e) => toggleExpand(sub.id, e)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <svg
                            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subtopics Accordion */}
                  {sub.id === 'mathematics' && isExpanded && (
                    <div className="pl-6 space-y-0.5 py-1 border-l-2 border-slate-500/20 ml-4">
                      {mathSubTopics.map((subTopic) => {
                        const isTagSelected = activeTag === subTopic.id;
                        return (
                          <button
                            key={subTopic.id}
                            onClick={() => handleSelectTag(subTopic.id)}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                              isTagSelected
                                ? 'text-cyan-600 font-bold bg-cyan-500/10'
                                : 'theme-text-muted hover:theme-text-primary hover:bg-slate-500/10'
                            }`}
                          >
                            <span className="text-xs">{subTopic.icon}</span>
                            <span className="truncate">{subTopic.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </aside>
  );
}
