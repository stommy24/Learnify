'use client';

import React, { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';

type KonvaEvent = Konva.KonvaEventObject<MouseEvent>;

interface Point {
  x: number;
  y: number;
}

interface LineElement {
  points: number[];
}

interface DrawingCanvasProps {
  width: number;
  height: number;
  onComplete: (dataUrl: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  onComplete
}) => {
  const [lines, setLines] = useState<LineElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);

  const handleMouseDown = (e: KonvaEvent) => {
    setIsDrawing(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }
  };

  const handleMouseMove = (e: KonvaEvent) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (point) {
      const lastLine = lines[lines.length - 1];
      if (lastLine) {
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        setLines([...lines.slice(0, -1), lastLine]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL();
      onComplete(dataUrl);
    }
  };

  return (
    <div style={{ width, height }}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onMouseleave={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000"
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}; 