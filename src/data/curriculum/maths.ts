import { MathsTopic } from "@/types/curriculum";

export const mathsCurriculum: MathsTopic[] = [
  // === KEY STAGE 1 (Years 1-2) ===
  // Year 1
  {
    id: 'KS1-M-N1',
    subject: 'maths',
    keyStage: 1,
    year: 1,
    strand: 'number',
    title: 'Number and Place Value',
    name: 'Number and Place Value',
    ageRange: [5, 7],
    objectives: [
      'Count to and across 100, forwards and backwards',
      'Read and write numbers from 1 to 20 in numerals and words',
      'Identify one more and one less than a given number',
      'Use number lines and represent numbers using objects'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 0, y: 0 }
  },
  {
    id: 'KS1-M-A1',
    subject: 'maths',
    keyStage: 1,
    year: 1,
    strand: 'algebra',
    title: 'Early Patterns',
    name: 'Early Patterns',
    ageRange: [5, 7],
    objectives: [
      'Recognize and create simple patterns',
      'Continue number sequences',
      'Understand and use the = sign',
      'Solve missing number problems'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 1, y: 0 }
  },
  {
    id: 'KS1-M-G1',
    subject: 'maths',
    keyStage: 1,
    year: 1,
    strand: 'geometry',
    title: 'Shape Basics',
    name: 'Shape Basics',
    ageRange: [5, 7],
    objectives: [
      'Recognize and name common 2D shapes',
      'Recognize and name common 3D shapes',
      'Describe position, direction and movement',
      'Identify patterns with shapes'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 2, y: 0 }
  },
  {
    id: 'KS1-M-M1',
    subject: 'maths',
    keyStage: 1,
    year: 1,
    strand: 'measurement',
    title: 'Basic Measurement',
    name: 'Basic Measurement',
    ageRange: [5, 7],
    objectives: [
      'Compare, describe and solve practical problems for lengths and heights',
      'Measure and begin to record lengths and heights',
      'Recognize different denominations of coins and notes',
      'Sequence events in chronological order'
    ],
    prerequisites: [],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 3, y: 0 }
  },
  {
    id: 'KS1-M-S1',
    subject: 'maths',
    keyStage: 1,
    year: 1,
    strand: 'statistics',
    title: 'Introduction to Data',
    name: 'Introduction to Data',
    ageRange: [5, 7],
    objectives: [
      'Sort objects into categories',
      'Count objects in each category',
      'Create simple pictograms',
      'Answer questions about simple data'
    ],
    prerequisites: ['KS1-M-N1'],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 4, y: 0 }
  },
  {
    id: 'KS1-M-R1',
    subject: 'maths',
    keyStage: 1,
    year: 1,
    strand: 'ratio',
    title: 'Early Proportional Thinking',
    name: 'Early Proportional Thinking',
    ageRange: [5, 7],
    objectives: [
      'Share objects equally into groups',
      'Recognize when sharing is fair or unfair',
      'Find half of a shape or quantity',
      'Find double of a number'
    ],
    prerequisites: ['KS1-M-N1'],
    difficulty: 1,
    level: 'Foundation-1',
    position: { x: 5, y: 0 }
  },

  // Year 2
  {
    id: 'KS1-M-N2',
    subject: 'maths',
    keyStage: 1,
    year: 2,
    strand: 'number',
    title: 'Advanced Number Skills',
    name: 'Advanced Number Skills',
    ageRange: [5, 7],
    objectives: [
      'Count in steps of 2, 3, and 5 from 0',
      'Recognize place value in two-digit numbers',
      'Compare and order numbers up to 100',
      'Use greater than, less than and equals signs'
    ],
    prerequisites: ['KS1-M-N1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 0, y: 1 }
  },
  {
    id: 'KS1-M-A2',
    subject: 'maths',
    keyStage: 1,
    year: 2,
    strand: 'algebra',
    title: 'Pattern Development',
    name: 'Pattern Development',
    ageRange: [5, 7],
    objectives: [
      'Recognize and describe number patterns',
      'Use symbols to describe missing numbers',
      'Solve more complex missing number problems',
      'Create number sequences'
    ],
    prerequisites: ['KS1-M-A1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 1, y: 1 }
  },
  {
    id: 'KS1-M-G2',
    subject: 'maths',
    keyStage: 1,
    year: 2,
    strand: 'geometry',
    title: 'Properties of Shapes',
    name: 'Properties of Shapes',
    ageRange: [5, 7],
    objectives: [
      'Identify and describe properties of 2D shapes',
      'Identify and describe properties of 3D shapes',
      'Compare and sort common shapes',
      'Identify lines of symmetry'
    ],
    prerequisites: ['KS1-M-G1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 2, y: 1 }
  },
  {
    id: 'KS1-M-M2',
    subject: 'maths',
    keyStage: 1,
    year: 2,
    strand: 'measurement',
    title: 'Advanced Measurement',
    name: 'Advanced Measurement',
    ageRange: [5, 7],
    objectives: [
      'Choose and use appropriate standard units',
      'Compare and order lengths, mass, volume/capacity',
      'Tell and write the time to five minutes',
      'Recognize and use symbols for pounds and pence'
    ],
    prerequisites: ['KS1-M-M1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 3, y: 1 }
  },
  {
    id: 'KS1-M-S2',
    subject: 'maths',
    keyStage: 1,
    year: 2,
    strand: 'statistics',
    title: 'Data Interpretation',
    name: 'Data Interpretation',
    ageRange: [5, 7],
    objectives: [
      'Interpret and construct simple pictograms',
      'Interpret and construct tally charts',
      'Interpret and construct block diagrams',
      'Ask and answer questions about totalling and comparing data'
    ],
    prerequisites: ['KS1-M-S1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 4, y: 1 }
  },
  {
    id: 'KS1-M-R2',
    subject: 'maths',
    keyStage: 1,
    year: 2,
    strand: 'ratio',
    title: 'Basic Fractions',
    name: 'Basic Fractions',
    ageRange: [5, 7],
    objectives: [
      'Recognize, find, name and write fractions 1/3, 1/4, 2/4 and 3/4',
      'Write simple fractions',
      'Recognize equivalence of 2/4 and 1/2',
      'Solve simple problems involving fractions'
    ],
    prerequisites: ['KS1-M-R1'],
    difficulty: 2,
    level: 'Foundation-2',
    position: { x: 5, y: 1 }
  },

  // === KEY STAGE 2 (Years 3-6) ===
  // Year 3
  {
    id: 'KS2-M-N1',
    subject: 'maths',
    keyStage: 2,
    year: 3,
    strand: 'number',
    title: 'Number and Place Value',
    name: 'Number and Place Value',
    ageRange: [7, 11],
    objectives: [
      'Count from 0 in multiples of 4, 8, 50 and 100',
      'Recognize place value in three-digit numbers',
      'Compare and order numbers up to 1000',
      'Solve number problems and practical problems'
    ],
    prerequisites: ['KS1-M-N2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 0, y: 2 }
  },
  {
    id: 'KS2-M-A1',
    subject: 'maths',
    keyStage: 2,
    year: 3,
    strand: 'algebra',
    title: 'Introduction to Algebra',
    name: 'Introduction to Algebra',
    ageRange: [7, 11],
    objectives: [
      'Solve missing number problems using number facts',
      'Identify arithmetic patterns',
      'Use simple formulae with one operation',
      'Find missing numbers in sequences'
    ],
    prerequisites: ['KS1-M-A2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 1, y: 2 }
  },
  {
    id: 'KS2-M-G1',
    subject: 'maths',
    keyStage: 2,
    year: 3,
    strand: 'geometry',
    title: 'Advanced Shapes',
    name: 'Advanced Shapes',
    ageRange: [7, 11],
    objectives: [
      'Draw 2D shapes with specific properties',
      'Recognize 3D shapes in different orientations',
      'Identify right angles and parallel lines',
      'Measure perimeter of simple 2D shapes'
    ],
    prerequisites: ['KS1-M-G2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 2, y: 2 }
  },
  {
    id: 'KS2-M-M1',
    subject: 'maths',
    keyStage: 2,
    year: 3,
    strand: 'measurement',
    title: 'Complex Measurement',
    name: 'Complex Measurement',
    ageRange: [7, 11],
    objectives: [
      'Measure, compare, add and subtract lengths',
      'Measure perimeter of simple 2D shapes',
      'Add and subtract amounts of money',
      'Tell and write time from analog clock'
    ],
    prerequisites: ['KS1-M-M2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 3, y: 2 }
  },
  {
    id: 'KS2-M-S1',
    subject: 'maths',
    keyStage: 2,
    year: 3,
    strand: 'statistics',
    title: 'Data Collection',
    name: 'Data Collection',
    ageRange: [7, 11],
    objectives: [
      'Interpret and present data using bar charts',
      'Interpret and present data using pictograms',
      'Interpret and present data using tables',
      'Solve one-step and two-step questions using information'
    ],
    prerequisites: ['KS1-M-S2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 4, y: 2 }
  },
  {
    id: 'KS2-M-R1',
    subject: 'maths',
    keyStage: 2,
    year: 3,
    strand: 'ratio',
    title: 'Fractions Development',
    name: 'Fractions Development',
    ageRange: [7, 11],
    objectives: [
      'Count up and down in tenths',
      'Recognize and use fractions as numbers',
      'Find fractions of a discrete set of objects',
      'Add and subtract fractions with same denominator'
    ],
    prerequisites: ['KS1-M-R2'],
    difficulty: 3,
    level: 'Intermediate-1',
    position: { x: 5, y: 2 }
  },

  // Year 4
  {
    id: 'KS2-M-N2',
    subject: 'maths',
    keyStage: 2,
    year: 4,
    strand: 'number',
    title: 'Advanced Number Operations',
    name: 'Advanced Number Operations',
    ageRange: [7, 11],
    objectives: [
      'Count in multiples of 6, 7, 9, 25 and 1000',
      'Find 1000 more or less than a given number',
      'Count backwards through zero to include negative numbers',
      'Round numbers to nearest 10, 100 or 1000'
    ],
    prerequisites: ['KS2-M-N1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 0, y: 3 }
  },
  {
    id: 'KS2-M-A2',
    subject: 'maths',
    keyStage: 2,
    year: 4,
    strand: 'algebra',
    title: 'Basic Equations',
    name: 'Basic Equations',
    ageRange: [7, 11],
    objectives: [
      'Use simple formulae with two operations',
      'Find missing numbers in more complex sequences',
      'Solve two-step equations',
      'Express missing number problems algebraically'
    ],
    prerequisites: ['KS2-M-A1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 1, y: 3 }
  },
  {
    id: 'KS2-M-G2',
    subject: 'maths',
    keyStage: 2,
    year: 4,
    strand: 'geometry',
    title: 'Angles and Symmetry',
    name: 'Angles and Symmetry',
    ageRange: [7, 11],
    objectives: [
      'Compare and classify geometric shapes',
      'Identify acute and obtuse angles',
      'Identify lines of symmetry in 2D shapes',
      'Complete a simple symmetric figure'
    ],
    prerequisites: ['KS2-M-G1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 2, y: 3 }
  },
  {
    id: 'KS2-M-M2',
    subject: 'maths',
    keyStage: 2,
    year: 4,
    strand: 'measurement',
    title: 'Area and Time',
    name: 'Area and Time',
    ageRange: [7, 11],
    objectives: [
      'Convert between different units of measure',
      'Measure and calculate perimeter of rectilinear figures',
      'Find area of rectilinear shapes by counting squares',
      'Read, write and convert time between analog and digital'
    ],
    prerequisites: ['KS2-M-M1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 3, y: 3 }
  },
  {
    id: 'KS2-M-S2',
    subject: 'maths',
    keyStage: 2,
    year: 4,
    strand: 'statistics',
    title: 'Data Analysis',
    name: 'Data Analysis',
    ageRange: [7, 11],
    objectives: [
      'Interpret and present discrete and continuous data',
      'Use appropriate graphical methods',
      'Solve comparison, sum and difference problems',
      'Use bar charts and time graphs'
    ],
    prerequisites: ['KS2-M-S1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 4, y: 3 }
  },
  {
    id: 'KS2-M-R2',
    subject: 'maths',
    keyStage: 2,
    year: 4,
    strand: 'ratio',
    title: 'Decimal Fractions',
    name: 'Decimal Fractions',
    ageRange: [7, 11],
    objectives: [
      'Recognize and write decimal equivalents of fractions',
      'Round decimals to nearest whole number',
      'Compare numbers with same number of decimal places',
      'Divide by 10 and 100'
    ],
    prerequisites: ['KS2-M-R1'],
    difficulty: 4,
    level: 'Intermediate-2',
    position: { x: 5, y: 3 }
  },

  // Year 5
  {
    id: 'KS2-M-N3',
    subject: 'maths',
    keyStage: 2,
    year: 5,
    strand: 'number',
    title: 'Complex Number Operations',
    name: 'Complex Number Operations',
    ageRange: [7, 11],
    objectives: [
      'Read, write, order and compare numbers to at least 1,000,000',
      'Count forwards or backwards in steps of powers of 10',
      'Interpret negative numbers in context',
      'Round any number up to 1,000,000'
    ],
    prerequisites: ['KS2-M-N2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 0, y: 4 }
  },
  {
    id: 'KS2-M-A3',
    subject: 'maths',
    keyStage: 2,
    year: 5,
    strand: 'algebra',
    title: 'Complex Patterns',
    name: 'Complex Patterns',
    ageRange: [7, 11],
    objectives: [
      'Use simple formulae with multiple operations',
      'Generate and describe linear number sequences',
      'Express missing number problems algebraically',
      'Find pairs of numbers that satisfy equations'
    ],
    prerequisites: ['KS2-M-A2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 1, y: 4 }
  },
  {
    id: 'KS2-M-G3',
    subject: 'maths',
    keyStage: 2,
    year: 5,
    strand: 'geometry',
    title: 'Properties and Angles',
    name: 'Properties and Angles',
    ageRange: [7, 11],
    objectives: [
      'Identify 3D shapes from 2D representations',
      'Know angles are measured in degrees',
      'Estimate and compare acute, obtuse and reflex angles',
      'Draw and measure angles in degrees'
    ],
    prerequisites: ['KS2-M-G2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 2, y: 4 }
  },
  {
    id: 'KS2-M-M3',
    subject: 'maths',
    keyStage: 2,
    year: 5,
    strand: 'measurement',
    title: 'Area and Volume',
    name: 'Area and Volume',
    ageRange: [7, 11],
    objectives: [
      'Convert between different units of metric measure',
      'Calculate perimeter and area of rectangles',
      'Estimate volume and capacity',
      'Solve problems involving converting units of time'
    ],
    prerequisites: ['KS2-M-M2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 3, y: 4 }
  },
  {
    id: 'KS2-M-S3',
    subject: 'maths',
    keyStage: 2,
    year: 5,
    strand: 'statistics',
    title: 'Complex Data',
    name: 'Complex Data',
    ageRange: [7, 11],
    objectives: [
      'Solve comparison, sum and difference problems',
      'Complete, read and interpret information in tables',
      'Complete, read and interpret information in timetables',
      'Begin to decide which representations of data are most appropriate'
    ],
    prerequisites: ['KS2-M-S2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 4, y: 4 }
  },
  {
    id: 'KS2-M-R3',
    subject: 'maths',
    keyStage: 2,
    year: 5,
    strand: 'ratio',
    title: 'Percentages Introduction',
    name: 'Percentages Introduction',
    ageRange: [7, 11],
    objectives: [
      'Recognize and use thousandths',
      'Recognize percentage symbol',
      'Understand percentages as fractions of 100',
      'Write percentages as fractions and decimals'
    ],
    prerequisites: ['KS2-M-R2'],
    difficulty: 5,
    level: 'Intermediate-3',
    position: { x: 5, y: 4 }
  },

  // Year 6
  {
    id: 'KS2-M-N4',
    subject: 'maths',
    keyStage: 2,
    year: 6,
    strand: 'number',
    title: 'Advanced Number Theory',
    name: 'Advanced Number Theory',
    ageRange: [7, 11],
    objectives: [
      'Read, write, order and compare numbers up to 10,000,000',
      'Round any whole number to a required degree of accuracy',
      'Use negative numbers in context',
      'Solve number and practical problems'
    ],
    prerequisites: ['KS2-M-N3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 0, y: 5 }
  },
  {
    id: 'KS2-M-A4',
    subject: 'maths',
    keyStage: 2,
    year: 6,
    strand: 'algebra',
    title: 'Advanced Algebra',
    name: 'Advanced Algebra',
    ageRange: [7, 11],
    objectives: [
      'Use simple formulae',
      'Generate and describe linear number sequences',
      'Express missing number problems algebraically',
      'Find pairs of numbers that satisfy an equation'
    ],
    prerequisites: ['KS2-M-A3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 1, y: 5 }
  },
  {
    id: 'KS2-M-G4',
    subject: 'maths',
    keyStage: 2,
    year: 6,
    strand: 'geometry',
    title: 'Advanced Geometry',
    name: 'Advanced Geometry',
    ageRange: [7, 11],
    objectives: [
      'Draw 2D shapes using given dimensions and angles',
      'Recognize and build simple 3D shapes',
      'Find unknown angles in triangles, quadrilaterals, and regular polygons',
      'Illustrate and name parts of circles'
    ],
    prerequisites: ['KS2-M-G3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 2, y: 5 }
  },
  {
    id: 'KS2-M-M4',
    subject: 'maths',
    keyStage: 2,
    year: 6,
    strand: 'measurement',
    title: 'Complex Measurement',
    name: 'Complex Measurement',
    ageRange: [7, 11],
    objectives: [
      'Solve problems involving the calculation of percentages',
      'Convert between miles and kilometers',
      'Calculate area of parallelograms and triangles',
      'Calculate, estimate and compare volume of cubes and cuboids'
    ],
    prerequisites: ['KS2-M-M3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 3, y: 5 }
  },
  {
    id: 'KS2-M-S4',
    subject: 'maths',
    keyStage: 2,
    year: 6,
    strand: 'statistics',
    title: 'Advanced Statistics',
    name: 'Advanced Statistics',
    ageRange: [7, 11],
    objectives: [
      'Interpret and construct pie charts',
      'Interpret and construct line graphs',
      'Calculate and interpret the mean as an average',
      'Use appropriate methods to record data'
    ],
    prerequisites: ['KS2-M-S3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 4, y: 5 }
  },
  {
    id: 'KS2-M-R4',
    subject: 'maths',
    keyStage: 2,
    year: 6,
    strand: 'ratio',
    title: 'Ratio and Proportion',
    name: 'Ratio and Proportion',
    ageRange: [7, 11],
    objectives: [
      'Solve problems involving ratio and proportion',
      'Solve problems involving similar shapes',
      'Solve problems involving scale factors',
      'Link percentages, fractions and decimals'
    ],
    prerequisites: ['KS2-M-R3'],
    difficulty: 6,
    level: 'Intermediate-4',
    position: { x: 5, y: 5 }
  },

  // === KEY STAGE 3 (Years 7-9) ===
  // Year 7
  {
    id: 'KS3-M-N1',
    subject: 'maths',
    keyStage: 3,
    year: 7,
    strand: 'number',
    title: 'Number Systems',
    name: 'Number Systems',
    ageRange: [11, 14],
    objectives: [
      'Understand and use place value',
      'Work with powers and roots',
      'Use standard form for large numbers',
      'Apply order of operations'
    ],
    prerequisites: ['KS2-M-N4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 0, y: 6 }
  },
  {
    id: 'KS3-M-A1',
    subject: 'maths',
    keyStage: 3,
    year: 7,
    strand: 'algebra',
    title: 'Algebraic Expressions',
    name: 'Algebraic Expressions',
    ageRange: [11, 14],
    objectives: [
      'Use and interpret algebraic notation',
      'Simplify and manipulate algebraic expressions',
      'Substitute numerical values into formulae',
      'Understand and use the concepts of expressions and equations'
    ],
    prerequisites: ['KS2-M-A4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 1, y: 6 }
  },
  {
    id: 'KS3-M-G1',
    subject: 'maths',
    keyStage: 3,
    year: 7,
    strand: 'geometry',
    title: 'Geometric Reasoning',
    name: 'Geometric Reasoning',
    ageRange: [11, 14],
    objectives: [
      'Draw and measure line segments and angles',
      'Identify properties of angles at a point',
      'Understand and use parallel lines',
      'Derive and use the sum of angles in a triangle'
    ],
    prerequisites: ['KS2-M-G4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 2, y: 6 }
  },
  {
    id: 'KS3-M-M1',
    subject: 'maths',
    keyStage: 3,
    year: 7,
    strand: 'measurement',
    title: 'Advanced Measurement',
    name: 'Advanced Measurement',
    ageRange: [11, 14],
    objectives: [
      'Derive and apply formulae for area and perimeter',
      'Calculate surface area of cubes and cuboids',
      'Use standard units of measure',
      'Convert between related compound units'
    ],
    prerequisites: ['KS2-M-M4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 3, y: 6 }
  },
  {
    id: 'KS3-M-S1',
    subject: 'maths',
    keyStage: 3,
    year: 7,
    strand: 'statistics',
    title: 'Statistical Analysis',
    name: 'Statistical Analysis',
    ageRange: [11, 14],
    objectives: [
      'Use appropriate data collection methods',
      'Construct and interpret frequency tables',
      'Calculate and use the mean, median and mode',
      'Construct and interpret bar charts and pie charts'
    ],
    prerequisites: ['KS2-M-S4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 4, y: 6 }
  },
  {
    id: 'KS3-M-R1',
    subject: 'maths',
    keyStage: 3,
    year: 7,
    strand: 'ratio',
    title: 'Advanced Ratio',
    name: 'Advanced Ratio',
    ageRange: [11, 14],
    objectives: [
      'Use ratio notation',
      'Reduce ratios to simplest form',
      'Divide quantities in a given ratio',
      'Understand and use proportion'
    ],
    prerequisites: ['KS2-M-R4'],
    difficulty: 7,
    level: 'Advanced-1',
    position: { x: 5, y: 6 }
  },

  // Year 8
  {
    id: 'KS3-M-N2',
    subject: 'maths',
    keyStage: 3,
    year: 8,
    strand: 'number',
    title: 'Advanced Number Theory',
    name: 'Advanced Number Theory',
    ageRange: [11, 14],
    objectives: [
      'Work with prime numbers and prime factorization',
      'Use powers and roots in calculations',
      'Calculate with standard form',
      'Understand and use surds'
    ],
    prerequisites: ['KS3-M-N1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 0, y: 7 }
  },
  {
    id: 'KS3-M-A2',
    subject: 'maths',
    keyStage: 3,
    year: 8,
    strand: 'algebra',
    title: 'Complex Algebra',
    name: 'Complex Algebra',
    ageRange: [11, 14],
    objectives: [
      'Solve linear equations with one unknown',
      'Plot graphs of linear functions',
      'Recognize and use sequences',
      'Use algebraic methods to solve problems'
    ],
    prerequisites: ['KS3-M-A1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 1, y: 7 }
  },
  {
    id: 'KS3-M-G2',
    subject: 'maths',
    keyStage: 3,
    year: 8,
    strand: 'geometry',
    title: 'Complex Geometry',
    name: 'Complex Geometry',
    ageRange: [11, 14],
    objectives: [
      'Use standard conventions for labeling sides and angles',
      'Understand and use congruence and similarity',
      'Apply angle facts, triangle congruence, similarity',
      'Calculate areas of triangles and parallelograms'
    ],
    prerequisites: ['KS3-M-G1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 2, y: 7 }
  },
  {
    id: 'KS3-M-M2',
    subject: 'maths',
    keyStage: 3,
    year: 8,
    strand: 'measurement',
    title: 'Complex Measurement',
    name: 'Complex Measurement',
    ageRange: [11, 14],
    objectives: [
      'Calculate surface area of right prisms',
      'Calculate volume of cubes and cuboids',
      'Understand and use compound measures',
      'Solve problems involving measurement'
    ],
    prerequisites: ['KS3-M-M1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 3, y: 7 }
  },
  {
    id: 'KS3-M-S2',
    subject: 'maths',
    keyStage: 3,
    year: 8,
    strand: 'statistics',
    title: 'Complex Statistics',
    name: 'Complex Statistics',
    ageRange: [11, 14],
    objectives: [
      'Describe, interpret and compare distributions',
      'Construct and interpret scatter graphs',
      'Identify different types of correlation',
      'Calculate and use statistical measures'
    ],
    prerequisites: ['KS3-M-S1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 4, y: 7 }
  },
  {
    id: 'KS3-M-R2',
    subject: 'maths',
    keyStage: 3,
    year: 8,
    strand: 'ratio',
    title: 'Complex Ratio',
    name: 'Complex Ratio',
    ageRange: [11, 14],
    objectives: [
      'Solve problems involving direct proportion',
      'Use scale factors, scale diagrams and maps',
      'Express relationships algebraically',
      'Solve problems involving percentage change'
    ],
    prerequisites: ['KS3-M-R1'],
    difficulty: 8,
    level: 'Advanced-2',
    position: { x: 5, y: 7 }
  },

  // Year 9
  {
    id: 'KS3-M-N3',
    subject: 'maths',
    keyStage: 3,
    year: 9,
    strand: 'number',
    title: 'Complex Number Theory',
    name: 'Complex Number Theory',
    ageRange: [11, 14],
    objectives: [
      'Work with irrational numbers',
      'Understand and use rational and real numbers',
      'Calculate with bounds',
      'Use reciprocals in complex calculations'
    ],
    prerequisites: ['KS3-M-N2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 0, y: 8 }
  },
  {
    id: 'KS3-M-A3',
    subject: 'maths',
    keyStage: 3,
    year: 9,
    strand: 'algebra',
    title: 'Advanced Algebraic Methods',
    name: 'Advanced Algebraic Methods',
    ageRange: [11, 14],
    objectives: [
      'Solve simultaneous equations',
      'Plot and interpret quadratic functions',
      'Factor quadratic expressions',
      'Use iterative processes to solve equations'
    ],
    prerequisites: ['KS3-M-A2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 1, y: 8 }
  },
  {
    id: 'KS3-M-G3',
    subject: 'maths',
    keyStage: 3,
    year: 9,
    strand: 'geometry',
    title: 'Advanced Geometry',
    name: 'Advanced Geometry',
    ageRange: [11, 14],
    objectives: [
      'Use trigonometric ratios in right triangles',
      'Calculate surface area and volume of spheres, pyramids, cones',
      'Construct and interpret plans and elevations',
      'Use vectors to describe translations'
    ],
    prerequisites: ['KS3-M-G2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 2, y: 8 }
  },
  {
    id: 'KS3-M-M3',
    subject: 'maths',
    keyStage: 3,
    year: 9,
    strand: 'measurement',
    title: 'Advanced Measurement Applications',
    name: 'Advanced Measurement Applications',
    ageRange: [11, 14],
    objectives: [
      'Solve problems involving similar shapes',
      'Calculate with compound measures',
      'Use Pythagoras theorem to solve problems',
      'Convert between different units in real-world contexts'
    ],
    prerequisites: ['KS3-M-M2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 3, y: 8 }
  },
  {
    id: 'KS3-M-S3',
    subject: 'maths',
    keyStage: 3,
    year: 9,
    strand: 'statistics',
    title: 'Advanced Statistics',
    name: 'Advanced Statistics',
    ageRange: [11, 14],
    objectives: [
      'Use and interpret scatter graphs',
      'Calculate and interpret correlation',
      'Construct and interpret time series graphs',
      'Use statistical sampling techniques'
    ],
    prerequisites: ['KS3-M-S2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 4, y: 8 }
  },
  {
    id: 'KS3-M-R3',
    subject: 'maths',
    keyStage: 3,
    year: 9,
    strand: 'ratio',
    title: 'Advanced Proportional Reasoning',
    name: 'Advanced Proportional Reasoning',
    ageRange: [11, 14],
    objectives: [
      'Solve problems involving direct and inverse proportion',
      'Use compound units such as speed, rates of pay, unit pricing',
      'Compare lengths, areas and volumes using ratio notation',
      'Understand and use compound interest and growth'
    ],
    prerequisites: ['KS3-M-R2'],
    difficulty: 9,
    level: 'Advanced-3',
    position: { x: 5, y: 8 }
  },

  // === KEY STAGE 4 (Years 10-11) ===
  // Year 10
  {
    id: 'KS4-M-N1',
    subject: 'maths',
    keyStage: 4,
    year: 10,
    strand: 'number',
    title: 'GCSE Number Skills',
    name: 'GCSE Number Skills',
    ageRange: [14, 16],
    objectives: [
      'Work with surds and indices',
      'Calculate with standard form',
      'Use upper and lower bounds',
      'Apply systematic listing strategies'
    ],
    prerequisites: ['KS3-M-N3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 0, y: 9 }
  },
  {
    id: 'KS4-M-A1',
    subject: 'maths',
    keyStage: 4,
    year: 10,
    strand: 'algebra',
    title: 'GCSE Algebra',
    name: 'GCSE Algebra',
    ageRange: [14, 16],
    objectives: [
      'Solve quadratic equations algebraically',
      'Use graphs of quadratic functions',
      'Solve simultaneous equations',
      'Use algebraic methods to solve problems'
    ],
    prerequisites: ['KS3-M-A3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 1, y: 9 }
  },
  {
    id: 'KS4-M-G1',
    subject: 'maths',
    keyStage: 4,
    year: 10,
    strand: 'geometry',
    title: 'GCSE Geometry',
    name: 'GCSE Geometry',
    ageRange: [14, 16],
    objectives: [
      'Apply circle theorems',
      'Use trigonometric ratios and Pythagoras theorem',
      'Calculate with vectors',
      'Solve geometric problems on coordinate axes'
    ],
    prerequisites: ['KS3-M-G3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 2, y: 9 }
  },
  {
    id: 'KS4-M-M1',
    subject: 'maths',
    keyStage: 4,
    year: 10,
    strand: 'measurement',
    title: 'GCSE Measurement',
    name: 'GCSE Measurement',
    ageRange: [14, 16],
    objectives: [
      'Calculate arc lengths, angles and areas of sectors',
      'Apply trigonometry to find angles and lengths',
      'Calculate surface areas and volumes of complex shapes',
      'Solve problems involving similar shapes'
    ],
    prerequisites: ['KS3-M-M3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 3, y: 9 }
  },
  {
    id: 'KS4-M-S1',
    subject: 'maths',
    keyStage: 4,
    year: 10,
    strand: 'statistics',
    title: 'GCSE Statistics',
    name: 'GCSE Statistics',
    ageRange: [14, 16],
    objectives: [
      'Interpret and construct cumulative frequency graphs',
      'Calculate and interpret measures of spread',
      'Use and interpret histograms',
      'Calculate conditional probabilities'
    ],
    prerequisites: ['KS3-M-S3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 4, y: 9 }
  },
  {
    id: 'KS4-M-R1',
    subject: 'maths',
    keyStage: 4,
    year: 10,
    strand: 'ratio',
    title: 'GCSE Proportion',
    name: 'GCSE Proportion',
    ageRange: [14, 16],
    objectives: [
      'Solve problems involving direct and inverse proportion',
      'Use compound units in algebraic contexts',
      'Convert between related compound units',
      'Set up, solve and interpret growth and decay problems'
    ],
    prerequisites: ['KS3-M-R3'],
    difficulty: 10,
    level: 'Advanced-4',
    position: { x: 5, y: 9 }
  },

  // Year 11
  {
    id: 'KS4-M-N2',
    subject: 'maths',
    keyStage: 4,
    year: 11,
    strand: 'number',
    title: 'Advanced GCSE Number Theory',
    name: 'Advanced GCSE Number Theory',
    ageRange: [14, 16],
    objectives: [
      'Work with complex calculations involving surds',
      'Use iterative methods to solve numerical problems',
      'Work with reciprocal and exponential graphs',
      'Solve complex problems involving number'
    ],
    prerequisites: ['KS4-M-N1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 0, y: 10 }
  },
  {
    id: 'KS4-M-A2',
    subject: 'maths',
    keyStage: 4,
    year: 11,
    strand: 'algebra',
    title: 'Advanced GCSE Algebra',
    name: 'Advanced GCSE Algebra',
    ageRange: [14, 16],
    objectives: [
      'Solve quadratic equations using the quadratic formula',
      'Work with functions and their graphs',
      'Use algebraic fractions',
      'Solve problems involving algebraic proof'
    ],
    prerequisites: ['KS4-M-A1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 1, y: 10 }
  },
  {
    id: 'KS4-M-G2',
    subject: 'maths',
    keyStage: 4,
    year: 11,
    strand: 'geometry',
    title: 'Advanced Geometry',
    name: 'Advanced Geometry',
    ageRange: [14, 16],
    objectives: [
      'Draw 2D shapes using given dimensions and angles',
      'Recognize and build simple 3D shapes',
      'Find unknown angles in triangles, quadrilaterals, and regular polygons',
      'Illustrate and name parts of circles'
    ],
    prerequisites: ['KS4-M-G1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 2, y: 10 }
  },
  {
    id: 'KS4-M-M2',
    subject: 'maths',
    keyStage: 4,
    year: 11,
    strand: 'measurement',
    title: 'Advanced Measurement',
    name: 'Advanced Measurement',
    ageRange: [14, 16],
    objectives: [
      'Solve problems involving the calculation of percentages',
      'Convert between miles and kilometers',
      'Calculate area of parallelograms and triangles',
      'Calculate, estimate and compare volume of cubes and cuboids'
    ],
    prerequisites: ['KS4-M-M1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 3, y: 10 }
  },
  {
    id: 'KS4-M-S2',
    subject: 'maths',
    keyStage: 4,
    year: 11,
    strand: 'statistics',
    title: 'Advanced Statistics',
    name: 'Advanced Statistics',
    ageRange: [14, 16],
    objectives: [
      'Interpret and construct pie charts',
      'Interpret and construct line graphs',
      'Calculate and interpret the mean as an average',
      'Use appropriate methods to record data'
    ],
    prerequisites: ['KS4-M-S1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 4, y: 10 }
  },
  {
    id: 'KS4-M-R2',
    subject: 'maths',
    keyStage: 4,
    year: 11,
    strand: 'ratio',
    title: 'Advanced Proportional Reasoning',
    name: 'Advanced Proportional Reasoning',
    ageRange: [14, 16],
    objectives: [
      'Solve problems involving direct and inverse proportion',
      'Use compound units such as speed, rates of pay, unit pricing',
      'Compare lengths, areas and volumes using ratio notation',
      'Understand and use compound interest and growth'
    ],
    prerequisites: ['KS4-M-R1'],
    difficulty: 11,
    level: 'Advanced-5',
    position: { x: 5, y: 10 }
  }
];