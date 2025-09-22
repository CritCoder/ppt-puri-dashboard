import { motion, AnimatePresence } from 'framer-motion';
import Slide from '../Slide';
import { FaMotorcycle, FaAmbulance, FaFire, FaHeartbeat, FaClock, FaRoad } from 'react-icons/fa';

const vehicles = [
  {
    id: 'firebike',
    title: 'MELA Fire Bike',
    videoUrl: '/eme1.mov',
    icon: FaFire,
    color: 'red',
    features: [
      {
        icon: FaClock,
        title: 'Quick Response',
        description: 'Reaches emergencies in under 4 minutes'
      },
      {
        icon: FaRoad,
        title: 'High Maneuverability',
        description: 'Navigates through dense crowds efficiently'
      },
      {
        icon: FaFire,
        title: 'First Response Equipment',
        description: 'Carries essential firefighting gear'
      }
    ]
  },
  {
    id: 'ambulancebike',
    title: 'MELA Medical Bike',
    videoUrl: '/mela/bike1.mp4',
    icon: FaHeartbeat,
    color: 'blue',
    features: [
      {
        icon: FaClock,
        title: 'Rapid Medical Aid',
        description: 'First medical response within minutes'
      },
      {
        icon: FaRoad,
        title: 'Crowd Navigation',
        description: 'Access to restricted and crowded areas'
      },
      {
        icon: FaHeartbeat,
        title: 'Medical Equipment',
        description: 'Carries critical life-saving supplies'
      }
    ]
  }
];

const VehicleShowcase = ({ vehicle, isActive }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative"
  >
    {/* Video Showcase */}
    <div className="relative rounded-xl overflow-hidden aspect-video mb-6">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
      <video 
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src={vehicle.videoUrl}
      />
      {/* Overlay Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-${vehicle.color}-500/20`}>
            <vehicle.icon className={`text-2xl text-${vehicle.color}-400`} />
          </div>
          <h3 className="text-2xl font-bold text-white">{vehicle.title}</h3>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="grid grid-cols-3 gap-4">
      {vehicle.features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + (index * 0.1) }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className={`p-2 rounded-lg bg-${vehicle.color}-500/20 w-fit mb-3`}>
            <feature.icon className={`text-xl text-${vehicle.color}-400`} />
          </div>
          <h4 className="text-white font-medium mb-1">{feature.title}</h4>
          <p className="text-sm text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Slide15 = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="relative h-full bg-[#0a0a0a] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-red-600/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[130px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.12, 0.07, 0.12],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 h-full p-12">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              MELA<span className="text-red-500">Emergency</span>
            </h1>
            <p className="text-xl text-gray-400">
              Rapid response vehicles designed for large gatherings
            </p>
          </motion.div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-2 gap-8">
            {vehicles.map((vehicle) => (
              <VehicleShowcase 
                key={vehicle.id}
                vehicle={vehicle}
                isActive={isActive}
              />
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide15; 