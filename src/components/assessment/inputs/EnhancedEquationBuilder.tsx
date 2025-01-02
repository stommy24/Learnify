'use client';

import { useState } from 'react';
import { MathComponent } from 'mathjax-react';

interface EnhancedEquationBuilderProps {
  question: any;
  onAnswer: (equation: string) => void;
  value?: string;
  isMobile: boolean;
}

export default function EnhancedEquationBuilder({
  question,
  onAnswer,
  value,
  isMobile
}: EnhancedEquationBuilderProps) {
  const [equation, setEquation] = useState(value || '');
  const [preview, setPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'calculus'>('basic');

  const symbolSets = {
    basic: [
      { symbol: '+', latex: '+' },
      { symbol: '-', latex: '-' },
      { symbol: '×', latex: '\\times' },
      { symbol: '÷', latex: '\\div' },
      { symbol: '=', latex: '=' },
      { symbol: '(', latex: '(' },
      { symbol: ')', latex: ')' },
      { symbol: '^', latex: '^' },
      { symbol: '√', latex: '\\sqrt{x}' },
      { symbol: 'π', latex: '\\pi' }
    ],
    advanced: [
      { symbol: '∑', latex: '\\sum_{n=1}^{\\infty}' },
      { symbol: '∏', latex: '\\prod_{n=1}^{\\infty}' },
      { symbol: '∫', latex: '\\int_{a}^{b}' },
      { symbol: '≤', latex: '\\leq' },
      { symbol: '≥', latex: '\\geq' },
      { symbol: '≠', latex: '\\neq' },
      { symbol: '±', latex: '\\pm' },
      { symbol: '∞', latex: '\\infty' },
      { symbol: '∂', latex: '\\partial' },
      { symbol: '∇', latex: '\\nabla' }
    ],
    calculus: [
      { symbol: 'lim', latex: '\\lim_{x \\to \\infty}' },
      { symbol: 'd/dx', latex: '\\frac{d}{dx}' },
      { symbol: '∫∫', latex: '\\iint' },
      { symbol: '∫∫∫', latex: '\\iiint' },
      { symbol: '∮', latex: '\\oint' },
      { symbol: 'sin', latex: '\\sin' },
      { symbol: 'cos', latex: '\\cos' },
      { symbol: 'tan', latex: '\\tan' },
      { symbol: 'ln', latex: '\\ln' },
      { symbol: 'log', latex: '\\log' }
    ]
  };

  const templates = [
    { name: 'Fraction', latex: '\\frac{a}{b}' },
    { name: 'Square Root', latex: '\\sqrt{x}' },
    { name: 'Power', latex: 'x^{n}' },
    { name: 'Subscript', latex: 'x_{n}' },
    { name: 'Matrix 2x2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' }
  ];

  const handleSymbolClick = (latex: string) => {
    const newEquation = equation + latex;
    setEquation(newEquation);
    onAnswer(newEquation);
  };

  const handleTemplateClick = (latex: string) => {
    const newEquation = equation + latex;
    setEquation(newEquation);
    onAnswer(newEquation);
  };

  return (
    <div className="space-y-4">
      {/* Input and Preview */}
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={equation}
          onChange={(e) => {
            setEquation(e.target.value);
            onAnswer(e.target.value);
          }}
          className="p-2 border rounded font-mono"
          placeholder="Type LaTeX or use symbols below"
        />
        
        {preview && equation && (
          <div className="p-4 bg-gray-50 rounded">
            <MathComponent tex={equation} />
          </div>
        )}
      </div>

      {/* Symbol Tabs */}
      <div className="border rounded">
        <div className="flex border-b">
          {(['basic', 'advanced', 'calculus'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 p-2 text-sm
                ${activeTab === tab
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-2">
          <div className="grid grid-cols-5 gap-2">
            {symbolSets[activeTab].map(({ symbol, latex }) => (
              <button
                key={symbol}
                onClick={() => handleSymbolClick(latex)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                <MathComponent tex={symbol} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="border rounded p-2">
        <h3 className="text-sm font-semibold mb-2">Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          {templates.map(({ name, latex }) => (
            <button
              key={name}
              onClick={() => handleTemplateClick(latex)}
              className="p-2 border rounded hover:bg-gray-100 text-left"
            >
              <div className="text-sm text-gray-600">{name}</div>
              <MathComponent tex={latex} />
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between">
        <button
          onClick={() => setPreview(!preview)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {preview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button
          onClick={() => setEquation('')}
          className="text-sm text-gray-600 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
} 