export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading your next question...</p>
    </div>
  );
} 