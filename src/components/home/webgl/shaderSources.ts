
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
    
    // Fixed array of points with constant size
    vec2 points[20];
    
    // Generate points with dynamic movement
    for(int i = 0; i < 20; i++) {
      float fi = float(i);
      points[i] = vec2(
        sin(u_time * 0.2 + fi * 0.5) * 1.8,
        cos(u_time * 0.25 + fi * 0.6) * 1.5
      );
      points[i] += (mouse - 0.5) * 0.3;
    }
    
    // Create connections between points
    for(int i = 0; i < 20; i++) {
      vec2 point1 = points[i];
      
      // Connect to next few points to create network
      for(int j = 0; j < 20; j++) {
        if(i == j) continue;
        
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
          
          // Very thin, sharp lines
          float lineWidth = 0.002;
          float lineStrength = 1.0 - smoothstep(0.0, lineWidth, lineDist);
          float fadeOut = 1.0 - smoothstep(0.0, dist, projLength);
          
          lines += lineStrength * fadeOut * 0.8;
        }
      }
      
      // Add node points
      float nodeDist = length(uv - point1);
      float nodeGlow = 1.0 - smoothstep(0.0, 0.01, nodeDist);
      lines += nodeGlow * 0.5;
    }
    
    return lines;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 mouse = u_mouse;
    
    // Enhanced fractal calculation with more visible patterns
    vec2 c = uv * 1.5 + vec2(
      cos(u_time * 0.4) * 0.4 + (mouse.x - 0.5) * 0.3, 
      sin(u_time * 0.3) * 0.3 + (mouse.y - 0.5) * 0.3
    );
    float f = fractal(vec2(0.0), c);
    
    // Multiple fractal layers for depth and complexity
    float glass1 = fractal(uv * 0.8 + vec2(sin(u_time * 0.6), cos(u_time * 0.7)) * 0.1, c * 0.9);
    float glass2 = fractal(uv * 1.2, c * 1.1);
    
    // Dense plexus network
    float plexus = plexusLines(uv, mouse);
    
    // Combine fractal layers with higher intensity
    float combined = (f * 0.6 + glass1 * 0.3 + glass2 * 0.1) * 2.0;
    
    // High contrast color palette - much more visible
    vec3 baseColor = vec3(0.2, 0.4, 0.8);      // Strong blue
    vec3 midColor = vec3(0.4, 0.6, 0.9);       // Brighter blue
    vec3 darkColor = vec3(0.1, 0.2, 0.6);      // Deep blue
    vec3 plexusColor = vec3(0.8, 0.9, 1.0);    // Bright white-blue for lines
    
    // Enhanced color mapping with much higher contrast
    vec3 fractalColor = mix(baseColor, midColor, combined);
    fractalColor = mix(fractalColor, darkColor, combined * 0.5);
    
    // Make plexus lines very visible
    vec3 finalColor = mix(fractalColor, plexusColor, plexus * 3.0);
    
    // Add fractal edge detection for more defined shapes
    ${derivativesExt ? `
    float edge = abs(dFdx(combined)) + abs(dFdy(combined));
    finalColor += plexusColor * edge * 5.0;
    ` : `
    float edge = smoothstep(0.2, 0.4, combined) - smoothstep(0.6, 0.8, combined);
    finalColor += plexusColor * edge * 2.0;
    `}
    
    // Much higher alpha for strong visibility
    float alpha = 0.7 + combined * 0.8 + plexus * 1.2;
    alpha = min(alpha, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
