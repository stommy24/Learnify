import { PlacementTestResult } from '@/types/placement';

export interface ResultsSummaryProps {
  testId: string;
  result?: PlacementTestResult;
  onClose?: () => void;
}

export default function ResultsSummary({ testId, result, onClose }: ResultsSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test Results</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-semibold text-lg">Final Level: {result?.finalLevel}</h3>
          <p className="text-gray-600">
            Confidence Score: {result?.confidence ? (result.confidence * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Strong Areas:</h4>
          <ul className="list-disc pl-5">
            {result?.strongAreas.map((area, index) => (
              <li key={index} className="text-green-600">{area}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Areas for Improvement:</h4>
          <ul className="list-disc pl-5">
            {result?.weakAreas.map((area, index) => (
              <li key={index} className="text-orange-600">{area}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Time Performance:</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Average</p>
              <p className="font-medium">{result?.timePerformance.average}s</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fastest</p>
              <p className="font-medium text-green-600">{result?.timePerformance.fastest}s</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Slowest</p>
              <p className="font-medium text-orange-600">{result?.timePerformance.slowest}s</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Recommendations:</h4>
          <ul className="space-y-2">
            {result?.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-700">{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Continue to Dashboard
      </button>
    </div>
  );
} 