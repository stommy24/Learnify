import { EnglishTopic } from "@/types/curriculum";

export const englishCurriculum: EnglishTopic[] = [
  // === KEY STAGE 1 (Years 1-2) ===
  // Year 1
  {
    id: 'KS1-E-R1',
    subject: 'english',
    keyStage: 1,
    year: 1,
    strand: 'reading',
    title: 'Phonics and Decoding',
    name: 'Phonics and Decoding',
    ageRange: [5, 7],
    objectives: [
      'Apply phonic knowledge and skills for decoding',
      'Respond speedily with correct sound to graphemes',
      'Read accurately by blending sounds in unfamiliar words',
      'Read common exception words'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 0, y: 0 }
  },
  {
    id: 'KS1-E-L1',
    subject: 'english',
    keyStage: 1,
    year: 1,
    strand: 'listening',
    title: 'Active Listening',
    name: 'Active Listening',
    ageRange: [5, 7],
    objectives: [
      'Listen attentively to spoken language',
      'Respond appropriately to instructions',
      'Understand and follow simple directions',
      'Demonstrate listening comprehension'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 5, y: 0 }
  },
  {
    id: 'KS1-E-R2',
    subject: 'english',
    keyStage: 1,
    year: 1,
    strand: 'reading',
    title: 'Reading Comprehension',
    name: 'Reading Comprehension',
    ageRange: [5, 7],
    objectives: [
      'Listen to and discuss a wide range of poems, stories and non-fiction',
      'Link what they read or hear to their own experiences',
      'Become familiar with key stories, fairy stories and traditional tales',
      'Recognize and join in with predictable phrases'
    ],
    prerequisites: ['KS1-E-R1'],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 1, y: 0 }
  },
  {
    id: 'KS1-E-W1',
    subject: 'english',
    keyStage: 1,
    year: 1,
    strand: 'writing',
    title: 'Writing Basics',
    name: 'Writing Basics',
    ageRange: [5, 7],
    objectives: [
      'Sit correctly at a table, holding a pencil comfortably and correctly',
      'Begin to form lower-case letters correctly',
      'Form capital letters',
      'Understand which letters belong to which handwriting families'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 2, y: 0 }
  },
  {
    id: 'KS1-E-G1',
    subject: 'english',
    keyStage: 1,
    year: 1,
    strand: 'grammar',
    title: 'Basic Grammar',
    name: 'Basic Grammar',
    ageRange: [5, 7],
    objectives: [
      'Leave spaces between words',
      'Join words and joining clauses using "and"',
      'Begin to punctuate sentences using a capital letter and full stop',
      'Use capital letters for names of people, places, days of the week'
    ],
    prerequisites: ['KS1-E-W1'],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 3, y: 0 }
  },
  {
    id: 'KS1-E-S1',
    subject: 'english',
    keyStage: 1,
    year: 1,
    strand: 'speaking',
    title: 'Speaking and Listening',
    name: 'Speaking and Listening',
    ageRange: [5, 7],
    objectives: [
      'Listen and respond appropriately to adults and peers',
      'Ask relevant questions to extend understanding',
      'Use relevant strategies to build their vocabulary',
      'Articulate and justify answers, arguments and opinions'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 4, y: 0 }
  },

  // Year 2
  {
    id: 'KS1-E-L2',
    subject: 'english',
    keyStage: 1,
    year: 2,
    strand: 'listening',
    title: 'Listening Skills Development',
    name: 'Listening Skills Development',
    ageRange: [5, 7],
    objectives: [
      'Listen for specific information',
      'Follow multi-step instructions',
      'Understand and respond to questions',
      'Show understanding through appropriate responses'
    ],
    prerequisites: ['KS1-E-L1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 5, y: 1 }
  },
  {
    id: 'KS1-E-R3',
    subject: 'english',
    keyStage: 1,
    year: 2,
    strand: 'reading',
    title: 'Advanced Reading',
    name: 'Advanced Reading',
    ageRange: [5, 7],
    objectives: [
      'Continue to apply phonic knowledge and skills',
      'Read accurately by blending sounds in words',
      'Read words containing common suffixes',
      'Read further common exception words'
    ],
    prerequisites: ['KS1-E-R2'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 0, y: 1 }
  },
  {
    id: 'KS1-E-W2',
    subject: 'english',
    keyStage: 1,
    year: 2,
    strand: 'writing',
    title: 'Writing Development',
    name: 'Writing Development',
    ageRange: [5, 7],
    objectives: [
      'Form lower-case letters of the correct size relative to one another',
      'Start using some of the diagonal and horizontal strokes needed to join letters',
      'Write capital letters and digits of the correct size',
      'Use spacing between words that reflects the size of the letters'
    ],
    prerequisites: ['KS1-E-W1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 1, y: 1 }
  },
  {
    id: 'KS1-E-G2',
    subject: 'english',
    keyStage: 1,
    year: 2,
    strand: 'grammar',
    title: 'Grammar Development',
    name: 'Grammar Development',
    ageRange: [5, 7],
    objectives: [
      'Use both familiar and new punctuation correctly',
      'Use sentences with different forms: statement, question, exclamation, command',
      'Use expanded noun phrases to describe and specify',
      'Use present and past tenses correctly and consistently'
    ],
    prerequisites: ['KS1-E-G1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 2, y: 1 }
  },
  {
    id: 'KS1-E-S2',
    subject: 'english',
    keyStage: 1,
    year: 2,
    strand: 'speaking',
    title: 'Advanced Speaking',
    name: 'Advanced Speaking',
    ageRange: [5, 7],
    objectives: [
      'Articulate and justify answers, arguments and opinions',
      'Give well-structured descriptions, explanations and narratives',
      'Maintain attention and participate actively in collaborative conversations',
      'Speak audibly and fluently with an increasing command of Standard English'
    ],
    prerequisites: ['KS1-E-S1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 3, y: 1 }
  },

  // === KEY STAGE 2 (Years 3-6) ===
  // Year 3
  {
    id: 'KS1-E-L3',
    subject: 'english',
    keyStage: 2,
    year: 3,
    strand: 'listening',
    title: 'Comprehensive Listening',
    name: 'Comprehensive Listening',
    ageRange: [7, 11],
    objectives: [
      'Listen and respond appropriately to adults and peers',
      'Identify key information from spoken passages',
      'Follow complex instructions accurately',
      'Understand main ideas and supporting details'
    ],
    prerequisites: ['KS1-E-L2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 5, y: 2 }
  },
  {
    id: 'KS2-E-R1',
    subject: 'english',
    keyStage: 2,
    year: 3,
    strand: 'reading',
    title: 'Reading Comprehension',
    name: 'Reading Comprehension',
    ageRange: [7, 11],
    objectives: [
      'Apply growing knowledge of root words, prefixes and suffixes',
      'Read further exception words',
      'Listen to and discuss a wide range of fiction, poetry, plays, non-fiction',
      'Use dictionaries to check the meaning of words they have read'
    ],
    prerequisites: ['KS1-E-R3'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 0, y: 2 }
  },
  {
    id: 'KS2-E-W1',
    subject: 'english',
    keyStage: 2,
    year: 3,
    strand: 'writing',
    title: 'Writing Structure',
    name: 'Writing Structure',
    ageRange: [7, 11],
    objectives: [
      'Plan writing by discussing and recording ideas',
      'Create settings, characters and plot in narratives',
      'Use simple organizational devices in non-narrative material',
      'Assess the effectiveness of their own and others writing'
    ],
    prerequisites: ['KS1-E-W2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 1, y: 2 }
  },
  {
    id: 'KS2-E-G1',
    subject: 'english',
    keyStage: 2,
    year: 3,
    strand: 'grammar',
    title: 'Grammar and Punctuation',
    name: 'Grammar and Punctuation',
    ageRange: [7, 11],
    objectives: [
      'Extend the range of sentences with more than one clause',
      'Use conjunctions, adverbs and prepositions to express time and cause',
      'Use the present perfect form of verbs',
      'Use the forms a or an according to whether the next word begins with a consonant or vowel'
    ],
    prerequisites: ['KS1-E-G2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 2, y: 2 }
  },
  {
    id: 'KS2-E-S1',
    subject: 'english',
    keyStage: 2,
    year: 3,
    strand: 'speaking',
    title: 'Speaking and Presenting',
    name: 'Speaking and Presenting',
    ageRange: [7, 11],
    objectives: [
      'Speak audibly and fluently with increasing command of Standard English',
      'Participate in discussions, presentations, performances, role play/improvisations',
      'Gain, maintain and monitor interest of listeners',
      'Consider and evaluate different viewpoints'
    ],
    prerequisites: ['KS1-E-S2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 3, y: 2 }
  },

  // Year 4
  {
    id: 'KS2-E-R2',
    subject: 'english',
    keyStage: 2,
    year: 4,
    strand: 'reading',
    title: 'Advanced Reading Comprehension',
    name: 'Advanced Reading Comprehension',
    ageRange: [7, 11],
    objectives: [
      'Apply knowledge of root words, prefixes and suffixes to read aloud',
      'Develop positive attitudes to reading by listening to and discussing texts',
      'Understand what they read by identifying main ideas',
      'Retrieve and record information from non-fiction'
    ],
    prerequisites: ['KS2-E-R1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 0, y: 3 }
  },
  {
    id: 'KS2-E-W2',
    subject: 'english',
    keyStage: 2,
    year: 4,
    strand: 'writing',
    title: 'Advanced Writing',
    name: 'Advanced Writing',
    ageRange: [7, 11],
    objectives: [
      'Plan writing by discussing writing similar to that which they are planning',
      'Draft and write by composing and rehearsing sentences orally',
      'Organize paragraphs around a theme',
      'Assess the effectiveness of their own and others writing and suggest improvements'
    ],
    prerequisites: ['KS2-E-W1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 1, y: 3 }
  },
  {
    id: 'KS2-E-G2',
    subject: 'english',
    keyStage: 2,
    year: 4,
    strand: 'grammar',
    title: 'Advanced Grammar',
    name: 'Advanced Grammar',
    ageRange: [7, 11],
    objectives: [
      'Use noun phrases expanded by the addition of modifying adjectives, nouns and prepositions',
      'Use fronted adverbials',
      'Use paragraphs to organize ideas around a theme',
      'Use appropriate standard English forms for verb inflections'
    ],
    prerequisites: ['KS2-E-G1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 2, y: 3 }
  },
  {
    id: 'KS2-E-S2',
    subject: 'english',
    keyStage: 2,
    year: 4,
    strand: 'speaking',
    title: 'Advanced Speaking',
    name: 'Advanced Speaking',
    ageRange: [7, 11],
    objectives: [
      'Use spoken language to develop understanding through speculating, hypothesising, imagining and exploring ideas',
      'Participate in discussions, presentations, performances, role play/improvisations and debates',
      'Select and use appropriate registers for effective communication',
      'Give well-structured descriptions, explanations and narratives'
    ],
    prerequisites: ['KS2-E-S1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 3, y: 3 }
  },
  {
    id: 'KS2-E-L4',
    subject: 'english',
    keyStage: 2,
    year: 4,
    strand: 'listening',
    title: 'Advanced Listening Skills',
    name: 'Advanced Listening Skills',
    ageRange: [7, 11],
    objectives: [
      'Listen to and discuss a wide range of texts',
      'Identify different purposes in spoken language',
      'Take notes while listening',
      'Understand implied meanings in discussions'
    ],
    prerequisites: ['KS2-E-L3'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 5, y: 3 }
  },

  // Year 5
  {
    id: 'KS2-E-R3',
    subject: 'english',
    keyStage: 2,
    year: 5,
    strand: 'reading',
    title: 'Complex Reading',
    name: 'Complex Reading',
    ageRange: [7, 11],
    objectives: [
      'Read aloud and understand the meaning of new words',
      'Continue to read and discuss an increasingly wide range of texts',
      'Draw inferences such as inferring characters feelings, thoughts and motives',
      'Identify how language, structure and presentation contribute to meaning'
    ],
    prerequisites: ['KS2-E-R2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 0, y: 4 }
  },
  {
    id: 'KS2-E-W3',
    subject: 'english',
    keyStage: 2,
    year: 5,
    strand: 'writing',
    title: 'Complex Writing',
    name: 'Complex Writing',
    ageRange: [7, 11],
    objectives: [
      'Plan writing by identifying the audience for and purpose of the writing',
      'Select appropriate grammar and vocabulary',
      'Describe settings, characters and atmosphere',
      'Use a wide range of devices to build cohesion within and across paragraphs'
    ],
    prerequisites: ['KS2-E-W2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 1, y: 4 }
  },
  {
    id: 'KS2-E-G3',
    subject: 'english',
    keyStage: 2,
    year: 5,
    strand: 'grammar',
    title: 'Complex Grammar',
    name: 'Complex Grammar',
    ageRange: [7, 11],
    objectives: [
      'Use relative clauses beginning with who, which, where, when, whose, that',
      'Convert nouns or adjectives into verbs using suffixes',
      'Use verb prefixes',
      'Use devices to build cohesion within a paragraph'
    ],
    prerequisites: ['KS2-E-G2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 2, y: 4 }
  },
  {
    id: 'KS2-E-S3',
    subject: 'english',
    keyStage: 2,
    year: 5,
    strand: 'speaking',
    title: 'Complex Speaking',
    name: 'Complex Speaking',
    ageRange: [7, 11],
    objectives: [
      'Articulate and justify answers, arguments and opinions',
      'Give well-structured descriptions, explanations and narratives',
      'Maintain attention and participate actively in collaborative conversations',
      'Use spoken language to develop understanding through speculating, hypothesising, imagining and exploring ideas'
    ],
    prerequisites: ['KS2-E-S2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 3, y: 4 }
  },
  {
    id: 'KS2-E-L5',
    subject: 'english',
    keyStage: 2,
    year: 5,
    strand: 'listening',
    title: 'Critical Listening',
    name: 'Critical Listening',
    ageRange: [7, 11],
    objectives: [
      'Evaluate different viewpoints in discussions',
      'Identify persuasive techniques in spoken language',
      'Summarize main points from discussions',
      'Recognize bias and opinion in spoken texts'
    ],
    prerequisites: ['KS2-E-L4'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 5, y: 4 }
  },

  // Year 6
  {
    id: 'KS2-E-R4',
    subject: 'english',
    keyStage: 2,
    year: 6,
    strand: 'reading',
    title: 'Advanced Complex Reading',
    name: 'Advanced Complex Reading',
    ageRange: [7, 11],
    objectives: [
      'Read and discuss a broad range of genres and texts',
      'Identify and discuss themes and conventions across a wide range of writing',
      'Make comparisons within and across books',
      'Draw inferences with evidence and justify these'
    ],
    prerequisites: ['KS2-E-R3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 0, y: 5 }
  },
  {
    id: 'KS2-E-W4',
    subject: 'english',
    keyStage: 2,
    year: 6,
    strand: 'writing',
    title: 'Advanced Complex Writing',
    name: 'Advanced Complex Writing',
    ageRange: [7, 11],
    objectives: [
      'Plan writing by identifying audience and purpose',
      'Select appropriate grammar and vocabulary to enhance meaning',
      'Use a wide range of cohesive devices',
      'Ensure consistent and correct use of tense throughout'
    ],
    prerequisites: ['KS2-E-W3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 1, y: 5 }
  },
  {
    id: 'KS2-E-G4',
    subject: 'english',
    keyStage: 2,
    year: 6,
    strand: 'grammar',
    title: 'Advanced Complex Grammar',
    name: 'Advanced Complex Grammar',
    ageRange: [7, 11],
    objectives: [
      'Use passive verbs to affect the presentation of information',
      'Use the perfect form of verbs to mark relationships of time and cause',
      'Use expanded noun phrases to convey complicated information concisely',
      'Use modal verbs or adverbs to indicate degrees of possibility'
    ],
    prerequisites: ['KS2-E-G3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 2, y: 5 }
  },
  {
    id: 'KS2-E-S4',
    subject: 'english',
    keyStage: 2,
    year: 6,
    strand: 'speaking',
    title: 'Advanced Complex Speaking',
    name: 'Advanced Complex Speaking',
    ageRange: [7, 11],
    objectives: [
      'Use questions to build knowledge',
      'Articulate arguments and opinions',
      'Use spoken language to speculate, hypothesise, imagine and explore ideas',
      'Participate in discussions, presentations, performances, role play, improvisations and debates'
    ],
    prerequisites: ['KS2-E-S3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 3, y: 5 }
  },
  {
    id: 'KS2-E-L6',
    subject: 'english',
    keyStage: 2,
    year: 6,
    strand: 'listening',
    title: 'Advanced Critical Listening',
    name: 'Advanced Critical Listening',
    ageRange: [7, 11],
    objectives: [
      'Analyze complex arguments and debates',
      'Evaluate speakers rhetorical techniques',
      'Synthesize information from multiple speakers',
      'Identify subtle nuances in spoken language'
    ],
    prerequisites: ['KS2-E-L5'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 5, y: 5 }
  },

  // === KEY STAGE 3 (Years 7-9) ===
  // Year 7
  {
    id: 'KS3-E-R1',
    subject: 'english',
    keyStage: 3,
    year: 7,
    strand: 'reading',
    title: 'Critical Reading',
    name: 'Critical Reading',
    ageRange: [11, 14],
    objectives: [
      'Develop an appreciation and love of reading',
      'Understand increasingly challenging texts',
      'Read critically through studying setting, plot, and characterization',
      'Make critical comparisons across texts'
    ],
    prerequisites: ['KS2-E-R4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 0, y: 6 }
  },
  {
    id: 'KS3-E-W1',
    subject: 'english',
    keyStage: 3,
    year: 7,
    strand: 'writing',
    title: 'Critical Writing',
    name: 'Critical Writing',
    ageRange: [11, 14],
    objectives: [
      'Write accurately, fluently, effectively and at length',
      'Plan, draft, edit and proof-read',
      'Write for a wide range of purposes and audiences',
      'Apply growing knowledge of vocabulary, grammar and text structure'
    ],
    prerequisites: ['KS2-E-W4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 1, y: 6 }
  },
  {
    id: 'KS3-E-G1',
    subject: 'english',
    keyStage: 3,
    year: 7,
    strand: 'grammar',
    title: 'Advanced Grammar Analysis',
    name: 'Advanced Grammar Analysis',
    ageRange: [11, 14],
    objectives: [
      'Study the effectiveness and impact of grammatical features of texts',
      'Draw on new vocabulary and grammatical constructions',
      'Use Standard English confidently in their own writing',
      'Analyse more challenging texts'
    ],
    prerequisites: ['KS2-E-G4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 2, y: 6 }
  },
  {
    id: 'KS3-E-L1',
    subject: 'english',
    keyStage: 3,
    year: 7,
    strand: 'literature',
    title: 'Introduction to Literature',
    name: 'Introduction to Literature',
    ageRange: [11, 14],
    objectives: [
      'Read a wide range of fiction and non-fiction',
      'Study setting, plot, and characterization',
      'Understand how the work of dramatists is communicated',
      'Make critical comparisons across texts'
    ],
    prerequisites: ['KS2-E-R4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 3, y: 6 }
  },
  {
    id: 'KS3-E-L1',
    subject: 'english',
    keyStage: 3,
    year: 7,
    strand: 'listening',
    title: 'Analytical Listening',
    name: 'Analytical Listening',
    ageRange: [11, 14],
    objectives: [
      'Analyze spoken language in different contexts',
      'Identify themes and development in speeches',
      'Take comprehensive notes from presentations',
      'Evaluate effectiveness of spoken arguments'
    ],
    prerequisites: ['KS2-E-L6'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 5, y: 6 }
  },

  // Year 8
  {
    id: 'KS3-E-R2',
    subject: 'english',
    keyStage: 3,
    year: 8,
    strand: 'reading',
    title: 'Advanced Critical Reading',
    name: 'Advanced Critical Reading',
    ageRange: [11, 14],
    objectives: [
      'Read and appreciate the depth and power of the English literary heritage',
      'Understand and critically evaluate texts',
      'Make critical comparisons across texts',
      'Identify and interpret themes, ideas and information'
    ],
    prerequisites: ['KS3-E-R1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 0, y: 7 }
  },
  {
    id: 'KS3-E-W2',
    subject: 'english',
    keyStage: 3,
    year: 8,
    strand: 'writing',
    title: 'Advanced Critical Writing',
    name: 'Advanced Critical Writing',
    ageRange: [11, 14],
    objectives: [
      'Write for a wide range of purposes and audiences',
      'Apply knowledge of literary and rhetorical devices',
      'Make notes and use different planning formats',
      'Make fair and valid criticisms of their own and others work'
    ],
    prerequisites: ['KS3-E-W1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 1, y: 7 }
  },
  {
    id: 'KS3-E-G2',
    subject: 'english',
    keyStage: 3,
    year: 8,
    strand: 'grammar',
    title: 'Complex Grammar Analysis',
    name: 'Complex Grammar Analysis',
    ageRange: [11, 14],
    objectives: [
      'Study their effectiveness and impact on texts',
      'Use linguistic and literary terminology accurately',
      'Understand and use concepts of clarity, variety and accuracy',
      'Control their speaking and writing consciously'
    ],
    prerequisites: ['KS3-E-G1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 2, y: 7 }
  },
  {
    id: 'KS3-E-L2',
    subject: 'english',
    keyStage: 3,
    year: 8,
    strand: 'literature',
    title: 'Advanced Literature',
    name: 'Advanced Literature',
    ageRange: [11, 14],
    objectives: [
      'Study a range of authors in depth',
      'Understand the historical context of texts',
      'Analyse how language shapes meaning',
      'Compare writers ideas and perspectives'
    ],
    prerequisites: ['KS3-E-L1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 3, y: 7 }
  },
  {
    id: 'KS3-E-L2',
    subject: 'english',
    keyStage: 3,
    year: 8,
    strand: 'listening',
    title: 'Advanced Analytical Listening',
    name: 'Advanced Analytical Listening',
    ageRange: [11, 14],
    objectives: [
      'Analyze complex arguments and debates',
      'Evaluate speakers rhetorical techniques',
      'Synthesize information from multiple speakers',
      'Identify subtle nuances in spoken language'
    ],
    prerequisites: ['KS3-E-L1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 5, y: 7 }
  },

  // Year 9
  {
    id: 'KS3-E-R3',
    subject: 'english',
    keyStage: 3,
    year: 9,
    strand: 'reading',
    title: 'Expert Critical Reading',
    name: 'Expert Critical Reading',
    ageRange: [11, 14],
    objectives: [
      'Read and appreciate challenging works',
      'Analyse how language, structure and form contribute to meaning',
      'Show understanding through detailed textual analysis',
      'Compare texts critically and effectively'
    ],
    prerequisites: ['KS3-E-R2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 0, y: 8 }
  },
  {
    id: 'KS3-E-W3',
    subject: 'english',
    keyStage: 3,
    year: 9,
    strand: 'writing',
    title: 'Expert Writing',
    name: 'Expert Writing',
    ageRange: [11, 14],
    objectives: [
      'Write sophisticated and compelling texts',
      'Adapt writing style for different purposes and effects',
      'Use advanced literary and rhetorical devices',
      'Structure texts for maximum impact'
    ],
    prerequisites: ['KS3-E-W2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 1, y: 8 }
  },
  {
    id: 'KS3-E-G3',
    subject: 'english',
    keyStage: 3,
    year: 9,
    strand: 'grammar',
    title: 'Expert Grammar Analysis',
    name: 'Expert Grammar Analysis',
    ageRange: [11, 14],
    objectives: [
      'Analyse how higher-level grammatical concepts create meaning',
      'Use sophisticated grammatical constructions',
      'Apply advanced punctuation and syntax',
      'Evaluate effectiveness of grammatical choices'
    ],
    prerequisites: ['KS3-E-G2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 2, y: 8 }
  },
  {
    id: 'KS3-E-L3',
    subject: 'english',
    keyStage: 3,
    year: 9,
    strand: 'literature',
    title: 'Expert Literature',
    name: 'Expert Literature',
    ageRange: [11, 14],
    objectives: [
      'Analyse complex literary texts in detail',
      'Evaluate different interpretations of texts',
      'Understand deeper themes and perspectives',
      'Make sophisticated comparisons between texts'
    ],
    prerequisites: ['KS3-E-L2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 3, y: 8 }
  },
  {
    id: 'KS3-E-L3',
    subject: 'english',
    keyStage: 3,
    year: 9,
    strand: 'listening',
    title: 'Expert Listening',
    name: 'Expert Listening',
    ageRange: [11, 14],
    objectives: [
      'Analyze complex academic presentations',
      'Evaluate sophisticated arguments',
      'Take detailed notes on complex topics',
      'Compare multiple perspectives in discussions'
    ],
    prerequisites: ['KS3-E-L2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 5, y: 8 }
  },

  // === KEY STAGE 4 (Years 10-11) ===
  // Year 10
  {
    id: 'KS4-E-R1',
    subject: 'english',
    keyStage: 4,
    year: 10,
    strand: 'reading',
    title: 'GCSE Reading Skills',
    name: 'GCSE Reading Skills',
    ageRange: [14, 16],
    objectives: [
      'Read and evaluate texts critically',
      'Synthesize information across multiple texts',
      'Analyse language and structure in detail',
      'Compare writers viewpoints and perspectives'
    ],
    prerequisites: ['KS3-E-R3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 0, y: 9 }
  },
  {
    id: 'KS4-E-W1',
    subject: 'english',
    keyStage: 4,
    year: 10,
    strand: 'writing',
    title: 'GCSE Writing Skills',
    name: 'GCSE Writing Skills',
    ageRange: [14, 16],
    objectives: [
      'Write extended texts for different purposes and audiences',
      'Use sophisticated vocabulary and linguistic devices',
      'Structure texts for deliberate effects',
      'Maintain a consistent and appropriate tone'
    ],
    prerequisites: ['KS3-E-W3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 1, y: 9 }
  },
  {
    id: 'KS4-E-L1',
    subject: 'english',
    keyStage: 4,
    year: 10,
    strand: 'literature',
    title: 'GCSE Literature Studies',
    name: 'GCSE Literature Studies',
    ageRange: [14, 16],
    objectives: [
      'Study set texts in detail including Shakespeare',
      'Analyse themes, characters and contexts',
      'Compare poems from the anthology',
      'Evaluate different interpretations of texts'
    ],
    prerequisites: ['KS3-E-L3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 2, y: 9 }
  },
  {
    id: 'KS4-E-S1',
    subject: 'english',
    keyStage: 4,
    year: 10,
    strand: 'speaking',
    title: 'Speaking and Presenting',
    name: 'Speaking and Presenting',
    ageRange: [14, 16],
    objectives: [
      'Speak audibly and fluently with increasing command of Standard English',
      'Participate in discussions, presentations, performances, role play/improvisations',
      'Gain, maintain and monitor interest of listeners',
      'Consider and evaluate different viewpoints'
    ],
    prerequisites: ['KS2-E-S4'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 3, y: 9 }
  },
  {
    id: 'KS4-E-L1',
    subject: 'english',
    keyStage: 4,
    year: 10,
    strand: 'listening',
    title: 'GCSE Listening Skills',
    name: 'GCSE Listening Skills',
    ageRange: [14, 16],
    objectives: [
      'Analyze complex spoken texts critically',
      'Evaluate speakers use of language and rhetoric',
      'Take detailed notes in various contexts',
      'Identify subtle implications and nuances'
    ],
    prerequisites: ['KS3-E-L3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 5, y: 9 }
  },

  // Year 11
  {
    id: 'KS4-E-R2',
    subject: 'english',
    keyStage: 4,
    year: 11,
    strand: 'reading',
    title: 'Advanced GCSE Reading',
    name: 'Advanced GCSE Reading',
    ageRange: [14, 16],
    objectives: [
      'Critically evaluate texts in detail',
      'Analyse subtle implications and nuanced meanings',
      'Compare and contrast texts with insight',
      'Demonstrate sophisticated understanding of writers methods'
    ],
    prerequisites: ['KS4-E-R1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 0, y: 10 }
  },
  {
    id: 'KS4-E-W2',
    subject: 'english',
    keyStage: 4,
    year: 11,
    strand: 'writing',
    title: 'Advanced GCSE Writing',
    name: 'Advanced GCSE Writing',
    ageRange: [14, 16],
    objectives: [
      'Write sophisticated and nuanced texts',
      'Craft language for specific effects',
      'Structure complex texts with precision',
      'Adapt style and form for maximum impact'
    ],
    prerequisites: ['KS4-E-W1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 1, y: 10 }
  },
  {
    id: 'KS4-E-L2',
    subject: 'english',
    keyStage: 4,
    year: 11,
    strand: 'literature',
    title: 'Advanced GCSE Literature',
    name: 'Advanced GCSE Literature',
    ageRange: [14, 16],
    objectives: [
      'Analyse texts with sophisticated insight',
      'Evaluate multiple interpretations of texts',
      'Make perceptive comparisons between texts',
      'Understand deeper contextual influences'
    ],
    prerequisites: ['KS4-E-L1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 2, y: 10 }
  },
  {
    id: 'KS4-E-S2',
    subject: 'english',
    keyStage: 4,
    year: 11,
    strand: 'speaking',
    title: 'Advanced Speaking and Presenting',
    name: 'Advanced Speaking and Presenting',
    ageRange: [14, 16],
    objectives: [
      'Present complex ideas with clarity and precision',
      'Engage in sophisticated debate and discussion',
      'Adapt speaking style for different contexts',
      'Use rhetorical devices for maximum effect'
    ],
    prerequisites: ['KS4-E-S1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 3, y: 10 }
  },
  {
    id: 'KS4-E-L2',
    subject: 'english',
    keyStage: 4,
    year: 11,
    strand: 'listening',
    title: 'Advanced GCSE Listening',
    name: 'Advanced GCSE Listening',
    ageRange: [14, 16],
    objectives: [
      'Analyze and evaluate sophisticated spoken texts',
      'Synthesize information from multiple sources',
      'Take comprehensive notes in academic contexts',
      'Evaluate complex arguments and presentations'
    ],
    prerequisites: ['KS4-E-L1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 5, y: 10 }
  }
]; 