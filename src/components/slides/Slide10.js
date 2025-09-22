import { motion } from 'framer-motion';
import { useState } from 'react';
import Slide from '../Slide';
import ReactFlow, { 
  Background, 
  Controls,
  MarkerType,
  Position,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  FaEye, 
  FaBrain, 
  FaServer, 
  FaCamera, 
  FaAmbulance,
  FaBell,
  FaUsers,
  FaPhone,
  FaExclamationTriangle,
  FaDatabase,
  FaShieldAlt,
  FaRoad,
  FaLandmark,
  FaStore,
  FaCarSide,
  FaMicrophone,
  FaVideo,
  FaFileAlt,
  FaMapMarkedAlt,
  FaUserShield,
  FaLock,
  FaPlane,
  FaFacebook, 
  FaTwitter, 
  FaYoutube, 
  FaInstagram,
  FaGlobe
} from 'react-icons/fa';
import { BiCommand, BiCctv } from 'react-icons/bi';
import { MdSecurity, MdWarning, MdNotifications, MdLocationOn } from 'react-icons/md';
import { IoSpeedometer } from 'react-icons/io5';

// Add this import for the drone gif
const droneGif = "https://i.gifer.com/SpxP.gif";

const NoiseBg = () => (
  <svg className="absolute inset-0 opacity-[0.015] w-full h-full"
    viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <filter id='noiseFilter'>
      <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch' />
    </filter>
    <rect width='100%' height='100%' filter='url(#noiseFilter)' />
  </svg>
);

