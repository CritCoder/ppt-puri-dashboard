import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { BiCctv, BiDownload, BiPlay, BiPause, BiSkipPrevious, BiSkipNext, BiArrowBack, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { MdOutlineVerified, MdLocationOn } from 'react-icons/md';
import { GoogleMap, useLoadScript, OverlayView, StandaloneSearchBox } from '@react-google-maps/api';
import { communityLocations, locations } from '../mapData';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  isBefore,
  parseISO,
  addMonths,
  subMonths
} from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../../../styles/datepicker-dark.css';
import { RiFileTextLine, RiLockLine } from 'react-icons/ri';

// Helper function to format time in mm:ss
const formatTime = (timeInSeconds) => {
  if (!timeInSeconds) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimelineMarker = ({ timestamp, type, isActive, onClick }) => (
  <motion.div
    className={`absolute transform -translate-x-1/2 cursor-pointer
      ${isActive ? 'z-20' : 'z-10'}`}
    style={{ left: `${timestamp}%` }}
    whileHover={{ scale: 1.2 }}
    onClick={onClick}
  >
    <div className={`w-1 h-3 ${type === 'motion' ? 'bg-yellow-500' : 'bg-red-500'}`} />
    <div className={`absolute bottom-full mb-2 text-xs ${isActive ? 'opacity-100' : 'opacity-0'} 
      bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap`}>
      {formatTime((timestamp / 100) * 60)}
      <br />
      {type === 'motion' ? 'Motion Detected' : 'Alert Triggered'}
    </div>
  </motion.div>
);

const MapView = ({ onCameraSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ['places']
  });

  const [showCameras, setShowCameras] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 19.8078, lng: 85.8310 });
  const [zoom, setZoom] = useState(12);
  const searchBoxRef = useRef(null);

  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          setMapCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          setZoom(16);
          setShowCameras(true);
        }
      }
    }
  };

  const cameras = [
    {
      id: 1,
      name: "Jagannath Temple Main Gate",
      position: { lat: 19.8077, lng: 85.8315 },
      type: "ptz"
    },
    {
      id: 2,
      name: "Jagannath Temple South Gate",
      position: { lat: 19.8073, lng: 85.8318 },
      type: "dome"
    },
    {
      id: 3,
      name: "Swargadwar Beach",
      position: { lat: 19.8001, lng: 85.8301 },
      type: "ptz"
    },
    {
      id: 4,
      name: "Puri Railway Station",
      position: { lat: 19.8124, lng: 85.8287 },
      type: "ptz"
    },
    {
      id: 5,
      name: "Bada Danda Square",
      position: { lat: 19.8079, lng: 85.8240 },
      type: "dome"
    },
    {
      id: 6,
      name: "Grand Road",
      position: { lat: 19.8075, lng: 85.8240 },
      type: "ptz"
    },
    {
      id: 7,
      name: "Gundicha Temple",
      position: { lat: 19.8131, lng: 85.8173 },
      type: "dome"
    },
    {
      id: 8,
      name: "Marine Drive",
      position: { lat: 19.7950, lng: 85.8375 },
      type: "fixed"
    },
    {
      id: 9,
      name: "Puri Bus Stand",
      position: { lat: 19.8115, lng: 85.8250 },
      type: "ptz"
    },
    {
      id: 10,
      name: "Chakratirtha Road",
      position: { lat: 19.8030, lng: 85.8339 },
      type: "dome"
    },
    {
      id: 11,
      name: "Narendra Tank",
      position: { lat: 19.8186, lng: 85.8240 },
      type: "fixed"
    },
    {
      id: 12,
      name: "Lokanath Temple",
      position: { lat: 19.8006, lng: 85.8210 },
      type: "ptz"
    },
    {
      id: 13,
      name: "CT Road",
      position: { lat: 19.8050, lng: 85.8280 },
      type: "fixed"
    },
    {
      id: 14,
      name: "Puri Market",
      position: { lat: 19.8090, lng: 85.8260 },
      type: "dome"
    },
    {
      id: 15,
      name: "Puri College",
      position: { lat: 19.8112, lng: 85.8330 },
      type: "ptz"
    }
  ];

  const CameraMarker = ({ camera }) => {
    return (
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        onClick={() => onCameraSelect(camera)}
      >
        <div className={`
          w-12 h-12 
          rounded-full 
          flex items-center justify-center 
          cursor-pointer
          transition-all
          hover:scale-110
          ${camera.type === 'ptz' 
            ? 'bg-purple-500/20 hover:bg-purple-500/30' 
            : camera.type === 'dome' 
              ? 'bg-blue-500/20 hover:bg-blue-500/30'
              : 'bg-emerald-500/20 hover:bg-emerald-500/30'
          }
        `}>
          <BiCctv className={`
            text-2xl
            ${camera.type === 'ptz' 
              ? 'text-purple-500' 
              : camera.type === 'dome' 
                ? 'text-blue-500' 
                : 'text-emerald-500'
            }
          `} />
        </div>
      </div>
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-96">
        <StandaloneSearchBox
          onLoad={ref => searchBoxRef.current = ref}
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            type="text"
            placeholder="Search location (e.g., Jagannath Temple)"
            className="w-full px-4 py-3 bg-black/50 backdrop-blur-md border border-white/10 
              rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-purple-500/50"
          />
        </StandaloneSearchBox>

        {!showCameras && (
          <motion.div 
            className="absolute left-0 right-0 top-full mt-4 p-4 bg-black/80 
              backdrop-blur-md rounded-lg border border-white/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-gray-400">
              Search for a location to view available surveillance cameras in that area
            </p>
          </motion.div>
        )}
      </div>

      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={mapCenter}
        zoom={zoom}
        options={{
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
          maxZoom: 19
        }}
      >
        {showCameras && cameras.map(camera => (
          <OverlayView
            key={camera.id}
            position={camera.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <CameraMarker camera={camera} />
          </OverlayView>
        ))}

        {/* Initial area highlight */}
        {!showCameras && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="px-6 py-4 bg-black/80 backdrop-blur-md rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-2">Puri Surveillance Network</h3>
              <p className="text-sm text-gray-400">Search for a specific location to view cameras</p>
            </div>
          </motion.div>
        )}
      </GoogleMap>
    </div>
  );
};

