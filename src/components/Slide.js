import { motion } from 'framer-motion';

const Slide = ({ children, isActive }) => {
  return (
    <motion.div
      className={`absolute w-full h-full ${isActive ? 'block' : 'hidden'}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 100 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default Slide; 