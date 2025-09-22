import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GoogleMap, useLoadScript, OverlayView, HeatmapLayer, TrafficLayer } from '@react-google-maps/api';
import { GiCctvCamera } from 'react-icons/gi';  // CCTV icon
import { BiCctv, BiRefresh, BiFullscreen, BiCog } from 'react-icons/bi'; // Base CCTV icon, refresh, fullscreen, cog icons
import { MdSettingsInputAntenna } from 'react-icons/md'; // For remote/entry points
import { HiOfficeBuilding } from 'react-icons/hi'; // For city infrastructure
import { BsPeopleFill } from 'react-icons/bs'; // For community areas
import { BsThermometerHigh } from 'react-icons/bs'; // For environmental monitoring
import { FaSmog, FaFireAlt, FaExclamationTriangle, FaAmbulance, FaTruck, FaCarAlt, FaUsers, FaCar, FaExclamationCircle, FaCamera, FaTrafficLight } from 'react-icons/fa'; // For air quality, fire, etc
import { GiSoundWaves } from 'react-icons/gi'; // For noise levels
import { MdLocalPolice, MdEmergency } from 'react-icons/md';
import { MdLocationOn } from 'react-icons/md'; // For command center marker

// Define locations data
const locations = [
  {
    id: 'command-1',
    type: 'command',
    label: 'Command Center',
    position: { lat: 23.1793, lng: 75.7949 },
    size: 100
  },
  {
    id: '4g-1',
    type: '4g',
    label: 'North Entry Point',
    position: { lat: 23.2293, lng: 75.8449 },
    size: 40
  },
  {
    id: '4g-2', 
    type: '4g',
    label: 'South Entry Point',
    position: { lat: 23.1293, lng: 75.7449 },
    size: 40
  },
  {
    id: '4g-3',
    type: '4g',
    label: 'East Entry Point', 
    position: { lat: 23.1793, lng: 75.8949 },
    size: 40
  },
  {
    id: '4g-4',
    type: '4g',
    label: 'West Entry Point',
    position: { lat: 23.1793, lng: 75.6949 },
    size: 40
  }
];

// Define community locations
const communityLocations = [
  {
    name: 'Freeganj',
    lat: 23.1745,
    lng: 75.7934
  },
  {
    name: 'Tower Square',
    lat: 23.1823,
    lng: 75.7967
  },
  {
    name: 'Nanakheda',
    lat: 23.1756,
    lng: 75.7989
  },
  {
    name: 'Mahakal Area',
    lat: 23.1812,
    lng: 75.7949
  },
  {
    name: 'Railway Station',
    lat: 23.1734,
    lng: 75.8012
  }
];

// Add crowd density data points for key locations in Ujjain
const crowdDensityPoints = [
  {
    name: 'Mahakal Temple',
    position: { lat: 23.1829, lng: 75.7682 },
    weight: 95 // Very high density
  },
  {
    name: 'Freeganj Market',
    position: { lat: 23.1745, lng: 75.7834 },
    weight: 85 // High density shopping area
  },
  {
    name: 'Ujjain Railway Station',
    position: { lat: 23.1734, lng: 75.7912 },
    weight: 75 // Transport hub
  },
  {
    name: 'Ram Ghat',
    position: { lat: 23.1821, lng: 75.7674 },
    weight: 70 // Religious site
  },
  {
    name: 'Tower Chowk',
    position: { lat: 23.1823, lng: 75.7867 },
    weight: 65 // City center
  },
  {
    name: 'Nanakheda Bus Stand',
    position: { lat: 23.1756, lng: 75.7889 },
    weight: 60 // Transport hub
  },
  {
    name: 'Gopal Mandir',
    position: { lat: 23.1836, lng: 75.7683 },
    weight: 55 // Temple area
  },
  {
    name: 'Mangalnath Temple',
    position: { lat: 23.1789, lng: 75.7595 },
    weight: 50 // Temple area
  },
  {
    name: 'Hari Phatak Bridge',
    position: { lat: 23.1772, lng: 75.7847 },
    weight: 45 // Major crossing
  },
  {
    name: 'Kaliadeh Palace',
    position: { lat: 23.2023, lng: 75.7705 },
    weight: 40 // Tourist spot
  }
];

