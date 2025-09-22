import { useState, useEffect } from 'react';
import LiveDashboard from './LiveDashboard';
import StatsWidget from './widgets/StatsWidget';
import ActiveIncidentsWidget from './widgets/ActiveIncidentsWidget';
import ResponseTimesWidget from './widgets/ResponseTimesWidget';
import { FaUsers, FaExclamationTriangle, FaAmbulance, FaFireAlt, FaCar, FaVideo } from 'react-icons/fa';
import { MdLocalPolice, MdTraffic } from 'react-icons/md';

const DashboardLayout = () => {
  const [stats, setStats] = useState({
    activeEmergencies: { value: 3, change: 1, type: 'critical' },
    unitsDeployed: { value: '18/25', change: 2, type: 'warning' },
    crowdHotspots: { value: 4, change: 2, type: 'warning' },
    trafficIncidents: { value: 2, change: -1, type: 'normal' }
  });

  const [activeEmergencies] = useState([
    {
      id: 1,
      title: 'Major Fire Incident',
      location: 'Freeganj Market',
      status: 'Critical',
      timeElapsed: '10:23',
      unitsResponding: 4,
      type: 'fire',
      icon: FaFireAlt,
      color: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Multi-Vehicle Collision',
      location: 'Tower Square',
      status: 'High',
      timeElapsed: '05:47',
      unitsResponding: 3,
      type: 'accident',
      icon: FaAmbulance,
      color: 'bg-orange-500'
    },
    {
      id: 3,
      title: 'Mass Gathering Alert',
      location: 'Mahakal Temple',
      status: 'High',
      timeElapsed: '15:32',
      unitsResponding: 2,
      type: 'crowd',
      icon: FaUsers,
      color: 'bg-yellow-500'
    }
  ]);

  const [resourceStatus] = useState({
    police: { available: 8, total: 12, active: 4 },
    fire: { available: 3, total: 5, active: 2 },
    ambulance: { available: 4, total: 8, active: 4 },
    rapidResponse: { available: 3, total: 5, active: 2 }
  });

  const [quickLists] = useState({
    emergencies: [
      { id: 1, text: 'Fire at Freeganj Market', status: 'Critical', time: '10:23' },
      { id: 2, text: 'Accident at Tower Square', status: 'High', time: '05:47' },
      { id: 3, text: 'Medical Emergency Nanakheda', status: 'Medium', time: '03:12' }
    ],
    units: [
      { id: 1, text: 'PCR Van 1 - Tower Square', status: 'Responding' },
      { id: 2, text: 'Fire Engine 2 - Freeganj', status: 'On Scene' },
      { id: 3, text: 'Ambulance 3 - Nanakheda', status: 'En Route' }
    ],
    crowds: [
      { id: 1, text: 'Mahakal Temple Area', density: 'High', count: '~2000' },
      { id: 2, text: 'Freeganj Market', density: 'Medium', count: '~1200' },
      { id: 3, text: 'Railway Station', density: 'Medium', count: '~800' }
    ],
    traffic: [
      { id: 1, text: 'Tower Square Junction', type: 'Congestion', severity: 'High' },
      { id: 2, text: 'Hari Phatak Bridge', type: 'Accident', severity: 'Medium' },
      { id: 3, text: 'Nanakheda Bus Stand', type: 'Slow Moving', severity: 'Medium' }
    ]
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeEmergencies: {
          value: prev.activeEmergencies.value + Math.floor(Math.random() * 3) - 1,
          change: Math.floor(Math.random() * 20) - 10
        },
        unitsDeployed: {
          value: `${(Math.random() * 3 + 1).toFixed(1)}/${(Math.random() * 5 + 1).toFixed(1)}`,
          change: Math.floor(Math.random() * 20) - 10
        },
        crowdHotspots: {
          value: prev.crowdHotspots.value + Math.floor(Math.random() * 3) - 1,
          change: Math.floor(Math.random() * 20) - 10
        },
        trafficIncidents: {
          value: prev.trafficIncidents.value + Math.floor(Math.random() * 3) - 1,
          change: Math.floor(Math.random() * 20) - 10
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col gap-4 mt-16">
      {/* Top Section - Map and Right Panel (2/3 height) */}
      <div className="h-[calc(66vh-6rem)] flex gap-4">
        {/* Main Map View */}
        <div className="w-2/3 rounded-xl overflow-hidden border border-white/5">
          <LiveDashboard isActive={true} />
        </div>

        {/* Right Command Panel */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* Active Emergencies - Now full height */}
          <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Active Emergencies</h2>
              <span className="text-red-500 animate-pulse">LIVE</span>
            </div>
            <div className="space-y-4">
              {activeEmergencies.map(emergency => (
                <div key={emergency.id} 
                  className="bg-black/30 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${emergency.color}`}>
                        <emergency.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{emergency.title}</h3>
                        <p className="text-sm text-gray-400">{emergency.location}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      emergency.status === 'Critical' ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {emergency.status}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-gray-400">
                    <span>Time Elapsed: {emergency.timeElapsed}</span>
                    <span>Units Responding: {emergency.unitsResponding}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar (remaining height) */}
      <div className="flex-1 grid grid-cols-4 gap-4 min-h-[calc(33vh-6rem)]"> {/* Adjusted to fill remaining space */}
        {/* Active Emergencies Card */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Active Emergencies</h3>
              <p className="text-3xl font-bold text-red-500">{stats.activeEmergencies.value}</p>
            </div>
            <div className="text-5xl text-red-500/20">
              <FaExclamationTriangle />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {quickLists.emergencies.map(item => (
              <div key={item.id} className="bg-black/30 rounded-lg p-2 flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm text-white/90">{item.text}</p>
                  <p className="text-xs text-white/50">{item.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'Critical' ? 'bg-red-500/20 text-red-500' :
                  item.status === 'High' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Units Deployed Card */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Units Deployed</h3>
              <p className="text-3xl font-bold text-blue-500">{stats.unitsDeployed.value}</p>
            </div>
            <div className="text-5xl text-blue-500/20">
              <MdLocalPolice />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {quickLists.units.map(item => (
              <div key={item.id} className="bg-black/30 rounded-lg p-2">
                <p className="text-sm text-white/90">{item.text}</p>
                <p className="text-xs text-blue-400">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Crowd Hotspots Card */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Crowd Hotspots</h3>
              <p className="text-3xl font-bold text-yellow-500">{stats.crowdHotspots.value}</p>
            </div>
            <div className="text-5xl text-yellow-500/20">
              <FaUsers />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {quickLists.crowds.map(item => (
              <div key={item.id} className="bg-black/30 rounded-lg p-2">
                <p className="text-sm text-white/90">{item.text}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-white/50">{item.count}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.density === 'High' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {item.density}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Incidents Card */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Traffic Incidents</h3>
              <p className="text-3xl font-bold text-orange-500">{stats.trafficIncidents.value}</p>
            </div>
            <div className="text-5xl text-orange-500/20">
              <MdTraffic />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {quickLists.traffic.map(item => (
              <div key={item.id} className="bg-black/30 rounded-lg p-2">
                <p className="text-sm text-white/90">{item.text}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-white/50">{item.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.severity === 'High' ? 'bg-red-500/20 text-red-500' :
                    'bg-orange-500/20 text-orange-500'
                  }`}>
                    {item.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 