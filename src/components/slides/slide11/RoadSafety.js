import { useState } from 'react';
import { FaCar, FaExclamationTriangle, FaCamera, FaRoad, FaTachometerAlt, FaUsers, FaTools, FaCloudRain } from 'react-icons/fa';
import { MdWarning, MdDirectionsCarFilled, MdPeople, MdTraffic } from 'react-icons/md';
import ResourceMap from './components/ResourceMap';

const RoadSafety = () => {
  const [stats] = useState({
    laneViolations: { current: 12, total: 99, change: +8 },
    wrongWay: { current: 4, total: 26, change: -2 },
    overspeeding: { current: 18, total: 127, change: +5 },
    accidents: { current: 1, total: 7, change: -1 },
    anpr: { current: 425, total: 3245, change: +45 }
  });

  const [locationStats] = useState({
    laneViolations: [
      { location: 'Grand Road', count: 28 },
      { location: 'Bada Danda Square', count: 24 },
      { location: 'Marine Drive', count: 19 },
      { location: 'Jagannath Temple Area', count: 16 },
      { location: 'Puri Bus Stand', count: 12 }
    ],
    wrongWay: [
      { location: 'Swargadwar Market', count: 8 },
      { location: 'Chakratirtha Road', count: 6 },
      { location: 'CT Road Junction', count: 5 },
      { location: 'VIP Road', count: 4 },
      { location: 'Market Square', count: 3 }
    ],
    overspeeding: [
      { location: 'Bhubaneswar Highway', count: 34 },
      { location: 'Konark Highway', count: 28 },
      { location: 'Beach Road', count: 25 },
      { location: 'Brahmagiri Road', count: 22 },
      { location: 'Coastal Highway', count: 18 }
    ],
    accidents: [
      { location: 'Bhubaneswar Highway', count: 2 },
      { location: 'Beach Road Junction', count: 2 },
      { location: 'Grand Road', count: 1 },
      { location: 'Konark Highway', count: 1 },
      { location: 'Marine Drive', count: 1 }
    ],
    anpr: [
      { location: 'Bhubaneswar Highway Entry', count: 845 },
      { location: 'Konark Highway', count: 780 },
      { location: 'Coastal Highway', count: 685 },
      { location: 'Brahmagiri Road', count: 520 },
      { location: 'Beach Road Entry', count: 415 }
    ]
  });

  const [recentIncidents] = useState([
    {
      id: 1,
      type: 'lane-violation',
      location: 'Bada Danda Junction',
      time: '2 mins ago',
      vehicle: 'OD02 AB 1234',
      status: 'Processing',
      icon: FaRoad,
      color: 'bg-yellow-500'
    },
    {
      id: 2,
      type: 'wrong-way',
      location: 'Swargadwar Market',
      time: '5 mins ago',
      vehicle: 'OD02 CD 5678',
      status: 'Alert Sent',
      icon: MdWarning,
      color: 'bg-red-500'
    },
    {
      id: 3,
      type: 'overspeeding',
      location: 'Konark Highway',
      time: '8 mins ago',
      vehicle: 'OD02 EF 9012',
      status: 'Challan Generated',
      icon: FaTachometerAlt,
      color: 'bg-orange-500'
    }
  ]);

  const [aiPredictions] = useState([
    {
      id: 1,
      type: 'congestion-prediction',
      location: 'Grand Road - Temple Junction',
      time: '15 mins',
      prediction: '85% probability of heavy congestion',
      reason: 'Temple darshan rush hour approaching',
      icon: MdTraffic,
      color: 'bg-orange-500',
      severity: 'high'
    },
    {
      id: 2,
      type: 'tourist-zone-alert',
      location: 'Swargadwar Beach Area',
      time: '30 mins',
      prediction: 'Heavy pedestrian activity expected',
      reason: 'High tide receding time: 14:00',
      icon: MdPeople,
      color: 'bg-yellow-500',
      severity: 'medium'
    },
    {
      id: 5,
      type: 'behavioral-pattern',
      location: 'Market Area',
      time: 'Current',
      prediction: 'Increasing wrong-way violations',
      reason: 'Temple road diversion confusion',
      icon: MdWarning,
      color: 'bg-red-500',
      severity: 'high'
    },
    {
      id: 3,
      type: 'weather-impact',
      location: 'Marine Drive',
      time: '2 hours',
      prediction: 'Reduced visibility expected',
      reason: 'Monsoon rain forecast + Evening traffic',
      icon: FaCloudRain,
      color: 'bg-blue-500',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'event-impact',
      location: 'Grand Road',
      time: '17:00',
      prediction: 'Major pilgrim traffic buildup likely',
      reason: 'Evening Aarti (10,000+ attendance)',
      icon: FaUsers,
      color: 'bg-purple-500',
      severity: 'high'
    },
    {
      id: 6,
      type: 'maintenance-alert',
      location: 'Chakratirtha Road Bridge',
      time: '3 hours',
      prediction: 'Slow moving traffic expected',
      reason: 'Scheduled post-monsoon repairs',
      icon: FaTools,
      color: 'bg-gray-500',
      severity: 'medium'
    }
  ]);

  const [mapLayers, setMapLayers] = useState(['traffic']);

  const [vehicles] = useState([
    { id: 'p1', type: 'pcr', label: 'PCR 101', position: { lat: 19.8075, lng: 85.8240 } },
    { id: 'p2', type: 'pcr', label: 'PCR 102', position: { lat: 19.8001, lng: 85.8301 } },
    { id: 'f1', type: 'fire', label: 'Fire Engine 1', position: { lat: 19.8077, lng: 85.8315 } },
    { id: 'f2', type: 'fire', label: 'Fire Engine 2', position: { lat: 19.7976, lng: 85.8301 } },
    { id: 'a1', type: 'ambulance', label: 'AMB 101', position: { lat: 19.8082, lng: 85.8387 } },
    { id: 'a2', type: 'ambulance', label: 'AMB 102', position: { lat: 19.8029, lng: 85.8194 } }
  ]);

  // Update vehicleTypeStats for Puri's scale
  const [vehicleTypeStats] = useState({
    total: 3245,
    types: [
      { type: 'Two Wheelers', count: 1580 },  // ~49% - Most common in Puri
      { type: 'Cars', count: 720 },           // ~22% 
      { type: 'Auto Rickshaws', count: 520 }, // ~16% - Higher percentage for tourist transport
      { type: 'Tourist Buses', count: 280 },  // ~9% - More buses due to tourism
      { type: 'Trucks', count: 145 }          // ~4% - Limited heavy vehicles
    ]
  });

  const [activeTab, setActiveTab] = useState('laneViolations');

  const handleLayerToggle = (layer) => {
    if (mapLayers.includes(layer)) {
      setMapLayers(mapLayers.filter(l => l !== layer));
    } else {
      setMapLayers([...mapLayers, layer]);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex gap-4 mt-16 mb-4">
      {/* Left AI Predictions Sidebar */}
      <div className="w-[320px] bg-black/20 backdrop-blur-sm rounded-xl border border-white/5">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold">Traffic Intelligence Dashboard</h2>
              <p className="text-xs text-gray-400 mt-1">
                AI-powered traffic monitoring and predictive analytics
              </p>
            </div>
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 13rem)' }}>
            {/* Immediate Issues Card */}
            <div className="mx-2 mt-2 bg-black/20 rounded-xl border border-white/5">
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-white/70">
                    Immediate Issues
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                    <span className="text-xs text-gray-500">Current & Next Hour</span>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-1.5">
                {aiPredictions
                  .filter(p => p.time.includes('mins') || p.time.includes('Current'))
                  .map(alert => (
                    <CompactAlertCard 
                      key={alert.id} 
                      alert={alert}
                      highlight={alert.severity === 'high'}
                    />
                  ))}
              </div>
            </div>

            {/* Upcoming Issues Card */}
            <div className="m-2 bg-black/20 rounded-xl border border-white/5">
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-white/70">
                    Upcoming Issues
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"/>
                    <span className="text-xs text-gray-500">Next 2-3 Hours</span>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-1.5">
                {aiPredictions
                  .filter(p => p.time.includes('hours') || p.time.includes('17:00'))
                  .map(alert => (
                    <CompactAlertCard 
                      key={alert.id} 
                      alert={alert} 
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Map and Stats */}
      <div className="flex-1 flex gap-4">
        {/* Left area with Map and Hot Spots below */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Map */}
          <div className="h-[calc(70vh-6rem)] rounded-xl overflow-hidden border border-white/5">
            <ResourceMap 
              activeLayers={mapLayers}
              vehicles={vehicles}
              onLayerToggle={handleLayerToggle}
            />
          </div>

          {/* Hot Spot Cards - one for each type */}
          <div className="h-[calc(30vh-6rem)] grid grid-cols-4 gap-4 overflow-auto">
            {/* Lane Violations Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Lane Violations</h3>
                <div className="px-2 py-1 rounded-full bg-purple-500/20 text-xs text-purple-400">
                  {stats.laneViolations.current} Today
                </div>
              </div>
              <div className="space-y-3">
                {locationStats.laneViolations.slice(0, 3).map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate">{item.location}</span>
                      <span className="text-xs font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                        style={{ width: `${(item.count / locationStats.laneViolations[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wrong Way Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Wrong Way</h3>
                <div className="px-2 py-1 rounded-full bg-red-500/20 text-xs text-red-400">
                  {stats.wrongWay.current} Today
                </div>
              </div>
              <div className="space-y-3">
                {locationStats.wrongWay.slice(0, 3).map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate">{item.location}</span>
                      <span className="text-xs font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                        style={{ width: `${(item.count / locationStats.wrongWay[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overspeeding Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Overspeeding</h3>
                <div className="px-2 py-1 rounded-full bg-orange-500/20 text-xs text-orange-400">
                  {stats.overspeeding.current} Today
                </div>
              </div>
              <div className="space-y-3">
                {locationStats.overspeeding.slice(0, 3).map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate">{item.location}</span>
                      <span className="text-xs font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                        style={{ width: `${(item.count / locationStats.overspeeding[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accidents Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Accidents</h3>
                <div className="px-2 py-1 rounded-full bg-red-500/20 text-xs text-red-400">
                  {stats.accidents.current} Today
                </div>
              </div>
              <div className="space-y-3">
                {locationStats.accidents.slice(0, 3).map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate">{item.location}</span>
                      <span className="text-xs font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                        style={{ width: `${(item.count / locationStats.accidents[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Intelligence Cards - Stacked Vertically */}
        <div className="w-[300px] flex flex-col gap-4">
          {/* Pattern Analysis Card */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Pattern Analysis</h3>
              <div className="px-2 py-1 rounded-full bg-blue-500/20 text-xs text-blue-400">
                Last 24 Hours
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"/>
                <span className="text-gray-400">Peak Traffic: 9:00 AM - 11:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <span className="text-gray-400">High Violation Period: 4:00 PM - 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500"/>
                <span className="text-gray-400">Temple Area Activity: 5:30 AM - 8:30 AM</span>
              </div>
            </div>
          </div>

          {/* Predictive Analysis Card */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Predictive Analysis</h3>
              <div className="px-2 py-1 rounded-full bg-purple-500/20 text-xs text-purple-400">
                Next 2 Hours
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <span className="text-gray-400">85% Congestion Risk at Grand Road</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-orange-500"/>
                <span className="text-gray-400">70% Tourist Vehicle Surge on Beach Road</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <span className="text-gray-400">60% Monsoon Impact on Coastal Road</span>
              </div>
            </div>
          </div>

          {/* Behavioral Analysis Card */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Behavioral Analysis</h3>
              <div className="px-2 py-1 rounded-full bg-emerald-500/20 text-xs text-emerald-400">
                Trending
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500"/>
                <span className="text-gray-400">Increased Signal Compliance at Temple Area</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <span className="text-gray-400">Wrong Way Pattern at Swargadwar Market</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <span className="text-gray-400">New Route Adoption via Marine Drive</span>
              </div>
            </div>
          </div>

          {/* Enforcement Impact Card */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Enforcement Impact</h3>
              <div className="px-2 py-1 rounded-full bg-orange-500/20 text-xs text-orange-400">
                7 Days
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                <span className="text-gray-400">32% ↓ in Speed Violations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                <span className="text-gray-400">28% ↓ in Signal Violations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <span className="text-gray-400">15% ↑ in Lane Discipline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update the CompactAlertCard component to be more compact
const CompactAlertCard = ({ alert, highlight = false }) => (
  <div className={`
    bg-black/20 rounded-lg border transition-colors cursor-pointer group
    ${highlight ? 'border-l-2 border-l-red-500 border-y border-r border-white/10' : 'border border-white/5'}
    hover:bg-black/30
  `}>
    <div className="p-1.5"> {/* Reduced padding */}
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-lg ${alert.color}`}> {/* Smaller icon container */}
          <alert.icon className="w-3 h-3 text-white" /> {/* Smaller icon */}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-white/90 truncate">{alert.location}</h3> {/* Smaller text */}
            <span className="text-[10px] font-medium text-white/40 ml-2">{alert.time}</span>
          </div>
          <p className="text-[10px] text-white/60 truncate">{alert.prediction}</p> {/* Smaller text */}
          <p className="text-[10px] text-gray-500 truncate mt-0.5">{alert.reason}</p> {/* Integrated reason */}
        </div>
      </div>
    </div>
  </div>
);

export default RoadSafety; 