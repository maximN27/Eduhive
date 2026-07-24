import React, { createContext, useContext, useState, useMemo } from 'react';
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
  const [activePostId, setActivePostId] = useState(null); // postId or null

  // Open post detail view
  const openPost = (postId) => {
    setActivePostId(postId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to home feed view
  const goHome = () => {
    setActivePostId(null);
  };

  // Toggle saving a post
  const toggleSavePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, saved: !p.saved } : p
      )
    );
  };

  // Toggle upvoting a post
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

  // Add a new post
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

  // Add comment to a post
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

  // Toggle saving a resource
  const toggleSaveResource = (resourceId) => {
    setSavedResources(prev => prev.filter(r => r.id !== resourceId));
  };

  // Add a new saved resource
  const addSavedResource = (resource) => {
    setSavedResources(prev => [resource, ...prev]);
  };

  // Select Subject helper
  const handleSelectSubject = (subjectId) => {
    if (activeSubject === subjectId) {
      setActiveSubject(null);
      setActiveTag(null);
    } else {
      setActiveSubject(subjectId);
      setActiveTag(null);
    }
  };

  // Select Tag helper
  const handleSelectTag = (tagId) => {
    if (activeTag === tagId) {
      setActiveTag(null);
    } else {
      setActiveTag(tagId);
    }
  };

  // Clear all filters and return home
  const clearFilters = () => {
    setActiveSubject(null);
    setActiveTag(null);
    setSearchQuery('');
    setActivePostId(null);
  };

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filter by Search Query
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

      // Filter by Active Subject
      if (activeSubject && post.subjectId !== activeSubject) {
        return false;
      }

      // Filter by Active Tag
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
      return 0; // default latest order
    });
  }, [posts, activeSubject, activeTag, searchQuery, feedSort]);

  // Currently selected active post object
  const activePost = useMemo(() => {
    if (!activePostId) return null;
    return posts.find(p => p.id === activePostId) || null;
  }, [posts, activePostId]);

  // Derived Saved Posts List
  const savedPosts = useMemo(() => {
    return posts.filter(p => p.saved);
  }, [posts]);

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
        activePostId,
        activePost,
        openPost,
        goHome,
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
