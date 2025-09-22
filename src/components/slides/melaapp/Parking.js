import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaParking, FaCar, FaBus, FaMotorcycle } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const Parking = ({ goBack }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [vehicleType, setVehicleType] = useState('car');
  
  // Ujjain center coordinates
  const center = { lat: 23.1793, lng: 75.7849 };
  
  // Simulated parking locations near Ujjain
  const parkingSpots = [
    { id: 1, type: 'car', name: 'Ram Ghat Parking', location: { lat: 23.1823, lng: 75.7679 }, available: 45, total: 100 },
    { id: 2, type: 'car', name: 'Mahakal Temple Parking', location: { lat: 23.1882, lng: 75.7689 }, available: 12, total: 200 },
    { id: 3, type: 'bus', name: 'City Center Bus Parking', location: { lat: 23.1753, lng: 75.7841 }, available: 8, total: 30 },
    { id: 4, type: 'motorcycle', name: 'Freeganj Tower Parking', location: { lat: 23.1743, lng: 75.7939 }, available: 120, total: 150 },
    { id: 5, type: 'car', name: 'Railway Station Parking', location: { lat: 23.1633, lng: 75.7932 }, available: 67, total: 120 },
  ];
  
  // Filter spots based on selected vehicle type
  const filteredSpots = vehicleType === 'all' 
    ? parkingSpots 
    : parkingSpots.filter(spot => spot.type === vehicleType);
  
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
      <div className="bg-blue-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Parking Locations</h1>
            <p className="text-sm opacity-80">Find and navigate to available parking</p>
          </div>
        </div>
      </div>
      
      {/* Vehicle type selector */}
      <div className="p-4 bg-white border-b">
        <div className="flex justify-between">
          <button 
            onClick={() => setVehicleType('all')}
            className={`flex flex-col items-center p-2 rounded-lg ${vehicleType === 'all' ? 'bg-blue-50 text-blue-500' : 'text-gray-500'}`}
          >
            <FaParking size={20} />
            <span className="text-xs mt-1">All</span>
          </button>
          <button 
            onClick={() => setVehicleType('car')}
            className={`flex flex-col items-center p-2 rounded-lg ${vehicleType === 'car' ? 'bg-blue-50 text-blue-500' : 'text-gray-500'}`}
          >
            <FaCar size={20} />
            <span className="text-xs mt-1">Car</span>
          </button>
          <button 
            onClick={() => setVehicleType('bus')}
            className={`flex flex-col items-center p-2 rounded-lg ${vehicleType === 'bus' ? 'bg-blue-50 text-blue-500' : 'text-gray-500'}`}
          >
            <FaBus size={20} />
            <span className="text-xs mt-1">Bus</span>
          </button>
          <button 
            onClick={() => setVehicleType('motorcycle')}
            className={`flex flex-col items-center p-2 rounded-lg ${vehicleType === 'motorcycle' ? 'bg-blue-50 text-blue-500' : 'text-gray-500'}`}
          >
            <FaMotorcycle size={20} />
            <span className="text-xs mt-1">Bike</span>
          </button>
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
            {filteredSpots.map(spot => (
              <Marker
                key={spot.id}
                position={spot.location}
                onClick={() => setSelectedMarker(spot)}
              />
            ))}
            
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.location}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-gray-800">{selectedMarker.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedMarker.available} spaces available out of {selectedMarker.total}
                  </p>
                  <div className="mt-2">
                    <button className="bg-blue-500 text-white text-xs py-1 px-2 rounded">
                      Navigate
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      
      {/* Parking list */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="font-bold text-gray-700 mb-3">Available Parking Spots</h2>
          
          {filteredSpots.map(spot => (
            <motion.div
              key={spot.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: spot.id * 0.1 }}
              className="bg-white rounded-lg shadow mb-3 overflow-hidden"
            >
              <div className="flex items-center p-3 border-l-4 border-blue-500">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{spot.name}</h3>
                  <div className="flex items-center text-sm mt-1">
                    <span className={spot.available > 10 ? "text-green-500" : "text-orange-500"}>
                      {spot.available} available
                    </span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-gray-500">{spot.total} total</span>
                  </div>
                </div>
                <div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    Book
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 px-3 py-2 flex justify-between text-xs">
                <span className="text-blue-700">1.2 km away</span>
                <span className="text-blue-700 font-medium">₹50/hour</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Parking; 