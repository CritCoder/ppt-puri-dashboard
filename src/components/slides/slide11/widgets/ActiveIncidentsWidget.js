import React from 'react';

const ActiveIncidentsWidget = ({ incidents }) => (
  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
    <h3 className="text-white font-semibold mb-3">Active Incidents</h3>
    <div className="space-y-3">
      {incidents.map(incident => (
        <div key={incident.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${incident.color}`}>
              <incident.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{incident.title}</p>
              <p className="text-white/60 text-xs">{incident.location}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            incident.status === 'Critical' ? 'bg-red-500/20 text-red-500' :
            incident.status === 'High' ? 'bg-orange-500/20 text-orange-500' :
            'bg-yellow-500/20 text-yellow-500'
          }`}>
            {incident.status}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ActiveIncidentsWidget; 