// Update traffic monitoring data to focus on major incidents only
const trafficPoints = [
  {
    id: 'traffic-1',
    type: 'accident',
    severity: 'CRITICAL',
    location: { lat: 23.1823, lng: 75.7967 },
    description: 'Multi-vehicle collision',
    status: 'ACTIVE'
  },
  {
    id: 'traffic-2',
    type: 'accident',
    severity: 'HIGH',
    location: { lat: 23.1656, lng: 75.7789 }, // South Ujjain
    description: 'Vehicle overturned',
    status: 'RESPONDING'
  },
  {
    id: 'traffic-3',
    type: 'accident',
    severity: 'CRITICAL',
    location: { lat: 23.2123, lng: 75.7805 }, // North Ujjain
    description: 'Truck accident',
    status: 'ACTIVE'
  },
  {
    id: 'traffic-4',
    type: 'accident',
    severity: 'HIGH',
    location: { lat: 23.1721, lng: 75.7574 }, // West Ujjain
    description: 'Vehicle pile-up',
    status: 'RESPONDING'
  },
  {
    id: 'traffic-5',
    type: 'accident',
    severity: 'CRITICAL',
    location: { lat: 23.1789, lng: 75.8095 }, // East Ujjain
    description: 'Major collision',
    status: 'ACTIVE'
  }
];

// Add traffic flow data for major roads
const trafficFlowData = [
  {
    id: 'flow-1',
    path: [
      { lat: 23.1745, lng: 75.7834 }, // Freeganj
      { lat: 23.1823, lng: 75.7867 }  // Tower Square
    ],
    speed: 15, // km/h
    density: 0.8 // 0-1 scale
  },
  // Add more road segments...
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

const mapOptions = {
  center: { lat: 23.1793, lng: 75.7849 },
  zoom: 10,
  styles: [
    {
      "featureType": "all",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#E3F2FD" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ECEFF1" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{ "color": "#CFD8DC" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#90A4AE" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#E8F5E9" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{ "color": "#E1F5FE" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#37474F" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#FFFFFF" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#263238" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#2E7D32" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#C8E6C9" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#37474F" }]
    }
  ],
  disableDefaultUI: true,
  minZoom: 14,
  maxZoom: 19,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  backgroundColor: '#ffffff',
  restriction: {
    latLngBounds: {
      north: 23.2293,
      south: 23.1293,
      east: 75.8949,
      west: 75.6949,
    },
    strictBounds: true,
  }
};

// Add SVG filters
const Filters = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
    </filter>

    <radialGradient id="connectionGradient">
      <stop offset="0%" stopColor="#10b981" stopOpacity="0.6"/>
      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
    </radialGradient>
  </defs>
);

// Add connection lines component
const ConnectionLines = () => (
  <svg 
    className="absolute inset-0 pointer-events-none"
    style={{ 
      width: 'calc(100% - 25%)',
      marginLeft: '25%' 
    }}
  >
    <defs>
      <linearGradient id="connectionLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
        <stop offset="50%" stopColor="#10b981" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    {locations.filter(loc => loc.type !== "command").map(location => {
      const command = locations.find(l => l.type === "command");
      return (
        <g key={location.id}>
          <line
            x1={command.position.lng}
            y1={command.position.lat}
            x2={location.position.lng}
            y2={location.position.lat}
            stroke="url(#connectionLine)"
            strokeWidth={location.type === "4g" ? "3" : "2"}
            strokeDasharray="5,5"
            className="connection-line"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="20"
              dur={location.type === "4g" ? "1.5s" : "1s"}
              repeatCount="indefinite"
            />
          </line>
        </g>
      );
    })}
  </svg>
);

