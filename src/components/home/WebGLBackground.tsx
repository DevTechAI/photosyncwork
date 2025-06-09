
import { useRef } from 'react';
import { useWebGL } from './webgl/useWebGL';

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useWebGL(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        width: '100vw',
        height: '100vh',
        background: 'transparent'
      }}
    />
  );
}
