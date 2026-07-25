import React, { useState, useEffect } from 'react';
import { aiLearningService } from '../services/aiLearningService';

export default function PostAiLearningWidget({ activePost, activeTab, onSwitchTab }) {
  const [gaps, setGaps] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [mentors, setMentors] = useState([]);

  const [loadingGaps, setLoadingGaps] = useState(false);
  const [loadingPath, setLoadingPath] = useState(false);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [connectedMentors, setConnectedMentors] = useState({});

  const postId = activePost?.id || activePost?._id;

  // 1. Fetch Knowledge Gaps for active post
  useEffect(() => {
    if (!postId || activeTab !== 'gaps') return;
    
    async function loadGaps() {
      setLoadingGaps(true);
      try {
        const res = await aiLearningService.analyzePostGaps(postId, activePost);
        if (res && res.data) {
          setGaps(res.data);
        }
      } catch (err) {
        console.warn('Failed to load post knowledge gaps:', err.message);
      } finally {
        setLoadingGaps(false);
      }
    }

    loadGaps();
  }, [postId, activeTab, activePost]);

  // 2. Fetch Learning Path
  useEffect(() => {
    if (!postId || activeTab !== 'path') return;

    async function loadPath() {
      setLoadingPath(true);
      try {
        const res = await aiLearningService.generateLearningPath(postId, null, activePost);
        if (res && res.data) {
          setLearningPath(res.data);
        }
      } catch (err) {
        console.warn('Failed to generate learning path:', err.message);
      } finally {
        setLoadingPath(false);
      }
    }

    loadPath();
  }, [postId, activeTab, activePost]);

  // 3. Fetch Peer Mentors
  useEffect(() => {
    if (!postId || activeTab !== 'mentors') return;

    async function loadMentors() {
      setLoadingMentors(true);
      try {
        const res = await aiLearningService.getMentorMatches(postId, null, activePost);
        if (res && res.data) {
          setMentors(res.data);
        }
      } catch (err) {
        console.warn('Failed to load mentor matches:', err.message);
      } finally {
        setLoadingMentors(false);
      }
    }

    loadMentors();
  }, [postId, activeTab, activePost]);

  // Handle checking/unchecking a module step
  const handleToggleModule = async (stepNumber, currentStatus) => {
    if (!learningPath || !learningPath._id) return;
    const newStatus = !currentStatus;

    // Optimistic UI update
    setLearningPath(prev => {
      if (!prev) return prev;
      const updatedModules = prev.modules.map(m => 
        m.stepNumber === stepNumber ? { ...m, isCompleted: newStatus } : m
      );
      const completedCount = updatedModules.filter(m => m.isCompleted).length;
      const newProgress = Math.round((completedCount / updatedModules.length) * 100);

      return {
        ...prev,
        overallProgress: newProgress,
        modules: updatedModules
      };
    });

    try {
      await aiLearningService.updateModuleStep(learningPath._id, stepNumber, newStatus);
    } catch (err) {
      console.warn('Failed to save module step progress:', err.message);
    }
  };

  // Handle connecting with a mentor
  const handleConnectMentor = async (mentorId, conceptTag) => {
    setConnectedMentors(prev => ({ ...prev, [mentorId]: true }));
    try {
      await aiLearningService.connectMentor(mentorId, conceptTag);
    } catch (err) {
      console.warn('Failed to connect mentor:', err.message);
    }
  };

  // RENDER TAB 1: KNOWLEDGE GAPS
  if (activeTab === 'gaps') {
    return (
      <div className="animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>🧠</span> AI Knowledge Gap Detection
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Gemini 2.5 AI
          </span>
        </div>

        {loadingGaps ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Analyzing post content & detecting gaps...</p>
          </div>
        ) : gaps.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No specific knowledge gaps detected for this topic. You seem on track!
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.map((gap, index) => (
              <div 
                key={gap._id || index}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-slate-100 leading-snug">
                    {gap.conceptTag}
                  </h4>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    gap.severity === 'high' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {gap.severity} Gap
                  </span>
                </div>

                {/* Confidence Meter Bar */}
                <div className="mb-2.5">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span>AI Detection Confidence</span>
                    <span className="text-cyan-400 font-bold">{gap.confidenceScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${gap.confidenceScore}%` }}
                    />
                  </div>
                </div>

                {/* Evidence bullets */}
                {gap.evidence && gap.evidence.length > 0 && (
                  <ul className="text-[11px] text-slate-400 space-y-1 mb-3 pl-3 list-disc">
                    {gap.evidence.map((ev, i) => (
                      <li key={i} className="leading-snug">{ev}</li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => onSwitchTab('path')}
                  className="w-full py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-bold transition-all border border-indigo-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🗺️ Generate AI Study Path</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // RENDER TAB 2: ADAPTIVE LEARNING PATH
  if (activeTab === 'path') {
    const modules = learningPath?.modules || [];
    const progress = learningPath?.overallProgress || 0;

    return (
      <div className="animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>🗺️</span> Adaptive Learning Path
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {progress}% Done
          </span>
        </div>

        {loadingPath ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Crafting personalized study roadmap with Gemini AI...</p>
          </div>
        ) : !learningPath ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Click 'Generate AI Study Path' from Knowledge Gaps to create your adaptive roadmap.
          </div>
        ) : (
          <div>
            {/* Overall Path Header & Progress Bar */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 mb-3">
              <h3 className="text-xs font-extrabold text-slate-100 mb-1">
                {learningPath.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                {learningPath.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Modules Timeline */}
            <div className="space-y-2.5">
              {modules.map((mod) => (
                <div 
                  key={mod.stepNumber}
                  className={`p-3 rounded-2xl border transition-all ${
                    mod.isCompleted 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={Boolean(mod.isCompleted)}
                      onChange={() => handleToggleModule(mod.stepNumber, mod.isCompleted)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className={`text-xs font-bold leading-snug ${mod.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {mod.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          ⏱ {mod.estimatedMinutes}m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                        {mod.description}
                      </p>

                      {/* Recommended Resource Link */}
                      {mod.resources && mod.resources.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {mod.resources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors inline-flex items-center gap-1"
                            >
                              <span>📖</span>
                              <span>{res.title}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER TAB 3: PEER MENTORS
  if (activeTab === 'mentors') {
    return (
      <div className="animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>🤝</span> AI Peer Mentor Matching
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Topic Match
          </span>
        </div>

        {loadingMentors ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Finding optimal professors & peer scholars...</p>
          </div>
        ) : mentors.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No mentor recommendations found for this specific topic.
          </div>
        ) : (
          <div className="space-y-3">
            {mentors.map((mentor) => {
              const isConnected = connectedMentors[mentor.mentorId];
              return (
                <div 
                  key={mentor.mentorId}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-start gap-3 mb-2.5">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name} 
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-100 truncate">
                          {mentor.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {mentor.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                        {mentor.role} • {mentor.college}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                    "{mentor.matchReason}"
                  </p>

                  <button
                    onClick={() => handleConnectMentor(mentor.mentorId, activePost?.tags?.[0])}
                    disabled={isConnected}
                    className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isConnected 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    }`}
                  >
                    <span>{isConnected ? '✓ Connection Request Sent' : '💬 Connect with Mentor'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}
