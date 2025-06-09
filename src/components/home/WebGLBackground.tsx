
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    mesh?: THREE.LineSegments;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Create plexus network
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const vertices = [];
    const totalPoints = 120;
    
    for (let i = 0; i < totalPoints; i++) {
      const x = THREE.MathUtils.randFloatSpread(200);
      const y = THREE.MathUtils.randFloatSpread(200);
      const z = THREE.MathUtils.randFloatSpread(200);
      points.push(new THREE.Vector3(x, y, z));
      vertices.push(x, y, z);
    }

    const indices = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < 35) {
          indices.push(i, j);
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    const material = new THREE.LineBasicMaterial({ 
      color: 0xb99364, 
      transparent: true, 
      opacity: 0.7 
    });
    const mesh = new THREE.LineSegments(geometry, material);
    scene.add(mesh);

    // Mouse tracking for 3D effect
    const mouse = { x: 0, y: 0 };
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    function animate() {
      // Opposite mouse movement for 3D effect
      mesh.rotation.y = -mouse.x * 0.1;
      mesh.rotation.x = -mouse.y * 0.1;
      
      // Gentle auto-rotation
      mesh.rotation.z += 0.001;
      
      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    }

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store references for cleanup
    sceneRef.current = { scene, camera, renderer, mesh };
    
    // Start animation
    animate();

    console.log('Three.js WebGL background initialized successfully');

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (sceneRef.current.renderer) {
        container.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current.renderer.dispose();
      }
      
      if (sceneRef.current.mesh) {
        sceneRef.current.mesh.geometry.dispose();
        (sceneRef.current.mesh.material as THREE.Material).dispose();
      }
      
      console.log('Three.js WebGL background cleaned up');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        width: '100vw',
        height: '100vh'
      }}
    />
  );
}
