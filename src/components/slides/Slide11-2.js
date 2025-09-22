import { motion } from 'framer-motion';
import Slide from '../Slide';
import { useState } from 'react';
import { BiRefresh, BiFullscreen, BiCog, BiSearch } from 'react-icons/bi';
import { 
  MdPeople, 
  MdDirectionsCar, 
  MdSearch,
  MdFace,
  MdLocalFireDepartment,
  MdWarning,
  MdTraffic,
  MdSpeed,
  MdCamera,
  MdSportsMotorsports
} from 'react-icons/md';
import { 
  HiUserGroup, 
  HiIdentification
} from 'react-icons/hi';
import { 
  GiBarrier, 
  GiCctvCamera, 
  GiCarWheel,
  GiHelmet
} from 'react-icons/gi';
import { 
  FaTrafficLight, 
  FaCarCrash 
} from 'react-icons/fa';
import Search from './analytics/Search';
import CrowdAnalysis from './analytics/CrowdAnalysis';
import PeopleCount from './analytics/PeopleCount';
import FacialRecognition from './analytics/FacialRecognition';
import ANPR from './analytics/ANPR';
import VehicleTracking from './analytics/VehicleTracking';
import TrafficFlow from './analytics/trafficflow';
import TrafficViolationSystem from './analytics/voilation';

const AnalyticsOptions = [
  {
    category: "Search",
    items: [
      {
        id: 'unified-search',
        title: 'Unified Search',
        description: 'Search for people, vehicles and objects',
        icon: BiSearch,
        type: 'unified-search',
        component: Search
      }
    ]
  },
  {
    category: "Crowd Intelligence",
    items: [
      {
        id: 'crowd-analysis',
        title: 'Crowd Analysis',
        description: 'Real-time crowd behavior analysis',
        icon: HiUserGroup,
        type: 'crowd-analysis',
        component: CrowdAnalysis
      },
      {
        id: 'people-count',
        title: 'People Count',
        description: 'Accurate people counting and tracking',
        icon: MdPeople,
        type: 'people-count',
        component: PeopleCount
      },
      {
        id: 'facial-recognition',
        title: 'Facial Recognition',
        description: 'Advanced face detection and matching',
        icon: MdFace,
        type: 'facial',
        component: FacialRecognition
      },
      {
        id: 'fire-smoke',
        title: 'Fire and Smoke',
        description: 'Early detection of fire and smoke',
        icon: MdLocalFireDepartment,
        type: 'fire-smoke'
      },
      {
        id: 'barrier-jump',
        title: 'Wall/Barrier Jump',
        description: 'Detect unauthorized barrier crossing',
        icon: GiBarrier,
        type: 'barrier-jump'
      },
      {
        id: 'vandalism',
        title: 'Vandalism Detection',
        description: 'Monitor and detect property damage',
        icon: MdWarning,
        type: 'vandalism'
      }
    ]
  },
  {
    category: "Traffic Intelligence",
    items: [
      {
        id: 'anpr',
        title: 'ANPR System',
        description: 'Automatic number plate recognition',
        icon: GiCctvCamera,
        type: 'anpr',
        component: ANPR
      },
      {
        id: 'vehicle-tracking',
        title: 'Vehicle Tracking System',
        description: 'Real-time vehicle tracking and history',
        icon: MdDirectionsCar,
        type: 'vehicle-tracking',
        component: VehicleTracking
      },
      {
        id: 'traffic-flow',
        title: 'Traffic Flow Analysis',
        description: 'Monitor and analyze traffic patterns',
        icon: MdTraffic,
        type: 'traffic-flow',
        component: TrafficFlow
      },
      {
        id: 'violations',
        title: 'Traffic Violations',
        description: 'Automatic violation detection system',
        items: [
          {
            id: 'no-helmet',
            title: 'No Helmet',
            icon: GiHelmet
          },
          {
            id: 'triple-riding',
            title: 'Triple Riding',
            icon: MdSportsMotorsports
          },
          {
            id: 'seat-belt',
            title: 'No Seat Belt',
            icon: HiIdentification
          },
          {
            id: 'wrong-side',
            title: 'Wrong Side Driving',
            icon: GiCarWheel
          },
          {
            id: 'line-crossing',
            title: 'Signal Line Crossing',
            icon: FaTrafficLight
          }
        ],
        icon: MdWarning,
        type: 'violations',
        component: TrafficViolationSystem
      }
    ]
  }
];

const Slide11_2 = ({ isActive }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Add this to render the selected component
  const SelectedComponent = selectedOption?.component;

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/15 rounded-full blur-[120px]"
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
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-purple-600/15 rounded-full blur-[130px]"
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
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm tracking-wide text-gray-400">
                Command Center / <span className="text-white">Video Analytics</span>
              </span>
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

          {/* Left Sidebar */}
          <div className="w-[280px] h-full bg-black/90 backdrop-blur-sm border-r border-white/10 overflow-y-auto pt-16">
            <div className="p-4 space-y-6">
              {AnalyticsOptions.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.8 }}
                  className="space-y-2"
                >
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2">
                    {category.category}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          console.log('Clicked:', item.title);
                          setSelectedOption(item);
                        }}
                        className={`w-full px-2 py-2.5 rounded-lg flex items-center gap-3 transition-all group
                          ${selectedOption === item 
                            ? 'bg-white/10 text-blue-500' 
                            : 'hover:bg-white/5 text-white'}`}
                        whileHover={{ x: 2 }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${selectedOption === item 
                            ? 'bg-blue-500/20' 
                            : 'bg-gray-800 group-hover:bg-gray-700'}`}>
                          <item.icon className={`text-lg ${
                            selectedOption === item 
                              ? 'text-blue-500' 
                              : 'text-gray-400 group-hover:text-white'
                          }`} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            selectedOption === item 
                              ? 'text-blue-500' 
                              : 'text-white group-hover:text-white'
                          }`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {item.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-4">
            {SelectedComponent ? (
              <SelectedComponent />
            ) : (
              <div className="text-gray-400 text-center mt-20">
                Select an option from the menu
              </div>
            )}
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide11_2; 