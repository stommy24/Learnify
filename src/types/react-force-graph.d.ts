declare module 'react-force-graph' {
  import { Component } from 'react';

  interface GraphData {
    nodes: Array<{
      id: string;
      [key: string]: any;
    }>;
    links: Array<{
      source: string;
      target: string;
      [key: string]: any;
    }>;
  }

  interface ForceGraphProps {
    graphData: GraphData;
    nodeLabel?: string | ((node: any) => string);
    nodeColor?: string | ((node: any) => string);
    nodeVal?: number | ((node: any) => number);
    linkColor?: string | ((link: any) => string);
    linkWidth?: number | ((link: any) => number);
    nodeCanvasObject?: (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => void;
    width?: number;
    height?: number;
    backgroundColor?: string;
    [key: string]: any;
  }

  export default class ForceGraph2D extends Component<ForceGraphProps> {}
} 