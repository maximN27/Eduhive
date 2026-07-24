import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import CenterFeed from '../components/CenterFeed';
import RightSidebar from '../components/RightSidebar';
import SettingsModal from '../components/SettingsModal';

export default function Home() {
  const { isSettingsOpen, setIsSettingsOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen theme-bg theme-text-primary flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* 72px Floating Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Grid Container with 24px Padding & 28px Column Gaps */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start">
          
          {/* Division 1 (Left Sidebar) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <LeftSidebar />
          </div>

          {/* Division 2 (Center Feed - Main Focus) */}
          <div className="lg:col-span-6 min-w-0">
            <CenterFeed />
          </div>

          {/* Division 3 (Right Sidebar) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <RightSidebar />
          </div>

        </div>
      </main>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 theme-bg/90 backdrop-blur-md flex flex-col p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="font-extrabold text-base" style={{ color: 'var(--primary)' }}>EduHive Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl border text-xs font-semibold theme-text-secondary"
              style={{ borderColor: 'var(--border-color)' }}
            >
              ✕ Close
            </button>
          </div>
          <div className="space-y-6">
            <LeftSidebar />
            <RightSidebar />
          </div>
        </div>
      )}

      {/* Settings Modal (Appearance & Theme Settings) */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t py-8 mt-12 transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs theme-text-muted">
          <p>© {new Date().getFullYear()} EduHive Academic Platform. Built with React 19, Tailwind CSS v4 & Semantic Design Tokens.</p>
        </div>
      </footer>

    </div>
  );
}
