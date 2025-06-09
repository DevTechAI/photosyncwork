
export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error('Failed to create shader object');
    return null;
  }
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    console.error('Shader compile error:', error);
    console.error('Shader source:', source);
    gl.deleteShader(shader);
    return null;
  }
  
  console.log('Shader compiled successfully');
  return shader;
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) {
    console.error('Failed to create program object');
    return null;
  }
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    console.error('Program link error:', error);
    gl.deleteProgram(program);
    return null;
  }
  
  console.log('Program linked successfully');
  return program;
}

export function createFullScreenQuadBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) {
    console.error('Failed to create position buffer');
    return null;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]), gl.STATIC_DRAW);
  
  console.log('Position buffer created successfully');
  return positionBuffer;
}

export interface WebGLLocations {
  position: number;
  resolution: WebGLUniformLocation | null;
  mouse: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
}

export function getShaderLocations(gl: WebGLRenderingContext, program: WebGLProgram): WebGLLocations {
  const locations = {
    position: gl.getAttribLocation(program, 'a_position'),
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    mouse: gl.getUniformLocation(program, 'u_mouse'),
    time: gl.getUniformLocation(program, 'u_time')
  };
  
  console.log('Shader locations:', locations);
  return locations;
}
