'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

// Model scaling configuration based on category
const MODEL_SCALES: Record<string, number> = {
  mattress: 0.3, // Further reduced - mattress models are often very large
  furniture: 0.5, // For sofa and other furniture
  sofa: 0.5,
  chair: 1.0,
  table: 0.8,
  default: 1.0,
};

// Camera positions based on category
const CAMERA_POSITIONS: Record<string, [number, number, number]> = {
  mattress: [0, 1, 3], // Closer camera for mattress
  furniture: [0, 1.5, 4], // For sofa and furniture
  sofa: [0, 1.5, 4],
  chair: [0, 1.5, 3],
  table: [0, 2, 4],
  default: [0, 2, 5],
};

function Model3D({ 
  modelPath, 
  category 
}: { 
  modelPath?: string;
  category?: string;
}) {
  // If no model path is provided, create a placeholder based on category
  if (!modelPath) {
    return <PlaceholderModel category={category} />;
  }

  // Load actual 3D model if path is provided
  // Error handling is done inside LoadedModel
  return <LoadedModel modelPath={modelPath} category={category} />;
}

// Placeholder models for different categories
function PlaceholderModel({ category }: { category?: string }) {
  const scale = MODEL_SCALES[category || 'default'] || MODEL_SCALES.default;
  
  switch (category) {
    case 'mattress':
      return (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5 * scale, 0.8 * scale, 2 * scale]} />
          <meshStandardMaterial color="#2c2c2c" />
          <mesh position={[0, 0.5 * scale, 0]}>
            <boxGeometry args={[2.5 * scale, 0.2 * scale, 2 * scale]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </mesh>
      );
    case 'furniture':
    case 'sofa':
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2 * scale, 0.6 * scale, 1 * scale]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
          <mesh position={[-0.8 * scale, 0.6, 0]}>
            <boxGeometry args={[0.4 * scale, 0.6 * scale, 1 * scale]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.8 * scale, 0.6, 0]}>
            <boxGeometry args={[0.4 * scale, 0.6 * scale, 1 * scale]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      );
    case 'chair':
      return (
        <group>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.8 * scale, 0.8 * scale, 0.8 * scale]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
          <mesh position={[0, 0.1, -0.3 * scale]}>
            <boxGeometry args={[0.8 * scale, 0.2 * scale, 0.2 * scale]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh>
          <boxGeometry args={[2 * scale, 1 * scale, 2 * scale]} />
          <meshStandardMaterial color="#2c2c2c" />
        </mesh>
      );
  }
}

// Separate component for loading actual models (hooks must be called unconditionally)
function LoadedModel({ 
  modelPath, 
  category 
}: { 
  modelPath: string;
  category?: string;
}) {
  try {
    const { scene } = useGLTF(modelPath);
    const scale = useMemo(() => MODEL_SCALES[category || 'default'] || MODEL_SCALES.default, [category]);
    
    // Clone the scene to avoid issues with multiple instances
    const clonedScene = useMemo(() => {
      if (!scene) {
        console.warn(`Scene is null for model: ${modelPath}`);
        return null;
      }
      const cloned = scene.clone();
      
      // Center and normalize the model
      if (cloned) {
        // Calculate bounding box to center the model
        const box = new THREE.Box3().setFromObject(cloned);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center the model
        cloned.position.x = -center.x;
        cloned.position.y = -center.y;
        cloned.position.z = -center.z;
        
        // Scale to fit if model is too large (mattress models are often very large)
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 3) {
          const autoScale = 1.5 / maxDim;
          cloned.scale.multiplyScalar(autoScale);
        }
        
        // Ensure model is visible and materials are properly lit
        cloned.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.visible = true;
            // Make sure materials are properly configured
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat: THREE.Material) => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.needsUpdate = true;
                  }
                });
              } else if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material.needsUpdate = true;
              }
            }
          }
        });
      }
      
      return cloned;
    }, [scene, modelPath]);
    
    if (!clonedScene) {
      return <PlaceholderModel category={category} />;
    }
    
    return (
      <primitive 
        object={clonedScene} 
        scale={scale}
        position={[0, 0, 0]}
      />
    );
  } catch (error) {
    console.warn(`Failed to load 3D model: ${modelPath}`, error);
    return <PlaceholderModel category={category} />;
  }
}

export default function Scene3D({ 
  modelPath, 
  category,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = true,
  autoRotateSpeed = 1
}: { 
  modelPath?: string;
  category?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}) {
  const cameraPosition = CAMERA_POSITIONS[category || 'default'] || CAMERA_POSITIONS.default;
  
  return (
    <Canvas className="w-full h-full">
      <Suspense fallback={<PlaceholderModel category={category} />}>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        {/* Enhanced lighting for better model visibility */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 10, 5]} intensity={2.0} />
        <directionalLight position={[-10, 5, -5]} intensity={1.5} />
        <pointLight position={[0, 10, 0]} intensity={1.0} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, -5]} intensity={0.8} />
        <Model3D modelPath={modelPath} category={category} />
        <OrbitControls 
          enableZoom={false} 
          autoRotate={autoRotate} 
          autoRotateSpeed={autoRotateSpeed}
          enablePan={false}
        />
      </Suspense>
    </Canvas>
  );
}