const CameraDetailsCard = ({ camera, onViewFootage, onBack }) => {
  // Simulated multiple cameras per location
  const locationCameras = [
    {
      id: `${camera.id}-1`,
      name: "Main Entrance",
      type: camera.type || "ptz",
      preview: "https://i.imgur.com/XYZdef.jpg", // Replace with actual preview
      status: "online"
    },
    {
      id: `${camera.id}-2`,
      name: "Exit Gate",
      type: camera.type === "ptz" ? "dome" : "ptz",
      preview: "https://i.imgur.com/ABCdef.jpg",
      status: "online"
    },
    {
      id: `${camera.id}-3`,
      name: "Parking View",
      type: "fixed",
      preview: "https://i.imgur.com/123def.jpg",
      status: "maintenance"
    }
  ];

  return (
    <motion.div 
      className="h-full flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-black/50 backdrop-blur-md rounded-xl border border-white/10 p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-medium text-white mb-2">{camera.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MdLocationOn className="text-purple-500" />
              <span>{camera.position.lat.toFixed(4)}, {camera.position.lng.toFixed(4)}</span>
            </div>
          </div>
          <motion.button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <BiArrowBack className="text-xl" />
          </motion.button>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {locationCameras.map((cam) => (
            <motion.div
              key={cam.id}
              className="bg-black/30 rounded-lg overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => onViewFootage({ ...camera, ...cam })}
            >
              {/* Preview Image */}
              <div className="relative aspect-video bg-black/60">
                {/* Temporary colored div instead of image */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                
                {/* Live indicator */}
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    cam.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-xs text-white font-medium">
                    {cam.status === 'online' ? 'LIVE' : 'MAINTENANCE'}
                  </span>
                </div>

                {/* Camera type indicator */}
                <div className="absolute top-2 right-2 text-white/80">
                  <BiCctv className="text-xl" />
                </div>

                {/* View button on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                  transition-opacity flex items-center justify-center">
                  <button className="px-4 py-2 bg-purple-500/80 text-white rounded-lg text-sm">
                    View Footage
                  </button>
                </div>
              </div>

              {/* Camera Info */}
              <div className="p-4">
                <h3 className="text-white font-medium mb-1">{cam.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{cam.type.toUpperCase()}</span>
                  <span className="text-xs text-gray-400">ID: {cam.id}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Coverage Details</p>
            <ul className="space-y-2 text-white">
              <li>• {locationCameras.filter(c => c.type === 'ptz').length} PTZ Cameras</li>
              <li>• {locationCameras.filter(c => c.type === 'dome').length} Dome Cameras</li>
              <li>• {locationCameras.filter(c => c.type === 'fixed').length} Fixed Cameras</li>
            </ul>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Status Overview</p>
            <ul className="space-y-2 text-white">
              <li>• {locationCameras.filter(c => c.status === 'online').length} Cameras Online</li>
              <li>• {locationCameras.filter(c => c.status === 'maintenance').length} In Maintenance</li>
              <li>• Last Updated: {new Date().toLocaleTimeString()}</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Update the CalendarView component
const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Simulated footage data - we'll use this to highlight dates
  const footageData = {
    '2024-03-15': { hasFootage: true, hasIncident: true },
    '2024-03-16': { hasFootage: true, hasIncident: false },
    '2024-03-17': { hasFootage: true, hasIncident: true },
    // Add more dates as needed
  };

  // Custom day rendering
  const renderDayContents = (day, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const footage = footageData[dateStr];
    const isPast = isBefore(date, new Date()) && !isToday(date);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={`
          ${isToday(date) ? 'text-purple-500 font-bold' : ''}
          ${!isSameMonth(date, selectedDate) ? 'text-gray-600' : ''}
        `}>
          {format(date, 'd')}
        </span>
        {isPast && footage && (
          <div className={`
            absolute inset-1 -z-10 rounded-lg border opacity-30
            ${footage.hasIncident 
              ? 'border-red-500 bg-red-500/10' 
              : 'border-green-500 bg-green-500/10'
            }
          `} />
        )}
      </div>
    );
  };

  return (
    <div className="bg-black/30 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-white font-medium mb-4">Footage Archive</h3>
      
      <div className="flex-1 datepicker-dark">
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          inline
          renderDayContents={renderDayContents}
          calendarClassName="!bg-transparent !border-0"
          dayClassName={() => "!bg-transparent"}
          monthClassName={() => "!bg-transparent !border-0"}
          weekDayClassName={() => "!text-gray-400"}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled
          }) => (
            <div className="flex items-center justify-between px-2 py-2">
              <motion.button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-1 text-gray-400 hover:text-white rounded-full disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BiChevronLeft className="text-xl" />
              </motion.button>
              
              <span className="text-white font-medium">
                {format(date, 'MMMM yyyy')}
              </span>
              
              <motion.button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-1 text-gray-400 hover:text-white rounded-full disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BiChevronRight className="text-xl" />
              </motion.button>
            </div>
          )}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500" />
            <span className="text-gray-400">Footage Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500" />
            <span className="text-gray-400">Incident Detected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateModal = ({ isOpen, onClose, camera, timestamp }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-black/80 border border-white/10 rounded-xl p-8 max-w-2xl w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Certificate Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
              <RiFileTextLine className="text-3xl text-purple-500" />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">Digital Evidence Certificate</h2>
          <p className="text-gray-400">Section 65B of Indian Evidence Act, 1872</p>
        </div>

        {/* Certificate Content */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-400">Camera Details</p>
              <p className="text-white">{camera.name} - {camera.type.toUpperCase()} Camera</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white">{camera.position.lat.toFixed(4)}, {camera.position.lng.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Timestamp</p>
              <p className="text-white">{new Date().toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Certificate Statement</p>
            <p className="text-white text-sm leading-relaxed">
              This is to certify that the above digital video evidence was produced by computer/device 
              in the regular course of surveillance activities. The computer/device was operating properly 
              at the time of creation of the electronic record and the electronic record was regularly 
              recorded and stored in the database.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <RiLockLine className="text-xl text-green-500" />
            </div>
            <div>
              <p className="text-white font-medium">Cryptographically Verified</p>
              <p className="text-sm text-gray-400">SHA-256: {Array.from({ length: 32 }, () => 
                Math.floor(Math.random() * 16).toString(16)).join('')}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <motion.button
            className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg
              flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            <BiDownload className="text-xl" />
            Download Certificate
          </motion.button>
          <motion.button
            className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DigitalEvidence = ({ selectedCamera, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState('map'); // 'map', 'details', 'player'
  const [showCertificate, setShowCertificate] = useState(false);

  // Sample timeline markers
  const markers = [
    { timestamp: 15, type: 'motion' },
    { timestamp: 35, type: 'alert' },
    { timestamp: 65, type: 'motion' },
    { timestamp: 85, type: 'alert' },
  ];

  useEffect(() => {
    if (selectedCamera) {
      setView('details');
    }
  }, [selectedCamera]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current.duration);
        setIsLoaded(true);
      });
    }
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTimelineClick = (e) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setShowCertificate(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const videoRef = useRef(null);

  return (
    <motion.div 
      className="flex-1 h-full pt-16 bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {view === 'map' && (
          <motion.div 
            key="map"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MapView onCameraSelect={selectedCamera => {
              setView('details');
            }} />
          </motion.div>
        )}

        {view === 'details' && selectedCamera && (
          <CameraDetailsCard 
            camera={selectedCamera}
            onViewFootage={() => setView('player')}
            onBack={onBack}
          />
        )}

        {view === 'player' && selectedCamera && (
          <motion.div 
            key="player"
            className="h-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="h-full flex flex-col p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => setView('details')}
                    className="p-2 text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BiArrowBack className="text-xl" />
                  </motion.button>
                  <div>
                    <h2 className="text-xl font-medium text-white">{selectedCamera.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MdLocationOn className="text-purple-500" />
                      <span>{selectedCamera.type.toUpperCase()} Camera</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full
                    ${isExporting 
                      ? 'bg-green-500 text-white' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                  onClick={handleExport}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isExporting ? (
                    <>
                      <MdOutlineVerified className="text-lg" />
                      <span>Evidence Exported</span>
                    </>
                  ) : (
                    <>
                      <BiDownload className="text-lg" />
                      <span>Export with Certificate</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex gap-6 min-h-0">
                {/* Calendar View */}
                <div className="w-96">
                  <CalendarView />
                </div>

                {/* Video Player */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      onTimeUpdate={handleTimeUpdate}
                    />
                  </div>

                  {/* Controls */}
                  <div className="mt-6 space-y-4">
                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <motion.button
                        className="p-2 text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <BiSkipPrevious className="text-2xl" />
                      </motion.button>
                      <motion.button
                        className="p-3 bg-purple-500 rounded-full text-white hover:bg-purple-600"
                        onClick={handlePlayPause}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isPlaying ? <BiPause className="text-xl" /> : <BiPlay className="text-xl" />}
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <BiSkipNext className="text-2xl" />
                      </motion.button>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <div 
                        className="h-8 bg-gray-900 rounded-lg relative cursor-pointer"
                        onClick={handleTimelineClick}
                      >
                        {/* Progress Bar */}
                        <div 
                          className="absolute h-1 bg-purple-500 top-1/2 transform -translate-y-1/2"
                          style={{ width: `${(currentTime / (duration || 1)) * 100}%`, left: '0' }}
                        />
                        
                        {/* Timeline Markers */}
                        {isLoaded && markers.map((marker, index) => (
                          <TimelineMarker
                            key={index}
                            {...marker}
                            isActive={Math.abs((currentTime / duration) * 100 - marker.timestamp) < 5}
                          />
                        ))}

                        {/* Time Indicator */}
                        <div className="absolute -top-6 left-0 text-xs text-gray-400">
                          {formatTime(currentTime)}
                        </div>
                        <div className="absolute -top-6 right-0 text-xs text-gray-400">
                          {formatTime(duration)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCertificate && (
          <CertificateModal
            isOpen={showCertificate}
            onClose={() => setShowCertificate(false)}
            camera={selectedCamera}
            timestamp={new Date()}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DigitalEvidence; 