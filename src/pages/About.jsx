import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCode, FaLaptopCode, FaServer, FaDatabase, FaTools, FaMobile } from 'react-icons/fa';
import styles from './About.module.scss';

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className={styles.root}>
      <div className={styles['bg-orb-1']}></div>
      <div className={styles['bg-orb-2']}></div>

      <div className={styles.container}>
        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}>

          <motion.h2 variants={itemVariants} className={styles.title}>
            About <span className={styles.highlight}>Me</span>
          </motion.h2>

          <div className={styles.grid}>
            <motion.div variants={itemVariants} className={styles.card}>
              <h3 className={styles['card-title']}>My Journey</h3>
              <p className={styles['card-desc']}>
                I'm a passionate full-stack developer with a strong foundation in web technologies
                and a keen eye for creating elegant solutions to complex problems. My journey in
                software development began with a curiosity about how things work on the internet.
              </p>
              <p className={styles['card-desc']}>
                With experience across various projects from small business websites to large-scale
                enterprise applications, I believe in writing clean, maintainable code and staying
                up-to-date with the latest technologies.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.card}>
              <h3 className={styles['card-title']}>What I Do</h3>
              <div className={styles['what-list']}>
                {[
                  { icon: FaCode, title: 'Clean Code', desc: 'Writing maintainable and efficient code' },
                  { icon: FaLaptopCode, title: 'Web Development', desc: 'Building responsive and modern web apps' },
                  { icon: FaServer, title: 'Backend Solutions', desc: 'Creating robust server-side applications' },
                ].map((item, i) => (
                  <div key={i} className={styles['what-item']}>
                    <span className={styles['what-icon']}><item.icon /></span>
                    <div>
                      <h4 className={styles['what-name']}>{item.title}</h4>
                      <p className={styles['what-desc']}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.h3 variants={itemVariants} className={styles['skills-heading']}>
            Skills & <span className={styles.highlight}>Expertise</span>
          </motion.h3>

          <div className={styles['skills-grid']}>
            {skills.map((skill, i) => (
              <motion.div key={i} variants={itemVariants} className={styles['skill-card']}>
                <div className={styles['skill-header']}>
                  <span className={styles['skill-icon']}><skill.icon /></span>
                  <span className={styles['skill-name']}>{skill.name}</span>
                  <span className={styles['skill-pct']}>{skill.level}%</span>
                </div>
                <div className={styles['skill-track']}>
                  <motion.div
                    className={styles['skill-bar']}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
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
