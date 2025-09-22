import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  GoogleMap, 
  useLoadScript, 
  OverlayView, 
  DirectionsService, 
  DirectionsRenderer,
  useJsApiLoader
} from '@react-google-maps/api';
import { BiSearch, BiCurrentLocation } from 'react-icons/bi';
import { MdOutlineEmergency, MdLocationOn, MdWarning, MdLocalFireDepartment } from 'react-icons/md';
import { FaAmbulance, FaUserShield } from 'react-icons/fa';
import { IoCall, IoCallSharp } from 'react-icons/io5';
import { RiPoliceCarFill } from 'react-icons/ri';
import policeCarImage from '../../../plc.png';
import { useGoogleMaps } from '../../../utils/mapsConfig';

const SOSResponse = () => {
  const { isLoaded, loadError } = useGoogleMaps();

  const [mapCenter, setMapCenter] = useState({ lat: 19.8078, lng: 85.8310 });
  const [zoom, setZoom] = useState(12);
  const [activeEmergencies, setActiveEmergencies] = useState([
    {
      id: 1,
      type: 'medical',
      location: { lat: 19.8077, lng: 85.8315 },
      timestamp: new Date(),
      status: 'active',
      description: 'Medical Emergency at Jagannath Temple',
      priority: 'high',
      responders: ['ambulance-1', 'police-3']
    },
    {
      id: 2,
      type: 'fire',
      location: { lat: 19.8124, lng: 85.8287 },
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      status: 'responding',
      description: 'Fire reported near Puri Railway Station',
      priority: 'critical',
      responders: ['fire-2', 'ambulance-2', 'police-1']
    }
  ]);

  const [showEmergencyCall, setShowEmergencyCall] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [responderMarkers, setResponderMarkers] = useState([]);
  const [showEmergencyStatus, setShowEmergencyStatus] = useState(false);

  // Add responder starting locations
  const responderBases = {
    fire: { lat: 19.8040, lng: 85.8280 },    // Fire Station
    police: { lat: 19.8090, lng: 85.8250 },   // Police Station
    ambulance: { lat: 19.8050, lng: 85.8330 } // Hospital
  };

  const calculateHeading = (fromLat, fromLng, toLat, toLng) => {
    const toRad = n => n * Math.PI / 180;
    const y = Math.sin(toRad(toLng) - toRad(fromLng)) * Math.cos(toRad(toLat));
    const x = Math.cos(toRad(fromLat)) * Math.sin(toRad(toLat)) -
             Math.sin(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.cos(toRad(toLng) - toRad(fromLng));
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  const animateResponder = (route, type) => {
    if (!route.routes?.[0]?.overview_path) return;
    
    const path = route.routes[0].overview_path;
    let currentIndex = 0;

    const moveAlongPath = () => {
      if (currentIndex >= path.length - 1) return;

      const currentPos = path[currentIndex];
      const nextPos = path[currentIndex + 1];

      setResponderMarkers(prev => {
        const newMarkers = prev.filter(m => m.id !== type);
        return [...newMarkers, {
          id: type,
          type,
          position: { 
            lat: currentPos.lat(), 
            lng: currentPos.lng() 
          },
          nextPoint: { 
            lat: nextPos.lat(), 
            lng: nextPos.lng() 
          }
        }];
      });

      currentIndex++;
      if (currentIndex < path.length - 1) {
        // Calculate speed based on distance
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          currentPos,
          nextPos
        );
        const speed = Math.max(50, Math.min(200, distance * 2)); // Adjust speed based on distance
        setTimeout(moveAlongPath, speed);
      }
    };

    moveAlongPath();
  };

  const getDirections = (type, destination) => {
    if (!window.google) return;

    const DirectionsService = new window.google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: responderBases[type],
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setRoutes(prev => [...prev, { type, route: result }]);
          animateResponder(result, type);
        }
      }
    );
  };

  const handleDispatch = (type) => {
    const destination = { lat: 19.8075, lng: 85.8240 };
    
    // Add new emergency
    const newEmergency = {
      id: Date.now(),
      type,
      location: destination,
      timestamp: new Date(),
      status: 'active',
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} emergency at Grand Road Market`,
      priority: 'critical',
      responders: []
    };

    setActiveEmergencies(prev => [...prev, newEmergency]);
    setMapCenter(destination);
    setZoom(15);
    setShowEmergencyStatus(true);

    // Get and animate route
    getDirections(type, destination);
  };

  const EmergencyMarker = ({ emergency }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getEmergencyIcon = () => {
      switch(emergency.type) {
        case 'medical':
          return <FaAmbulance className="text-2xl text-red-500" />;
        case 'fire':
          return <MdLocalFireDepartment className="text-2xl text-orange-500" />;
        default:
          return <FaUserShield className="text-2xl text-blue-500" />;
      }
    };

    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pulsing Background */}
        <div className={`absolute inset-0 rounded-full animate-ping ${
          emergency.priority === 'critical' ? 'bg-red-500' : 
          emergency.priority === 'high' ? 'bg-orange-500' : 
          'bg-yellow-500'
        } opacity-20`} />

        {/* Icon Container */}
        <motion.div
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
            backdrop-blur-sm border-2 relative z-10 ${
            emergency.priority === 'critical' ? 'border-red-500 bg-red-500/10' : 
            emergency.priority === 'high' ? 'border-orange-500 bg-orange-500/10' : 
            'border-yellow-500 bg-yellow-500/10'
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {getEmergencyIcon()}
        </motion.div>

        {/* Info Card on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-black/90 
                backdrop-blur-sm rounded-lg border border-white/10 p-3 z-20"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5">
                  {getEmergencyIcon()}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">{emergency.description}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(emergency.timestamp).toLocaleTimeString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      emergency.status === 'active' ? 'bg-red-500/20 text-red-500' :
                      'bg-orange-500/20 text-orange-500'
                    }`}>
                      {emergency.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      emergency.priority === 'critical' ? 'bg-red-500/20 text-red-500' :
                      emergency.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {emergency.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ResponderMarker = ({ responder, nextPoint }) => {
    const heading = nextPoint ? calculateHeading(
      responder.position.lat,
      responder.position.lng,
      nextPoint.lat,
      nextPoint.lng
    ) : 0;

    return (
      <motion.div
        className="relative w-16 h-16"
        initial={false}
        animate={{ 
          x: [0, 0],
          y: [0, 0],
          scale: 1,
          rotate: heading - 90 // Adjust based on your car image orientation
        }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={policeCarImage}
          alt="Emergency Vehicle"
          className="w-full h-full object-contain"
          style={{
            filter: `drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) 
                    drop-shadow(0 0 8px ${
                      responder.type === 'fire' ? '#ef444466' :
                      responder.type === 'police' ? '#3b82f666' :
                      '#22c55e66'
                    })`
          }}
        />
      </motion.div>
    );
  };

  // Add this new component for the destination marker
  const DestinationMarker = () => (
    <div className="relative">
      <div className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-red-500 rounded-full"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="absolute inset-4 bg-red-500 rounded-full flex items-center justify-center">
          <MdWarning className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  // Add this new component after the DestinationMarker component
  const EmergencyStatusCard = ({ emergency, routes, responderMarkers }) => {
    const calculateETA = (type) => {
      const route = routes.find(r => r.type === type);
      if (route && route.route.routes[0]) {
        return route.route.routes[0].legs[0].duration.text;
      }
      return 'Calculating...';
    };

    const getResponderStatus = (type) => {
      const isDispatched = routes.some(r => r.type === type);
      const isEnRoute = responderMarkers.some(m => m.type === type);
      
      if (isEnRoute) return 'En Route';
      if (isDispatched) return 'Dispatched';
      return 'Pending';
    };

    return (
      <motion.div
        className="absolute top-24 right-6 w-96 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 p-4 z-20"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
        key="emergency-status-card"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-medium">Active Emergency</h3>
            <p className="text-sm text-gray-400">Grand Road Market Area</p>
          </div>
          <div className="px-2 py-1 bg-red-500/20 rounded-full">
            <span className="text-xs text-red-500 font-medium">CRITICAL</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Emergency Details */}
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-white">
              <MdWarning className="text-red-500" />
              <span className="font-medium">Fire Emergency</span>
            </div>
            <p className="text-sm text-gray-400">
              Large fire reported at textile shop, multiple people potentially trapped inside
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MdLocationOn className="text-purple-500" />
              <span>19.8075° N, 85.8240° E</span>
            </div>
          </div>

          {/* Response Status */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'fire', name: 'Fire Brigade', icon: MdLocalFireDepartment, color: 'red' },
              { type: 'police', name: 'Police', icon: RiPoliceCarFill, color: 'blue' },
              { type: 'ambulance', name: 'Ambulance', icon: FaAmbulance, color: 'green' }
            ].map(service => (
              <div key={service.type} className={`bg-${service.color}-500/10 rounded-lg p-3`}>
                <service.icon className={`text-${service.color}-500 text-xl mb-2`} />
                <div className="text-xs space-y-1">
                  <p className="text-white font-medium">{service.name}</p>
                  <p className={`text-${service.color}-500`}>
                    {getResponderStatus(service.type)}
                  </p>
                  <p className="text-gray-400">
                    ETA: {calculateETA(service.type)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Actions */}
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="text-sm text-gray-400 mb-2">Next Actions</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Evacuate surrounding buildings
              </li>
              <li className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Set up medical triage area
              </li>
              <li className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Coordinate with nearby hospitals
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <motion.div 
      className="flex-1 h-full pt-16 bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full relative">
        {/* Search and Filter Controls */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-96">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search location or emergency ID..."
                className="w-full px-4 py-3 bg-black/50 backdrop-blur-md border border-white/10 
                  rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-purple-500/50"
              />
              <BiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <motion.button
              className="px-4 py-3 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BiCurrentLocation className="text-xl" />
            </motion.button>
          </div>
        </div>

        {/* Add Emergency Call Trigger Button */}
        <div className="absolute top-6 right-6 z-10">
          <motion.button
            className="px-6 py-3 bg-red-500 text-white rounded-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmergencyCall(true)}
          >
            <IoCall className="text-xl" />
            Simulate Emergency Call
          </motion.button>
        </div>

        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={mapCenter}
          zoom={zoom}
          options={{
            styles: [
              // ... copy the map styles from DigitalEvidence.js
            ],
            disableDefaultUI: true,
            minZoom: 7,
            maxZoom: 19
          }}
        >
          {activeEmergencies.map(emergency => (
            <OverlayView
              key={emergency.id}
              position={emergency.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <EmergencyMarker emergency={emergency} />
            </OverlayView>
          ))}

          {/* Add destination marker */}
          <OverlayView
            position={{ lat: 19.8075, lng: 85.8240 }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <DestinationMarker />
          </OverlayView>

          {responderMarkers.map(responder => (
            <OverlayView
              key={responder.id}
              position={responder.position}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <ResponderMarker 
                responder={responder}
                nextPoint={responder.nextPoint}
              />
            </OverlayView>
          ))}

          {routes.map((route, index) => (
            <DirectionsRenderer
              key={index}
              options={{
                directions: route.route,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: route.type === 'fire' ? '#ef4444' :
                              route.type === 'police' ? '#3b82f6' :
                              '#22c55e',
                  strokeOpacity: 0.8,
                  strokeWeight: 4
                }
              }}
            />
          ))}
        </GoogleMap>

        <AnimatePresence>
          {showEmergencyStatus && (
            <EmergencyStatusCard 
              emergency={activeEmergencies[activeEmergencies.length - 1]}
              routes={routes}
              responderMarkers={responderMarkers}
            />
          )}
        </AnimatePresence>

        <EmergencyCall 
          isOpen={showEmergencyCall}
          onClose={() => setShowEmergencyCall(false)}
          onDispatch={handleDispatch}
        />
      </div>
    </motion.div>
  );
};

const EmergencyCall = ({ isOpen, onClose, onDispatch }) => {
  const [callStage, setCallStage] = useState('incoming');
  const [transcript, setTranscript] = useState([]);
  const [isDispatching, setIsDispatching] = useState(false);
  
  const conversationRef = useRef([
    { time: '00:00', speaker: 'Operator', text: 'आपातकालीन सेवाएं, आपकी क्या आपात स्थिति है?' },
    { time: '00:03', speaker: 'Caller', text: 'आग लगी है! ग्रैंड रोड मार्केट में बहुत बड़ी आग लगी है!' },
    { time: '00:06', speaker: 'Operator', text: 'शांत रहें। क्या आप सटीक स्थान बता सकते हैं?' },
    { time: '00:09', speaker: 'Caller', text: 'ग्रैंड रोड मार्केट के मुख्य प्रवेश द्वार के पास, कपड़े की दुकान में आग लगी है!' },
    { time: '00:12', speaker: 'Operator', text: 'क्या इमारत के अंदर लोग हैं?' },
    { time: '00:15', speaker: 'Caller', text: 'हां, लोगों की चीख-पुकार सुनाई दे रही है!' },
    { time: '00:18', speaker: 'Operator', text: 'मैं तुरंत आपातकालीन सेवाओं को भेज रहा हूं। लाइन पर बने रहें।' }
  ]);

  const handleDispatch = (type) => {
    setIsDispatching(true);
    onDispatch(type);
    setTimeout(() => {
      onClose();
      setIsDispatching(false);
    }, 1000);
  };
  
  const renderTranscriptLine = (line, index) => {
    if (!line || !line.time || !line.speaker || !line.text) {
      console.error('Invalid transcript line:', line);
      return null;
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4"
      >
        <span className="text-gray-400 text-sm">{line.time}</span>
        <div>
          <span className={`text-sm ${
            line.speaker === 'Operator' ? 'text-purple-500' : 'text-orange-500'
          }`}>
            {line.speaker}:
          </span>
          <p className="text-white">{line.text}</p>
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    let interval;
    if (callStage === 'ongoing' && conversationRef.current) {
      let index = 0;
      setTranscript([]);
      
      interval = setInterval(() => {
        if (index < conversationRef.current.length) {
          const nextLine = conversationRef.current[index];
          if (nextLine && nextLine.time) {
            setTranscript(prev => [...prev, nextLine]);
            index++;
          } else {
            console.error('Invalid conversation line at index:', index);
            clearInterval(interval);
            setCallStage('dispatching');
          }
        } else {
          clearInterval(interval);
          setCallStage('dispatching');
        }
      }, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [callStage]);

  const renderTranscript = () => {
    if (!Array.isArray(transcript) || transcript.length === 0) {
      return (
        <div className="text-gray-400 text-center py-4">
          Call connecting...
        </div>
      );
    }

    return transcript.map((line, index) => renderTranscriptLine(line, index));
  };

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCallStage('incoming');
      setTranscript([]);
      setIsDispatching(false);
    }
  }, [isOpen]);

  // Update the dispatch buttons section:
  const DispatchButton = ({ type, icon: Icon, color, units }) => (
    <motion.button
      className={`w-full p-4 bg-${color}-500/20 border border-${color}-500/50 rounded-lg
        text-${color}-500 flex items-center gap-3 relative`}
      whileHover={{ scale: 1.02 }}
      onClick={() => handleDispatch(type)}
      disabled={isDispatching}
    >
      <Icon className="text-2xl" />
      <div className="text-left">
        <div className="font-medium">{type === 'fire' ? 'Fire Brigade' : 
          type === 'police' ? 'Police Units' : 'Ambulance'}</div>
        <div className="text-sm opacity-80">{units} Units Available</div>
      </div>
      {isDispatching && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <span className="text-white">Dispatching...</span>
        </div>
      )}
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-4xl bg-black/80 border border-white/10 rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {callStage === 'incoming' && (
              <div className="p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <motion.div
                    className="absolute inset-0 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <IoCallSharp className="text-4xl text-white" />
                  </motion.div>
                </div>
                <h2 className="text-2xl font-medium text-white mb-4">Incoming Emergency Call</h2>
                <p className="text-gray-400 mb-8">Caller Location: Grand Road Market Area</p>
                <div className="flex justify-center gap-4">
                  <motion.button
                    className="px-6 py-3 bg-green-500 text-white rounded-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCallStage('ongoing')}
                  >
                    <IoCall className="text-xl" />
                    Answer Call
                  </motion.button>
                </div>
              </div>
            )}

            {(callStage === 'ongoing' || callStage === 'dispatching') && (
              <div className="flex h-[600px]">
                {/* Call Transcript */}
                <div className="flex-1 p-6 border-r border-white/10">
                  <h3 className="text-white font-medium mb-4">Call Transcript</h3>
                  <div className="h-[500px] overflow-y-auto space-y-4">
                    {renderTranscript()}
                  </div>
                </div>

                {/* Dispatch Controls */}
                <div className="w-80 p-6">
                  <h3 className="text-white font-medium mb-4">Emergency Dispatch</h3>
                  <div className="space-y-4">
                    <DispatchButton 
                      type="fire" 
                      icon={MdLocalFireDepartment} 
                      color="red" 
                      units={3} 
                    />
                    <DispatchButton 
                      type="police" 
                      icon={RiPoliceCarFill} 
                      color="blue" 
                      units={5} 
                    />
                    <DispatchButton 
                      type="ambulance" 
                      icon={FaAmbulance} 
                      color="green" 
                      units={2} 
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SOSResponse; 