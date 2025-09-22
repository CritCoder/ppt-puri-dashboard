import { motion } from 'framer-motion';
import Slide from '../Slide';
import { useState } from 'react';
import { BiCctv, BiRefresh, BiFullscreen, BiCog } from 'react-icons/bi';
import { MdSecurity, MdPeople, MdLocationOn, MdAnalytics, MdLocalPolice, MdOutlineEmergency, MdVolumeUp, MdTraffic, MdDirectionsCar, MdCleaningServices } from 'react-icons/md';
import { HiLightningBolt, HiCollection, HiUserGroup } from 'react-icons/hi';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { FaServer, FaCar, FaTrash } from 'react-icons/fa';
import VideoMonitoring from './slide11/VideoMonitoring';
import DigitalEvidence from './slide11/DigitalEvidence';
import SOSResponse from './slide11/SOSResponse';
import PublicPA from './slide11/PublicPA';
import DashboardLayout from './slide11/DashboardLayout';
import ResourceDashboard from './slide11/ResourceDashboard';
import RoadSafety from './slide11/RoadSafety';
import { FaCarCrash, FaTrafficLight } from 'react-icons/fa';
import { GiCctvCamera, GiHelmet, GiCarWheel } from 'react-icons/gi';
import ANPR from './analytics/ANPR';
import VehicleTracking from './analytics/VehicleTracking';
import TrafficFlow from './analytics/trafficflow';
import TrafficViolationSystem from './analytics/voilation';
import { FaExclamationTriangle } from 'react-icons/fa';
import PublicSafety from './slide11/PublicSafety';
import { FaCamera } from 'react-icons/fa';
import FacialRecognition from './analytics/FacialRecognition';
import CrowdAnalysis from './analytics/CrowdAnalysis';
import PeopleCount from './analytics/PeopleCount';
import PR from './slide11/PR';

const CommandOptions = [
  {
    category: "Traffic Intelligence",
    items: [
      {
        id: 'traffic-dashboard',
        title: 'Dashboard',
        description: 'Real-time traffic monitoring and analytics',
        icon: FaTrafficLight,
        type: 'traffic-dashboard'
      },
      {
        id: 'traffic-flow',
        title: 'Traffic Flow',
        description: 'Monitor and analyze traffic patterns',
        icon: MdTraffic,
        type: 'traffic-flow'
      },
      {
        id: 'anpr',
        title: 'ANPR System',
        description: 'Automatic number plate recognition',
        icon: GiCctvCamera,
        type: 'anpr'
      },
      {
        id: 'vehicle-tracking',
        title: 'Vehicle Tracking',
        description: 'Real-time vehicle tracking and history',
        icon: MdDirectionsCar,
        type: 'vehicle-tracking'
      },
      {
        id: 'violations',
        title: 'Smart Violations',
        description: 'AI-powered violation detection',
        icon: FaCarCrash,
        type: 'violations'
      }
    ]
  },
  {
    category: "Public Safety Intelligence ",
    items: [
      {
        id: 'safety-dashboard',
        title: 'Dashboard',
        description: 'Real-time public safety monitoring',
        icon: MdSecurity,
        type: 'safety-dashboard'
      },
      {
        id: 'frs',
        title: 'FRS System',
        description: 'Face Recognition & Person Tracking',
        icon: FaCamera,
        type: 'frs'
      },
      {
        id: 'crowd-analysis',
        title: 'Crowd Analysis',
        description: 'Real-time crowd behavior analysis',
        icon: HiUserGroup,
        type: 'crowd-analysis'
      },
      {
        id: 'people-count',
        title: 'People Count',
        description: 'Accurate people counting and tracking',
        icon: MdPeople,
        type: 'people-count'
      }
    ]
  },
  {
    category: "Control Operations",
    items: [
      {
        id: 'video-monitoring',
        title: 'Video Monitoring',
        description: 'Live feed monitoring and PTZ camera controls',
        icon: BiCctv,
        type: 'monitoring'
      },
      {
        id: 'evidence-collection',
        title: 'Digital Evidence',
        description: 'Secure storage and retrieval of surveillance data',
        icon: HiCollection,
        type: 'evidence'
      },
      {
        id: 'sos-response',
        title: 'SOS Response',
        description: 'Emergency response coordination and dispatch',
        icon: MdOutlineEmergency,
        type: 'sos'
      },
      {
        id: 'public-pa',
        title: 'Public PA System',
        description: 'Broadcast announcements through smart poles',
        icon: MdVolumeUp,
        type: 'pa'
      },
      {
        id: 'waste-monitoring',
        title: 'Waste & Sanitation',
        description: 'Waste collection and sanitation monitoring',
        icon: FaTrash,
        type: 'waste-monitoring'
      }
    ]
  }
];

