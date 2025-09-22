import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Polyline, Circle, DirectionsService, DirectionsRenderer, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaUsers, FaBus, FaCar, FaPlane, FaExclamationTriangle, FaShieldAlt, FaTrain, FaPlus, FaTrash, FaRoute, FaStop, FaPlay, FaParking, FaRoad } from 'react-icons/fa';
import { Combobox } from '@headlessui/react';
import usePlacesAutocomplete, { 
  getGeocode, 
  getLatLng 
} from "use-places-autocomplete";
import markers from './markers';
import { SourceInput, AddSourcePopup } from './coms/sourceinput';
import { mapStyles } from './coms/consts';  
import { BusIcon, CarIcon, TrainIcon } from './coms/TransportIcons';

const transportModes = [
  { id: 'bus', Icon: BusIcon, label: 'Bus', color: 'blue' },
  { id: 'car', Icon: CarIcon, label: 'Car (×100)', color: 'green' }
];

// Update the mapStyles constant with light mode styles


// Add this constant for Puri center and zoom
const PURI_VIEW = {
  center: { lat: 19.8077, lng: 85.8315 },
  zoom: 12  // Closer zoom for better city view
};

// Update the SourceInput component


// Then update the display format in the component
const formatNumber = (num) => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} Lakh`;
  } else {
    return num.toLocaleString();
  }
};


// Add this helper function to calculate color and weight based on passenger count
const getRouteStyle = (passengerCount) => {
  const LOW_THRESHOLD = 5;
  const MEDIUM_THRESHOLD = 20;
  const HIGH_THRESHOLD = 50;

  let color, weight;

  if (passengerCount < LOW_THRESHOLD * 100000) {
    color = '#3b82f6'; // blue for low traffic
    weight = 3;
  } else if (passengerCount < MEDIUM_THRESHOLD * 100000) {
    color = '#f97316'; // orange for medium traffic
    weight = 5;
  } else if (passengerCount < HIGH_THRESHOLD * 100000) {
    color = '#8b5cf6'; // purple for high traffic
    weight = 7;
  } else {
    color = '#ef4444'; // red for very high traffic
    weight = 9;
  }

  return {
    strokeColor: color,
    strokeWeight: weight,
    strokeOpacity: 0.8
  };
};

// Update the RouteLabel component
const RouteLabel = ({ position, count, source }) => (
  <OverlayView
    position={position}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  >
    <div className="bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg min-w-[160px] text-white whitespace-nowrap">
      <div className="font-medium text-sm">{source.place}</div>
      <div className="flex justify-between items-center mt-1">
        <div className="text-xs text-white/60">
          {source.count} × {source.paxPerUnit}
        </div>
        <div className="text-sm font-medium">
          {formatNumber(count)}
        </div>
      </div>
    </div>
  </OverlayView>
);

// Add these constants at the top level
const EMOJI_STYLE = {
  fontSize: '24px',
  color: 'white',
  textShadow: '0 0 3px rgba(0,0,0,0.8)'
};

// Add this function to get emoji based on type
const getEmoji = (type) => {
  switch(type) {
    case 'railway':
      return '🚉'; // railway station
    case 'city':
      return '🌆'; // city
    case 'bus':
      return '🚌'; // bus station
    case 'car':
      return '🚗'; // car
    default:
      return '📍';
  }
};

// Add this new constant for marker styling
const PLACE_MARKER_STYLE = {
  position: 'relative',
  width: '24px',
  height: '24px',
  transform: 'translate(-50%, -50%)'
};

// Update the marker component with a custom design
const PlaceMarker = ({ type, name, isActive }) => (
  <div style={PLACE_MARKER_STYLE}>
    <div className={`
      absolute w-4 h-4 rounded-full 
      ${type === 'railway' ? 'bg-blue-500' : 'bg-purple-500'}
      transform -translate-x-1/2 -translate-y-1/2
      before:content-[''] before:absolute before:w-full before:h-full 
      before:rounded-full before:bg-current before:animate-ping before:opacity-75
      after:content-[''] after:absolute after:w-2 after:h-2 
      after:rounded-full after:bg-white after:top-1 after:left-1
    `}>
    </div>
    {isActive && (
      <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap
        bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
        {name}
      </div>
    )}
  </div>
);

// Update the findIntersections function to handle undefined paths
const findIntersections = (routes) => {
  const intersections = new Map();
  
  routes.forEach((route1, i) => {
    // Check if route1 has valid path data
    if (!route1?.routes?.[0]?.overview_path) return;
    const path1 = route1.routes[0].overview_path;
    
    routes.forEach((route2, j) => {
      if (i >= j) return; // Avoid duplicate checks
      
      // Check if route2 has valid path data
      if (!route2?.routes?.[0]?.overview_path) return;
      const path2 = route2.routes[0].overview_path;
      
      // Sample points to reduce computation (check every 10th point)
      for (let index1 = 0; index1 < path1.length; index1 += 10) {
        for (let index2 = 0; index2 < path2.length; index2 += 10) {
          const point1 = path1[index1];
          const point2 = path2[index2];
          
          try {
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
              point1,
              point2
            );
            
            // If points are within 100 meters, consider it an intersection
            if (distance < 100) {
              const key = `${point1.lat()},${point1.lng()}`;
              if (!intersections.has(key)) {
                intersections.set(key, {
                  position: { lat: point1.lat(), lng: point1.lng() },
                  routes: []
                });
              }
              
              const intersection = intersections.get(key);
              if (!intersection.routes.includes(i)) intersection.routes.push(i);
              if (!intersection.routes.includes(j)) intersection.routes.push(j);
              
              // Break inner loop once intersection is found
              break;
            }
          } catch (error) {
            console.warn('Error calculating intersection:', error);
            continue;
          }
        }
      }
    });
  });
  
  return Array.from(intersections.values());
};

// Add this component for visualizing intersections
const TrafficMergePoint = ({ position, routes, sources }) => {
  // Calculate combined traffic at this intersection
  const totalTraffic = routes.reduce((sum, routeIndex) => {
    const source = sources[routeIndex];
    return sum + (source.count * source.paxPerUnit);
  }, 0);

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div className="relative">
        <div className="absolute -translate-x-1/2 -translate-y-1/2
          w-6 h-6 rounded-full bg-yellow-500 animate-pulse opacity-75">
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2
          bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white
          whitespace-nowrap mt-4">
          Merge Point: {formatNumber(totalTraffic)} pax/hr
        </div>
      </div>
    </OverlayView>
  );
};

// Add these constants for vehicle flow visualization
const VEHICLE_SPACING = 2000; // meters between vehicles
const MIN_VEHICLES = 3; // minimum vehicles to show per route
const MAX_VEHICLES = 15; // maximum vehicles to show per route

// Add these constants for time scaling
const TIME_SCALE = {
  bus: {
    simulationMinute: 45, // 45 minutes simulation per real hour
    averageSpeed: 45 // km/h
  },
  car: {
    simulationMinute: 30, // 30 minutes simulation per real hour
    averageSpeed: 55 // km/h
  }
};

// Update the VehicleMarker component to use our new icons
const VehicleMarker = ({ position, type }) => {
  const IconComponent = {
    bus: BusIcon,
    car: CarIcon
  }[type];

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div className="relative">
        <div className="relative transform -translate-x-1/2 -translate-y-1/2">
          <IconComponent 
            className={`w-8 h-8 ${
              type === 'bus' ? 'text-green-500' : 
              'text-purple-500'
            }`} 
          />
          {/* Pulse effect */}
          <div
            className="absolute -inset-1 rounded-full animate-ping opacity-30"
            style={{ 
              backgroundColor: 
                type === 'bus' ? '#22c55e' : 
                '#a855f7'
            }}
          />
          {/* Add count indicator for cars */}
          {type === 'car' && (
            <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-1 rounded-full">
              ×100
            </div>
          )}
        </div>
      </div>
    </OverlayView>
  );
};

// Define parking areas around Puri from different directions
const parkingAreas = {
  bhubaneswar: [
    { id: 'bhubaneswar-p1', name: 'Bhubaneswar Gate P1', capacity: 500, available: 500, distance: 1.5, vehicles: [] },
    { id: 'bhubaneswar-p2', name: 'Bhubaneswar Highway P2', capacity: 750, available: 750, distance: 3.2, vehicles: [] },
    { id: 'bhubaneswar-p3', name: 'Bhubaneswar Outer P3', capacity: 1000, available: 1000, distance: 5.8, vehicles: [] },
  ],
  konark: [
    { id: 'konark-p1', name: 'Konark Gate P1', capacity: 600, available: 600, distance: 2.0, vehicles: [] },
    { id: 'konark-p2', name: 'Konark Highway P2', capacity: 800, available: 800, distance: 4.0, vehicles: [] },
    { id: 'konark-p3', name: 'Konark Outer P3', capacity: 1200, available: 1200, distance: 6.5, vehicles: [] },
  ],
  brahmagiri: [
    { id: 'brahmagiri-p1', name: 'Brahmagiri Gate P1', capacity: 450, available: 450, distance: 1.8, vehicles: [] },
    { id: 'brahmagiri-p2', name: 'Brahmagiri Highway P2', capacity: 700, available: 700, distance: 3.5, vehicles: [] },
    { id: 'brahmagiri-p3', name: 'Brahmagiri Outer P3', capacity: 950, available: 950, distance: 5.2, vehicles: [] },
  ],
  satapada: [
    { id: 'satapada-p1', name: 'Satapada Gate P1', capacity: 400, available: 400, distance: 2.2, vehicles: [] },
    { id: 'satapada-p2', name: 'Satapada Highway P2', capacity: 650, available: 650, distance: 4.5, vehicles: [] },
    { id: 'satapada-p3', name: 'Satapada Outer P3', capacity: 900, available: 900, distance: 7.0, vehicles: [] },
  ],
};

// Add this function near the top of the component
const getParkingPosition = (direction, distance) => {
  const center = PURI_VIEW.center;
  let bearing;
  
  // Set direction angles in degrees (Bhubaneswar is Northwest, Konark Northeast, Brahmagiri South, Satapada Southwest)
  switch(direction) {
    case 'bhubaneswar': bearing = 315; break; // Northwest
    case 'konark': bearing = 45; break;       // Northeast
    case 'brahmagiri': bearing = 180; break;  // South
    case 'satapada': bearing = 225; break;    // Southwest
    default: bearing = 0;
  }
  
  // Convert to radians
  const bearingRad = (bearing * Math.PI) / 180;
  
  // Calculate offset (rough approximation based on Equirectangular projection)
  const earthRadius = 6371; // km
  const latRad = center.lat * Math.PI / 180;
  
  // Calculate new point
  const newLat = center.lat + (distance * Math.cos(bearingRad) / earthRadius) * (180 / Math.PI);
  const newLng = center.lng + (distance * Math.sin(bearingRad) / earthRadius) * (180 / Math.PI) / Math.cos(latRad);
  
  return { lat: newLat, lng: newLng };
};

const Planning = () => {
  const [objective, setObjective] = useState('');
  const [safetyLevel, setSafetyLevel] = useState(70);
  const [personnelCount, setPersonnelCount] = useState(500);
  const [crowdEstimate, setCrowdEstimate] = useState({
    total: 10000,
    distribution: {
      bus: 80,
      car: 10,
      plane: 10
    }
  });

  // Map center for Puri
  const center = { lat: 19.8077, lng: 85.8315 };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ["places", "visualization"]
  });

  const [showRoutes, setShowRoutes] = useState(true);
  const [showHeatZones, setShowHeatZones] = useState(true);

  const [activeTransportTab, setActiveTransportTab] = useState('bus');
  const [transportSources, setTransportSources] = useState({
    bus: [],
    car: []
  });

  // Calculate total passengers for display
  const totalPassengers = Object.values(transportSources).flat().reduce((acc, src) => 
    acc + (src.count * src.paxPerUnit), 0
  );

  const handleCrowdDistributionChange = (mode, value) => {
    setCrowdEstimate(prev => ({
      ...prev,
      distribution: {
        ...prev.distribution,
        [mode]: value
      }
    }));
  };

  const [clickPosition, setClickPosition] = useState(null);
  const [directions, setDirections] = useState(null);

  // Add this handler for the map click
  const handleMapClick = (e) => {
    setClickPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };

  // Update the calculateRoute function to store multiple routes
  const calculateRoute = async (source) => {
    if (!isLoaded) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    const jagannathTemple = { lat: 19.8077, lng: 85.8315 };

    try {
      const result = await directionsService.route({
        origin: source.location,
        destination: jagannathTemple,
        travelMode: window.google.maps.TravelMode.DRIVING
      });
      
      // Store the route with its source information
      setDirections(prev => ({
        ...prev,
        [source.place]: result
      }));
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  // Update the handleAddSourceFromMap function
  const handleAddSourceFromMap = (mode, source) => {
    setTransportSources(prev => ({
      ...prev,
      [mode]: [...prev[mode], source]
    }));
    calculateRoute(source); // Calculate route after adding source
    setClickPosition(null);
  };

  // Add a legend to show the traffic intensity scale
  const TrafficLegend = () => (
    <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 z-10">
      <h4 className="text-white text-sm font-medium mb-2">Traffic Intensity</h4>
      <div className="space-y-2">
        {[
          { color: '#22c55e', label: '< 5 Lakh', weight: 3 },
          { color: '#eab308', label: '5-20 Lakh', weight: 5 },
          { color: '#f97316', label: '20-50 Lakh', weight: 7 },
          { color: '#dc2626', label: '> 50 Lakh', weight: 9 },
        ].map(({ color, label, weight }) => (
          <div key={color} className="flex items-center gap-2">
            <div 
              className="w-8 h-0 rounded-full"
              style={{ 
                backgroundColor: color,
                height: `${weight}px`
              }} 
            />
            <span className="text-white/80 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Add zoom control state
  const [mapRef, setMapRef] = useState(null);

  // Add function to handle map zoom
  const handleZoomToPuri = () => {
    if (mapRef) {
      mapRef.panTo(PURI_VIEW.center);
      mapRef.setZoom(PURI_VIEW.zoom);
    }
  };

  // Add simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulationTime, setSimulationTime] = useState(0);
  const [accumulatedVehicles, setAccumulatedVehicles] = useState(new Map());

  // Move the handleSimulation function inside the component
  const handleSimulation = () => {
    if (!isSimulating) {
      setIsSimulating(true);
      setSimulationTime(0);
      
      const simulate = () => {
        setSimulationTime(prev => {
          const newTime = prev + (simulationSpeed / 60); // Convert to hours
          return newTime;
        });
      };

      const interval = setInterval(simulate, 1000 / simulationSpeed);
      return () => clearInterval(interval);
    } else {
      setIsSimulating(false);
    }
  };

  // Update the calculateVehiclePositions function inside the component
  const calculateVehiclePositions = (path, source, elapsedTime, travelTime) => {
    const positions = [];
    const pathLength = window.google.maps.geometry.spherical.computeLength(path);
    const timeScale = TIME_SCALE[activeTransportTab].simulationMinute;
    
    // Calculate how many vehicles should be on this route based on flow rate
    let vehiclesPerHour = source.flowRate;
    // If it's a car, divide by 100 since each icon represents 100 cars
    if (activeTransportTab === 'car') {
      vehiclesPerHour = Math.ceil(vehiclesPerHour / 100);
    }
    
    // Calculate for Rath Yatra capacity
    const totalTravelHours = travelTime / 60; // Convert minutes to hours
    const maxVehiclesOnRoute = Math.ceil(vehiclesPerHour * totalTravelHours);
    
    // Calculate vehicle positions based on dispatch times
    for (let i = 0; i < maxVehiclesOnRoute; i++) {
      const dispatchTime = i * (60 / vehiclesPerHour); // Minutes since first dispatch
      const vehicleElapsedTime = elapsedTime - dispatchTime;
      
      if (vehicleElapsedTime > 0 && vehicleElapsedTime < travelTime) {
        const progress = vehicleElapsedTime / travelTime;
        const pathIndex = Math.floor(progress * (path.length - 1));
        
        if (path[pathIndex]) {
          positions.push({
            position: {
              lat: path[pathIndex].lat(),
              lng: path[pathIndex].lng()
            },
            progress
          });
        }
      }
    }
    
    return positions;
  };

  const [simulationRunning, setSimulationRunning] = useState(false);
  const [parkingData, setParkingData] = useState(parkingAreas);
  const [vehicleCount, setVehicleCount] = useState({ bhubaneswar: 0, konark: 0, brahmagiri: 0, satapada: 0 });

  // Find available parking in a direction, prioritizing closest first
  const findAvailableParking = (direction) => {
    for (const parking of parkingData[direction]) {
      if (parking.available > 0) {
        return parking.id;
      }
    }
    return null; // All parking full
  };

  // Add vehicle to a parking area
  const addVehicleToParking = (direction) => {
    const parkingId = findAvailableParking(direction);
    if (!parkingId) return false; // All parking areas full
    
    setParkingData(prevData => {
      const newData = {...prevData};
      const parkingIndex = newData[direction].findIndex(p => p.id === parkingId);
      
      if (parkingIndex !== -1) {
        newData[direction][parkingIndex].available -= 1;
        newData[direction][parkingIndex].vehicles.push({
          id: `vehicle-${direction}-${Date.now()}`,
          arrivalTime: new Date().toLocaleTimeString(),
        });
      }
      
      return newData;
    });
    
    setVehicleCount(prev => ({
      ...prev,
      [direction]: prev[direction] + 1
    }));
    
    return true;
  };

  // Simulation effect
  useEffect(() => {
    if (!simulationRunning) return;
    
    const directions = ['bhubaneswar', 'konark', 'brahmagiri', 'satapada'];
    
    const interval = setInterval(() => {
      // Randomly select a direction and add a vehicle
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      addVehicleToParking(randomDirection);
    }, 2000 / simulationSpeed);
    
    return () => clearInterval(interval);
  }, [simulationRunning, simulationSpeed]);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex h-full gap-6">
        {/* Left Column - Controls */}
        <div className="w-96 h-full space-y-6 overflow-y-auto">
          {/* Crowd Distribution */}
          <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Rath Yatra Crowd Distribution</h3>
              <div className="text-sm">
                <span className="text-white/60">Total Devotees: </span>
                <span className="text-white font-medium">
                  {formatNumber(totalPassengers)}
                </span>
              </div>
            </div>
            
            {/* Transport Mode Tabs */}
            <div className="flex gap-2 mb-6">
              {transportModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setActiveTransportTab(mode.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${activeTransportTab === mode.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:bg-white/5'}`}
                >
                  <mode.Icon className="w-5 h-5" />
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Source Inputs for active transport mode */}
            <SourceInput
              sources={transportSources[activeTransportTab]}
              transportMode={activeTransportTab}
              onAdd={(source) => setTransportSources(prev => ({
                ...prev,
                [activeTransportTab]: [...prev[activeTransportTab], source]
              }))}
              onRemove={(index) => setTransportSources(prev => ({
                ...prev,
                [activeTransportTab]: prev[activeTransportTab].filter((_, i) => i !== index)
              }))}
            />

            {/* Add Parking Management Panel to the UI */}
            <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Rath Yatra Parking Areas</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSimulationRunning(!simulationRunning)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${simulationRunning ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-green-500/80 hover:bg-green-600/80'}`}
                  >
                    {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
                  </button>
                  <select 
                    value={simulationSpeed} 
                    onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                    className="bg-black/50 border border-white/20 rounded-lg text-sm px-2"
                  >
                    <option value={0.5}>0.5x Speed</option>
                    <option value={1}>1x Speed</option>
                    <option value={2}>2x Speed</option>
                    <option value={5}>5x Speed</option>
                  </select>
                </div>
              </div>
              
              {/* Parking Status Display */}
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {Object.entries(parkingData).map(([direction, parkingList]) => (
                  <div key={direction} className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <h4 className="font-medium text-blue-400 flex items-center gap-2 mb-2">
                      <FaRoad /> {direction.charAt(0).toUpperCase() + direction.slice(1)} Route 
                      <span className="ml-2 text-xs bg-blue-500/30 px-2 py-0.5 rounded-full">
                        {vehicleCount[direction]} vehicles
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {parkingList.map((parking) => (
                        <div key={parking.id} className="bg-black/20 rounded-md p-2 text-xs">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FaParking className={`
                                ${parking.available === 0 
                                  ? 'text-red-400' 
                                  : parking.available < parking.capacity * 0.2 
                                    ? 'text-orange-400' 
                                    : 'text-green-400'}
                              `} />
                              <span>{parking.name}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${parking.available === 0 ? 'bg-red-500/30' : 'bg-green-500/30'}`}>
                              {parking.available}/{parking.capacity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Map with Command Bar */}
        <div className="flex-1 flex flex-col">
          {/* Command Bar */}
          <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* Safety Level */}
                <div className="flex items-center gap-4 flex-1 max-w-md hidden">
                  <h3 className="text-white font-medium whitespace-nowrap">Safety Level</h3>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={safetyLevel}
                      onChange={(e) => setSafetyLevel(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white/60 w-12 text-right">{safetyLevel}%</span>
                  </div>
                </div>

                {/* Personnel Count */}
                <div className="flex items-center gap-4 flex-1 max-w-md hidden">
                  <h3 className="text-white font-medium whitespace-nowrap">Personnel</h3>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={personnelCount}
                      onChange={(e) => setPersonnelCount(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white/60 w-16 text-right">{personnelCount}</span>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleZoomToPuri}
                    className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm
                      bg-white/5 hover:bg-white/10 text-white"
                  >
                    <FaMapMarkerAlt className="text-lg" />
                    Zoom to Puri
                  </button>

                  {/* Add Simulation Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSimulation}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm
                        ${isSimulating ? 'bg-red-500/20 text-red-400' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                    >
                      {isSimulating ? (
                        <>
                          <FaStop className="text-lg" />
                          Stop
                        </>
                      ) : (
                        <>
                          <FaPlay className="text-lg" />
                          Simulate
                        </>
                      )}
                    </button>
                    
                    {/* Speed Control */}
                    <select
                      value={simulationSpeed}
                      onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                      className="bg-white/5 text-white text-sm rounded-lg px-2 py-1.5"
                    >
                      <option value={1}>1x</option>
                      <option value={5}>5x</option>
                      <option value={10}>10x</option>
                      <option value={60}>60x</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowRoutes(!showRoutes)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm
                      ${showRoutes ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    <FaRoute className="text-lg" />
                    Routes
                  </button>
                  <button
                    onClick={() => setShowHeatZones(!showHeatZones)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm
                      ${showHeatZones ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    <FaUsers className="text-lg" />
                    Heat Zones
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 bg-white/[0.02] backdrop-blur-sm rounded-xl overflow-hidden relative">
            {isLoaded ? (
              <>
                <GoogleMap
                  mapContainerClassName="w-full h-full"
                  center={PURI_VIEW.center}
                  zoom={PURI_VIEW.zoom}
                  onLoad={map => setMapRef(map)}
                  options={{
                    styles: mapStyles,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true
                  }}
                  onClick={handleMapClick}
                >
                  {/* Jagannath Temple Marker */}
                  <OverlayView
                    key="jagannath-temple"
                    position={{ lat: 19.8077, lng: 85.8315 }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="cursor-pointer group">
                      <PlaceMarker 
                        type="temple"
                        name="Jagannath Temple"
                        isActive={true}
                      />
                    </div>
                  </OverlayView>

                  {/* Puri Railway Station Marker */}
                  <OverlayView
                    key="puri-railway"
                    position={{ lat: 19.8124, lng: 85.8287 }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="cursor-pointer group">
                      <PlaceMarker 
                        type="railway"
                        name="Puri Railway Station"
                        isActive={false}
                      />
                    </div>
                  </OverlayView>

                  {/* Puri Beach Marker */}
                  <OverlayView
                    key="puri-beach"
                    position={{ lat: 19.7980, lng: 85.8310 }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="cursor-pointer group">
                      <PlaceMarker 
                        type="city"
                        name="Puri Beach"
                        isActive={false}
                      />
                    </div>
                  </OverlayView>

                  {/* Grand Road Marker */}
                  <OverlayView
                    key="grand-road"
                    position={{ lat: 19.8075, lng: 85.8240 }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="cursor-pointer group">
                      <PlaceMarker 
                        type="city"
                        name="Grand Road"
                        isActive={false}
                      />
                    </div>
                  </OverlayView>

                  {/* Gundicha Temple Marker */}
                  <OverlayView
                    key="gundicha-temple"
                    position={{ lat: 19.8090, lng: 85.8180 }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="cursor-pointer group">
                      <PlaceMarker 
                        type="temple"
                        name="Gundicha Temple"
                        isActive={false}
                      />
                    </div>
                  </OverlayView>

                  {/* Render directions */}
                  {directions && Object.entries(directions).map(([place, route], index) => {
                    const source = transportSources[activeTransportTab].find(s => s.place === place);
                    if (!source || !route?.routes?.[0]?.overview_path?.length) return null;
                    
                    const path = route.routes[0].overview_path;
                    const travelTime = route.routes[0].legs[0].duration.value / 60; // in minutes
                    
                    // Calculate vehicle positions with real-time consideration
                    const vehicles = calculateVehiclePositions(
                      path,
                      source,
                      simulationTime,
                      travelTime
                    );

                    return (
                      <React.Fragment key={`${place}-${index}`}>
                        <DirectionsRenderer
                          directions={route}
                          options={{
                            polylineOptions: {
                              strokeColor: activeTransportTab === 'bus' ? '#22c55e' : '#a855f7',
                              strokeWeight: 2,
                              strokeOpacity: 0.6
                            },
                            suppressMarkers: true,
                          }}
                        />
                        
                        {/* Render vehicles with proper timing */}
                        {isSimulating && vehicles.map((vehicle, vIndex) => (
                          <VehicleMarker
                            key={`${place}-vehicle-${vIndex}`}
                            position={vehicle.position}
                            type={activeTransportTab}
                          />
                        ))}
                        
                        {/* Source label */}
                        <RouteLabel 
                          position={{ lat: path[0].lat(), lng: path[0].lng() }}
                          count={source.count * source.paxPerUnit}
                          source={source}
                        />
                      </React.Fragment>
                    );
                  })}

                  {/* Add Parking Area Visualization on the map */}
                  {Object.entries(parkingData).map(([direction, parkingList]) => 
                    parkingList.map((parking) => (
                      <OverlayView
                        key={parking.id}
                        position={getParkingPosition(direction, parking.distance)}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div className="cursor-pointer group">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                            ${parking.available === 0 
                              ? 'bg-red-500/80' 
                              : parking.available < parking.capacity * 0.2 
                                ? 'bg-orange-500/80' 
                                : 'bg-green-500/80'} 
                            border-2 border-white/50 text-white`}>
                            <FaParking className="text-lg" />
                          </div>
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                            bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white
                            min-w-[120px] text-center z-10">
                            <div className="font-medium">{parking.name}</div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>{parking.capacity - parking.available} vehicles</span>
                              <span>{(parking.available / parking.capacity * 100).toFixed(0)}% free</span>
                            </div>
                          </div>
                        </div>
                      </OverlayView>
                    ))
                  )}
                </GoogleMap>

                {/* Move the popup outside of GoogleMap but inside the container */}
                {clickPosition && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="pointer-events-auto">
                      <AddSourcePopup
                        position={clickPosition}
                        onAdd={handleAddSourceFromMap}
                        onClose={() => setClickPosition(null)}
                      />
                    </div>
                  </div>
                )}

                <TrafficLegend />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white">Loading map...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Planning;