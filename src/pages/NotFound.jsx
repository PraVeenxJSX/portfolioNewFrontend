import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './NotFound.module.scss';

const NotFound = () => (
  <div className={styles.root}>
    <motion.div
      className={styles.content}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className={styles.code}>404</h1>
      <p className={styles.msg}>Oops — this page doesn't exist.</p>
      <Link to="/" className={styles.btn}>← Back to Home</Link>
    </motion.div>
  </div>
);

export default NotFound;
