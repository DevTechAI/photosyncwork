
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
    
    // Opposite mouse movement for 3D-like effect
    vec2 mouseOffset = (0.5 - mouse) * 0.4;
    
    // Generate points with static positions - unroll the loop to avoid dynamic indexing
    vec2 point0 = vec2(sin(u_time * 0.1 + 0.0) * 0.6, cos(u_time * 0.12 + 0.0) * 0.5) + mouseOffset;
    vec2 point1 = vec2(sin(u_time * 0.1 + 0.5) * 0.6, cos(u_time * 0.12 + 0.6) * 0.5) + mouseOffset;
    vec2 point2 = vec2(sin(u_time * 0.1 + 1.0) * 0.6, cos(u_time * 0.12 + 1.2) * 0.5) + mouseOffset;
    vec2 point3 = vec2(sin(u_time * 0.1 + 1.5) * 0.6, cos(u_time * 0.12 + 1.8) * 0.5) + mouseOffset;
    vec2 point4 = vec2(sin(u_time * 0.1 + 2.0) * 0.6, cos(u_time * 0.12 + 2.4) * 0.5) + mouseOffset;
    vec2 point5 = vec2(sin(u_time * 0.1 + 2.5) * 0.6, cos(u_time * 0.12 + 3.0) * 0.5) + mouseOffset;
    vec2 point6 = vec2(sin(u_time * 0.1 + 3.0) * 0.6, cos(u_time * 0.12 + 3.6) * 0.5) + mouseOffset;
    vec2 point7 = vec2(sin(u_time * 0.1 + 3.5) * 0.6, cos(u_time * 0.12 + 4.2) * 0.5) + mouseOffset;
    vec2 point8 = vec2(sin(u_time * 0.1 + 4.0) * 0.6, cos(u_time * 0.12 + 4.8) * 0.5) + mouseOffset;
    vec2 point9 = vec2(sin(u_time * 0.1 + 4.5) * 0.6, cos(u_time * 0.12 + 5.4) * 0.5) + mouseOffset;
    vec2 point10 = vec2(sin(u_time * 0.1 + 5.0) * 0.6, cos(u_time * 0.12 + 6.0) * 0.5) + mouseOffset;
    vec2 point11 = vec2(sin(u_time * 0.1 + 5.5) * 0.6, cos(u_time * 0.12 + 6.6) * 0.5) + mouseOffset;
    vec2 point12 = vec2(sin(u_time * 0.1 + 6.0) * 0.6, cos(u_time * 0.12 + 7.2) * 0.5) + mouseOffset;
    vec2 point13 = vec2(sin(u_time * 0.1 + 6.5) * 0.6, cos(u_time * 0.12 + 7.8) * 0.5) + mouseOffset;
    vec2 point14 = vec2(sin(u_time * 0.1 + 7.0) * 0.6, cos(u_time * 0.12 + 8.4) * 0.5) + mouseOffset;
    vec2 point15 = vec2(sin(u_time * 0.1 + 7.5) * 0.6, cos(u_time * 0.12 + 9.0) * 0.5) + mouseOffset;
    
    // Helper function to draw a line between two points
    float drawLine(vec2 p1, vec2 p2) {
      vec2 lineDir = normalize(p2 - p1);
      vec2 toPoint = uv - p1;
      float projLength = dot(toPoint, lineDir);
      float dist = length(p2 - p1);
      
      if(projLength > 0.0 && projLength < dist) {
        vec2 projection = p1 + lineDir * projLength;
        float lineDist = length(uv - projection);
        
        // Much thinner and sharper lines
        float lineWidth = 0.001;
        float lineStrength = 1.0 - smoothstep(0.0, lineWidth, lineDist);
        float fadeOut = 1.0 - smoothstep(0.0, dist, projLength);
        
        return lineStrength * fadeOut * 0.6;
      }
      return 0.0;
    }
    
    // Static connections - unroll the connections to avoid dynamic indexing
    lines += drawLine(point0, point1);
    lines += drawLine(point1, point2);
    lines += drawLine(point2, point3);
    lines += drawLine(point3, point4);
    lines += drawLine(point4, point5);
    lines += drawLine(point5, point6);
    lines += drawLine(point6, point7);
    lines += drawLine(point7, point8);
    lines += drawLine(point8, point9);
    lines += drawLine(point9, point10);
    lines += drawLine(point10, point11);
    lines += drawLine(point11, point12);
    lines += drawLine(point12, point13);
    lines += drawLine(point13, point14);
    lines += drawLine(point14, point15);
    
    // Additional cross-connections for more complex network
    lines += drawLine(point0, point3);
    lines += drawLine(point2, point5);
    lines += drawLine(point4, point7);
    lines += drawLine(point6, point9);
    lines += drawLine(point8, point11);
    lines += drawLine(point10, point13);
    lines += drawLine(point12, point15);
    
    // More visible node points - unroll the node rendering
    float nodeGlow = 0.0;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point0))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point1))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point2))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point3))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point4))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point5))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point6))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point7))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point8))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point9))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point10))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point11))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point12))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point13))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point14))) * 0.4;
    nodeGlow += (1.0 - smoothstep(0.0, 0.015, length(uv - point15))) * 0.4;
    
    return lines + nodeGlow;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 mouse = u_mouse;
    
    // Fractal with opposite mouse movement (3D-like effect)
    vec2 mouseInfluence = (0.5 - mouse) * 0.3;
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
    vec3 baseColor = vec3(0.85, 0.9, 0.95);
    vec3 midColor = vec3(0.75, 0.85, 0.9);
    vec3 darkColor = vec3(0.65, 0.8, 0.85);
    vec3 plexusColor = vec3(0.7, 0.8, 0.9);
    
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
    
    // Subtle alpha for gentle blending
    float alpha = 0.15 + combined * 0.2 + plexus * 0.15;
    alpha = min(alpha, 0.35);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
