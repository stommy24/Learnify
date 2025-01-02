'use client';

import { useState } from 'react';
import { MathComponent } from 'mathjax-react';

interface EquationBuilderProps {
  question: any;
  onAnswer: (equation: string) => void;
  value?: string;
  isMobile: boolean;
}

export default function EquationBuilder({
  question,
  onAnswer,
  value,
  isMobile
}: EquationBuilderProps) {
  const [equation, setEquation] = useState(value || '');
  const [preview, setPreview] = useState(true);

  const symbols = [
    '+', '-', '×', '÷', '=',
    '(', ')', '^', '√', 'π',
    '∫', '∑', '∏', '∞', '≠',
    '≤', '≥', '±', '∂', '∇'
  ];

  const handleSymbolClick = (symbol: string) => {
    const newEquation = equation + symbol;
    setEquation(newEquation);
    onAnswer(newEquation);
  };

  return (
    <div className="space-y-4">
      {/* Input Area */}
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={equation}
          onChange={(e) => {
            setEquation(e.target.value);
            onAnswer(e.target.value);
          }}
          className="p-2 border rounded"
          placeholder="Type or use symbols below"
        />
        
        {preview && equation && (
          <div className="p-2 bg-gray-50 rounded">
            <MathComponent tex={equation} />
          </div>
        )}
      </div>

      {/* Symbol Palette */}
      <div className="grid grid-cols-5 gap-2">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            onClick={() => handleSymbolClick(symbol)}
            className="p-2 border rounded hover:bg-gray-100"
          >
            {symbol}
          </button>
        ))}
      </div>

      {/* Preview Toggle */}
      <button
        onClick={() => setPreview(!preview)}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        {preview ? 'Hide Preview' : 'Show Preview'}
      </button>
    </div>
  );
} 