import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide13 = ({ isActive }) => {
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
            <h1 className="text-7xl font-bold text-white mb-4">
              MELA<span className="text-blue-500">Platform</span>
            </h1>
            <h2 className="text-3xl font-semibold text-white/90 mb-4">
              Monitoring • Emergency • Logistics • App
            </h2>
            <p className="text-xl text-gray-400">
              Comprehensive platform for managing large gatherings
            </p>
          </motion.div>

          {/* Feature Points */}
          <div className="grid grid-cols-2 gap-16 max-w-6xl">
            {/* Monitoring */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-left"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                M<span className="text-blue-500">onitoring</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Real-time surveillance and crowd monitoring with AI-powered insights for proactive management.
              </p>
            </motion.div>

            {/* Emergency */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-left"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                E<span className="text-red-500">mergency</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Rapid response system for emergencies with automated alerts and coordinated action plans.
              </p>
            </motion.div>

            {/* Logistics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-left"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                L<span className="text-green-500">ogistics</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Smart resource management and deployment for optimal crowd flow and event operations.
              </p>
            </motion.div>

            {/* App */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-left"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                A<span className="text-purple-500">pp</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Mobile application for attendees to access event information and services in real-time.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

// Make sure to add this export statement
export default Slide13; 