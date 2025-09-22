import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FaUsers, FaPlay, FaSpinner, FaCrosshairs, 
  FaCheckCircle, FaMapMarkedAlt, FaRoute, FaMedkit, FaShieldAlt, FaBuilding 
} from 'react-icons/fa';
import crowd_analysis from './crowd_analysis_data';
import RadialDial from './RadialDial';
import CrowdConcentration from './CrowdConcentration';
import { BiRefresh } from 'react-icons/bi';
import ShimmerCard from './ShimmerCard';

const getRiskColor = (risk) => {
  switch (risk) {
    case 'critical': return 'red';
    case 'high': return 'orange';
    case 'medium': return 'yellow';
    default: return 'blue';
  }
};

const DataWidget = ({ title, icon: Icon, children }) => (
  <motion.div
    className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05] 
    shadow-[inset_0px_0px_40px_rgba(255,255,255,0.02)] 
    bg-gradient-to-b from-white/[0.05] to-transparent"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 rounded-lg bg-blue-500/20">
        <Icon className="text-lg text-blue-400" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </motion.div>
);

const EmergencyCard = ({ title, icon: Icon, items }) => (
  <motion.div
    className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05] 
    shadow-[inset_0px_0px_40px_rgba(255,255,255,0.02)]
    bg-gradient-to-b from-white/[0.05] to-transparent"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="p-2 rounded-lg bg-red-500/20">
        <Icon className="text-lg text-red-400" />
      </div>
      <h4 className="text-sm font-medium text-white">{title}</h4>
    </div>
    <div className="space-y-2">
      {items.map((item, i) => (
        <p key={i} className="text-xs text-gray-400">• {item}</p>
      ))}
    </div>
  </motion.div>
);

// Add this CSS animation at the top of the file
const scanlineAnimation = {
  '@keyframes scanline': {
    '0%': { transform: 'translateY(0%)' },
    '100%': { transform: 'translateY(100%)' }
  }
};

const sampleImages = [
  { id: 1, src: '/puri1.png', label: 'East Gate (Singhadwara)' },
  { id: 2, src: '/puri2.jpeg', label: 'North Gate (Uttaradwara)' },
  { id: 3, src: '/puri1.jpeg', label: 'South Gate (Dakshinadwara)' },
];

