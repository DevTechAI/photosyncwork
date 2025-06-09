
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
    
    // Fixed array of points
    vec2 points[8];
    
    // Generate points with constant indices
    points[0] = vec2(sin(u_time * 0.15 + 0.0) * 0.8, cos(u_time * 0.18 + 0.0) * 0.7);
    points[1] = vec2(sin(u_time * 0.15 + 0.4) * 0.8, cos(u_time * 0.18 + 0.5) * 0.7);
    points[2] = vec2(sin(u_time * 0.15 + 0.8) * 0.8, cos(u_time * 0.18 + 1.0) * 0.7);
    points[3] = vec2(sin(u_time * 0.15 + 1.2) * 0.8, cos(u_time * 0.18 + 1.5) * 0.7);
    points[4] = vec2(sin(u_time * 0.15 + 1.6) * 0.8, cos(u_time * 0.18 + 2.0) * 0.7);
    points[5] = vec2(sin(u_time * 0.15 + 2.0) * 0.8, cos(u_time * 0.18 + 2.5) * 0.7);
    points[6] = vec2(sin(u_time * 0.15 + 2.4) * 0.8, cos(u_time * 0.18 + 3.0) * 0.7);
    points[7] = vec2(sin(u_time * 0.15 + 2.8) * 0.8, cos(u_time * 0.18 + 3.5) * 0.7);
    
    // Apply mouse influence
    for(int i = 0; i < 8; i++) {
      points[i] += (mouse - 0.5) * 0.3;
    }
    
    // Create connections between points with unrolled loops
    for(int i = 0; i < 8; i++) {
      vec2 point1 = points[i];
      
      // Manually check connections to avoid nested variable loops
      for(int j = 0; j < 8; j++) {
        if(j <= i) continue; // Skip same and previous points
        
        vec2 point2 = points[j];
        float dist = length(point2 - point1);
        
        // Only connect nearby points
        if(dist > 1.2) continue;
        
        vec2 lineDir = normalize(point2 - point1);
        vec2 toPoint = uv - point1;
        float projLength = dot(toPoint, lineDir);
        
        if(projLength > 0.0 && projLength < dist) {
          vec2 projection = point1 + lineDir * projLength;
          float lineDist = length(uv - projection);
          
          // Visible lines
          float lineWidth = 0.008;
          float lineStrength = 1.0 - smoothstep(0.0, lineWidth, lineDist);
          float fadeOut = 1.0 - smoothstep(0.0, dist, projLength);
          
          lines += lineStrength * fadeOut * 0.8;
        }
      }
      
      // Visible node points
      float nodeDist = length(uv - point1);
      float nodeGlow = 1.0 - smoothstep(0.0, 0.02, nodeDist);
      lines += nodeGlow * 0.6;
    }
    
    return lines;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 mouse = u_mouse;
    
    // Visible fractal calculation
    vec2 c = uv * 1.5 + vec2(
      cos(u_time * 0.3) * 0.3 + (mouse.x - 0.5) * 0.2, 
      sin(u_time * 0.25) * 0.2 + (mouse.y - 0.5) * 0.2
    );
    float f = fractal(vec2(0.0), c);
    
    // Additional fractal layers for depth
    float glass1 = fractal(uv * 0.8 + vec2(sin(u_time * 0.4), cos(u_time * 0.5)) * 0.1, c * 0.8);
    float glass2 = fractal(uv * 1.2, c * 0.9);
    
    // Visible plexus network
    float plexus = plexusLines(uv, mouse);
    
    // More visible combination
    float combined = (f * 0.7 + glass1 * 0.4 + glass2 * 0.3) * 1.2;
    
    // More visible color palette
    vec3 baseColor = vec3(0.2, 0.3, 0.5);      // Deep blue
    vec3 midColor = vec3(0.4, 0.6, 0.8);       // Light blue
    vec3 darkColor = vec3(0.6, 0.8, 1.0);      // Bright blue
    vec3 plexusColor = vec3(0.8, 0.9, 1.0);    // White-blue for lines
    
    // Visible color mapping
    vec3 fractalColor = mix(baseColor, midColor, combined * 0.8);
    fractalColor = mix(fractalColor, darkColor, combined * 0.6);
    
    // Blend plexus lines visibly
    vec3 finalColor = mix(fractalColor, plexusColor, plexus);
    
    // Add edge detection
    ${derivativesExt ? `
    float edge = abs(dFdx(combined)) + abs(dFdy(combined));
    finalColor += plexusColor * edge * 1.5;
    ` : `
    float edge = smoothstep(0.1, 0.3, combined) - smoothstep(0.4, 0.6, combined);
    finalColor += plexusColor * edge * 1.0;
    `}
    
    // More visible alpha
    float alpha = 0.4 + combined * 0.5 + plexus * 0.6;
    alpha = min(alpha, 0.8);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
