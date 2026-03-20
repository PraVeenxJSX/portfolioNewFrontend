import { motion } from 'framer-motion';
import styles from './Loading.module.scss';

const Loading = () => (
  <div className={styles.container}>
    <div className={styles.spinner}>
      <motion.div
        className={styles.ring}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={styles['ring-inner']}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      />
      <div className={styles.dot}></div>
    </div>
    <motion.p
      className={styles.text}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      Loading
    </motion.p>
  </div>
);

export default Loading;
