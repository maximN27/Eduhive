import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';

function MainRouter() {
  const { activePostId, currentView } = useApp();
  if (currentView === 'profile') return <ProfilePage />;
  if (activePostId) return <PostPage />;
  return <Home />;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
