
import { useEffect, useRef } from 'react';
import { vertexShaderSource, createFragmentShaderSource } from './shaderSources';
import { createShader, createProgram, createFullScreenQuadBuffer, getShaderLocations, WebGLLocations } from './webglUtils';

export function useWebGL(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    console.log('WebGL context created successfully');

    // Check for and enable the derivatives extension
    const derivativesExt = gl.getExtension('OES_standard_derivatives');
    console.log('Derivatives extension:', derivativesExt ? 'supported' : 'not supported');
    
    const fragmentShaderSource = createFragmentShaderSource(!!derivativesExt);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error('Failed to create shader program');
      return;
    }

    console.log('Shaders compiled and program linked successfully');

    const positionBuffer = createFullScreenQuadBuffer(gl);
    const locations = getShaderLocations(gl, program);

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function handleMouseMove(event: MouseEvent) {
      mouseRef.current = {
        x: event.clientX / window.innerWidth,
        y: 1.0 - event.clientY / window.innerHeight
      };
    }

    function render() {
      if (!gl || !program) return;
      
      timeRef.current += 0.016;
      
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      gl.uniform2f(locations.resolution, canvas!.width, canvas!.height);
      gl.uniform2f(locations.mouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(locations.time, timeRef.current);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(locations.position);
      gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    console.log('Starting WebGL animation');
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasRef]);
}
