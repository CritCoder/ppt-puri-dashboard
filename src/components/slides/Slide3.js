import { motion, AnimatePresence } from 'framer-motion';
import Slide from '../Slide';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GoogleMap, useLoadScript, OverlayView, HeatmapLayer } from '@react-google-maps/api';
import { GiCctvCamera } from 'react-icons/gi';  // CCTV icon
import { communityLocations, locations } from './mapData';  // Import the location data
import { BiCctv, BiRefresh, BiFullscreen, BiCog } from 'react-icons/bi'; // Base CCTV icon, refresh, fullscreen, cog icons
import { MdSettingsInputAntenna } from 'react-icons/md'; // For remote/entry points
import { HiOfficeBuilding } from 'react-icons/hi'; // For city infrastructure
import { BsPeopleFill } from 'react-icons/bs'; // For community areas
import { BsThermometerHigh } from 'react-icons/bs'; // For environmental monitoring
import { FaSmog, FaFireAlt } from 'react-icons/fa'; // For air quality and fire
import { GiSoundWaves } from 'react-icons/gi'; // For noise levels

const mapContainerStyle = {
  width: '100%',  // Changed from 'calc(100% - 25%)'
  height: '100%',
  marginLeft: '0'  // Changed from '25%'
};

const mapOptions = {
  center: { lat: 19.8077, lng: 85.8315 },
  zoom: 10,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#000814" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#38414e" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9ca5b3" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#f3d19c" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#17263c" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#515c6d" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#17263c" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#263c3f" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#6b9a76" }]
    },
    {
      "featureType": "poi.business",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi.government",
      "elementType": "geometry",
      "stylers": [{ "visibility": "on" }]
    },
    {
      "featureType": "poi.place_of_worship",
      "elementType": "geometry",
      "stylers": [{ "visibility": "on" }, { "color": "#3c2c1a" }]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{ "color": "#2f3948" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    }
  ],
  disableDefaultUI: true,
  minZoom: 7,
  maxZoom: 19,
  zoomTransition: 'smooth',
  animatedZoom: true
};

// Update CCTVIcon to have different radii for different types
const CCTVIcon = ({ size, type }) => (
  <g transform={`translate(${-size/2},${-size/2})`}>
    {/* Platform with glow */}
    <circle
      cx={size/2}
      cy={size/2}
      r={(() => {
        switch(type) {
          case "command":
            return size/2;
          case "integrated":
          case "community":
            return size;
          case "4g":  // For remote monitoring
            return size/2.5;
          default:
            return size/2;
        }
      })()}
      fill={type === "command" ? "rgba(6, 78, 59, 0.4)" : "rgba(16, 185, 129, 0.2)"}
      filter="url(#glow)"
    />
    
    {/* CCTV Icon */}
    <foreignObject x="0" y="0" width={size} height={size}>
      <div className="h-full w-full flex items-center justify-center">
        <GiCctvCamera 
          className={`${type === "command" ? "text-emerald-600" : "text-emerald-500"}`}
          style={{ 
            width: size * 0.6, 
            height: size * 0.6,
            filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))"
          }}
        />
      </div>
    </foreignObject>
  </g>
);

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
    
    {/* Center point - Jagannath Temple */}
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

// Update city camera generation to place cameras around community locations
const generateCityCameras = () => {
  return communityLocations.flatMap((location, idx) => {
    // Generate 5-8 cameras around each community location
    const cameraCount = 5 + Math.floor(Math.random() * 4);
    return Array.from({ length: cameraCount }, (_, i) => ({
      id: `city-cam-${idx}-${i}`,
      type: "city",
      label: `${location.name} Cam ${i + 1}`,
      size: 20, // Even smaller for less visual clutter
      position: {
        lat: location.lat + (Math.random() - 0.5) * 0.002, // Tighter spread (~200m radius)
        lng: location.lng + (Math.random() - 0.5) * 0.002
      }
    }));
  });
};

// Update the cityCameras constant
const cityCameras = generateCityCameras();

