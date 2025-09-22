import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide3 = ({ isActive }) => {
  const cameraTypes = [
    {
      title: "Temple & Market Security",
      description: "Advanced rotating cameras monitoring traffic junctions, markets, ghats and other crowded areas",
      accent: "text-sky-500",
      gradient: "from-sky-400/20 via-sky-500/10 to-transparent",
      techName: "High-resolution PTZ Camera",
      specs: "32x Zoom • 360° Coverage",
      image: "/images/ptz.png",
      video: "/ptz1.mov"
    },
    {
      title: "Entry Points & Key Areas",
      description: "Fixed cameras watching over city entry points and important locations 24x7",
      accent: "text-fuchsia-500",
      gradient: "from-fuchsia-400/20 via-fuchsia-500/10 to-transparent",
      techName: "Fixed Dome Camera",
      specs: "Wide-angle • Vandal Proof",
      image: "/images/boxcam.png"
    },
    {
      title: "Large Event Management",
      description: "Wide-view cameras giving complete coverage of large gatherings and events",
      accent: "text-amber-500",
      gradient: "from-amber-400/20 via-amber-500/10 to-transparent",
      techName: "40MP Multi-sensor Camera",
      specs: "180° to 360° Panoramic View",
      image: "/images/40mp.png"
    }
  ];

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-sky-600/15 rounded-full blur-[120px]"
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
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-fuchsia-600/15 rounded-full blur-[130px]"
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
          {/* Left Side - Title and Context */}
          <div className="flex h-full">
            <div className="w-1/3 p-16 flex flex-col justify-center">
              <motion.h2
                className="text-7xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Advanced
              </motion.h2>
              <motion.h3
                className="text-4xl font-medium tracking-tight text-gray-400 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                CCTV Camera Systems
              </motion.h3>
              
              <motion.p 
                className="text-xl text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Comprehensive surveillance solutions for complete coverage
              </motion.p>

              <motion.div
                className="flex gap-8 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-sky-500">24/7</p>
                  <p className="text-sm text-gray-400">Live Monitoring</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-fuchsia-500">AI</p>
                  <p className="text-sm text-gray-400">Powered</p>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Camera Types */}
            <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 p-16">
              <div className="space-y-8">
                {/* First Camera - Full Width */}
                <motion.div
                  key={cameraTypes[0].title}
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <motion.div 
                    className={`w-[500px] aspect-[16/9] rounded-xl overflow-hidden relative
                      bg-gradient-to-br ${cameraTypes[0].gradient} group`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <video
                      src={cameraTypes[0].video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-2 ${cameraTypes[0].accent}`}>
                      {cameraTypes[0].title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {cameraTypes[0].description}
                    </p>
                    <div className="flex gap-4">
                      <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${cameraTypes[0].gradient}`}>
                        <p className={`text-sm font-medium ${cameraTypes[0].accent}`}>
                          {cameraTypes[0].techName}
                        </p>
                      </div>
                      <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${cameraTypes[0].gradient}`}>
                        <p className="text-white/90 text-sm">
                          {cameraTypes[0].specs}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Second and Third Cameras - Two Columns */}
                <div className="grid grid-cols-2 gap-8 mt-8">
                  {cameraTypes.slice(1).map((camera, index) => (
                    <motion.div
                      key={camera.title}
                      className="flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + (index * 0.2), duration: 0.8 }}
                    >
                      <motion.div 
                        className={`w-full aspect-video rounded-xl overflow-hidden relative
                          bg-gradient-to-br ${camera.gradient} group mb-4`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={camera.image}
                          alt={camera.title}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
                      </motion.div>

                      <h3 className={`text-xl font-bold mb-2 ${camera.accent}`}>
                        {camera.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {camera.description}
                      </p>
                      <div className="flex gap-3 mt-auto">
                        <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${camera.gradient}`}>
                          <p className={`text-sm font-medium ${camera.accent}`}>
                            {camera.techName}
                          </p>
                        </div>
                        <div className={`flex-1 bg-black/30 rounded-lg p-3 border border-gray-800/50 ${camera.gradient}`}>
                          <p className="text-white/90 text-sm">
                            {camera.specs}
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

export default Slide3; 