// Add monitoring zones visualization
const MonitoringZones = () => (
  <svg 
    className="absolute inset-0 pointer-events-none" 
    style={{ 
      width: 'calc(100% - 25%)',
      marginLeft: '25%' 
    }}
  >
    <defs>
      <radialGradient id="zoneGradient">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1"/>
        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
      </radialGradient>
    </defs>
    
    {/* Center point - Mahakal Temple */}
    <circle
      cx={locations[0].position.lng}
      cy={locations[0].position.lat}
      r="5"
      fill="#10b981"
      filter="url(#glow)"
    />

    {/* City zone - 5km radius */}
    <circle
      cx={locations[0].position.lng}
      cy={locations[0].position.lat}
      r="30"
      fill="none"
      stroke="#10b981"
      strokeWidth="1.5"
      strokeDasharray="5,5"
      opacity="0.4"
    >
      <animate
        attributeName="opacity"
        values="0.4;0.1;0.4"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Community zone - 50km radius */}
    <circle
      cx={locations[0].position.lng}
      cy={locations[0].position.lat}
      r="70"
      fill="none"
      stroke="#10b981"
      strokeWidth="1.5"
      strokeDasharray="10,10"
      opacity="0.3"
    >
      <animate
        attributeName="opacity"
        values="0.3;0.1;0.3"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Entry points zone - 200km radius */}
    <circle
      cx={locations[0].position.lng}
      cy={locations[0].position.lat}
      r="120"
      fill="none"
      stroke="#10b981"
      strokeWidth="2"
      strokeDasharray="15,15"
      opacity="0.2"
    >
      <animate
        attributeName="opacity"
        values="0.2;0.05;0.2"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

// Add incident severity constants
const SEVERITY = {
  CRITICAL: { color: '#ef4444', pulse: true },  // Red
  HIGH: { color: '#f97316', pulse: true },      // Orange
  MEDIUM: { color: '#facc15', pulse: false },   // Yellow
  LOW: { color: '#22c55e', pulse: false }       // Green
};

// Update the INCIDENT_TYPES constant to use available icons
const INCIDENT_TYPES = {
  FIRE: { icon: FaFireAlt, color: '#ef4444' },      // Using FaFireAlt instead of FaFireTruck
  MEDICAL: { icon: FaAmbulance, color: '#0ea5e9' },
  POLICE: { icon: MdLocalPolice, color: '#6366f1' },
  SOS: { icon: MdEmergency, color: '#f43f5e' }
};

// Update mock incidents generator with spread out locations
const generateMockIncidents = () => {
  const incidents = [
    {
      id: 'inc-1',
      type: 'FIRE',
      severity: 'CRITICAL',
      location: { lat: 23.1836, lng: 75.7683 }, // Near Gopal Mandir
      description: 'Major fire at commercial complex',
      units: 3,
      status: 'RESPONDING'
    },
    {
      id: 'inc-2',
      type: 'MEDICAL',
      severity: 'HIGH',
      location: { lat: 23.1772, lng: 75.7847 }, // Near Hari Phatak Bridge
      description: 'Multi-vehicle accident',
      units: 2,
      status: 'ON_SCENE'
    },
    {
      id: 'inc-3',
      type: 'POLICE',
      severity: 'MEDIUM',
      location: { lat: 23.1789, lng: 75.7595 }, // Near Mangalnath Temple
      description: 'Public disturbance',
      units: 1,
      status: 'EN_ROUTE'
    },
    {
      id: 'inc-4',
      type: 'SOS',
      severity: 'CRITICAL',
      location: { lat: 23.2023, lng: 75.7705 }, // Near Kaliadeh Palace
      description: 'SOS signal triggered',
      units: 0,
      status: 'PENDING'
    },
    {
      id: 'inc-5',
      type: 'FIRE',
      severity: 'HIGH',
      location: { lat: 23.1756, lng: 75.7889 }, // Nanakheda Bus Stand
      description: 'Vehicle fire',
      units: 2,
      status: 'RESPONDING'
    }
  ];
  return incidents;
};

// Add incident marker component
const IncidentMarker = ({ incident }) => {
  const IconComponent = INCIDENT_TYPES[incident.type].icon;
  const severity = SEVERITY[incident.severity];
  
  return (
    <OverlayView
      position={incident.location}
      mapPaneName={OverlayView.OVERLAY_LAYER}
    >
      <div className="relative">
        {/* Severity ring */}
        <div 
          className={`absolute -inset-2 rounded-full ${severity.pulse ? 'animate-ping' : ''}`}
          style={{ backgroundColor: `${severity.color}33` }} 
        />
        
        {/* Icon container */}
        <div 
          className="relative p-3 rounded-full shadow-lg"
          style={{ backgroundColor: INCIDENT_TYPES[incident.type].color }}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        
        {/* Status badge */}
        <div className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white rounded-full bg-black/50">
          {incident.units > 0 ? `${incident.units} units` : 'PENDING'}
        </div>
      </div>
    </OverlayView>
  );
};

