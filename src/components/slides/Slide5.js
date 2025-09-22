import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide5 = ({ isActive }) => {
  const systemTypes = [
    {
      title: "Commercial Zones & Markets",
      description: "Seamlessly integrate existing cameras in shops, malls, and markets into a unified surveillance network",
      accent: "text-emerald-500",
      gradient: "from-emerald-400/20 via-emerald-500/10 to-transparent",
      techName: "Universal Compatibility",
      specs: "All Brands • Any NVR System",
      image: "/images/mall.png"
    },
    {
      title: "Remote Locations",
      description: "Monitor railway stations, bus stops, and highways without fiber infrastructure using 4G/5G connectivity",
      accent: "text-violet-500",
      gradient: "from-violet-400/20 via-violet-500/10 to-transparent",
      techName: "Wireless Connectivity",
      specs: "4G/5G • WiFi • Internet",
      image: "/images/wifi.png"
    },
    {
      title: "Universal Compatibility",
      description: [
        "Any brand of camera",
        "All NVR systems",
        "Single unified platform"
      ],
      accent: "text-rose-500",
      gradient: "from-rose-400/20 via-rose-500/10 to-transparent",
      image: "/images/brands.png"
    }
  ];

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/15 rounded-full blur-[120px]"
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
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-violet-600/15 rounded-full blur-[130px]"
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
          {/* Breadcrumb Navigation - New Addition */}
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
            <span className="text-emerald-500">MagixBox Universal Integration</span>
          </motion.div>

          {/* Connection Visual - New Addition */}
          

          {/* Left Side - Title and Context */}
          <div className="flex h-full">
            <div className="w-1/3 p-16 flex flex-col justify-center">
              <motion.h2
                className="text-7xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                MagixBox
              </motion.h2>
              <motion.h3
                className="text-4xl font-medium tracking-tight text-gray-400 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Universal Surveillance System
              </motion.h3>
              
              <motion.p 
                className="text-xl text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Extends existing infrastructure with wireless connectivity
              </motion.p>

              <motion.div
                className="flex gap-8 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-500">100%</p>
                  <p className="text-sm text-gray-400">Compatibility</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-violet-500">5G</p>
                  <p className="text-sm text-gray-400">Ready</p>
                </div>
              </motion.div>
            </div>

            {/* Right Side - System Types */}
            <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 p-16">
              <div className="space-y-8">
                {/* First Two Systems - Two Columns */}
                <div className="grid grid-cols-2 gap-8">
                  {systemTypes.slice(0, 2).map((system, index) => (
                    <motion.div
                      key={system.title}
                      className="flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + (index * 0.2), duration: 0.8 }}
                    >
                      <motion.div 
                        className={`w-full aspect-video rounded-xl overflow-hidden relative
                          bg-gradient-to-br ${system.gradient} group mb-4`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={system.image}
                          alt={system.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
                      </motion.div>

                      <h3 className={`text-xl font-bold mb-2 ${system.accent}`}>
                        {system.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {system.description}
                      </p>
                      <div className="flex gap-3 mt-auto">
                        <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${system.gradient}`}>
                          <p className={`text-sm font-medium ${system.accent}`}>
                            {system.techName}
                          </p>
                        </div>
                        <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${system.gradient}`}>
                          <p className="text-white/90 text-sm">
                            {system.specs}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Last System - Full Width */}
                <motion.div
                  key={systemTypes[2].title}
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                >
                  <motion.div 
                    className={`w-[500px] aspect-[16/9] relative group`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={systemTypes[2].image}
                      alt={systemTypes[2].title}
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg shadow-black/50"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/5 rounded-2xl ring-1 ring-white/10"
                      whileHover={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  <div className="flex-1">
                    <motion.h3 
                      className={`text-6xl font-bold tracking-tight mb-4 ${systemTypes[2].accent}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    >
                      {systemTypes[2].title}
                    </motion.h3>
                    <div className="space-y-4">
                      {systemTypes[2].description.map((point, index) => (
                        <motion.div 
                          key={point}
                          className="flex items-center gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.3 + (index * 0.1), duration: 0.5 }}
                        >
                          <span className={`text-2xl ${systemTypes[2].accent}`}>•</span>
                          <p className="text-2xl text-gray-400 font-medium tracking-tight">
                            {point}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide5; 