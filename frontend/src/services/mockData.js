// 30 Academic Communities & Departments
export const INITIAL_SUBJECTS = [
  { id: 'cs', name: 'Computer Science', icon: '💻', count: 245, description: 'Algorithms, Data Structures, Software Engineering & Systems' },
  { id: 'math', name: 'Mathematics', icon: '📐', count: 198, description: 'Calculus, Linear Algebra, Analysis, Topology & Discrete Math' },
  { id: 'ds', name: 'Data Science & AI', icon: '🤖', count: 312, description: 'Machine Learning, Deep Learning, Datasets & Neural Nets' },
  { id: 'web', name: 'Web Architecture', icon: '🌐', count: 176, description: 'React, Node, Cloud Infrastructure & Web Protocols' },
  { id: 'quantum', name: 'Quantum Computing', icon: '⚛️', count: 124, description: 'Qubits, Quantum Gates, Qiskit & Superposition Mechanics' },
  { id: 'dsp', name: 'Signal Processing & EE', icon: '⚡', count: 140, description: 'FFT, Digital Signals, Circuits & Electromagnetics' },
  { id: 'cyber', name: 'Cyber Security & Crypto', icon: '🛡️', count: 168, description: 'Cryptography, Zero-Trust, Penetration Testing & Hashes' },
  { id: 'robotics', name: 'Robotics & Control', icon: '🦾', count: 115, description: 'ROS2, Kinematics, Control Loops & Autonomous Systems' },
  { id: 'os', name: 'Operating Systems', icon: '⚙️', count: 135, description: 'Kernels, Concurrency, Virtual Memory & Linux System Calls' },
  { id: 'db', name: 'Database Architecture', icon: '🗄️', count: 152, description: 'PostgreSQL, NoSQL, B-Trees, Distributed Transactions' },
  { id: 'cv', name: 'Computer Vision', icon: '👁️', count: 180, description: 'CNNs, OpenCV, Object Detection, NeRFs & Segmentation' },
  { id: 'nlp', name: 'Natural Language Processing', icon: '🗣️', count: 210, description: 'LLMs, Transformers, Attention Mechanisms, Tokenization' },
  { id: 'bioinfo', name: 'Bioinformatics', icon: '🧬', count: 95, description: 'Genomics, AlphaFold, Sequence Alignment & DNA Analysis' },
  { id: 'aerospace', name: 'Aerospace Engineering', icon: '🚀', count: 88, description: 'Orbital Mechanics, Aerodynamics & Propulsion Dynamics' },
  { id: 'neuro', name: 'Neuroscience', icon: '🧠', count: 104, description: 'Neural Signals, Brain-Computer Interfaces & Synapses' },
  { id: 'materials', name: 'Materials Science', icon: '🔬', count: 79, description: 'Nanomaterials, Semiconductors, Crystallography & Polymer Science' },
  { id: 'quant', name: 'Quantitative Finance', icon: '📈', count: 130, description: 'Stochastic Calculus, Black-Scholes, High Frequency Trading' },
  { id: 'astronomy', name: 'Astrophysics', icon: '🌌', count: 110, description: 'Cosmology, Stellar Evolution, Black Holes & Gravitational Waves' },
  { id: 'chem', name: 'Computational Chemistry', icon: '🧪', count: 84, description: 'Molecular Dynamics, DFT Simulations & Chemical Kinetics' },
  { id: 'vlsi', name: 'VLSI & Microelectronics', icon: '🔌', count: 92, description: 'Verilog, FPGA Synthesis, Transistors & Circuit Design' },
  { id: 'blockchain', name: 'Distributed Consensus', icon: '⛓️', count: 108, description: 'BFT Protocols, Smart Contracts, Cryptographic Proofs' },
  { id: 'game', name: 'Game Engine Engineering', icon: '🎮', count: 145, description: 'Render Pipelines, Ray Tracing, Physics Engines & Shaders' },
  { id: 'control', name: 'Automation & Control', icon: '🎛️', count: 77, description: 'PID Loops, Kalman Filters, State Space Model Optimization' },
  { id: 'rl', name: 'Reinforcement Learning', icon: '♟️', count: 162, description: 'PPO, Q-Learning, Monte Carlo Tree Search, Policy Gradients' },
  { id: 'hpc', name: 'High Performance Computing', icon: '💻', count: 118, description: 'CUDA, OpenMP, MPI, Parallel Algorithms & GPU Clusters' },
  { id: 'compilers', name: 'Compiler Engineering', icon: '📝', count: 89, description: 'LLVM, AST Parsing, Optimization Passes & IR CodeGen' },
  { id: 'fluid', name: 'Fluid Dynamics', icon: '🌊', count: 71, description: 'Navier-Stokes Equations, CFD Simulations, Turbulence' },
  { id: 'embedded', name: 'Embedded Systems', icon: '📟', count: 128, description: 'Microcontrollers, RTOS, STM32, ARM & IoT Protocols' },
  { id: 'med-ai', name: 'Biomedical AI', icon: '🏥', count: 96, description: 'Medical Imaging, DICOM Analysis, Clinical Diagnostic AI' },
  { id: 'stat', name: 'Statistical Physics', icon: '⚛️', count: 83, description: 'Entropy, Thermodynamics, Monte Carlo Physics Simulations' }
];

