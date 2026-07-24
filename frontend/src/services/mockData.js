export const INITIAL_SUBJECTS = [
  { id: 'cs', name: 'Computer Science', icon: '💻', count: 142, description: 'Algorithms, Data Structures & Software Systems' },
  { id: 'math', name: 'Mathematics', icon: '📐', count: 98, description: 'Calculus, Linear Algebra, Statistics & Discrete Math' },
  { id: 'ds', name: 'Data Science & AI', icon: '🤖', count: 115, description: 'Machine Learning, Deep Learning, Datasets & Analytics' },
  { id: 'web', name: 'Web Development', icon: '🌐', count: 86, description: 'React, Node, Frontend, Backend & Web Architecture' },
  { id: 'physics', name: 'Physics & Engineering', icon: '⚡', count: 64, description: 'Quantum Physics, Mechanics, Circuits & Signal Processing' },
];

export const INITIAL_TAGS = {
  cs: [
    { id: 'algorithms', name: 'Algorithms', count: 45 },
    { id: 'dsa', name: 'Data Structures', count: 52 },
    { id: 'sys-design', name: 'System Design', count: 31 },
    { id: 'os', name: 'Operating Systems', count: 24 },
  ],
  math: [
    { id: 'calculus', name: 'Calculus III', count: 38 },
    { id: 'linear-alg', name: 'Linear Algebra', count: 29 },
    { id: 'probability', name: 'Probability & Stats', count: 22 },
    { id: 'discrete', name: 'Discrete Math', count: 19 },
  ],
  ds: [
    { id: 'ml', name: 'Machine Learning', count: 48 },
    { id: 'neural-nets', name: 'Neural Networks', count: 34 },
    { id: 'python-ds', name: 'Pandas & NumPy', count: 26 },
    { id: 'llm', name: 'LLM Fine-Tuning', count: 18 },
  ],
  web: [
    { id: 'react', name: 'React 19 Hooks', count: 36 },
    { id: 'tailwind', name: 'Tailwind CSS', count: 28 },
    { id: 'backend-api', name: 'REST & GraphQL', count: 25 },
    { id: 'typescript', name: 'TypeScript', count: 21 },
  ],
  physics: [
    { id: 'quantum', name: 'Quantum Mechanics', count: 22 },
    { id: 'circuits', name: 'Digital Logic', count: 20 },
    { id: 'electromagnetics', name: 'Electromagnetism', count: 16 },
  ]
};

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: {
      name: 'Dr. Aris Thorne',
      handle: '@aris_t',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'Professor of CS'
    },
    subjectId: 'cs',
    subjectName: 'Computer Science',
    tags: ['dsa', 'algorithms'],
    title: 'Visualizing Time Complexity of Graph Search: BFS vs DFS with Code Examples',
    content: `When dealing with unweighted shortest path problems, Breadth-First Search (BFS) operates in O(V + E) time by exploring nodes level by level using a FIFO queue.

Here is a quick Python snippet demonstrating BFS level traversal with a queue:`,
    codeSnippet: `from collections import deque

def bfs_shortest_path(graph, start, target):
    visited = {start}
    queue = deque([(start, [start])])
    
    while queue:
        node, path = queue.popleft()
        if node == target:
            return path
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return None`,
    upvotes: 142,
    userVoted: false,
    saved: true,
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c1',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        content: 'This queue breakdown makes memory footprint comparison with DFS stack recursion so much clearer!',
        createdAt: '1 hour ago'
      }
    ],
    resources: [
      {
        id: 'p1-r1',
        title: 'BFS & DFS Complexity Cheat Sheet (PDF)',
        type: 'PDF Document',
        size: '1.2 MB',
        icon: '📄',
        url: '#'
      },
      {
        id: 'p1-r2',
        title: 'Graph Traversal Python Notebook (.ipynb)',
        type: 'Jupyter Notebook',
        size: '850 KB',
        icon: '📓',
        url: '#'
      },
      {
        id: 'p1-r3',
        title: 'Shortest Path Algorithm Visualizer Link',
        type: 'Web Resource',
        size: 'External',
        icon: '🔗',
        url: '#'
      }
    ]
  },
  {
    id: 'post-2',
    author: {
      name: 'Marcus Chen',
      handle: '@marcus_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      role: 'Senior ML Engineer'
    },
    subjectId: 'ds',
    subjectName: 'Data Science & AI',
    tags: ['ml', 'neural-nets'],
    title: 'Intuitive Guide to Matrix Multiplication in Transformer Self-Attention Layers',
    content: `Self-Attention computes Q, K, V matrices through Query-Key similarity dot products scaled by sqrt(d_k).

Formula: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V

Why scale by sqrt(d_k)? Without scaling, as d_k increases, the dot product grows large in magnitude, pushing softmax into regions with vanishing gradients!`,
    codeSnippet: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    p_attn = F.softmax(scores, dim=-1)
    return torch.matmul(p_attn, V), p_attn`,
    upvotes: 98,
    userVoted: true,
    saved: false,
    createdAt: '4 hours ago',
    comments: [
      {
        id: 'c2',
        author: 'Siddharth Rao',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        content: 'The explanation on vanishing softmax gradients when d_k grows large is spot on.',
        createdAt: '3 hours ago'
      }
    ],
    resources: [
      {
        id: 'p2-r1',
        title: 'Annotated Attention Is All You Need Paper',
        type: 'Research Paper',
        size: '3.4 MB',
        icon: '📚',
        url: '#'
      },
      {
        id: 'p2-r2',
        title: 'PyTorch Transformer Attention Implementation Guide',
        type: 'Code Repository',
        size: '2.1 MB',
        icon: '💻',
        url: '#'
      }
    ]
  },
  {
    id: 'post-3',
    author: {
      name: 'Sarah Jenkins',
      handle: '@sarah_j',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      role: 'Frontend Architect'
    },
    subjectId: 'web',
    subjectName: 'Web Development',
    tags: ['react', 'tailwind'],
    title: 'Mastering React 19 Server Components and Action Hooks in Practice',
    content: `React 19 introduces native support for useActionState, useFormStatus, and optimistic UI updates without extra third-party state managers.

Combining custom hooks with utility-first Tailwind v4 CSS variables makes building responsive study dashboards smooth and performant!`,
    upvotes: 76,
    userVoted: false,
    saved: true,
    createdAt: '6 hours ago',
    comments: [],
    resources: [
      {
        id: 'p3-r1',
        title: 'React 19 Hooks & Server Actions Cheat Sheet',
        type: 'PDF Guide',
        size: '1.9 MB',
        icon: '📄',
        url: '#'
      },
      {
        id: 'p3-r2',
        title: 'Tailwind v4 Setup Starter Kit Zip',
        type: 'Archive File',
        size: '4.5 MB',
        icon: '📦',
        url: '#'
      }
    ]
  },
  {
    id: 'post-4',
    author: {
      name: 'Prof. David Vance',
      handle: '@david_v',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      role: 'Math Department Chair'
    },
    subjectId: 'math',
    subjectName: 'Mathematics',
    tags: ['linear-alg', 'calculus'],
    title: 'Eigenvalues & Singular Value Decomposition (SVD): Geometric Intuition',
    content: `Think of Matrix transformation as stretching space along principal axes. Eigenvectors are the vectors whose directions do not change during this linear transformation!

SVD generalizes this concept to non-square matrices A = U Σ V^T, decomposing any linear mapping into Rotation -> Scaling -> Rotation.`,
    upvotes: 112,
    userVoted: false,
    saved: false,
    createdAt: '1 day ago',
    comments: [],
    resources: [
      {
        id: 'p4-r1',
        title: 'SVD Matrix Transformation Visual Proofs',
        type: 'Interactive PDF',
        size: '2.8 MB',
        icon: '📐',
        url: '#'
      }
    ]
  }
];

export const INITIAL_SAVED_RESOURCES = [
  {
    id: 'res-1',
    title: 'DSA Complete Cheat Sheet & Complexity Chart',
    subject: 'Computer Science',
    type: 'PDF Guide',
    size: '2.4 MB',
    icon: '📄',
    url: '#',
    dateAdded: 'Yesterday'
  },
  {
    id: 'res-2',
    title: 'Transformer Architecture & Attention Paper (Annotated)',
    subject: 'Data Science & AI',
    type: 'Research Paper',
    size: '4.1 MB',
    icon: '📚',
    url: '#',
    dateAdded: '3 days ago'
  },
  {
    id: 'res-3',
    title: 'Linear Algebra 3Blue1Brown Notes & Equations',
    subject: 'Mathematics',
    type: 'Interactive Note',
    size: '1.8 MB',
    icon: '✏️',
    url: '#',
    dateAdded: '5 days ago'
  },
  {
    id: 'res-4',
    title: 'System Design Interview Roadmap (PDF)',
    subject: 'Computer Science',
    type: 'PDF Guide',
    size: '3.6 MB',
    icon: '📄',
    url: '#',
    dateAdded: '1 week ago'
  }
];

export const CURRENT_USER = {
  name: 'Alex Rivera',
  handle: '@alex_rivera',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  role: 'EduHive Scholar',
  reputation: 1240,
  joinedDate: 'Jan 2025'
};
