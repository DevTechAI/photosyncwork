
import { useRef } from 'react';
import { useWebGL } from './webgl/useWebGL';

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useWebGL(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-4 right-4 pointer-events-none z-10 rounded-lg shadow-lg"
      style={{ 
        width: '10vw',
        height: '10vh',
        minWidth: '120px',
        minHeight: '80px',
        background: 'transparent'
      }}
    />
  );
}
