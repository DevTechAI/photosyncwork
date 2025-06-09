
import { useEffect, useRef } from 'react';
import { vertexShaderSource, createFragmentShaderSource } from './shaderSources';
import { createShader, createProgram, createFullScreenQuadBuffer, getShaderLocations, WebGLLocations } from './webglUtils';

export function useWebGL(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }

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
    console.log('Fragment shader source length:', fragmentShaderSource.length);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    if (!vertexShader) {
      console.error('Failed to create vertex shader');
      return;
    }
    console.log('Vertex shader created successfully');

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!fragmentShader) {
      console.error('Failed to create fragment shader');
      return;
    }
    console.log('Fragment shader created successfully');
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error('Failed to create shader program');
      return;
    }

    console.log('Shaders compiled and program linked successfully');

    const positionBuffer = createFullScreenQuadBuffer(gl);
    const locations = getShaderLocations(gl, program);
    
    console.log('Locations:', locations);

    function resize() {
      if (!canvas) return;
      // Set canvas size to full viewport
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
    }

    function handleMouseMove(event: MouseEvent) {
      // Convert global mouse position to normalized coordinates (0-1)
      const x = event.clientX / window.innerWidth;
      const y = 1.0 - (event.clientY / window.innerHeight);
      
      // Apply smoothing to mouse movement
      mouseRef.current = {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y))
      };
    }

    function render() {
      if (!gl || !program) {
        console.error('GL or program not available in render');
        return;
      }
      
      timeRef.current += 0.016;
      
      // Clear with transparent background
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      // Set uniforms
      if (locations.resolution) {
        gl.uniform2f(locations.resolution, canvas!.width, canvas!.height);
      }
      if (locations.mouse) {
        gl.uniform2f(locations.mouse, mouseRef.current.x, mouseRef.current.y);
      }
      if (locations.time) {
        gl.uniform1f(locations.time, timeRef.current);
      }
      
      // Set up vertex attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(locations.position);
      gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      // Check for GL errors
      const error = gl.getError();
      if (error !== gl.NO_ERROR) {
        console.error('WebGL error:', error);
      }
      
      animationRef.current = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    console.log('Starting WebGL animation');
    render();

    return () => {
      console.log('Cleaning up WebGL');
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasRef]);
}
