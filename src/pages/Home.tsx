import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles['home-root']}>
      {/* Hero Section */}
      <section className={styles['hero-section']}>
        <div className={styles['hero-container']}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles['hero-content']}
          >
            <h1 className={styles['hero-title']}>
              Hi, I'm <span>Praveen Kumar</span>
            </h1>
            <h2 className={styles['hero-subtitle']}>
              Full Stack Developer
            </h2>
            <p className={styles['hero-desc']}>
              I build exceptional digital experiences that make an impact. 
              Specializing in creating beautiful, functional, and user-centered websites.
            </p>
            {/* CTA Buttons */}
            <div className={styles['cta-buttons']}>
              <Link to="/projects">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Me
                </motion.div>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={styles['hero-image']}
          >
            <img 
              src="/335193-apple-developer-wallpaper-just-in-time-for-wwdc.png" 
              alt="Developer Wallpaper"
              className={styles['profile-image']}
            />
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className={styles['intro-section']}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles['intro-content']}
        >
          <h2 className={styles['intro-title']}>LET ME INTRODUCE MYSELF</h2>
          <div className={styles['intro-text']}>
            <p>
              I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️
            </p>
            <p>
              I am fluent in classics like <span>Java</span>, <span>Javascript</span>.
            </p>
            <p>
              My field of Interest's are building new <span>Web Technologies</span> and <span>App Development</span>.
            </p>
            <p>
              Whenever possible, I also apply my passion for developing products with <span>Node.js</span> and Modern Javascript Library and Frameworks like <span>React.js</span> and <span>React-Native</span>.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Scroll Indicator */}
      <motion.div
        className={styles['scroll-indicator']}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className={styles['mouse']}>
          <motion.div
            className={styles['wheel']}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 