import { useState } from 'react';
import { 
  MdSecurity, MdPeople, MdWarning, MdLocationOn,
  MdNotifications, MdLocalPolice 
} from 'react-icons/md';
import { 
  FaUserShield, FaExclamationTriangle, FaRunning,
  FaUsers, FaCamera, FaMapMarkerAlt 
} from 'react-icons/fa';
import PublicSafetyMap from '../analytics/publicsafetymap';
import DigitalEvidence from './DigitalEvidence';

const PublicSafety = () => {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [view, setView] = useState('map'); // 'map' or 'camera-details'
  
  const [aiPredictions] = useState([
    {
      id: 1,
      type: 'crowd-surge',
      location: 'Jagannath Temple Area',
      coordinates: { lat: 19.8077, lng: 85.8315 },
      time: '15 mins',
      prediction: '90% probability of overcrowding',
      reason: 'Festival rush expected',
      icon: MdPeople,
      color: 'bg-orange-500',
      severity: 'high'
    },
    {
      id: 2,
      type: 'suspicious-activity',
      location: 'Grand Road Market',
      coordinates: { lat: 19.8075, lng: 85.8240 },
      time: 'Current',
      prediction: 'Unusual behavior detected',
      reason: 'Multiple alerts from AI cameras',
      icon: MdWarning,
      color: 'bg-red-500',
      severity: 'high'
    },
    {
      id: 3,
      type: 'event-security',
      location: 'Swargadwar Market',
      coordinates: { lat: 19.8001, lng: 85.8301 },
      time: '30 mins',
      prediction: 'Security check bottleneck likely',
      reason: 'Cultural event starting at 18:00',
      icon: FaUserShield,
      color: 'bg-yellow-500',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'area-alert',
      location: 'Puri Railway Station',
      coordinates: { lat: 19.8124, lng: 85.8287 },
      time: '2 hours',
      prediction: 'High passenger influx expected',
      reason: 'Multiple trains arrival between 17:00-18:00',
      icon: FaUsers,
      color: 'bg-blue-500',
      severity: 'medium'
    }
  ]);

  const [mapLayers, setMapLayers] = useState(['security']);
  
  const [forces] = useState([
    { id: 'p1', type: 'police', label: 'Beat 101', position: { lat: 19.8075, lng: 85.8240 } },
    { id: 'p2', type: 'police', label: 'Beat 102', position: { lat: 19.8001, lng: 85.8301 } },
    { id: 'r1', type: 'rapid', label: 'QRT 1', position: { lat: 19.8077, lng: 85.8315 } },
    { id: 'r2', type: 'rapid', label: 'QRT 2', position: { lat: 19.8124, lng: 85.8287 } }
  ]);

  const handleLayerToggle = (layer) => {
    if (mapLayers.includes(layer)) {
      setMapLayers(mapLayers.filter(l => l !== layer));
    } else {
      setMapLayers([...mapLayers, layer]);
    }
  };

  // Function to handle threat card click
  const handleThreatClick = (threat) => {
    setSelectedThreat(threat);
  };

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
    setView('camera-details');
  };

  const handleBackToMap = () => {
    setView('map');
    setSelectedCamera(null);
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex gap-4 mt-16 mb-4">
      {/* Left AI Predictions Sidebar */}
      <div className="w-[320px] bg-black/20 backdrop-blur-sm rounded-xl border border-white/5">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold">Public Safety Intelligence Dashboard</h2>
              <p className="text-xs text-gray-400 mt-1">
                AI-powered security monitoring and threat detection
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
                    Active Threats
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                    <span className="text-xs text-gray-500">Immediate Response</span>
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
                      onClick={() => handleThreatClick(alert)}
                    />
                  ))}
              </div>
            </div>

            {/* Upcoming Issues Card */}
            <div className="m-2 bg-black/20 rounded-xl border border-white/5">
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-white/70">
                    Potential Risks
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"/>
                    <span className="text-xs text-gray-500">Preventive Action</span>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-1.5">
                {aiPredictions
                  .filter(p => p.time.includes('hours'))
                  .map(alert => (
                    <CompactAlertCard 
                      key={alert.id} 
                      alert={alert}
                      onClick={() => handleThreatClick(alert)}
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
            {view === 'map' ? (
              <PublicSafetyMap 
                selectedThreat={selectedThreat}
                onCameraSelect={handleCameraSelect}
              />
            ) : (
              <DigitalEvidence 
                selectedCamera={selectedCamera}
                onBack={handleBackToMap}
              />
            )}
          </div>

          {/* Bottom Public Safety Cards */}
          <div className="h-[calc(30vh-6rem)] grid grid-cols-4 gap-4 overflow-auto">
            {/* Crowd Density Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Crowd Density</h3>
                <div className="px-2 py-1 rounded-full bg-orange-500/20 text-xs text-orange-400">
                  Live Monitoring
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Jagannath Temple</span>
                    <span className="text-xs font-bold">78%</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Grand Road</span>
                    <span className="text-xs font-bold">65%</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Swargadwar Beach</span>
                    <span className="text-xs font-bold">45%</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-yellow-500" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Response Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Emergency Response</h3>
                <div className="px-2 py-1 rounded-full bg-green-500/20 text-xs text-green-400">
                  On Standby
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Medical Teams</span>
                    <span className="text-xs font-bold">5 units</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: '90%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Fire Response</span>
                    <span className="text-xs font-bold">3 units</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Disaster Response</span>
                    <span className="text-xs font-bold">2 units</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Suspicious Activity Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Suspicious Activity</h3>
                <div className="px-2 py-1 rounded-full bg-red-500/20 text-xs text-red-400">
                  8 Alerts Today
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Railway Station</span>
                    <span className="text-xs font-bold">4 alerts</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: '80%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Market Area</span>
                    <span className="text-xs font-bold">3 alerts</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: '60%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Beach Road</span>
                    <span className="text-xs font-bold">1 alert</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-yellow-500" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pilgrim Safety Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Pilgrim Safety</h3>
                <div className="px-2 py-1 rounded-full bg-blue-500/20 text-xs text-blue-400">
                  Monitoring
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Lost Person Alerts</span>
                    <span className="text-xs font-bold">2 active</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-yellow-500" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Medical Incidents</span>
                    <span className="text-xs font-bold">5 today</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: '50%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">Child Safety Alerts</span>
                    <span className="text-xs font-bold">1 active</span>
                  </div>
                  <div className="w-full bg-gray-800/40 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: '20%' }} />
                  </div>
                </div>
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
                <span className="text-gray-400">Jagannath Temple: Peak 4AM-8AM, 6PM-9PM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <span className="text-gray-400">Swargadwar Beach: High Activity 5AM-7AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500"/>
                <span className="text-gray-400">Grand Road Market: Rush 11AM-2PM, 5PM-8PM</span>
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
                <span className="text-gray-400">85% Crowd Surge at Jagannath Temple</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-orange-500"/>
                <span className="text-gray-400">70% Traffic Congestion at Bada Danda Square</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <span className="text-gray-400">65% Crowding at Marine Drive (Evening Aarti)</span>
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
                <span className="text-gray-400">Better Temple Queue Management</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <span className="text-gray-400">Pickpocketing Near Puri Railway Station</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <span className="text-gray-400">New Devotee Movement Patterns</span>
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
                <span className="text-gray-400">40% ↓ Temple Area Incidents</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                <span className="text-gray-400">35% ↓ Emergency Response Time</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <span className="text-gray-400">20% ↑ Crowd Management Success</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update CompactAlertCard to include coordinates and click handler
const CompactAlertCard = ({ alert, highlight = false, onClick }) => (
  <div 
    className={`
      bg-black/20 rounded-lg border transition-colors cursor-pointer group
      ${highlight ? 'border-l-2 border-l-red-500 border-y border-r border-white/10' : 'border border-white/5'}
      hover:bg-black/30
    `}
    onClick={onClick}
  >
    <div className="p-1.5">
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-lg ${alert.color}`}>
          <alert.icon className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-white/90 truncate">{alert.location}</h3>
            <span className="text-[10px] font-medium text-white/40 ml-2">{alert.time}</span>
          </div>
          <p className="text-[10px] text-white/60 truncate">{alert.prediction}</p>
          <p className="text-[10px] text-gray-500 truncate mt-0.5">
            <span className="flex items-center gap-1">
              <MdLocationOn className="w-3 h-3" />
              {alert.coordinates.lat.toFixed(4)}, {alert.coordinates.lng.toFixed(4)}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PublicSafety; 