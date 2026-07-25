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
  const [showResourceInput, setShowResourceInput] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('PDF Guide');
  const [resourceUrl, setResourceUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const processedTags = tagInput
      ? tagInput.split(',').map(t => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean)
      : [];

    const resources = resourceTitle.trim() && resourceUrl.trim()
      ? [{
          id: `r-${Date.now()}`,
          title: resourceTitle.trim(),
          type: resourceType,
          url: resourceUrl.trim(),
          subject: subjects.find(s => s.id === subjectId)?.name || 'General'
        }]
      : [];

    addPost({
      title: title.trim(),
      subjectId,
      tags: processedTags,
      content: content.trim(),
      codeSnippet: codeSnippet.trim(),
      resources
    });

    // Reset Form
    setTitle('');
    setContent('');
    setCodeSnippet('');
    setResourceTitle('');
    setResourceUrl('');
    setTagInput('');
    setShowCodeInput(false);
    setShowResourceInput(false);
    setIsOpen(false);
  };

  return (
    <div className="mb-5">
      {!isOpen ? (
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full border theme-border theme-surface rounded-2xl px-5 py-3.5 text-sm theme-text-muted transition-all cursor-pointer hover:border-cyan-500/50 flex items-center justify-between"
        >
          <span>Share an academic insight, question, or research paper...</span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
            + Create Post
          </span>
        </div>
      ) : (
        <div className="border theme-border theme-surface rounded-2xl p-5">
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b pb-3 theme-border">
              <span className="text-sm font-bold theme-text-primary">Create Academic Post</span>
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

            {showCodeInput && (
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
            )}

            {showResourceInput ? (
              <div className="p-3 rounded-xl border space-y-2.5 theme-surface theme-border">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Attach Study Resource</span>
                  <button
                    type="button"
                    onClick={() => setShowResourceInput(false)}
                    className="text-[10px] text-rose-500 hover:underline"
                  >
                    Remove resource
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="Resource Title (e.g. Cheat Sheet PDF)"
                    className="sm:col-span-2 border rounded-lg px-2.5 py-1.5 text-xs theme-text-primary focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
                  />
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="border rounded-lg px-2 py-1.5 text-xs theme-text-primary focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
                  >
                    <option value="PDF Guide">📄 PDF Guide</option>
                    <option value="Research Paper">📑 Research Paper</option>
                    <option value="Video Lecture">🎥 Video Lecture</option>
                    <option value="GitHub Repo">💻 GitHub Repo</option>
                    <option value="Interactive Note">✏️ Interactive Note</option>
                  </select>
                </div>
                <input
                  type="url"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="Resource URL / Link (https://...)"
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs theme-text-primary focus:outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {!showCodeInput && (
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(true)}
                    className="btn-secondary text-xs"
                  >
                    + Add Code Snippet
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowResourceInput(true)}
                  className="btn-secondary text-xs"
                >
                  + Attach Resource
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t theme-border">
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
        </div>
      )}
    </div>
  );
}
