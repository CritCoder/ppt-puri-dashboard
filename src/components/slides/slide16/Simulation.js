import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, HeatmapLayer } from '@react-google-maps/api';
import { FaPlay, FaPause, FaRedo, FaCog } from 'react-icons/fa';

const Simulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [crowdData, setCrowdData] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  const center = { lat: 23.1793, lng: 75.8349 }; // Ujjain center

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ["visualization"]
  });

  // Simulation settings
  const [settings, setSettings] = useState({
    crowdSize: 10000,
    duration: 120, // 2 hours in minutes
    peakFactor: 1.5,
    spreadFactor: 0.8
  });

  // Generate crowd data points based on time
  const generateCrowdData = (time) => {
    const points = [];
    const baseCount = settings.crowdSize * (1 + Math.sin(time / 30 * Math.PI) * settings.peakFactor);
    
    for (let i = 0; i < baseCount; i++) {
      points.push({
        location: new window.google.maps.LatLng(
          center.lat + (Math.random() - 0.5) * 0.01 * settings.spreadFactor,
          center.lng + (Math.random() - 0.5) * 0.01 * settings.spreadFactor
        ),
        weight: Math.random()
      });
    }
    return points;
  };

  // Simulation loop
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= settings.duration) {
            setIsSimulating(false);
            return 0;
          }
          return prev + simulationSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, settings.duration]);

  // Update crowd data when time changes
  useEffect(() => {
    if (isLoaded) {
      setCrowdData(generateCrowdData(currentTime));
    }
  }, [currentTime, isLoaded]);

  return (
    <motion.div
      className="h-full p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex h-full gap-6">
        {/* Control Panel */}
        <div className="w-96 space-y-6">
          {/* Simulation Controls */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-medium mb-4">Simulation Controls</h3>
            
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
              >
                {isSimulating ? <FaPause /> : <FaPlay />}
                {isSimulating ? 'Pause' : 'Start'} Simulation
              </button>
              
              <button
                onClick={() => setCurrentTime(0)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <FaRedo />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Simulation Speed
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1x</span>
                  <span>5x</span>
                </div>
              </div>

              <div className="text-white">
                Time: {Math.floor(currentTime / 60)}h {currentTime % 60}m
              </div>
            </div>
          </div>

          {/* Simulation Settings */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <FaCog className="text-gray-400" />
              <h3 className="text-white font-medium">Simulation Settings</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm text-gray-400 mb-2 block">
                    {key.split(/(?=[A-Z])/).join(' ')}
                  </label>
                  <input
                    type="range"
                    min={key === 'crowdSize' ? 1000 : 0}
                    max={key === 'crowdSize' ? 50000 : key === 'duration' ? 240 : 2}
                    step={key === 'crowdSize' ? 1000 : 0.1}
                    value={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      [key]: Number(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{value}</span>
                    <span>{key === 'crowdSize' ? 'people' : key === 'duration' ? 'mins' : 'x'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={center}
              zoom={15}
              options={{
                styles: [
                  {
                    "elementType": "geometry",
                    "stylers": [{ "color": "#242f3e" }]
                  },
                  {
                    "elementType": "labels.text.stroke",
                    "stylers": [{ "color": "#242f3e" }]
                  },
                  {
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#746855" }]
                  }
                ]
              }}
            >
              <HeatmapLayer
                data={crowdData}
                options={{
                  radius: 20,
                  opacity: 0.7,
                  gradient: [
                    'rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'
                  ]
                }}
              />
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white">Loading map...</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Simulation; 