const renderContent = (activeOption) => {
  switch(activeOption) {
    case 'monitoring':
      return <VideoMonitoring />;
    case 'evidence':
      return <DigitalEvidence />;
    case 'sos':
      return <SOSResponse />;
    case 'pa':
      return <PublicPA />;
    case 'dashboard':
      return <DashboardLayout />;
    case 'resources':
      return <ResourceDashboard />;
    case 'traffic-dashboard':
      return <RoadSafety />;
    case 'anpr':
      return <ANPR />;
    case 'vehicle-tracking':
      return <VehicleTracking />;
    case 'traffic-flow':
      return <TrafficFlow />;
    case 'violations':
      return <TrafficViolationSystem />;
    case 'safety-dashboard':
      return <PublicSafety />;
    case 'waste-monitoring':
      return <PR />;
    case 'frs':
      return <FacialRecognition />;
    case 'crowd-analysis':
      return <CrowdAnalysis />;
    case 'people-count':
      return <PeopleCount />;
    default:
      return (
        <div className="flex-1 h-full pt-16 flex items-center justify-center text-gray-400">
          <p>Select an option from the sidebar</p>
        </div>
      );
  }
};

// Add a function to get the current category
const getCurrentCategory = (activeOption) => {
  for (const category of CommandOptions) {
    if (category.items.some(item => item.type === activeOption)) {
      return category.category;
    }
  }
  return null;
};

// Add a function to get the current item details
const getCurrentItemDetails = (activeOption) => {
  for (const category of CommandOptions) {
    const item = category.items.find(item => item.type === activeOption);
    if (item) {
      return { category: category.category, title: item.title };
    }
  }
  return null;
};

const Slide9 = ({ isActive }) => {
  const [activeOption, setActiveOption] = useState('monitoring');

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/15 rounded-full blur-[120px]"
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
          {/* Command Bar */}
          <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-sm border-b border-white/10 px-8 flex items-center justify-between z-50">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm tracking-wide text-gray-400">Command Center</span>
              <span className="text-gray-600">/</span>
              {activeOption ? (
                <>
                  <span className="text-gray-400">{getCurrentItemDetails(activeOption)?.category}</span>
                  <span className="text-gray-600">/</span>
                  <span className="text-white">{getCurrentItemDetails(activeOption)?.title}</span>
                </>
              ) : (
                <span className="text-white">Control Hub</span>
              )}
            </motion.div>
            <div className="flex items-center space-x-6">
              <button className="text-white/70 hover:text-white transition-colors">
                <BiRefresh className="text-xl" />
              </button>
              <button className="text-white/70 hover:text-white transition-colors">
                <BiFullscreen className="text-xl" />
              </button>
              <button className="text-white/70 hover:text-white transition-colors">
                <BiCog className="text-xl" />
              </button>
            </div>
          </div>

          {/* Left Sidebar - Compact Version */}
          <div className="w-16 h-full bg-black/90 backdrop-blur-sm border-r border-white/10 overflow-y-auto pt-16">
            <div className="p-2 space-y-6">
              {CommandOptions.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.8 }}
                  className="space-y-2"
                >
                  <h3 className="text-[8px] font-medium text-gray-400 uppercase tracking-wider px-1 text-center">
                    {category.category.split(' ')[0]}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => setActiveOption(item.type)}
                        className={`w-full p-2 rounded-lg flex items-center justify-center transition-all group relative
                          ${activeOption === item.type 
                            ? 'bg-white/10' 
                            : 'hover:bg-white/5'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${activeOption === item.type 
                            ? 'bg-purple-500/20' 
                            : 'bg-gray-800 group-hover:bg-gray-700'}`}>
                          <item.icon className={`text-lg ${
                            activeOption === item.type 
                              ? 'text-purple-500' 
                              : 'text-gray-400 group-hover:text-white'
                          }`} />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-[10px] text-gray-400">{item.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          {renderContent(activeOption)}
        </div>
      </div>
    </Slide>
  );
};

export default Slide9; 