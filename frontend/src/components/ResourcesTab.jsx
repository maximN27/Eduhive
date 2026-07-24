import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getSubjectResourcesApi } from '../api/resources';
import { ResourceCard } from './ResourceCard';

export const ResourcesTab = () => {
  const { subjects, activeSubject, activeTag } = useApp();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTag, setSearchTag] = useState(activeTag || 'algorithms');

  const selectedSubjectId = activeSubject || (subjects[0]?._id || subjects[0]?.id);

  const fetchResources = async () => {
    if (!selectedSubjectId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getSubjectResourcesApi(selectedSubjectId, searchTag);
      setResources(data.resources || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedSubjectId, searchTag]);

  return (
    <div className="space-y-6 my-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>🌐 External Resource Discovery</span>
              <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full font-mono">
                YouTube • GitHub • arXiv
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Auto-discovers real videos, repositories, and papers for your subject and subtopic tags
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              placeholder="Enter tag (e.g. algorithms)..."
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={fetchResources}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Discover
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-gray-400">Discovering resources across YouTube, GitHub, and arXiv...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-xs">
            No resources found. Try searching for a tag like "algorithms", "react", or "math"!
          </div>
        )}

        {!loading && !error && resources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <ResourceCard key={res._id || res.url} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
