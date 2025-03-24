
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
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Increased particle count
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);
    
    // Fill positions with random values
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Random positions for particles - create a more distributed field
      posArray[i] = (Math.random() - 0.5) * 70;        // x
      posArray[i + 1] = (Math.random() - 0.5) * 70;    // y
      posArray[i + 2] = (Math.random() - 0.5) * 70;    // z
      
      // Enhanced blue-purple gradient colors for particles
      colorArray[i] = 0.5 + Math.random() * 0.5;       // Blue (more variation)
      colorArray[i + 1] = 0.3 + Math.random() * 0.3;   // Green (less)
      colorArray[i + 2] = 0.8 + Math.random() * 0.2;   // Red (more purple tint)
      
      // Varied particle sizes
      sizeArray[i/3] = 0.3 + Math.random() * 0.7;      // Different sizes for visual interest
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
    
    // Create particle material with custom shader
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15, // Base size is larger
      sizeAttenuation: true, // Size changes with distance
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Helps with transparency
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop with more dynamic movement
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      
      if (particlesRef.current) {
        // More noticeable rotation and movement
        particlesRef.current.rotation.x += 0.0003;
        particlesRef.current.rotation.y += 0.0005;
        
        // Add subtle pulsing effect
        const time = clockRef.current.getElapsedTime();
        particlesRef.current.scale.x = 1 + Math.sin(time * 0.2) * 0.05;
        particlesRef.current.scale.y = 1 + Math.sin(time * 0.3) * 0.05;
        particlesRef.current.scale.z = 1 + Math.sin(time * 0.4) * 0.05;
      }
      
      // Gently move camera
      if (cameraRef.current) {
        const time = clockRef.current.getElapsedTime() * 0.5;
        cameraRef.current.position.x = Math.sin(time * 0.2) * 1;
        cameraRef.current.position.y = Math.cos(time * 0.1) * 1;
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
      className={className || "absolute top-0 left-0 w-full h-full -z-10"}
      data-testid="animated-background"
    />
  );
};
