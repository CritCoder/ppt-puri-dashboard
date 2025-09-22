import { motion } from 'framer-motion';
import Slide from '../Slide';

const Slide8 = ({ isActive }) => {
  const sensorTypes = [
    {
      title: "Environmental Monitoring",
      description: "Advanced sensor network monitoring air quality, noise levels, temperature, humidity, wind conditions and thermal variations for comprehensive environmental awareness",
      accent: "text-rose-500",
      gradient: "from-rose-400/20 via-rose-500/10 to-transparent",
      techName: "Multi-Parameter Sensing",
      specs: "Air • Noise • Temperature • Wind",
      parameters: [
        "Air Quality",
        "Noise Level",
        "Temperature", 
        "Humidity",
        "Wind Speed",
        "Thermal Detection"
      ],
      image: "/images/env1.png"
    },
    {
      title: "Smart City Poles",
      description: "All-in-one infrastructure combining video monitoring, traffic enforcement, emergency response, intelligent lighting, utilities management, wireless connectivity, and public information display",
      accent: "text-blue-500",
      gradient: "from-blue-400/20 via-blue-500/10 to-transparent",
      features: [
        "Video & Traffic Monitoring",
        "Emergency Communication", 
        "Intelligent Lighting",
        "Utility Management",
        "Wireless Network Hub",
        "Information Display",
        "EV Charging"
      ],
      image: "/images/pole1.png"
    },
    {
      title: "Vehicle Thermal Scanning",
      description: "Advanced portable scanning system combining Z Backscatter® imaging with transmission imaging capabilities for comprehensive vehicle inspection and threat detection",
      accent: "text-emerald-500",
      gradient: "from-emerald-400/20 via-emerald-500/10 to-transparent", 
      features: [
        "Z Backscatter® Imaging",
        "Transmission Imaging",
        "Metallic Object Detection",
        "Portable System",
        "Safe Operation",
        "Environmental Safety",
        "Real-time Analysis"
      ],
      image: "/scanner1.png"
    }
  ];

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-rose-600/15 rounded-full blur-[120px]"
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
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-blue-600/15 rounded-full blur-[130px]"
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

        <div className="relative z-10 flex h-full text-white">
          {/* Left Sidebar */}
          <div className="w-1/3 p-16 flex flex-col justify-center">
            <motion.h2
              className="text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Smart
            </motion.h2>
            <motion.h3
              className="text-4xl font-medium tracking-tight text-gray-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Sensor Network
            </motion.h3>
            
            <motion.p 
              className="text-xl text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Intelligent infrastructure for comprehensive city monitoring
            </motion.p>

            <motion.div
              className="flex gap-8 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-rose-500">IoT</p>
                <p className="text-sm text-gray-400">Enabled</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-500">24/7</p>
                <p className="text-sm text-gray-400">Monitoring</p>
              </div>
            </motion.div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-16">
            {/* Main Sensor - Full Width */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex gap-8">
                <motion.div 
                  className={`w-1/2 aspect-video rounded-xl overflow-hidden relative
                    bg-gradient-to-br ${sensorTypes[0].gradient}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={sensorTypes[0].image}
                    alt={sensorTypes[0].title}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
                </motion.div>

                <div className="w-1/2">
                  <h3 className={`text-2xl font-bold mb-2 ${sensorTypes[0].accent}`}>
                    {sensorTypes[0].title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {sensorTypes[0].description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {sensorTypes[0].parameters.map((param) => (
                      <div key={param} className="bg-black/30 rounded-lg p-3 border border-rose-500/20">
                        <span className="text-gray-300 text-sm">{param}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {sensorTypes.slice(1).map((sensor, index) => (
                <motion.div
                  key={sensor.title}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + (index * 0.2), duration: 0.8 }}
                >
                  <motion.div 
                    className={`w-full aspect-[16/9] rounded-xl overflow-hidden relative
                      bg-gradient-to-br ${sensor.gradient}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={sensor.image}
                      alt={sensor.title}
                      className="absolute inset-0 w-full h-full object-contain p-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
                  </motion.div>

                  <h3 className={`text-xl font-bold mb-1 mt-3 ${sensor.accent}`}>
                    {sensor.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    {sensor.description}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sensor.features.slice(0, 4).map((feature) => (
                      <div key={feature} className={`bg-black/30 rounded-lg p-2 border border-${sensor.accent.split('-')[1]}-500/20`}>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide8;