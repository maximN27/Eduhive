/**
 * Test Fixture Posts Dataset for Conflict-Priority Suggestion System
 * Contains 10 posts covering all scoring engine cases, dismissal status, and edge cases.
 */

const INITIAL_FIXTURE_POSTS = [
  // 1. Case (a): High Conflict - Two verified profs, differing conclusions, high views, cs tag -> score >= 50
  {
    id: 'post-high-conflict',
    title: 'Optimal Graph Search Algorithm for Unweighted Networks',
    communityTag: 'cs',
    viewCount: 30,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-101',
        authorRole: 'professor',
        isVerified: true,
        content: 'Breadth-First Search guarantees shortest path in O(V + E) time.',
        conclusion: 'Breadth-First Search (BFS) is strictly optimal for unweighted graphs.',
        confusedReactionCount: 2,
        hasResolvingComment: false
      },
      {
        id: 'ans-102',
        authorRole: 'professor',
        isVerified: true,
        content: 'Bidirectional BFS reduces search space exponentially in practice.',
        conclusion: 'Bidirectional Search is superior to standard BFS for unweighted graphs.',
        confusedReactionCount: 1,
        hasResolvingComment: false
      }
    ]
  },

  // 2. Case (b): Student vs Professor - differing conclusions -> score < 50
  {
    id: 'post-student-prof',
    title: 'Causes of the French Revolution Economic Collapse',
    communityTag: 'history',
    viewCount: 3,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-201',
        authorRole: 'student',
        isVerified: true,
        content: 'Taxation of the Third Estate was the sole primary cause.',
        conclusion: 'Taxation of the Third Estate was the main cause.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-202',
        authorRole: 'professor',
        isVerified: true,
        content: 'Agrarian crisis combined with debt from foreign wars created systemic failure.',
        conclusion: 'Systemic debt and agricultural failure were the main causes.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 3. Case (c): Two verified profs, same conclusion -> score < 50
  {
    id: 'post-same-conclusion',
    title: 'Role of Ribosomes in Protein Synthesis',
    communityTag: 'biology',
    viewCount: 2,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-301',
        authorRole: 'professor',
        isVerified: true,
        content: 'Ribosomes translate mRNA sequences into polypeptide chains.',
        conclusion: 'Ribosomes translate mRNA into amino acid sequences.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-302',
        authorRole: 'professor',
        isVerified: true,
        content: 'Cellular ribosomes link amino acids according to mRNA codons.',
        conclusion: 'Ribosomes translate mRNA into amino acid sequences.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 4. Case (d): High Conflict with Resolving Comment -> score decreases (-10)
  {
    id: 'post-resolved-comment',
    title: 'Transformer Self-Attention Scaling Factor Justification',
    communityTag: 'ai',
    viewCount: 25,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-401',
        authorRole: 'professor',
        isVerified: true,
        content: 'Scaling by sqrt(d_k) prevents large dot product magnitudes.',
        conclusion: 'Scaling prevents vanishing gradients in softmax layer.',
        confusedReactionCount: 1,
        hasResolvingComment: true
      },
      {
        id: 'ans-402',
        authorRole: 'professor',
        isVerified: true,
        content: 'Without scaling, variance grows linearly with dimension d_k.',
        conclusion: 'Scaling normalizes dot product variance to 1.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 5. Case (e): High Conflict with Low Views (viewCount = 2) -> score decreases (-10)
  {
    id: 'post-low-views',
    title: 'Derivation of Maxwell Wave Equations in Vacuum',
    communityTag: 'physics',
    viewCount: 2,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-501',
        authorRole: 'professor',
        isVerified: true,
        content: 'Use curl of curl vector identity on Faraday law.',
        conclusion: 'Derive using vector curl identity on Faraday law.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-502',
        authorRole: 'professor',
        isVerified: true,
        content: 'Use vector potential formulation A and scalar potential phi.',
        conclusion: 'Derive using electromagnetic vector potentials.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 6. Case (f1): Fast Changing Field Tag (ml) -> +5 bonus
  {
    id: 'post-tech-tag',
    title: 'Llama 3 Fine-tuning vs LoRA Adapter Performance',
    communityTag: 'ml',
    viewCount: 12,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-601',
        authorRole: 'professor',
        isVerified: true,
        content: 'Full fine-tuning captures subtle domain knowledge better.',
        conclusion: 'Full fine-tuning achieves higher task accuracy.',
        confusedReactionCount: 2,
        hasResolvingComment: false
      },
      {
        id: 'ans-602',
        authorRole: 'professor',
        isVerified: true,
        content: 'LoRA achieves 99% performance with 10x lower memory overhead.',
        conclusion: 'LoRA is more cost-effective for deployment.',
        confusedReactionCount: 1,
        hasResolvingComment: false
      }
    ]
  },

  // 7. Case (f2): Non-Tech Tag (philosophy) -> no +5 bonus
  {
    id: 'post-nontech-tag',
    title: 'Epistemological Foundations of Descartes Cogito',
    communityTag: 'philosophy',
    viewCount: 12,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-701',
        authorRole: 'professor',
        isVerified: true,
        content: 'Descartes establishes intuition of self-existence.',
        conclusion: 'Cogito is an foundational intuitive axiom.',
        confusedReactionCount: 2,
        hasResolvingComment: false
      },
      {
        id: 'ans-702',
        authorRole: 'professor',
        isVerified: true,
        content: 'Descartes uses implicit syllogistic deduction.',
        conclusion: 'Cogito is a logical deductive inference.',
        confusedReactionCount: 1,
        hasResolvingComment: false
      }
    ]
  },

  // 8. Dismissed Post Case: High Conflict (Score >= 50) BUT dismissedSuggestions contains "conflict"
  {
    id: 'post-dismissed-conflict',
    title: 'P vs NP Completeness Proof Approaches',
    communityTag: 'cs',
    viewCount: 50,
    dismissedSuggestions: ['conflict'],
    answers: [
      {
        id: 'ans-801',
        authorRole: 'professor',
        isVerified: true,
        content: 'Circuit complexity barrier prevents natural proofs.',
        conclusion: 'Relativization barriers prevent standard diagonalized proofs.',
        confusedReactionCount: 5,
        hasResolvingComment: false
      },
      {
        id: 'ans-802',
        authorRole: 'professor',
        isVerified: true,
        content: 'Algebraic geometry offers structural separation.',
        conclusion: 'Geometric complexity theory is the viable path.',
        confusedReactionCount: 4,
        hasResolvingComment: false
      }
    ]
  },

  // 9. Confusion-Heavy Post Case: High reaction count
  {
    id: 'post-high-confusion',
    title: 'Understanding Quantum Entanglement Bell Inequalities',
    communityTag: 'physics',
    viewCount: 18,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-901',
        authorRole: 'professor',
        isVerified: true,
        content: 'Local hidden variable theories are ruled out by experiment.',
        conclusion: 'Locality assumption is violated in quantum mechanics.',
        confusedReactionCount: 6,
        hasResolvingComment: false
      },
      {
        id: 'ans-902',
        authorRole: 'professor',
        isVerified: true,
        content: 'Non-locality does not allow faster than light signaling.',
        conclusion: 'No superluminal information transfer occurs.',
        confusedReactionCount: 4,
        hasResolvingComment: false
      }
    ]
  },

  // 10. Single Answer Post Case: Only 1 answer (no pair possible) -> score = 0
  {
    id: 'post-single-answer',
    title: 'How to configure CORS in Express.js',
    communityTag: 'cs',
    viewCount: 40,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-1001',
        authorRole: 'professor',
        isVerified: true,
        content: 'Use app.use(cors()) middleware.',
        conclusion: 'Use cors npm package middleware.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  }
];

module.exports = {
  INITIAL_FIXTURE_POSTS
};
