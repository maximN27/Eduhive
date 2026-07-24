import React from 'react';

export const ResourceCard = ({ resource }) => {
  const getTypeBadge = (type) => {
    switch (type) {
      case 'video':
        return { label: 'Video', bg: 'bg-red-950/70 text-red-400 border-red-800', icon: '🎥' };
      case 'github':
        return { label: 'GitHub', bg: 'bg-purple-950/70 text-purple-400 border-purple-800', icon: '💻' };
      case 'research_paper':
        return { label: 'Paper', bg: 'bg-emerald-950/70 text-emerald-400 border-emerald-800', icon: '📄' };
      case 'animation':
        return { label: 'Interactive', bg: 'bg-amber-950/70 text-amber-400 border-amber-800', icon: '⚡' };
      default:
        return { label: 'PDF', bg: 'bg-blue-950/70 text-blue-400 border-blue-800', icon: '📚' };
    }
  };

  const typeInfo = getTypeBadge(resource.type);
  const isAutoDiscovered = resource.source === 'auto';

  return (
    <div className="p-4 bg-gray-900/90 border border-gray-800 hover:border-blue-500/40 rounded-2xl transition-all shadow-md group flex flex-col justify-between">
      <div>
        {resource.thumbnail ? (
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl bg-gray-950">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold uppercase backdrop-blur-md bg-black/60 text-white">
              {typeInfo.icon} {typeInfo.label}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${typeInfo.bg}`}>
              {typeInfo.icon} {typeInfo.label}
            </span>
            {isAutoDiscovered && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800">
                Auto-Discovered
              </span>
            )}
          </div>
        )}

        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug line-clamp-2 mb-2">
          {resource.title}
        </h4>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {resource.tags.map((t) => (
              <span key={t} className="text-[10px] font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono">
          👍 {resource.votes || 0} votes
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center space-x-1"
        >
          <span>Open Resource</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  );
};
