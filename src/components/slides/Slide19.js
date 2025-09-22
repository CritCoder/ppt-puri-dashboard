import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide19 = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="relative h-full bg-[#0a0a0a] overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[130px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.12, 0.07, 0.12],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-white mb-6">Thank You</h1>
            <p className="text-xl text-gray-400">For your attention</p>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide19; 