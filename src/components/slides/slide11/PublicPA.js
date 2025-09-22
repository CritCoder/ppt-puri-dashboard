import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { BiSearch, BiCurrentLocation, BiMicrophone, BiStop } from 'react-icons/bi';
import { MdSpeaker, MdVolumeUp } from 'react-icons/md';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useGoogleMaps } from '../../../utils/mapsConfig';

const PublicPA = () => {
  const { isLoaded, loadError } = useGoogleMaps();

  const [mapCenter, setMapCenter] = useState({ lat: 19.8077, lng: 85.8315 });
  const [zoom, setZoom] = useState(14);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);

  // Smart poles with PA speakers
  const speakers = [
    { id: 1, name: 'Jagannath Temple Gate', location: { lat: 19.8077, lng: 85.8315 } },
    { id: 2, name: 'Grand Road Market', location: { lat: 19.8075, lng: 85.8240 } },
    { id: 3, name: 'Puri Railway Station', location: { lat: 19.8124, lng: 85.8287 } },
    { id: 4, name: 'Bada Danda Square', location: { lat: 19.8075, lng: 85.8270 } },
    { id: 5, name: 'Marine Drive', location: { lat: 19.8000, lng: 85.8520 } },
    // Beach area speakers
    { id: 6, name: 'Swargadwar Beach', location: { lat: 19.8001, lng: 85.8301 } },
    { id: 7, name: 'Golden Beach', location: { lat: 19.7980, lng: 85.8310 } },
    { id: 8, name: 'Lighthouse Beach', location: { lat: 19.7950, lng: 85.8320 } },
    { id: 9, name: 'Chakratirtha Beach', location: { lat: 19.8020, lng: 85.8290 } },
    { id: 10, name: 'Beach Lifeguard Station', location: { lat: 19.7970, lng: 85.8305 } },
    { id: 11, name: 'Beach Market Entrance', location: { lat: 19.7976, lng: 85.8301 } },
  ];

  const SpeakerMarker = ({ speaker }) => {
    const isSelected = selectedSpeakers.includes(speaker.id);

    return (
      <motion.div
        className="relative cursor-pointer"
        onClick={() => {
          setSelectedSpeakers(prev => 
            prev.includes(speaker.id) 
              ? prev.filter(id => id !== speaker.id)
              : [...prev, speaker.id]
          );
        }}
        whileHover={{ scale: 1.1 }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center
          backdrop-blur-sm border-2 ${
            isSelected ? 'bg-purple-500 border-purple-500' : 'bg-black/50 border-white/50'
          }`}
        >
          <MdSpeaker className={`text-2xl ${isSelected ? 'text-white' : 'text-gray-400'}`} />
        </div>
        {isSelected && (
          <motion.div
            className="absolute -top-1 -right-1 bg-purple-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <IoCheckmarkCircle className="text-lg text-white" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  const BroadcastModal = ({ isOpen, onClose }) => {
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
      if (isRecording) {
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        clearInterval(timerRef.current);
      }

      return () => clearInterval(timerRef.current);
    }, [isRecording]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRecord = () => {
      setIsRecording(prev => !prev);
      if (!isRecording) {
        setRecordingTime(0);
      } else {
        // Simulate broadcast
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
          onClose();
        }, 2000);
      }
    };

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
              className="bg-black/80 border border-white/10 rounded-xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium text-white mb-2">Public Announcement</h2>
                <p className="text-gray-400">Broadcasting to {selectedSpeakers.length} locations</p>
              </div>

              <div className="space-y-6">
                {/* Selected Locations */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-3">Selected Locations</h3>
                  <div className="space-y-2">
                    {selectedSpeakers.map(id => (
                      <div key={id} className="flex items-center gap-3">
                        <MdVolumeUp className="text-purple-500" />
                        <span className="text-white">
                          {speakers.find(s => s.id === id)?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="flex flex-col items-center gap-4">
                  <motion.button
                    className={`w-24 h-24 rounded-full flex items-center justify-center
                      ${isRecording ? 'bg-red-500' : 'bg-purple-500'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRecord}
                  >
                    {isPlaying ? (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <motion.div
                          className="w-full h-full border-4 border-white rounded-full border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    ) : (
                      isRecording ? (
                        <BiStop className="text-4xl text-white" />
                      ) : (
                        <BiMicrophone className="text-4xl text-white" />
                      )
                    )}
                  </motion.button>
                  
                  {isRecording && (
                    <div className="text-red-500 font-medium">
                      {formatTime(recordingTime)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <motion.div 
      className="flex-1 h-full pt-16 bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="h-full relative">
        {/* Search Controls */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-96">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for PA locations in Puri..."
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

        {/* Broadcast Button */}
        {selectedSpeakers.length > 0 && (
          <motion.button
            className="absolute top-6 right-6 z-10 px-6 py-3 bg-purple-500 text-white 
              rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBroadcast(true)}
          >
            <BiMicrophone className="text-xl" />
            Broadcast ({selectedSpeakers.length})
          </motion.button>
        )}

        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={mapCenter}
          zoom={zoom}
          options={{
            styles: [
              // ... copy the map styles from SOSResponse.js
            ],
            disableDefaultUI: true,
            minZoom: 7,
            maxZoom: 19
          }}
        >
          {speakers.map(speaker => (
            <OverlayView
              key={speaker.id}
              position={speaker.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <SpeakerMarker speaker={speaker} />
            </OverlayView>
          ))}
        </GoogleMap>

        <BroadcastModal 
          isOpen={showBroadcast}
          onClose={() => {
            setShowBroadcast(false);
            setIsRecording(false);
            setSelectedSpeakers([]);
          }}
        />
      </div>
    </motion.div>
  );
};

export default PublicPA; 