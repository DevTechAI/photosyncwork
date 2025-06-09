

export const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const createFragmentShaderSource = (derivativesExt: boolean) => `
  ${derivativesExt ? '#extension GL_OES_standard_derivatives : enable' : ''}
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
    for(int i = 0; i < 32; i++) {
      if(dot(z, z) > 4.0) break;
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
      n += 1.0;
    }
    return n / 32.0;
  }

  float plexusLines(vec2 uv, vec2 mouse) {
    float lines = 0.0;
    
    // More static points in a grid-like pattern
    vec2 points[16];
    
    // Generate more points with constant positions and opposite mouse influence
    vec2 mouseOffset = (0.5 - mouse) * 0.4; // Opposite movement
    
    points[0] = vec2(sin(u_time * 0.1 + 0.0) * 0.6, cos(u_time * 0.12 + 0.0) * 0.5) + mouseOffset;
    points[1] = vec2(sin(u_time * 0.1 + 0.5) * 0.6, cos(u_time * 0.12 + 0.6) * 0.5) + mouseOffset;
    points[2] = vec2(sin(u_time * 0.1 + 1.0) * 0.6, cos(u_time * 0.12 + 1.2) * 0.5) + mouseOffset;
    points[3] = vec2(sin(u_time * 0.1 + 1.5) * 0.6, cos(u_time * 0.12 + 1.8) * 0.5) + mouseOffset;
    points[4] = vec2(sin(u_time * 0.1 + 2.0) * 0.6, cos(u_time * 0.12 + 2.4) * 0.5) + mouseOffset;
    points[5] = vec2(sin(u_time * 0.1 + 2.5) * 0.6, cos(u_time * 0.12 + 3.0) * 0.5) + mouseOffset;
    points[6] = vec2(sin(u_time * 0.1 + 3.0) * 0.6, cos(u_time * 0.12 + 3.6) * 0.5) + mouseOffset;
    points[7] = vec2(sin(u_time * 0.1 + 3.5) * 0.6, cos(u_time * 0.12 + 4.2) * 0.5) + mouseOffset;
    points[8] = vec2(sin(u_time * 0.1 + 4.0) * 0.6, cos(u_time * 0.12 + 4.8) * 0.5) + mouseOffset;
    points[9] = vec2(sin(u_time * 0.1 + 4.5) * 0.6, cos(u_time * 0.12 + 5.4) * 0.5) + mouseOffset;
    points[10] = vec2(sin(u_time * 0.1 + 5.0) * 0.6, cos(u_time * 0.12 + 6.0) * 0.5) + mouseOffset;
    points[11] = vec2(sin(u_time * 0.1 + 5.5) * 0.6, cos(u_time * 0.12 + 6.6) * 0.5) + mouseOffset;
    points[12] = vec2(sin(u_time * 0.1 + 6.0) * 0.6, cos(u_time * 0.12 + 7.2) * 0.5) + mouseOffset;
    points[13] = vec2(sin(u_time * 0.1 + 6.5) * 0.6, cos(u_time * 0.12 + 7.8) * 0.5) + mouseOffset;
    points[14] = vec2(sin(u_time * 0.1 + 7.0) * 0.6, cos(u_time * 0.12 + 8.4) * 0.5) + mouseOffset;
    points[15] = vec2(sin(u_time * 0.1 + 7.5) * 0.6, cos(u_time * 0.12 + 9.0) * 0.5) + mouseOffset;
    
    // Static connections between specific points only
    int connections[24]; // 12 pairs = 24 indices
    connections[0] = 0; connections[1] = 1;
    connections[2] = 1; connections[3] = 2;
    connections[4] = 2; connections[5] = 3;
    connections[6] = 3; connections[7] = 4;
    connections[8] = 4; connections[9] = 5;
    connections[10] = 5; connections[11] = 6;
    connections[12] = 6; connections[13] = 7;
    connections[14] = 7; connections[15] = 8;
    connections[16] = 8; connections[17] = 9;
    connections[18] = 9; connections[19] = 10;
    connections[20] = 10; connections[21] = 11;
    connections[22] = 11; connections[23] = 12;
    
    // Draw static connections with much thinner, sharper lines
    for(int i = 0; i < 12; i++) {
      int idx1 = connections[i * 2];
      int idx2 = connections[i * 2 + 1];
      
      vec2 point1 = points[idx1];
      vec2 point2 = points[idx2];
      
      vec2 lineDir = normalize(point2 - point1);
      vec2 toPoint = uv - point1;
      float projLength = dot(toPoint, lineDir);
      float dist = length(point2 - point1);
      
      if(projLength > 0.0 && projLength < dist) {
        vec2 projection = point1 + lineDir * projLength;
        float lineDist = length(uv - projection);
        
        // Much thinner and sharper lines
        float lineWidth = 0.002;
        float lineStrength = 1.0 - smoothstep(0.0, lineWidth, lineDist);
        float fadeOut = 1.0 - smoothstep(0.0, dist, projLength);
        
        lines += lineStrength * fadeOut * 0.4;
      }
    }
    
    // More visible node points
    for(int i = 0; i < 16; i++) {
      float nodeDist = length(uv - points[i]);
      float nodeGlow = 1.0 - smoothstep(0.0, 0.015, nodeDist);
      lines += nodeGlow * 0.3;
    }
    
    return lines;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 mouse = u_mouse;
    
    // Fractal with opposite mouse movement (3D-like effect)
    vec2 mouseInfluence = (0.5 - mouse) * 0.3; // Opposite movement
    vec2 c = uv * 1.5 + vec2(
      cos(u_time * 0.3) * 0.3 + mouseInfluence.x, 
      sin(u_time * 0.25) * 0.2 + mouseInfluence.y
    );
    float f = fractal(vec2(0.0), c);
    
    // Additional subtle fractal layers with opposite movement
    float glass1 = fractal(uv * 0.8 + vec2(sin(u_time * 0.4), cos(u_time * 0.5)) * 0.1, c * 0.8);
    float glass2 = fractal(uv * 1.2, c * 0.9);
    
    // Plexus network with opposite mouse movement
    float plexus = plexusLines(uv, mouse);
    
    // Gentle combination
    float combined = (f * 0.3 + glass1 * 0.2 + glass2 * 0.1);
    
    // Soft color palette that blends with background
    vec3 baseColor = vec3(0.85, 0.9, 0.95);     // Very light blue-white
    vec3 midColor = vec3(0.75, 0.85, 0.9);      // Soft blue
    vec3 darkColor = vec3(0.65, 0.8, 0.85);     // Slightly deeper blue
    vec3 plexusColor = vec3(0.7, 0.8, 0.9);     // Muted blue for lines
    
    // Gentle color mapping
    vec3 fractalColor = mix(baseColor, midColor, combined * 0.5);
    fractalColor = mix(fractalColor, darkColor, combined * 0.3);
    
    // Blend plexus lines gently
    vec3 finalColor = mix(fractalColor, plexusColor, plexus);
    
    // Add subtle edge detection
    ${derivativesExt ? `
    float edge = abs(dFdx(combined)) + abs(dFdy(combined));
    finalColor += plexusColor * edge * 0.5;
    ` : `
    float edge = smoothstep(0.1, 0.3, combined) - smoothstep(0.4, 0.6, combined);
    finalColor += plexusColor * edge * 0.3;
    `}
    
    // Very subtle alpha for gentle blending
    float alpha = 0.1 + combined * 0.15 + plexus * 0.1;
    alpha = min(alpha, 0.25);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

