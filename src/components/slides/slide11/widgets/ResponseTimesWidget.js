import React from 'react';

const ResponseTimesWidget = ({ times }) => (
  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
    <h3 className="text-white font-semibold mb-3">Response Times</h3>
    <div className="space-y-2">
      {times.map(({ service, time }) => (
        <div key={service} className="flex justify-between items-center">
          <span className="text-white/60">{service}</span>
          <span className="text-white">{time} mins</span>
        </div>
      ))}
    </div>
  </div>
);

export default ResponseTimesWidget; 