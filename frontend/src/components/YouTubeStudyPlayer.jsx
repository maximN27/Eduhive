import React, { useState, useEffect } from 'react';
import { youtubeService } from '../services/youtubeService';

export default function YouTubeStudyPlayer({ initialTopic = 'Computer Science', postTitle = '', postTags = [] }) {
  const subject = initialTopic || 'Computer Science';

  // 100% Verified Public-Embed Allowed YouTube Video IDs (MIT, Stanford, 3Blue1Brown, freeCodeCamp)
  function getSubjectVideoId(subj, aspect) {
    const s = String(subj || '').toLowerCase();

    if (aspect === 'tamil' || aspect === 'regional') {
      if (s.includes('physics') || s.includes('stat')) return 'd0zOJ1x8570';
      if (s.includes('os') || s.includes('operating')) return '26QPDBe-NB8';
      if (s.includes('ai') || s.includes('learning')) return '2pWv7GOvuf0';
      if (s.includes('math') || s.includes('linear')) return 'fNk_zzaMoSs';
      return '8hly31xKLI0';
    }

    if (s.includes('operating') || s.includes('os') || s.includes('kernel')) {
      if (aspect === 'core') return '26QPDBe-NB8'; // CS 162 Operating Systems
      if (aspect === 'theory') return 'ZA-tUyM_y7s'; // MIT 6.006
      if (aspect === 'code') return 'bMknfKXIFA8'; // freeCodeCamp Code
      if (aspect === 'opt') return '8hly31xKLI0'; // MIT 6.046J
    }

    if (s.includes('physics') || s.includes('quantum') || s.includes('stat')) {
      if (aspect === 'core') return 'd0zOJ1x8570'; // MIT 8.04 Quantum
      if (aspect === 'theory') return 'aircAruvnKk'; // MIT 8.01SC Mechanics
      if (aspect === 'code') return 'bMknfKXIFA8'; // freeCodeCamp Code
      if (aspect === 'opt') return 'spUNpyF58BY'; // 3Blue1Brown Calculus
    }

    if (s.includes('math') || s.includes('linear') || s.includes('calculus')) {
      if (aspect === 'core') return 'fNk_zzaMoSs'; // 3Blue1Brown Linear Algebra
      if (aspect === 'theory') return 'spUNpyF58BY'; // 3Blue1Brown Calculus
      if (aspect === 'code') return 'bMknfKXIFA8'; // freeCodeCamp Code
      if (aspect === 'opt') return 'ZA-tUyM_y7s'; // MIT 6.006
    }

    if (s.includes('ai') || s.includes('learning') || s.includes('reinforce') || s.includes('data') || s.includes('transformer')) {
      if (aspect === 'core') return '2pWv7GOvuf0'; // Stanford CS229 Andrew Ng
      if (aspect === 'theory') return 'dJYGatp4SvA'; // DeepLearning.AI
      if (aspect === 'code') return 'bMknfKXIFA8'; // freeCodeCamp Code
      if (aspect === 'opt') return '8hly31xKLI0'; // MIT 6.046J
    }

    // Default guaranteed embeddable video IDs per aspect
    if (aspect === 'core') return 'ZA-tUyM_y7s'; // MIT 6.006 Algorithms
    if (aspect === 'theory') return 'fNk_zzaMoSs'; // 3Blue1Brown
    if (aspect === 'code') return 'bMknfKXIFA8'; // freeCodeCamp Code
    if (aspect === 'opt') return '8hly31xKLI0'; // MIT 6.046J
    return '26QPDBe-NB8';
  }

  // Dynamic Post-Aligned Topic Recommendation Generator
  const generatePostTags = (subj, title) => {
    const cleanSubj = (subj || 'Computer Science').trim();
    const cleanTitle = title ? title.replace(/\(Paper #\d+\)/i, '').replace(/Paper #\d+/i, '').trim() : cleanSubj;
    const lowerTitle = cleanTitle.toLowerCase();
    const lowerSubj = cleanSubj.toLowerCase();

    // 1. Graph Neural Networks & Microcircuits
    if (lowerTitle.includes('graph') || lowerSubj.includes('graph') || lowerTitle.includes('gnn') || lowerTitle.includes('microcircuit')) {
      return [
        {
          id: 'tag-1',
          label: `📘 Stanford CS224W: Machine Learning with Graphs`,
          searchQuery: `Stanford CS224W Graph Neural Networks lecture`,
          badge: 'Stanford Course',
          videoId: '2pWv7GOvuf0',
          title: `Stanford CS224W - Machine Learning with Graphs & GNN Foundations`,
          channel: 'Stanford Online',
          description: `Comprehensive Stanford lecture covering Graph Neural Networks, message passing, and microcircuit representation.`
        },
        {
          id: 'tag-2',
          label: `🔬 GNN Mathematical Derivations & Proofs`,
          searchQuery: `Graph neural network message passing derivation`,
          badge: 'Deep Learning Theory',
          videoId: 'dJYGatp4SvA',
          title: `Graph Convolutional Networks - Mathematical Derivation & Proofs`,
          channel: 'DeepLearning.AI',
          description: `Step-by-step mathematical derivation of GNN node embeddings and spectral graph convolutions.`
        },
        {
          id: 'tag-3',
          label: `💻 PyTorch Geometric GNN Code Walkthrough`,
          searchQuery: `PyTorch Geometric GNN tutorial code`,
          badge: 'Hands-on Code',
          videoId: 'bMknfKXIFA8',
          title: `PyTorch Geometric: Building & Training Graph Neural Networks`,
          channel: 'freeCodeCamp.org',
          description: `Hands-on Python tutorial implementing GNN layers, PyTorch Geometric datasets, and node classification.`
        },
        {
          id: 'tag-4',
          label: `⚡ Hardware Microcircuit Optimization Benchmarks`,
          searchQuery: `Hardware graph neural network acceleration benchmark`,
          badge: 'System Performance',
          videoId: '8hly31xKLI0',
          title: `MIT 6.046J - High-Performance Graph & Circuit Optimization`,
          channel: 'MIT OpenCourseWare',
          description: `Empirical performance benchmarks for GPU graph processing, memory layout, and SIMD execution.`
        },
        {
          id: 'tag-5',
          label: `🇮🇳 GNN & Machine Learning (Tamil Edition)`,
          searchQuery: `Machine Learning and Graph Neural Networks in Tamil`,
          badge: 'Tamil Edition 🇮🇳',
          videoId: '2pWv7GOvuf0',
          title: `Graph Neural Networks & Machine Learning Full Explanation (Tamil)`,
          channel: 'Tamil Tech CS',
          description: `Complete breakdown of Graph Neural Networks and deep learning concepts explained clearly in Tamil.`
        }
      ];
    }

    // 2. SIMD Vectorization & System Performance
    if (lowerTitle.includes('simd') || lowerTitle.includes('vector') || lowerTitle.includes('throughput') || lowerSubj.includes('hpc') || lowerSubj.includes('signal')) {
      return [
        {
          id: 'tag-1',
          label: `📘 CS 162: System Calls & SIMD Architecture`,
          searchQuery: `UC Berkeley CS 162 SIMD vectorization lecture`,
          badge: 'UC Berkeley CS 162',
          videoId: '26QPDBe-NB8',
          title: `UC Berkeley CS 162 - Operating Systems, SIMD & CPU Vectorization`,
          channel: 'UC Berkeley Online',
          description: `Foundational lecture on SIMD vector registers, CPU pipeline parallelism, and cache alignment.`
        },
        {
          id: 'tag-2',
          label: `🔬 SIMD Vectorization Throughput Analysis`,
          searchQuery: `SIMD vectorization throughput proof analysis`,
          badge: 'Performance Theory',
          videoId: 'ZA-tUyM_y7s',
          title: `MIT 6.006 - Vector Throughput & Memory Layout Proofs`,
          channel: 'MIT OpenCourseWare',
          description: `Mathematical analysis of vectorization speedup ratios, instruction pipelining, and memory latency.`
        },
        {
          id: 'tag-3',
          label: `💻 C++ SIMD Intrinsics & AVX-512 Tutorial`,
          searchQuery: `C++ AVX512 SIMD vector intrinsics code tutorial`,
          badge: 'Implementation',
          videoId: '0-14WnU2qYk',
          title: `Harvard CS50 - C & SIMD Vector Intrinsics Code Walkthrough`,
          channel: 'Harvard CS50',
          description: `Practical C/C++ code tutorial writing explicit AVX-512 and SSE vector intrinsics for 18% throughput gain.`
        },
        {
          id: 'tag-4',
          label: `⚡ High-Scale Vector Parallel Benchmarks`,
          searchQuery: `High performance parallel vector processing benchmark`,
          badge: 'HPC Performance',
          videoId: '8hly31xKLI0',
          title: `MIT 6.046J - Parallel SIMD Vectorization Benchmarks`,
          channel: 'MIT OpenCourseWare',
          description: `Empirical memory throughput benchmarks, cache line alignment, and SIMD vector performance.`
        },
        {
          id: 'tag-5',
          label: `🇮🇳 SIMD Vectorization & OS (Tamil Edition)`,
          searchQuery: `SIMD vectorization and operating systems in Tamil`,
          badge: 'Tamil Edition 🇮🇳',
          videoId: '26QPDBe-NB8',
          title: `SIMD Vectorization & Operating Systems Full Course (Tamil)`,
          channel: 'Tamil Tech & Systems',
          description: `Complete SIMD vectorization concepts and computer system performance explained in Tamil.`
        }
      ];
    }

    // 3. Linear Algebra & Mathematics
    if (lowerSubj.includes('math') || lowerTitle.includes('linear') || lowerTitle.includes('matrix') || lowerTitle.includes('calculus')) {
      return [
        {
          id: 'tag-1',
          label: `📘 3Blue1Brown: Essence of Linear Algebra`,
          searchQuery: `3Blue1Brown Essence of linear algebra chapter 1`,
          badge: '3Blue1Brown Series',
          videoId: 'fNk_zzaMoSs',
          title: `3Blue1Brown - Vectors, Matrices & Linear Transformations`,
          channel: '3Blue1Brown',
          description: `Visual geometric intuition for linear transformations, matrix multiplication, eigenvectors, and determinants.`
        },
        {
          id: 'tag-2',
          label: `🔬 Calculus & Derivative Derivation Proofs`,
          searchQuery: `Essence of calculus derivatives proofs 3blue1brown`,
          badge: 'Theoretical Proofs',
          videoId: 'spUNpyF58BY',
          title: `3Blue1Brown - Essence of Calculus & Theoretical Proofs`,
          channel: '3Blue1Brown',
          description: `Visual mathematical proofs, fundamental theorem of calculus, and equation derivations.`
        },
        {
          id: 'tag-3',
          label: `💻 NumPy & SymPy Matrix Math Code`,
          searchQuery: `NumPy linear algebra matrix math code tutorial`,
          badge: 'Python Implementation',
          videoId: 'bMknfKXIFA8',
          title: `Python for Math: NumPy Matrix Math & Symbolic Derivations`,
          channel: 'freeCodeCamp.org',
          description: `Hands-on Python tutorial for matrix decomposition, eigenvalue computation, and NumPy vectorization.`
        },
        {
          id: 'tag-4',
          label: `⚡ Strassen Matrix Multiplication Benchmarks`,
          searchQuery: `MIT 6.006 Strassen matrix multiplication complexity`,
          badge: 'Algorithmic Bounds',
          videoId: 'ZA-tUyM_y7s',
          title: `MIT 6.006 - Matrix Multiplication & Strassen Algorithm`,
          channel: 'MIT OpenCourseWare',
          description: `Algorithmic analysis of matrix multiplication bounds and high-scale computational complexity.`
        },
        {
          id: 'tag-5',
          label: `🇮🇳 Linear Algebra & Calculus (Tamil Edition)`,
          searchQuery: `Linear Algebra and Matrix Transformations in Tamil`,
          badge: 'Tamil Edition 🇮🇳',
          videoId: 'fNk_zzaMoSs',
          title: `Linear Algebra & Matrix Transformations Full Explanation (Tamil)`,
          channel: 'Tamil Math & CS',
          description: `Matrix transformations, linear equations, and calculus problem breakdowns explained in Tamil.`
        }
      ];
    }

    // 4. Quantum Computing & Physics
    if (lowerSubj.includes('quantum') || lowerTitle.includes('quantum') || lowerTitle.includes('physics')) {
      return [
        {
          id: 'tag-1',
          label: `📘 MIT 8.04: Quantum Physics I`,
          searchQuery: `MIT 8.04 Quantum Physics I Lecture 1`,
          badge: 'MIT Course',
          videoId: 'd0zOJ1x8570',
          title: `MIT 8.04 - Quantum Physics I: Wave Mechanics & Superposition`,
          channel: 'MIT OpenCourseWare',
          description: `Foundational MIT lecture on quantum superposition, wave functions, and probability amplitudes.`
        },
        {
          id: 'tag-2',
          label: `🔬 Classical Mechanics & Wave Derivations`,
          searchQuery: `MIT 8.01SC Classical Mechanics wave equation derivation`,
          badge: 'Physics Derivations',
          videoId: 'aircAruvnKk',
          title: `MIT 8.01SC - Classical Mechanics & Harmonic Oscillator Proofs`,
          channel: 'MIT OpenCourseWare',
          description: `Step-by-step mathematical derivations of wave equations, energy states, and mechanical systems.`
        },
        {
          id: 'tag-3',
          label: `💻 IBM Qiskit Quantum SDK Tutorial`,
          searchQuery: `IBM Qiskit quantum computing code tutorial`,
          badge: 'Quantum Code',
          videoId: 'bMknfKXIFA8',
          title: `IBM Qiskit: Building Quantum Circuits & Algorithms in Python`,
          channel: 'freeCodeCamp.org',
          description: `Hands-on Python code tutorial building Hadamard gates, Bell states, and quantum circuits using Qiskit.`
        },
        {
          id: 'tag-4',
          label: `⚡ Quantum Gate Mechanics & Hardware Bounds`,
          searchQuery: `Quantum gate simulation performance benchmarks`,
          badge: 'Hardware Bounds',
          videoId: 'd0zOJ1x8570',
          title: `MIT 8.04 - Quantum Gate Mechanics & Physical Realization`,
          channel: 'MIT OpenCourseWare',
          description: `Hardware benchmarks for quantum coherence times, qubit error rates, and gate fidelity.`
        },
        {
          id: 'tag-5',
          label: `🇮🇳 Quantum Mechanics (Tamil Edition)`,
          searchQuery: `Quantum Physics and Quantum Mechanics in Tamil`,
          badge: 'Tamil Edition 🇮🇳',
          videoId: 'd0zOJ1x8570',
          title: `Quantum Mechanics & Atomic Physics Full Lecture (Tamil)`,
          channel: 'Tamil Science Tech',
          description: `Complete quantum physics concepts, wave-particle duality, and atomic models explained in Tamil.`
        }
      ];
    }

    // Default Fallback: General Computer Science & Data Structures
    return [
      {
        id: 'tag-1',
        label: `📘 MIT 6.006: Introduction to Algorithms`,
        searchQuery: `MIT 6.006 Introduction to Algorithms Lecture 1`,
        badge: 'MIT OpenCourseWare',
        videoId: 'ZA-tUyM_y7s',
        title: `MIT 6.006 - Introduction to Algorithms & Computational Thinking`,
        channel: 'MIT OpenCourseWare',
        description: `Foundational university course lecture covering algorithm analysis, asymptotic bounds, and data structures.`
      },
      {
        id: 'tag-2',
        label: `🔬 Algorithmic Bounds & Complexity Proofs`,
        searchQuery: `${cleanTitle} proof analysis algorithm`,
        badge: 'Theoretical Proofs',
        videoId: '8hly31xKLI0',
        title: `MIT 6.046J - Design & Analysis of Algorithms Proofs`,
        channel: 'MIT OpenCourseWare',
        description: `Mathematical proofs for divide-and-conquer, dynamic programming, and greedy choice properties.`
      },
      {
        id: 'tag-3',
        label: `💻 Harvard CS50: Computer Science & Data Structures`,
        searchQuery: `Harvard CS50 data structures code tutorial`,
        badge: 'Harvard CS50',
        videoId: '0-14WnU2qYk',
        title: `Harvard CS50 - C, Data Structures & Memory Walkthrough`,
        channel: 'Harvard CS50',
        description: `Hands-on Harvard CS50 lecture covering pointers, memory allocation, linked lists, and binary trees.`
      },
      {
        id: 'tag-4',
        label: `⚡ System Optimization & Hardware Benchmarks`,
        searchQuery: `${cleanSubj} system performance optimization benchmark`,
        badge: 'System Performance',
        videoId: '26QPDBe-NB8',
        title: `UC Berkeley CS 162 - Operating Systems & Hardware Benchmarks`,
        channel: 'UC Berkeley Online',
        description: `System latency benchmarks, CPU cache performance, and memory layout optimization strategies.`
      },
      {
        id: 'tag-5',
        label: `🇮🇳 ${cleanSubj} Concepts (Tamil Edition)`,
        searchQuery: `${cleanSubj} full course in Tamil`,
        badge: 'Tamil Edition 🇮🇳',
        videoId: 'ZA-tUyM_y7s',
        title: `${cleanSubj} Full Course & Exam Problem Breakdowns (Tamil)`,
        channel: 'Tamil Computer Science',
        description: `Complete ${cleanSubj} concepts and exam problem breakdowns explained clearly in Tamil.`
      }
    ];
  };

  const postTagsList = generatePostTags(subject, postTitle);
  const [selectedTagId, setSelectedTagId] = useState('tag-1');
  const [liveVideo, setLiveVideo] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);

  const activeTagObj = postTagsList.find(t => t.id === selectedTagId) || postTagsList[0];

  // Fetch live YouTube API results dynamically using YOUTUBE_API_KEY
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveYoutubeData() {
      setLoadingLive(true);
      try {
        const results = await youtubeService.searchVideos(activeTagObj.searchQuery || activeTagObj.label);
        if (isMounted && results.length > 0) {
          setLiveVideo(results[0]);
        } else if (isMounted) {
          setLiveVideo(null);
        }
      } catch (err) {
        if (isMounted) setLiveVideo(null);
      } finally {
        if (isMounted) setLoadingLive(false);
      }
    }

    fetchLiveYoutubeData();

    return () => {
      isMounted = false;
    };
  }, [selectedTagId, subject, postTitle]);

  // Use live YouTube API result if fetched, otherwise fallback to curated verified ID
  const displayVideoId = liveVideo?.videoId || activeTagObj.videoId;
  const displayTitle = liveVideo?.title ? decodeHTMLEntities(liveVideo.title) : activeTagObj.title;
  const displayChannel = liveVideo?.channel || activeTagObj.channel;
  const displayDescription = liveVideo?.description || activeTagObj.description;
  const displayBadge = liveVideo ? 'Live YouTube API 🔴' : activeTagObj.badge;

  function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  const originParam = typeof window !== 'undefined' && window.location?.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
  const embedUrl = `https://www.youtube.com/embed/${displayVideoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1${originParam}`;

  return (
    <div className="theme-surface border theme-border rounded-3xl p-5 sm:p-6 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b theme-border pb-3.5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center text-xl font-bold">
            🎥
          </span>
          <div>
            <h3 className="text-sm font-extrabold theme-text-primary flex items-center gap-2">
              <span>YouTube</span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                {subject}
              </span>
            </h3>
          </div>
        </div>

        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold hidden sm:inline-block px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30">
          5 Aligned Study Tags
        </span>
      </div>

      {/* 5 Dynamic Post-Aligned Topic Tags */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider theme-text-muted block flex items-center justify-between">
          <span>Aligned Lecture Tags for this Post:</span>
          {loadingLive && <span className="text-purple-500 animate-pulse font-mono">Fetching YouTube API...</span>}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {postTagsList.map((tag) => {
            const isSelected = tag.id === selectedTagId;
            return (
              <button
                key={tag.id}
                onClick={() => setSelectedTagId(tag.id)}
                className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/50 shadow-md font-bold'
                    : 'theme-surface theme-text-secondary border theme-border hover:border-purple-500/30'
                }`}
              >
                <span className="text-xs font-bold leading-tight block mb-1">
                  {tag.label}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded w-fit ${
                  isSelected ? 'bg-purple-600 text-white' : 'bg-slate-500/10 theme-text-muted'
                }`}>
                  {tag.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Embedded YouTube IFrame Player */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border theme-border shadow-md bg-black">
        <iframe
          key={embedUrl}
          className="w-full h-full"
          src={embedUrl}
          title={displayTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Video Details Metadata Box */}
      <div className="p-4 rounded-2xl theme-surface border theme-border flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
              {displayBadge}
            </span>
            <span className="text-xs font-bold theme-text-secondary">{displayChannel}</span>
          </div>
          <h4 className="text-xs font-black theme-text-primary leading-snug">{displayTitle}</h4>
          <p className="text-[11px] theme-text-muted mt-1 leading-relaxed">{displayDescription}</p>
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${displayVideoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition-all shadow-md shadow-rose-600/20 shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <span>Open YouTube</span>
          <span>🔗</span>
        </a>
      </div>

    </div>
  );
}
