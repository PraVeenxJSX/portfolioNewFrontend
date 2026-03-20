import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function Character() {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/RobotExpressive.glb');
  const { actions } = useAnimations(animations, groupRef);

  // Blink state
  const blinkState = useRef({ next: 2, active: false, start: 0 });

  // Start Idle animation
  useEffect(() => {
    if (actions && actions['Idle']) {
      actions['Idle'].reset().fadeIn(0.5).play();
    }
    return () => {
      if (actions && actions['Idle']) actions['Idle'].fadeOut(0.5);
    };
  }, [actions]);

  // Setup materials for better look
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.2;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Collect all meshes with morph targets for eye blink
  const morphMeshes = useMemo(() => {
    const meshes = [];
    if (!scene) return meshes;
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
        meshes.push(child);
      }
    });
    return meshes;
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Eye blink using morph targets
    const b = blinkState.current;
    if (t > b.next && !b.active) {
      b.active = true;
      b.start = t;
    }

    let blinkValue = 0;
    if (b.active) {
      const e = t - b.start;
      if (e < 0.08) blinkValue = e / 0.08;
      else if (e < 0.16) blinkValue = 1 - (e - 0.08) / 0.08;
      else {
        b.active = false;
        b.next = t + (Math.random() > 0.75 ? 0.3 : 2 + Math.random() * 3);
      }
    }

    // Apply blink to morph targets
    morphMeshes.forEach((mesh) => {
      const dict = mesh.morphTargetDictionary;
      // RobotExpressive uses "Surprised" or other face targets — try common names
      const eyeTargets = ['Blink', 'Eye Close', 'EyeClose', 'eyesClosed', 'Surprised'];
      for (const name of eyeTargets) {
        if (dict[name] !== undefined) {
          mesh.morphTargetInfluences[dict[name]] = blinkValue;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -1.6, 0]} scale={0.9}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/RobotExpressive.glb');
