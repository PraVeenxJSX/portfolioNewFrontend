// src/components/MotionWrapper.tsx
import { motion } from 'framer-motion';

const MotionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default MotionWrapper;
