
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
    for(int i = 0; i < 64; i++) {
      if(dot(z, z) > 4.0) break;
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
      n += 1.0;
    }
    return n / 64.0;
  }

  float plexusLines(vec2 uv, vec2 mouse) {
    float lines = 0.0;
    
    // Create dense plexus network with more points
    vec2 points[30];
    
    // Generate primary points with more dynamic movement
    for(int i = 0; i < 30; i++) {
      float fi = float(i);
      points[i] = vec2(
        sin(u_time * 0.15 + fi * 0.3) * 1.5,
        cos(u_time * 0.18 + fi * 0.4) * 1.2
      );
      points[i] += (mouse - 0.5) * 0.1;
    }
    
    // Create connections between all points with ultra-thin lines
    for(int i = 0; i < 30; i++) {
      vec2 point = points[i];
      
      // Connect to subsequent points to avoid duplicates
      for(int j = i + 1; j < 30; j++) {
        vec2 point2 = points[j];
        vec2 lineDir = normalize(point2 - point);
        vec2 toPoint = uv - point;
        float projLength = dot(toPoint, lineDir);
        float lineLength = length(point2 - point);
        
        if(projLength > 0.0 && projLength < lineLength) {
          vec2 projection = point + lineDir * projLength;
          float lineDist = length(uv - projection);
          
          // Ultra-thin sharp lines with stronger visibility
          float lineStrength = 1.0 - smoothstep(0.0, 0.0008, lineDist);
          float fadeOut = 1.0 - smoothstep(0.0, lineLength, projLength);
          float connectionStrength = 1.0 - smoothstep(0.3, 1.0, lineLength);
          
          lines += lineStrength * fadeOut * connectionStrength * 0.15;
        }
      }
      
      // Small sharp node points
      float dist = length(uv - point);
      float nodeGlow = (1.0 - smoothstep(0.0, 0.005, dist)) * 0.12;
      lines += nodeGlow;
    }
    
    // Add secondary layer of even finer connections
    for(int i = 0; i < 20; i++) {
      float fi = float(i);
      vec2 secondaryPoint = vec2(
        sin(u_time * 0.25 + fi * 0.7) * 0.9,
        cos(u_time * 0.22 + fi * 0.8) * 0.7
      );
      secondaryPoint += (mouse - 0.5) * 0.08;
      
      // Connect secondary points to primary points
      for(int j = 0; j < 15; j++) {
        vec2 primaryPoint = points[j];
        vec2 lineDir = normalize(primaryPoint - secondaryPoint);
        vec2 toPoint = uv - secondaryPoint;
        float projLength = dot(toPoint, lineDir);
        float lineLength = length(primaryPoint - secondaryPoint);
        
        if(projLength > 0.0 && projLength < lineLength) {
          vec2 projection = secondaryPoint + lineDir * projLength;
          float lineDist = length(uv - projection);
          
          // Even finer lines for secondary network
          float lineStrength = 1.0 - smoothstep(0.0, 0.0006, lineDist);
          float fadeOut = 1.0 - smoothstep(0.0, lineLength, projLength);
          float connectionStrength = 1.0 - smoothstep(0.2, 0.8, lineLength);
          
          lines += lineStrength * fadeOut * connectionStrength * 0.08;
        }
      }
      
      // Tiny secondary nodes
      float secondaryDist = length(uv - secondaryPoint);
      float secondaryGlow = (1.0 - smoothstep(0.0, 0.003, secondaryDist)) * 0.06;
      lines += secondaryGlow;
    }
    
    return lines;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 mouse = u_mouse;
    
    // Subtle glass-like distortion
    float dist = length(uv - (mouse - 0.5) * 1.0);
    vec2 distorted = uv + (mouse - 0.5) * 0.15 * exp(-dist * 3.0);
    
    // Enhanced fractal calculation
    vec2 c = distorted * 1.3 + vec2(
      cos(u_time * 0.3) * 0.3 + (mouse.x - 0.5) * 0.2, 
      sin(u_time * 0.25) * 0.25 + (mouse.y - 0.5) * 0.2
    );
    float f = fractal(vec2(0.0), c);
    
    // Multiple fractal layers for depth
    float glass1 = fractal(distorted * 0.7 + vec2(sin(u_time * 0.5), cos(u_time * 0.6)) * 0.08, c * 0.9);
    float glass2 = fractal(distorted * 1.1 + (mouse - 0.5) * 0.15, c * 1.05);
    float glass3 = fractal(distorted * 1.8 + vec2(cos(u_time * 0.8), sin(u_time)) * 0.04, c * 0.75);
    
    // Dense plexus network
    float plexus = plexusLines(uv, mouse);
    
    // Combine all layers
    float combined = (f * 0.4 + glass1 * 0.3 + glass2 * 0.2 + glass3 * 0.1);
    
    // More visible color palette - brighter and higher contrast
    vec3 baseColor = vec3(0.9, 0.92, 0.96);      // Very light blue-white
    vec3 midColor = vec3(0.6, 0.7, 0.85);        // Medium blue
    vec3 darkColor = vec3(0.3, 0.45, 0.7);       // Stronger blue
    vec3 plexusColor = vec3(0.15, 0.25, 0.5);    // Dark blue for contrast
    
    // Map fractal values to colors with more contrast
    vec3 fractalColor = mix(baseColor, midColor, combined * 1.2);
    fractalColor = mix(fractalColor, darkColor, combined * 0.8);
    
    // Add visible plexus lines with stronger contrast
    vec3 finalColor = mix(fractalColor, plexusColor, plexus * 2.0);
    
    // Add fractal edge detection for more defined shapes
    ${derivativesExt ? `
    float edge = abs(dFdx(combined)) + abs(dFdy(combined));
    finalColor += plexusColor * edge * 3.0;
    ` : `
    // Fallback edge detection using distance-based method
    float edge = smoothstep(0.3, 0.6, combined) - smoothstep(0.6, 0.8, combined);
    finalColor += plexusColor * edge * 0.6;
    `}
    
    // Higher alpha for better visibility
    float alpha = 0.4 + combined * 0.5 + plexus * 0.6;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
