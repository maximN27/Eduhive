import React from 'react';

export default function ResourceViewerModal({ resource, subjectName, isOpen, onClose, onSaveResource, isSaved }) {
  if (!isOpen || !resource) return null;

  const getPlatformIcon = (type) => {
    if (type?.toLowerCase().includes('pdf')) return '📄';
    if (type?.toLowerCase().includes('notebook') || type?.toLowerCase().includes('ipynb')) return '📓';
    if (type?.toLowerCase().includes('paper') || type?.toLowerCase().includes('arxiv')) return '📚';
    if (type?.toLowerCase().includes('video') || type?.toLowerCase().includes('youtube')) return '▶️';
    if (type?.toLowerCase().includes('github') || type?.toLowerCase().includes('repo')) return '💻';
    return '📄';
  };

  const directUrl = resource.url && resource.url !== '#' ? resource.url : 'https://arxiv.org/abs/1706.03762';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#111A2E] border border-cyan-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-xl font-bold">
              {resource.icon || getPlatformIcon(resource.type)}
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {resource.type || 'Study Resource'}
              </span>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">{resource.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Subject: <strong className="text-cyan-300">{subjectName || 'Academic Resource'}</strong></span>
              <span>Size: <strong className="text-slate-200">{resource.size || '2.4 MB'}</strong></span>
            </div>
            <p className="text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              This academic resource contains verified formulas, empirical benchmarks, and detailed code snippets for <strong className="text-cyan-300">{subjectName || 'this subject'}</strong>.
            </p>
          </div>

          {/* Action Links & Preview Results */}
          <div className="space-y-2">
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <span>View Full Document / Link 🔗</span>
            </a>

            <button
              onClick={() => {
                if (onSaveResource) onSaveResource(resource);
              }}
              disabled={isSaved}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              <span>{isSaved ? '✓ Saved to Your Library Collection' : '🔖 Save to My Resources Collection'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
