import React, { useState } from 'react';

export default function NotificationsModal({ isOpen, onClose }) {
  const [items, setItems] = useState([
    { id: 1, title: 'Dr. Aris Thorne upvoted your post', time: '10m ago', type: 'upvote', unread: true },
    { id: 2, title: 'Elena Rostova commented on BFS vs DFS', time: '1h ago', type: 'comment', unread: true },
    { id: 3, title: 'New resource added: System Design Guide PDF', time: '3h ago', type: 'resource', unread: false },
    { id: 4, title: 'You earned +50 XP for daily study streak!', time: '1d ago', type: 'achievement', unread: false },
  ]);
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setItems(prev => prev.map(item => ({ ...item, unread: false })));
  };

  const filteredItems = items.filter(n => filter === 'all' || (filter === 'unread' && n.unread));
  const unreadCount = items.filter(n => n.unread).length;

  return (
    <div 
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      {/* Popover Header */}
      <div className="p-3.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="text-xs font-bold theme-text-primary">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[10px] font-semibold text-blue-500 hover:text-blue-400 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-500/10 theme-text-muted hover:theme-text-primary text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-3 py-1.5 border-b flex gap-2 text-[11px] font-medium" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-0.5 rounded-md transition-all ${filter === 'all' ? 'bg-blue-600 text-white font-bold' : 'theme-text-muted hover:theme-text-primary'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-2 py-0.5 rounded-md transition-all ${filter === 'unread' ? 'bg-blue-600 text-white font-bold' : 'theme-text-muted hover:theme-text-primary'}`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-2 space-y-1.5 max-h-[320px] overflow-y-auto custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center theme-text-muted text-xs">
            No notifications to display.
          </div>
        ) : (
          filteredItems.map((n) => (
            <div
              key={n.id}
              onClick={() => setItems(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item))}
              className="p-2.5 rounded-xl border flex items-start gap-2.5 transition-all hover:bg-slate-500/5 cursor-pointer"
              style={{
                backgroundColor: n.unread ? 'var(--primary-light)' : 'var(--card-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold"
                style={{ backgroundColor: 'var(--surface-main)', color: 'var(--primary)' }}
              >
                {n.type === 'upvote' ? '▲' : n.type === 'comment' ? '💬' : n.type === 'achievement' ? '⚡' : '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium theme-text-primary leading-snug">{n.title}</p>
                <span className="text-[9px] theme-text-muted font-mono mt-0.5 block">{n.time}</span>
              </div>
              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
