
export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
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

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
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

export function createFullScreenQuadBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]), gl.STATIC_DRAW);
  return positionBuffer;
}

export interface WebGLLocations {
  position: number;
  resolution: WebGLUniformLocation | null;
  mouse: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
}

export function getShaderLocations(gl: WebGLRenderingContext, program: WebGLProgram): WebGLLocations {
  return {
    position: gl.getAttribLocation(program, 'a_position'),
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    mouse: gl.getUniformLocation(program, 'u_mouse'),
    time: gl.getUniformLocation(program, 'u_time')
  };
}
