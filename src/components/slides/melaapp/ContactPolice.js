import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPhone, FaShieldAlt, FaMapMarkerAlt, FaExclamationCircle, FaUser, FaCamera } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const ContactPolice = ({ goBack }) => {
  const [emergencyType, setEmergencyType] = useState('');
  const [step, setStep] = useState(1);
  
  // Ujjain center coordinates
  const center = { lat: 23.1793, lng: 75.7849 };
  
  // Police station locations
  const policeStations = [
    { id: 1, name: 'Mahakal Police Station', location: { lat: 23.1840, lng: 75.7710 }, phone: '0734-2558444' },
    { id: 2, name: 'Kharakuan Police Station', location: { lat: 23.1783, lng: 75.7839 }, phone: '0734-2558446' },
    { id: 3, name: 'Mela Police Outpost', location: { lat: 23.1823, lng: 75.7779 }, phone: '0734-2555999' }
  ];
  
  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', icon: FaExclamationCircle, color: 'text-red-500' },
    { id: 'theft', label: 'Theft/Pickpocketing', icon: FaShieldAlt, color: 'text-blue-500' },
    { id: 'missing', label: 'Missing Person', icon: FaUser, color: 'text-yellow-500' },
    { id: 'other', label: 'Other Emergency', icon: FaExclamationCircle, color: 'text-purple-500' }
  ];
  
  const mapContainerStyle = {
    width: '100%',
    height: '250px',
  };
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Select Emergency Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {emergencyTypes.map(type => (
                <motion.button
                  key={type.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                    emergencyType === type.id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setEmergencyType(type.id);
                    setStep(2);
                  }}
                >
                  <type.icon className={`text-2xl ${type.color} mb-2`} />
                  <span className="text-sm text-center">{type.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Share Your Location</h2>
            <div className="mb-4">
              <LoadScript googleMapsApiKey="AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={14}
                >
                  {policeStations.map(station => (
                    <Marker
                      key={station.id}
                      position={station.location}
                    />
                  ))}
                  <Marker
                    position={center}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }}
                  />
                </GoogleMap>
              </LoadScript>
            </div>
            <div className="flex space-x-2 mb-6">
              <button 
                className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg text-sm font-medium"
                onClick={() => setStep(3)}
              >
                Use Current Location
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium">
                Set Location Manually
              </button>
            </div>
            <button 
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium"
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </div>
        );
      case 3:
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Describe Emergency</h2>
            <div className="mb-4">
              <textarea
                placeholder="Briefly describe the situation..."
                className="w-full p-3 h-32 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              ></textarea>
            </div>
            <div className="mb-4">
              <button className="w-full border border-dashed border-gray-300 py-3 rounded-lg text-gray-500 flex items-center justify-center">
                <FaCamera className="mr-2" />
                Add Photos (optional)
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button 
                className="flex-1 bg-red-500 text-white py-3 rounded-lg text-sm font-medium"
                onClick={() => setStep(4)}
              >
                Submit Report
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Report Submitted</h2>
            <p className="text-gray-600 mb-6">Emergency personnel have been notified and are on their way. Stay at your location.</p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Reference ID:</span>
                <span className="font-medium">EMG-2023-8742</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ETA:</span>
                <span className="font-medium">5-7 minutes</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-red-500 text-white py-3 rounded-lg flex items-center justify-center text-lg font-medium"
            >
              <FaPhone className="mr-2" />
              Emergency Call: 112
            </button>
            
            <button 
              className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg"
              onClick={goBack}
            >
              Return to Home
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-red-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Contact Police</h1>
            <p className="text-sm opacity-80">Report emergencies or get assistance</p>
          </div>
        </div>
      </div>
      
      {/* Emergency Buttons */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center">
          <FaPhone className="mr-2" />
          Emergency Call
        </button>
        <div className="flex space-x-2">
          <button className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
            Police Stations
          </button>
          <button className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
            Helplines
          </button>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {renderStepContent()}
      </div>
    </motion.div>
  );
};

export default ContactPolice; 