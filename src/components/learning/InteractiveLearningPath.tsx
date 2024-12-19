import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LearningPathVisualizer } from './LearningPathVisualizer';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface LearningNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  prerequisites: string[];
  type: 'topic' | 'assessment' | 'project';
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number;
  content?: {
    type: string;
    url: string;
  };
}

interface InteractivePathProps {
  path: {
    id: string;
    title: string;
    description: string;
    nodes: LearningNode[];
    connections: [string, string][];
  };
  onNodeComplete: (nodeId: string) => Promise<void>;
}

export const InteractiveLearningPath: React.FC<InteractivePathProps> = ({
  path,
  onNodeComplete
}) => {
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleNodeSelect = (nodeId: string) => {
    const node = path.nodes.find(n => n.id === nodeId);
    if (node && node.status !== 'locked') {
      setSelectedNode(node);
      setIsPreviewOpen(true);
    }
  };

  const handleStartNode = async () => {
    if (selectedNode) {
      // Update node status to in-progress
      // Redirect to content or show modal
    }
  };

  return (
    <div className="space-y-6">
      <LearningPathVisualizer
        path={path}
        currentNodeId={selectedNode?.id}
        onNodeSelect={handleNodeSelect}
      />

      {/* Node Preview */}
      <motion.div
        initial={false}
        animate={isPreviewOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, height: 'auto' },
          closed: { opacity: 0, height: 0 }
        }}
      >
        {selectedNode && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{selectedNode.title}</h3>
                  <p className="mt-1 text-gray-600">{selectedNode.description}</p>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Difficulty: {'⭐'.repeat(selectedNode.difficulty)}</span>
                <span>•</span>
                <span>{selectedNode.estimatedTime} mins</span>
                <span>•</span>
                <span>{selectedNode.type}</span>
              </div>

              {selectedNode.prerequisites.length > 0 && (
                <div>
                  <h4 className="font-medium">Prerequisites</h4>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                    {selectedNode.prerequisites.map(prereq => (
                      <li key={prereq}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {selectedNode.status === 'completed' ? (
                  <Button variant="secondary">Review</Button>
                ) : (
                  <Button
                    onClick={handleStartNode}
                    disabled={selectedNode.status === 'locked'}
                  >
                    {selectedNode.status === 'in-progress' ? 'Continue' : 'Start'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}; 