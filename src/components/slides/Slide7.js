import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide7 = ({ isActive }) => {
  const mobileTypes = [
    {
      title: "Portable PTZ Units",
      description: "Rapid-deploy wheeled camera units with built-in MagixBox for direct command center connectivity and integrated PA system for instant announcements",
      accent: "text-indigo-500",
      gradient: "from-indigo-400/20 via-indigo-500/10 to-transparent",
      techName: "Mobile PTZ System",
      specs: "MagixBox • PA System • 360° Coverage",
      image: "/images/mobile1.png"
    },
    {
      title: "5G Body Cameras",
      description: "Advanced wearable cameras for officials with real-time streaming and instant situation awareness",
      accent: "text-teal-500",
      gradient: "from-teal-400/20 via-teal-500/10 to-transparent",
      techName: "Smart Body Camera",
      specs: "4K • Live Streaming",
      image: "/images/5gbodycam.png"
    }
  ];

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/15 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.2, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-teal-600/15 rounded-full blur-[130px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.17, 0.12, 0.17],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full text-white">
          {/* Breadcrumb Navigation */}
          <motion.div 
            className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span>Surveillance Infrastructure</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-indigo-500">Mobile Surveillance Units</span>
          </motion.div>

          {/* Main Content */}
          <div className="flex h-full">
            <div className="w-1/3 p-16 flex flex-col justify-center">
              <motion.h2
                className="text-7xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Mobile
              </motion.h2>
              <motion.h3
                className="text-4xl font-medium tracking-tight text-gray-400 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Surveillance Units
              </motion.h3>
              
              <motion.p 
                className="text-xl text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Rapid-deploy mobile solutions for dynamic security needs
              </motion.p>

              <motion.div
                className="flex gap-8 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-indigo-500">4G/5G</p>
                  <p className="text-sm text-gray-400">Connected</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-teal-500">72h+</p>
                  <p className="text-sm text-gray-400">Operation</p>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Mobile Types */}
            <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 p-16">
              <div className="flex gap-12 h-full">
                {/* Left Column - 5G Body Camera Section */}
                <div className="w-1/2">
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <motion.div 
                      className="relative z-10 mb-6 rounded-2xl overflow-hidden h-[60vh]"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-teal-500/5 to-transparent rounded-2xl blur-xl" />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20 rounded-2xl" />
                      <img 
                        src={mobileTypes[1].image}
                        alt={mobileTypes[1].title}
                        className="relative z-10 w-full h-full object-contain mix-blend-luminosity"
                      />
                    </motion.div>

                    <h3 className={`text-2xl font-bold mb-3 ${mobileTypes[1].accent}`}>
                      {mobileTypes[1].title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {mobileTypes[1].description}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-teal-500/20 backdrop-blur-sm`}>
                      <span className={`text-sm font-medium ${mobileTypes[1].accent}`}>
                        {mobileTypes[1].techName}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 text-sm">
                        {mobileTypes[1].specs}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - PTZ Content and Image */}
                <div className="w-1/2 flex flex-col">
                  {/* PTZ Content Section */}
                  <motion.div
                    className="relative mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <h3 className={`text-2xl font-bold mb-3 ${mobileTypes[0].accent}`}>
                      {mobileTypes[0].title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {mobileTypes[0].description}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-indigo-500/20 backdrop-blur-sm`}>
                      <span className={`text-sm font-medium ${mobileTypes[0].accent}`}>
                        {mobileTypes[0].techName}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 text-sm">
                        {mobileTypes[0].specs}
                      </span>
                    </div>
                  </motion.div>

                  {/* PTZ Image */}
                  <motion.div 
                    className="relative h-[60vh]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                  >
                    <motion.div 
                      className="h-full relative z-10 rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-transparent rounded-2xl blur-xl" />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20 rounded-2xl" />
                      <img 
                        src={mobileTypes[0].image}
                        alt={mobileTypes[0].title}
                        className="relative z-10 w-full h-full object-contain mix-blend-luminosity"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide7; 