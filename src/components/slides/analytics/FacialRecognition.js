import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  FaUsers, FaSpinner, FaCrosshairs, FaUserCircle,
  FaIdCard, FaHistory, FaClock, FaMapMarkerAlt, FaExclamationTriangle, FaVideo, FaMapMarkedAlt, FaPlay, FaPause, FaStepForward, FaStepBackward
} from 'react-icons/fa';
import ShimmerCard from './ShimmerCard';
import { GoogleMap, useLoadScript, Marker, Polyline, OverlayView } from '@react-google-maps/api';

const sampleImages = [
  { id: 1, src: '/puri.jpeg', label: 'Camera Feed 1' },
  { id: 2, src: '/puri2.jpeg', label: 'Camera Feed 2' },
  { id: 3, src: '/puri1.jpeg', label: 'Camera Feed 3' },
];

// Sample detected faces data
const detectedFaces = [
  {
    id: 1,
    name: "Rajesh Kumar",
    aliases: ["Raju", "Raja"],
    age: 32,
    photo: "/faces/face1.jpeg",
    lastSeen: "2 minutes ago",
    location: "Singhadwara (East Gate)",
    category: "HIGH_RISK",
    status: "Most Wanted",
    threat_level: "High",
    wanted_for: ["Armed Robbery", "Assault"],
    police_records: {
      fir_numbers: ["FIR-2023-1234", "FIR-2023-5678"],
      previous_arrests: 3,
      pending_cases: 2,
      jurisdiction: "Puri Police"
    },
    physical_attributes: {
      height: "5'10\"",
      build: "Medium",
      identifiable_marks: "Scar on left cheek",
      last_known_disguise: "Clean shaven, religious attire"
    },
    history: [
      { 
        date: "2024-03-15", 
        location: "Singhadwara (East Gate)", 
        duration: "45 mins",
        activity: "Suspicious movement near temple entrance",
        camera_id: "CAM_SG_01"
      },
      { 
        date: "2024-03-10", 
        location: "Inner Sanctum Area", 
        duration: "30 mins",
        activity: "Meeting with known associates",
        camera_id: "CAM_IS_03"
      }
    ],
    alerts: [
      "Known to carry weapons",
      "Multiple escape attempts",
      "Active gang affiliations"
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    aliases: ["Pooja", "Pinky"],
    age: 28,
    photo: "/faces/face2.jpeg",
    lastSeen: "5 minutes ago",
    location: "Uttaradwara (North Gate)",
    category: "MEDIUM_RISK",
    status: "Person of Interest",
    threat_level: "Medium",
    wanted_for: ["Fraud", "Identity Theft"],
    police_records: {
      fir_numbers: ["FIR-2023-8765"],
      previous_arrests: 1,
      pending_cases: 2,
      jurisdiction: "Puri Police"
    },
    physical_attributes: {
      height: "5'4\"",
      build: "Slim",
      identifiable_marks: "Tattoo on right wrist",
      last_known_disguise: "Colored contact lenses, wig"
    },
    history: [
      { 
        date: "2024-03-14", 
        location: "Uttaradwara (North Gate)", 
        duration: "1 hour",
        activity: "Suspicious financial transaction",
        camera_id: "CAM_NG_01"
      }
    ],
    alerts: [
      "Known to use multiple identities",
      "History of financial fraud"
    ]
  },
  {
    id: 3,
    name: "Amit Patel",
    aliases: ["AP", "Master"],
    age: 35,
    photo: "/faces/face3.jpeg",
    lastSeen: "10 minutes ago",
    location: "Dakshinadwara (South Gate)",
    category: "HIGH_RISK",
    status: "Wanted",
    threat_level: "High",
    wanted_for: ["Drug Trafficking", "Organized Crime"],
    police_records: {
      fir_numbers: ["FIR-2023-9012", "FIR-2023-9013"],
      previous_arrests: 2,
      pending_cases: 3,
      jurisdiction: "Puri Police"
    },
    physical_attributes: {
      height: "5'8\"",
      build: "Heavy",
      identifiable_marks: "Burn mark on neck",
      last_known_disguise: "Fake beard, traditional dress"
    },
    history: [
      { 
        date: "2024-03-15", 
        location: "Dakshinadwara (South Gate)", 
        duration: "1.5 hours",
        activity: "Suspected drug deal",
        camera_id: "CAM_SG_02"
      },
      { 
        date: "2024-03-12", 
        location: "Prasad Distribution Area", 
        duration: "45 mins",
        activity: "Meeting with suspects",
        camera_id: "CAM_PD_04"
      }
    ],
    alerts: [
      "Part of organized crime syndicate",
      "May be armed",
      "Known to resist arrest"
    ]
  },
  {
    id: 4,
    name: "Sneha Verma",
    aliases: ["Doctor", "SV"],
    age: 29,
    photo: "/faces/face1.jpeg",
    lastSeen: "15 minutes ago",
    location: "Paschimadwara (West Gate)",
    category: "MEDIUM_RISK",
    status: "Under Surveillance",
    threat_level: "Medium",
    wanted_for: ["Medical Fraud", "Document Forgery"],
    police_records: {
      fir_numbers: ["FIR-2023-3456"],
      previous_arrests: 0,
      pending_cases: 1,
      jurisdiction: "Puri Police"
    },
    physical_attributes: {
      height: "5'6\"",
      build: "Average",
      identifiable_marks: "Mole above right eyebrow",
      last_known_disguise: "Medical scrubs, fake ID"
    },
    history: [
      { 
        date: "2024-03-15", 
        location: "Paschimadwara (West Gate)", 
        duration: "30 mins",
        activity: "Document exchange",
        camera_id: "CAM_WG_01"
      }
    ],
    alerts: [
      "Known for document forgery",
      "Uses fake medical credentials"
    ]
  },
  {
    id: 5,
    name: "Rahul Gupta",
    aliases: ["Professor", "RG"],
    age: 42,
    photo: "/faces/face2.jpeg",
    lastSeen: "20 minutes ago",
    location: "Inner Sanctum Area",
    category: "LOW_RISK",
    status: "Watch List",
    threat_level: "Low",
    wanted_for: ["Cybercrime", "Data Theft"],
    police_records: {
      fir_numbers: ["FIR-2023-7890"],
      previous_arrests: 0,
      pending_cases: 1,
      jurisdiction: "Puri Police"
    },
    physical_attributes: {
      height: "5'9\"",
      build: "Slim",
      identifiable_marks: "Wears thick glasses",
      last_known_disguise: "Business attire"
    },
    history: [
      { 
        date: "2024-03-15", 
        location: "Inner Sanctum Area", 
        duration: "1 hour",
        activity: "Using suspicious devices",
        camera_id: "CAM_IS_02"
      }
    ],
    alerts: [
      "Known for cyber attacks",
      "May carry electronic devices"
    ]
  },
  {
    id: 6,
    name: "Anita Desai",
    aliases: ["Manager", "AD"],
    age: 31,
    photo: "/faces/face3.jpeg",
    lastSeen: "25 minutes ago",
    location: "Prasad Distribution Area",
    category: "MEDIUM_RISK",
    status: "Person of Interest",
    threat_level: "Medium",
    wanted_for: ["Financial Crime", "Money Laundering"],
    police_records: {
      fir_numbers: ["FIR-2023-2345"],
      previous_arrests: 1,
      pending_cases: 2,
      jurisdiction: "Puri Police"
    },
    physical_attributes: {
      height: "5'5\"",
      build: "Average",
      identifiable_marks: "Distinctive walk",
      last_known_disguise: "Business formal"
    },
    history: [
      { 
        date: "2024-03-15", 
        location: "Prasad Distribution Area", 
        duration: "40 mins",
        activity: "Suspicious bank transactions",
        camera_id: "CAM_PD_02"
      }
    ],
    alerts: [
      "Connected to financial fraud ring",
      "Uses multiple bank accounts"
    ]
  }
];

// Add Puri temple gate coordinates
const ghatLocations = {
  "Singhadwara (East Gate)": { lat: 19.8133, lng: 85.8321 },
  "Uttaradwara (North Gate)": { lat: 19.8140, lng: 85.8315 },
  "Dakshinadwara (South Gate)": { lat: 19.8125, lng: 85.8315 },
  "Paschimadwara (West Gate)": { lat: 19.8133, lng: 85.8308 },
  "Inner Sanctum Area": { lat: 19.8133, lng: 85.8316 },
  "Prasad Distribution Area": { lat: 19.8136, lng: 85.8318 }
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

const PersonDetails = ({ person }) => {
  const [selectedSighting, setSelectedSighting] = useState(person.history[0]);

  const getThreatLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Profile Header with Police Records */}
      <div className="flex gap-4">
        <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white/10">
          <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{person.name}</h2>
              {person.aliases.length > 0 && (
                <p className="text-sm text-gray-400">
                  Aliases: {person.aliases.join(", ")}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getThreatLevelColor(person.threat_level)}`}>
              {person.threat_level} Threat
            </span>
          </div>
          
          {/* Combined Info Grid */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-sm text-gray-400">
              Age: <span className="text-white">{person.age}</span>
            </div>
            <div className="text-sm text-gray-400">
              Height: <span className="text-white">{person.physical_attributes.height}</span>
            </div>
            <div className="text-sm text-gray-400">
              Build: <span className="text-white">{person.physical_attributes.build}</span>
            </div>
            <div className="text-sm text-gray-400">
              Status: <span className="text-red-400 font-medium">{person.status}</span>
            </div>
            <div className="text-sm text-gray-400">
              Previous Arrests: <span className="text-white">{person.police_records.previous_arrests}</span>
            </div>
            <div className="text-sm text-gray-400">
              Pending Cases: <span className="text-white">{person.police_records.pending_cases}</span>
            </div>
            <div className="text-sm text-gray-400 col-span-2">
              FIR: <span className="text-white">{person.police_records.fir_numbers.join(", ")}</span>
            </div>
          </div>

          {/* Wanted For Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {person.wanted_for.map((crime, index) => (
              <span key={index} className="px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400">
                {crime}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main CCTV View */}
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img 
          src="/sim1.jpeg"
          alt="CCTV Feed"
          className="w-full h-full object-cover"
        />
        
        {/* Enhanced Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 z-30 space-y-2">
          <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
            <span>{selectedSighting.camera_id} • {selectedSighting.location}</span>
          </div>
          <div className="font-mono text-xs text-white/90 bg-red-500/30 px-2 py-1 rounded">
            Activity: {selectedSighting.activity}
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
            {selectedSighting.date}
          </div>
          <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
            Duration: {selectedSighting.duration}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-5 gap-2">
        {[...person.history, { 
          location: person.location, 
          date: "Now", 
          duration: "Live",
          camera_id: `CAM_${person.location.substring(0,2).toUpperCase()}_LIVE`,
          activity: "Current Surveillance"
        }].map((sighting, index) => (
          <div 
            key={index}
            onClick={() => setSelectedSighting(sighting)}
            className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedSighting === sighting 
                ? 'ring-2 ring-red-500 scale-[1.02]' 
                : 'hover:ring-2 hover:ring-white/20'}`}
          >
            <img 
              src="/sim1.jpeg"
              alt={sighting.location}
              className="w-full h-full object-cover"
            />
            
            {/* Enhanced Thumbnail Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-1 left-1 right-1 z-20">
              <p className="text-[8px] text-white/90 font-medium truncate">
                {sighting.camera_id}
              </p>
              <p className="text-[7px] text-gray-400 truncate">
                {sighting.date}
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

// Update the map section in the main component
const FacialRecognition = () => {
  const [analysisState, setAnalysisState] = useState('idle');
  const [showResults, setShowResults] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(detectedFaces[0]);
  const [selectedSighting, setSelectedSighting] = useState(detectedFaces[0].history[0]);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'map'
  const [timeOffset, setTimeOffset] = useState(0); // -20 to +20 minutes
  const [isPlaying, setIsPlaying] = useState(false);

  const getThreatLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  // Update selectedSighting when selectedPerson changes
  useEffect(() => {
    setSelectedSighting(selectedPerson.history[0]);
  }, [selectedPerson]);

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
      {/* Faces Grid at Top */}
      <div className="grid grid-cols-6 gap-4">
        {detectedFaces.map((person) => (
          <div
            key={person.id}
            onClick={() => setSelectedPerson(person)}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedPerson.id === person.id 
                ? 'ring-2 ring-blue-500 scale-[1.02]' 
                : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/20'}`}
          >
            {/* Image Container */}
            <div className="aspect-square relative">
              <img 
                src={person.photo} 
                alt={person.name}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Threat Level Indicator */}
              <div className="absolute top-2 right-2">
                <div className={`w-2 h-2 rounded-full ${
                  person.threat_level.toLowerCase() === 'high' 
                    ? 'bg-red-500' 
                    : person.threat_level.toLowerCase() === 'medium'
                      ? 'bg-orange-500'
                      : 'bg-yellow-500'
                } animate-pulse`} />
              </div>

              {/* Info Overlay - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="flex justify-between items-end gap-2">
                  {/* Left side info */}
                  <div className="space-y-0.5 flex-1">
                    <p className="text-xs font-medium text-white truncate">
                      {person.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Last seen: {person.lastSeen}
                    </p>
                    <p className="text-[10px] text-gray-300 truncate">
                      Location: {person.location}
                    </p>
                  </div>

                  {/* Right side crime tags */}
                  <div className="flex flex-col gap-1 items-end">
                    {person.wanted_for.slice(0, 2).map((crime, index) => (
                      <span 
                        key={index} 
                        className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-red-500/80 text-white whitespace-nowrap"
                      >
                        {crime}
                      </span>
                    ))}
                  </div>
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
            Suspect Details
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6 relative z-10">
        {/* Left Side - Profile and Info */}
        <div className="w-2/5">
          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Remove High Risk Banner and start directly with Profile Info */}
                <div className="flex gap-4">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white/10">
                    <img src={selectedPerson.photo} alt={selectedPerson.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedPerson.name}</h2>
                        {selectedPerson.aliases.length > 0 && (
                          <p className="text-sm text-gray-400">
                            Aliases: {selectedPerson.aliases.join(", ")}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getThreatLevelColor(selectedPerson.threat_level)}`}>
                        {selectedPerson.threat_level} Threat
                      </span>
                    </div>
                    
                    {/* Combined Info Grid */}
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="text-sm text-gray-400">
                        Age: <span className="text-white">{selectedPerson.age}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Height: <span className="text-white">{selectedPerson.physical_attributes.height}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Build: <span className="text-white">{selectedPerson.physical_attributes.build}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Status: <span className="text-red-400 font-medium">{selectedPerson.status}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Previous Arrests: <span className="text-white">{selectedPerson.police_records.previous_arrests}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Pending Cases: <span className="text-white">{selectedPerson.police_records.pending_cases}</span>
                      </div>
                      <div className="text-sm text-gray-400 col-span-2">
                        FIR: <span className="text-white">{selectedPerson.police_records.fir_numbers.join(", ")}</span>
                      </div>
                    </div>

                    {/* Wanted For Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedPerson.wanted_for.map((crime, index) => (
                        <span key={index} className="px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400">
                          {crime}
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
                          location: selectedPerson.location, 
                          date: "Now", 
                          duration: "Live",
                          camera_id: `CAM_${selectedPerson.location.substring(0,2).toUpperCase()}_LIVE`,
                          activity: "Current Surveillance"
                        },
                        ...selectedPerson.history.slice(0, 2)
                      ].map((sighting, index) => (
                        <div 
                          key={index}
                          onClick={() => setSelectedSighting(sighting)}
                          className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all
                            ${selectedSighting === sighting 
                              ? 'ring-2 ring-red-500 scale-[1.02]' 
                              : 'hover:ring-2 hover:ring-white/20'}`}
                        >
                          <img 
                            src="/puri1.jpeg"
                            alt={sighting.location}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Thumbnail Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-1 left-1 right-1 z-20">
                            <p className="text-[8px] text-white/90 font-medium truncate">
                              {sighting.camera_id}
                            </p>
                            <p className="text-[7px] text-gray-400 truncate">
                              {sighting.date}
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

                  {/* Timeline Scrubber - Updated labels */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>-20 min from sighting</span>
                      <span className="font-medium text-white">
                        {timeOffset === 0 
                          ? 'Sighting Time' 
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

                    {/* Timestamp Indicators - Updated labels */}
                    <div className="flex justify-between text-[10px] text-gray-500">
                      {[-15, -10, -5, 0, 5, 10, 15].map((time) => (
                        <span key={time} className={time === 0 ? 'text-blue-400' : ''}>
                          {time === 0 ? 'Sighting' : `${time > 0 ? '+' : ''}${time}m`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
                  {/* CCTV Feed */}
                  <div className="relative h-full">
                    <img 
                      src="/puri1.png"
                      alt="CCTV Feed"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay Elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 z-30 space-y-2">
                      <div className="font-mono text-sm text-white/90 bg-black/30 px-2 py-1 rounded">
                        <span>{selectedSighting?.camera_id} • {selectedSighting?.location}</span>
                      </div>
                      <div className="font-mono text-xs text-white/90 bg-red-500/30 px-2 py-1 rounded">
                        Activity: {selectedSighting?.activity}
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
                  {/* Map */}
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerClassName="w-full h-full"
                      center={ghatLocations[selectedPerson.location]}
                      zoom={15}
                      options={mapOptions}
                      onLoad={map => {
                        mapRef.current = map;
                        const bounds = new window.google.maps.LatLngBounds();
                        getChronologicalLocations(selectedPerson).forEach(sighting => {
                          bounds.extend(ghatLocations[sighting.location]);
                        });
                        map.fitBounds(bounds, 50);
                      }}
                    >
                      {/* Path Line */}
                      <Polyline
                        path={getChronologicalLocations(selectedPerson).map(
                          sighting => ghatLocations[sighting.location]
                        )}
                        options={{
                          strokeColor: '#ffffff',
                          strokeOpacity: 0.2,
                          strokeWeight: 2
                        }}
                      />

                      {/* Timeline Markers */}
                      {getChronologicalLocations(selectedPerson).map((sighting, index, array) => (
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

export default FacialRecognition; 