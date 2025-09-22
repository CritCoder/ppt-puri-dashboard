import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView, Polyline } from '@react-google-maps/api';
import { BiSearch, BiCurrentLocation, BiFilterAlt, BiAnalyse } from 'react-icons/bi';
import { BsTrash, BsTrashFill, BsRecycle, BsExclamationTriangle } from 'react-icons/bs';
import { MdCleaningServices, MdOutlineWaterDrop, MdWarning } from 'react-icons/md';
import { FaTruck, FaRecycle, FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useGoogleMaps } from '../../../utils/mapsConfig';

const PR = () => {
  const { isLoaded, loadError } = useGoogleMaps();

  const [mapCenter, setMapCenter] = useState({ lat: 19.8077, lng: 85.8315 });
  const [zoom, setZoom] = useState(14);
  const [selectedBins, setSelectedBins] = useState([]);
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);

  // Create the arrow icon for route paths
  const getRouteOptions = useCallback((color) => {
    if (!isLoaded) return {}; // Return empty object if maps not loaded yet
    
    return {
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 4,
      icons: mapRef ? [
        {
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
          },
          offset: '30px',
          repeat: '100px'
        }
      ] : []
    };
  }, [isLoaded, mapRef]);

  // Waste bins and collection points
  const wasteBins = [
    // Temple and surrounding areas
    { id: 1, name: 'Jagannath Temple East Gate', location: { lat: 19.8080, lng: 85.8320 }, status: 'normal', type: 'mixed', fillLevel: 45 },
    { id: 2, name: 'Jagannath Temple North Gate', location: { lat: 19.8085, lng: 85.8315 }, status: 'full', type: 'mixed', fillLevel: 85 },
    { id: 3, name: 'Temple Park Entrance', location: { lat: 19.8075, lng: 85.8325 }, status: 'normal', type: 'recyclable', fillLevel: 50 },
    
    // Market areas
    { id: 4, name: 'Grand Road Market South', location: { lat: 19.8070, lng: 85.8245 }, status: 'full', type: 'mixed', fillLevel: 90 },
    { id: 5, name: 'Grand Road Market Center', location: { lat: 19.8075, lng: 85.8240 }, status: 'attention', type: 'mixed', fillLevel: 70 },
    { id: 6, name: 'Grand Road Market North', location: { lat: 19.8080, lng: 85.8235 }, status: 'normal', type: 'recyclable', fillLevel: 60 },
    
    // Beach areas
    { id: 7, name: 'Swargadwar Beach Entrance', location: { lat: 19.8000, lng: 85.8300 }, status: 'attention', type: 'mixed', fillLevel: 75 },
    { id: 8, name: 'Golden Beach Main Path', location: { lat: 19.7980, lng: 85.8310 }, status: 'full', type: 'mixed', fillLevel: 95 },
    { id: 9, name: 'Beach Food Court', location: { lat: 19.7970, lng: 85.8305 }, status: 'attention', type: 'food', fillLevel: 80 },
    
    // Urban areas
    { id: 10, name: 'Puri Bus Station', location: { lat: 19.8090, lng: 85.8270 }, status: 'normal', type: 'mixed', fillLevel: 55 },
    { id: 11, name: 'Railway Station Plaza', location: { lat: 19.8124, lng: 85.8287 }, status: 'attention', type: 'recyclable', fillLevel: 65 },
    { id: 12, name: 'Central Hospital', location: { lat: 19.8110, lng: 85.8250 }, status: 'normal', type: 'medical', fillLevel: 40 },
    
    // Residential areas
    { id: 13, name: 'Marine Drive Junction', location: { lat: 19.8020, lng: 85.8520 }, status: 'normal', type: 'mixed', fillLevel: 30 },
    { id: 14, name: 'School Zone Collection Point', location: { lat: 19.8040, lng: 85.8280 }, status: 'normal', type: 'recyclable', fillLevel: 25 },
    { id: 15, name: 'Hotel Zone Collection Point', location: { lat: 19.8010, lng: 85.8290 }, status: 'full', type: 'mixed', fillLevel: 95 },
  ];

  // Collection vehicles
  const collectionVehicles = [
    { id: 'v1', name: 'Truck 101', location: { lat: 19.8050, lng: 85.8290 }, status: 'en-route', fillLevel: 60, type: 'general' },
    { id: 'v2', name: 'Truck 102', location: { lat: 19.8100, lng: 85.8320 }, status: 'collecting', fillLevel: 80, type: 'general' },
    { id: 'v3', name: 'Recycling Van 1', location: { lat: 19.8020, lng: 85.8270 }, status: 'returning', fillLevel: 90, type: 'recycling' },
  ];

  // Collection routes
  const collectionRoutes = [
    {
      id: 'route1',
      name: 'Temple Zone Route',
      path: [
        { lat: 19.8080, lng: 85.8320 },
        { lat: 19.8085, lng: 85.8315 },
        { lat: 19.8075, lng: 85.8325 },
        { lat: 19.8050, lng: 85.8290 }
      ],
      color: '#4CAF50'
    },
    {
      id: 'route2',
      name: 'Market Zone Route',
      path: [
        { lat: 19.8070, lng: 85.8245 },
        { lat: 19.8075, lng: 85.8240 },
        { lat: 19.8080, lng: 85.8235 },
        { lat: 19.8100, lng: 85.8320 }
      ],
      color: '#2196F3'
    },
    {
      id: 'route3',
      name: 'Beach Zone Route',
      path: [
        { lat: 19.8000, lng: 85.8300 },
        { lat: 19.7980, lng: 85.8310 },
        { lat: 19.7970, lng: 85.8305 },
        { lat: 19.8020, lng: 85.8270 }
      ],
      color: '#FF9800'
    }
  ];

  // Sanitation metrics
  const sanitationMetrics = [
    { 
      id: 'waste-collection', 
      title: 'Waste Collection', 
      metric: '92%', 
      trend: '+3%', 
      status: 'positive',
      description: 'Percentage of scheduled collections completed'
    },
    { 
      id: 'recycling-rate', 
      title: 'Recycling Rate', 
      metric: '38%', 
      trend: '+5%', 
      status: 'positive',
      description: 'Percentage of waste diverted from landfill'
    },
    { 
      id: 'bin-overflow', 
      title: 'Bin Overflow Incidents', 
      metric: '7', 
      trend: '-2', 
      status: 'positive',
      description: 'Number of reported overflowing bins in last 24h'
    },
    { 
      id: 'response-time', 
      title: 'Avg. Response Time', 
      metric: '45 min', 
      trend: '-10 min', 
      status: 'positive',
      description: 'Average time to address sanitation complaints'
    },
  ];

  // Sanitation hotspots (areas with cleanliness issues)
  const sanitationHotspots = [
    { 
      id: 'h1', 
      name: 'Grand Road Market', 
      description: 'Littering issues during peak hours', 
      severity: 'high',
      location: { lat: 19.8075, lng: 85.8240 }
    },
    { 
      id: 'h2', 
      name: 'Beach Food Court', 
      description: 'Food waste management issues', 
      severity: 'medium',
      location: { lat: 19.7970, lng: 85.8305 }
    },
    { 
      id: 'h3', 
      name: 'Bus Station Exit', 
      description: 'Irregular cleaning schedule', 
      severity: 'low',
      location: { lat: 19.8095, lng: 85.8275 }
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'bg-green-500';
      case 'attention': return 'bg-yellow-500';
      case 'full': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'recyclable': return BsRecycle;
      case 'food': return MdCleaningServices;
      case 'medical': return MdOutlineWaterDrop;
      default: return BsTrash;
    }
  };

  const getBinIcon = (bin) => {
    const isSelected = selectedBins.includes(bin.id);
    const Icon = bin.status === 'full' ? BsTrashFill : BsTrash;
    const statusColor = getStatusColor(bin.status);
    
    return (
      <motion.div
        className="relative cursor-pointer"
        onClick={() => {
          setSelectedBins(prev => 
            prev.includes(bin.id) 
              ? prev.filter(id => id !== bin.id)
              : [...prev, bin.id]
          );
        }}
        whileHover={{ scale: 1.1 }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center
          backdrop-blur-sm border-2 ${
            isSelected ? 'bg-purple-500 border-purple-500' : `${statusColor} border-white/50`
          }`}
        >
          <Icon className={`text-2xl ${isSelected ? 'text-white' : 'text-white'}`} />
          
          {/* Fill level indicator */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                bin.fillLevel > 80 ? 'bg-red-500' : 
                bin.fillLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`} 
              style={{ width: `${bin.fillLevel}%` }}
            />
          </div>
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

  const VehicleMarker = ({ vehicle }) => {
    const Icon = vehicle.type === 'recycling' ? FaRecycle : FaTruck;
    
    return (
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 border-2 border-white shadow-lg">
          <Icon className="text-2xl text-white" />
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
          {vehicle.name} ({vehicle.status})
        </div>
      </motion.div>
    );
  };

  const HotspotMarker = ({ hotspot }) => {
    const getSeverityColor = (severity) => {
      switch(severity) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-orange-500';
        default: return 'bg-gray-500';
      }
    };
    
    return (
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getSeverityColor(hotspot.severity)} border-2 border-white shadow-lg`}>
          <BsExclamationTriangle className="text-2xl text-white" />
        </div>
      </motion.div>
    );
  };

  const AnalyticsModal = ({ isOpen, onClose }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/80 border border-white/10 rounded-xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-white">Waste & Sanitation Analytics</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <IoCloseCircle className="text-2xl" />
                </button>
              </div>

              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {sanitationMetrics.map(metric => (
                  <div key={metric.id} className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm text-gray-400 mb-1">{metric.title}</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">{metric.metric}</span>
                      <span className={`text-sm font-medium ${
                        metric.status === 'positive' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.trend}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                ))}
              </div>

              {/* Collection Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Collection by Waste Type */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-3">Collection by Waste Type</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <BsTrash className="text-gray-400" />
                          <span className="text-white">General Waste</span>
                        </span>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                      <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gray-500" style={{ width: '62%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <BsRecycle className="text-green-400" />
                          <span className="text-white">Recyclables</span>
                        </span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-500" style={{ width: '28%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MdCleaningServices className="text-orange-400" />
                          <span className="text-white">Organic Waste</span>
                        </span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collection by Zone */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-3">Collection by Zone</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Temple Zone</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500" style={{ width: '35%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Market Zone</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: '30%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Beach Zone</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-yellow-500" style={{ width: '25%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Residential Zone</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const handleMapLoad = (map) => {
    setMapRef(map);
  };

  const filterBins = (bins) => {
    if (activeFilters.includes('all')) return bins;
    
    return bins.filter(bin => {
      // Filter by status
      if (activeFilters.includes('full') && bin.status === 'full') return true;
      if (activeFilters.includes('attention') && bin.status === 'attention') return true;
      if (activeFilters.includes('normal') && bin.status === 'normal') return true;
      
      // Filter by type
      if (activeFilters.includes('mixed') && bin.type === 'mixed') return true;
      if (activeFilters.includes('recyclable') && bin.type === 'recyclable') return true;
      
      return false;
    });
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => {
      if (filter === 'all') {
        return ['all'];
      }
      
      const newFilters = prev.filter(f => f !== 'all' && f !== filter);
      if (!prev.includes(filter)) {
        newFilters.push(filter);
      }
      
      return newFilters.length ? newFilters : ['all'];
    });
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
        {/* Search and Filter Controls */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-96">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for waste collection points..."
                className="w-full px-4 py-3 bg-black/50 backdrop-blur-md border border-white/10 
                  rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-green-500/50"
              />
              <BiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <motion.button
              className="px-4 py-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const dropdownMenu = document.getElementById('filter-dropdown');
                if (dropdownMenu) {
                  dropdownMenu.classList.toggle('hidden');
                }
              }}
            >
              <BiFilterAlt className="text-xl" />
            </motion.button>
            <motion.button
              className="px-4 py-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(true)}
            >
              <BiAnalyse className="text-xl" />
            </motion.button>
          </div>
          
          {/* Filter Dropdown */}
          <div 
            id="filter-dropdown" 
            className="absolute mt-2 w-56 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-2 hidden z-50"
          >
            <div className="space-y-1">
              <button 
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  activeFilters.includes('all') ? 'bg-green-500/20 text-green-500' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => toggleFilter('all')}
              >
                All Bins
              </button>
              
              <div className="px-3 py-1 text-xs text-gray-400">Status</div>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  activeFilters.includes('full') ? 'bg-red-500/20 text-red-500' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => toggleFilter('full')}
              >
                Full
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  activeFilters.includes('attention') ? 'bg-yellow-500/20 text-yellow-500' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => toggleFilter('attention')}
              >
                Needs Attention
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  activeFilters.includes('normal') ? 'bg-green-500/20 text-green-500' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => toggleFilter('normal')}
              >
                Normal
              </button>
              
              <div className="px-3 py-1 text-xs text-gray-400">Type</div>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  activeFilters.includes('mixed') ? 'bg-blue-500/20 text-blue-500' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => toggleFilter('mixed')}
              >
                General Waste
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  activeFilters.includes('recyclable') ? 'bg-green-500/20 text-green-500' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => toggleFilter('recyclable')}
              >
                Recyclables
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Routes Button */}
        <motion.button
          className="absolute top-6 right-6 z-10 px-6 py-3 bg-blue-500 text-white 
            rounded-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRoutes(!showRoutes)}
        >
          <FaTruck className="text-xl" />
          {showRoutes ? 'Hide Routes' : 'Show Routes'}
        </motion.button>

        {/* Selected Bins Info */}
        {selectedBins.length > 0 && (
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 
              bg-black/70 backdrop-blur-md border border-white/10 rounded-lg p-4 w-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white font-medium mb-2">Selected Collection Points ({selectedBins.length})</h3>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {selectedBins.map(id => {
                const bin = wasteBins.find(bin => bin.id === id);
                if (!bin) return null;
                
                const TypeIcon = getTypeIcon(bin.type);
                
                return (
                  <div key={id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(bin.status)}`} />
                      <span className="text-white text-sm">{bin.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TypeIcon className="text-gray-400" />
                      <span className={`text-sm font-medium ${
                        bin.fillLevel > 80 ? 'text-red-500' : 
                        bin.fillLevel > 60 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {bin.fillLevel}% full
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={mapCenter}
          zoom={zoom}
          onLoad={handleMapLoad}
          options={{
            styles: [
              {
                "elementType": "geometry",
                "stylers": [{ "color": "#242f3e" }]
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
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#d59563" }]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#d59563" }]
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
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": "#38414e" }]
              },
              {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#212a37" }]
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
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#1f2835" }]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#f3d19c" }]
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
              }
            ],
            disableDefaultUI: true,
            minZoom: 7,
            maxZoom: 19
          }}
        >
          {/* Collection Routes */}
          {showRoutes && collectionRoutes.map(route => (
            <Polyline
              key={route.id}
              path={route.path}
              options={getRouteOptions(route.color)}
            />
          ))}

          {/* Waste Bins */}
          {filterBins(wasteBins).map(bin => (
            <OverlayView
              key={bin.id}
              position={bin.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              {getBinIcon(bin)}
            </OverlayView>
          ))}

          {/* Collection Vehicles */}
          {collectionVehicles.map(vehicle => (
            <OverlayView
              key={vehicle.id}
              position={vehicle.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <VehicleMarker vehicle={vehicle} />
            </OverlayView>
          ))}

          {/* Sanitation Hotspots */}
          {sanitationHotspots.map(hotspot => (
            <OverlayView
              key={hotspot.id}
              position={hotspot.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <HotspotMarker hotspot={hotspot} />
            </OverlayView>
          ))}
        </GoogleMap>

        <AnalyticsModal 
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      </div>
    </motion.div>
  );
};

export default PR; 