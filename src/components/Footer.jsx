import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: <FaGithub />,   url: 'https://github.com/PraVeenxJSX',                             label: 'GitHub' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/praveen-kumar-bandela-616065224/', label: 'LinkedIn' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <p className={styles.brandName}>
              <span>Praveen</span> Kumar
            </p>
            <p className={styles.copyright}>
              &copy; {currentYear} — All rights reserved
            </p>
          </div>
          <div className={styles.socials}>
            {socialLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
