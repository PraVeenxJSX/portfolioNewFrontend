import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCode, FaLaptopCode, FaServer, FaDatabase, FaTools, FaMobile } from 'react-icons/fa';
import styles from './About.module.scss';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills = [
    { name: 'Frontend Development', level: 90, icon: FaLaptopCode },
    { name: 'Backend Development', level: 85, icon: FaServer },
    { name: 'Database Management', level: 80, icon: FaDatabase },
    { name: 'Problem Solving', level: 95, icon: FaCode },
    { name: 'DevOps & Tools', level: 75, icon: FaTools },
    { name: 'Mobile Development', level: 70, icon: FaMobile },
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

  return (
    <div className={styles['about-root']}>
      {/* Background Elements */}
      <div className={styles['background-elements']}>
        <div className={`${styles.circle} ${styles['top-right']}`} />
        <div className={`${styles.circle} ${styles['bottom-left']}`} />
      </div>
      <div className={styles['about-container']}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles['section-title']}>About Me</h2>
          <div className={styles['about-grid']}>
            <motion.div variants={itemVariants} className={styles.card}>
              <h3 className={styles['card-title']}>My Journey</h3>
              <p className={styles['card-desc']}>
                I'm a passionate full-stack developer with a strong foundation in web technologies
                and a keen eye for creating elegant solutions to complex problems. My journey in
                software development began with a curiosity about how things work on the internet,
                which led me to dive deep into programming.
              </p>
              <p className={styles['card-desc']}>
                With several years of experience under my belt, I've worked on various projects
                ranging from small business websites to large-scale enterprise applications. I
                believe in writing clean, maintainable code and staying up-to-date with the
                latest technologies and best practices.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className={styles.card}>
              <h3 className={styles['card-title']}>What I Do</h3>
              <div className={styles['skills-list']}>
                <div className={styles['skill-item']}>
                  <span className={styles.icon}><FaCode /></span>
                  <div>
                    <h4 className={styles.name}>Clean Code</h4>
                    <p className={styles['card-desc']}>Writing maintainable and efficient code</p>
                  </div>
                </div>
                <div className={styles['skill-item']}>
                  <span className={styles.icon}><FaLaptopCode /></span>
                  <div>
                    <h4 className={styles.name}>Web Development</h4>
                    <p className={styles['card-desc']}>Building responsive and modern web applications</p>
                  </div>
                </div>
                <div className={styles['skill-item']}>
                  <span className={styles.icon}><FaServer /></span>
                  <div>
                    <h4 className={styles.name}>Backend Solutions</h4>
                    <p className={styles['card-desc']}>Creating robust server-side applications</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <h3 className={styles['skills-title']}>Skills & Expertise</h3>
          <div className={styles['skills-grid']}>
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={styles['skill-card']}
              >
                <div className={styles['skill-header']}>
                  <span className={styles.icon}><skill.icon /></span>
                  <span className={styles.name}>{skill.name}</span>
                </div>
                <div className={styles['skill-bar']}>
                  <motion.div
                    className={styles['skill-progress']}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 