export const mathsTemplates = {
  numberAndPlace: [
    {
      type: 'placeValue',
      template: 'What is the value of the {{position}} digit in {{number}}?',
      variables: [
        {
          name: 'number',
          type: 'number',
          range: { min: 100, max: 999999 }
        },
        {
          name: 'position',
          type: 'string',
          options: ['ones', 'tens', 'hundreds', 'thousands']
        }
      ],
      validationRules: [
        {
          type: 'exact',
          value: '{{answer}}',
          errorMessage: 'Incorrect place value identification'
        }
      ]
    }
  ],
  
  fractions: [
    {
      type: 'simplify',
      template: 'Simplify the fraction {{fraction}}',
      variables: [
        {
          name: 'fraction',
          type: 'fraction',
          constraints: ['reducible', 'proper']
        }
      ],
      validationRules: [
        {
          type: 'exact',
          value: '{{simplified}}',
          errorMessage: 'Incorrect simplification'
        }
      ]
    }
  ]
};

export const englishTemplates = {
  reading: [
    {
      type: 'comprehension',
      template: `Read the following passage:
                {{passage}}
                
                Question: {{question}}`,
      variables: [
        {
          name: 'passage',
          type: 'text',
          constraints: ['age-appropriate', 'length-200-300']
        },
        {
          name: 'question',
          type: 'comprehension-question',
          constraints: ['inference', 'main-idea', 'detail']
        }
      ],
      validationRules: [
        {
          type: 'rubric',
          value: ['relevance', 'evidence', 'clarity'],
          errorMessage: 'Response needs improvement'
        }
      ]
    }
  ],
  
  writing: [
    {
      type: 'sentence-structure',
      template: 'Combine these sentences into one well-written sentence: {{sentences}}',
      variables: [
        {
          name: 'sentences',
          type: 'array',
          constraints: ['simple-sentences', 'related-content']
        }
      ],
      validationRules: [
        {
          type: 'grammar',
          value: ['conjunction-usage', 'punctuation', 'clarity'],
          errorMessage: 'Sentence structure needs improvement'
        }
      ]
    }
  ]
}; 