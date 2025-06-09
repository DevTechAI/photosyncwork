
import { useRef, useEffect } from 'react';
import { useWebGL } from './webgl/useWebGL';

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useWebGL(canvasRef);

  useEffect(() => {
    console.log('WebGLBackground component mounted');
    return () => {
      console.log('WebGLBackground component unmounted');
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        width: '100vw',
        height: '100vh',
        background: 'transparent',
        display: 'block'
      }}
    />
  );
}