// Update zoom presets
const zoomPresets = [
  {
    name: "Integrated City",
    icon: <HiOfficeBuilding className="text-2xl" />,
    location: { lat: 19.8077, lng: 85.8315 },
    zoom: 14,
    description: "3000+ cameras across city infrastructure",
    type: "integrated"
  },
  {
    name: "MagixBox Infrastructure",
    subOptions: [
      {
        name: "Community Network",
        icon: <BsPeopleFill className="text-2xl" />,
        location: { lat: 19.8025, lng: 85.8315 },
        zoom: 15,
        description: "Unified MagicBoxes in community clusters",
        type: "community"
      },
      {
        name: "Remote Monitoring",
        icon: <MdSettingsInputAntenna className="text-2xl" />,
        location: { lat: 19.8077, lng: 85.9500 },
        zoom: 8,
        description: "Hundreds of cameras at entry points",
        type: "remote"
      }
    ]
  },
  {
    name: "Environmental Sensors",
    subOptions: [
      {
        name: "Air Quality Index",
        icon: <FaSmog className="text-2xl" />,
        location: { lat: 19.8077, lng: 85.8315 },
        zoom: 16,
        description: "Real-time air quality monitoring",
        type: "air"
      },
      {
        name: "Noise Levels",
        icon: <GiSoundWaves className="text-2xl" />,
        location: { lat: 19.8077, lng: 85.8315 },
        zoom: 16,
        description: "Urban noise monitoring",
        type: "noise"
      },
      {
        name: "Fire Detection",
        icon: <FaFireAlt className="text-2xl" />,
        location: { lat: 19.8077, lng: 85.8315 },
        zoom: 16,
        description: "Thermal anomaly detection",
        type: "fire"
      },
      {
        name: "Environmental Stats",
        icon: <BsThermometerHigh className="text-2xl" />,
        location: { lat: 19.8077, lng: 85.8315 },
        zoom: 16,
        description: "Temperature & humidity sensors",
        type: "env"
      }
    ]
  }
];

// Generate random city cameras for integrated view
const generateIntegratedCameras = () => {
  const cityBounds = {
    north: 19.8377,
    south: 19.7777,
    east: 85.8350, // Reduced east boundary to stay on land (coastline is around 85.83-85.84)
    west: 85.8015
  };
  
  return Array.from({ length: 30 }, (_, i) => ({
    id: `integrated-cam-${i}`,
    type: "integrated",
    label: `City Cam ${i + 1}`,
    size: 35, // Increased from 15 to 35 to match community size
    position: {
      lat: cityBounds.south + (Math.random() * (cityBounds.north - cityBounds.south)),
      lng: cityBounds.west + (Math.random() * (cityBounds.east - cityBounds.west))
    }
  }));
};

// Generate community cluster cameras
const generateCommunityCameras = () => {
  return communityLocations.flatMap((location, idx) => {
    // Generate 2-3 cameras per cluster to total ~30
    const cameraCount = 2 + Math.floor(Math.random() * 2);
    return Array.from({ length: cameraCount }, (_, i) => ({
      id: `community-cam-${idx}-${i}`,
      type: "community",
      label: `${location.name} Cam ${i + 1}`,
      size: 35, // Increased from 18 to 35 for wider visual coverage
      position: {
        lat: location.lat + (Math.random() - 0.5) * 0.006, // Doubled spread from 0.003 to 0.006
        lng: location.lng + (Math.random() - 0.5) * 0.006
      }
    }));
  });
};

