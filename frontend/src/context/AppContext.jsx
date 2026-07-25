import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  INITIAL_SUBJECTS,
  INITIAL_TAGS,
  INITIAL_POSTS,
  INITIAL_SAVED_RESOURCES,
  CURRENT_USER
} from '../services/mockData';

import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { subjectService } from '../services/subjectService';
import { userService } from '../services/userService';
import { voteService } from '../services/voteService';
import { notificationService } from '../services/notificationService';
import { searchService } from '../services/searchService';
import { useAuth } from './AuthContext';

const AppContext = createContext();

// Relative time helper
function formatRelativeTime(dateString) {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Format API post data for UI components
function formatApiPost(p, activeUser, savedIdsSet = new Set()) {
  const authorObj = typeof p.authorId === 'object' && p.authorId !== null ? p.authorId : {};
  const subjectObj = typeof p.subjectId === 'object' && p.subjectId !== null ? p.subjectId : {};
  const postId = String(p._id || p.id);
  const isSaved = p.saved || savedIdsSet.has(postId);

  return {
    id: p._id || p.id,
    author: {
      id: authorObj._id || p.authorId || '',
      name: authorObj.name || p.author?.name || 'EduHive Scholar',
      handle: authorObj.username ? `@${authorObj.username}` : (p.author?.handle || '@scholar'),
      avatar: authorObj.profilePic || authorObj.avatar || p.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      role: authorObj.role || p.author?.role || 'Student'
    },
    subjectId: subjectObj._id || p.subjectId || 'cs',
    subjectName: subjectObj.name || p.subjectName || 'General',
    tags: p.tags || [],
    title: p.title || '',
    content: p.content || '',
    codeSnippet: p.codeSnippet || '',
    upvotes: p.voteScore !== undefined ? p.voteScore : (p.upvotes || 0),
    userVoted: p.userVoted || false,
    saved: isSaved,
    createdAt: p.createdAt ? formatRelativeTime(p.createdAt) : 'Just now',
    comments: (p.comments || []).map(c => {
      const cAuthor = typeof c.authorId === 'object' && c.authorId !== null ? c.authorId : {};
      return {
        id: c._id || c.id,
        author: cAuthor.name || c.author || 'Scholar',
        avatar: cAuthor.profilePic || c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        content: c.content,
        createdAt: c.createdAt ? formatRelativeTime(c.createdAt) : 'Just now'
      };
    }),
    resources: (p.resourceIds || p.resources || []).map(r => ({
      id: r._id || r.id,
      title: r.title || 'Resource Document',
      type: r.type || 'PDF',
      size: r.size || 'External',
      icon: r.icon || '📄',
      url: r.url || '#'
    }))
  };
}

export const AppProvider = ({ children }) => {
  // Authentication Context Integration
  const auth = useAuth();
  const authUser = auth?.user || null;
  const token = auth?.token || null;

  // Format active authenticated user for UI components
  const user = useMemo(() => {
    const activeObj = authUser || CURRENT_USER;
    const roleMap = {
      student: 'Student',
      teacher: 'Professor',
      professional: 'Professional'
    };
    const roleKey = String(activeObj.role || '').toLowerCase();
    const displayRole = roleMap[roleKey] || activeObj.role || 'Student';

    return {
      id: activeObj._id || activeObj.id || 'user-1',
      name: activeObj.name || activeObj.username || 'Dr. Alice Vance',
      handle: activeObj.handle || (activeObj.username ? `@${activeObj.username}` : '@alice_vance'),
      avatar: activeObj.profilePic || activeObj.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role: displayRole,
      reputation: activeObj.reputation || (activeObj.streak ? activeObj.streak * 250 : 2500),
      college: activeObj.college || '',
      bio: activeObj.bio || '',
      streak: activeObj.streak || 5,
      experienceLevel: activeObj.experienceLevel || 'Advanced',
      interests: activeObj.interests || ['Algorithms', 'Python', 'Web Dev'],
      savedPosts: activeObj.savedPosts || [],
      savedResources: activeObj.savedResources || []
    };
  }, [authUser]);

  // Navigation & Active View State
  const [currentView, setCurrentView] = useState('feed'); // 'feed', 'post', 'profile'
  const [activePostId, setActivePostId] = useState(null);

  // Core Data States
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [posts, setPosts] = useState(() => {
    try {
      const uKey = user?.id || user?.username || 'user';
      const custom = localStorage.getItem(`eduhive_custom_posts_${uKey}`) || localStorage.getItem('eduhive_custom_posts');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...INITIAL_POSTS];
        }
      }
    } catch (e) {
      // JSON parse fallback
    }
    return INITIAL_POSTS;
  });
  const [savedResources, setSavedResources] = useState(INITIAL_SAVED_RESOURCES);
  const [notifications, setNotifications] = useState([]);

  // Saved Post IDs state persisted in LocalStorage & MongoDB
  const [savedPostIds, setSavedPostIds] = useState(() => {
    try {
      const uKey = user?.id || user?.username || 'user';
      const stored = localStorage.getItem(`eduhive_saved_posts_${uKey}`) || localStorage.getItem('eduhive_saved_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.map(String);
      }
    } catch (e) {}
    return (user?.savedPosts || []).map(sp => String(sp._id || sp.id || sp));
  });

  // Sync user.savedPosts from backend profile into savedPostIds state
  useEffect(() => {
    if (user?.savedPosts && Array.isArray(user.savedPosts) && user.savedPosts.length > 0) {
      const dbIds = user.savedPosts.map(sp => String(sp._id || sp.id || sp)).filter(Boolean);
      setSavedPostIds(prev => Array.from(new Set([...prev, ...dbIds])));
    }
  }, [user]);

  // Auth Modals & Layout UI States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false);

  // Filtering & Sorting
  const [activeSubject, setActiveSubject] = useState(null); // subjectId or null
  const [activeTag, setActiveTag] = useState(null); // tagId or null
  const [searchQuery, setSearchQuery] = useState('');
  const [feedSort, setFeedSort] = useState('latest'); // 'latest', 'trending', 'top'

  // Theme & Appearance Preferences
  const [theme, setTheme] = useState(() => localStorage.getItem('eduhive_theme') || 'system');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('eduhive_accent') || 'blue');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  // Status flags
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  // Load Subjects from API
  const loadSubjects = useCallback(async () => {
    try {
      const res = await subjectService.getSubjects();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mappedSubjects = res.data.map(s => ({
          id: s._id,
          name: s.name,
          icon: s.name.toLowerCase().includes('computer') ? '💻' :
            s.name.toLowerCase().includes('math') ? '📐' :
              s.name.toLowerCase().includes('data') ? '🤖' :
                s.name.toLowerCase().includes('web') ? '🌐' : '⚡',
          count: s.membersCount || 0,
          description: s.description || ''
        }));
        setSubjects(mappedSubjects);
        setApiOnline(true);
      }
    } catch (err) {
      console.warn('API Subjects offline or unreachable, using local defaults');
    }
  }, []);

  // Load Posts from API
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeSubject) params.subjectId = activeSubject;
      if (activeTag) params.tag = activeTag;
      if (searchQuery) params.search = searchQuery;

      const res = await postService.getPosts(params);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const idsSet = new Set(savedPostIds.map(String));
        const formatted = res.data.map(p => formatApiPost(p, user, idsSet));
        setPosts(formatted);
        setApiOnline(true);
      } else {
        // API offline or empty database, maintain 50 populated academic posts
        setApiOnline(false);
      }
    } catch (err) {
      console.warn('API Posts fetch error, keeping current post list:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeSubject, activeTag, searchQuery, user, savedPostIds]);

  // Initial Data Load
  useEffect(() => {
    loadSubjects();
    loadPosts();
  }, [loadSubjects, loadPosts]);

  // Load Notifications if Authenticated
  useEffect(() => {
    async function fetchNotifications() {
      if (!token) return;
      try {
        const res = await notificationService.getNotifications();
        if (res.success && Array.isArray(res.data)) {
          setNotifications(res.data);
        }
      } catch (err) {
        // notification fetch silent catch
      }
    }
    fetchNotifications();
  }, [token]);

  // Apply Theme & Accent
  useEffect(() => {
    const root = document.documentElement;
    const applyDark = (isDark) => {
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    };

    if (theme === 'dark') applyDark(true);
    else if (theme === 'light') applyDark(false);
    else {
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

  // Auth Operations Delegated to AuthContext
  const handleLogin = async (email, password) => {
    try {
      await auth.login({ email, password });
      setIsAuthOpen(false);
      setApiOnline(true);
      loadPosts();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleRegister = async (registerData) => {
    try {
      await auth.register(registerData);
      setIsAuthOpen(false);
      setApiOnline(true);
      loadPosts();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleLogout = async () => {
    await auth.logout();
  };

  // Toggle saving a post
  const toggleSavePost = async (postId) => {
    const targetIdStr = String(postId);
    const isAlreadySaved = savedPostIds.includes(targetIdStr);
    const updatedIds = isAlreadySaved
      ? savedPostIds.filter(id => id !== targetIdStr)
      : [...savedPostIds, targetIdStr];

    setSavedPostIds(updatedIds);

    // Save to LocalStorage
    try {
      const uKey = user?.id || user?.username || 'user';
      localStorage.setItem(`eduhive_saved_posts_${uKey}`, JSON.stringify(updatedIds));
      localStorage.setItem('eduhive_saved_posts', JSON.stringify(updatedIds));
    } catch (e) {}

    // Update posts state to reflect toggle
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (String(p.id) === targetIdStr || String(p._id) === targetIdStr) {
          return { ...p, saved: !isAlreadySaved };
        }
        return p;
      })
    );

    // Call API if token is present
    if (token) {
      try {
        await postService.toggleSavePost(postId);
      } catch (err) {
        console.warn('Save post API error:', err.message);
      }
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    const targetIdStr = String(postId);

    // Optimistically update posts state
    setPosts(prevPosts => prevPosts.filter(p => String(p.id) !== targetIdStr && String(p._id) !== targetIdStr));

    if (activePostId && String(activePostId) === targetIdStr) {
      goHome();
    }

    // Clean up local custom posts
    try {
      const uKey = user?.id || user?.username || 'user';
      const c1 = JSON.parse(localStorage.getItem('eduhive_custom_posts') || '[]');
      const c2 = JSON.parse(localStorage.getItem(`eduhive_custom_posts_${uKey}`) || '[]');
      const f1 = c1.filter(p => String(p.id) !== targetIdStr && String(p._id) !== targetIdStr);
      const f2 = c2.filter(p => String(p.id) !== targetIdStr && String(p._id) !== targetIdStr);
      localStorage.setItem('eduhive_custom_posts', JSON.stringify(f1));
      localStorage.setItem(`eduhive_custom_posts_${uKey}`, JSON.stringify(f2));
    } catch (e) {}

    // Call API if token is present
    if (token) {
      try {
        await postService.deletePost(postId);
      } catch (err) {
        console.warn('Delete post API error:', err.message);
      }
    }
  };

  // Toggle upvoting a post
  const toggleUpvotePost = async (postId) => {
    // Optimistic UI update
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

    // Call API if token is present
    if (token) {
      try {
        await voteService.castVote('Post', postId, 'up');
      } catch (err) {
        console.warn('Vote API error:', err.message);
      }
    }
  };

  // Add a new post
  const addPost = async (newPostData) => {
    let matchedSubject = subjects.find(s => s.id === newPostData.subjectId);
    if (!matchedSubject && subjects.length > 0) {
      matchedSubject = subjects[0];
    }

    // Call Backend API if online / token present
    if (token) {
      try {
        const apiPayload = {
          subjectId: matchedSubject ? matchedSubject.id : newPostData.subjectId,
          title: newPostData.title,
          content: newPostData.content,
          tags: newPostData.tags || []
        };
        const res = await postService.createPost(apiPayload);
        if (res.success && res.data) {
          const formatted = formatApiPost(res.data, user);
          setPosts(prev => [formatted, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('API post creation failed, adding locally:', err.message);
      }
    }

    // Fallback local post addition
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
      images: newPostData.images || [],
      upvotes: 1,
      userVoted: true,
      saved: false,
      createdAt: 'Just now',
      comments: []
    };

    setPosts(prev => {
      const updated = [newPost, ...prev];
      try {
        const uKey = user?.id || user?.username || 'user';
        const customOnly = updated.filter(p => String(p.id).startsWith('post-'));
        localStorage.setItem('eduhive_custom_posts', JSON.stringify(customOnly));
        localStorage.setItem(`eduhive_custom_posts_${uKey}`, JSON.stringify(customOnly));
      } catch (e) {
        // storage quota fallback
      }
      return updated;
    });
  };

  // Add comment to a post
  const addComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    // Optimistic local update
    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      content: commentText,
      createdAt: 'Just now'
    };

    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newCommentObj]
          };
        }
        return p;
      })
    );

    // Call API if authenticated
    if (token) {
      try {
        await postService.addPostComment(postId, { content: commentText });
      } catch (err) {
        console.warn('Comment API error:', err.message);
      }
    }
  };

  // Saved resources helpers
  const toggleSaveResource = (resourceId) => {
    setSavedResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const addSavedResource = (resource) => {
    setSavedResources(prev => [resource, ...prev]);
  };

  // Navigation helpers
  const navigateToPost = (postId) => {
    setActivePostId(postId);
    setCurrentView('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProfile = () => {
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentView('feed');
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubject = (subjectId) => {
    if (activeSubject === subjectId) {
      setActiveSubject(null);
      setActiveTag(null);
    } else {
      setActiveSubject(subjectId);
      setActiveTag(null);
    }
    setCurrentView('feed');
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTag = (tagId) => {
    if (activeTag === tagId) {
      setActiveTag(null);
    } else {
      setActiveTag(tagId);
    }
    setCurrentView('feed');
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setActiveSubject(null);
    setActiveTag(null);
    setSearchQuery('');
  };

  // Filtered & Sorted Posts
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

  // Derived Saved Posts List
  const savedPosts = useMemo(() => {
    const idsSet = new Set(savedPostIds.map(String));
    return posts.filter(p => p.saved || idsSet.has(String(p.id)) || idsSet.has(String(p._id)));
  }, [posts, savedPostIds]);

  // Derived Active Post
  const activePost = useMemo(() => {
    if (!activePostId) return null;
    return posts.find(p => p.id === activePostId || p._id === activePostId) || null;
  }, [posts, activePostId]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activePostId,
        activePost,
        navigateToPost,
        navigateToProfile,
        openProfile: navigateToProfile,
        openPost: navigateToPost,
        goHome,
        subjects,
        tags,
        posts: filteredPosts,
        allPostsCount: posts.length,
        savedPosts,
        savedResources,
        user,
        token,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateSubjectOpen,
        setIsCreateSubjectOpen,
        handlePostCreated,
        openNotifications: () => setIsNotificationsOpen(true),
        handleLogin,
        handleRegister,
        handleLogout,
        updateUser: auth?.updateUser,
        notifications,
        loading,
        apiOnline,
        activeSubject,
        activeTag,
        searchQuery,
        feedSort,
        theme,
        accentColor,
        isSettingsOpen,
        setIsSettingsOpen,
        setThemePreference: (t) => { setTheme(t); localStorage.setItem('eduhive_theme', t); },
        setAccentColorPreference: (a) => { setAccentColor(a); localStorage.setItem('eduhive_accent', a); },
        setFeedSort,
        handleSelectSubject,
        handleSelectTag,
        setSearchQuery,
        clearFilters,
        toggleSavePost,
        deletePost,
        toggleUpvotePost,
        addPost,
        addComment,
        toggleSaveResource,
        addSavedResource,
        refetchPosts: loadPosts,
        refetchSubjects: loadSubjects
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
