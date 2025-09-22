import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaMapMarkerAlt, FaCamera, FaCheck } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const WasteReporting = ({ goBack }) => {
  const [step, setStep] = useState(1);
  const [wasteType, setWasteType] = useState('');
  
  // Ujjain center coordinates
  const center = { lat: 23.1793, lng: 75.7849 };
  
  const wasteTypes = [
    { id: 'general', label: 'General Waste', description: 'Litter, plastic, wrappers' },
    { id: 'water', label: 'Water Pollution', description: 'In ghats or water bodies' },
    { id: 'toilet', label: 'Toilet Issues', description: 'Cleanliness or maintenance' },
    { id: 'food', label: 'Food Waste', description: 'Large amounts of food waste' },
    { id: 'bulk', label: 'Bulk Waste', description: 'Large dumping of waste' },
    { id: 'hazardous', label: 'Hazardous Waste', description: 'Dangerous/medical waste' }
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">Select Waste Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {wasteTypes.map(type => (
                <motion.button
                  key={type.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`flex flex-col items-start p-4 rounded-lg border-2 ${
                    wasteType === type.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setWasteType(type.id);
                    setStep(2);
                  }}
                >
                  <span className="font-medium text-gray-800">{type.label}</span>
                  <span className="text-xs text-gray-500 mt-1">{type.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Mark Location</h2>
            <div className="mb-4">
              <LoadScript googleMapsApiKey="AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker
                    position={center}
                    draggable={true}
                  />
                </GoogleMap>
              </LoadScript>
              <div className="text-center mt-2 text-sm text-gray-500">
                Drag the marker to exact location of waste
              </div>
            </div>
            <div className="flex space-x-2 mb-6">
              <button 
                className="flex-1 bg-orange-100 text-orange-700 py-3 rounded-lg text-sm font-medium"
                onClick={() => setStep(3)}
              >
                Confirm Location
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium">
                Use Current Location
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Details</h2>
            <div className="mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Add Photo</label>
                <button className="w-full border-2 border-dashed border-orange-300 py-10 rounded-lg bg-orange-50 flex flex-col items-center justify-center">
                  <FaCamera className="text-orange-400 text-2xl mb-2" />
                  <span className="text-orange-500 text-sm">Tap to take photo</span>
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Describe the waste issue in detail..."
                  className="w-full p-3 h-20 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Severity</label>
                <div className="flex">
                  {['Low', 'Medium', 'High'].map((level, index) => (
                    <button
                      key={level}
                      className={`flex-1 py-2 ${
                        index === 1 
                          ? 'bg-orange-200 text-orange-700' 
                          : 'bg-gray-100 text-gray-700'
                      } ${
                        index === 0 ? 'rounded-l-lg' : index === 2 ? 'rounded-r-lg' : ''
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button 
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg text-sm font-medium"
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
              <FaCheck className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Report Submitted</h2>
            <p className="text-gray-600 mb-6">Thank you for helping keep Simhastha clean. Your report has been sent to the sanitation team.</p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Report ID:</span>
                <span className="font-medium">WST-2023-1298</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ETA for cleanup:</span>
                <span className="font-medium">Within 3 hours</span>
              </div>
            </div>
            
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
      <div className="bg-orange-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Report Waste</h1>
            <p className="text-sm opacity-80">Help keep Simhastha clean</p>
          </div>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNum < step 
                  ? 'bg-orange-500 text-white' 
                  : stepNum === step 
                  ? 'bg-orange-100 text-orange-500 border-2 border-orange-500' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {stepNum < step ? <FaCheck size={12} /> : stepNum}
              </div>
              <div className="text-xs mt-1 text-gray-500">
                {stepNum === 1 ? 'Type' : stepNum === 2 ? 'Location' : stepNum === 3 ? 'Details' : 'Done'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Step Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {renderStepContent()}
      </div>
    </motion.div>
  );
};

export default WasteReporting; 