import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHospital, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhoneAlt, FaClock, FaDirections } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const HealthCamps = ({ goBack }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Ujjain center coordinates
  const center = { lat: 23.1793, lng: 75.7849 };
  
  // Filter categories
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'general', label: 'General' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'specialist', label: 'Specialist' }
  ];
  
  // Sample health camp data
  const healthCamps = [
    {
      id: 1,
      name: 'Mahakal Medical Camp',
      type: 'general',
      location: { lat: 23.1828, lng: 75.7702 },
      address: 'Near Mahakaleshwar Temple',
      contact: '0734-2556789',
      timing: '24 Hours',
      distance: '0.9 km',
      doctors: 8,
      services: ['First Aid', 'General Medicine', 'Basic Emergency']
    },
    {
      id: 2,
      name: 'Ram Ghat Health Center',
      type: 'general',
      location: { lat: 23.1823, lng: 75.7659 },
      address: 'Ram Ghat Road, Ujjain',
      contact: '0734-2556790',
      timing: '8:00 AM - 10:00 PM',
      distance: '1.2 km',
      doctors: 6,
      services: ['General Medicine', 'ORS Distribution', 'Basic Testing']
    },
    {
      id: 3,
      name: 'Kumbh Emergency Hospital',
      type: 'emergency',
      location: { lat: 23.1753, lng: 75.7841 },
      address: 'Central Mela Area, Ujjain',
      contact: '0734-2550108',
      timing: '24 Hours',
      distance: '1.8 km',
      doctors: 15,
      services: ['Emergency Care', 'ICU', 'Ambulance', 'Surgery']
    },
    {
      id: 4,
      name: 'Specialist Consultation Center',
      type: 'specialist',
      location: { lat: 23.1743, lng: 75.7939 },
      address: 'Near Freeganj Tower',
      contact: '0734-2556123',
      timing: '9:00 AM - 6:00 PM',
      distance: '2.3 km',
      doctors: 10,
      services: ['Cardiology', 'Orthopedics', 'Pulmonology', 'Dermatology']
    }
  ];
  
  // Filter camps based on selected filter
  const filteredCamps = activeFilter === 'all' 
    ? healthCamps
    : healthCamps.filter(camp => camp.type === activeFilter);
  
  const mapContainerStyle = {
    width: '100%',
    height: '250px',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-pink-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Health Camps</h1>
            <p className="text-sm opacity-80">Medical facilities around Simhastha</p>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="w-full">
        <LoadScript googleMapsApiKey="AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={14}
          >
            {filteredCamps.map(camp => (
              <Marker
                key={camp.id}
                position={camp.location}
                onClick={() => setSelectedMarker(camp)}
              />
            ))}
            
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.location}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-gray-800">{selectedMarker.name}</h3>
                  <div className="flex items-center mt-1 text-xs">
                    <FaClock className="text-pink-400 mr-1" size={10} />
                    <span>{selectedMarker.timing}</span>
                  </div>
                  <div className="mt-2">
                    <button className="bg-pink-500 text-white text-xs py-1 px-2 rounded">
                      Directions
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      
      {/* Filters */}
      <div className="p-3 bg-white border-b flex space-x-2 overflow-auto">
        {filters.map(filter => (
          <button 
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              activeFilter === filter.id 
                ? 'bg-pink-500 text-white' 
                : 'bg-white border border-gray-300 text-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      {/* Health Camps List */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4">
          {filteredCamps.map((camp, index) => (
            <motion.div
              key={camp.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow mb-4 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{camp.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    camp.type === 'emergency' 
                      ? 'bg-red-100 text-red-700' 
                      : camp.type === 'specialist' 
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {camp.type === 'emergency' ? 'Emergency' : camp.type === 'specialist' ? 'Specialist' : 'General'}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="text-pink-400 mr-1" size={12} />
                  <span>{camp.address}</span>
                  <span className="ml-auto text-xs font-medium">{camp.distance}</span>
                </div>
                
                <div className="mt-1 text-sm text-gray-500 flex items-center">
                  <FaClock className="text-pink-400 mr-1" size={12} />
                  <span>{camp.timing}</span>
                </div>
                
                <div className="mt-1 text-sm text-gray-500 flex items-center">
                  <FaUser className="text-pink-400 mr-1" size={12} />
                  <span>{camp.doctors} Doctors available</span>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">SERVICES</h4>
                  <div className="flex flex-wrap gap-1">
                    {camp.services.map(service => (
                      <span 
                        key={service} 
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-pink-500 text-white py-2 rounded-lg text-sm flex items-center justify-center">
                    <FaDirections className="mr-1" />
                    Directions
                  </button>
                  <button className="flex-1 border border-pink-500 text-pink-500 py-2 rounded-lg text-sm flex items-center justify-center">
                    <FaPhoneAlt className="mr-1" />
                    Call
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HealthCamps; 