const CustomNode = ({ data, onNodeClick }) => {
  const handleClick = () => {
    onNodeClick(data);
  };

  // Different node styles based on type
  const nodeStyles = {
    cctv: (
      <div 
        className={`px-4 py-3 rounded-xl border-2 ${data.style} relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform`}
        onClick={handleClick}
      >
        {/* Animated surveillance lines in background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-[1px] bg-blue-400 w-full"
              style={{
                top: `${30 * i}%`,
                animation: `scanLine 3s ${i * 0.5}s infinite linear`
              }}
            />
          ))}
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3">
          <Handle type="source" position={Position.Right} />
        </div>
        
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3">
          <Handle type="target" position={Position.Left} />
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <data.icon className={`text-2xl ${data.iconColor}`} />
          </div>
          <div>
            <div className="font-medium text-white">{data.label}</div>
            <div className="text-xs text-gray-400 mt-1">{data.description}</div>
            {data.stats && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {data.stats.map((stat, i) => (
                  <div key={i} className="text-[10px] text-gray-500">
                    {stat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    sensor: (
      <div 
        className={`px-4 py-3 rounded-xl border ${data.style} relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
        onClick={handleClick}
      >
        {/* Pulsing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-500/0">
          <div className="absolute inset-0 animate-pulse bg-amber-500/5" />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3">
          <Handle type="source" position={Position.Right} />
        </div>
        
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3">
          <Handle type="target" position={Position.Left} />
        </div>

        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <data.icon className={`text-2xl ${data.iconColor}`} />
            </div>
            {/* Animated rings */}
            <div className="absolute inset-0 animate-ping bg-amber-500/20 rounded-lg" />
          </div>
          <div>
            <div className="font-medium text-white">{data.label}</div>
            <div className="text-xs text-gray-400 mt-1">{data.description}</div>
            {data.readings && (
              <div className="mt-2 flex gap-3">
                {data.readings.map((reading, i) => (
                  <div key={i} className="text-[10px] text-gray-400">
                    <span className="text-amber-400">{reading.value}</span>
                    <span className="ml-1">{reading.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    command: (
      <div 
        className={`px-6 py-4 rounded-xl border ${data.style} relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
        onClick={handleClick}
      >
        {/* Command center background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-red-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3">
          <Handle type="source" position={Position.Right} />
        </div>
        
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3">
          <Handle type="target" position={Position.Left} />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm">
              <data.icon className={`text-3xl ${data.iconColor}`} />
            </div>
            {/* Rotating border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-xl animate-spin-slow -z-10" />
          </div>
          <div>
            <div className="font-medium text-white text-lg">{data.label}</div>
            <div className="text-sm text-gray-400 mt-1">{data.description}</div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: data.delay || 0 }}
    >
      {nodeStyles[data.type] || nodeStyles.default}
    </motion.div>
  );
};

// Update CameraNode with 16:9 ratio
const CameraNode = ({ data, onNodeClick }) => {
  const handleClick = () => {
    onNodeClick(data);
  };

  return (
  <div 
    className={`px-4 py-3 rounded-xl border-2 ${data.style} relative overflow-hidden group w-[280px] h-[157.5px] cursor-pointer hover:scale-105 transition-transform`}
    onClick={handleClick}
  >
    {/* Video container */}
    <div className="absolute inset-0">
      <video 
        className="w-full h-full object-cover"
        src={data.videoUrl}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
    </div>

    {/* Handles */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 z-20">
      <Handle type="source" position={Position.Right} />
    </div>
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 z-20">
      <Handle type="target" position={Position.Left} />
    </div>

    {/* Title Only */}
    <div className="relative z-20">
      <div className="font-medium text-white text-lg">
        {data.label}
      </div>
    </div>
  </div>
  );
};

// Update SensorNode to include footer
const SensorNode = ({ data, onNodeClick }) => {
  const handleClick = () => {
    onNodeClick(data);
  };

  return (
  <div 
    className={`px-4 py-3 rounded-xl border ${data.style} relative overflow-hidden w-[280px] cursor-pointer hover:scale-105 transition-transform`}
    onClick={handleClick}
  >
    {/* Animated sensor waves */}
    <div className="absolute inset-0">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-indigo-500/20 rounded-full"
          style={{
            width: '100%',
            height: '100%',
            animation: `sensorWave 3s ${i * 0.5}s infinite ease-out`
          }}
        />
      ))}
    </div>

    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3">
      <Handle type="source" position={Position.Right} />
    </div>
    
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3">
      <Handle type="target" position={Position.Left} />
    </div>

    <div className="relative z-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 backdrop-blur-sm">
          <data.icon className={`text-2xl ${data.iconColor}`} />
        </div>
        <div>
          <div className="font-medium text-white text-lg">{data.label}</div>
          <div className="text-sm text-gray-400">{data.description}</div>
        </div>
      </div>

      {/* Readings */}
      {data.readings && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {data.readings.map((reading, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-medium text-indigo-400">
                {reading.value}
              </div>
              <div className="text-xs text-gray-500">
                {reading.unit}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Sources */}
      {data.sources && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2">
            {data.sources.map((source, i) => (
              <div 
                key={i} 
                className="text-xs text-gray-400 flex items-center gap-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                {source}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status indicators */}
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Active
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Processing
        </div>
      </div>
    </div>
  </div>
  );
};

// Update command node to include footer
const CommandNode = ({ data, onNodeClick }) => {
  const handleClick = () => {
    onNodeClick(data);
  };

  return (
  <div 
    className={`px-6 py-4 rounded-xl border ${data.style} relative overflow-hidden w-[320px] cursor-pointer hover:scale-105 transition-transform`}
    onClick={handleClick}
  >
    {/* Command center background effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-red-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
    </div>

    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3">
      <Handle type="source" position={Position.Right} />
    </div>
    
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3">
      <Handle type="target" position={Position.Left} />
    </div>

    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm">
          <data.icon className={`text-3xl ${data.iconColor}`} />
        </div>
        {/* Rotating border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-xl animate-spin-slow -z-10" />
      </div>
      <div>
        <div className="font-medium text-white text-lg">{data.label}</div>
        <div className="text-sm text-gray-400 mt-1">{data.description}</div>
      </div>
    </div>

    {/* Add status footer */}
    <div className="mt-4 pt-3 border-t border-white/10">
      <div className="grid grid-cols-4 gap-2">
        <StatusIndicator label="Systems" value="100%" color="green" />
        <StatusIndicator label="Network" value="98.2%" color="green" />
        <StatusIndicator label="AI" value="Active" color="blue" />
        <StatusIndicator label="Alerts" value="2" color="red" />
      </div>
    </div>
  </div>
  );
};

// Helper component for command center status
const StatusIndicator = ({ label, value, color }) => (
  <div className="text-center">
    <div className={`text-sm font-medium text-${color}-400`}>{value}</div>
    <div className="text-[10px] text-gray-500">{label}</div>
  </div>
);

// First, update the node positions and sizes
const nodes = [
  // Input Layer - Left Side Sources (move slightly left)
  {
    id: 'cctv1',
    type: 'camera',
    position: { x: 0, y: 100 },  // Moved more left
    data: {
      type: 'cctv',
      label: 'City CCTV Network',
      description: 'Integrated surveillance cameras',
      icon: BiCctv,
      iconColor: 'text-blue-400',
      style: 'bg-blue-500/10 border-blue-500/30',
      delay: 0.2,
      stats: [
        '1000+ Cameras',
        '24/7 Recording',
        'AI Enabled',
        'HD Quality'
      ],
      videoUrl: '/carvideos/anpr7.mov'
    }
  },
  {
    id: 'cctv2',
    type: 'camera',
    position: { x: 0, y: 300 },  // Moved more left
    data: {
      type: 'cctv',
      label: 'Community Feeds',
      description: 'Private & community cameras',
      icon: FaVideo,
      iconColor: 'text-green-400',
      style: 'bg-green-500/10 border-green-500/30',
      delay: 0.3,
      stats: [
        '500+ Locations',
        'Temple Areas',
        'Markets',
        'Public Spaces'
      ],
      videoUrl: '/feed2.mov'
    }
  },
  {
    id: 'mobile',
    type: 'sensor',
    position: { x: 0, y: 500 },
    data: {
      type: 'sensor',
      label: 'Mobile Units',
      description: 'Patrol & Response Vehicles',
      icon: FaCarSide,
      iconColor: 'text-indigo-400',
      style: 'bg-indigo-500/10 border-indigo-500/30',
      delay: 0.5,
      readings: [
        { value: '12', unit: 'Active Units' },
        { value: '35km/h', unit: 'Avg Speed' },
        { value: '92%', unit: 'Coverage' }
      ]
    }
  },
  {
    id: 'sensors',
    type: 'sensor',
    position: { x: 0, y: 700 },  // Moved more left
    data: {
      type: 'sensor',
      label: 'Smart Sensors',
      description: 'Environmental & Security Sensors',
      icon: IoSpeedometer,
      iconColor: 'text-amber-400',
      style: 'bg-amber-500/10 border-amber-500/30',
      delay: 0.6,
      readings: [
        { value: '32°C', unit: 'Temp' },
        { value: '75%', unit: 'Humidity' },
        { value: '65dB', unit: 'Noise' }
      ]
    }
  },

  // Aerial Node - Above Intelligence
  {
    id: 'cctv3',
    type: 'aerial',
    position: { x: 400, y: 50 },  // Adjusted position
    data: {
      type: 'aerial',
      label: 'Aerial Surveillance',
      description: 'Drone-based monitoring',
      icon: FaPlane,
      iconColor: 'text-cyan-400',
      style: 'bg-cyan-500/10 border-cyan-500/30',
      delay: 0.4,
      stats: [
        'Active Drones: 3',
        'Coverage: 12km²',
        'HD Thermal',
        'Night Vision'
      ]
    }
  },

  // Central Intelligence Node (larger and centered)
  {
    id: 'intelligence',
    type: 'intelligence',  // New type for larger node
    position: { x: 400, y: 300 },  // Centered position
    data: {
      type: 'intelligence',
      label: 'Intelligence',
      description: 'AI-powered Unified Intelligence System',
      icon: FaBrain,
      iconColor: 'text-purple-400',
      style: 'bg-purple-500/10 border-purple-500/30',
      delay: 0.7,
      stats: [
        'Real-time Analysis',
        'Threat Detection',
        'Pattern Recognition',
        'Behavioral Analysis',
        'Predictive Alerts',
        'Fake News Analysis'
      ]
    }
  },

  // Data Integration (below Intelligence)
  {
    id: 'integration',
    type: 'sensor',
    position: { x: 400, y: 600 },  // Moved down from y: 550
    data: {
      type: 'sensor',
      label: 'Data Integration',
      description: 'Multi-source fusion system',
      icon: FaDatabase,
      iconColor: 'text-blue-400',
      style: 'bg-blue-500/10 border-blue-500/30',
      delay: 0.8,
      readings: [
        { value: 'Camera', unit: 'Feeds' },
        { value: 'Traffic', unit: 'Sensors' },
        { value: 'Weather', unit: 'Data' }
      ],
      sources: [
        'Event schedules',
        'Historical patterns',
        'Road work schedules',
        'School timings'
      ]
    }
  },

  // Command Layer (moved right)
  {
    id: 'cc',
    type: 'command',
    position: { x: 900, y: 300 },  // Aligned with Intelligence
    data: {
      type: 'command',
      label: 'Intelligent Integrated Command & Control Center',
      description: '',  // Removed the 'Central Operations Hub' subtitle
      icon: BiCommand,
      iconColor: 'text-white',
      style: 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-red-500/20 border-white/30',
      delay: 1
    }
  },

  // Action Layer (moved further right)
  {
    id: 'emergency',
    type: 'action',
    position: { x: 1300, y: 50 },
    data: {
      label: 'Emergency Response',
      description: 'Rapid incident management & coordination',
      icon: FaAmbulance,
      iconColor: 'text-red-400',
      style: 'bg-red-500/10 border-red-500/30',
      delay: 1.1
    }
  },
  {
    id: 'traffic',
    type: 'action',
    position: { x: 1300, y: 150 },
    data: {
      label: 'Traffic Management',
      description: 'Violations & smart challan system',
      icon: FaRoad,
      iconColor: 'text-blue-400',
      style: 'bg-blue-500/10 border-blue-500/30',
      delay: 1.2
    }
  },
  {
    id: 'vip',
    type: 'action',
    position: { x: 1300, y: 250 },
    data: {
      label: 'VIP Movement',
      description: 'Route planning & security coordination',
      icon: FaUserShield,
      iconColor: 'text-purple-400',
      style: 'bg-purple-500/10 border-purple-500/30',
      delay: 1.3
    }
  },
  {
    id: 'events',
    type: 'action',
    position: { x: 1300, y: 350 },
    data: {
      label: 'Event Management',
      description: 'Crowd monitoring & safety protocols',
      icon: FaUsers,
      iconColor: 'text-green-400',
      style: 'bg-green-500/10 border-green-500/30',
      delay: 1.4
    }
  },
  {
    id: 'watchlist',
    type: 'action',
    position: { x: 1300, y: 450 },
    data: {
      label: 'Watchlist Management',
      description: 'Person & vehicle tracking system',
      icon: FaEye,
      iconColor: 'text-amber-400',
      style: 'bg-amber-500/10 border-amber-500/30',
      delay: 1.5
    }
  },
  {
    id: 'pa',
    type: 'action',
    position: { x: 1300, y: 550 },
    data: {
      label: 'Public Communication',
      description: 'Announcements & emergency broadcasts',
      icon: FaMicrophone,
      iconColor: 'text-yellow-400',
      style: 'bg-yellow-500/10 border-yellow-500/30',
      delay: 1.6
    }
  },
  {
    id: 'grievance',
    type: 'action',
    position: { x: 1300, y: 650 },
    data: {
      label: 'Public Grievances',
      description: 'Complaint tracking & resolution',
      icon: FaBell,
      iconColor: 'text-pink-400',
      style: 'bg-pink-500/10 border-pink-500/30',
      delay: 1.7
    }
  },
  {
    id: 'evidence',
    type: 'action',
    position: { x: 1300, y: 750 },
    data: {
      label: 'Digital Evidence',
      description: 'Investigation support & documentation',
      icon: FaFileAlt,
      iconColor: 'text-indigo-400',
      style: 'bg-indigo-500/10 border-indigo-500/30',
      delay: 1.8
    }
  },
  {
    id: 'social',
    type: 'social',
    position: { x: 400, y: 900 },  // Moved down from y: 800
    data: {
      type: 'social',
      label: 'Social Media',
      description: 'Public sentiment analysis',
      icon: FaGlobe,
      iconColor: 'text-blue-400',
      style: 'bg-blue-500/10 border-blue-500/30',
      delay: 0.6,
      platforms: [
        { icon: FaFacebook, color: 'text-blue-500' },
        { icon: FaTwitter, color: 'text-sky-400' },
        { icon: FaYoutube, color: 'text-red-500' },
        { icon: FaInstagram, color: 'text-pink-500' },
        { icon: FaGlobe, color: 'text-green-400' }
      ]
    }
  },
  {
    id: 'social-monitoring',
    type: 'action',
    position: { x: 1300, y: 850 },
    data: {
      label: 'Social Monitoring',
      description: 'Real-time sentiment & trend analysis',
      icon: FaGlobe,
      iconColor: 'text-blue-400',
      style: 'bg-blue-500/10 border-blue-500/30',
      delay: 1.9
    }
  },
  {
    id: 'fake-news',
    type: 'action',
    position: { x: 1300, y: 950 },
    data: {
      label: 'Fake News Detection',
      description: 'AI-powered misinformation tracking',
      icon: FaExclamationTriangle,
      iconColor: 'text-orange-400',
      style: 'bg-orange-500/10 border-orange-500/30',
      delay: 2.0
    }
  }
];

const edges = [
  // All video sources to Intelligence
  { 
    id: 'city-intelligence', 
    source: 'cctv1', 
    target: 'intelligence',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'community-intelligence', 
    source: 'cctv2', 
    target: 'intelligence',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#22c55e', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'aerial-intelligence', 
    source: 'cctv3', 
    target: 'intelligence',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#06b6d4', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'mobile-intelligence', 
    source: 'mobile', 
    target: 'intelligence',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 3, opacity: 1 }
  },

  // Smart sensors to Data Integration
  { 
    id: 'sensors-integration', 
    source: 'sensors', 
    target: 'integration',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 3, opacity: 1 }
  },

  // Social media to Data Integration
  { 
    id: 'social-integration', 
    source: 'social', 
    target: 'integration',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 3, opacity: 1 }
  },

  // Data Integration to Intelligence
  { 
    id: 'integration-intelligence', 
    source: 'integration', 
    target: 'intelligence',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 3, opacity: 1 }
  },

  // Intelligence to Command Center
  { 
    id: 'intelligence-cc', 
    source: 'intelligence', 
    target: 'cc',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#a855f7', strokeWidth: 3, opacity: 1 }
  },

  // Command center to all actions
  { 
    id: 'cc-traffic', 
    source: 'cc', 
    target: 'traffic',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'cc-vip', 
    source: 'cc', 
    target: 'vip',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#a855f7', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'cc-events', 
    source: 'cc', 
    target: 'events',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#22c55e', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'cc-watchlist', 
    source: 'cc', 
    target: 'watchlist',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'cc-grievance', 
    source: 'cc', 
    target: 'grievance',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#ec4899', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'cc-social-monitoring', 
    source: 'cc', 
    target: 'social-monitoring',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 3, opacity: 1 }
  },
  { 
    id: 'cc-fake-news', 
    source: 'cc', 
    target: 'fake-news',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#f97316', strokeWidth: 3, opacity: 1 }
  }
].map(edge => ({
  ...edge,
  markerEnd: { 
    type: MarkerType.ArrowClosed,
    color: edge.style.stroke
  }
}));

// Add new Intelligence node type
const IntelligenceNode = ({ data, onNodeClick }) => {
  const handleClick = () => {
    onNodeClick(data);
  };

  return (
  <div 
    className={`px-6 py-5 rounded-xl border-2 ${data.style} relative overflow-hidden group w-[400px] cursor-pointer hover:scale-105 transition-transform`}
    onClick={handleClick}
  >
    {/* Animated background effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      {/* Neural network animation in background */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pulse ${2 + Math.random() * 2}s infinite`
          }}
        />
      ))}
    </div>

    {/* Handles */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 z-20">
      <Handle type="source" position={Position.Right} />
    </div>
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 z-20">
      <Handle type="target" position={Position.Left} />
    </div>

    {/* Content */}
    <div className="relative z-20">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-500/20 backdrop-blur-sm">
          <data.icon className="text-4xl text-purple-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{data.label}</div>
          <div className="text-sm text-gray-300 mt-1">{data.description}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.stats.map((stat, i) => (
          <div 
            key={i}
            className="px-3 py-2 rounded-lg bg-purple-500/5 border border-purple-500/20"
          >
            <div className="text-xs text-purple-300">{stat}</div>
          </div>
        ))}
      </div>

      {/* Activity Indicators */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Active
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Processing Data
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            AI Learning
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

// Add new ActionNode component
const ActionNode = ({ data, onNodeClick }) => {
  const handleClick = () => {
    onNodeClick(data);
  };

  return (
  <div 
    className={`px-4 py-3 rounded-xl border ${data.style} relative overflow-hidden w-[240px] group hover:scale-105 transition-transform duration-200 cursor-pointer`}
    onClick={handleClick}
  >
    {/* Subtle animated background */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>

    {/* Handles */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3">
      <Handle type="source" position={Position.Right} />
    </div>
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3">
      <Handle type="target" position={Position.Left} />
    </div>

    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm">
        <data.icon className={`text-xl ${data.iconColor}`} />
      </div>
      <div>
        <div className="font-bold text-white text-base">{data.label}</div>
        <div className="text-sm text-gray-300 mt-0.5">{data.description}</div>
      </div>
    </div>
  </div>
  );
};

// Update nodeTypes to accept onNodeClick prop
const createNodeTypes = (onNodeClick) => ({
  camera: (props) => <CameraNode {...props} onNodeClick={onNodeClick} />,
  sensor: (props) => <SensorNode {...props} onNodeClick={onNodeClick} />,
  aerial: ({ data }) => {
    const handleClick = () => {
      onNodeClick(data);
    };

    return (
    <div 
      className={`px-4 py-3 rounded-xl border-2 ${data.style} relative overflow-hidden group w-[280px] h-[157.5px] cursor-pointer hover:scale-105 transition-transform`}
      onClick={handleClick}
    >
      {/* Video container */}
      <div className="absolute inset-0">
        <video 
          className="w-full h-full object-cover"
          src="/puri/dronetemple1.mov"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
      </div>

      {/* Handles */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 z-20">
        <Handle type="source" position={Position.Right} />
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 z-20">
        <Handle type="target" position={Position.Left} />
      </div>

      {/* Title Only */}
      <div className="relative z-20">
        <div className="font-medium text-white text-lg">
          {data.label}
        </div>
      </div>
    </div>
    );
  },
  command: (props) => <CommandNode {...props} onNodeClick={onNodeClick} />,
  intelligence: (props) => <IntelligenceNode {...props} onNodeClick={onNodeClick} />,
  social: ({ data }) => {
    const handleClick = () => {
      onNodeClick(data);
    };

    return (
    <div 
      className={`px-4 py-3 rounded-xl border ${data.style} relative overflow-hidden w-[280px] cursor-pointer hover:scale-105 transition-transform`}
      onClick={handleClick}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      </div>

      {/* Handles */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 z-20">
        <Handle type="source" position={Position.Right} />
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 backdrop-blur-sm">
            <data.icon className={`text-2xl ${data.iconColor}`} />
          </div>
          <div>
            <div className="font-bold text-white text-lg flex items-center gap-2">
              {data.label}
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="text-sm text-gray-300 mt-1">{data.description}</div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            {data.platforms.map((platform, i) => (
              <div 
                key={i}
                className="p-2 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <platform.icon className={`text-xl ${platform.color}`} />
              </div>
            ))}
          </div>
          {/* Live indicators */}
          <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Feed
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Sentiment Analysis
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  },
  action: (props) => <ActionNode {...props} onNodeClick={onNodeClick} />
});

// Add this new component for animated edge
const AnimatedEdge = ({
  id,
  source,
  target,
  style,
  animated
}) => {
  return (
    <g>
      {/* Base line */}
      <path
        className={`react-flow__edge-path`}
        d={`M${source.x} ${source.y}L${target.x} ${target.y}`}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: style.stroke + '40' // More transparent base line
        }}
      />
      
      {/* Animated particles */}
      <circle
        className="animate-flow-particle"
        r={2}
        fill={style.stroke}
      >
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={`M${source.x} ${source.y}L${target.x} ${target.y}`}
        >
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>
    </g>
  );
};

// Add keyframes for scan line animation
const scanLineAnimation = `
  @keyframes scanLine {
    0% {
      transform: translateY(0) translateX(-100%);
    }
    100% {
      transform: translateY(0) translateX(100%);
    }
  }
`;

// Update flowStyles to include scan line animation
const flowStyles = `
  ${scanLineAnimation}
  
  @keyframes sensorWave {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }

  @keyframes graphBars {
    0%, 100% {
      height: var(--random-height);
    }
    50% {
      height: calc(var(--random-height) * 1.5);
    }
  }

  @keyframes altitudeLine {
    0%, 100% {
      transform: scaleX(1);
      opacity: 0.2;
    }
    50% {
      transform: scaleX(1.1);
      opacity: 0.3;
    }
  }

  .react-flow__edge {
    stroke-width: 3;
    opacity: 1;
  }

  .react-flow__edge-path {
    stroke-width: 3;
  }

  .animated-edge {
    stroke-dasharray: 5;
    animation: flow 1s linear infinite;
  }

  @keyframes flow {
    0% {
      stroke-dashoffset: 20;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
`;

const Slide10 = ({ isActive }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleNodeClick = (nodeData) => {
    setSelectedNode(nodeData);
    setShowPanel(true);
  };

  const closePanel = () => {
    setShowPanel(false);
    setSelectedNode(null);
  };

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        {/* Add SVG filters for glow effects */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Add flow animation styles */}
        <style>{flowStyles}</style>

        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[130px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.12, 0.07, 0.12],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <NoiseBg />

        <motion.div 
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={createNodeTypes(handleNodeClick)}
            fitView
            style={{ 
              width: '100%', 
              height: '100%',
              background: '#111111'
            }}
            minZoom={0.5}
            maxZoom={1.5}
            defaultViewport={{ zoom: 1 }}
          >
            <Background 
              color="#ffffff20"
              gap={20}
              size={1}
            />
            <Controls 
              showInteractive={false}
              className="!bg-white/5 !border-white/10"
            />
          </ReactFlow>
        </motion.div>

        {/* Information Panel */}
        {showPanel && selectedNode && (
          <motion.div
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={closePanel}
          >
            <motion.div
              className="absolute right-8 top-8 bg-gray-900/95 border border-white/20 rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    {selectedNode.icon && <selectedNode.icon className={`text-2xl ${selectedNode.iconColor}`} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedNode.label}</h3>
                    <p className="text-sm text-gray-400">{selectedNode.description}</p>
                  </div>
                </div>
                <button
                  onClick={closePanel}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic content based on node type */}
              <div className="space-y-4">
                {selectedNode.stats && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Statistics</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNode.stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-2">
                          <div className="text-xs text-gray-400">{stat}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.readings && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Current Readings</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedNode.readings.map((reading, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-lg font-medium text-blue-400">{reading.value}</div>
                          <div className="text-xs text-gray-400">{reading.unit}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.sources && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Data Sources</h4>
                    <div className="space-y-1">
                      {selectedNode.sources.map((source, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                          {source}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.platforms && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Monitored Platforms</h4>
                    <div className="flex gap-2">
                      {selectedNode.platforms.map((platform, i) => (
                        <div key={i} className="p-2 rounded-lg bg-white/5">
                          <platform.icon className={`text-xl ${platform.color}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Open Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Title Overlay */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-2">
            AI-Powered Intelligence System
          </h2>
          <p className="text-gray-400">
            Advanced analytics and threat detection for comprehensive city surveillance
          </p>
        </motion.div>
      </div>
    </Slide>
  );
};

export default Slide10; 