const CrowdAnalysis = () => {
  const [analysisState, setAnalysisState] = useState('idle');
  const [showResults, setShowResults] = useState(false);
  const [selectedImage, setSelectedImage] = useState(sampleImages[0]);

  // Updated data from the JSON
  const data = {
    crowd_assessment: {
      density_zones: {
        high_density_areas: [
          {
            location: "East Gate (Singhadwara)",
            estimate: 70,
            risk_level: "critical"
          },
          {
            location: "North Gate (Uttaradwara)",
            estimate: 700,
            risk_level: "high"
          },
          {
            location: "Inner Sanctum Area",
            estimate: 500,
            risk_level: "medium"
          }
        ]
      }
    },
    behavioral_indicators: {
      crowd_mood: "devotional",
      movement_patterns: [
        "Concentrated movement toward inner sanctum",
        "Stationary groups at darshan points",
        "Circular movement around temple perimeter",
        "Dense clustering at prasad distribution areas"
      ]
    }
  };

  // Calculate total crowd for RadialDial
  const totalCrowd = data.crowd_assessment.density_zones.high_density_areas
    .reduce((acc, curr) => acc + curr.estimate, 0);
  const maxCapacity = 20000; // From the JSON's total_estimate upper bound

  // Emergency cards data from the JSON
  const emergencyCards = [
    {
      title: 'Emergency Routes',
      icon: FaRoute,
      items: crowd_analysis.crowd_analysis.response_readiness.emergency_routes
    },
    {
      title: 'Medical Stations',
      icon: FaMedkit,
      items: crowd_analysis.crowd_analysis.response_readiness.medical_stations
    },
    {
      title: 'Command Posts',
      icon: FaShieldAlt,
      items: crowd_analysis.crowd_analysis.response_readiness.command_posts
    },
    {
      title: 'Secure Points',
      icon: FaBuilding,
      items: crowd_analysis.crowd_analysis.security_parameters.perimeter_assessment.secure_points
    }
  ];

  const runAnalysis = async () => {
    setAnalysisState('analyzing');
    setShowResults(false);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysisState('complete');
    setShowResults(true);
  };

  // Add effect to run analysis when image is selected
  useEffect(() => {
    runAnalysis();
  }, [selectedImage]);

  return (
    <div className="w-full h-full mt-16 flex flex-col gap-8">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-red-600/10 rounded-full blur-[130px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.12, 0.07, 0.12],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* First Row - Analysis Area */}
      <div className="flex gap-6 relative z-10">
        {/* Left Side - Source & Controls */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Image Selection */}
          <div className="grid grid-cols-3 gap-4">
            {sampleImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all
                  ${selectedImage.id === image.id 
                    ? 'ring-2 ring-blue-500 scale-[1.02]' 
                    : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/20'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <img 
                  src={image.src}
                  alt={image.label}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 z-20">
                  <p className="text-xs text-white/90 font-medium truncate">{image.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Image Display */}
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img 
              src={selectedImage.src}
              alt="Source Feed"
              className="w-full h-full object-cover"
            />
            
            {/* CCTV overlays */}
            <div className="absolute top-4 left-4 z-30 font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
              <span>CAM_0{selectedImage.id} • MAIN ENTRANCE</span>
            </div>

            {/* Recording indicator - top right */}
            <div className="absolute top-4 right-4 z-30">
              <div className="flex items-center gap-2 bg-black/30 px-2 py-1 rounded">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs text-white/90">REC</span>
              </div>
            </div>

            {/* Timestamp - bottom left */}
            <div className="absolute bottom-4 left-4 z-30">
              <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
                {new Date().toLocaleString()}
              </div>
            </div>
            
            {/* Analysis Overlay */}
            <AnimatePresence>
              {analysisState === 'analyzing' && (
                <motion.div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center text-gray-500">
                    <FaCrosshairs className="text-4xl mb-4 mx-auto" />
                    <p className="text-lg">Analysis in Progress...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="w-1/2 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div className="flex flex-col gap-6">
                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-4">
                  <RadialDial value={totalCrowd} maxValue={maxCapacity} />
                  <CrowdConcentration value={(totalCrowd / maxCapacity) * 100} />
                </div>

                {/* Two Column Layout for Density and Movement */}
                <div className="grid grid-cols-2 gap-4">
                  <DataWidget title="Density Zones" icon={FaUsers}>
                    {data.crowd_assessment.density_zones.high_density_areas.map((area, i) => (
                      <div key={i} className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-white text-sm">{area.location}</p>
                          <p className="text-xs text-gray-400">{area.estimate.toLocaleString()} people</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs bg-${getRiskColor(area.risk_level)}-500/20 text-${getRiskColor(area.risk_level)}-400`}>
                          {area.risk_level}
                        </span>
                      </div>
                    ))}
                  </DataWidget>

                  <DataWidget title="Movement Patterns" icon={FaMapMarkedAlt}>
                    <div className="space-y-2">
                      <p className="text-white">Mood: <span className="text-blue-400">{data.behavioral_indicators.crowd_mood}</span></p>
                      {data.behavioral_indicators.movement_patterns.map((pattern, i) => (
                        <p key={i} className="text-sm text-gray-400">• {pattern}</p>
                      ))}
                    </div>
                  </DataWidget>
                </div>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col gap-6">
                {/* Shimmer states */}
                <div className="grid grid-cols-2 gap-4">
                  <ShimmerCard type="chart" />
                  <ShimmerCard type="chart" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ShimmerCard type="data" />
                  <ShimmerCard type="data" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0a0a0a] px-4 text-sm text-white/40">Crowd Management Readiness</span>
        </div>
      </div>

      {/* Second Row - Emergency Cards */}
      <div className="grid grid-cols-4 gap-4">
        {emergencyCards.map((card, index) => (
          <EmergencyCard
            key={index}
            title={card.title}
            icon={card.icon}
            items={card.items}
          />
        ))}
      </div>
    </div>
  );
};

export default CrowdAnalysis; 