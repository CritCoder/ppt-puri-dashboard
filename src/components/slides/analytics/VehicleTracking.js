import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  FaUsers, FaSpinner, FaCrosshairs, FaUserCircle,
  FaIdCard, FaHistory, FaClock, FaMapMarkerAlt, FaExclamationTriangle, FaVideo, FaMapMarkedAlt, FaPlay, FaPause, FaStepForward, FaStepBackward
} from 'react-icons/fa';
import ShimmerCard from './ShimmerCard';
import { GoogleMap, useLoadScript, Marker, Polyline, OverlayView } from '@react-google-maps/api';

const sampleImages = [
  { id: 1, src: '/cars/car1.png', label: 'Tower Chowk' },
  { id: 2, src: '/cars/car2.png', label: 'Dewas Gate' },
  { id: 3, src: '/cars/car3.png', label: 'Begum Bagh' },
  { id: 4, src: '/cars/car4.png', label: 'Gopal Mandir' },
  { id: 5, src: '/cars/car5.png', label: 'Kanthal Chowk' },
  { id: 6, src: '/cars/car6.png', label: 'Daulatganj' },
  { id: 7, src: '/cars/car7.png', label: 'Freeganj' },
  { id: 8, src: '/cars/car8.png', label: 'Malipura' },
];

// First, let's modify the sample data structure for vehicles
const detectedVehicles = [
  {
    id: 1,
    plateNumber: "OD02 AB1234",
    type: "SUV",
    make: "Toyota",
    model: "Fortuner",
    color: "White",
    photo: "/cars/car1.png",
    lastSeen: "2 minutes ago",
    location: "Jagannath Temple Entry",
    category: "HIGH_RISK",
    status: "Stolen Vehicle",
    threat_level: "High",
    violations: ["Stolen Vehicle", "Multiple Traffic Violations"],
    police_records: {
      fir_numbers: ["FIR-2023-1234", "FIR-2023-5678"],
      previous_violations: 3,
      pending_cases: 2,
      jurisdiction: "Puri Police"
    },
    vehicle_details: {
      year: "2022",
      owner: "Unknown",
      registration_status: "Reported Stolen",
      last_known_owner: "Rajesh Kumar"
    },
    history: [
      { 
        date: "2024-03-15", 
        location: "Jagannath Temple", 
        duration: "45 mins",
        activity: "Suspicious parking near temple premises",
        camera_id: "CAM_JT_01",
        speed: "35 km/h",
        direction: "Northbound"
      },
      // ... more history entries
    ],
    alerts: [
      "Reported stolen on 2024-02-15",
      "Fake registration plates suspected",
      "Associated with criminal activities"
    ]
  },
  {
    id: 2,
    plateNumber: "OD04 CD5678",
    type: "Sedan",
    make: "Honda",
    model: "City",
    color: "Black",
    photo: "/cars/car2.png",
    lastSeen: "5 minutes ago",
    location: "Swargadwar Beach Entry",
    category: "MEDIUM_RISK",
    status: "Suspicious Activity",
    threat_level: "Medium",
    violations: ["Unauthorized Access", "Speed Violation"],
    police_records: {
      fir_numbers: ["FIR-2023-8765"],
      previous_violations: 2,
      pending_cases: 1,
      jurisdiction: "Puri Police"
    },
    vehicle_details: {
      year: "2021",
      owner: "Suresh Patel",
      registration_status: "Active",
      last_known_owner: "Suresh Patel"
    },
    history: [
      { 
        date: "2024-03-14", 
        location: "Swargadwar Beach", 
        duration: "1 hour",
        activity: "Suspicious parking behavior",
        camera_id: "CAM_SB_01",
        speed: "45 km/h",
        direction: "Southbound"
      },
      { 
        date: "2024-03-13", 
        location: "Jagannath Temple", 
        duration: "30 mins",
        activity: "Multiple entry attempts",
        camera_id: "CAM_JT_02",
        speed: "25 km/h",
        direction: "Eastbound"
      }
    ],
    alerts: [
      "Multiple security zone violations",
      "Reported suspicious behavior"
    ]
  },
  {
    id: 3,
    plateNumber: "OD01 XY9012",
    type: "Truck",
    make: "Tata",
    model: "407",
    color: "Blue",
    photo: "/cars/car3.png",
    lastSeen: "15 minutes ago",
    location: "Grand Road (Bada Danda)",
    category: "HIGH_RISK",
    status: "Security Threat",
    threat_level: "High",
    violations: ["Unauthorized Cargo", "No Permit"],
    police_records: {
      fir_numbers: ["FIR-2023-9012"],
      previous_violations: 4,
      pending_cases: 2,
      jurisdiction: "Puri Police"
    },
    vehicle_details: {
      year: "2020",
      owner: "Unknown",
      registration_status: "Expired",
      last_known_owner: "Ramesh Kumar"
    },
    history: [
      { 
        date: "2024-03-15", 
        location: "Grand Road", 
        duration: "2 hours",
        activity: "Unauthorized cargo loading",
        camera_id: "CAM_GR_01",
        speed: "20 km/h",
        direction: "Westbound"
      }
    ],
    alerts: [
      "Unauthorized cargo transport",
      "Multiple permit violations"
    ]
  }
];

