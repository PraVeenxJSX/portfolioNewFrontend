import React, {
  useEffect, useRef, useState, useMemo, useCallback, Suspense
} from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import styles from './Home.module.scss';

// ─────────────────────────────────────────────
// PARTICLE FIELD
// ─────────────────────────────────────────────
function ParticleField() {
  const ref = useRef();
  const count = 800;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.54, 0.36, 0.96],
      [0.02, 0.84, 0.63],
      [0.96, 0.36, 0.6],
      [1.0, 0.8, 0.2],
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.008;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.003) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ─────────────────────────────────────────────
// CORE PULSAR — dual wireframe + glowing nucleus
// ─────────────────────────────────────────────
function CorePulsar() {
  const innerRef = useRef();
  const outerRef = useRef();
  const coreRef  = useRef();
  const c1Ref    = useRef();
  const c2Ref    = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.65;
      innerRef.current.rotation.y = t * 0.4;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -t * 0.28;
      outerRef.current.rotation.z =  t * 0.2;
    }
    if (coreRef.current) {
      const s = 1 + 0.13 * Math.sin(t * 2.6);
      coreRef.current.scale.setScalar(s);
    }
    if (c1Ref.current) {
      c1Ref.current.material.opacity = 0.1 + 0.07 * Math.sin(t * 2.1);
      c1Ref.current.scale.setScalar(1 + 0.2 * Math.sin(t * 1.6));
    }
    if (c2Ref.current) {
      c2Ref.current.material.opacity = 0.04 + 0.03 * Math.sin(t * 1.3 + 1);
      c2Ref.current.scale.setScalar(1 + 0.12 * Math.sin(t * 1.0 + 0.5));
    }
  });

  return (
    <group>
      {/* Slow outer wireframe dodecahedron */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial color="#7c3aed" emissive="#5b21b6" emissiveIntensity={0.6}
          wireframe transparent opacity={0.35} />
      </mesh>
      {/* Faster inner wireframe icosahedron */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={1.5}
          wireframe transparent opacity={0.85} />
      </mesh>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={2.5}
          roughness={0} metalness={0.3} />
      </mesh>
      {/* Corona 1 */}
      <mesh ref={c1Ref}>
        <sphereGeometry args={[0.52, 16, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.10} side={THREE.BackSide} />
      </mesh>
      {/* Corona 2 */}
      <mesh ref={c2Ref}>
        <sphereGeometry args={[0.88, 16, 16]} />
        <meshBasicMaterial color="#6d28d9" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// ORBITAL RING — torus + orbiting light nodes
// ─────────────────────────────────────────────
function OrbitalRing({ radius, tilt, speed, color, travelerCount = 3 }) {
  const ringRef  = useRef();
  const nodeRefs = useRef([]);
  const phases   = useMemo(
    () => Array.from({ length: travelerCount }, (_, i) => (i / travelerCount) * Math.PI * 2),
    [travelerCount],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current)
      ringRef.current.material.opacity = 0.18 + 0.1 * Math.sin(t * 2 + radius);

    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const a = phases[i] + t * speed;
      mesh.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      mesh.scale.setScalar(0.7 + 0.5 * Math.sin(t * 3 + i * 1.8));
    });
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.008, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      {phases.map((_, i) => (
        <mesh key={i} ref={el => { nodeRefs.current[i] = el; }}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5}
            transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// NEURAL SPHERE — fibonacci nodes + connection lines
// ─────────────────────────────────────────────
function NeuralSphere() {
  const groupRef  = useRef();
  const pointsRef = useRef();
  const linesRef  = useRef();
  const N = 120;

  const { base, flatConns, segCount } = useMemo(() => {
    const pos    = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y  = 1 - (i / (N - 1)) * 2;
      const r  = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      pos[i*3]   = Math.cos(th) * r * 1.75;
      pos[i*3+1] = y * 1.75;
      pos[i*3+2] = Math.sin(th) * r * 1.75;
    }
    // nearest-neighbour connections, max 4 per node
    const pairs = [];
    const cnt   = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      if (cnt[i] >= 4) continue;
      const near = [];
      for (let j = i + 1; j < N; j++) {
        if (cnt[j] >= 4) continue;
        const dx = pos[i*3]-pos[j*3], dy = pos[i*3+1]-pos[j*3+1], dz = pos[i*3+2]-pos[j*3+2];
        const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < 0.96) near.push([j, d]);
      }
      near.sort((a, b) => a[1] - b[1]);
      for (const [j] of near.slice(0, Math.min(3, 4 - cnt[i]))) {
        pairs.push(i, j);
        cnt[i]++; cnt[j]++;
      }
    }
    const segCount = pairs.length >> 1;
    return { base: pos, flatConns: new Int32Array(pairs), segCount };
  }, []);

  const linesBuffer = useMemo(() => new Float32Array(segCount * 6), [segCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.07) * 0.2;
    }
    if (!pointsRef.current || !linesRef.current) return;

    const pAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < N; i++) {
      const s = 1 + 0.065 * Math.sin(t * 1.4 + i * 0.38);
      pAttr.setXYZ(i, base[i*3]*s, base[i*3+1]*s, base[i*3+2]*s);
    }
    pAttr.needsUpdate = true;

    const lAttr = linesRef.current.geometry.attributes.position;
    for (let c = 0; c < segCount; c++) {
      const ia = flatConns[c*2], ib = flatConns[c*2+1];
      lAttr.setXYZ(c*2,   pAttr.getX(ia), pAttr.getY(ia), pAttr.getZ(ia));
      lAttr.setXYZ(c*2+1, pAttr.getX(ib), pAttr.getY(ib), pAttr.getZ(ib));
    }
    lAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={N} array={base.slice()} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#c4b5fd" transparent opacity={0.8} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={segCount * 2} array={linesBuffer} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.16} />
      </lineSegments>
    </group>
  );
}

