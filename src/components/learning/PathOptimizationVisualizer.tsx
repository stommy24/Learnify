import React from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface GraphNode {
  id: string;
  name: string;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface PathOptimizationVisualizerProps {
  data: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
}

const CustomNode = ({ data }: NodeProps) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
    <div className="flex">
      <div className="ml-2">
        <div className="text-lg font-bold">{data.name}</div>
      </div>
    </div>
    <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
    <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
  </div>
);

const nodeTypes = {
  custom: CustomNode,
};

export function PathOptimizationVisualizer({ data }: PathOptimizationVisualizerProps) {
  // Transform data to match ReactFlow format
  const nodes: Node[] = data.nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    position: { x: 0, y: 0 }, // You'll need to calculate positions or use a layout algorithm
    data: { name: node.name, color: node.color },
  }));

  const edges: Edge[] = data.links.map((link) => ({
    id: `${link.source}-${link.target}`,
    source: link.source,
    target: link.target,
    style: { stroke: link.value > 0.5 ? 'red' : 'blue' },
  }));

  return (
    <div className="w-full h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
