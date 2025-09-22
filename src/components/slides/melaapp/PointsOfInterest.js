import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkedAlt, FaStar, FaDirections, FaInfoCircle } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const PointsOfInterest = ({ goBack }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [category, setCategory] = useState('all');
  
  // Ujjain center coordinates
  const center = { lat: 23.1793, lng: 75.7849 };
  
  // POI categories
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'temples', label: 'Temples' },
    { id: 'ghats', label: 'Ghats' },
    { id: 'food', label: 'Food' },
    { id: 'accommodation', label: 'Stay' }
  ];
  
  // Sample POI data for Ujjain
  const pointsOfInterest = [
    { 
      id: 1, 
      name: 'Mahakaleshwar Temple', 
      type: 'temples',
      location: { lat: 23.1828, lng: 75.7682 }, 
      rating: 4.8,
      image: '/melaapp/mahakal.jpg',
      description: 'One of the 12 Jyotirlingas, dedicated to Lord Shiva.',
      openHours: '4:00 AM - 11:00 PM',
      distance: '1.2 km'
    },
    { 
      id: 2, 
      name: 'Ram Ghat', 
      type: 'ghats',
      location: { lat: 23.1823, lng: 75.7679 }, 
      rating: 4.5,
      image: '/melaapp/ramghat.jpg',
      description: 'Sacred bathing ghat on the banks of Shipra River.',
      openHours: 'Open 24 hours',
      distance: '1.5 km'
    },
    { 
      id: 3, 
      name: 'Harsiddhi Temple', 
      type: 'temples',
      location: { lat: 23.1843, lng: 75.7689 }, 
      rating: 4.6,
      image: '/melaapp/harsiddhi.jpg',
      description: 'Ancient temple dedicated to Goddess Annapurna.',
      openHours: '5:00 AM - 9:00 PM',
      distance: '2.1 km'
    },
    { 
      id: 4, 
      name: 'Sandipani Ashram', 
      type: 'temples',
      location: { lat: 23.2051, lng: 75.7744 }, 
      rating: 4.4,
      image: '/melaapp/sandipani.jpg',
      description: 'Ancient center of learning where Lord Krishna received education.',
      openHours: '6:00 AM - 8:00 PM',
      distance: '3.2 km'
    },
    { 
      id: 5, 
      name: 'Kumbh Food Court', 
      type: 'food',
      location: { lat: 23.1783, lng: 75.7839 }, 
      rating: 4.2,
      image: '/melaapp/food.jpg',
      description: 'Large food court with variety of traditional foods.',
      openHours: '7:00 AM - 11:00 PM',
      distance: '0.8 km'
    }
  ];
  
  // Filter POIs based on selected category
  const filteredPOIs = category === 'all' 
    ? pointsOfInterest
    : pointsOfInterest.filter(poi => poi.type === category);
  
  const mapContainerStyle = {
    width: '100%',
    height: '300px',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-indigo-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Points of Interest</h1>
            <p className="text-sm opacity-80">Discover ghats, temples & more</p>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="p-3 bg-white border-b flex space-x-2 overflow-auto">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              category === cat.id 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white border border-gray-300 text-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* Map */}
      <div className="w-full">
        <LoadScript googleMapsApiKey="AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={14}
          >
            {filteredPOIs.map(poi => (
              <Marker
                key={poi.id}
                position={poi.location}
                onClick={() => setSelectedMarker(poi)}
              />
            ))}
            
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.location}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-gray-800">{selectedMarker.name}</h3>
                  <div className="flex items-center mt-1">
                    <FaStar className="text-yellow-400 mr-1" size={12} />
                    <span className="text-sm">{selectedMarker.rating}</span>
                  </div>
                  <div className="mt-2">
                    <button className="bg-indigo-500 text-white text-xs py-1 px-2 rounded">
                      Directions
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      
      {/* POI list */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4">
          {filteredPOIs.map((poi, index) => (
            <motion.div
              key={poi.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow mb-4 overflow-hidden"
            >
              <div className="h-32 bg-indigo-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                  <span className="text-sm">Image</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">{poi.name}</h3>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" size={14} />
                    <span className="text-sm font-medium">{poi.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2 mb-3">
                  {poi.description}
                </p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{poi.openHours}</span>
                  <span>{poi.distance}</span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm flex items-center justify-center">
                    <FaDirections className="mr-1" />
                    Directions
                  </button>
                  <button className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg text-sm flex items-center justify-center">
                    <FaInfoCircle className="mr-1" />
                    Details
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

export default PointsOfInterest; 