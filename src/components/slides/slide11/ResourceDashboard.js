import { useState } from 'react';
import LiveDashboard from './LiveDashboard';
import { FaUsers, FaCarAlt, FaToolbox, FaHardHat } from 'react-icons/fa';
import { MdLocalPolice, MdSecurity, MdLocationOn, MdEmergency } from 'react-icons/md';
import { HiLightningBolt } from 'react-icons/hi';
import ResourceMap from './components/ResourceMap';

const ResourceDashboard = () => {
  const [activeUnits] = useState([
    {
      id: 1,
      type: 'Police',
      units: [
        { id: 'p1', name: 'PCR Van 1', location: 'Tower Square', status: 'Patrolling', personnel: 4 },
        { id: 'p2', name: 'QRT Alpha', location: 'Freeganj', status: 'Responding', personnel: 6 },
        { id: 'p3', name: 'PCR Van 3', location: 'Mahakal Area', status: 'Standby', personnel: 4 }
      ],
      icon: MdLocalPolice,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'Fire',
      units: [
        { id: 'f1', name: 'Fire Engine 1', location: 'Central Station', status: 'Available', personnel: 6 },
        { id: 'f2', name: 'Rescue Unit 2', location: 'North Station', status: 'Responding', personnel: 4 }
      ],
      icon: HiLightningBolt,
      color: 'bg-red-500'
    },
    {
      id: 3,
      type: 'Medical',
      units: [
        { id: 'm1', name: 'Ambulance 1', location: 'City Hospital', status: 'En Route', personnel: 3 },
        { id: 'm2', name: 'EMT Unit 2', location: 'South District', status: 'Available', personnel: 2 }
      ],
      icon: FaToolbox,
      color: 'bg-green-500'
    }
  ]);

  const [equipmentStatus] = useState({
    vehicles: { total: 24, active: 18, maintenance: 6 },
    specialEquipment: { total: 15, active: 12, maintenance: 3 },
    communications: { total: 45, active: 42, maintenance: 3 },
    emergencyGear: { total: 30, active: 28, maintenance: 2 }
  });

  const [personnelStats] = useState({
    onDuty: 145,
    specialUnits: 28,
    quickResponse: 36,
    reserve: 42
  });

  const [mapLayers, setMapLayers] = useState(['patrol']); // Start with patrol layer active

  const [forceUnits] = useState([
    { id: 'p1', type: 'patrol', label: 'PCR Van 1', position: { lat: 23.1745, lng: 75.7934 } },
    { id: 'p2', type: 'patrol', label: 'PCR Van 2', position: { lat: 23.1823, lng: 75.7967 } },
    { id: 'q1', type: 'qrt', label: 'QRT Alpha', position: { lat: 23.1812, lng: 75.7949 } },
    { id: 'q2', type: 'qrt', label: 'QRT Beta', position: { lat: 23.1734, lng: 75.8012 } },
    { id: 'r1', type: 'reserve', label: 'Reserve Unit 1', position: { lat: 23.1829, lng: 75.7682 } }
  ]);

  const [vehicles] = useState([
    { id: 'v1', type: 'pcr', label: 'PCR 101', position: { lat: 23.1745, lng: 75.7834 } },
    { id: 'v2', type: 'fire', label: 'Fire Engine 1', position: { lat: 23.1734, lng: 75.7912 } },
    { id: 'v3', type: 'ambulance', label: 'AMB 201', position: { lat: 23.1821, lng: 75.7674 } }
  ]);

  const [infrastructure] = useState([
    { id: 'c1', type: 'camera', label: 'CAM 101', position: { lat: 23.1823, lng: 75.7867 } },
    { id: 'c2', type: 'camera', label: 'CAM 102', position: { lat: 23.1756, lng: 75.7889 } },
    { id: 'e1', type: 'emergency-box', label: 'EMG 101', position: { lat: 23.1836, lng: 75.7683 } },
    { id: 's1', type: 'sensor', label: 'SNR 101', position: { lat: 23.1789, lng: 75.7595 } }
  ]);

  const handleLayerToggle = (layerType) => {
    setMapLayers(prev => {
      if (prev.includes(layerType)) {
        return prev.filter(layer => layer !== layerType);
      }
      return [...prev, layerType];
    });
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col gap-4 mt-16">
      {/* Top Section - Map and Right Panel */}
      <div className="h-[calc(66vh-6rem)] flex gap-4">
        {/* Main Map View */}
        <div className="w-2/3 rounded-xl overflow-hidden border border-white/5">
          <ResourceMap 
            activeLayers={mapLayers}
            vehicles={vehicles}
            infrastructure={infrastructure}
            onLayerToggle={handleLayerToggle}
            showInfrastructure={true}
          />
        </div>

        {/* Right Command Panel */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* Active Units Panel */}
          <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Active Units</h2>
              <span className="text-blue-500 animate-pulse">LIVE</span>
            </div>
            <div className="space-y-4">
              {activeUnits.map(category => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <category.icon className={`w-5 h-5 ${category.color.replace('bg-', 'text-')}`} />
                    <h3 className="font-semibold">{category.type}</h3>
                  </div>
                  {category.units.map(unit => (
                    <div key={unit.id} 
                      className="bg-black/30 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{unit.name}</p>
                          <p className="text-sm text-gray-400">{unit.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          unit.status === 'Responding' ? 'bg-orange-500/20 text-orange-500' :
                          unit.status === 'Available' ? 'bg-green-500/20 text-green-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Personnel: {unit.personnel}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex-1 grid grid-cols-4 gap-4 min-h-[calc(33vh-6rem)]">
        {/* Equipment Status */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Equipment Status</h3>
              <p className="text-3xl font-bold text-green-500">
                {Math.round((equipmentStatus.vehicles.active + equipmentStatus.specialEquipment.active) / 
                (equipmentStatus.vehicles.total + equipmentStatus.specialEquipment.total) * 100)}%
              </p>
            </div>
            <div className="text-5xl text-green-500/20">
              <FaToolbox />
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(equipmentStatus).map(([key, data]) => (
              <div key={key} className="flex justify-between items-center text-sm">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-green-400">{data.active}/{data.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Fleet */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Vehicle Fleet</h3>
              <p className="text-3xl font-bold text-blue-500">
                {equipmentStatus.vehicles.active}/{equipmentStatus.vehicles.total}
              </p>
            </div>
            <div className="text-5xl text-blue-500/20">
              <FaCarAlt />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-black/30 rounded-full h-2">
              <div 
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${(equipmentStatus.vehicles.active/equipmentStatus.vehicles.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {equipmentStatus.vehicles.maintenance} units in maintenance
            </p>
          </div>
        </div>

        {/* Personnel Distribution */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Personnel</h3>
              <p className="text-3xl font-bold text-yellow-500">{personnelStats.onDuty}</p>
            </div>
            <div className="text-5xl text-yellow-500/20">
              <FaHardHat />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Special Units</span>
              <span className="text-yellow-400">{personnelStats.specialUnits}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Quick Response</span>
              <span className="text-yellow-400">{personnelStats.quickResponse}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Reserve Force</span>
              <span className="text-yellow-400">{personnelStats.reserve}</span>
            </div>
          </div>
        </div>

        {/* Security Coverage */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Security Coverage</h3>
              <p className="text-3xl font-bold text-purple-500">92%</p>
            </div>
            <div className="text-5xl text-purple-500/20">
              <MdSecurity />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Critical Areas</span>
              <span className="text-purple-400">100%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Public Spaces</span>
              <span className="text-purple-400">85%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Entry Points</span>
              <span className="text-purple-400">95%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDashboard; 