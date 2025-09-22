import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, HeatmapLayer, TrafficLayer } from '@react-google-maps/api';
import { 
  FaUsers, FaExclamationTriangle, FaRoute, FaChartLine, FaVideo, FaTrash, FaShieldAlt,
  FaEye, FaThermometerHalf, FaClock, FaMapMarkerAlt, FaCog, FaBell, FaDownload,
  FaPlay, FaPause, FaExpand, FaCompress, FaFilter, FaSearch, FaHistory,
  FaUserFriends, FaWalking, FaCar, FaBus, FaMotorcycle, FaBicycle,
  FaTemperatureHigh, FaWind, FaCloudRain, FaSun, FaMoon,
  FaCamera, FaMicrophone, FaWifi, FaSignal, FaBatteryFull,
  FaExclamationCircle, FaCheckCircle, FaTimesCircle, FaInfoCircle
} from 'react-icons/fa';
import ReactApexChart from 'react-apexcharts';

const Monitoring = () => {
  const [activeMode, setActiveMode] = useState('crowd');
  const [isLive, setIsLive] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  
  // Comprehensive monitoring data
  const [monitoringData, setMonitoringData] = useState({
    crowd: {
      total: 12500,
      density: 75,
      flow: 850,
      distribution: {
        'Main Gate': 3200,
        'East Gate': 2800,
        'West Gate': 2100,
        'North Gate': 1800,
        'South Gate': 1500,
        'Inner Sanctum': 1100
      },
      demographics: {
        '0-18': 15,
        '18-35': 35,
        '35-50': 25,
        '50-65': 15,
        '65+': 10
      },
      movement: {
        'Entering': 450,
        'Exiting': 380,
        'Stationary': 320,
        'Circulating': 280
      },
      alerts: [
        { id: 1, type: 'density', location: 'Main Gate', message: 'High crowd density detected', severity: 'high', time: '2 mins ago' },
        { id: 2, type: 'flow', location: 'East Gate', message: 'Slow movement detected', severity: 'medium', time: '5 mins ago' },
        { id: 3, type: 'safety', location: 'Inner Sanctum', message: 'Potential bottleneck forming', severity: 'high', time: '1 min ago' }
      ]
    },
    sanitation: {
      totalBins: 45,
      fullBins: 12,
      cleaningInProgress: 8,
      wasteCollected: 1250,
      cleanlinessScore: 87,
      areas: [
        { name: 'Main Gate Area', cleanliness: 92, lastCleaned: '30 mins ago', bins: { total: 8, full: 1 } },
        { name: 'East Gate Area', cleanliness: 85, lastCleaned: '45 mins ago', bins: { total: 6, full: 2 } },
        { name: 'West Gate Area', cleanliness: 89, lastCleaned: '20 mins ago', bins: { total: 7, full: 1 } },
        { name: 'North Gate Area', cleanliness: 78, lastCleaned: '1 hour ago', bins: { total: 5, full: 3 } },
        { name: 'South Gate Area', cleanliness: 91, lastCleaned: '15 mins ago', bins: { total: 6, full: 0 } },
        { name: 'Inner Sanctum', cleanliness: 95, lastCleaned: '10 mins ago', bins: { total: 4, full: 0 } },
        { name: 'Parking Area', cleanliness: 82, lastCleaned: '1.5 hours ago', bins: { total: 9, full: 5 } }
      ],
      alerts: [
        { id: 1, type: 'waste', location: 'Parking Area', message: 'Multiple bins at capacity', severity: 'high', time: '3 mins ago' },
        { id: 2, type: 'cleaning', location: 'North Gate', message: 'Cleaning overdue', severity: 'medium', time: '10 mins ago' }
      ]
    },
    event: {
      totalPersonnel: 156,
      activePersonnel: 142,
      incidents: 3,
      responseTime: 2.3,
      security: {
        'CCTV Cameras': { total: 45, active: 43, issues: 2 },
        'Security Personnel': { total: 28, active: 26, issues: 2 },
        'Metal Detectors': { total: 8, active: 8, issues: 0 },
        'Emergency Exits': { total: 12, active: 12, issues: 0 }
      },
      law: {
        'Traffic Violations': 12,
        'Public Disturbances': 3,
        'Unauthorized Access': 1,
        'Medical Emergencies': 2
      },
      operations: {
        'Food Stalls': { total: 25, active: 24, issues: 1 },
        'Parking Management': { total: 8, active: 8, issues: 0 },
        'Crowd Control': { total: 15, active: 14, issues: 1 },
        'Medical Aid': { total: 6, active: 6, issues: 0 }
      },
      alerts: [
        { id: 1, type: 'security', location: 'Main Gate', message: 'CCTV camera offline', severity: 'medium', time: '5 mins ago' },
        { id: 2, type: 'law', location: 'East Gate', message: 'Traffic violation reported', severity: 'low', time: '8 mins ago' },
        { id: 3, type: 'medical', location: 'Inner Sanctum', message: 'Medical assistance requested', severity: 'high', time: '2 mins ago' }
      ]
    }
  });

  const [timeSeriesData, setTimeSeriesData] = useState({
    density: [],
    flow: [],
    cleanliness: [],
    incidents: []
  });

  const center = { lat: 19.8077, lng: 85.8315 }; // Puri center

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ["visualization"]
  });

  // Generate comprehensive time series data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const newDensityPoint = {
        x: now.getTime(),
        y: Math.floor(Math.random() * 30) + 60
      };
      const newFlowPoint = {
        x: now.getTime(),
        y: Math.floor(Math.random() * 500) + 500
      };
      const newCleanlinessPoint = {
        x: now.getTime(),
        y: Math.floor(Math.random() * 20) + 80
      };
      const newIncidentPoint = {
        x: now.getTime(),
        y: Math.floor(Math.random() * 5)
      };

      setTimeSeriesData(prev => ({
        density: [...prev.density.slice(-20), newDensityPoint],
        flow: [...prev.flow.slice(-20), newFlowPoint],
        cleanliness: [...prev.cleanliness.slice(-20), newCleanlinessPoint],
        incidents: [...prev.incidents.slice(-20), newIncidentPoint]
      }));
    };

    const interval = setInterval(generateData, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    chart: {
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      strokeDashArray: 4
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#718096'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#718096'
        }
      }
    },
    theme: {
      mode: 'dark'
    }
  };

  return (
    <motion.div
      className="h-full p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex h-full gap-6">
        {/* Left Panel - Stats & Charts */}
        <div className="w-96 space-y-6">
          {/* Current Stats */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-medium mb-4">Current Status</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-blue-400" />
                  <span className="text-sm text-gray-400">Total Crowd</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {monitoringData.crowd.total.toLocaleString()}
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaChartLine className="text-green-400" />
                  <span className="text-sm text-gray-400">Flow Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {monitoringData.crowd.flow}/hr
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-medium mb-4">Density Trend</h3>
            <ReactApexChart
              options={chartOptions}
              series={[{ name: 'Density', data: timeSeriesData.density }]}
              type="line"
              height={200}
            />
          </div>

          {/* Alerts */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-medium mb-4">Active Alerts</h3>
            <div className="space-y-3">
              {monitoringData.crowd.alerts.map(alert => (
                <div 
                  key={alert.id}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FaExclamationTriangle className="text-red-400" />
                    <span className="text-sm font-medium text-white">{alert.location}</span>
                  </div>
                  <p className="text-sm text-gray-400">{alert.message}</p>
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
                data={[
                  { location: new window.google.maps.LatLng(23.1825, 75.7687), weight: 0.8 },
                  { location: new window.google.maps.LatLng(23.1712, 75.7879), weight: 0.5 },
                  { location: new window.google.maps.LatLng(23.1789, 75.7843), weight: 0.7 }
                ]}
                options={{
                  radius: 20,
                  opacity: 0.7
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

export default Monitoring; 