import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import CenterFeed from '../components/CenterFeed';
import RightSidebar from '../components/RightSidebar';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Sticky Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Container below Navbar */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Horizontal 3 Division Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Division 1 (Left Sidebar): Subject & Subtopic Tags */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <LeftSidebar />
          </div>

          {/* Division 2 (Center Section): Posts Feed (~75% relative main focus width) */}
          <div className="lg:col-span-6 min-w-0">
            <CenterFeed />
          </div>

          {/* Division 3 (Right Section): Saved Posts & Saved Resources */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <RightSidebar />
          </div>

        </div>
      </main>

      {/* Responsive Drawer for Mobile Screens */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <span className="font-extrabold text-indigo-400 text-lg">EduHive Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EduHive Academic Knowledge Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
