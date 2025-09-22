import { motion, AnimatePresence } from 'framer-motion';
import Slide from '../Slide';
import { useState } from 'react';
import { FaRoute, FaUsers, FaChartLine } from 'react-icons/fa';
import Planning from './slide16/Planning';
import Simulation from './slide16/Simulation';
import Monitoring from './slide16/Monitoring';

const menuItems = [
  {
    id: 'planning',
    title: 'Planning',
    icon: FaRoute,
    description: 'Plan routes, positions and resource allocation'
  },
  {
    id: 'simulation',
    title: 'Simulation',
    icon: FaUsers,
    description: 'Simulate crowd flow and behavior'
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    icon: FaChartLine,
    description: 'Real-time crowd monitoring and analytics'
  }
];

const Slide16 = ({ isActive }) => {
  const [activeView, setActiveView] = useState('planning');

  const renderContent = () => {
    switch(activeView) {
      case 'planning':
        return <Planning />;
      case 'simulation':
        return <Simulation />;
      case 'monitoring':
        return <Monitoring />;
      default:
        return null;
    }
  };

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full bg-[#0a0a0a] overflow-hidden">
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
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[130px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.12, 0.07, 0.12],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 h-full p-6">
          {/* Header with Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white mr-8">
                Mela Logistics Planning
              </h2>
              <div className="flex gap-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                      ${activeView === item.id 
                        ? 'bg-white/10 text-white' 
                        : 'hover:bg-white/5 text-gray-400'}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <item.icon className={`text-lg ${activeView === item.id ? 'text-blue-400' : ''}`} />
                    <span className="font-medium">{item.title}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="h-[calc(100%-4rem)]">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide16; 