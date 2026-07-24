const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Subject = require('../models/Subject');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional - uncomment if full reset needed)
    // await User.deleteMany({});
    // await Subject.deleteMany({});
    // await Post.deleteMany({});
    // await Comment.deleteMany({});
    // await Resource.deleteMany({});

    // 1. Seed Subjects if none exist
    const subjectCount = await Subject.countDocuments();
    let subjects = [];
    if (subjectCount === 0) {
      subjects = await Subject.insertMany([
        {
          name: 'Computer Science',
          description: 'Algorithms, Data Structures & Software Systems',
          tags: ['algorithms', 'dsa', 'sys-design', 'os'],
          membersCount: 142
        },
        {
          name: 'Mathematics',
          description: 'Calculus, Linear Algebra, Statistics & Discrete Math',
          tags: ['calculus', 'linear-alg', 'probability', 'discrete'],
          membersCount: 98
        },
        {
          name: 'Data Science & AI',
          description: 'Machine Learning, Deep Learning, Datasets & Analytics',
          tags: ['ml', 'neural-nets', 'python-ds', 'llm'],
          membersCount: 115
        },
        {
          name: 'Web Development',
          description: 'React, Node, Frontend, Backend & Web Architecture',
          tags: ['react', 'tailwind', 'backend-api', 'typescript'],
          membersCount: 86
        },
        {
          name: 'Physics & Engineering',
          description: 'Quantum Physics, Mechanics, Circuits & Signal Processing',
          tags: ['quantum', 'circuits', 'electromagnetics'],
          membersCount: 64
        }
      ]);
      console.log(`Seeded ${subjects.length} subjects.`);
    } else {
      subjects = await Subject.find();
      console.log(`Found ${subjects.length} existing subjects.`);
    }

    // 2. Seed Users if none exist
    const userCount = await User.countDocuments();
    let users = [];
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      users = await User.insertMany([
        {
          username: 'alex_rivera',
          name: 'Alex Rivera',
          email: 'alex@eduhive.edu',
          passwordHash,
          role: 'EduHive Scholar',
          bio: 'Passionate computer science scholar exploring algorithms, ML, and scalable software design.',
          college: 'MIT',
          streak: 5,
          experienceLevel: 'Advanced',
          interests: ['Algorithms', 'Python', 'Web Dev', 'Machine Learning'],
          savedPosts: [],
          savedResources: []
        },
        {
          username: 'aris_t',
          name: 'Dr. Aris Thorne',
          email: 'aris@eduhive.edu',
          passwordHash,
          role: 'Professor of CS',
          bio: 'Professor of Computer Science specializing in Graph Theory and Algorithm Complexity.',
          college: 'MIT',
          streak: 12
        },
        {
          username: 'marcus_dev',
          name: 'Marcus Chen',
          email: 'marcus@eduhive.edu',
          passwordHash,
          role: 'Senior ML Engineer',
          bio: 'Building transformer models and high-performance deep learning architectures.',
          college: 'Stanford',
          streak: 8
        }
      ]);
      console.log(`Seeded ${users.length} default users.`);
    } else {
      users = await User.find();
      console.log(`Found ${users.length} existing users.`);
    }

    // 3. Seed Posts if none exist
    const postCount = await Post.countDocuments();
    if (postCount === 0 && subjects.length > 0 && users.length > 0) {
      const csSubject = subjects.find(s => s.name === 'Computer Science') || subjects[0];
      const dsSubject = subjects.find(s => s.name === 'Data Science & AI') || subjects[0];
      const webSubject = subjects.find(s => s.name === 'Web Development') || subjects[0];
      const mathSubject = subjects.find(s => s.name === 'Mathematics') || subjects[0];

      const user1 = users[0];
      const user2 = users[1] || users[0];
      const user3 = users[2] || users[0];

      const post1 = await Post.create({
        subjectId: csSubject._id,
        authorId: user2._id,
        title: 'Visualizing Time Complexity of Graph Search: BFS vs DFS with Code Examples',
        content: `When dealing with unweighted shortest path problems, Breadth-First Search (BFS) operates in O(V + E) time by exploring nodes level by level using a FIFO queue.\n\nHere is a quick Python snippet demonstrating BFS level traversal with a queue:\n\nfrom collections import deque\n\ndef bfs_shortest_path(graph, start, target):\n    visited = {start}\n    queue = deque([(start, [start])])\n    while queue:\n        node, path = queue.popleft()\n        if node == target:\n            return path\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append((neighbor, path + [neighbor]))\n    return None`,
        tags: ['dsa', 'algorithms'],
        voteScore: 142
      });

      const post2 = await Post.create({
        subjectId: dsSubject._id,
        authorId: user3._id,
        title: 'Intuitive Guide to Matrix Multiplication in Transformer Self-Attention Layers',
        content: `Self-Attention computes Q, K, V matrices through Query-Key similarity dot products scaled by sqrt(d_k).\n\nFormula: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V\n\nWhy scale by sqrt(d_k)? Without scaling, as d_k increases, the dot product grows large in magnitude, pushing softmax into regions with vanishing gradients!`,
        tags: ['ml', 'neural-nets'],
        voteScore: 98
      });

      const post3 = await Post.create({
        subjectId: webSubject._id,
        authorId: user1._id,
        title: 'Mastering React 19 Server Components and Action Hooks in Practice',
        content: `React 19 introduces native support for useActionState, useFormStatus, and optimistic UI updates without extra third-party state managers.\n\nCombining custom hooks with utility-first CSS variables makes building responsive study dashboards smooth and performant!`,
        tags: ['react', 'tailwind'],
        voteScore: 76
      });

      const post4 = await Post.create({
        subjectId: mathSubject._id,
        authorId: user2._id,
        title: 'Eigenvalues & Singular Value Decomposition (SVD): Geometric Intuition',
        content: `Think of Matrix transformation as stretching space along principal axes. Eigenvectors are the vectors whose directions do not change during this linear transformation!\n\nSVD generalizes this concept to non-square matrices A = U Σ V^T, decomposing any linear mapping into Rotation -> Scaling -> Rotation.`,
        tags: ['linear-alg', 'calculus'],
        voteScore: 112
      });

      console.log('Seeded sample posts.');

      // Add Comments
      await Comment.create({
        postId: post1._id,
        authorId: user1._id,
        content: 'This queue breakdown makes memory footprint comparison with DFS stack recursion so much clearer!',
        voteScore: 12
      });

      await Comment.create({
        postId: post2._id,
        authorId: user1._id,
        content: 'The explanation on vanishing softmax gradients when d_k grows large is spot on.',
        voteScore: 8
      });

      // Add Resources
      const res1 = await Resource.create({
        postId: post1._id,
        title: 'BFS & DFS Complexity Cheat Sheet (PDF)',
        type: 'PDF',
        URL: 'https://example.com/bfs-dfs-cheatsheet.pdf',
        tags: ['dsa', 'algorithms'],
        votes: 45
      });

      const res2 = await Resource.create({
        postId: post2._id,
        title: 'Annotated Attention Is All You Need Paper',
        type: 'Research Paper',
        URL: 'https://arxiv.org/abs/1706.03762',
        tags: ['ml', 'neural-nets'],
        votes: 89
      });

      // Attach resource IDs to posts
      post1.reserouseIds = [res1._id];
      await post1.save();

      post2.reserouseIds = [res2._id];
      await post2.save();

      console.log('Seeded comments and resources.');
    } else {
      console.log(`Found ${postCount} existing posts.`);
    }

    console.log('Seeding process complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
