import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import Loading from '../components/Loading';
import styles from './Contact.module.scss';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('https://portfoliobackend-1-pj5j.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      content: 'bandelapraveenbandela@gmail.com',
      link: 'bandelapraveenbandela@gmail.com',
    },
    
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      content: 'Hyderabad, TS',
      link: 'https://maps.google.com',
    },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      link: 'https://github.com/PraVeenxJSX',
      label: 'GitHub',
    },
    {
      icon: FaLinkedin,
      link: 'https://www.linkedin.com/in/praveen-kumar-bandela-616065224/',
      label: 'LinkedIn',
    },
    {
      icon: FaTwitter,
      link: 'https://twitter.com/yourusername',
      label: 'Twitter',
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
    <div className={styles['contact-root']}>
      {/* Background Elements */}
      <div className={styles['background-elements']}>
        <div className={`${styles.circle} ${styles['top-right']}`} />
        <div className={`${styles.circle} ${styles['bottom-left']}`} />
      </div>
      <div className={styles['contact-container']}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles['section-title']}>Get in Touch</h2>
          <div className={styles['contact-grid']}>
            {/* Contact Information */}
            <div className={styles['info-section']}>
              <h3 className={styles['info-title']}>Contact Information</h3>
              <div className={styles['info-list']}>
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['info-link']}
                  >
                    <span className={styles.icon}><info.icon /></span>
                    <span className={styles['info-content']}>
                      <span className={styles['info-label']}>{info.title}</span>
                      <span className={styles['info-value']}>{info.content}</span>
                    </span>
                  </a>
                ))}
              </div>
              <div className={styles['social-links']}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>
            {/* Contact Form */}
            <div className={styles['form-section']}>
              <h3 className={styles['form-title']}>Send a Message</h3>
              <motion.form
                variants={itemVariants}
                className={styles.form}
                onSubmit={handleSubmit}
              >
                <div className={styles['input-group']}>
                  <label htmlFor="name" className={styles['input-label']}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles['input-field']}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className={styles['input-group']}>
                  <label htmlFor="email" className={styles['input-label']}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles['input-field']}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className={styles['input-group']}>
                  <label htmlFor="subject" className={styles['input-label']}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={styles['input-field']}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className={styles['input-group']}>
                  <label htmlFor="message" className={styles['input-label']}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={styles['textarea-field']}
                    required
                    disabled={isLoading}
                  />
                </div>
                <motion.button
                  type="submit"
                  className={styles['submit-btn']}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? <Loading /> : 'Send Message'}
                </motion.button>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 