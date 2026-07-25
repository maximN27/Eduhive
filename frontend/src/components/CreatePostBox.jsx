import React, { useState, useRef } from 'react';
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
  
  // Local image file insertion state & ref
  const [localImages, setLocalImages] = useState([]);
  const fileInputRef = useRef(null);

  // Local resource file insertion state & ref
  const [attachedResourceFiles, setAttachedResourceFiles] = useState([]);
  const resourceFileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setLocalImages(prev => [...prev, ev.target.result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    // Reset file input so user can pick same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResourceFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const ext = file.name.split('.').pop()?.toLowerCase() || '';
          let type = 'Study Resource';
          let icon = '📁';
          if (['pdf'].includes(ext)) { type = 'PDF Guide'; icon = '📄'; }
          else if (['doc', 'docx', 'txt', 'rtf', 'md'].includes(ext)) { type = 'Research Paper'; icon = '📑'; }
          else if (['ppt', 'pptx'].includes(ext)) { type = 'Lecture Presentation'; icon = '📊'; }
          else if (['zip', 'rar', 'tar', 'gz'].includes(ext)) { type = 'Resource Archive'; icon = '📦'; }
          else if (['py', 'js', 'jsx', 'ts', 'tsx', 'cpp', 'c', 'java', 'ipynb'].includes(ext)) { type = 'Code Script'; icon = '💻'; }

          const k = 1024;
          const sizes = ['B', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(file.size || 1024) / Math.log(k));
          const formattedSize = parseFloat(((file.size || 1024) / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];

          const newRes = {
            id: `r-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: file.name,
            fileName: file.name,
            type,
            icon,
            size: formattedSize,
            url: ev.target.result,
            isFileResource: true,
            subject: subjects.find(s => s.id === subjectId)?.name || 'General'
          };
          setAttachedResourceFiles(prev => [...prev, newRes]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (resourceFileInputRef.current) resourceFileInputRef.current.value = '';
  };

  const removeLocalImage = (indexToRemove) => {
    setLocalImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeResourceFile = (idToRemove) => {
    setAttachedResourceFiles(prev => prev.filter(res => res.id !== idToRemove));
  };

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
      codeSnippet: codeSnippet.trim(),
      images: localImages,
      resources: attachedResourceFiles
    });

    // Reset Form
    setTitle('');
    setContent('');
    setCodeSnippet('');
    setTagInput('');
    setLocalImages([]);
    setAttachedResourceFiles([]);
    setShowCodeInput(false);
    setIsOpen(false);
  };

  return (
    <div className="mb-5">
      {!isOpen ? (
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full border theme-border theme-surface rounded-2xl px-5 py-3.5 text-sm theme-text-muted transition-all cursor-pointer hover:border-indigo-500/40 flex items-center justify-between"
        >
          <span>Share an academic insight, question, or research paper...</span>
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            + Create Post
          </span>
        </div>
      ) : (
        <div className="border theme-border theme-surface rounded-2xl p-5">
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-150">
            {/* Hidden File Inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            <input 
              type="file" 
              ref={resourceFileInputRef} 
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,.tar,.gz,.png,.jpg,.jpeg,.py,.js,.jsx,.ts,.tsx,.cpp,.c,.java,.ipynb" 
              multiple 
              onChange={handleResourceFileUpload} 
              className="hidden" 
            />

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

            {/* Local Image Thumbnail Preview Grid */}
            {localImages.length > 0 && (
              <div className="p-3 rounded-xl border space-y-2 theme-border" style={{ backgroundColor: 'var(--input-bg)' }}>
                <span className="text-[11px] font-bold theme-text-primary block">
                  Attached Local Images ({localImages.length})
                </span>
                <div className="flex flex-wrap gap-3">
                  {localImages.map((imgSrc, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border theme-border shrink-0 shadow-sm">
                      <img src={imgSrc} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeLocalImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-rose-600 transition-colors"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attached Study Resource Files List */}
            {attachedResourceFiles.length > 0 && (
              <div className="p-3 rounded-xl border space-y-2 theme-border" style={{ backgroundColor: 'var(--input-bg)' }}>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Attached Study Resource Files ({attachedResourceFiles.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attachedResourceFiles.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-2 rounded-xl border theme-border theme-surface">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300 border border-indigo-100 dark:border-slate-700 shrink-0">
                          {res.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold theme-text-primary truncate">{res.fileName}</p>
                          <p className="text-[10px] theme-text-muted font-mono">{res.type} • {res.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeResourceFile(res.id)}
                        className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center text-[10px] shrink-0 font-bold"
                        title="Remove File Resource"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t theme-border">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <span>📷</span>
                  <span>Add Local Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => resourceFileInputRef.current?.click()}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <span>📁</span>
                  <span>+ Attach Resource File</span>
                </button>

                {!showCodeInput && (
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(true)}
                    className="btn-secondary text-xs"
                  >
                    + Add Code Snippet
                  </button>
                )}
              </div>

              <div className="flex gap-2">
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
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
