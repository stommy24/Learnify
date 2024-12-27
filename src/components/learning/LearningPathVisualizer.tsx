import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';

interface LearningNode {
  id: string;
  title: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  prerequisites: string[];
  type: 'topic' | 'assessment' | 'project';
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  nodes: LearningNode[];
  connections: [string, string][]; // [fromId, toId]
}

export const LearningPathVisualizer: React.FC<{
  path: LearningPath;
  currentNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
}> = ({ path, currentNodeId, onNodeSelect }) => {
  const getNodeColor = (status: LearningNode['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-500';
      case 'in-progress': return 'bg-blue-100 border-blue-500';
      case 'available': return 'bg-white border-gray-300';
      case 'locked': return 'bg-gray-100 border-gray-300';
    }
  };

  const getNodeIcon = (type: LearningNode['type']) => {
    switch (type) {
      case 'topic': return '📚';
      case 'assessment': return '✍️';
      case 'project': return '🎯';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{path.title}</h3>
          <p className="text-sm text-gray-600">{path.description}</p>
        </div>

        <div className="relative">
          {/* Draw connections between nodes */}
          <svg className="absolute inset-0 pointer-events-none">
            {path.connections.map(([from, to], index) => {
              // Calculate line coordinates based on node positions
              return (
                <line
                  key={index}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="0"
                  className="stroke-gray-300"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* Render nodes */}
          <div className="grid gap-4">
            {path.nodes.map(node => (
              <motion.div
                key={node.id}
                whileHover={{ scale: 1.02 }}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer
                  ${getNodeColor(node.status)}
                  ${currentNodeId === node.id ? 'ring-2 ring-primary-500' : ''}
                `}
                onClick={() => onNodeSelect?.(node.id)}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getNodeIcon(node.type)}</span>
                  <div>
                    <h4 className="font-medium">{node.title}</h4>
                    <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                      <span>Difficulty: {'⭐'.repeat(node.difficulty)}</span>
                      <span>•</span>
                      <span>{node.estimatedTime} mins</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}; 
