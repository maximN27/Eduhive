import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CreatePostBox() {
  const { user, subjects, addPost, activeSubject } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(activeSubject || 'cs');
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const processedTags = tagInput
      ? tagInput.split(',').map(t => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean)
      : [];

    addPost({
      title: title.trim(),
      subjectId,
      tags: processedTags,
      content: content.trim(),
      codeSnippet: codeSnippet.trim()
    });

    // Reset Form
    setTitle('');
    setContent('');
    setCodeSnippet('');
    setTagInput('');
    setShowCodeInput(false);
    setIsOpen(false);
  };

  return (
    <div className="theme-card p-5 mb-6 transition-all">
      {!isOpen ? (
        <div 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 transition-all shrink-0"
            style={{ ringColor: 'var(--primary-border)' }}
          />
          <div 
            className="flex-1 border rounded-xl px-4 py-2.5 text-xs transition-all flex items-center justify-between"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--text-muted)'
            }}
          >
            <span>Share an academic concept, theorem, or question...</span>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded font-bold" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2.5">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs font-bold theme-text-primary">Create Academic Post</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs theme-text-muted hover:theme-text-primary"
            >
              Cancel ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">Subject Community</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">Subtopic Tags (comma separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. algorithms, dsa, react"
                className="w-full border rounded-xl px-3 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">Post Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a clear, descriptive title..."
              className="w-full border rounded-xl px-3.5 py-2 text-xs font-semibold theme-text-primary placeholder:theme-text-muted focus:outline-none"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 theme-text-secondary">Content & Explanation</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain the concept, theorem proof, or question details..."
              className="w-full border rounded-xl p-3 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none leading-relaxed"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
            />
          </div>

          {showCodeInput ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono font-bold" style={{ color: 'var(--primary)' }}>Code Snippet (Optional)</label>
                <button
                  type="button"
                  onClick={() => setShowCodeInput(false)}
                  className="text-[10px] text-rose-500 hover:underline"
                >
                  Remove code
                </button>
              </div>
              <textarea
                rows={3}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste code or mathematical pseudocode..."
                className="w-full border rounded-xl p-3 text-xs font-mono focus:outline-none"
                style={{
                  backgroundColor: 'var(--code-bg)',
                  borderColor: 'var(--code-border)',
                  color: 'var(--code-text)'
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCodeInput(true)}
              className="btn-secondary text-xs"
            >
              + Add Code Snippet
            </button>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              Publish Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
