import { Adaptation } from '@/types/adaptive';
import { useState, useEffect } from 'react';
import { AdaptiveLearningService } from '@/services/adaptive/AdaptiveLearningService';

export function AdaptiveLearningPanel() {
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adaptiveService = new AdaptiveLearningService();

  useEffect(() => {
    async function loadAdaptations() {
      try {
        const loadedAdaptations = await adaptiveService.getAdaptations();
        setAdaptations(loadedAdaptations);
        setError(null);
      } catch (err) {
        setError('Failed to load adaptations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAdaptations();
  }, []);

  if (loading) {
    return <div>Loading adaptations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (adaptations.length === 0) {
    return <div>No adaptations available.</div>;
  }

  return (
    <div className="adaptive-learning-panel">
      <h2>Learning Adaptations</h2>
      <div className="adaptations-list">
        {adaptations.map((adaptation: Adaptation, index) => (
          <div key={index} className="adaptation-item">
            {adaptation.description}
          </div>
        ))}
      </div>
    </div>
  );
} 