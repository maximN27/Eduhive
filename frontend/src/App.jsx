import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Home from './pages/Home';
import PostPage from './pages/PostPage';

function MainRouter() {
  const { activePostId } = useApp();
  return activePostId ? <PostPage /> : <Home />;
}

function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

export default App;
