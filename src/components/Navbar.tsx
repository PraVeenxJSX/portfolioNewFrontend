import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import styles from './Navbar.module.scss';

// Add Google Fonts import for a modern signature font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    // { path: '/resume', label: 'Resume' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={
        `${styles.navbar} ${scrolled ? styles.scrolled : styles.transparent}`
      }
    >
      <div className={styles['navbar-container']}>
        <Link to="/" className={styles.logo} style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.5rem', letterSpacing: '1px' }}>
          P K
        </Link>

        {/* Desktop Navigation */}
        <div className={styles['desktop-nav']}>
          <div className={styles['nav-links']}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={
                  `${styles['nav-link']} ${location.pathname === link.path ? styles.active : ''}`
                }
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/PraVeenxJSX"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['github-btn']}
            >
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles['mobile-nav-btn']}
        >
          {isOpen ? <span>&#10005;</span> : <span>&#9776;</span>}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={styles['mobile-menu']}
        >
          <div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={
                  `${styles['mobile-link']} ${location.pathname === link.path ? styles.active : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['mobile-github-btn']}
              onClick={() => setIsOpen(false)}
            >
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar; 