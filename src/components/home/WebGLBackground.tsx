
import { useEffect, useRef } from 'react';

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Enhanced fragment shader with plexus effect
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      float fractal(vec2 z, vec2 c) {
        float n = 0.0;
        for(int i = 0; i < 64; i++) {
          if(dot(z, z) > 4.0) break;
          z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
          n += 1.0;
        }
        return n / 64.0;
      }

      float plexusLines(vec2 uv, vec2 mouse) {
        float lines = 0.0;
        
        // Create multiple fractal points for plexus connections
        for(int i = 0; i < 8; i++) {
          float fi = float(i);
          vec2 point = vec2(
            sin(u_time * 0.3 + fi * 0.8) * 0.6,
            cos(u_time * 0.4 + fi * 0.9) * 0.5
          );
          
          // Add mouse influence to points
          point += (mouse - 0.5) * 0.3;
          
          float dist = length(uv - point);
          
          // Create lines between points
          for(int j = i + 1; j < 8; j++) {
            float fj = float(j);
            vec2 point2 = vec2(
              sin(u_time * 0.25 + fj * 0.7) * 0.7,
              cos(u_time * 0.35 + fj * 0.8) * 0.6
            );
            point2 += (mouse - 0.5) * 0.3;
            
            vec2 lineDir = normalize(point2 - point);
            vec2 toPoint = uv - point;
            float projLength = dot(toPoint, lineDir);
            
            if(projLength > 0.0 && projLength < length(point2 - point)) {
              vec2 projection = point + lineDir * projLength;
              float lineDist = length(uv - projection);
              float lineStrength = 1.0 - smoothstep(0.0, 0.02, lineDist);
              float fadeOut = 1.0 - smoothstep(0.0, length(point2 - point), projLength);
              lines += lineStrength * fadeOut * 0.3;
            }
          }
          
          // Add node glow
          lines += (1.0 - smoothstep(0.0, 0.05, dist)) * 0.4;
        }
        
        return lines;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        vec2 mouse = u_mouse;
        
        // Create glass-like distortion with stronger effect
        float dist = length(uv - (mouse - 0.5) * 1.5);
        vec2 distorted = uv + (mouse - 0.5) * 0.4 * exp(-dist * 2.0);
        
        // Enhanced fractal calculation
        vec2 c = distorted * 1.5 + vec2(
          cos(u_time * 0.4) * 0.4 + (mouse.x - 0.5) * 0.3, 
          sin(u_time * 0.3) * 0.3 + (mouse.y - 0.5) * 0.3
        );
        float f = fractal(vec2(0.0), c);
        
        // Multiple fractal layers for depth
        float glass1 = fractal(distorted * 0.8 + vec2(sin(u_time * 0.6), cos(u_time * 0.8)) * 0.1, c * 0.9);
        float glass2 = fractal(distorted * 1.2 + (mouse - 0.5) * 0.2, c * 1.1);
        float glass3 = fractal(distorted * 2.0 + vec2(cos(u_time), sin(u_time * 1.2)) * 0.05, c * 0.7);
        
        // Add plexus network
        float plexus = plexusLines(uv, mouse);
        
        // Combine all layers
        float combined = (f * 0.4 + glass1 * 0.3 + glass2 * 0.2 + glass3 * 0.1);
        
        // Color palette from design system - darker tones for plexus
        vec3 baseColor = vec3(0.96, 0.96, 0.98); // dusty-blue-whisper (lightest)
        vec3 midColor = vec3(0.75, 0.80, 0.90);   // dusty-blue-soft
        vec3 darkColor = vec3(0.45, 0.55, 0.75);  // dusty-blue (main)
        vec3 plexusColor = vec3(0.30, 0.40, 0.60); // darker blue for lines
        
        // Map fractal values to colors
        vec3 fractalColor = mix(baseColor, midColor, combined);
        fractalColor = mix(fractalColor, darkColor, combined * 0.6);
        
        // Add plexus lines with darker color
        vec3 finalColor = mix(fractalColor, plexusColor, plexus * 0.8);
        
        // Enhanced glass highlights with mouse interaction
        float mouseInfluence = 1.0 - smoothstep(0.0, 0.8, length(uv - (mouse - 0.5) * 1.5));
        float highlight = pow(mouseInfluence, 2.0) * 0.4;
        finalColor += vec3(highlight * 0.3, highlight * 0.4, highlight * 0.6);
        
        // Add fractal edge detection for more defined shapes
        float edge = abs(dFdx(combined)) + abs(dFdy(combined));
        finalColor += plexusColor * edge * 3.0;
        
        // Final alpha with depth
        float alpha = 0.2 + combined * 0.5 + plexus * 0.3;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram();
      if (!program) return null;
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      
      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Create buffer for full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

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
      
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      gl.uniform2f(resolutionLocation, canvas!.width, canvas!.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(timeLocation, timeRef.current);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
