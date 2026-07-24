import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenLogin, onOpenSignup }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            E
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Edu<span className="text-blue-500">Hive</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.username ? user.username[0] : 'U'}
                </div>
                <div className="text-sm">
                  <span className="text-white font-medium">@{user.username}</span>
                  <span className="ml-2 text-xs text-blue-400 font-semibold uppercase bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onOpenSignup}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
