import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/PraVeenxJSX' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/praveen-kumar-bandela-616065224/' },
    { icon: <FaTwitter />, url: 'https://twitter.com/yourusername' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        {/* Social Links */}
        <div className={styles['social-links']}>
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </a>
          ))}
        </div>
        {/* Copyright */}
        <p className={styles.copyright}>
          © {currentYear} Praveen Kumar Bandela. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 