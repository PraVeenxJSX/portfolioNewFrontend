import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaDownload, FaGraduationCap, FaCode } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import styles from './Resume.module.scss';

const Resume = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleDownload = () => {
  
    window.open('./public/PraveenResume.pdf', '_blank');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles['resume-root']}>
     
      <div className={styles['background-elements']}>
        <div className={`${styles.circle} ${styles['top-right']}`} />
        <div className={`${styles.circle} ${styles['bottom-left']}`} />
      </div>
      
      <div className={styles['resume-container']}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles['section-title']}>Resume</h2>
          
          <div className={styles['download-section']}>
            <motion.button
              variants={itemVariants}
              className={styles['download-btn']}
              onClick={handleDownload}
            >
              <FaDownload />
              Download Resume
            </motion.button>
          </div>

          <div className={styles['resume-grid']}>
         
            <motion.div variants={itemVariants} className={styles['resume-section']}>
              <div className={styles['section-header']}>
                <FaGraduationCap className={styles.icon} />
                <h3>Education</h3>
              </div>
              
              <div className={styles['timeline']}>
                <div className={styles['timeline-item']}>
                  <div className={styles['timeline-content']}>
                    <h4>Bachelor of Technology</h4>
                    <p className={styles.company}>Jawaharlal Nehru Technological University</p>
                    <p className={styles.date}>2019 - 2023</p>
                    <p className={styles.description}>
                      Computer Science and Engineering
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

           
            <motion.div variants={itemVariants} className={styles['resume-section']}>
              <div className={styles['section-header']}>
                <FaCode className={styles.icon} />
                <h3>Technical Skills</h3>
              </div>
              
              <div className={styles['skills-grid']}>
                <div className={styles['skill-category']}>
                  <h4>Frontend</h4>
                  <ul>
                    <li>React.js</li>
                    <li>TypeScript</li>
                    <li>HTML5/CSS3</li>
                  
                  </ul>
                </div>

                <div className={styles['skill-category']}>
                  <h4>Backend</h4>
                  <ul>
                    <li>Node.js</li>
                    <li>Express.js</li>
                    <li>Python</li>
                    <li>Java</li>
                  </ul>
                </div>

                <div className={styles['skill-category']}>
                  <h4>Database</h4>
                  <ul>
                    <li>MongoDB</li>
                  
                    <li>MySQL</li>
                
                  </ul>
                </div>

                <div className={styles['skill-category']}>
                  <h4>Tools & Others</h4>
                  <ul>
                    <li>Git</li>
                  
                    <li>AWS</li>
                    <li>CI/CD</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resume; 