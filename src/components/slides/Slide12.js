import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide12 = ({ isActive }) => {
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
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[130px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.12, 0.07, 0.12],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-20">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold text-white mb-4">
              Ready for <span className="text-blue-500">Growth</span>
            </h1>
            <h2 className="text-4xl font-semibold text-white/90 mb-4">
              Future-Proof
            </h2>
            <p className="text-xl text-gray-400">
              Seamlessly scale our security for major events like Rath Yatra
            </p>
          </motion.div>

          {/* Feature Points */}
          <div className="grid grid-cols-2 gap-16 max-w-6xl">
            {/* Infrastructure Scale */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-left"
            >
              <h2 className="text-7xl font-bold text-white mb-4">
                5000<span className="text-blue-500">+</span>
              </h2>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Camera Infrastructure
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Massive infrastructure capacity designed for Rath Yatra. Supports both permanent and temporary camera installations with zero compromise.
              </p>
            </motion.div>

            {/* Command Center */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-left"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Infinitely<span className="text-purple-500">Scalable</span>
              </h2>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Command & Control
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Handle up to 5000+ simultaneous video feeds with real-time monitoring and instant response capabilities.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide12; 