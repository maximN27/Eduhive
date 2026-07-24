import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="inline-block p-4 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          EduHive Initialized
        </h1>
        
        <p className="text-slate-400 text-lg">
          Project setup complete with React, Vite, Tailwind CSS, Express, and Mongoose.
        </p>

        <div className="flex justify-center gap-4 text-xs font-mono text-slate-500 pt-4 border-t border-slate-800">
          <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Frontend: Vite + React</span>
          <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Styling: Tailwind CSS</span>
          <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Backend: Node + Express</span>
        </div>
      </div>
    </div>
  );
}

export default App;
