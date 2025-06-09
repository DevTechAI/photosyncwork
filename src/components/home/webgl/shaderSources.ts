
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
    
    // Create more fractal points for denser network with finer structure
    for(int i = 0; i < 12; i++) {
      float fi = float(i);
      vec2 point = vec2(
        sin(u_time * 0.2 + fi * 0.6) * 0.8,
        cos(u_time * 0.25 + fi * 0.7) * 0.7
      );
      
      // Subtle mouse influence to points
      point += (mouse - 0.5) * 0.2;
      
      float dist = length(uv - point);
      
      // Create thinner lines between points
      for(int j = i + 1; j < 12; j++) {
        float fj = float(j);
        vec2 point2 = vec2(
          sin(u_time * 0.18 + fj * 0.55) * 0.85,
          cos(u_time * 0.22 + fj * 0.65) * 0.75
        );
        point2 += (mouse - 0.5) * 0.2;
        
        vec2 lineDir = normalize(point2 - point);
        vec2 toPoint = uv - point;
        float projLength = dot(toPoint, lineDir);
        float lineLength = length(point2 - point);
        
        if(projLength > 0.0 && projLength < lineLength) {
          vec2 projection = point + lineDir * projLength;
          float lineDist = length(uv - projection);
          
          // Much thinner lines with smoother falloff
          float lineStrength = 1.0 - smoothstep(0.0, 0.008, lineDist);
          float fadeOut = 1.0 - smoothstep(0.0, lineLength, projLength);
          
          // Distance-based connection strength for finer structure
          float connectionStrength = 1.0 - smoothstep(0.3, 1.2, lineLength);
          
          lines += lineStrength * fadeOut * connectionStrength * 0.15;
        }
      }
      
      // Smaller, more subtle node points
      float nodeGlow = (1.0 - smoothstep(0.0, 0.025, dist)) * 0.2;
      lines += nodeGlow;
      
      // Add secondary smaller nodes for finer detail
      if(i < 6) {
        vec2 secondaryPoint = point + vec2(
          sin(u_time * 0.3 + fi * 1.2) * 0.15,
          cos(u_time * 0.35 + fi * 1.1) * 0.12
        );
        float secondaryDist = length(uv - secondaryPoint);
        float secondaryGlow = (1.0 - smoothstep(0.0, 0.015, secondaryDist)) * 0.1;
        lines += secondaryGlow;
      }
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
    
    // Add refined plexus network
    float plexus = plexusLines(uv, mouse);
    
    // Combine all layers
    float combined = (f * 0.4 + glass1 * 0.3 + glass2 * 0.2 + glass3 * 0.1);
    
    // Color palette from design system - darker tones for plexus
    vec3 baseColor = vec3(0.96, 0.96, 0.98); // dusty-blue-whisper (lightest)
    vec3 midColor = vec3(0.75, 0.80, 0.90);   // dusty-blue-soft
    vec3 darkColor = vec3(0.45, 0.55, 0.75);  // dusty-blue (main)
    vec3 plexusColor = vec3(0.25, 0.35, 0.55); // darker blue for fine lines
    
    // Map fractal values to colors
    vec3 fractalColor = mix(baseColor, midColor, combined);
    fractalColor = mix(fractalColor, darkColor, combined * 0.6);
    
    // Add plexus lines with refined color blending
    vec3 finalColor = mix(fractalColor, plexusColor, plexus * 0.9);
    
    // Enhanced glass highlights with mouse interaction
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.8, length(uv - (mouse - 0.5) * 1.5));
    float highlight = pow(mouseInfluence, 2.0) * 0.4;
    finalColor += vec3(highlight * 0.3, highlight * 0.4, highlight * 0.6);
    
    // Add fractal edge detection for more defined shapes (only if derivatives are supported)
    ${derivativesExt ? `
    float edge = abs(dFdx(combined)) + abs(dFdy(combined));
    finalColor += plexusColor * edge * 3.0;
    ` : `
    // Fallback edge detection using distance-based method
    float edge = smoothstep(0.4, 0.6, combined) - smoothstep(0.6, 0.8, combined);
    finalColor += plexusColor * edge * 0.5;
    `}
    
    // Final alpha with depth
    float alpha = 0.3 + combined * 0.4 + plexus * 0.25;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
