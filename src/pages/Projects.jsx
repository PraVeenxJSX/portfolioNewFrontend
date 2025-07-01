import { useState, useEffect, ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';
import { useSpring, animated } from '@react-spring/web';
import Loading from '../components/Loading';
import styles from './Projects.module.scss';

const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      title: 'Ancons International',
      description: 'A full featured Educational registration website which represents many Universities in USA',
      technologies: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/PraVeenxJSX/ancons-frontend',
      live: 'https://ancons-frontend.vercel.app/',
      image: '/Ancons.png',
    },
    {
      title: 'A Blog Writing Website',
      description:
        'A dynamic and engaging platform for blogging, built with modern tech stack.',
      technologies: ['React', 'NodeJS', 'Material-UI', 'mongoDB'],
      github: 'https://github.com/yourusername/project2',
      live: 'https://project2.com',
      image: '/blog.png',
    },
    {
      title: 'A Veterinary Admin Website',
      description:
        'A streamlined veterinary platform for managing appointments and medical records.',
      technologies: ['React', 'nodeJS', 'Tailwind CSS', 'Framer Motion'],
      github: 'https://github.com/yourusername/project3',
      live: 'https://project3.com',
      image: '/vet.png',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles['projects-root']}>
      {/* Background Elements */}
      <div className={styles['background-elements']}>
        <div className={`${styles.circle} ${styles['top-right']}`} />
        <div className={`${styles.circle} ${styles['bottom-left']}`} />
      </div>
      <div className={styles['projects-container']}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles['section-title']}>My Projects</h2>
          <div className={styles['projects-grid']}>
            {projects.map((project, index) => (
              <Tilt
                key={index}
                glareEnable={true}
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
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub />
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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

function AnimatedCard({ children, ...rest }) {
  const [isHovered, setHovered] = useState(false);
  const spring = useSpring({
    scale: isHovered ? 1.04 : 1,
    boxShadow: isHovered
      ? '0 8px 32px 0 rgba(6,182,212,0.18)'
      : '0 2px 16px 0 rgba(6,182,212,0.08)',
    config: { tension: 300, friction: 18 },
  });

  return (
    <animated.div
      {...rest}
      style={spring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </animated.div>
  );
}

export default Projects;