// ─────────────────────────────────────────────
// DATA DNA — rotating double helix
// ─────────────────────────────────────────────
function DataDNA() {
  const groupRef = useRef();
  const N      = 22;
  const TURNS  = 5;
  const R      = 0.28;
  const HEIGHT = 2.6;

  const nodes = useMemo(() =>
    Array.from({ length: N }, (_, i) => {
      const frac  = i / (N - 1);
      return { angle: frac * Math.PI * 2 * TURNS, y: frac * HEIGHT - HEIGHT / 2 };
    }), []);

  useFrame(({ clock }) => {
    if (groupRef.current)
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.45;
  });

  return (
    <group ref={groupRef} position={[3.0, 0, 0.5]}>
      {nodes.map((n, i) => (
        <React.Fragment key={i}>
          <mesh position={[Math.cos(n.angle) * R, n.y, Math.sin(n.angle) * R]}>
            <sphereGeometry args={[0.042, 8, 8]} />
            <meshStandardMaterial color="#06d6a0" emissive="#06d6a0" emissiveIntensity={1.8} />
          </mesh>
          <mesh position={[Math.cos(n.angle + Math.PI) * R, n.y, Math.sin(n.angle + Math.PI) * R]}>
            <sphereGeometry args={[0.042, 8, 8]} />
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={1.8} />
          </mesh>
          {i % 3 === 0 && (
            <mesh position={[0, n.y, 0]} rotation={[0, -n.angle, 0]}>
              <boxGeometry args={[R * 2 + 0.02, 0.01, 0.01]} />
              <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={1.0}
                transparent opacity={0.75} />
            </mesh>
          )}
        </React.Fragment>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// DIGITAL NEXUS — main scene centerpiece
// ─────────────────────────────────────────────
function DigitalNexus({ scrollProgress }) {
  const rootRef = useRef();

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const sp = scrollProgress.current;
    if (rootRef.current)
      rootRef.current.rotation.y = sp * Math.PI * 1.2 + Math.sin(t * 0.15) * 0.08;
  });

  return (
    <group ref={rootRef}>
      <CorePulsar />
      <NeuralSphere />
      <OrbitalRing radius={2.1} tilt={Math.PI / 4}   speed={0.55}  color="#8b5cf6" travelerCount={3} />
      <OrbitalRing radius={2.5} tilt={-Math.PI / 3}  speed={-0.4}  color="#06d6a0" travelerCount={4} />
      <OrbitalRing radius={1.7} tilt={Math.PI / 2.2} speed={0.8}   color="#f43f5e" travelerCount={2} />
      <DataDNA />
      {/* Ground disc glow */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// SMOOTH SCROLL-DRIVEN CAMERA
// ─────────────────────────────────────────────
function CameraRig({ scrollProgress }) {
  const { camera } = useThree();

  // Rich multi-stop camera path for nexus centered at origin
  const path = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.8,  1.0,  7.0),   // t=0    wide hero shot
    new THREE.Vector3(-0.5, 1.5,  4.5),   // t=0.2  zoom in, slight left
    new THREE.Vector3(0.0,  0.0,  3.2),   // t=0.35 close frontal
    new THREE.Vector3(1.5, -0.5,  4.0),   // t=0.5  right low (DNA visible)
    new THREE.Vector3(-1.8, 0.8,  5.5),   // t=0.65 wide left arc
    new THREE.Vector3(0.3,  2.0,  6.0),   // t=0.8  high angle pull-back
    new THREE.Vector3(0.0,  0.5,  7.0),   // t=1.0  back to wide
  ], false, 'catmullrom', 0.5), []);

  const lookPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0,  0.2, 0),
    new THREE.Vector3( 0,  0.3, 0),
    new THREE.Vector3( 0,  0.0, 0),
    new THREE.Vector3( 0, -0.2, 0),
    new THREE.Vector3( 0,  0.4, 0),
    new THREE.Vector3( 0,  0.1, 0),
    new THREE.Vector3( 0,  0.2, 0),
  ], false, 'catmullrom', 0.5), []);

  const currentLook = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame(() => {
    const t = Math.min(Math.max(scrollProgress.current, 0), 1);
    const target = path.getPointAt(t);
    const look = lookPath.getPointAt(t);
    camera.position.lerp(target, 0.04);
    currentLook.current.lerp(look, 0.04);
    camera.lookAt(currentLook.current);
  });

  return null;
}

