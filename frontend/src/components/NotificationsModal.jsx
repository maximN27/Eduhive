import React from 'react';
import { useApp } from '../context/AppContext';

export default function NotificationsModal({ isOpen, onClose }) {
  const { notifications = [
    { id: 1, title: 'Dr. Aris Thorne upvoted your post', time: '10m ago', type: 'upvote', unread: true },
    { id: 2, title: 'Elena Rostova commented on BFS vs DFS', time: '1h ago', type: 'comment', unread: true },
    { id: 3, title: 'New resource added: System Design Guide PDF', time: '3h ago', type: 'resource', unread: false },
    { id: 4, title: 'You earned +50 XP for daily study streak!', time: '1d ago', type: 'achievement', unread: false },
  ] } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md theme-card p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius)' }}
      >
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-base font-bold theme-text-primary">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-500/10 theme-text-muted hover:theme-text-primary transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-2.5 max-h-[360px] overflow-y-auto custom-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-xl border flex items-start gap-3 transition-colors"
              style={{
                backgroundColor: n.unread ? 'var(--primary-light)' : 'var(--surface-main)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 font-bold"
                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--primary)' }}
              >
                {n.type === 'upvote' ? '▲' : n.type === 'comment' ? '💬' : n.type === 'achievement' ? '⚡' : '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold theme-text-primary leading-snug">{n.title}</p>
                <span className="text-[10px] theme-text-muted font-mono mt-1 block">{n.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
          <button onClick={onClose} className="btn-primary text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
