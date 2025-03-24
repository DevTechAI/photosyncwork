
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000022, 0.2); // Very dark blue background with slight opacity
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000; // Significantly increased particle count
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);
    
    // Fill positions with random values
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Random positions for particles - wider distribution field
      posArray[i] = (Math.random() - 0.5) * 100;       // x
      posArray[i + 1] = (Math.random() - 0.5) * 100;   // y
      posArray[i + 2] = (Math.random() - 0.5) * 100;   // z
      
      // Vibrant blue-purple colors for particles
      colorArray[i] = 0.3 + Math.random() * 0.7;       // R (more blue)
      colorArray[i + 1] = 0.1 + Math.random() * 0.3;   // G (less)
      colorArray[i + 2] = 0.7 + Math.random() * 0.3;   // B (more purple)
      
      // Much larger varied particle sizes
      sizeArray[i/3] = 0.5 + Math.random() * 2.5;      // Significantly larger sizes
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
    
    // Create particle material with enhanced visuals
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,                // Base size is larger
      sizeAttenuation: true,    // Size changes with distance
      transparent: true,
      opacity: 1.0,             // Full opacity
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    // Add a texture to particles to make them glow
    const loader = new THREE.TextureLoader();
    loader.load('/particle.png', (texture) => {
      particlesMaterial.map = texture;
      particlesMaterial.needsUpdate = true;
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop with more dramatic movement
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      const time = clockRef.current.getElapsedTime();
      
      if (particlesRef.current) {
        // More dramatic rotation and movement
        particlesRef.current.rotation.x += 0.001;
        particlesRef.current.rotation.y += 0.002;
        
        // Add stronger pulsing effect
        particlesRef.current.scale.x = 1 + Math.sin(time * 0.3) * 0.2;
        particlesRef.current.scale.y = 1 + Math.sin(time * 0.5) * 0.2;
        particlesRef.current.scale.z = 1 + Math.sin(time * 0.4) * 0.2;
        
        // Particles sway with time
        const positions = particlesRef.current.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const px = positions.getX(i);
          const py = positions.getY(i);
          const pz = positions.getZ(i);
          
          // Add subtle wave motion to particles
          positions.setX(i, px + Math.sin(time * 0.5 + py * 0.05) * 0.05);
          positions.setY(i, py + Math.cos(time * 0.3 + px * 0.05) * 0.05);
          
          // Flag the attribute as needing an update
          positions.needsUpdate = true;
        }
      }
      
      // Animate camera position for dynamic effect
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.sin(time * 0.2) * 3;
        cameraRef.current.position.y = Math.cos(time * 0.1) * 3;
        cameraRef.current.lookAt(0, 0, 0);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      }
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className || "fixed top-0 left-0 w-full h-full -z-10 opacity-80"}
      data-testid="animated-background"
    />
  );
};