// Add function to generate crowd density heatmap data
const generateCrowdDensityData = () => {
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
    return [];
  }

  try {
    // Create base points from known locations
    const points = crowdDensityPoints.map(point => ({
      location: new window.google.maps.LatLng(point.position.lat, point.position.lng),
      weight: point.weight
    }));

    // Add some random points around major locations for more natural spread
    crowdDensityPoints.forEach(basePoint => {
      const spreadPoints = 10;
      for (let i = 0; i < spreadPoints; i++) {
        const spreadRadius = 0.002; // Roughly 200m
        const lat = basePoint.position.lat + (Math.random() - 0.5) * spreadRadius;
        const lng = basePoint.position.lng + (Math.random() - 0.5) * spreadRadius;
        const weight = basePoint.weight * (0.3 + Math.random() * 0.7); // 30-100% of base weight

        points.push({
          location: new window.google.maps.LatLng(lat, lng),
          weight
        });
      }
    });

    return points;
  } catch (err) {
    console.error('Error generating crowd density data:', err);
    return [];
  }
};

// Add crowd density heatmap options
const getCrowdDensityHeatmapOptions = () => ({
  dissipating: true,
  radius: 50,
  maxIntensity: 100,
  gradient: [
    'rgba(0, 0, 0, 0)',
    'rgba(0, 255, 255, 0.4)',
    'rgba(0, 255, 0, 0.6)',
    'rgba(255, 255, 0, 0.8)',
    'rgba(255, 0, 0, 1)'
  ]
});

// Update zoom presets with higher zoom levels
const zoomPresets = [
  {
    name: "Critical Incidents",
    icon: <FaExclamationTriangle className="text-2xl" />,
    location: { lat: 23.1793, lng: 75.7849 },
    zoom: 16,
    description: "Live incident monitoring & response",
    type: "incidents"
  },
  {
    name: "Traffic Monitoring",
    icon: <FaCar className="text-2xl" />,
    location: { lat: 23.1793, lng: 75.7849 },
    zoom: 16,
    description: "Real-time traffic & incidents",
    type: "traffic"
  },
  {
    name: "Crowd Density",
    icon: <FaUsers className="text-2xl" />,
    location: { lat: 23.1829, lng: 75.7682 }, // Centered on Mahakal Temple
        zoom: 15,
    description: "Real-time crowd monitoring",
    type: "crowd"
  },
  {
    name: "Environmental Sensors",
    subOptions: [
      {
        name: "Air Quality Index",
        icon: <FaSmog className="text-2xl" />,
        location: { lat: 23.1793, lng: 75.7849 },
        zoom: 16,
        description: "Real-time air quality monitoring",
        type: "air"
      },
      {
        name: "Noise Levels",
        icon: <GiSoundWaves className="text-2xl" />,
        location: { lat: 23.1793, lng: 75.7849 },
        zoom: 16,
        description: "Urban noise monitoring",
        type: "noise"
      },
      {
        name: "Fire Detection",
        icon: <FaFireAlt className="text-2xl" />,
        location: { lat: 23.1793, lng: 75.7849 },
        zoom: 16,
        description: "Thermal anomaly detection",
        type: "fire"
      },
      {
        name: "Environmental Stats",
        icon: <BsThermometerHigh className="text-2xl" />,
        location: { lat: 23.1793, lng: 75.7849 },
        zoom: 16,
        description: "Temperature & humidity sensors",
        type: "env"
      }
    ]
  }
];

// Update heatmap data generator to handle Google Maps API initialization
const generateHeatmapData = (type) => {
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
    return [];
  }

  try {
    const points = [];
    const cityCenter = { lat: 23.1793, lng: 75.7849 };
    const radius = 0.015; // Increased radius for better spread

    // Generate points with patterns based on type
    for (let i = 0; i < 100; i++) { // Increased point count
      const angle = (i / 100) * Math.PI * 2;
      const radiusVariation = Math.random() * radius;
      const lat = cityCenter.lat + Math.cos(angle) * radiusVariation;
      const lng = cityCenter.lng + Math.sin(angle) * radiusVariation;
      
      let weight;
      switch(type) {
        case 'air':
          weight = 200 + Math.random() * 300; // 200-500 AQI range
          break;
        case 'noise':
          weight = 40 + Math.random() * 60; // 40-100 dB range
          break;
        case 'fire':
          weight = Math.random() * 100; // 0-100 temperature range
          break;
        case 'env':
          weight = 20 + Math.random() * 80; // 20-100 range
          break;
        default:
          weight = Math.random() * 100;
      }

        points.push({
          location: new window.google.maps.LatLng(lat, lng),
          weight
        });
    }

    return points;
  } catch (err) {
    console.error('Error generating heatmap data:', err);
    return [];
  }
};