export const INITIAL_TAGS = {
  cs: [
    { id: 'algorithms', name: 'Algorithms', count: 85 },
    { id: 'dsa', name: 'Data Structures', count: 92 },
    { id: 'sys-design', name: 'System Design', count: 48 },
    { id: 'os', name: 'Operating Systems', count: 34 }
  ],
  math: [
    { id: 'calculus', name: 'Calculus III', count: 68 },
    { id: 'linear-alg', name: 'Linear Algebra', count: 54 },
    { id: 'probability', name: 'Probability & Stats', count: 42 },
    { id: 'discrete', name: 'Discrete Math', count: 39 }
  ],
  ds: [
    { id: 'ml', name: 'Machine Learning', count: 110 },
    { id: 'neural-nets', name: 'Neural Networks', count: 78 },
    { id: 'python-ds', name: 'Pandas & NumPy', count: 64 },
    { id: 'llm', name: 'LLM Fine-Tuning', count: 58 }
  ]
};

const authorsList = [
  { name: 'Dr. Aris Thorne', handle: '@aris_t', role: 'Professor of CS', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { name: 'Dr. Alice Vance', handle: '@alice_vance', role: 'Senior AI Lecturer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { name: 'Prof. David Vance', handle: '@david_v', role: 'Math Department Chair', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { name: 'Sarah Jenkins', handle: '@sarah_j', role: 'Frontend Architect', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
  { name: 'Marcus Chen', handle: '@marcus_c', role: 'Senior ML Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { name: 'Elena Rostova', handle: '@elena_r', role: 'Robotics Researcher', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' }
];

// Generate 150 detailed academic posts with 4 scholarly comments EACH (600+ comments total!)
export const INITIAL_POSTS = Array.from({ length: 150 }, (_, i) => {
  const postNum = i + 1;
  const subjectIndex = Math.floor(i / 5) % INITIAL_SUBJECTS.length;
  const sub = INITIAL_SUBJECTS[subjectIndex];
  const author = authorsList[i % authorsList.length];
  const postInSubIndex = (i % 5) + 1;

  const topicsList = [
    `Theoretical Foundations & Boundary Analysis of ${sub.name}`,
    `Practical Code Implementation & Algorithm Optimization in ${sub.name}`,
    `Comparative Empirical Benchmarks for High-Scale ${sub.name} Systems`,
    `Modern Industry Standards & Best Practices in ${sub.name}`,
    `Open Research Frontiers & Breakthrough Insights in ${sub.name}`
  ];

  const codeSnippets = [
    `def optimize_algorithm(input_data):\n    # Optimized execution pipeline for ${sub.name}\n    res = [x * 2.5 for x in input_data if x > 0]\n    return sorted(res)`,
    `import numpy as np\n# Matrix transformation calculation for ${sub.name}\nmatrix = np.eye(4)\nscaled_matrix = np.dot(matrix, 3.14159)`,
    `async function fetchStreamData(endpoint) {\n  // Asynchronous streaming pipeline for ${sub.name}\n  const response = await fetch(endpoint);\n  return await response.json();\n}`,
    `# PyTorch Neural Computation Tensor operations\nimport torch\nx = torch.randn(32, 128)\nweights = torch.nn.Linear(128, 64)\noutput = weights(x)`
  ];

  return {
    id: `post-${postNum}`,
    author: {
      name: author.name,
      handle: author.handle,
      avatar: author.avatar,
      role: author.role
    },
    subjectId: sub.id,
    subjectName: sub.name,
    tags: [sub.id, `module-${postInSubIndex}`, 'research'],
    title: `${topicsList[(postInSubIndex - 1) % topicsList.length]} (Paper #${postInSubIndex})`,
    content: `In this paper and detailed academic discussion #${postNum}, we examine core theoretical principles and empirical findings in **${sub.name}**.

Key highlights include:
1. Mathematical formulation of convergence boundaries and algorithmic edge cases in ${sub.name}.
2. Complexity analysis under varying scale factors and hardware constraints.
3. Code implementation and performance benchmarks across testing environments.`,
    codeSnippet: codeSnippets[postNum % codeSnippets.length],
    upvotes: 35 + (postNum * 9) % 210,
    userVoted: postNum % 3 === 0,
    saved: postNum % 4 === 0,
    createdAt: `${(postNum % 18) + 1}h ago`,
    comments: [],
    resources: [
      {
        id: `r-${postNum}-1`,
        title: `${sub.name} Study Guide & Reference Notes (PDF)`,
        type: 'PDF Document',
        size: `${(postNum % 3 + 1).toFixed(1)} MB`,
        icon: '📄',
        url: '#'
      },
      {
        id: `r-${postNum}-2`,
        title: `${sub.name} Implementation Notebook (.ipynb)`,
        type: 'Jupyter Notebook',
        size: '1.6 MB',
        icon: '📓',
        url: '#'
      }
    ]
  };
});

// Initial Saved Resources List
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
  }
];

export const CURRENT_USER = {
  name: 'Dr. Alice Vance',
  handle: '@alice_vance',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  role: 'Instructor | Senior Lecturer',
  reputation: 2500,
  joinedDate: 'Jan 2025'
};
