import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_SUBJECTS,
  INITIAL_TAGS,
  INITIAL_POSTS,
  INITIAL_SAVED_RESOURCES,
  CURRENT_USER
} from '../services/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [subjects] = useState(INITIAL_SUBJECTS);
  const [tags] = useState(INITIAL_TAGS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [savedResources, setSavedResources] = useState(INITIAL_SAVED_RESOURCES);
  const [user] = useState(CURRENT_USER);

  const [activeSubject, setActiveSubject] = useState(null); // subjectId or null
  const [activeTag, setActiveTag] = useState(null); // tagId or null
  const [searchQuery, setSearchQuery] = useState('');
  const [feedSort, setFeedSort] = useState('latest'); // 'latest', 'trending', 'top'

  // Routing / View States
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'profile' | 'notifications'
  const [activePostId, setActivePostId] = useState(null);

  // Theme & Appearance Preferences
  const [theme, setTheme] = useState(() => localStorage.getItem('eduhive_theme') || 'system');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('eduhive_accent') || 'blue');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  // Navigation functions
  const goHome = () => {
    setCurrentView('home');
    setActivePostId(null);
  };

  const openProfile = () => {
    setCurrentView('profile');
    setActivePostId(null);
  };

  const openPost = (postId) => {
    setActivePostId(postId);
  };

  // Apply Theme & Accent to HTML Root
  useEffect(() => {
    const root = document.documentElement;

    const applyDark = (isDark) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'dark') {
      applyDark(true);
    } else if (theme === 'light') {
      applyDark(false);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyDark(mediaQuery.matches);

      const handleChange = (e) => applyDark(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('accent-emerald', 'accent-purple', 'accent-orange');
    if (accentColor !== 'blue') {
      root.classList.add(`accent-${accentColor}`);
    }
  }, [accentColor]);

  const setThemePreference = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('eduhive_theme', newTheme);
  };

  const setAccentColorPreference = (newAccent) => {
    setAccentColor(newAccent);
    localStorage.setItem('eduhive_accent', newAccent);
  };

  const toggleSavePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, saved: !p.saved } : p
      )
    );
  };

  const toggleUpvotePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const newUserVoted = !p.userVoted;
          return {
            ...p,
            userVoted: newUserVoted,
            upvotes: newUserVoted ? p.upvotes + 1 : p.upvotes - 1
          };
        }
        return p;
      })
    );
  };

  const addPost = (newPostData) => {
    const matchedSubject = subjects.find(s => s.id === newPostData.subjectId);
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        role: user.role
      },
      subjectId: newPostData.subjectId,
      subjectName: matchedSubject ? matchedSubject.name : 'General',
      tags: newPostData.tags || [],
      title: newPostData.title,
      content: newPostData.content,
      codeSnippet: newPostData.codeSnippet || '',
      upvotes: 1,
      userVoted: true,
      saved: false,
      createdAt: 'Just now',
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: user.name,
            avatar: user.avatar,
            content: commentText,
            createdAt: 'Just now'
          };
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );
  };

  const toggleSaveResource = (resourceId) => {
    setSavedResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const addSavedResource = (resource) => {
    setSavedResources(prev => [resource, ...prev]);
  };

  const handleSelectSubject = (subjectId) => {
    if (activeSubject === subjectId) {
      setActiveSubject(null);
      setActiveTag(null);
    } else {
      setActiveSubject(subjectId);
      setActiveTag(null);
    }
  };

  const handleSelectTag = (tagId) => {
    if (activeTag === tagId) {
      setActiveTag(null);
    } else {
      setActiveTag(tagId);
    }
  };

  const clearFilters = () => {
    setActiveSubject(null);
    setActiveTag(null);
    setSearchQuery('');
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesContent = post.content.toLowerCase().includes(q);
        const matchesAuthor = post.author.name.toLowerCase().includes(q);
        const matchesSubject = post.subjectName.toLowerCase().includes(q);
        const matchesTag = post.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesSubject && !matchesTag) {
          return false;
        }
      }

      if (activeSubject && post.subjectId !== activeSubject) {
        return false;
      }

      if (activeTag && !post.tags.includes(activeTag)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (feedSort === 'trending') {
        return (b.upvotes + b.comments.length * 2) - (a.upvotes + a.comments.length * 2);
      }
      if (feedSort === 'top') {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });
  }, [posts, activeSubject, activeTag, searchQuery, feedSort]);

  const savedPosts = useMemo(() => {
    return posts.filter(p => p.saved);
  }, [posts]);

  const activePost = useMemo(() => {
    if (!activePostId) return null;
    return posts.find(p => p.id === activePostId || p._id === activePostId) || null;
  }, [posts, activePostId]);

  return (
    <AppContext.Provider
      value={{
        subjects,
        tags,
        posts: filteredPosts,
        allPostsCount: posts.length,
        savedPosts,
        savedResources,
        user,
        activeSubject,
        activeTag,
        searchQuery,
        feedSort,
        theme,
        accentColor,
        isSettingsOpen,
        isNotificationsOpen,
        isCreatePostOpen,
        isCreateSubjectOpen,
        currentView,
        activePostId,
        activePost,
        goHome,
        openProfile,
        openPost,
        setIsSettingsOpen,
        setIsNotificationsOpen,
        setIsCreatePostOpen,
        setIsCreateSubjectOpen,
        handlePostCreated,
        setThemePreference,
        setAccentColorPreference,
        setFeedSort,
        handleSelectSubject,
        handleSelectTag,
        setSearchQuery,
        clearFilters,
        toggleSavePost,
        toggleUpvotePost,
        addPost,
        addComment,
        toggleSaveResource,
        addSavedResource
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
