import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import styles from './Contact.module.scss';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ type: null, msg: '' });
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: null, msg: '' }), 6000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch('https://portfoliobackend-1-pj5j.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (response.ok) {
        showToast('success', "Message sent! I'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast('error', data.error || 'Failed to send. Please try again.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        showToast('error', 'Request timed out — the server may be waking up. Please try again in a moment.');
      } else {
        showToast('error', 'Failed to send. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    { icon: FaEnvelope, title: 'Email', content: 'bandelapraveenbandela@gmail.com', link: 'mailto:bandelapraveenbandela@gmail.com' },
    { icon: FaMapMarkerAlt, title: 'Location', content: 'Hyderabad, Telangana', link: 'https://maps.google.com/?q=Hyderabad,Telangana,India' },
  ];

  const socialLinks = [
    { icon: FaGithub,   link: 'https://github.com/PraVeenxJSX',                            label: 'GitHub' },
    { icon: FaLinkedin, link: 'https://www.linkedin.com/in/praveen-kumar-bandela-616065224/', label: 'LinkedIn' },
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
            Get in <span className={styles.highlight}>Touch</span>
          </motion.h2>

          <div className={styles.grid}>
            {/* Info Side */}
            <motion.div variants={itemVariants} className={styles.infoCard}>
              <h3 className={styles['card-heading']}>Contact Information</h3>
              <div className={styles.infoList}>
                {contactInfo.map((info, i) => (
                  <a key={i} href={info.link} target="_blank" rel="noopener noreferrer" className={styles.infoItem}>
                    <span className={styles.infoIcon}><info.icon /></span>
                    <div>
                      <span className={styles.infoLabel}>{info.title}</span>
                      <span className={styles.infoValue}>{info.content}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className={styles.socials}>
                {socialLinks.map((s, i) => (
                  <a key={i} href={s.link} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={styles.socialLink}>
                    <s.icon />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Form Side */}
            <motion.div variants={itemVariants} className={styles.formCard}>
              <h3 className={styles['card-heading']}>Send a Message</h3>

              {toast.type && (
                <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`} role="alert">
                  {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                  <span>{toast.msg}</span>
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {[
                  { id: 'name',    label: 'Name',    type: 'text',  autoComplete: 'name' },
                  { id: 'email',   label: 'Email',   type: 'email', autoComplete: 'email' },
                  { id: 'subject', label: 'Subject', type: 'text',  autoComplete: 'off' },
                ].map((field) => (
                  <div key={field.id} className={styles.field}>
                    <label htmlFor={field.id} className={styles.label}>{field.label}</label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className={styles.input}
                      autoComplete={field.autoComplete}
                      required
                      disabled={isLoading}
                    />
                  </div>
                ))}
                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={styles.textarea}
                    autoComplete="off"
                    required
                    disabled={isLoading}
                  />
                </div>
                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading
                    ? <><span className={styles['btn-spinner']} aria-hidden="true" /> Sending…</>
                    : <><FaPaperPlane /> Send Message</>
                  }
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
