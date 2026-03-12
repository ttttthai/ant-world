import { useRef, useCallback } from 'react';
import { useAntSimulation } from '../hooks/useAntSimulation';
import './AntCanvas.css';

export default function AntCanvas({ antCount = 35 }) {
  const canvasRef = useRef(null);
  const { addPheromone } = useAntSimulation(canvasRef, antCount);

  const handleMouseMove = useCallback((e) => {
    if (e.buttons === 1 || e.type === 'click') {
      addPheromone(e.clientX, e.clientY);
    }
  }, [addPheromone]);

  return (
    <canvas
      ref={canvasRef}
      className="ant-canvas"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    />
  );
}
