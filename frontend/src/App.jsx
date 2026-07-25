import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelectionModal from './components/RoleSelectionModal';
import EduHiveLogo from './components/EduHiveLogo';

function MainRouter() {
  const { activePostId, currentView } = useApp();
  if (currentView === 'profile') return <ProfilePage />;
  if (activePostId) return <PostPage />;
  return <Home />;
}

function AppGate() {
  const { loading, isAuthenticated } = useAuth();
  
  // Unauthenticated screen states: 'login' or 'signup'
  const [authScreen, setAuthScreen] = useState('login');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');

  // 1. Session check loading screen (prevents flashing Login or Home)
  if (loading) {
    return (
      <div 
        className="min-h-dvh flex flex-col items-center justify-center p-4 transition-colors"
        style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
      >
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <EduHiveLogo showText={true} className="w-12 h-12" textClassName="text-3xl font-black tracking-tight" />
          <div className="flex items-center gap-2 text-xs font-semibold theme-text-muted">
            <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--primary)' }} />
            <span>Restoring academic session...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated view (Full-page Login / Signup experience)
  if (!isAuthenticated) {
    return (
      <>
        {authScreen === 'signup' ? (
          <Signup 
            selectedRole={selectedRole}
            onBackToLogin={() => setAuthScreen('login')}
            onChangeRole={() => setIsRoleModalOpen(true)}
          />
        ) : (
          <Login 
            onOpenRoleModal={() => setIsRoleModalOpen(true)}
          />
        )}

        <RoleSelectionModal 
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSelectRole={(role) => {
            setSelectedRole(role);
            setIsRoleModalOpen(false);
            setAuthScreen('signup');
          }}
        />
      </>
    );
  }

  // 3. Authenticated view (EduHive App)
  return <MainRouter />;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppGate />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
