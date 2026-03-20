import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles['logo-text']}>PK</span>
          <span className={styles['logo-dot']}></span>
        </Link>

        <div className={styles['desktop-nav']}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles['nav-link']} ${location.pathname === link.path ? styles.active : ''}`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div className={styles['active-indicator']} layoutId="navIndicator" />
              )}
            </Link>
          ))}
          <a href="https://github.com/PraVeenxJSX" target="_blank" rel="noopener noreferrer" className={styles['github-btn']}>
            <FaGithub />
          </a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className={styles['mobile-btn']} aria-label="Toggle menu">
          <div className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}>
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>

      <motion.div
        className={styles['mobile-menu']}
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles['mobile-inner']}>
          {navLinks.map((link, i) => (
            <motion.div
              key={link.path}
              initial={{ x: -20, opacity: 0 }}
              animate={isOpen ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
              transition={{ delay: isOpen ? i * 0.05 : 0 }}
            >
              <Link to={link.path} className={`${styles['mobile-link']} ${location.pathname === link.path ? styles.active : ''}`} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            </motion.div>
          ))}
          <a href="https://github.com/PraVeenxJSX" target="_blank" rel="noopener noreferrer" className={styles['mobile-github']} onClick={() => setIsOpen(false)}>
            <FaGithub /> GitHub
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
