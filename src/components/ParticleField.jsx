import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ mouse }) {
  const meshRef = useRef();
  const count = 800;
  const { viewport } = useThree();

  const [positions, originalPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10 - 2;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
    }
    return [pos, orig, vel];
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#8b5cf6');
    const pink = new THREE.Color('#06d6a0');
    for (let i = 0; i < count; i++) {
      const c = Math.random() > 0.5 ? cyan : pink;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const posArr = meshRef.current.geometry.attributes.position.array;
    const time = clock.getElapsedTime();

    const mx = (mouse.current.x / window.innerWidth) * 2 - 1;
    const my = -(mouse.current.y / window.innerHeight) * 2 + 1;
    const mouseX = mx * (viewport.width / 2);
    const mouseY = my * (viewport.height / 2);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gentle float motion
      posArr[i3 + 1] = originalPositions[i3 + 1] + Math.sin(time * 0.3 + i * 0.1) * 0.15;
      posArr[i3] = originalPositions[i3] + Math.cos(time * 0.2 + i * 0.05) * 0.1;

      // Mouse repulsion
      const dx = posArr[i3] - mouseX;
      const dy = posArr[i3 + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        const force = (2 - dist) * 0.02;
        posArr[i3] += dx * force;
        posArr[i3 + 1] += dy * force;
      }
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ConnectionLines({ mouse }) {
  const lineRef = useRef();
  const count = 100;
  const { viewport } = useThree();

  const positions = useMemo(() => {
    return new Float32Array(count * 2 * 3); // pairs of points for lines
  }, []);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const time = clock.getElapsedTime();
    const posArr = lineRef.current.geometry.attributes.position.array;

    const mx = (mouse.current.x / window.innerWidth) * 2 - 1;
    const my = -(mouse.current.y / window.innerHeight) * 2 + 1;
    const mouseX = mx * (viewport.width / 2);
    const mouseY = my * (viewport.height / 2);

    for (let i = 0; i < count; i++) {
      const i6 = i * 6;
      const angle = (i / count) * Math.PI * 2 + time * 0.1;
      const radius = 3 + Math.sin(time * 0.5 + i) * 1;

      posArr[i6] = mouseX + Math.cos(angle) * 0.3;
      posArr[i6 + 1] = mouseY + Math.sin(angle) * 0.3;
      posArr[i6 + 2] = 0;
      posArr[i6 + 3] = Math.cos(angle) * radius;
      posArr[i6 + 4] = Math.sin(angle) * radius;
      posArr[i6 + 5] = -2;
    }

    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function ParticleField() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'all',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <Particles mouse={mouse} />
        <ConnectionLines mouse={mouse} />
      </Canvas>
    </div>
  );
}