// Add heatmap styles for different types
const getHeatmapOptions = (type) => {
  const baseOptions = {
    dissipating: true,
    radius: 50,
    opacity: 0.8,
    maxIntensity: type === 'air' ? 500 : 100
  };

  switch(type) {
    case 'air':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 255, 0, 0)',
          'rgba(0, 255, 0, 0.6)',
          'rgba(255, 255, 0, 0.7)',
          'rgba(255, 128, 0, 0.8)',
          'rgba(255, 0, 0, 0.9)'
        ]
      };
    case 'noise':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 0, 255, 0)',
          'rgba(0, 0, 255, 0.6)',
          'rgba(0, 255, 255, 0.7)',
          'rgba(255, 255, 0, 0.8)',
          'rgba(255, 0, 0, 0.9)'
        ]
      };
    case 'fire':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 0, 0, 0)',
          'rgba(255, 255, 0, 0.6)',
          'rgba(255, 128, 0, 0.7)',
          'rgba(255, 0, 0, 0.8)'
        ]
      };
    case 'env':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 0, 255, 0)',
          'rgba(0, 255, 255, 0.6)',
          'rgba(0, 255, 0, 0.7)',
          'rgba(255, 255, 0, 0.8)',
          'rgba(255, 0, 0, 0.9)'
        ]
      };
    default:
      return baseOptions;
  }
};

// Update the UI to show infrastructure options
const InfrastructureSelector = ({ onSelect, activeLayers }) => (
  <div className="space-y-2">
    {zoomPresets.map((preset, index) => (
      <div key={preset.name}>
        {preset.subOptions ? (
          <div className="space-y-1">
            <div className="text-gray-600 text-xs font-medium mb-1">{preset.name}</div>
            {preset.subOptions.map(subOption => (
              <motion.button
                key={subOption.name}
                className={`w-full p-2 rounded-lg transition-all duration-300 group
                  ${activeLayers.has(subOption.type) 
                    ? 'bg-blue-500 border-blue-600 shadow-sm' 
                    : 'bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300'}
                  border`}
                onClick={() => onSelect(subOption)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`text-lg ${
                    activeLayers.has(subOption.type) 
                      ? 'text-white' 
                      : 'text-gray-600'
                  }`}>
                  {subOption.icon}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${
                      activeLayers.has(subOption.type) 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }`}>
                      {subOption.name}
                    </p>
                    <p className={`text-[10px] truncate ${
                      activeLayers.has(subOption.type)
                        ? 'text-blue-50'
                        : 'text-gray-500'
                    }`}>
                      {subOption.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.button
            className={`w-full p-2 rounded-lg transition-all duration-300 group
              ${activeLayers.has(preset.type) 
                ? 'bg-blue-500 border-blue-600 shadow-sm' 
                : 'bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300'}
              border`}
            onClick={() => onSelect(preset)}
          >
            <div className="flex items-center space-x-2">
              <div className={`text-lg ${
                activeLayers.has(preset.type) 
                  ? 'text-white' 
                  : 'text-gray-600'
              }`}>
              {preset.icon}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${
                  activeLayers.has(preset.type) 
                    ? 'text-white' 
                    : 'text-gray-700'
                }`}>
                  {preset.name}
                </p>
                <p className={`text-[10px] truncate ${
                  activeLayers.has(preset.type)
                    ? 'text-blue-50'
                    : 'text-gray-500'
                }`}>
                  {preset.description}
                </p>
              </div>
            </div>
          </motion.button>
        )}
      </div>
    ))}
  </div>
);

// Add sensor marker component
const SensorMarker = ({ position, type, value }) => (
  <OverlayView
    position={position}
    mapPaneName={OverlayView.OVERLAY_LAYER}
  >
    <div className="marker">
      <svg width="40" height="40" className="overflow-visible">
        <Filters />
        {/* Sensor circle */}
        <circle
          cx="20"
          cy="20"
          r="15"
          fill={(() => {
            switch(type) {
              case 'air': return 'rgba(255, 100, 100, 0.3)';
              case 'noise': return 'rgba(100, 100, 255, 0.3)';
              case 'fire': return 'rgba(255, 150, 50, 0.3)';
              case 'env': return 'rgba(100, 255, 100, 0.3)';
              default: return 'rgba(255, 255, 255, 0.3)';
            }
          })()}
          stroke={(() => {
            switch(type) {
              case 'air': return '#ff6464';
              case 'noise': return '#6464ff';
              case 'fire': return '#ff9632';
              case 'env': return '#64ff64';
              default: return '#ffffff';
            }
          })()}
          strokeWidth="2"
        >
          <animate
            attributeName="r"
            values="15;20;15"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Value text */}
        <text
          x="20"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          {value}
        </text>
      </svg>
    </div>
  </OverlayView>
);

// Update TrafficMarker component to focus on accidents
const TrafficMarker = ({ data }) => {
  const getIcon = () => FaExclamationCircle; // Only using accident icon now

  const getColor = () => {
    switch(data.severity) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      default: return '#ffffff';
    }
  };

  const IconComponent = getIcon();
  const color = getColor();

  return (
    <OverlayView
      position={data.location}
      mapPaneName={OverlayView.OVERLAY_LAYER}
    >
      <div className="relative">
        <div className={`absolute -inset-2 rounded-full ${data.severity === 'CRITICAL' ? 'animate-ping' : ''}`}
          style={{ backgroundColor: `${color}33` }} 
        />
        <div className="relative p-3 rounded-full shadow-lg border-2 border-white"
          style={{ backgroundColor: color }}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-bold text-gray-700 rounded-full bg-white/90 shadow-md whitespace-nowrap">
          {data.description}
        </div>
        <div className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-gray-700 rounded-full bg-white/90 shadow-md">
          {data.status}
        </div>
      </div>
    </OverlayView>
  );
};

