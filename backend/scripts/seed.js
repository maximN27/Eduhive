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
        reputation: 2500,
        bio: 'Associate Professor of Computer Science & AI Research'
      },
      {
        username: 'bob_ta',
        name: 'Bob Miller',
        email: 'bob@university.edu',
        passwordHash,
        role: 'teacher',
        reputation: 1850,
        bio: 'Graduate TA for Data Structures & Algorithms'
      },
      {
        username: 'charlie_student',
        name: 'Charlie Davis',
        email: 'charlie@student.edu',
        passwordHash,
        role: 'student',
        reputation: 1400,
        bio: 'Senior CS student interested in Machine Learning & Web Dev'
      },
      {
        username: 'aris_thorne',
        name: 'Dr. Aris Thorne',
        email: 'aris@university.edu',
        passwordHash,
        role: 'teacher',
        reputation: 3200,
        bio: 'Professor of CS & Algorithms Department Chair'
      },
      {
        username: 'sarah_j',
        name: 'Sarah Jenkins',
        email: 'sarah@university.edu',
        passwordHash,
        role: 'professional',
        reputation: 2100,
        bio: 'Senior Frontend Architect & React Specialist'
      }
    ]);
    console.log(`[SEED] ${users.length} Users created.`);

    const [alice, bob, charlie, aris, sarah] = users;
    const authors = [alice, bob, charlie, aris, sarah];

    // 2. Create Subjects (30 Communities)
    const subjectsData = [
      { name: 'Computer Science', code: 'CS', slug: 'computer-science', description: 'Algorithms, Data Structures, Software Engineering, Systems & Artificial Intelligence', icon: '💻', tags: ['algorithms', 'dsa', 'sys-design', 'os'], membersCount: 245 },
      { name: 'Mathematics', code: 'MATH', slug: 'mathematics', description: 'Calculus, Linear Algebra, Analysis, Topology & Discrete Math', icon: '📐', tags: ['calculus', 'linear-alg', 'probability', 'discrete'], membersCount: 198 },
      { name: 'Data Science & AI', code: 'DS', slug: 'data-science-ai', description: 'Machine Learning, Deep Learning, Datasets & Neural Nets', icon: '🤖', tags: ['ml', 'neural-nets', 'python-ds', 'llm'], membersCount: 312 },
      { name: 'Web Architecture', code: 'WEB', slug: 'web-architecture', description: 'React, Node, Cloud Infrastructure & Web Protocols', icon: '🌐', tags: ['react', 'tailwind', 'backend-api', 'typescript'], membersCount: 176 },
      { name: 'Quantum Computing', code: 'QC', slug: 'quantum-computing', description: 'Qubits, Quantum Gates, Qiskit & Superposition Mechanics', icon: '⚛️', tags: ['qiskit', 'superposition', 'entanglement'], membersCount: 124 },
      { name: 'Signal Processing & EE', code: 'EE', slug: 'signal-processing-ee', description: 'FFT, Digital Signals, Circuits & Electromagnetics', icon: '⚡', tags: ['fft', 'signals', 'circuits'], membersCount: 140 },
      { name: 'Cyber Security & Crypto', code: 'CYBER', slug: 'cyber-security-crypto', description: 'Cryptography, Zero-Trust, Penetration Testing & Hashes', icon: '🛡️', tags: ['crypto', 'zero-trust', 'hashes'], membersCount: 168 },
      { name: 'Robotics & Control', code: 'ROB', slug: 'robotics-control', description: 'ROS2, Kinematics, Control Loops & Autonomous Systems', icon: '🦾', tags: ['ros2', 'kinematics', 'control-loop'], membersCount: 115 },
      { name: 'Operating Systems', code: 'OS', slug: 'operating-systems', description: 'Kernels, Concurrency, Virtual Memory & Linux System Calls', icon: '⚙️', tags: ['kernels', 'linux', 'processes'], membersCount: 135 },
      { name: 'Database Architecture', code: 'DB', slug: 'database-architecture', description: 'PostgreSQL, NoSQL, B-Trees, Distributed Transactions', icon: '🗄️', tags: ['postgres', 'nosql', 'transactions'], membersCount: 152 },
      { name: 'Computer Vision', code: 'CV', slug: 'computer-vision', description: 'CNNs, OpenCV, Object Detection, NeRFs & Segmentation', icon: '👁️', tags: ['cnns', 'opencv', 'segmentation'], membersCount: 180 },
      { name: 'Natural Language Processing', code: 'NLP', slug: 'natural-language-processing', description: 'LLMs, Transformers, Attention Mechanisms, Tokenization', icon: '🗣️', tags: ['transformers', 'llms', 'tokenization'], membersCount: 210 },
      { name: 'Bioinformatics', code: 'BIO', slug: 'bioinformatics', description: 'Genomics, AlphaFold, Sequence Alignment & DNA Analysis', icon: '🧬', tags: ['genomics', 'alphafold', 'dna'], membersCount: 95 },
      { name: 'Aerospace Engineering', code: 'AERO', slug: 'aerospace-engineering', description: 'Orbital Mechanics, Aerodynamics & Propulsion Dynamics', icon: '🚀', tags: ['orbit', 'aerodynamics', 'propulsion'], membersCount: 88 },
      { name: 'Neuroscience', code: 'NEURO', slug: 'neuroscience', description: 'Neural Signals, Brain-Computer Interfaces & Synapses', icon: '🧠', tags: ['bci', 'synapses', 'brain'], membersCount: 104 },
      { name: 'Materials Science', code: 'MAT', slug: 'materials-science', description: 'Nanomaterials, Semiconductors, Crystallography & Polymer Science', icon: '🔬', tags: ['nano', 'semiconductors', 'polymers'], membersCount: 79 },
      { name: 'Quantitative Finance', code: 'QUANT', slug: 'quantitative-finance', description: 'Stochastic Calculus, Black-Scholes, High Frequency Trading', icon: '📈', tags: ['options', 'black-scholes', 'trading'], membersCount: 130 },
      { name: 'Astrophysics', code: 'ASTRO', slug: 'astrophysics', description: 'Cosmology, Stellar Evolution, Black Holes & Gravitational Waves', icon: '🌌', tags: ['black-holes', 'cosmology', 'stars'], membersCount: 110 },
      { name: 'Computational Chemistry', code: 'CHEM', slug: 'computational-chemistry', description: 'Molecular Dynamics, DFT Simulations & Chemical Kinetics', icon: '🧪', tags: ['dft', 'molecular-dynamics', 'kinetics'], membersCount: 84 },
      { name: 'VLSI & Microelectronics', code: 'VLSI', slug: 'vlsi-microelectronics', description: 'Verilog, FPGA Synthesis, Transistors & Circuit Design', icon: '🔌', tags: ['verilog', 'fpga', 'transistors'], membersCount: 92 },
      { name: 'Distributed Consensus', code: 'CONS', slug: 'distributed-consensus', description: 'BFT Protocols, Smart Contracts, Cryptographic Proofs', icon: '⛓️', tags: ['bft', 'blockchain', 'contracts'], membersCount: 108 },
      { name: 'Game Engine Engineering', code: 'GAME', slug: 'game-engine-engineering', description: 'Render Pipelines, Ray Tracing, Physics Engines & Shaders', icon: '🎮', tags: ['shaders', 'ray-tracing', 'physics-engine'], membersCount: 145 },
      { name: 'Automation & Control', code: 'CTRL', slug: 'automation-control', description: 'PID Loops, Kalman Filters, State Space Model Optimization', icon: '🎛️', tags: ['pid', 'kalman', 'state-space'], membersCount: 77 },
      { name: 'Reinforcement Learning', code: 'RL', slug: 'reinforcement-learning', description: 'PPO, Q-Learning, Monte Carlo Tree Search, Policy Gradients', icon: '♟️', tags: ['ppo', 'q-learning', 'policy-gradient'], membersCount: 162 },
      { name: 'High Performance Computing', code: 'HPC', slug: 'high-performance-computing', description: 'CUDA, OpenMP, MPI, Parallel Algorithms & GPU Clusters', icon: '💻', tags: ['cuda', 'openmp', 'gpus'], membersCount: 118 },
      { name: 'Compiler Engineering', code: 'COMP', slug: 'compiler-engineering', description: 'LLVM, AST Parsing, Optimization Passes & IR CodeGen', icon: '📝', tags: ['llvm', 'ast', 'ir'], membersCount: 89 },
      { name: 'Fluid Dynamics', code: 'FLUID', slug: 'fluid-dynamics', description: 'Navier-Stokes Equations, CFD Simulations, Turbulence', icon: '🌊', tags: ['cfd', 'navier-stokes', 'turbulence'], membersCount: 71 },
      { name: 'Embedded Systems', code: 'EMB', slug: 'embedded-systems', description: 'Microcontrollers, RTOS, STM32, ARM & IoT Protocols', icon: '📟', tags: ['rtos', 'stm32', 'arm'], membersCount: 128 },
      { name: 'Biomedical AI', code: 'MED', slug: 'biomedical-ai', description: 'Medical Imaging, DICOM Analysis, Clinical Diagnostic AI', icon: '🏥', tags: ['dicom', 'clinical-ai', 'imaging'], membersCount: 96 },
      { name: 'Statistical Physics', code: 'STAT', slug: 'statistical-physics', description: 'Entropy, Thermodynamics, Monte Carlo Physics Simulations', icon: '⚛️', tags: ['entropy', 'thermodynamics', 'monte-carlo'], membersCount: 83 }
    ];

    const subjects = await Subject.create(subjectsData);
    console.log(`[SEED] ${subjects.length} Subjects created.`);

    // 3. Create 150 Detailed Posts with 4 Comments Each (600 Comments Total!)
    const createdPosts = [];

    const topicsList = [
      'Theoretical Foundations & Boundary Analysis',
      'Practical Code Implementation & Algorithm Optimization',
      'Comparative Empirical Benchmarks & Hardware Constraints',
      'Modern Industry Standards & Best Practices',
      'Open Research Frontiers & Breakthrough Insights'
    ];

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];

      for (let pIndex = 1; pIndex <= 5; pIndex++) {
        const postNumber = (i * 5) + pIndex;
        const author = authors[postNumber % authors.length];
        const topic = topicsList[(pIndex - 1) % topicsList.length];

        const post = await Post.create({
          subjectId: subject._id,
          authorId: author._id,
          title: `${subject.name}: ${topic} (Paper #${pIndex})`,
          content: `In this paper and detailed academic discussion #${postNumber}, we examine core theoretical principles and empirical findings in **${subject.name}**.

Key highlights include:
1. Mathematical formulation of convergence boundaries and algorithmic edge cases in ${subject.name}.
2. Complexity analysis under varying scale factors and hardware constraints.
3. Code implementation and performance benchmarks across testing environments.`,
          codeSnippet: `def compute_boundary(data, scale=1.0):\n    # Operational calculation for ${subject.name}\n    return [x * scale for x in data]\n\nprint("Result:", compute_boundary([1, 2, 3]))`,
          tags: subject.tags || ['academic', 'research'],
          voteScore: 35 + (postNumber * 9) % 210
        });

        createdPosts.push(post);

        // Add 4 comments per post
        const comm1 = await Comment.create({
          postId: post._id,
          authorId: alice._id,
          content: `Excellent exposition on ${subject.name}! The theoretical derivation step in section 2 clarifies boundary edge cases.`,
          voteScore: 12
        });

        const comm2 = await Comment.create({
          postId: post._id,
          authorId: aris._id,
          content: `Have you considered benchmarking this against modern parallelization techniques? The memory layout would benefit from SIMD vector alignment.`,
          voteScore: 8,
          parentComment: comm1._id
        });

        await Comment.create({
          postId: post._id,
          authorId: bob._id,
          content: `We tested a similar formulation in production for ${subject.name} last week. Reducing allocation overhead boosted throughput by ~18%!`,
          voteScore: 6,
          parentComment: comm2._id
        });

        await Comment.create({
          postId: post._id,
          authorId: charlie._id,
          content: `Could you share the attached Jupyter notebook link? I want to replicate the parameter sensitivity experiments.`,
          voteScore: 4
        });
      }
    }

    console.log(`[SEED] ${createdPosts.length} Posts & 600 Comments created across 30 Communities.`);

    console.log('[SEED] Successfully seeded database!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
