import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FaCarSide, FaSpinner, FaCar, FaIdCard, 
  FaCalendarAlt, FaMapMarkerAlt, FaSearch,
  FaExclamationTriangle, FaHistory, FaVideo, FaRoad, FaChartBar
} from 'react-icons/fa';

// Sample detected vehicles data
const detectedVehicles = [
  {
    id: 1,
    numberPlate: "OD 02 AB 4456",
    timestamp: "2 minutes ago",
    location: "Jagannath Temple Entry",
    vehicleDetails: {
      make: "Maruti Suzuki",
      model: "Swift",
      color: "White",
      type: "Hatchback",
      year: "2022",
      lastSeen: "Temple Entry Camera",
      confidence: 98.5,
    },
    history: [
      {
        location: "Jagannath Temple Entry",
        timestamp: "10:45 AM",
        camera: "CAM_01",
        image: "/anpr/"
      },
      {
        location: "Grand Road",
        timestamp: "10:30 AM",
        camera: "CAM_03",
        image: "/anpr/capture2.jpg"
      }
    ]
  },
  {
    id: 2,
    numberPlate: "OD 13 HG 7890",
    timestamp: "5 minutes ago",
    location: "Swargadwar Beach",
    vehicleDetails: {
      make: "Hyundai",
      model: "Creta",
      color: "Black",
      type: "SUV",
      year: "2023",
      lastSeen: "Beach Road Camera",
      confidence: 97.8,
    },
    history: [
      {
        location: "Swargadwar Beach",
        timestamp: "10:40 AM",
        camera: "CAM_02",
        image: "/anpr/capture3.jpg"
      }
    ]
  },
  {
    id: 3,
    numberPlate: "OD 04 KL 1234",
    timestamp: "8 minutes ago",
    location: "Bada Danda",
    vehicleDetails: {
      make: "Tata",
      model: "Nexon",
      color: "Blue",
      type: "SUV",
      year: "2023",
      lastSeen: "Grand Road Camera",
      confidence: 96.5,
    },
    history: [
      {
        location: "Bada Danda",
        timestamp: "10:35 AM",
        camera: "CAM_04",
        image: "/anpr/capture4.jpg"
      }
    ]
  },
  {
    id: 4,
    numberPlate: "OD 21 MN 5678",
    timestamp: "10 minutes ago",
    location: "Puri Bus Stand",
    vehicleDetails: {
      make: "Honda",
      model: "City",
      color: "Silver",
      type: "Sedan",
      year: "2021",
      lastSeen: "Bus Stand Camera",
      confidence: 98.2,
    },
    history: [
      {
        location: "Puri Bus Stand",
        timestamp: "10:30 AM",
        camera: "CAM_05",
        image: "/anpr/capture5.jpg"
      }
    ]
  },
  {
    id: 5,
    numberPlate: "OD 02 PQ 9012",
    timestamp: "12 minutes ago",
    location: "Chakratirtha Road",
    vehicleDetails: {
      make: "Toyota",
      model: "Fortuner",
      color: "White",
      type: "SUV",
      year: "2022",
      lastSeen: "Beach Road Camera",
      confidence: 97.1,
    },
    history: [
      {
        location: "Chakratirtha Road",
        timestamp: "10:25 AM",
        camera: "CAM_06",
        image: "/anpr/capture6.jpg"
      }
    ]
  },
  {
    id: 6,
    numberPlate: "OD 33 RS 3456",
    timestamp: "15 minutes ago",
    location: "Konark Highway",
    vehicleDetails: {
      make: "Mahindra",
      model: "XUV700",
      color: "Red",
      type: "SUV",
      year: "2023",
      lastSeen: "Highway Camera",
      confidence: 95.9,
    },
    history: [
      {
        location: "Konark Highway",
        timestamp: "10:20 AM",
        camera: "CAM_07",
        image: "/anpr/capture7.jpg"
      }
    ]
  }
];

// Update the sampleCameraFeeds array to include video sources
const sampleCameraFeeds = [
  { 
    id: 1, 
    name: 'Temple Entry Gate',
    videoSrc: '/carvideos/anpr1.mp4',
    location: 'Singhadwara',
    status: 'active',
    deviceId: 'CAM_SG_01',
    coordinates: {
      lat: '19.8132° N',
      long: '85.8315° E',
      elevation: '12'
    },
    lane: {
      number: '01',
      direction: 'Inbound',
      type: 'Entry Gate'
    }
  },
  { 
    id: 2, 
    name: 'Grand Road Junction',
    videoSrc: '/carvideos/anpr2.mov',
    location: 'Bada Danda',
    status: 'active',
    deviceId: 'CAM_BD_02',
    coordinates: {
      lat: '19.8145° N',
      long: '85.8329° E',
      elevation: '10'
    },
    lane: {
      number: '02',
      direction: 'Outbound',
      type: 'Main Road'
    }
  },
  { 
    id: 3, 
    name: 'Digabareni Chouk',
    videoSrc: '/carvideos/anpr3.mov',
    location: 'Swargadwar',
    status: 'active',
    deviceId: 'CAM_SW_01',
    coordinates: {
      lat: '19.8012° N',
      long: '85.8512° E',
      elevation: '5'
    },
    lane: {
      number: '01',
      direction: 'Inbound',
      type: 'Tourist Entry'
    }
  },
  { 
    id: 4, 
    name: 'Konark Highway',
    videoSrc: '/carvideos/anpr5.mov',
    location: 'Puri-Konark Marine Drive',
    status: 'active',
    deviceId: 'CAM_KH_01',
    coordinates: {
      lat: '19.8234° N',
      long: '85.8654° E',
      elevation: '8'
    },
    lane: {
      number: '01',
      direction: 'Two-Way',
      type: 'Highway'
    }
  }
];