// Add traffic flow visualization component
const TrafficFlow = ({ flow }) => {
  const getFlowColor = (density) => {
    if (density > 0.8) return '#ef4444'; // Red
    if (density > 0.6) return '#f97316'; // Orange
    if (density > 0.4) return '#facc15'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg width="100%" height="100%">
        <path
          d={`M ${flow.path[0].lng} ${flow.path[0].lat} L ${flow.path[1].lng} ${flow.path[1].lat}`}
          stroke={getFlowColor(flow.density)}
          strokeWidth="3"
          strokeDasharray="6,6"
          opacity="0.8"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="12;0"
            dur={`${Math.max(1, flow.speed/10)}s`}
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

const LiveDashboard = ({ isActive }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ["visualization", "places"],
    preventGoogleFontsLoading: true
  });

  const mapRef = useRef(null);
  const svgRef = useRef(null);
  const [activeView, setActiveView] = useState('integrated');
  const [heatmapData, setHeatmapData] = useState(null);
  const [heatmapOptions, setHeatmapOptions] = useState(null);
  const [incidents, setIncidents] = useState(generateMockIncidents());
  const [trafficData, setTrafficData] = useState(trafficPoints);
  const [showTrafficFlow, setShowTrafficFlow] = useState(false);
  const [showTrafficLayer, setShowTrafficLayer] = useState(false);
  const [activeLayers, setActiveLayers] = useState(new Set(['incidents'])); // Start with incidents layer

  const handleMapLoad = (map) => {
    if (map) {
      mapRef.current = map;
    }
  };

  const initializeHeatmap = (type) => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      console.warn('Google Maps not ready for heatmap');
      return null;
    }

    try {
      const newHeatmapData = generateHeatmapData(type);
      setHeatmapData(newHeatmapData);
      setHeatmapOptions(getHeatmapOptions(type));
    } catch (err) {
      console.error('Error initializing heatmap:', err);
    }
  };

  const handleInfrastructureSelect = (option) => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.warn('Google Maps not ready');
      return;
    }

    try {
      // Toggle the selected layer
      setActiveLayers(prev => {
        const newLayers = new Set(prev);
        if (newLayers.has(option.type)) {
          newLayers.delete(option.type);
        } else {
          newLayers.add(option.type);
          // Update map view for newly added layer
          if (option.type === 'traffic') {
        const bounds = new window.google.maps.LatLngBounds();
            trafficData.forEach(point => {
              bounds.extend(new window.google.maps.LatLng(
                point.location.lat,
                point.location.lng
              ));
            });
            const sidebarOffset = window.innerWidth * 0.125;
            mapRef.current.fitBounds(bounds, {
              padding: { 
                top: 50, 
                right: 50, 
                bottom: 50, 
                left: 50 + sidebarOffset
              }
            });
            setTimeout(() => {
              if (mapRef.current.getZoom() < 16) {
                mapRef.current.setZoom(16);
              }
            }, 100);
          } else if (option.type === 'crowd') {
            const crowdData = generateCrowdDensityData();
            setHeatmapData(crowdData);
            setHeatmapOptions(getCrowdDensityHeatmapOptions());
            mapRef.current.panTo(option.location);
            mapRef.current.setZoom(17);
      } else if (['air', 'noise', 'fire', 'env'].includes(option.type)) {
        initializeHeatmap(option.type);
        mapRef.current.panTo(option.location);
            mapRef.current.setZoom(17);
      }
        }
        return newLayers;
      });
    } catch (err) {
      console.error('Error in handleInfrastructureSelect:', err);
    }
  };

  useEffect(() => {
    if (!isActive || !isLoaded || !svgRef.current) return;

    // D3 visualization code here
    const svg = d3.select(svgRef.current);
    // ... rest of your D3 code
  }, [isActive, isLoaded]);

  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center">Loading maps...</div>;
  if (loadError) return <div className="w-full h-full flex items-center justify-center">Error loading maps</div>;

  return (
      <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
          options={{
            ...mapOptions,
            styles: mapOptions.styles
          }}
                onLoad={handleMapLoad}
                onError={(error) => {
                  console.error('Google Maps Error:', error);
                }}
              >
                <MonitoringZones />
                
          {/* Show traffic layer and markers if active */}
          {activeLayers.has('traffic') && (
            <>
              <TrafficLayer />
              {trafficData.map(point => (
                <TrafficMarker 
                  key={point.id} 
                  data={point} 
                />
              ))}
            </>
          )}

          {/* Show command center always */}
                {locations && locations[0] && (
                  <OverlayView
                    key="command-center"
                    position={locations[0].position}
                    mapPaneName={OverlayView.OVERLAY_LAYER}
                  >
                    <div className="marker">
                <div className="relative">
                  {/* Pulsing background */}
                  <div className="absolute -inset-4 rounded-full animate-ping" 
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }} 
                  />
                  
                  {/* Icon container */}
                  <div className="relative p-4 rounded-full bg-emerald-500 shadow-lg border-2 border-white">
                    <MdLocationOn className="w-8 h-8 text-white" />
                    </div>
                  
                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-bold text-gray-700 rounded-full bg-white/90 shadow-md whitespace-nowrap">
                    Command Center
                  </div>
                </div>
                    </div>
                  </OverlayView>
          )}

          {/* Show heatmap layers if active */}
          {(['air', 'noise', 'fire', 'env', 'crowd'].some(type => activeLayers.has(type))) && 
                 window.google && 
                 heatmapData && (
                    <HeatmapLayer
                      data={heatmapData}
                      options={heatmapOptions}
                    />
          )}

          {/* Show incidents if active */}
          {activeLayers.has('incidents') && 
            incidents.map(incident => (
              <IncidentMarker 
                key={incident.id} 
                incident={incident} 
              />
            ))
          }
              </GoogleMap>

        {activeLayers.has('remote') && <ConnectionLines />}
          </div>

      {/* Sidebar */}
      <div className="absolute left-0 top-0 w-[220px] p-4 h-full z-50">
        <div className="p-3 rounded-xl bg-white/80 shadow-lg border border-gray-200 backdrop-blur-md">
          <h3 className="text-gray-900 font-semibold mb-2 text-sm">Infrastructure</h3>
              <InfrastructureSelector 
                onSelect={handleInfrastructureSelect}
            activeLayers={activeLayers}
              />
            </div>
        </div>
      </div>
  );
};

export default LiveDashboard; 