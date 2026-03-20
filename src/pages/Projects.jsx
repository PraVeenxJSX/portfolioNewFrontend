import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './Projects.module.scss';

const projects = [
  {
    title: 'HavensHub Real Estate',
    description: 'A modern real estate website featuring property listings, Map, Blog and a responsive design.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/PraVeenxJSX/realestate',
    live: 'https://realestate-five-kappa.vercel.app/',
    image: '/HavensHub.png',
  },
  {
    title: 'ECommerce Website',
    description: 'A sleek e-commerce platform focused on gadgets and fashion, with smooth UI interactions.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/PraVeenxJSX/Ecommerce-Website--Final',
    live: 'https://ecommerce-website-final-frontend.onrender.com/',
    image: '/ECommerceNew.png',
  },
  {
    title: 'A Chat Application',
    description: 'A real-time chat application built with a modern tech stack.',
    technologies: ['React', 'Node.js', 'Material-UI', 'MongoDB'],
    github: 'https://github.com/PraVeenxJSX/CHAT-APP',
    live: 'https://blog-frontend-five-weld.vercel.app/',
    image: '/Chat.png',
  },
  {
    title: 'React E-Commerce',
    description: 'A sleek e-commerce platform focused on gadgets and fashion, with smooth UI interactions.',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/PraVeenxJSX/React-eCommerce',
    live: 'https://react-e-commerce-zeta.vercel.app/',
    image: '/ecommerce.png',
  },
];

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [leavingIndex, setLeavingIndex] = useState(null);
  const [tappedIndex,  setTappedIndex]  = useState(null);

  const angleRef      = useRef(0);
  const angleXRef     = useRef(-60);   // start at top-down view
  const baseSpeed     = useRef(0.14);
  const currentSpeed  = useRef(0.14);
  const targetSpeed   = useRef(0.14);
  const animRef       = useRef(null);
  const carouselRef   = useRef(null);
  const isDragging    = useRef(false);
  const hasDragged    = useRef(false);
  const lastMouseX    = useRef(0);
  const lastMouseY    = useRef(0);
  const lastTouchX    = useRef(0);
  const lastTouchY    = useRef(0);
  const dragVelocity  = useRef(0);
  const leavingTimer  = useRef(null);

  /* ── Wheel: left/right spins Y, up/down tilts X ── */
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    const boost = Math.abs(delta) * 0.01;
    targetSpeed.current = (delta > 0 ? 1 : -1) * (baseSpeed.current + boost);

    clearTimeout(handleWheel._t);
    handleWheel._t = setTimeout(() => {
      targetSpeed.current = baseSpeed.current;
    }, 700);
  }, []);

  /* ── Pointer drag: X → spin, Y → tilt ── */
  const handlePointerDown = useCallback((e) => {
    isDragging.current  = true;
    lastMouseX.current  = e.clientX;
    lastMouseY.current  = e.clientY;
    dragVelocity.current = 0;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouseX.current;
    const dy = e.clientY - lastMouseY.current;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
    dragVelocity.current  = dx * 0.18;
    angleRef.current     += dx * 0.18;
    angleXRef.current    += dy * 0.18;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /* ── Touch: X → spin, Y → tilt; short tap reveals card ── */
  const handleTouchStart = useCallback((e) => {
    lastTouchX.current   = e.touches[0].clientX;
    lastTouchY.current   = e.touches[0].clientY;
    dragVelocity.current = 0;
    hasDragged.current   = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const dx = e.touches[0].clientX - lastTouchX.current;
    const dy = e.touches[0].clientY - lastTouchY.current;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged.current = true;
    lastTouchX.current   = e.touches[0].clientX;
    lastTouchY.current   = e.touches[0].clientY;
    dragVelocity.current  = dx * 0.18;
    angleRef.current     += dx * 0.18;
    angleXRef.current    += dy * 0.18;
  }, []);

  const handleCardTap = useCallback((i) => {
    if (hasDragged.current) return;
    setTappedIndex(prev => (prev === i ? null : i));
  }, []);

  /* ── Animation loop ── */
  useEffect(() => {
    const animate = () => {
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.05;
      if (!isDragging.current) {
        if (Math.abs(dragVelocity.current) > 0.01) {
          angleRef.current    += dragVelocity.current;
          dragVelocity.current *= 0.95;
        } else {
          angleRef.current += currentSpeed.current;
        }
      }
      if (carouselRef.current)
        carouselRef.current.style.transform =
          `rotateX(${angleXRef.current}deg) rotateY(${angleRef.current}deg)`;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* ── Passive-false wheel ── */
  useEffect(() => {
    const el = document.getElementById('carousel-zone');
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  /* ── Hover handlers ── */
  const handleMouseEnter = useCallback((i) => {
    if (leavingTimer.current) clearTimeout(leavingTimer.current);
    setLeavingIndex(null);
    setHoveredIndex(i);
  }, []);

  const handleMouseLeave = useCallback((i) => {
    setHoveredIndex(null);
    setLeavingIndex(i);
    leavingTimer.current = setTimeout(() => {
      setLeavingIndex(prev => (prev === i ? null : prev));
    }, 450);
  }, []);

  const count     = projects.length;
  const angleStep = 360 / count;
  const radius    = Math.min(380, window.innerWidth * 0.42);

  return (
    <div className={styles.root}>
      <div className={styles['bg-orb-1']} />
      <div className={styles['bg-orb-2']} />
      <div className={styles['bg-orb-3']} />

      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        My <span className={styles.highlight}>Projects</span>
      </motion.h2>

      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Scroll or drag to spin &middot; Drag up/down to tilt &middot; Hover or tap a card to explore
      </motion.p>

      {/* 3D Carousel Zone */}
      <div
        id="carousel-zone"
        className={styles['carousel-zone']}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className={styles['carousel-perspective']}>
          <div className={styles['carousel-tilt-wrap']}>
            <div ref={carouselRef} className={styles.carousel}>
              {projects.map((project, i) => {
                const angle     = i * angleStep;
                const isHovered = hoveredIndex === i || tappedIndex === i;
                const isLeaving = leavingIndex === i && tappedIndex !== i;

                return (
                  <div
                    key={i}
                    className={styles['card-anchor']}
                    style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                  >
                    <div
                      className={[
                        styles.card,
                        isHovered ? styles['card-hovered'] : '',
                        isLeaving ? styles['card-leaving'] : '',
                      ].join(' ')}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseLeave={() => handleMouseLeave(i)}
                      onTouchEnd={() => handleCardTap(i)}
                    >
                      <div className={styles['card-image-container']}>
                        <img
                          src={project.image}
                          alt={project.title}
                          className={styles['card-image']}
                          draggable={false}
                        />
                      </div>

                      <div className={styles['card-overlay']}>
                        <h3 className={styles['card-title']}>{project.title}</h3>
                        <p className={styles['card-desc']}>{project.description}</p>
                        <div className={styles['card-techs']}>
                          {project.technologies.map((tech, ti) => (
                            <span key={ti} className={styles.tag}>{tech}</span>
                          ))}
                        </div>
                        <div className={styles['card-links']}>
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles['card-link']}
                            onClick={e => e.stopPropagation()}
                          >
                            <FaGithub /> Code
                          </a>
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles['card-link-primary']}
                            onClick={e => e.stopPropagation()}
                          >
                            <FaExternalLinkAlt /> Live
                          </a>
                        </div>
                      </div>

                      <div className={styles['card-reflection']} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles['floor-reflection']} />
      </div>
    </div>
  );
};

export default Projects;