// Update heatmap data generator to handle Google Maps API initialization
const generateHeatmapData = (type) => {
  // Return empty array if Google Maps API is not available
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
    return [];
  }

  try {
    const points = [];
    const cityCenter = { lat: 19.8077, lng: 85.8315 };
    const radius = 0.01;

    // Generate 50 points with different weights based on type
    for (let i = 0; i < 50; i++) {
      const lat = cityCenter.lat + (Math.random() - 0.5) * radius * 2;
      const lng = cityCenter.lng + (Math.random() - 0.5) * radius * 2;
      let weight;

      switch(type) {
        case 'air':
          weight = Math.random() * 500;
          break;
        case 'noise':
          weight = 30 + Math.random() * 90;
          break;
        case 'fire':
          weight = Math.random() * 100;
          break;
        case 'env':
          weight = Math.random() * 100;
          break;
        default:
          weight = Math.random();
      }

      try {
        points.push({
          location: new window.google.maps.LatLng(lat, lng),
          weight
        });
      } catch (err) {
        console.warn('Error creating LatLng object:', err);
        continue;
      }
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
    radius: 50
  };

  switch(type) {
    case 'air':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 255, 0, 0)',
          'rgba(0, 255, 0, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(255, 128, 0, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      };
    case 'noise':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 0, 255, 0)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 255, 255, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      };
    case 'fire':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 0, 0, 0)',
          'rgba(255, 255, 0, 1)',
          'rgba(255, 128, 0, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      };
    case 'env':
      return {
        ...baseOptions,
        gradient: [
          'rgba(0, 0, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 255, 0, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      };
    default:
      return baseOptions;
  }
};