const ANPR = () => {
  const [selectedCamera, setSelectedCamera] = useState(sampleCameraFeeds[0]);
  const [selectedVehicle, setSelectedVehicle] = useState(detectedVehicles[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRCDetails, setShowRCDetails] = useState(false);
  const [isVahanLoading, setIsVahanLoading] = useState(false);
  const [hasVahanData, setHasVahanData] = useState(false);

  const fetchVahanData = () => {
    setIsVahanLoading(true);
    setTimeout(() => {
      setIsVahanLoading(false);
      setHasVahanData(true);
    }, 2000);
  };

  return (
    <div className="w-full h-full mt-16">
      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left Section - 2/3 width */}
        <div className="w-2/3 space-y-6">
          {/* Top Section - Camera Feeds */}
          <div className="grid grid-cols-4 gap-4">
            {sampleCameraFeeds.map((camera) => (
              <div
                key={camera.id}
                onClick={() => setSelectedCamera(camera)}
                className={`group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/[0.05]
                  ${selectedCamera.id === camera.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <video 
                  src={camera.videoSrc}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Status Indicator */}
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/90">LIVE</span>
                  </div>
                </div>

                {/* Camera Info */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium truncate">{camera.name}</p>
                      <p className="text-xs text-white/60 truncate">{camera.location}</p>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                Live Detection
              </span>
            </div>
          </div>

          {/* Main Feed and Detection Grid */}
          <div className="space-y-6">
            {/* Main Feed and Detections Layout */}
            <div className="flex gap-4">
              {/* Main Feed - Left Side */}
              <div className="w-2/3">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.05]">
                  <video 
                    src={selectedCamera.videoSrc}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  
                  {/* Camera Info */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                        <FaCarSide className="text-blue-400" />
                        <span className="text-sm text-white/90 font-medium">
                          {selectedCamera.name}
                        </span>
                      </div>
                      <div className="bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                        <span className="text-xs text-white/75">
                          {selectedCamera.location}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-white/90">LIVE</span>
                    </div>
                  </div>

                  {/* ANPR Detection Boxes */}
                  {detectedVehicles.map((vehicle, index) => (
                    <div 
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="absolute cursor-pointer transition-transform hover:scale-105"
                      style={{
                        left: `${20 + (index * 5)}%`,
                        top: `${30 + (index * 10)}%`,
                        width: '200px',
                        height: '100px'
                      }}
                    >
                      <div className="border-2 border-blue-500/50 rounded-lg w-full h-full" />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500/90 px-3 py-1 rounded-lg text-sm text-white font-mono whitespace-nowrap">
                        {vehicle.numberPlate}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technical Details Cards */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {/* Camera Details */}
                  <div className="bg-white/[0.02] backdrop-blur-md rounded-lg p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <FaVideo className="text-blue-400 text-sm" />
                      <h4 className="text-xs font-medium text-white">Camera Info</h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Device ID</span>
                        <span className="text-[10px] text-white font-mono">{selectedCamera.deviceId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Resolution</span>
                        <span className="text-[10px] text-white">1920x1080</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">FPS</span>
                        <span className="text-[10px] text-white">30</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="bg-white/[0.02] backdrop-blur-md rounded-lg p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-blue-400 text-sm" />
                      <h4 className="text-xs font-medium text-white">Location</h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Area</span>
                        <span className="text-[10px] text-white">{selectedCamera.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Latitude</span>
                        <span className="text-[10px] text-white font-mono">{selectedCamera.coordinates.lat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Longitude</span>
                        <span className="text-[10px] text-white font-mono">{selectedCamera.coordinates.long}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lane Information */}
                  <div className="bg-white/[0.02] backdrop-blur-md rounded-lg p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <FaRoad className="text-blue-400 text-sm" />
                      <h4 className="text-xs font-medium text-white">Lane Info</h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Lane Number</span>
                        <span className="text-[10px] text-white">#{selectedCamera.lane.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Direction</span>
                        <span className="text-[10px] text-white">{selectedCamera.lane.direction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Road Type</span>
                        <span className="text-[10px] text-white">{selectedCamera.lane.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detection Stats */}
                  <div className="bg-white/[0.02] backdrop-blur-md rounded-lg p-3 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <FaChartBar className="text-blue-400 text-sm" />
                      <h4 className="text-xs font-medium text-white">Detection Stats</h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Today's Count</span>
                        <span className="text-[10px] text-white">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Avg. Detection Time</span>
                        <span className="text-[10px] text-white">0.4s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">Accuracy Rate</span>
                        <span className="text-[10px] text-white">98.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Vehicles Cards - Right Side */}
              <div className="w-1/3 space-y-3 max-h-[400px] overflow-y-auto">
                {detectedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`bg-white/[0.02] backdrop-blur-md rounded-xl p-3 border border-white/[0.05] cursor-pointer
                      hover:bg-white/[0.04] transition-colors
                      ${selectedVehicle.id === vehicle.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src="/sim1.jpeg" alt="Vehicle" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-lg text-xs font-mono mb-1 truncate">
                          {vehicle.numberPlate}
                        </div>
                        <p className="text-sm text-white/75 truncate">
                          {vehicle.vehicleDetails.make} {vehicle.vehicleDetails.model}
                        </p>
                        <p className="text-xs text-white/40">
                          {vehicle.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - 1/3 width, starts from top */}
        <div className="w-1/3 space-y-4">
          {/* Number Plate Display */}
          <div className="bg-yellow-500/90 rounded-lg p-4 text-center font-bold tracking-wider">
            <div className="text-xs text-yellow-900 mb-1">INDIA</div>
            <div className="text-2xl text-yellow-950">{selectedVehicle.numberPlate}</div>
          </div>

          {/* Basic Vehicle Details */}
          <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05]">
            <h3 className="text-sm font-medium text-white mb-3">Vehicle Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Make & Model</span>
                <span className="text-sm text-white">{selectedVehicle.vehicleDetails.make} {selectedVehicle.vehicleDetails.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Color</span>
                <span className="text-sm text-white">{selectedVehicle.vehicleDetails.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Type</span>
                <span className="text-sm text-white">{selectedVehicle.vehicleDetails.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Detection Time</span>
                <span className="text-sm text-white">{selectedVehicle.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Location</span>
                <span className="text-sm text-white">{selectedVehicle.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Confidence</span>
                <span className="text-sm text-white">{selectedVehicle.vehicleDetails.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Vahan Database Section */}
          <div className="space-y-4">
            {!hasVahanData ? (
              // Placeholder with Fetch Button
              <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-6 border border-white/[0.05]">
                <div className="text-center space-y-4">
                  <FaIdCard className="text-4xl text-gray-500 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white">Vahan Database Lookup</h3>
                    <p className="text-xs text-gray-400">
                      Get detailed vehicle information from the Vahan database
                    </p>
                  </div>
                  {isVahanLoading ? (
                    // Shimmer Effect
                    <div className="space-y-4">
                      <div className="h-4 bg-white/5 rounded-full animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-3/4 mx-auto animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-1/2 mx-auto animate-pulse" />
                    </div>
                  ) : (
                    <button
                      onClick={fetchVahanData}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FaSearch className="text-xs" />
                      <span>Fetch RC Details</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Actual Vahan Data
              <>
                {/* RC Details Card */}
                <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white">RC Details</h3>
                    <div className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">
                      Active
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Registration No.</span>
                      <span className="text-xs text-white font-medium">MH48AC5461</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Registration Date</span>
                      <span className="text-xs text-white">14-Oct-2015</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Fitness Upto</span>
                      <span className="text-xs text-white">13-Oct-2030</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Insurance Upto</span>
                      <span className="text-xs text-white">10-Nov-2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Vehicle Age</span>
                      <span className="text-xs text-white">9 years, 4 months</span>
                    </div>
                  </div>
                </div>

                {/* Owner Details Card */}
                <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05]">
                  <h3 className="text-sm font-medium text-white mb-3">Owner Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Owner Name</span>
                      <span className="text-sm text-white font-medium">S*BH*SH C*AN*RA C*OU*HA*Y</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Ownership</span>
                      <span className="text-sm text-white">First Owner</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Registered RTO</span>
                      <span className="text-sm text-white">Chandansar, Virar (E), Vasai, Thane - 401303</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Technical Details Card */}
                <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05]">
                  <h3 className="text-sm font-medium text-white mb-3">Vehicle Technical Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Maker Model</span>
                      <span className="text-xs text-white">HONDA CARS INDIA LTD, CITY 1.5E MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Vehicle Class</span>
                      <span className="text-xs text-white">Motor Car(LMV)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Fuel Type</span>
                      <span className="text-xs text-white">PETROL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Engine No.</span>
                      <span className="text-xs text-white font-mono">L15Z122XXXXX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Chassis No.</span>
                      <span className="text-xs text-white font-mono">MAKGM651GF41XXXXX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Color</span>
                      <span className="text-xs text-white">T WHITE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Unloaded Weight</span>
                      <span className="text-xs text-white">1029 Kg</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 text-right">
                  Last updated: 2 minutes ago
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ANPR; 