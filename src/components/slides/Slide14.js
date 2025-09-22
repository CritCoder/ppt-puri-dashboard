import { motion, AnimatePresence } from 'framer-motion';
import Slide from '../Slide';
import { useState } from 'react';
import { 
  FaUsers, FaTrash, FaBalanceScale,
  FaPlay, FaSpinner, FaCrosshairs, FaCheckCircle,
  FaShieldAlt, FaMapMarkedAlt, FaMedkit, FaBroom,
  FaToilet, FaTrashAlt, FaUserShield, FaRoute,
  FaBuilding, FaHandsHelping
} from 'react-icons/fa';
import mela1 from './mela1';

const analysisTypes = [
  {
    id: 'crowd',
    title: 'Crowd Monitoring',
    icon: FaUsers,
    description: 'Real-time crowd density and movement monitoring'
  },
  {
    id: 'cleaning',
    title: 'Sanitation Monitoring',
    icon: FaTrash,
    description: 'Live waste management and cleanliness tracking'
  },
  {
    id: 'management',
    title: 'Event Monitoring',
    icon: FaBalanceScale,
    description: 'Live monitoring of law, order and event operations'
  }
];

const getRiskColor = (risk) => {
  switch (risk) {
    case 'critical': return 'red';
    case 'high': return 'orange';
    case 'medium': return 'yellow';
    default: return 'blue';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'restricted': return 'bg-red-500/20 text-red-400';
    case 'monitored': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-green-500/20 text-green-400';
  }
};

const DataWidget = ({ title, icon: Icon, children }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-blue-500/20">
        <Icon className="text-2xl text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

const Results = ({ type, data }) => {
  switch(type) {
    case 'crowd':
      return <CrowdAnalysisResults data={data} />;
    case 'cleaning':
      return <CleaningAnalysisResults data={data} />;
    case 'management':
      return <ManagementResults data={data} />;
    default:
      return null;
  }
};

const CrowdAnalysisResults = ({ data }) => (
  <motion.div 
    className="space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <DataWidget title="Density Zones" icon={FaUsers}>
      {data.crowd_assessment.density_zones.high_density_areas.map((area, i) => (
        <div key={i} className="flex justify-between items-center mb-4">
          <div>
            <p className="text-white text-sm">{area.location}</p>
            <p className="text-xs text-gray-400">{area.estimate} people</p>
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
  </motion.div>
);

const CleaningAnalysisResults = ({ data }) => (
  <motion.div 
    className="space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <DataWidget title="Sanitation Status" icon={FaToilet}>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white mb-2">High Traffic Areas</h4>
          <p className="text-sm text-gray-400">Requires immediate attention</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white mb-2">Waste Collection Points</h4>
          <p className="text-sm text-gray-400">80% capacity reached</p>
        </div>
      </div>
    </DataWidget>

    <DataWidget title="Cleaning Schedule" icon={FaBroom}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-white">Next Cleaning Round</p>
          <span className="text-blue-400">30 minutes</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-white">Team Deployment</p>
          <span className="text-green-400">12 teams active</span>
        </div>
      </div>
    </DataWidget>
  </motion.div>
);

const ManagementResults = ({ data }) => (
  <motion.div 
    className="space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <DataWidget title="Security Overview" icon={FaUserShield}>
      {data.security_parameters.access_points.map((point, i) => (
        <div key={i} className="flex justify-between items-center mb-3">
          <div>
            <p className="text-white text-sm">{point.location}</p>
            <p className="text-xs text-gray-400">Flow: {point.crowd_flow}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(point.status)}`}>
            {point.status}
          </span>
        </div>
      ))}
    </DataWidget>

    <DataWidget title="Emergency Response" icon={FaHandsHelping}>
      <div className="space-y-3">
        {data.response_readiness.emergency_routes.map((route, i) => (
          <div key={i} className="flex items-center gap-2">
            <FaRoute className="text-blue-400" />
            <p className="text-sm text-gray-400">{route}</p>
          </div>
        ))}
      </div>
    </DataWidget>
  </motion.div>
);

const Slide14 = ({ isActive }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('crowd');
  const [analysisState, setAnalysisState] = useState('idle');
  const [showResults, setShowResults] = useState(false);
  const data = mela1.crowd_analysis;

  const runAnalysis = async () => {
    setAnalysisState('analyzing');
    setShowResults(false);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysisState('complete');
    setShowResults(true);
  };

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full bg-[#0a0a0a] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 h-full flex">
          {/* Left Side - Source & Controls */}
          <div className="w-1/2 h-full p-8 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                MELA<span className="text-blue-500">Monitoring</span>
              </h1>
              <p className="text-gray-400">
                Select monitoring type to begin
              </p>
            </motion.div>

            {/* Image Source */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black/50 mb-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <img 
                src="/sim1.jpeg" 
                alt="Source Feed"
                className="w-full h-full object-cover"
              />
              
              {/* Analysis Overlay */}
              <AnimatePresence>
                {analysisState === 'analyzing' && (
                  <motion.div 
                    className="absolute inset-0 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="absolute inset-0 bg-blue-500/10" />
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                      {[...Array(9)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="border border-blue-400/30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <motion.div
                            className="w-full h-full bg-blue-400/10"
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              delay: i * 0.2 
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Analysis Options */}
            <div className="space-y-4">
              {analysisTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => {
                    setSelectedAnalysis(type.id);
                    setShowResults(false);
                    setAnalysisState('idle');
                  }}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4
                    ${selectedAnalysis === type.id 
                      ? 'bg-blue-500/20 border-blue-500/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-3 rounded-lg ${selectedAnalysis === type.id ? 'bg-blue-500/20' : 'bg-white/10'}`}>
                    <type.icon className={`text-xl ${selectedAnalysis === type.id ? 'text-blue-400' : 'text-white'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-white">{type.title}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Run Analysis Button */}
            <motion.button
              onClick={runAnalysis}
              disabled={analysisState === 'analyzing'}
              className={`mt-auto px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all
                ${analysisState === 'analyzing' 
                  ? 'bg-blue-500/20 text-blue-400 cursor-wait'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {analysisState === 'idle' && (
                <>
                  <FaPlay className="text-sm" />
                  Start Monitoring
                </>
              )}
              {analysisState === 'analyzing' && (
                <>
                  <FaSpinner className="text-sm animate-spin" />
                  Monitoring in Progress...
                </>
              )}
              {analysisState === 'complete' && (
                <>
                  <FaCheckCircle className="text-sm" />
                  Monitoring Active
                </>
              )}
            </motion.button>
          </div>

          {/* Right Side - Results */}
          <div className="w-1/2 h-full border-l border-white/10 p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {showResults ? (
                <Results 
                  key="results"
                  type={selectedAnalysis}
                  data={data}
                />
              ) : (
                <motion.div 
                  key="placeholder"
                  className="h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center text-gray-500">
                    <FaCrosshairs className="text-4xl mb-4 mx-auto" />
                    <p className="text-lg">Select monitoring type and click "Start Monitoring"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide14;