// Update the UI to show infrastructure options
const InfrastructureSelector = ({ onSelect, activeView }) => (
  <div className="space-y-4">
    {zoomPresets.map((preset, index) => (
      <div key={preset.name}>
        {preset.subOptions ? (
          // MagixBox with sub-options
          <div className="space-y-2">
            <div className="text-white/80 text-sm font-medium mb-2">{preset.name}</div>
            {preset.subOptions.map(subOption => (
              <motion.button
                key={subOption.name}
                className={`w-full p-4 rounded-lg transition-all duration-300 group
                  ${activeView === subOption.type 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-black/40 border-white/10 hover:bg-black/60 hover:border-white/20'}
                  border`}
                onClick={() => onSelect(subOption)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center space-x-3">
                  {subOption.icon}
                  <div className="text-left">
                    <p className="text-white font-medium group-hover:text-gray-200">
                      {subOption.name}
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                      {subOption.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          // Integrated City option
          <motion.button
            className={`w-full p-4 rounded-lg transition-all duration-300 group
              ${activeView === preset.type 
                ? 'bg-white/20 border-white/30' 
                : 'bg-black/40 border-white/10 hover:bg-black/60 hover:border-white/20'}
              border`}
            onClick={() => onSelect(preset)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center space-x-3">
              {preset.icon}
              <div className="text-left">
                <p className="text-white font-medium group-hover:text-gray-200">
                  {preset.name}
                </p>
                <p className="text-xs text-gray-400 group-hover:text-gray-300">
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

// Update text slides
const textSlides = [
  {
    title: "Building the Foundation",
    description: "Advanced Surveillance Infrastructure"
  },
  {
    title: "3000+ Cameras",
    description: "Strategically placed across Puri"
  },
  {
    title: "Command & Control",
    description: "All connected to a state-of-art command center"
  },
  {
    title: "24/7 Monitoring with AI",
    description: "Real-time surveillance and incident response"
  },
  {
    title: "Smart Infrastructure",
    description: "Click to explore our city-wide network"
  }
];

const Slide3 = ({ isActive }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ["visualization", "places"],
    onUnmount: () => {
      if (window.google && window.google.maps) {
        delete window.google.maps;
      }
    }
  });

  const mapRef = useRef(null);
  const svgRef = useRef(null);
  const videoRef = useRef(null);
  const [activeView, setActiveView] = useState('integrated');
  const [cameras, setCameras] = useState(generateIntegratedCameras());
  const [heatmapData, setHeatmapData] = useState(null);
  const [heatmapOptions, setHeatmapOptions] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showTint, setShowTint] = useState(false);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
      if (window.google && window.google.maps) {
        delete window.google.maps;
      }
    };
  }, []);

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
    if (option.type === 'integrated') {
      setShowMap(true);
    }
    
    setActiveView(option.type);
    
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.warn('Google Maps not ready');
      return;
    }

    try {
      if (option.type === 'remote') {
        const bounds = new window.google.maps.LatLngBounds();
        locations
          .filter(loc => loc.type === "4g")
          .forEach(loc => {
            try {
              bounds.extend(new window.google.maps.LatLng(
                loc.position.lat,
                loc.position.lng
              ));
            } catch (err) {
              console.warn('Error extending bounds:', err);
            }
          });
        mapRef.current.fitBounds(bounds, 100);
      } else if (['air', 'noise', 'fire', 'env'].includes(option.type)) {
        initializeHeatmap(option.type);
        mapRef.current.panTo(option.location);
        mapRef.current.setZoom(option.zoom);
      } else {
        mapRef.current.panTo(option.location);
        mapRef.current.setZoom(option.zoom);
      }
    } catch (err) {
      console.error('Error in handleInfrastructureSelect:', err);
    }
  };

  // Update VideoBackground component
  const VideoBackground = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
      if (videoRef.current) {
        // Set playback rate to 0.35 when video loads
        videoRef.current.playbackRate = 0.35;
      }
    }, []);

    // Update key press handler in VideoBackground
    useEffect(() => {
      const handleKeyPress = (e) => {
        // Ignore arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;
        
        if (currentSlide < textSlides.length - 1) {
          setCurrentSlide(prev => prev + 1);
        } else {
          // On last slide, any key press triggers map view
          setShowMap(true);
          setActiveView('integrated');
          
          // Simple direct transition to final view
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.setZoom(14);
              mapRef.current.panTo({ lat: 19.8077, lng: 85.8315 });
            }
          }, 500);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentSlide]);

    useEffect(() => {
      if (videoRef.current) {
        const handleVideoLoad = () => {
          setIsVideoReady(true);
          // Ensure playback rate is set after load
          videoRef.current.playbackRate = 0.35;
        };

        const handleTimeUpdate = () => {
          if (!videoRef.current || !isVideoReady) return;

          // Only check for video end if we're on the last slide
          if (currentSlide === textSlides.length - 1) {
            const timeLeft = videoRef.current.duration - videoRef.current.currentTime;
            if (timeLeft < 2) {
              setShowTint(true);
              
              // Trigger map view after tint
              setTimeout(() => {
                setShowMap(true);
                setActiveView('integrated');
                
                // Simple direct transition to final view
                setTimeout(() => {
                  if (mapRef.current) {
                    mapRef.current.setZoom(14);
                    mapRef.current.panTo({ lat: 19.8077, lng: 85.8315 });
                  }
                }, 500);
              }, 3000);
            }
          }
        };

        videoRef.current.addEventListener('loadedmetadata', handleVideoLoad);
        videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', handleVideoLoad);
            videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          }
        };
      }
    }, [isVideoReady]);

    return (
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        >
          <source src="/puri/drone3.mov" type="video/mp4" />
        </video>
        
        {/* Permanent dark overlay */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-4xl mx-auto px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.h2 
                  className="text-6xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {textSlides[currentSlide].title}
                </motion.h2>
                <motion.p 
                  className="text-2xl text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {textSlides[currentSlide].description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Additional tint overlay that fades in near video end */}
        <motion.div 
          className="absolute inset-0 bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: showTint ? 0.80 : 0 }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>
    );
  };

  useEffect(() => {
    if (!isActive || !isLoaded || !svgRef.current) return;

    // D3 visualization code here
    const svg = d3.select(svgRef.current);
    // ... rest of your D3 code
  }, [isActive, isLoaded]);

  useEffect(() => {
    // Generate appropriate cameras based on active view
    switch(activeView) {
      case 'integrated':
        setCameras(generateIntegratedCameras());
        break;
      case 'community':
        setCameras(generateCommunityCameras());
        break;
      case 'remote':
        setCameras(locations.filter(loc => loc.type === "4g"));
        break;
      default:
        setCameras([]);
    }
  }, [activeView]);

  // Helper function to determine marker visibility
  const shouldShowMarker = (markerType) => {
    switch (activeView) {
      case 'temple':
        return markerType === 'command';
      case 'city':
        return markerType === 'command' || markerType === 'wifi';
      case 'entry':
        return markerType === 'command' || markerType === '4g';
      default:
        return true;
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden">
        <AnimatePresence>
          {!showMap && <VideoBackground />}
          
          {showMap && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                options={mapOptions}
                onLoad={handleMapLoad}
                onError={(error) => {
                  console.error('Google Maps Error:', error);
                }}
              >
                <MonitoringZones />
                
                {/* Show command center in all views */}
                {locations && locations[0] && (
                  <OverlayView
                    key="command-center"
                    position={locations[0].position}
                    mapPaneName={OverlayView.OVERLAY_LAYER}
                  >
                    <div className="marker">
                      <svg
                        width={100 * 1.5}
                        height={100 * 1.5}
                        className="overflow-visible"
                      >
                        <Filters />
                        <g transform={`translate(${100 * 0.75},${100 * 0.75})`}>
                          <CCTVIcon size={100} type="command" />
                        </g>
                      </svg>
                    </div>
                  </OverlayView>
                )}

                {/* Show cameras if not in environmental mode */}
                {!['air', 'noise', 'fire', 'env'].includes(activeView) && 
                 cameras && 
                 cameras.map(camera => (
                  <OverlayView
                    key={camera.id}
                    position={camera.position}
                    mapPaneName={OverlayView.OVERLAY_LAYER}
                  >
                    <div className="marker">
                      <svg
                        width={camera.size}
                        height={camera.size}
                        className="overflow-visible"
                      >
                        <Filters />
                        <g transform={`translate(${camera.size * 0.5},${camera.size * 0.5})`}>
                          <CCTVIcon size={camera.size} type={camera.type} />
                        </g>
                        {/* Pulsing effect */}
                        <circle
                          cx={camera.size * 0.5}
                          cy={camera.size * 0.5}
                          r={camera.size * 0.3}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="1"
                          opacity="0.5"
                        >
                          <animate
                            attributeName="r"
                            values={`${camera.size * 0.3};${camera.size * 0.4};${camera.size * 0.3}`}
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.5;0.1;0.5"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                    </div>
                  </OverlayView>
                ))}

                {/* Show heatmap and sensors for environmental views */}
                {['air', 'noise', 'fire', 'env'].includes(activeView) && 
                 window.google && 
                 heatmapData && (
                  <>
                    <HeatmapLayer
                      data={heatmapData}
                      options={heatmapOptions}
                    />
                    {generateHeatmapData(activeView).map((point, index) => (
                      point && point.location && (
                        <SensorMarker
                          key={`sensor-${index}`}
                          position={point.location}
                          type={activeView}
                          value={(() => {
                            switch(activeView) {
                              case 'air': return `${Math.round(point.weight)} AQI`;
                              case 'noise': return `${Math.round(point.weight)} dB`;
                              case 'fire': return `${Math.round(point.weight)}°C`;
                              case 'env': return `${Math.round(point.weight)}%`;
                              default: return '';
                            }
                          })()}
                        />
                      )
                    ))}
                  </>
                )}
              </GoogleMap>

              {activeView === 'remote' && <ConnectionLines />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar - fully transparent */}
        <div className="absolute left-0 top-0 w-1/4 p-8 h-full z-50">
          {/* Command Bar - minimal background */}
          <div className="fixed top-0 left-0 right-0 h-16 backdrop-blur-[2px] border-b border-white/5 px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.p 
                className="text-sm tracking-wide text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Building the foundation / <span className="text-white">Infrastructure </span>
              </motion.p>
            </div>
          </div>

          <motion.div className="space-y-8 mt-16">
            <div className="p-6 rounded-xl backdrop-blur-[2px] border border-white/5">
              <h3 className="text-white font-semibold mb-4 text-lg">Infrastructure Options</h3>
              <InfrastructureSelector 
                onSelect={handleInfrastructureSelect}
                activeView={activeView}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide3; 