// ─────────────────────────────────────────────
// TYPEWRITER
// ─────────────────────────────────────────────
const TypeWriter = ({ words, speed = 75, deleteSpeed = 35, pause = 2800 }) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout;
    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex(p => (p + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(isDeleting
          ? current.substring(0, text.length - 1)
          : current.substring(0, text.length + 1));
      }, isDeleting ? deleteSpeed : speed);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, deleteSpeed, pause]);

  return (
    <span className={styles.typewriter}>
      {text}<span className={styles.cursor}>_</span>
    </span>
  );
};

// ─────────────────────────────────────────────
// MAIN HOME
// ─────────────────────────────────────────────
const Home = () => {
  const scrollRef = useRef(0);
  const containerRef = useRef(null);
  const [scrollFloat, setScrollFloat] = useState(0);
  const [section, setSection] = useState(0); // 0=hero,1=about,2=stack,3=cta

  const handleScroll = useCallback(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    scrollRef.current = progress;
    setScrollFloat(progress);
    // section detection
    if (progress < 0.22) setSection(0);
    else if (progress < 0.48) setSection(1);
    else if (progress < 0.74) setSection(2);
    else setSection(3);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const roles = ['Full Stack Developer', 'React Specialist', 'Node.js Architect', 'UI/UX Visionary'];

  const techStack = [
    { name: 'React', icon: '⚛', color: '#61dafb' },
    { name: 'Node.js', icon: '🟢', color: '#68a063' },
    { name: 'TypeScript', icon: '📘', color: '#3178c6' },
    { name: 'Java', icon: '☕', color: '#f89820' },
    { name: 'MongoDB', icon: '🍃', color: '#47a248' },
    { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
  ];

  // Smooth fade per section
  const fade = (from, to) => {
    if (scrollFloat < from) return 0;
    if (scrollFloat > to) return 0;
    const mid = (from + to) / 2;
    if (scrollFloat <= mid) return (scrollFloat - from) / (mid - from);
    return 1 - (scrollFloat - mid) / (to - mid);
  };

  const heroOpacity = scrollFloat < 0.18 ? 1 : Math.max(0, 1 - (scrollFloat - 0.18) / 0.08);
  const aboutOpacity = fade(0.18, 0.5);
  const stackOpacity = fade(0.45, 0.78);
  const ctaOpacity = fade(0.74, 1.0);

  return (
    <div ref={containerRef} className={styles.root}>
      {/* ── Fixed 3D scene ── */}
      <div className={styles.canvasWrapper}>
        <Canvas
          camera={{ position: [0.8, 1.0, 7.0], fov: 52 }}
          gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <CameraRig scrollProgress={scrollRef} />
            <ParticleField />

            {/* Lighting rig */}
            <ambientLight intensity={0.25} />
            <directionalLight position={[4, 6, 4]} intensity={0.9} color="#e8e0ff" castShadow />
            <pointLight position={[-4, 4, 3]} intensity={1.0} color="#8b5cf6" distance={14} />
            <pointLight position={[4, 2, -2]} intensity={0.6} color="#06d6a0" distance={12} />
            <pointLight position={[0, 6, -4]} intensity={0.5} color="#c084fc" distance={10} />
            <pointLight position={[0, -1, 3]} intensity={0.4} color="#7c3aed" distance={8} />
            {/* Rim light */}
            <pointLight position={[0, 3, -3]} intensity={0.7} color="#8b5cf6" distance={7} />

            <DigitalNexus scrollProgress={scrollRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Scroll content ── */}
      <div className={styles.scrollContainer}>

        {/* HERO */}
        <section className={styles.section} style={{
          opacity: heroOpacity,
          filter: `blur(${(1 - heroOpacity) * 3}px)`,
        }}>
          <div className={styles.heroContent}>
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <span className={styles.wave}>✦</span> Welcome to my universe
            </motion.div>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Praveen<br /><span className={styles.gradient}>Kumar</span>
            </motion.h1>

            <motion.h2
              className={styles.heroSub}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
            >
              <TypeWriter words={roles} />
            </motion.h2>

            <motion.p
              className={styles.heroDesc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Crafting exceptional digital experiences at the intersection of
              performance and artistry.
            </motion.p>

            <motion.div
              className={styles.heroBtns}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Link to="/projects" className={styles.btnPrimary}>View My Work</Link>
              <Link to="/contact" className={styles.btnSecondary}>Let's Talk</Link>
            </motion.div>

            <motion.div
              className={styles.scrollHint}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Scroll to explore</span>
              <div className={styles.scrollChevrons}>
                <span>›</span><span>›</span><span>›</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          className={styles.section}
          style={{
            opacity: aboutOpacity,
            filter: `blur(${(1 - aboutOpacity) * 3}px)`,
            transform: `translateX(${(1 - aboutOpacity) * -40}px)`,
          }}
        >
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              About <span className={styles.gradient}>Me</span>
            </h2>
            <div className={styles.aboutGrid}>
              {[
                { icon: '🚀', title: 'The Journey', text: 'I fell in love with programming and have been on an incredible journey ever since — building solutions that make a real difference.' },
                { icon: '⚡', title: 'The Craft', text: 'Fluent in Java and JavaScript, specializing in cutting-edge web applications using modern frameworks and clean architecture.' },
                { icon: '🎯', title: 'The Mission', text: 'Creating exceptional products with Node.js, React.js, and React-Native. Every pixel, every function, every interaction — intentional.' },
              ].map((card, i) => (
                <div key={i} className={styles.glassCard} style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section
          className={styles.section}
          style={{
            opacity: stackOpacity,
            filter: `blur(${(1 - stackOpacity) * 3}px)`,
            transform: `translateY(${(1 - stackOpacity) * 40}px)`,
          }}
        >
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              Tech <span className={styles.gradient}>Arsenal</span>
            </h2>
            <div className={styles.techGrid}>
              {techStack.map((tech, i) => (
                <div key={tech.name} className={styles.techItem} style={{ '--accent': tech.color, animationDelay: `${i * 0.08}s` }}>
                  <span className={styles.techIcon}>{tech.icon}</span>
                  <span className={styles.techName}>{tech.name}</span>
                  <span className={styles.techBar}>
                    <span className={styles.techBarFill} style={{ '--color': tech.color }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className={styles.section}
          style={{
            opacity: ctaOpacity,
            filter: `blur(${(1 - ctaOpacity) * 3}px)`,
            transform: `scale(${0.9 + ctaOpacity * 0.1})`,
          }}
        >
          <div className={styles.ctaBox}>
            <div className={styles.ctaGlow} />
            <div className={styles.ctaInner}>
              <span className={styles.ctaBadge}>✦ Available for work</span>
              <h2>Ready to build something <span className={styles.gradient}>extraordinary?</span></h2>
              <p>Let's collaborate and turn bold ideas into stunning digital reality.</p>
              <Link to="/contact" className={styles.btnCta}>
                <span>Get In Touch</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;