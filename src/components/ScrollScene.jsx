import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, TorusKnot, Dodecahedron, Octahedron } from '@react-three/drei';

function RotatingTorusKnot({ scrollProgress }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.1 + scrollProgress * Math.PI * 2;
    ref.current.rotation.y = t * 0.15 + scrollProgress * Math.PI;
    ref.current.scale.setScalar(1 + scrollProgress * 0.3);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <TorusKnot ref={ref} args={[1, 0.3, 128, 16]} position={[3, 0, -2]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          wireframe
          distort={0.2}
          speed={2}
          transparent
          opacity={0.25}
        />
      </TorusKnot>
    </Float>
  );
}

function RotatingDodecahedron({ scrollProgress }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.2 + scrollProgress * Math.PI;
    ref.current.rotation.z = t * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Dodecahedron ref={ref} args={[1.2]} position={[-3, -1, -3]}>
        <MeshDistortMaterial
          color="#06d6a0"
          wireframe
          distort={0.25}
          speed={1.5}
          transparent
          opacity={0.2}
        />
      </Dodecahedron>
    </Float>
  );
}

function RotatingOctahedron({ scrollProgress }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.25 + scrollProgress * Math.PI * 1.5;
    ref.current.rotation.x = t * 0.1;
    ref.current.position.y = Math.sin(scrollProgress * Math.PI) * 2;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <Octahedron ref={ref} args={[0.8]} position={[0, 2, -2]}>
        <meshStandardMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.3}
        />
      </Octahedron>
    </Float>
  );
}

export default function ScrollScene({ scrollProgress = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#8b5cf6" intensity={0.4} />
      <pointLight position={[-5, -5, -5]} color="#06d6a0" intensity={0.3} />

      <RotatingTorusKnot scrollProgress={scrollProgress} />
      <RotatingDodecahedron scrollProgress={scrollProgress} />
      <RotatingOctahedron scrollProgress={scrollProgress} />
    </Canvas>
  );
}
