interface LearningNode {
  id: string;
  difficulty: number;
  prerequisites: string[];
  estimatedTime: number;
  completionRate: number;
  averageAttempts: number;
}

interface UserMetrics {
  skillLevels: Record<string, number>;
  learningSpeed: number;
  preferredDifficulty: number;
  availableTime: number;
  completedNodes: string[];
}

export class LearningPathOptimizer {
  private static instance: LearningPathOptimizer;

  private constructor() {}

  static getInstance(): LearningPathOptimizer {
    if (!LearningPathOptimizer.instance) {
      LearningPathOptimizer.instance = new LearningPathOptimizer();
    }
    return LearningPathOptimizer.instance;
  }

  async optimizePath(
    nodes: LearningNode[],
    userMetrics: UserMetrics
  ): Promise<{
    optimizedPath: string[];
    estimatedCompletion: number;
    difficulty: number;
  }> {
    // Create a graph representation
    const graph = this.createDependencyGraph(nodes);
    
    // Calculate node weights based on user metrics
    const weights = this.calculateNodeWeights(nodes, userMetrics);
    
    // Find optimal path using modified Dijkstra's algorithm
    const path = this.findOptimalPath(graph, weights, userMetrics);
    
    // Calculate metrics for the optimized path
    const pathMetrics = this.calculatePathMetrics(path, nodes, userMetrics);
    
    return {
      optimizedPath: path,
      estimatedCompletion: pathMetrics.estimatedTime,
      difficulty: pathMetrics.averageDifficulty
    };
  }

  private createDependencyGraph(
    nodes: LearningNode[]
  ): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();
    
    nodes.forEach(node => {
      graph.set(node.id, new Set(node.prerequisites));
    });
    
    return graph;
  }

  private calculateNodeWeights(
    nodes: LearningNode[],
    metrics: UserMetrics
  ): Map<string, number> {
    const weights = new Map<string, number>();
    
    nodes.forEach(node => {
      let weight = 1;
      
      // Adjust based on difficulty match
      const difficultyDiff = Math.abs(node.difficulty - metrics.preferredDifficulty);
      weight *= 1 + (difficultyDiff * 0.1);
      
      // Adjust based on completion rate
      weight *= 1 + ((1 - node.completionRate) * 0.2);
      
      // Adjust based on time constraints
      if (node.estimatedTime > metrics.availableTime) {
        weight *= 1.5;
      }
      
      weights.set(node.id, weight);
    });
    
    return weights;
  }

  private findOptimalPath(
    graph: Map<string, Set<string>>,
    weights: Map<string, number>,
    metrics: UserMetrics
  ): string[] {
    const visited = new Set<string>();
    const path: string[] = [];
    
    while (visited.size < graph.size) {
      let bestNode: string | null = null;
      let bestWeight = Infinity;
      
      for (const [nodeId, prerequisites] of graph.entries()) {
        if (visited.has(nodeId)) continue;
        
        // Check if all prerequisites are met
        const prerequisitesMet = Array.from(prerequisites)
          .every(prereq => visited.has(prereq));
        
        if (prerequisitesMet) {
          const weight = weights.get(nodeId) || Infinity;
          if (weight < bestWeight) {
            bestWeight = weight;
            bestNode = nodeId;
          }
        }
      }
      
      if (bestNode) {
        path.push(bestNode);
        visited.add(bestNode);
      } else {
        break; // No valid nodes found
      }
    }
    
    return path;
  }

  private calculatePathMetrics(
    path: string[],
    nodes: LearningNode[],
    metrics: UserMetrics
  ): {
    estimatedTime: number;
    averageDifficulty: number;
  } {
    const pathNodes = path.map(id => nodes.find(n => n.id === id)!);
    
    const totalTime = pathNodes.reduce(
      (sum, node) => sum + (node.estimatedTime / metrics.learningSpeed),
      0
    );
    
    const avgDifficulty = pathNodes.reduce(
      (sum, node) => sum + node.difficulty,
      0
    ) / pathNodes.length;
    
    return {
      estimatedTime: totalTime,
      averageDifficulty: avgDifficulty
    };
  }
}

export const useLearningPathOptimizer = () => {
  const optimizer = LearningPathOptimizer.getInstance();
  return {
    optimizePath: optimizer.optimizePath.bind(optimizer)
  };
}; 