// Add ghat coordinates
const ghatLocations = {
  "Ram Ghat": { lat: 23.1828, lng: 75.7682 },
  "Ram Ghat Entry": { lat: 23.1831, lng: 75.7685 },
  "Datt Ghat": { lat: 23.1815, lng: 75.7675 },
  "Datt Ghat Entry": { lat: 23.1818, lng: 75.7678 },
  "Mangalnath Ghat": { lat: 23.1802, lng: 75.7668 },
  "Siddhwat Ghat": { lat: 23.1845, lng: 75.7692 }
};

// Move mapOptions to the top, before any component definitions
const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
  ],
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false
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

// First, add a videoSources array near the top of the file
const videoSources = [
  '/carvideos/anpr1.mp4',
  '/carvideos/anpr2.mov',
  '/carvideos/anpr3.mov',
  '/carvideos/anpr5.mov',
  '/carvideos/anpr6.mov',
  '/carvideos/anpr7.mov'
];

// Update the PersonDetails component to VehicleDetails
const VehicleDetails = ({ vehicle }) => {
  const [selectedSighting, setSelectedSighting] = useState(vehicle.history[0]);
  const [timeOffset, setTimeOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getThreatLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset(prev => {
          if (prev >= 20) {
            setIsPlaying(false);
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Vehicle Profile Header */}
      <div className="flex gap-4">
        <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white/10">
          <img src={vehicle.photo} alt={vehicle.plateNumber} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{vehicle.plateNumber}</h2>
              <p className="text-sm text-gray-400">
                {vehicle.make} {vehicle.model} ({vehicle.color})
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getThreatLevelColor(vehicle.threat_level)}`}>
              {vehicle.threat_level} Risk
            </span>
          </div>
          
          {/* Vehicle Info Grid */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-sm text-gray-400">
              Type: <span className="text-white">{vehicle.type}</span>
            </div>
            <div className="text-sm text-gray-400">
              Year: <span className="text-white">{vehicle.vehicle_details.year}</span>
            </div>
            <div className="text-sm text-gray-400">
              Owner: <span className="text-white">{vehicle.vehicle_details.last_known_owner}</span>
            </div>
            <div className="text-sm text-gray-400">
              Status: <span className="text-red-400 font-medium">{vehicle.status}</span>
            </div>
            <div className="text-sm text-gray-400">
              Previous Violations: <span className="text-white">{vehicle.police_records.previous_violations}</span>
            </div>
            <div className="text-sm text-gray-400">
              Pending Cases: <span className="text-white">{vehicle.police_records.pending_cases}</span>
            </div>
          </div>

          {/* Violation Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {vehicle.violations.map((violation, index) => (
              <span key={index} className="px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400">
                {violation}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sightings and Timeline Section */}
      <div className="space-y-4">
        {/* Recent Sightings - Single Row */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Sightings</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { 
                location: vehicle.location, 
                date: "Now", 
                duration: "Live",
                camera_id: `CAM_${vehicle.location.substring(0,2).toUpperCase()}_LIVE`,
                activity: "Current Surveillance",
                speed: "0 km/h",
                direction: "Stationary",
                videoSrc: videoSources[0] // Live feed uses first video
              },
              ...vehicle.history.slice(0, 2).map((sighting, idx) => ({
                ...sighting,
                videoSrc: videoSources[idx + 1] // Use subsequent videos for history
              }))
            ].map((sighting, index) => (
              <div 
                key={index}
                onClick={() => setSelectedSighting(sighting)}
                className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all
                  ${selectedSighting === sighting 
                    ? 'ring-2 ring-blue-500 scale-[1.02]' 
                    : 'hover:ring-2 hover:ring-white/20'}`}
              >
                <video 
                  src={sighting.videoSrc}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                
                {/* Enhanced Thumbnail Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-1 left-1 right-1 z-20">
                  <p className="text-[8px] text-white/90 font-medium truncate">
                    {sighting.camera_id} • {sighting.speed}
                  </p>
                  <p className="text-[7px] text-gray-400 truncate">
                    {sighting.date} • {sighting.direction}
                  </p>
                </div>
                {sighting.date === "Now" && (
                  <div className="absolute top-1 right-1 z-30">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0a0a0a] px-4 text-sm text-white/40">
              Footage Timeline
            </span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>-20 min from detection</span>
            <span className="font-medium text-white">
              {timeOffset === 0 
                ? 'Detection Time' 
                : `${timeOffset > 0 ? '+' : ''}${timeOffset} min`}
            </span>
            <span>+20 min after</span>
          </div>
          
          {/* Slider and Controls */}
          <div className="flex items-center gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTimeOffset(prev => Math.max(prev - 1, -20))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FaStepBackward className="text-sm" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
              </button>
              <button 
                onClick={() => setTimeOffset(prev => Math.min(prev + 1, 20))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FaStepForward className="text-sm" />
              </button>
            </div>

            {/* Timeline Slider */}
            <div className="flex-1 relative">
              <input
                type="range"
                min="-20"
                max="20"
                value={timeOffset}
                onChange={(e) => setTimeOffset(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-blue-500
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
              
              {/* Time Markers */}
              <div className="absolute -top-1 left-0 right-0 flex justify-between pointer-events-none">
                {[-15, -10, -5, 0, 5, 10, 15].map((time) => (
                  <div 
                    key={time}
                    className={`w-0.5 h-2 ${time === 0 ? 'bg-blue-500' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Timestamp Indicators */}
          <div className="flex justify-between text-[10px] text-gray-500">
            {[-15, -10, -5, 0, 5, 10, 15].map((time) => (
              <span key={time} className={time === 0 ? 'text-blue-400' : ''}>
                {time === 0 ? 'Detection' : `${time > 0 ? '+' : ''}${time}m`}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new component for custom map markers
const TimelineMarker = ({ location, isActive, timestamp, isLast }) => (
  <div className="relative">
    {/* Marker */}
    <div className={`
      absolute -translate-x-1/2 -translate-y-full
      flex flex-col items-center gap-1
    `}>
      {/* Location Card */}
      <div className={`
        px-3 py-2 rounded-lg shadow-lg
        ${isActive 
          ? 'bg-blue-500 text-white' 
          : 'bg-white/90 text-gray-900'}
        transition-all duration-300
        min-w-[120px]
      `}>
        <div className="text-xs font-medium">{location}</div>
        <div className="text-[10px] opacity-75">{timestamp}</div>
      </div>
      
      {/* Marker Pin */}
      <div className="flex flex-col items-center">
        <div className={`
          w-4 h-4 rounded-full 
          ${isActive ? 'bg-blue-500' : 'bg-white'}
          border-2 border-white shadow-lg
        `} />
        {!isLast && (
          <div className="w-0.5 h-8 bg-white/20" />
        )}
      </div>
    </div>
  </div>
);

// Add this function to sort locations chronologically
const getChronologicalLocations = (person) => {
  const allSightings = [
    ...person.history.map(h => ({
      location: h.location,
      timestamp: h.date,
      duration: h.duration,
      isHistory: true
    })),
    {
      location: person.location,
      timestamp: 'Now',
      duration: 'Live',
      isHistory: false
    }
  ].sort((a, b) => {
    if (b.timestamp === 'Now') return -1;
    if (a.timestamp === 'Now') return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  return allSightings;
};

// Update the main component name and its contents
const VehicleTracking = () => {
  const [analysisState, setAnalysisState] = useState('idle');
  const [showResults, setShowResults] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(detectedVehicles[0]);
  const [selectedSighting, setSelectedSighting] = useState(detectedVehicles[0].history[0]);
  const [activeTab, setActiveTab] = useState('camera');
  const [timeOffset, setTimeOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getThreatLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  // Update selectedSighting when selectedVehicle changes
  useEffect(() => {
    setSelectedSighting(selectedVehicle.history[0]);
  }, [selectedVehicle]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04"
  });

  const mapRef = useRef(null);

  const runAnalysis = async () => {
    setAnalysisState('analyzing');
    setShowResults(false);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysisState('complete');
    setShowResults(true);
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  // Function to get all unique locations for a person
  const getPersonLocations = (person) => {
    const locations = new Set();
    locations.add(person.location); // Current location
    person.history.forEach(sighting => locations.add(sighting.location));
    return Array.from(locations);
  };

  return (
    <div className="w-full h-full mt-16 flex flex-col gap-8">
      {/* Vehicles Grid at Top */}
      <div className="grid grid-cols-6 gap-4">
        {detectedVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => setSelectedVehicle(vehicle)}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedVehicle.id === vehicle.id 
                ? 'ring-2 ring-blue-500 scale-[1.02]' 
                : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/20'}`}
          >
            {/* Vehicle Image Container */}
            <div className="aspect-square relative">
              <img 
                src={vehicle.photo} 
                alt={vehicle.plateNumber}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              {/* Vehicle Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-white">
                    {vehicle.plateNumber}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-[10px] text-gray-300">
                    Last seen: {vehicle.lastSeen}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0a0a0a] px-4 text-sm text-white/40">
            Vehicle Details
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6 relative z-10">
        {/* Left Side - Profile and Timeline */}
        <div className="w-2/5">
          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <VehicleDetails vehicle={selectedVehicle} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ShimmerCard type="profile" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side - Tabbed View */}
        <div className="w-3/5">
          {/* Tab Headers */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${activeTab === 'camera' 
                  ? 'bg-white/10 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <FaVideo className="text-lg" />
              <span>Live Feed</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${activeTab === 'map' 
                  ? 'bg-white/10 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <FaMapMarkedAlt className="text-lg" />
              <span>Location History</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="h-[400px] rounded-xl overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'camera' ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  {/* ANPR Camera Feed */}
                  <div className="relative h-full">
                    <video 
                      src={selectedSighting?.videoSrc || videoSources[0]}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    
                    {/* Enhanced Overlay Elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 z-30 space-y-2">
                      <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
                        <span>{selectedSighting?.camera_id} • {selectedSighting?.location}</span>
                      </div>
                      <div className="font-mono text-xs text-white/90 bg-blue-500/30 px-2 py-1 rounded">
                        Speed: {selectedSighting?.speed} • Direction: {selectedSighting?.direction}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 z-30">
                      <div className="flex items-center gap-2 bg-black/30 px-2 py-1 rounded">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-mono text-xs text-white/90">LIVE</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-between">
                      <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
                        {selectedSighting?.date}
                      </div>
                      <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
                        Duration: {selectedSighting?.duration}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  {/* Map View */}
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerClassName="w-full h-full"
                      center={ghatLocations[selectedVehicle.location]}
                      zoom={15}
                      options={mapOptions}
                      onLoad={map => {
                        mapRef.current = map;
                        const bounds = new window.google.maps.LatLngBounds();
                        getChronologicalLocations(selectedVehicle).forEach(sighting => {
                          bounds.extend(ghatLocations[sighting.location]);
                        });
                        map.fitBounds(bounds, 50);
                      }}
                    >
                      {/* Path Line */}
                      <Polyline
                        path={getChronologicalLocations(selectedVehicle).map(
                          sighting => ghatLocations[sighting.location]
                        )}
                        options={{
                          strokeColor: '#ffffff',
                          strokeOpacity: 0.2,
                          strokeWeight: 2
                        }}
                      />

                      {/* Timeline Markers */}
                      {getChronologicalLocations(selectedVehicle).map((sighting, index, array) => (
                        <OverlayView
                          key={index}
                          position={ghatLocations[sighting.location]}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <TimelineMarker
                            location={sighting.location}
                            isActive={!sighting.isHistory}
                            timestamp={sighting.timestamp}
                            isLast={index === array.length - 1}
                          />
                        </OverlayView>
                      ))}
                    </GoogleMap>
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <FaSpinner className="animate-spin text-2xl text-gray-500" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleTracking; 