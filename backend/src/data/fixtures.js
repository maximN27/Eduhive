/**
 * Test Fixture Dataset for Conflict-Priority Suggestion System
 * Contains mock posts and mock users covering all scoring combinations, borderline boundary cases,
 * regression cases, and user preferences.
 */

const INITIAL_FIXTURE_USERS = [
  {
    id: 'user-1',
    suggestionsEnabled: true
  },
  {
    id: 'user-2',
    suggestionsEnabled: false
  },
  {
    id: 'user-3',
    suggestionsEnabled: true
  }
];

const INITIAL_FIXTURE_POSTS = [
  // 1. Case (a): High Conflict - Two verified profs, differing conclusions, high views, cs tag -> score = 95
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
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-102',
        authorRole: 'professor',
        isVerified: true,
        content: 'Bidirectional BFS reduces search space exponentially in practice.',
        conclusion: 'Bidirectional Search is superior to standard BFS for unweighted graphs.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 2. Case (b): Student vs Professor - Hard precondition returns score = 0
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

  // 3. Regression Test Post: Student vs Professor with max views & CS tag -> Hard precondition returns score = 0
  {
    id: 'post-student-prof-high-views',
    title: 'Sorting Algorithm Benchmark in Embedded Systems',
    communityTag: 'cs',
    viewCount: 100,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-301-s',
        authorRole: 'student',
        isVerified: true,
        content: 'QuickSort is always faster.',
        conclusion: 'QuickSort is optimal.',
        confusedReactionCount: 5,
        hasResolvingComment: false
      },
      {
        id: 'ans-302-p',
        authorRole: 'professor',
        isVerified: true,
        content: 'HeapSort provides worst-case O(N log N) memory safety.',
        conclusion: 'HeapSort is optimal for memory bounds.',
        confusedReactionCount: 5,
        hasResolvingComment: false
      }
    ]
  },

  // 4. Case (c): Two verified profs, same conclusion, resolving comment -> score = 40 (< 50)
  {
    id: 'post-same-conclusion',
    title: 'Role of Ribosomes in Protein Synthesis',
    communityTag: 'biology',
    viewCount: 2,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-401',
        authorRole: 'professor',
        isVerified: true,
        content: 'Ribosomes translate mRNA sequences into polypeptide chains.',
        conclusion: 'Ribosomes translate mRNA into amino acid sequences.',
        confusedReactionCount: 0,
        hasResolvingComment: true
      },
      {
        id: 'ans-402',
        authorRole: 'professor',
        isVerified: true,
        content: 'Cellular ribosomes link amino acids according to mRNA codons.',
        conclusion: 'Ribosomes translate mRNA into amino acid sequences.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 5. Case (d): High Conflict with Resolving Comment -> score = 85
  {
    id: 'post-resolved-comment',
    title: 'Transformer Self-Attention Scaling Factor Justification',
    communityTag: 'ai',
    viewCount: 25,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-501',
        authorRole: 'professor',
        isVerified: true,
        content: 'Scaling by sqrt(d_k) prevents large dot product magnitudes.',
        conclusion: 'Scaling prevents vanishing gradients in softmax layer.',
        confusedReactionCount: 0,
        hasResolvingComment: true
      },
      {
        id: 'ans-502',
        authorRole: 'professor',
        isVerified: true,
        content: 'Without scaling, variance grows linearly with dimension d_k.',
        conclusion: 'Scaling normalizes dot product variance to 1.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 6. Case (e): High Conflict with Low Views (viewCount = 2) -> score = 85
  {
    id: 'post-low-views',
    title: 'Derivation of Maxwell Wave Equations in Vacuum',
    communityTag: 'physics',
    viewCount: 2,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-601',
        authorRole: 'professor',
        isVerified: true,
        content: 'Use curl of curl vector identity on Faraday law.',
        conclusion: 'Derive using vector curl identity on Faraday law.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-602',
        authorRole: 'professor',
        isVerified: true,
        content: 'Use vector potential formulation A and scalar potential phi.',
        conclusion: 'Derive using electromagnetic vector potentials.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 7. Case (f1): Fast Changing Field Tag (ml) -> +5 bonus (score = 90)
  {
    id: 'post-tech-tag',
    title: 'Llama 3 Fine-tuning vs LoRA Adapter Performance',
    communityTag: 'ml',
    viewCount: 12,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-701',
        authorRole: 'professor',
        isVerified: true,
        content: 'Full fine-tuning captures subtle domain knowledge better.',
        conclusion: 'Full fine-tuning achieves higher task accuracy.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-702',
        authorRole: 'professor',
        isVerified: true,
        content: 'LoRA achieves 99% performance with 10x lower memory overhead.',
        conclusion: 'LoRA is more cost-effective for deployment.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 8. Case (f2): Non-Tech Tag (philosophy) -> no +5 bonus (score = 85)
  {
    id: 'post-nontech-tag',
    title: 'Epistemological Foundations of Descartes Cogito',
    communityTag: 'philosophy',
    viewCount: 12,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-801',
        authorRole: 'professor',
        isVerified: true,
        content: 'Descartes establishes intuition of self-existence.',
        conclusion: 'Cogito is an foundational intuitive axiom.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-802',
        authorRole: 'professor',
        isVerified: true,
        content: 'Descartes uses implicit syllogistic deduction.',
        conclusion: 'Cogito is a logical deductive inference.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 9. Borderline Post - EXACTLY 50: Dual profs (+40), same conclusion (+0), viewCount = 6 (+5), resolving comment (+0), cs tag (+5) -> Total = 50
  {
    id: 'post-borderline-50',
    title: 'Memory Alignment Rules in C Systems Programming',
    communityTag: 'cs',
    viewCount: 6,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-b50-1',
        authorRole: 'professor',
        isVerified: true,
        content: 'Data structures align according to natural word boundaries.',
        conclusion: 'Struct padding aligns to natural word boundaries.',
        confusedReactionCount: 0,
        hasResolvingComment: true
      },
      {
        id: 'ans-b50-2',
        authorRole: 'professor',
        isVerified: true,
        content: 'Compilers insert padding bytes to optimize memory accesses.',
        conclusion: 'Struct padding aligns to natural word boundaries.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  },

  // 10. Borderline Post - EXACTLY 48: Dual profs (+40), same conclusion (+0), viewCount = 2 (+0), resolving comment (+0), confused = 4 (+8), history tag (+0) -> Total = 48
  {
    id: 'post-borderline-48',
    title: 'Trade Routes of the Mediterranean Bronze Age',
    communityTag: 'history',
    viewCount: 2,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-b48-1',
        authorRole: 'professor',
        isVerified: true,
        content: 'Maritime trade was primarily focused on tin and copper barter.',
        conclusion: 'Maritime trade centered on raw metals.',
        confusedReactionCount: 2,
        hasResolvingComment: true
      },
      {
        id: 'ans-b48-2',
        authorRole: 'professor',
        isVerified: true,
        content: 'Seafaring routes connected Egypt, Cyprus, and Mycenaean ports.',
        conclusion: 'Maritime trade centered on raw metals.',
        confusedReactionCount: 2,
        hasResolvingComment: false
      }
    ]
  },

  // 11. Dismissed Post Case: High Conflict (Score >= 50) BUT dismissedSuggestions contains "conflict"
  {
    id: 'post-dismissed-conflict',
    title: 'P vs NP Completeness Proof Approaches',
    communityTag: 'cs',
    viewCount: 50,
    dismissedSuggestions: ['conflict'],
    answers: [
      {
        id: 'ans-d-1',
        authorRole: 'professor',
        isVerified: true,
        content: 'Circuit complexity barrier prevents natural proofs.',
        conclusion: 'Relativization barriers prevent standard diagonalized proofs.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-d-2',
        authorRole: 'professor',
        isVerified: true,
        content: 'Algebraic geometry offers structural separation.',
        conclusion: 'Geometric complexity theory is the viable path.',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  }
];

module.exports = {
  INITIAL_FIXTURE_USERS,
  INITIAL_FIXTURE_POSTS
};
