import { motion } from 'framer-motion';
import Slide from '../Slide';
import CrowdAnalysis from './analytics/CrowdAnalysis';

const Slide17 = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="relative h-full bg-[#0a0a0a] overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-[-30%] left-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[130px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.12, 0.07, 0.12],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 h-full p-4">
          <h2 className="text-lg font-bold text-white mb-2 px-2 py-1 bg-white/5 rounded-lg inline-block">
            Temple Monitoring - Crowd Density
          </h2>
          <div className="h-[calc(100%-3rem)]">
            <CrowdAnalysis />
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide17; 