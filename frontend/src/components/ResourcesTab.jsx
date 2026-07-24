import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { subjectService } from '../services/subjectService';
import { ResourceCard } from './ResourceCard';

export const ResourcesTab = () => {
  const { subjects, activeSubject, activeTag } = useApp();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTag, setSearchTag] = useState(activeTag || 'algorithms');

  const defaultResourcesCatalog = [
    {
      _id: 'r-ext-1',
      title: 'MIT 6.006 Introduction to Algorithms - Full Course Lectures',
      type: 'YouTube Playlist',
      platform: 'YouTube',
      url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP63EdVPNLG3ToM6LaEUuStEY',
      author: 'MIT OpenCourseWare',
      description: 'Comprehensive 24-lecture course covering binary search trees, heaps, hashing, dynamic programming, and shortest path algorithms.',
      badge: 'Course'
    },
    {
      _id: 'r-ext-2',
      title: 'Attention Is All You Need - Transformer Neural Networks',
      type: 'arXiv Paper',
      platform: 'arXiv',
      url: 'https://arxiv.org/abs/1706.03762',
      author: 'Vaswani et al. (Google Brain)',
      description: 'The foundational research paper introducing the Transformer architecture and self-attention mechanism.',
      badge: 'Paper'
    },
    {
      _id: 'r-ext-3',
      title: 'The Algorithms - Python Open Source Repository',
      type: 'GitHub Repository',
      platform: 'GitHub',
      url: 'https://github.com/TheAlgorithms/Python',
      author: 'The Algorithms Community',
      description: 'All algorithms implemented in Python - for education. Includes data structures, ML models, dynamic programming, and math proofs.',
      badge: 'GitHub'
    },
    {
      _id: 'r-ext-4',
      title: '3Blue1Brown - Essence of Linear Algebra Series',
      type: 'YouTube Series',
      platform: 'YouTube',
      url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2yVFitgVQuc0y',
      author: 'Grant Sanderson (3Blue1Brown)',
      description: 'Visual geometric intuition for linear transformations, matrix multiplication, eigenvectors, and eigenvalues.',
      badge: 'Video'
    },
    {
      _id: 'r-ext-5',
      title: 'Qiskit Quantum Computing SDK Code Samples',
      type: 'GitHub Repository',
      platform: 'GitHub',
      url: 'https://github.com/Qiskit/qiskit',
      author: 'IBM Quantum',
      description: 'Open-source SDK for working with quantum computers at the level of circuits, pulses, and algorithms.',
      badge: 'Code'
    },
    {
      _id: 'r-ext-6',
      title: 'Deep Residual Learning for Image Recognition (ResNet)',
      type: 'arXiv Paper',
      platform: 'arXiv',
      url: 'https://arxiv.org/abs/1512.03385',
      author: 'He et al. (Microsoft Research)',
      description: 'Landmark computer vision paper introducing residual skip connections enabling ultra-deep neural network training.',
      badge: 'Paper'
    }
  ];

  const selectedSubjectId = activeSubject || (subjects[0]?._id || subjects[0]?.id);

  const fetchResources = async () => {
    if (!selectedSubjectId) return;
    setLoading(true);
    setError('');
    try {
      const data = await subjectService.getSubjectResources(selectedSubjectId, { tag: searchTag });
      const apiRes = data.resources || data.data || [];
      if (apiRes.length > 0) {
        setResources(apiRes);
      } else {
        setResources(defaultResourcesCatalog);
      }
    } catch (err) {
      setResources(defaultResourcesCatalog);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedSubjectId, searchTag]);

  return (
    <div className="space-y-6 my-4">
      
      {/* Embedded YouTube Study Video Player */}
      <YouTubeStudyPlayer initialTopic={activeSubject?.name || 'Computer Science'} />

      <div className="bg-[#111A2E]/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 text-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>🌐 External Academic Discovery</span>
              <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono">
                YouTube • GitHub • arXiv
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curated lecture videos, open source repositories, and research preprints for your active subject
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              placeholder="Search tag (e.g. algorithms)..."
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/60 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={fetchResources}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md shadow-cyan-600/20"
            >
              Search
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Discovering resources across YouTube, GitHub, and arXiv...</p>
          </div>
        )}

        {!loading && resources.length > 0 && (
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
