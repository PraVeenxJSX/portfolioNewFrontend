import { motion } from 'framer-motion';
import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <motion.div
        className={styles.loader}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className={styles.innerCircle} />
      </motion.div>
      <motion.p
        className={styles.loadingText}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading; 