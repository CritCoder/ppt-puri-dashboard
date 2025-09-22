import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaParking, 
  FaSearch, 
  FaBullhorn, 
  FaShieldAlt, 
  FaComment, 
  FaTrash, 
  FaHospital, 
  FaMapMarkedAlt,
  FaInfoCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaHome,
  FaCompass
} from 'react-icons/fa';

const MelaHome = ({ onNavigate }) => {
  const [activeUpdate, setActiveUpdate] = useState(0);
  
  // All Services grid
  const allServices = [
    { id: 'parking', icon: FaParking, label: 'Parking', color: 'bg-blue-500', textColor: 'text-blue-500' },
    { id: 'lostfound', icon: FaSearch, label: 'Lost & Found', color: 'bg-purple-500', textColor: 'text-purple-500' },
    { id: 'advisory', icon: FaBullhorn, label: 'Advisory', color: 'bg-amber-500', textColor: 'text-amber-500' },
    { id: 'feedback', icon: FaComment, label: 'Feedback', color: 'bg-green-500', textColor: 'text-green-500' },
    { id: 'waste', icon: FaTrash, label: 'Report Waste', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { id: 'health', icon: FaHospital, label: 'Health Camps', color: 'bg-pink-500', textColor: 'text-pink-500' },
  ];
  
  // Important Updates for banner slider
  const importantUpdates = [
    {
      title: "Traffic Advisory",
      content: "Roads to Ram Ghat will be closed from 2 AM to 4 PM on May 10th",
      icon: FaExclamationTriangle,
      severity: "high"
    },
    {
      title: "Additional Trains Scheduled",
      content: "Indian Railways adds 25 special trains for Simhastha pilgrims",
      icon: FaBullhorn,
      severity: "medium"
    },
    {
      title: "Weather Alert",
      content: "Temperatures expected to reach 40°C. Stay hydrated and use sunscreen",
      icon: FaExclamationCircle,
      severity: "high"
    }
  ];
  
  // Auto scroll updates banner
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUpdate(prev => (prev + 1) % importantUpdates.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Shahi Snan data
  const shahiSnanEvents = [
    { 
      date: "10 May 2028", 
      time: "4:00 AM - 2:00 PM", 
      location: "Ram Ghat", 
      description: "Mesh Sankranti Snan",
      crowdLevel: "Very High" 
    },
    { 
      date: "18 May 2028", 
      time: "5:30 AM - 12:00 PM", 
      location: "Triveni Ghat", 
      description: "Vaishakh Purnima",
      crowdLevel: "High" 
    },
    { 
      date: "24 May 2028", 
      time: "6:00 AM - 2:00 PM", 
      location: "Mangalnath Ghat", 
      description: "Akshaya Tritiya",
      crowdLevel: "Extreme" 
    }
  ];
  
  // Bottom nav items - now with 5 items including Ghats & POI
  const bottomNavItems = [
    { id: 'home', icon: FaHome, label: 'Home', active: true },
    { id: 'poi', icon: FaCompass, label: 'Ghats & POI', active: false },
    { id: 'advisory', icon: FaBullhorn, label: 'Updates', active: false },
    { id: 'contactpolice', icon: FaShieldAlt, label: 'Emergency', active: false },
    { id: 'health', icon: FaHospital, label: 'Health', active: false }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-20">
      {/* Important Updates Banner */}
      <div className="px-4 pt-4 mb-4">
        <div className="overflow-hidden rounded-lg shadow-md">
          <div className="relative h-40">
            {importantUpdates.map((update, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
                style={{
                  backgroundImage: 'url(/banner1.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activeUpdate === index ? 1 : 0,
                  zIndex: activeUpdate === index ? 10 : 0
                }}
              >
                {/* Improved overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
                
                <div className="relative z-10 p-5 ml-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${update.severity === 'high' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                      <update.icon className={`${update.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} size={22} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{update.title}</h3>
                  </div>
                  
                  <p className="text-white/90 mt-2 text-sm max-w-xs">{update.content}</p>
                  
                  <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center justify-center w-28 shadow-md">
                    More Info
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Banner dots */}
        <div className="flex justify-center mt-2 space-x-1.5">
          {importantUpdates.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${activeUpdate === index ? 'w-6 bg-orange-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
      
      {/* Shahi Snan Calendar Widget */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-orange-100 to-amber-50 rounded-lg overflow-hidden border border-orange-200">
          <div className="bg-orange-500 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <h3 className="font-medium">Shahi Snan Calendar</h3>
            </div>
            <button className="text-xs bg-white text-orange-500 px-2 py-1 rounded-full">
              View All
            </button>
          </div>
          
          <div className="p-3">
            <div className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-orange-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-800">{shahiSnanEvents[0].description}</h4>
                  <div className="text-sm text-gray-600 font-medium">{shahiSnanEvents[0].date}</div>
                </div>
                <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  {shahiSnanEvents[0].crowdLevel}
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <FaClock className="mr-1 text-orange-500" />
                {shahiSnanEvents[0].time}
              </div>
              
              <div className="flex items-center text-xs text-gray-600">
                <FaMapMarkerAlt className="mr-1 text-orange-500" />
                {shahiSnanEvents[0].location}
              </div>
              
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <FaUsers className="mr-1 text-orange-500" />
                <span>Expected attendance: 500,000+ pilgrims</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              {shahiSnanEvents.slice(1).map((event, index) => (
                <div key={index} className="bg-white rounded-lg p-2 flex-1 mx-1 shadow-sm border border-orange-100">
                  <div className="text-xs font-bold text-gray-800">{event.description}</div>
                  <div className="text-xs text-gray-600">{event.date}</div>
                  <div className="text-xs text-gray-500 mt-1">{event.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* All services section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">All Services</h3>
          <div className="flex items-center text-xs text-orange-500">
            <FaInfoCircle className="mr-1" size={12} />
            <span>Official App of Simhastha 2028</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {allServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => onNavigate(service.id)}
              className="flex flex-col items-center"
            >
              <div className={`w-14 h-14 ${service.color} rounded-full flex items-center justify-center text-white shadow-sm mb-1`}>
                <service.icon size={20} />
              </div>
              <span className={`text-xs text-gray-700 text-center`}>{service.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Modern Floating Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 pb-3 px-4 z-20">
        <div className="bg-white rounded-2xl shadow-lg px-2 py-3 flex justify-between items-center">
          {bottomNavItems.map(item => (
            <div 
              key={item.id}
              className="flex flex-col items-center px-1"
              onClick={() => onNavigate(item.id)}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${item.active ? 'bg-orange-50' : ''}`}>
                <item.icon 
                  className={item.active ? "text-orange-500" : "text-gray-400"} 
                  size={20} 
                />
              </div>
              <span className={`text-xs mt-1 ${item.active ? "text-orange-500 font-medium" : "text-gray-400"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add CSS for hiding scrollbar but allowing scroll functionality */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MelaHome; 