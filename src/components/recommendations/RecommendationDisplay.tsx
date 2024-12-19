import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  relevanceScore: number;
}

interface RecommendationDisplayProps {
  recommendations: Recommendation[];
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function RecommendationDisplay({ 
  recommendations, 
  onAccept, 
  onReject 
}: RecommendationDisplayProps) {
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const handleAccept = (id: string) => {
    const newAccepted = new Set(acceptedIds);
    newAccepted.add(id);
    setAcceptedIds(newAccepted);
    onAccept?.(id);
  };

  const handleReject = (id: string) => {
    const newRejected = new Set(rejectedIds);
    newRejected.add(id);
    setRejectedIds(newRejected);
    onReject?.(id);
  };

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div 
          key={rec.id} 
          className="p-4 border rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{rec.title}</h3>
              <p className="text-gray-600">{rec.description}</p>
              <div className="mt-2 space-x-2">
                {rec.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-x-2">
              {!acceptedIds.has(rec.id) && !rejectedIds.has(rec.id) && (
                <>
                  <Button 
                    variant="secondary"
                    onClick={() => handleAccept(rec.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => handleReject(rec.id)}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Relevance Score: {(rec.relevanceScore * 100).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}