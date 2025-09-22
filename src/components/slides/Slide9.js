import { motion } from 'framer-motion';
import Slide from '../Slide';
import { BiBrain } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';

const NoiseBg = () => (
  <svg className="absolute inset-0 opacity-[0.015] w-full h-full"
    viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <filter id='noiseFilter'>
      <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch' />
    </filter>
    <rect width='100%' height='100%' filter='url(#noiseFilter)' />
  </svg>
);


const Slide10 = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="relative w-[200%] h-[200%]">
              {[...Array(300)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                  }}
                >
                  <div className="flex items-center justify-center">
                    {i % 5 === 0 ? (
                      <BiBrain className="text-xl text-white/40" />
                    ) : (
                      <FaEye className="text-xl text-white/40" />
                    )}
                    <div className="absolute w-32 h-[1px] bg-white/10 rotate-45 origin-left" />
                    <div className="absolute w-32 h-[1px] bg-white/10 -rotate-45 origin-left" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <NoiseBg />

        <div className="relative z-10 flex h-full text-white">
          {/* Problem Statement - Left Column */}
          <motion.div 
            className="w-1/2 h-full flex items-center px-20 border-r border-white/10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20
                flex items-center justify-center border border-blue-500/30">
                <FaEye className="text-4xl text-blue-400 opacity-30" />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-6xl font-bold leading-tight">
                  A thousand cameras,<br />
                  <span className="text-gray-500">but who's watching?</span>
                </h2>
                
                <p className="text-xl text-gray-400 leading-relaxed">
                  Cameras alone are not enough. 
                  <span className="block mt-2 text-gray-500">
                    They're just collecting dust if no one's monitoring them.
                  </span>
                </p>
              </div>

              {/* Decorative Element */}
              <motion.div 
                className="w-32 h-[1px] bg-white/20"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
          </motion.div>

          {/* Solution - Right Column */}
          <motion.div 
            className="w-1/2 h-full flex items-center px-20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-red-500/20
                flex items-center justify-center border border-purple-500/30">
                <BiBrain className="text-4xl text-purple-400" />
              </div>

              <div className="space-y-6">
                <h2 className="text-6xl font-bold leading-tight">
                  Adding{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">
                    intelligence
                  </span>
                </h2>

                <div className="space-y-4">
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Every camera now powered by its own AI brain, creating a network of
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                      {' '}thousands of digital watchers
                    </span>
                  </p>
                  
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Working 24/7, never tired, never distracted, analyzing every frame in real-time
                  </p>

                  <p className="text-xl text-gray-500 mt-6">
                    From passive recording to intelligent guardians
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-purple-500/50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide10; 