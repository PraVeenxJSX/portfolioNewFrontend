import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function FloatingIcosahedron() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.15;
    ref.current.rotation.y = clock.getElapsedTime() * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[1.5, 1]} position={[2.5, 0.5, -2]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          wireframe
          distort={0.3}
          speed={2}
          transparent
          opacity={0.3}
        />
      </Icosahedron>
    </Float>
  );
}

function FloatingSphere() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.5}>
      <Sphere ref={ref} args={[1, 32, 32]} position={[-3, -1, -3]}>
        <MeshDistortMaterial
          color="#06d6a0"
          wireframe
          distort={0.4}
          speed={3}
          transparent
          opacity={0.2}
        />
      </Sphere>
    </Float>
  );
}

function FloatingTorus() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.3;
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
      <Torus ref={ref} args={[1, 0.3, 16, 32]} position={[3.5, -2, -4]}>
        <MeshWobbleMaterial
          color="#8b5cf6"
          wireframe
          factor={0.4}
          speed={2}
          transparent
          opacity={0.25}
        />
      </Torus>
    </Float>
  );
}

function SmallOrbs() {
  const count = 50;
  const meshRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const posArr = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(time + i) * 0.002;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function ParticleRing() {
  const ref = useRef();
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 4 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 3;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.1;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#06d6a0"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -5]} color="#06d6a0" intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#8b5cf6" intensity={0.3} />

      <FloatingIcosahedron />
      <FloatingSphere />
      <FloatingTorus />
      <SmallOrbs />
      <ParticleRing />
    </Canvas>
  );
}
