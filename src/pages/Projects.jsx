import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';
import { useSpring, animated } from '@react-spring/web';
import Loading from '../components/Loading';
import styles from './Projects.module.scss';

const projects = [
  {
    title: 'Ancons International',
    description: 'A full-featured educational registration website representing multiple U.S. universities.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/PraVeenxJSX/ancons-frontend',
    live: 'https://ancons-new.vercel.app/',
    image: '/Ancons.png',
  },
  {
    title: 'A Blog Writing Website',
    description: 'A dynamic blogging platform built with a modern tech stack.',
    technologies: ['React', 'Node.js', 'Material-UI', 'MongoDB'],
    github: 'https://github.com/yourusername/project2',
    live: 'https://project2.com',
    image: '/blog.png',
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className={styles['projects-root']}>
      <div className={styles['background-elements']}>
        <div className={`${styles.circle} ${styles['top-right']}`} />
        <div className={`${styles.circle} ${styles['bottom-left']}`} />
      </div>
      <div className={styles['projects-container']}>
        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <h2 className={styles['section-title']}>My Projects</h2>
          <div className={styles['projects-grid']}>
            {projects.map((project, index) => (
              <Tilt
                key={index}
                glareEnable
                glareMaxOpacity={0.15}
                scale={1.04}
                transitionSpeed={700}
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                className={styles['project-card']}
              >
                <AnimatedCard>
                  <div
                    className={styles['project-image']}
                    style={{
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                    aria-label={`${project.title} preview`}
                  />
                  <div className={styles['project-content']}>
                    <h3 className={styles['project-title']}>{project.title}</h3>
                    <p className={styles['project-desc']}>{project.description}</p>
                    <div className={styles['tech-list']}>
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className={styles['tech-item']}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className={styles['project-links']}>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Link">
                        <FaGithub />
                      </a>
                      <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live Project">
                        <FaExternalLinkAlt />
                      </a>
                    </div>
                  </div>
                </AnimatedCard>
              </Tilt>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AnimatedCard = ({ children }) => {
  const [isHovered, setHovered] = useState(false);

  const spring = useSpring({
    scale: isHovered ? 1.04 : 1,
    boxShadow: isHovered
      ? '0 8px 32px rgba(6,182,212,0.18)'
      : '0 2px 16px rgba(6,182,212,0.08)',
    config: { tension: 300, friction: 18 },
  });

  return (
    <animated.div
      style={spring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </animated.div>
  );
};

export default Projects;