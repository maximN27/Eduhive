import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FlashcardsQuizModal({ isOpen, onClose }) {
  const { activeSubject, subjects, handleSelectSubject } = useApp();
  const [selectedCommunityId, setSelectedCommunityId] = useState(activeSubject || 'cs');
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'create' | 'resources'
  
  // Custom Quiz Configuration State
  const [isConfiguringQuiz, setIsConfiguringQuiz] = useState(true);
  const [targetQuestionCount, setTargetQuestionCount] = useState(5);
  const [quizDifficulty, setQuizDifficulty] = useState('intermediate');
  const [timerMode, setTimerMode] = useState('untimed');

  // Custom Authoring Question Form State
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [newExplanationText, setNewExplanationText] = useState('');

  // Flashcard & Quiz Progress State
  const [xpEarned, setXpEarned] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  const currentCommunity = subjects.find(s => s.id === selectedCommunityId) || subjects[0] || {
    id: 'cs', name: 'Computer Science', icon: '💻'
  };

  // Base Quiz Data Pools
  const communityQuizzes = {
    cs: [
      { id: 1, question: 'Which data structure offers O(1) average time complexity for insertion, deletion, and search?', options: ['Array', 'Hash Table', 'Binary Search Tree', 'Linked List'], correct: 1, explanation: 'Hash Tables compute bucket indices in O(1) average time using hash functions.', resource: { title: 'DSA Complete Cheat Sheet & Complexity Chart (PDF)', size: '2.4 MB', icon: '📄' } },
      { id: 2, question: 'What is the worst-case time complexity of standard QuickSort with poor pivot selection?', options: ['O(N log N)', 'O(N)', 'O(N²)', 'O(2^N)'], correct: 2, explanation: 'When array is sorted and pivot is always smallest/largest element, recursion depth reaches N, yielding O(N²).', resource: { title: 'QuickSort & Divide-Conquer Python Notebook (.ipynb)', size: '1.1 MB', icon: '📓' } },
      { id: 3, question: 'In graph theory, which algorithm guarantees finding shortest path in unweighted graphs?', options: ['Dijkstra', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Kruskal'], correct: 1, explanation: 'BFS explores graph level-by-level, ensuring shortest hop count path first in unweighted graphs.', resource: { title: 'Graph Algorithms & Traversal Guide (PDF)', size: '1.8 MB', icon: '📄' } },
      { id: 4, question: 'What is the main benefit of B-Trees in database index design?', options: ['O(1) lookup always', 'Minimizes disk I/O operations by keeping node fan-out high', 'Uses zero memory', 'Requires no pointers'], correct: 1, explanation: 'High node fan-out in B-Trees matches disk block reads, minimizing expensive I/O operations.', resource: { title: 'Database B-Tree Indexing Architecture (PDF)', size: '3.1 MB', icon: '🗄️' } },
      { id: 5, question: 'Which protocol operates at the Transport Layer (Layer 4) of the OSI model?', options: ['HTTP', 'TCP', 'IP', 'Ethernet'], correct: 1, explanation: 'TCP and UDP provide end-to-end transport communication at OSI Layer 4.', resource: { title: 'OSI Model & TCP/IP Networking Cheat Sheet', size: '1.9 MB', icon: '🌐' } }
    ],
    math: [
      { id: 1, question: 'What is the geometric meaning of the Determinant of a 2x2 matrix?', options: ['Vector length', 'Area scaling factor of transformation', 'Rotation angle', 'Slope of line'], correct: 1, explanation: 'Determinant det(A) measures how much the unit square area stretches or shrinks under linear mapping A.', resource: { title: 'Linear Algebra Geometric Proofs (PDF)', size: '2.8 MB', icon: '📐' } },
      { id: 2, question: 'What condition guarantees that a square matrix A has an inverse A⁻¹?', options: ['det(A) = 0', 'det(A) ≠ 0', 'A is symmetric', 'A has zero entries'], correct: 1, explanation: 'A matrix is invertible if and only if its determinant is non-zero (full rank).', resource: { title: '3Blue1Brown Matrix Notes & Proofs', size: '1.9 MB', icon: '✏️' } },
      { id: 3, question: 'What is the derivative of e^(3x) with respect to x?', options: ['e^(3x)', '3 e^(3x)', 'x e^(3x)', '3x e^(3x)'], correct: 1, explanation: 'Using the chain rule, d/dx[e^(3x)] = 3 * e^(3x).', resource: { title: 'Calculus Differentiation Rules Reference', size: '1.4 MB', icon: '📄' } }
    ],
    ds: [
      { id: 1, question: 'Why does scaled dot-product attention divide dot products by sqrt(d_k)?', options: ['To make values integer', 'To prevent vanishing gradients in softmax for large d_k', 'To increase learning rate', 'To reduce model parameter count'], correct: 1, explanation: 'Dividing by sqrt(d_k) prevents large dot products from pushing softmax into saturation regions with vanishing gradients.', resource: { title: 'Annotated Transformer Paper & PyTorch Code (PDF)', size: '4.1 MB', icon: '📚' } },
      { id: 2, question: 'What is the primary effect of L1 (Lasso) Regularization on model weights?', options: ['Shrinks weights without zeroing', 'Pushes uninformative weights to exactly 0 (sparsity)', 'Multiplies weights by 2', 'Increases variance'], correct: 1, explanation: 'L1 absolute value penalty constraint alignment drives non-essential feature weights to exactly zero.', resource: { title: 'Machine Learning Regularization Cheat Sheet (PDF)', size: '1.5 MB', icon: '📄' } }
    ]
  };

  const communityResourcesCatalog = {
    cs: [
      { id: 'cr-1', title: 'DSA Complete Cheat Sheet & Complexity Chart (PDF)', size: '2.4 MB', type: 'PDF Document', icon: '📄', desc: 'Complete reference for Big-O bounds across arrays, trees, heaps, and graphs.' },
      { id: 'cr-2', title: 'Graph Search BFS & DFS Python Notebook (.ipynb)', size: '1.4 MB', type: 'Jupyter Notebook', icon: '📓', desc: 'Executable Python code for graph shortest path traversals.' },
      { id: 'cr-3', title: 'System Design Interview Roadmap (PDF)', size: '3.6 MB', type: 'PDF Guide', icon: '📄', desc: 'Scalable architecture blueprints, load balancers, caching & sharding.' }
    ],
    math: [
      { id: 'cr-4', title: 'Linear Algebra 3Blue1Brown Notes & Proofs', size: '1.8 MB', type: 'Interactive Note', icon: '📐', desc: 'Matrix transformations, SVD decomposition, and eigenvector proofs.' },
      { id: 'cr-5', title: 'Multivariable Calculus III Formula Sheet (PDF)', size: '2.1 MB', type: 'PDF Document', icon: '📄', desc: 'Gradient vectors, Jacobians, line integrals & Stokes Theorem.' }
    ]
  };

  const rawQuestions = communityQuizzes[selectedCommunityId] || communityQuizzes['cs'];
  const activeQuestions = rawQuestions.slice(0, Math.min(targetQuestionCount, rawQuestions.length));
  const activeResources = communityResourcesCatalog[selectedCommunityId] || communityResourcesCatalog['cs'];
  const currentQ = activeQuestions[quizIndex % activeQuestions.length];

  const handleCommunityChange = (e) => {
    const newCommId = e.target.value;
    setSelectedCommunityId(newCommId);
    handleSelectSubject(newCommId);
    setIsConfiguringQuiz(true);
    setQuizIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
    setQuizScore(0);
  };

  const handleStartQuiz = () => {
    setIsConfiguringQuiz(false);
    setQuizIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
    setQuizScore(0);
  };

  const handleOptionSelect = (idx) => {
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correct) {
      setQuizScore(prev => prev + 1);
      setXpEarned(prev => prev + 25);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 >= activeQuestions.length) {
      setQuizFinished(true);
    } else {
      setSelectedOption(null);
      setShowExplanation(false);
      setQuizIndex(prev => prev + 1);
    }
  };

  const handleAddCustomQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText || !newOptionA || !newOptionB) return;
    
    const createdQ = {
      id: Date.now(),
      question: newQuestionText,
      options: [newOptionA, newOptionB, newOptionC || 'Option C', newOptionD || 'Option D'],
      correct: parseInt(correctOptionIdx),
      explanation: newExplanationText || 'Custom question authored by student scholar.',
      resource: { title: `${currentCommunity.name} Author Resource`, size: '1.0 MB', icon: '📄' }
    };

    rawQuestions.push(createdQ);
    alert(`Successfully added custom question to ${currentCommunity.name} quiz pool!`);

    // Reset Form
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewExplanationText('');
    setActiveTab('quiz');
    setIsConfiguringQuiz(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#111A2E] border border-cyan-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-xl font-bold">
              {currentCommunity.icon || '📚'}
            </span>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Community Quiz & Practice Hub</span>
              </h2>
              <p className="text-xs text-slate-400">Configure questions count, difficulty & custom authoring</p>
            </div>
          </div>

          {/* Community Selector Dropdown */}
          <div className="flex items-center gap-2.5">
            <label className="text-xs font-bold text-slate-300">Community:</label>
            <select
              value={selectedCommunityId}
              onChange={handleCommunityChange}
              className="bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.icon || '📚'} {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
              + {xpEarned} XP
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-2 bg-slate-950 border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚙️ Custom Quiz Setup & Practice
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ➕ Author New Question
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'resources'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📂 Tied Study Resources
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">

          {/* TAB 1: QUIZ SETUP SCREEN */}
          {activeTab === 'quiz' && isConfiguringQuiz && (
            <div className="space-y-6 max-w-xl mx-auto my-auto w-full">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white">Customize Quiz Settings</h3>
                <p className="text-xs text-slate-400">Target Community: <span className="text-cyan-300 font-bold">{currentCommunity.name}</span></p>
              </div>

              <div className="space-y-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                
                {/* Question Count Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Number of Questions:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 10, 15].map(num => (
                      <button
                        key={num}
                        onClick={() => setTargetQuestionCount(num)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          targetQuestionCount === num
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num} Qs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Difficulty Level:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'beginner', label: 'Beginner 🌱' },
                      { id: 'intermediate', label: 'Intermediate ⚡' },
                      { id: 'advanced', label: 'Advanced 🚀' }
                    ].map(diff => (
                      <button
                        key={diff.id}
                        onClick={() => setQuizDifficulty(diff.id)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          quizDifficulty === diff.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timer Mode */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Timer Mode:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTimerMode('untimed')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        timerMode === 'untimed'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Untimed Practice ⏱️
                    </button>
                    <button
                      onClick={() => setTimerMode('60s')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        timerMode === '60s'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Timed (60s / Question) ⏳
                    </button>
                  </div>
                </div>

              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black transition-all shadow-xl shadow-cyan-600/30 cursor-pointer text-center"
              >
                Start Custom Quiz ({targetQuestionCount} Questions) →
              </button>
            </div>
          )}

          {/* TAB 1: ACTIVE QUIZ QUESTIONS */}
          {activeTab === 'quiz' && !isConfiguringQuiz && !quizFinished && (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Community: <strong className="text-cyan-300">{currentCommunity.name}</strong></span>
                <span>Question {quizIndex + 1} of {activeQuestions.length}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                <h3 className="text-sm font-extrabold text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correct;
                  let styleClass = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-900';

                  if (selectedOption !== null) {
                    if (isCorrect) styleClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    else if (isSelected) styleClass = 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => selectedOption === null && handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${styleClass}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                      {selectedOption !== null && isCorrect && <span className="text-emerald-400 font-extrabold text-xs">✓ Correct</span>}
                      {selectedOption !== null && isSelected && !isCorrect && <span className="text-rose-400 font-extrabold text-xs">✕ Incorrect</span>}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-xs text-slate-200 animate-in fade-in duration-200">
                  <span className="font-extrabold text-cyan-300 block mb-1">💡 Solution Breakdown:</span>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-extrabold transition-all shadow-lg shadow-cyan-600/20 cursor-pointer"
                >
                  {quizIndex + 1 === activeQuestions.length ? 'Finish Quiz 🏆' : 'Next Question →'}
                </button>
              </div>

            </div>
          )}

          {/* QUIZ FINISHED MASTERY SCREEN */}
          {activeTab === 'quiz' && quizFinished && (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300 my-auto">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-3xl flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
                🏆
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Quiz Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Community: <strong className="text-cyan-300">{currentCommunity.name}</strong>
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-around">
                <div>
                  <p className="text-xs text-slate-400 font-mono">Score</p>
                  <p className="text-xl font-black text-cyan-300">{quizScore} / {activeQuestions.length}</p>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">XP Earned</p>
                  <p className="text-xl font-black text-amber-400">+{quizScore * 25} XP</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setIsConfiguringQuiz(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Configure New Quiz ⚙️
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AUTHOR NEW QUESTION FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleAddCustomQuestion} className="space-y-4 max-w-xl mx-auto w-full my-auto">
              <h3 className="text-sm font-extrabold text-white">Author Custom Quiz Question for <span className="text-cyan-300">{currentCommunity.name}</span></h3>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Question Prompt:</label>
                <textarea
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter academic question statement..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="text"
                  value={newOptionA}
                  onChange={(e) => setNewOptionA(e.target.value)}
                  placeholder="Option A"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
                <input
                  required
                  type="text"
                  value={newOptionB}
                  onChange={(e) => setNewOptionB(e.target.value)}
                  placeholder="Option B"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={newOptionC}
                  onChange={(e) => setNewOptionC(e.target.value)}
                  placeholder="Option C"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={newOptionD}
                  onChange={(e) => setNewOptionD(e.target.value)}
                  placeholder="Option D"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-300">Correct Option:</label>
                <select
                  value={correctOptionIdx}
                  onChange={(e) => setCorrectOptionIdx(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-bold rounded-xl px-3 py-1.5"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Solution Breakdown / Explanation:</label>
                <input
                  type="text"
                  value={newExplanationText}
                  onChange={(e) => setNewExplanationText(e.target.value)}
                  placeholder="Provide brief explanation for correct answer..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold cursor-pointer transition-all shadow-lg shadow-cyan-600/20"
              >
                Save & Add Question to Quiz Pool ➕
              </button>
            </form>
          )}

          {/* TAB 3: TIED COMMUNITY STUDY RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
                  <span>Tied Study Resources for <span className="text-cyan-300">{currentCommunity.name}</span></span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {activeResources.length} Documents & Notebooks
                </span>
              </div>

              <div className="space-y-3">
                {activeResources.map((res) => (
                  <div 
                    key={res.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 text-lg flex items-center justify-center shrink-0">
                        {res.icon}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{res.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{res.desc}</p>
                        <span className="text-[10px] font-mono text-cyan-400 mt-1 inline-block">{res.type} • {res.size}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert(`Opening ${res.title} study guide...`)}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shrink-0"
                    >
                      Study 📖
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
