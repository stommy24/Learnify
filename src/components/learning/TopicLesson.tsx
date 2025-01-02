'use client';

import { useState } from 'react';
import { ChevronRight, PlayCircle, BookOpen, PenTool } from 'lucide-react';

interface TopicLessonProps {
  topic: {
    id: string;
    title: string;
    explanation: string;
    examples: {
      id: string;
      content: string;
      solution: string;
    }[];
    demonstration: string;
  };
  onComplete: () => void;
}

export default function TopicLesson({ topic, onComplete }: TopicLessonProps) {
  const [step, setStep] = useState<'explanation' | 'examples' | 'demonstration'>('explanation');
  const [currentExample, setCurrentExample] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['explanation', 'examples', 'demonstration'].map((s) => (
          <div
            key={s}
            className={`flex items-center ${
              step === s ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {s === 'explanation' && <BookOpen className="w-5 h-5 mr-2" />}
            {s === 'examples' && <PenTool className="w-5 h-5 mr-2" />}
            {s === 'demonstration' && <PlayCircle className="w-5 h-5 mr-2" />}
            <span className="capitalize">{s}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {step === 'explanation' && (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">{topic.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: topic.explanation }} />
            <button
              onClick={() => setStep('examples')}
              className="mt-6 flex items-center text-blue-600 hover:text-blue-700"
            >
              Continue to Examples <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}

        {step === 'examples' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Example {currentExample + 1}</h3>
            <div className="prose max-w-none mb-6">
              <div dangerouslySetInnerHTML={{ 
                __html: topic.examples[currentExample].content 
              }} />
            </div>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-blue-600 hover:text-blue-700 mb-4"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>

            {showSolution && (
              <div className="bg-blue-50 p-4 rounded-lg prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: topic.examples[currentExample].solution 
                }} />
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setShowSolution(false);
                  setCurrentExample(Math.max(0, currentExample - 1));
                }}
                disabled={currentExample === 0}
                className="text-gray-600 hover:text-gray-700 disabled:opacity-50"
              >
                Previous Example
              </button>
              <button
                onClick={() => {
                  if (currentExample === topic.examples.length - 1) {
                    setStep('demonstration');
                  } else {
                    setShowSolution(false);
                    setCurrentExample(currentExample + 1);
                  }
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                {currentExample === topic.examples.length - 1 
                  ? 'Continue to Demonstration' 
                  : 'Next Example'
                }
              </button>
            </div>
          </div>
        )}

        {step === 'demonstration' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Interactive Demonstration</h3>
            <div className="prose max-w-none mb-6">
              <div dangerouslySetInnerHTML={{ __html: topic.demonstration }} />
            </div>
            <button
              onClick={onComplete}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Complete Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 