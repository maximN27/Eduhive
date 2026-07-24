require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const Subject = require('../src/models/Subject');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');
const Resource = require('../src/models/Resource');
const Vote = require('../src/models/Vote');
const DiscoveryLog = require('../src/models/DiscoveryLog');

const seedDB = async () => {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhive';

  try {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[SEED] Connected to MongoDB: ${mongoose.connection.host}`);
    } catch (err) {
      console.warn(`[SEED] Local MongoDB not reachable at ${mongoUri}. Starting in-memory Mongo server for seeding...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const memServer = await MongoMemoryServer.create();
      mongoUri = memServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`[SEED] Connected to in-memory MongoDB: ${mongoUri}`);
    }

    // Clear existing collections
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Resource.deleteMany({});
    await Vote.deleteMany({});
    await DiscoveryLog.deleteMany({});
    console.log('[SEED] Cleared existing database collections.');

    // 1. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const users = await User.create([
      {
        username: 'alice_prof',
        name: 'Dr. Alice Vance',
        email: 'alice@university.edu',
        passwordHash,
        role: 'teacher',
        reputation: 150,
        bio: 'Associate Professor of Computer Science & AI Research'
      },
      {
        username: 'bob_ta',
        name: 'Bob Miller',
        email: 'bob@university.edu',
        passwordHash,
        role: 'teacher',
        reputation: 85,
        bio: 'Graduate TA for Data Structures & Algorithms'
      },
      {
        username: 'charlie_student',
        name: 'Charlie Davis',
        email: 'charlie@student.edu',
        passwordHash,
        role: 'student',
        reputation: 40,
        bio: 'Senior CS student interested in Machine Learning & Web Dev'
      }
    ]);
    console.log(`[SEED] ${users.length} Users created.`);

    const [alice, bob, charlie] = users;

    // 2. Create Subjects
    const subjects = await Subject.create([
      {
        name: 'Computer Science',
        code: 'CS',
        slug: 'computer-science',
        description: 'Algorithms, Data Structures, Software Engineering, Systems & Artificial Intelligence',
        icon: '💻',
        tags: ['algorithms', 'react', 'python', 'ai', 'data-structures'],
        membersCount: 42
      },
      {
        name: 'Mathematics',
        code: 'MATH',
        slug: 'mathematics',
        description: 'Calculus, Linear Algebra, Discrete Math, Probability & Statistics',
        icon: '📐',
        tags: ['calculus', 'linear-algebra', 'statistics', 'discrete-math'],
        membersCount: 30
      },
      {
        name: 'Physics',
        code: 'PHYS',
        slug: 'physics',
        description: 'Quantum Mechanics, Classical Electrodynamics, Thermodynamics & Optics',
        icon: '⚛️',
        tags: ['quantum', 'thermodynamics', 'mechanics', 'relativity'],
        membersCount: 25
      },
      {
        name: 'Electrical Engineering',
        code: 'EE',
        slug: 'electrical-engineering',
        description: 'Circuits, Signal Processing, Microelectronics & Embedded Systems',
        icon: '⚡',
        tags: ['circuits', 'signals', 'vlsi', 'embedded'],
        membersCount: 18
      }
    ]);
    console.log(`[SEED] ${subjects.length} Subjects created.`);

    const [csSubj, mathSubj, physSubj, eeSubj] = subjects;

    // 3. Create Posts
    const post1 = await Post.create({
      subjectId: csSubj._id,
      authorId: charlie._id,
      title: 'Difference between L1 and L2 Regularization in Machine Learning',
      content: `Can someone provide an intuitive mathematical and practical explanation comparing Lasso (L1) and Ridge (L2) regularization? 

When should I use L1 vs L2 when training high-dimensional linear models or neural networks? Any code examples or geometric insights would be greatly appreciated!`,
      tags: ['ai', 'machine-learning', 'python'],
      voteScore: 18,
      commentCountAtSummary: 0
    });

    const comm1 = await Comment.create({
      postId: post1._id,
      authorId: alice._id,
      content: `Here is the geometric intuition: L1 regularization adds an absolute value penalty term (|w|), which creates diamond-shaped constraint boundaries. Because diamond corners align with coordinate axes, the optimization solution frequently hits a corner, driving weights exactly to 0 (sparsity). 

L2 adds a squared penalty (w²), creating circular/spherical boundaries which shrink weights proportionally toward 0 without making them strictly zero. Use L1 for feature selection and L2 for handling feature multicollinearity!`,
      voteScore: 12
    });

    const comm2 = await Comment.create({
      postId: post1._id,
      authorId: bob._id,
      content: `In PyTorch or Scikit-Learn:
- L2 is configured via \`weight_decay\` in Adam/SGD optimizers or \`Ridge()\`.
- L1 is configured using \`Lasso()\` or custom loss terms: \`loss += lambda_l1 * torch.norm(weights, 1)\`.

Practically, ElasticNet combines both L1 and L2 penalties when you want a balance of feature sparsity and stable grouping!`,
      voteScore: 8,
      parentComment: comm1._id
    });

    const comm3 = await Comment.create({
      postId: post1._id,
      authorId: charlie._id,
      content: `Thanks Dr. Vance and Bob! That diamond vs sphere geometric intuition makes it crystal clear why Lasso sets parameters to 0 while Ridge just shrinks them!`,
      voteScore: 3,
      parentComment: comm2._id
    });

    const comm4 = await Comment.create({
      postId: post1._id,
      authorId: alice._id,
      content: `Glad it helped! Remember that if features are highly correlated, L1 will arbitrarily pick one feature from the group, whereas L2 will distribute the weight evenly across all correlated features.`,
      voteScore: 5,
      parentComment: comm3._id
    });

    const post2 = await Post.create({
      subjectId: csSubj._id,
      authorId: bob._id,
      title: 'Implementing QuickSort in Python & JavaScript with O(n log n) average time',
      content: `Here is a clean implementation of the QuickSort algorithm using modern divide-and-conquer in Python:

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
\`\`\`

Notice how choosing the middle element as pivot avoids O(n²) worst-case on already sorted arrays!`,
      tags: ['algorithms', 'python', 'data-structures'],
      voteScore: 14
    });

    const post3 = await Post.create({
      subjectId: mathSubj._id,
      authorId: alice._id,
      title: 'Intuitive explanation of Taylor Series Expansion and Approximation',
      content: `A Taylor series allows us to represent smooth functions (like sin(x), e^x, or ln(1+x)) as infinite polynomial sums centered at a point a.

Why polynomials? Because polynomials are infinitely differentiable, easy to evaluate computationally, and simple to integrate or differentiate in engineering applications!`,
      tags: ['calculus', 'mathematics'],
      voteScore: 9
    });

    const post4 = await Post.create({
      subjectId: csSubj._id,
      authorId: charlie._id,
      title: 'Best practices for React Context state management in modern web apps',
      content: `When building React applications with Context API:
1. Always keep state atomic to avoid unnecessary re-renders.
2. Separate StateContext from DispatchContext when state changes frequently.
3. Use custom hooks like \`useApp()\` to throw readable errors if consumed outside provider bounds.`,
      tags: ['react', 'web-dev', 'javascript'],
      voteScore: 11
    });

    const post5 = await Post.create({
      subjectId: physSubj._id,
      authorId: bob._id,
      title: 'Schrodinger Wave Equation vs Heisenberg Matrix Mechanics',
      content: `In quantum mechanics, Erwin Schrodinger formulated wave mechanics using continuous differential equations, while Werner Heisenberg developed matrix mechanics. Paul Dirac proved both formulations are mathematically equivalent representations of Hilbert space operators!`,
      tags: ['quantum', 'physics'],
      voteScore: 7
    });

    const post6 = await Post.create({
      subjectId: eeSubj._id,
      authorId: alice._id,
      title: 'Fast Fourier Transform (FFT) applications in Digital Signal Processing',
      content: `The Fast Fourier Transform reduces the computational complexity of Discrete Fourier Transforms from O(N²) to O(N log N) using Cooley-Tukey radix-2 algorithm. It underpins modern audio compression, spectral analysis, and 5G communication systems.`,
      tags: ['signals', 'circuits', 'algorithms'],
      voteScore: 15
    });

    console.log(`[SEED] 6 Posts created.`);

    // 4. Create Resources
    const resources = await Resource.create([
      {
        subjectId: csSubj._id,
        title: 'MIT 6.006 Intro to Algorithms (Full Course)',
        url: 'https://www.youtube.com/watch?v=ZA-tUyM_y7s',
        thumbnail: 'https://img.youtube.com/vi/ZA-tUyM_y7s/hqdefault.jpg',
        type: 'video',
        source: 'user',
        votes: 24,
        tags: ['algorithms', 'data-structures']
      },
      {
        subjectId: csSubj._id,
        title: 'The Algorithms - Python Repository',
        url: 'https://github.com/TheAlgorithms/Python',
        thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        type: 'github',
        source: 'user',
        votes: 38,
        tags: ['algorithms', 'python']
      },
      {
        subjectId: csSubj._id,
        title: 'Attention Is All You Need (Transformer Paper)',
        url: 'https://arxiv.org/abs/1706.03762',
        thumbnail: '',
        type: 'research_paper',
        source: 'auto',
        votes: 45,
        tags: ['ai', 'python']
      },
      {
        subjectId: mathSubj._id,
        title: '3Blue1Brown - Essence of Linear Algebra',
        url: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
        thumbnail: 'https://img.youtube.com/vi/fNk_zzaMoSs/hqdefault.jpg',
        type: 'video',
        source: 'user',
        votes: 50,
        tags: ['linear-algebra', 'calculus']
      },
      {
        subjectId: mathSubj._id,
        title: 'Khan Academy Multivariable Calculus Guide',
        url: 'https://www.khanacademy.org/math/multivariable-calculus',
        thumbnail: '',
        type: 'pdf',
        source: 'user',
        votes: 19,
        tags: ['calculus']
      },
      {
        subjectId: physSubj._id,
        title: 'Feynman Lectures on Physics',
        url: 'https://www.feynmanlectures.caltech.edu/',
        thumbnail: '',
        type: 'pdf',
        source: 'user',
        votes: 31,
        tags: ['quantum', 'mechanics']
      },
      {
        subjectId: physSubj._id,
        title: 'Quantum Computing for Computer Scientists (ArXiv)',
        url: 'https://arxiv.org/abs/quant-ph/9809016',
        thumbnail: '',
        type: 'research_paper',
        source: 'auto',
        votes: 14,
        tags: ['quantum']
      },
      {
        subjectId: eeSubj._id,
        title: 'All About Circuits Textbook & Tutorials',
        url: 'https://www.allaboutcircuits.com/',
        thumbnail: '',
        type: 'animation',
        source: 'user',
        votes: 22,
        tags: ['circuits', 'signals']
      },
      {
        subjectId: eeSubj._id,
        title: 'Digital Signal Processing (DSP) First Principles',
        url: 'https://github.com/DSP-Team/dsp-guide',
        thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        type: 'github',
        source: 'auto',
        votes: 17,
        tags: ['signals']
      },
      {
        subjectId: csSubj._id,
        title: 'React Documentation & Interactive Guide',
        url: 'https://react.dev/',
        thumbnail: '',
        type: 'animation',
        source: 'user',
        votes: 29,
        tags: ['react']
      }
    ]);
    console.log(`[SEED] ${resources.length} Resources created.`);

    // 5. Create Votes
    const votes = await Vote.create([
      { userId: alice._id, targetType: 'post', targetId: post1._id, voteType: 'up' },
      { userId: bob._id, targetType: 'post', targetId: post1._id, voteType: 'up' },
      { userId: charlie._id, targetType: 'post', targetId: post2._id, voteType: 'up' },
      { userId: alice._id, targetType: 'post', targetId: post2._id, voteType: 'up' },
      { userId: bob._id, targetType: 'comment', targetId: comm1._id, voteType: 'up' },
      { userId: charlie._id, targetType: 'comment', targetId: comm1._id, voteType: 'up' },
      { userId: alice._id, targetType: 'comment', targetId: comm2._id, voteType: 'up' },
      { userId: charlie._id, targetType: 'comment', targetId: comm2._id, voteType: 'up' }
    ]);
    console.log(`[SEED] ${votes.length} Votes created.`);

    console.log('[SEED] Successfully seeded database in < 5 seconds!');
    console.log('\n--- DEMO ACCOUNTS CREATED ---');
    console.log('1. Educator: alice@university.edu / password123');
    console.log('2. TA:       bob@university.edu / password123');
    console.log('3. Student:  charlie@student.edu / password123');
    console.log('-------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('[SEED] Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
