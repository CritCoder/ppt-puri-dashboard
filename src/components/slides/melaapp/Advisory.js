import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBullhorn, FaBell, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Advisory = ({ goBack }) => {
  // Sample advisory data
  const advisories = [
    { 
      id: 1, 
      type: 'alert', 
      title: 'Heavy Crowd Expected', 
      description: 'Expect heavy crowds at Mahakal Temple from 10AM-4PM. Plan accordingly.',
      time: '2 hours ago',
      location: 'Mahakaleshwar Temple'
    },
    { 
      id: 2, 
      type: 'info', 
      title: 'Special Ganga Aarti Today', 
      description: 'Special Ganga Aarti will be performed at Ram Ghat at 7PM with enhanced security arrangements.',
      time: '5 hours ago',
      location: 'Ram Ghat'
    },
    { 
      id: 3, 
      type: 'warning', 
      title: 'Weather Alert', 
      description: 'Heavy rainfall expected tonight. All ghats will have limited access. Please take necessary precautions.',
      time: '1 day ago',
      location: 'All Ghats'
    },
    { 
      id: 4, 
      type: 'info', 
      title: 'Shahi Snan Schedule', 
      description: 'Shahi Snan (Royal Bath) scheduled for tomorrow. Major roads will be diverted from 4AM-2PM.',
      time: '1 day ago',
      location: 'Main Ghats'
    }
  ];
  
  // Icon mapping based on advisory type
  const typeIcons = {
    alert: <FaExclamationTriangle className="text-red-500" />,
    warning: <FaBell className="text-amber-500" />,
    info: <FaBullhorn className="text-blue-500" />
  };
  
  // Background color mapping based on advisory type
  const typeBg = {
    alert: 'bg-red-50 border-l-4 border-red-500',
    warning: 'bg-amber-50 border-l-4 border-amber-500',
    info: 'bg-blue-50 border-l-4 border-blue-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-yellow-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Advisories & Alerts</h1>
            <p className="text-sm opacity-80">Important announcements for pilgrims</p>
          </div>
        </div>
      </div>
      
      {/* Filter chips */}
      <div className="p-3 bg-white border-b flex space-x-2 overflow-auto">
        <button className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm whitespace-nowrap">
          All Updates
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-full text-sm whitespace-nowrap">
          Safety Alerts
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-full text-sm whitespace-nowrap">
          Event Updates
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-full text-sm whitespace-nowrap">
          Weather
        </button>
      </div>
      
      {/* Advisories list */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4">
          {advisories.map((advisory, index) => (
            <motion.div
              key={advisory.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${typeBg[advisory.type]} rounded-lg shadow mb-4 overflow-hidden`}
            >
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="mr-2">
                    {typeIcons[advisory.type]}
                  </div>
                  <h3 className="font-medium text-gray-800">{advisory.title}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {advisory.description}
                </p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {advisory.location}
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {advisory.time}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Advisory; 