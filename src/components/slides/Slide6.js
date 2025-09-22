import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide6 = ({ isActive }) => {
  const droneTypes = [
    {
      title: "AI Surveillance Drones",
      description: "Advanced autonomous drones with AI-powered tracking and behavior analysis for crowd monitoring and security",
      accent: "text-cyan-500",
      gradient: "from-cyan-400/20 via-cyan-500/10 to-transparent",
      techName: "Smart Patrol Drone",
      specs: "4K Camera • 40min Flight Time",
      image: "/images/drone1.png"
    },
    {
      title: "Thermal Imaging Drones",
      description: "Night vision and thermal imaging capabilities for enhanced surveillance in low-light conditions and emergency situations",
      accent: "text-orange-500",
      gradient: "from-orange-400/20 via-orange-500/10 to-transparent",
      techName: "Thermal Vision System",
      specs: "IR Sensors • Heat Detection",
      image: "/images/drone2.png"
    },
    {
      title: "Aerial Flood Light Drones",
      description: "High-powered illumination drones providing instant lighting for emergency response, events, and security operations",
      accent: "text-yellow-500",
      gradient: "from-yellow-400/20 via-yellow-500/10 to-transparent",
      techName: "Emergency Light Drone",
      specs: "50,000 Lumens • 360° Coverage",
      image: "/images/drone3.png"
    }
  ];

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-600/15 rounded-full blur-[120px]"
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
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-orange-600/15 rounded-full blur-[130px]"
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
            <span className="text-cyan-500">Aerial Surveillance Systems</span>
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
                Aerial
              </motion.h2>
              <motion.h3
                className="text-4xl font-medium tracking-tight text-gray-400 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Drone Systems
              </motion.h3>
              
              <motion.p 
                className="text-xl text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Advanced aerial solutions for dynamic surveillance and emergency response
              </motion.p>

              <motion.div
                className="flex gap-8 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-cyan-500">AI</p>
                  <p className="text-sm text-gray-400">Powered</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-500">24/7</p>
                  <p className="text-sm text-gray-400">Operation</p>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Drone Types */}
            <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 p-16">
              <motion.h3
                className="text-2xl font-medium text-gray-200 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Advanced Aerial Surveillance Solutions
              </motion.h3>
              
              <div className="space-y-8">
                {/* First Drone - Full Width with Video */}
                <motion.div
                  key={droneTypes[0].title}
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <motion.div 
                    className={`w-[500px] aspect-[16/9] relative group`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0">
                      <video 
                        src="/images/drone1.mp4"
                        autoPlay
                        muted
                        playsInline
                        onEnded={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                          e.target.nextElementSibling.play();
                        }}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg shadow-black/50"
                      />
                      <video
                        src="/ujjaindrone1.mov" 
                        muted
                        playsInline
                        loop
                        style={{display: 'none'}}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg shadow-black/50"
                      />
                    </div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/5 rounded-2xl ring-1 ring-white/10"
                      whileHover={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  <div className="flex-1">
                    <motion.h3 
                      className={`text-6xl font-bold tracking-tight mb-4 ${droneTypes[0].accent}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      {droneTypes[0].title}
                    </motion.h3>
                    <motion.p 
                      className="text-2xl text-gray-400 font-medium tracking-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    >
                      {droneTypes[0].description}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Other Two Drones - Two Columns */}
                <div className="grid grid-cols-2 gap-8 mt-8">
                  {droneTypes.slice(1).map((drone, index) => (
                    <motion.div
                      key={drone.title}
                      className="flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + (index * 0.2), duration: 0.8 }}
                    >
                      <motion.div 
                        className={`w-full aspect-video rounded-xl overflow-hidden relative
                          bg-gradient-to-br ${drone.gradient} group mb-4`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={drone.image}
                          alt={drone.title}
                          className="absolute inset-0 w-full h-full object-contain p-4"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
                      </motion.div>

                      <h3 className={`text-xl font-bold mb-2 ${drone.accent}`}>
                        {drone.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {drone.description}
                      </p>
                      <div className="flex gap-3 mt-auto">
                        <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${drone.gradient}`}>
                          <p className={`text-sm font-medium ${drone.accent}`}>
                            {drone.techName}
                          </p>
                        </div>
                        <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${drone.gradient}`}>
                          <p className="text-white/90 text-sm">
                            {drone.specs}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide6; 