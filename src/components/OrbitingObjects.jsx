import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Colors for the aesthetic lines
const LINE_COLORS = [
  '#8b5cf6', // purple
  '#06d6a0', // emerald
  '#c084fc', // light purple
  '#34d399', // light emerald
  '#a78bfa', // lavender
  '#10b981', // green
];

// A single orbital ring of flowing line
function OrbitalLine({ radius, tilt, speed, offset, color, height, segments = 128, scrollProgress }) {
  const lineRef = useRef();

  const positions = useMemo(() => new Float32Array(segments * 3), [segments]);
  const opacities = useMemo(() => new Float32Array(segments), [segments]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = clock.getElapsedTime();
    const posArr = lineRef.current.geometry.attributes.position.array;
    const opArr = lineRef.current.geometry.attributes.opacity.array;

    const scrollBoost = 1 + scrollProgress.current * 2;
    const currentSpeed = speed * scrollBoost;
    // Radius pulses with scroll
    const r = radius * (1 - scrollProgress.current * 0.15);

    for (let i = 0; i < segments; i++) {
      const frac = i / segments;
      const angle = frac * Math.PI * 2 + t * currentSpeed + offset;

      // Create flowing wave in the ring
      const wave = Math.sin(angle * 3 + t * 2) * 0.15;
      const verticalWave = Math.sin(angle * 2 + t * 1.5) * 0.2;

      posArr[i * 3] = Math.cos(angle) * (r + wave);
      posArr[i * 3 + 1] = height + verticalWave + Math.sin(angle * 4 + t) * 0.08;
      posArr[i * 3 + 2] = Math.sin(angle) * (r + wave);

      // Trailing opacity - creates a comet-tail effect
      const trail = (Math.sin(angle - t * currentSpeed * 2) + 1) * 0.5;
      opArr[i] = trail * 0.7 + 0.1;
    }

    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.geometry.attributes.opacity.needsUpdate = true;

    // Apply tilt rotation
    lineRef.current.rotation.x = tilt;
    lineRef.current.rotation.z = tilt * 0.5;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={segments} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-opacity" count={segments} array={opacities} itemSize={1} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
}

// Floating dot particles along orbital paths
function OrbitalDots({ scrollProgress }) {
  const dotsRef = useRef();
  const count = 80;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2 + Math.random() * 2;
      const h = (Math.random() - 0.5) * 3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = h;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      const c = new THREE.Color(LINE_COLORS[i % LINE_COLORS.length]);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame(({ clock }) => {
    if (!dotsRef.current) return;
    const t = clock.getElapsedTime();
    const posArr = dotsRef.current.geometry.attributes.position.array;
    const scrollBoost = 1 + scrollProgress.current * 2.5;

    for (let i = 0; i < count; i++) {
      const baseAngle = Math.atan2(originalPositions[i * 3 + 2], originalPositions[i * 3]);
      const baseR = Math.sqrt(
        originalPositions[i * 3] ** 2 + originalPositions[i * 3 + 2] ** 2
      );
      const newAngle = baseAngle + t * 0.3 * scrollBoost * ((i % 2 === 0) ? 1 : -1);
      const r = baseR * (1 - scrollProgress.current * 0.1);

      posArr[i * 3] = Math.cos(newAngle) * r;
      posArr[i * 3 + 1] = originalPositions[i * 3 + 1] + Math.sin(t * 0.5 + i) * 0.15;
      posArr[i * 3 + 2] = Math.sin(newAngle) * r;
    }

    dotsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={dotsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Vertical energy streams
function EnergyStreams({ scrollProgress }) {
  const count = 4;
  const refs = useRef([]);

  const streams = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      radius: 2.8 + Math.random() * 0.5,
      speed: 0.15 + Math.random() * 0.1,
      color: LINE_COLORS[i % LINE_COLORS.length],
      segments: 40,
    })), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scrollBoost = 1 + scrollProgress.current * 2;

    refs.current.forEach((ref, si) => {
      if (!ref) return;
      const stream = streams[si];
      const posArr = ref.geometry.attributes.position.array;
      const currentAngle = stream.angle + t * stream.speed * scrollBoost;
      const r = stream.radius * (1 - scrollProgress.current * 0.12);

      for (let i = 0; i < stream.segments; i++) {
        const frac = i / stream.segments;
        const y = (frac - 0.5) * 4;
        const spiral = Math.sin(frac * Math.PI * 6 + t * 2) * 0.15;

        posArr[i * 3] = Math.cos(currentAngle + spiral) * (r + spiral * 0.5);
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = Math.sin(currentAngle + spiral) * (r + spiral * 0.5);
      }

      ref.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <>
      {streams.map((stream, si) => (
        <line key={si} ref={(el) => { refs.current[si] = el; }}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={stream.segments}
              array={new Float32Array(stream.segments * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={stream.color}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}
    </>
  );
}

export default function RevolvingLines({ scrollProgress }) {
  return (
    <group>
      {/* Main orbital rings at different heights and tilts */}
      <OrbitalLine radius={2.5} tilt={0.1} speed={0.4} offset={0} color="#8b5cf6" height={0.5} scrollProgress={scrollProgress} />
      <OrbitalLine radius={3.0} tilt={-0.2} speed={-0.3} offset={2} color="#06d6a0" height={-0.2} scrollProgress={scrollProgress} />
      <OrbitalLine radius={2.2} tilt={0.35} speed={0.5} offset={4} color="#c084fc" height={1.2} scrollProgress={scrollProgress} />
      <OrbitalLine radius={3.5} tilt={-0.15} speed={-0.25} offset={1} color="#34d399" height={-0.8} scrollProgress={scrollProgress} />
      <OrbitalLine radius={2.8} tilt={0.4} speed={0.35} offset={3} color="#a78bfa" height={0.0} scrollProgress={scrollProgress} />

      {/* Floating dots */}
      <OrbitalDots scrollProgress={scrollProgress} />

      {/* Vertical energy streams */}
      <EnergyStreams scrollProgress={scrollProgress} />
    </group>
  );
}
