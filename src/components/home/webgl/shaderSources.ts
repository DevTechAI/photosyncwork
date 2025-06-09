
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
    
    // Smaller array of points for more subtle effect
    vec2 points[12];
    
    // Generate points with more subtle movement
    for(int i = 0; i < 12; i++) {
      float fi = float(i);
      points[i] = vec2(
        sin(u_time * 0.15 + fi * 0.4) * 0.8,
        cos(u_time * 0.18 + fi * 0.5) * 0.7
      );
      points[i] += (mouse - 0.5) * 0.2;
    }
    
    // Create connections between points
    for(int i = 0; i < 12; i++) {
      vec2 point1 = points[i];
      
      // Connect to fewer points for cleaner look
      for(int j = i + 1; j < 12; j++) {
        vec2 point2 = points[j];
        float dist = length(point2 - point1);
        
        // Only connect very nearby points
        if(dist > 0.8) continue;
        
        vec2 lineDir = normalize(point2 - point1);
        vec2 toPoint = uv - point1;
        float projLength = dot(toPoint, lineDir);
        
        if(projLength > 0.0 && projLength < dist) {
          vec2 projection = point1 + lineDir * projLength;
          float lineDist = length(uv - projection);
          
          // Very thin lines
          float lineWidth = 0.001;
          float lineStrength = 1.0 - smoothstep(0.0, lineWidth, lineDist);
          float fadeOut = 1.0 - smoothstep(0.0, dist, projLength);
          
          lines += lineStrength * fadeOut * 0.3;
        }
      }
      
      // Smaller node points
      float nodeDist = length(uv - point1);
      float nodeGlow = 1.0 - smoothstep(0.0, 0.005, nodeDist);
      lines += nodeGlow * 0.2;
    }
    
    return lines;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 mouse = u_mouse;
    
    // Smaller, more subtle fractal calculation
    vec2 c = uv * 0.8 + vec2(
      cos(u_time * 0.3) * 0.2 + (mouse.x - 0.5) * 0.15, 
      sin(u_time * 0.25) * 0.15 + (mouse.y - 0.5) * 0.15
    );
    float f = fractal(vec2(0.0), c);
    
    // Lighter fractal layers
    float glass1 = fractal(uv * 0.5 + vec2(sin(u_time * 0.4), cos(u_time * 0.5)) * 0.05, c * 0.7);
    float glass2 = fractal(uv * 0.9, c * 0.8);
    
    // Subtle plexus network
    float plexus = plexusLines(uv, mouse);
    
    // Much more subtle combination
    float combined = (f * 0.4 + glass1 * 0.2 + glass2 * 0.1) * 0.8;
    
    // Very subtle color palette that blends with background
    vec3 baseColor = vec3(0.85, 0.87, 0.92);      // Very light blue-gray
    vec3 midColor = vec3(0.78, 0.82, 0.88);       // Slightly darker blue-gray
    vec3 darkColor = vec3(0.88, 0.90, 0.94);      // Almost white
    vec3 plexusColor = vec3(0.75, 0.80, 0.87);    // Subtle blue-gray for lines
    
    // Very subtle color mapping
    vec3 fractalColor = mix(baseColor, midColor, combined * 0.3);
    fractalColor = mix(fractalColor, darkColor, combined * 0.2);
    
    // Blend plexus lines very subtly
    vec3 finalColor = mix(fractalColor, plexusColor, plexus * 0.8);
    
    // Add very subtle edge detection
    ${derivativesExt ? `
    float edge = abs(dFdx(combined)) + abs(dFdy(combined));
    finalColor += plexusColor * edge * 0.5;
    ` : `
    float edge = smoothstep(0.1, 0.3, combined) - smoothstep(0.4, 0.6, combined);
    finalColor += plexusColor * edge * 0.3;
    `}
    
    // Very low alpha for subtle blending with background
    float alpha = 0.15 + combined * 0.2 + plexus * 0.3;
    alpha = min(alpha, 0.4);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
