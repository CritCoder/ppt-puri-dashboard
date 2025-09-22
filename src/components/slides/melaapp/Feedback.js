import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaSmile, FaMeh, FaFrown, FaCamera, FaCheck } from 'react-icons/fa';

const Feedback = ({ goBack }) => {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const feedbackTypes = [
    { id: 'facilities', label: 'Facilities', description: 'Toilets, water, etc.' },
    { id: 'cleanliness', label: 'Cleanliness', description: 'Waste management, area hygiene' },
    { id: 'security', label: 'Security', description: 'Safety & crowd management' },
    { id: 'events', label: 'Events', description: 'Programs & ceremonies' },
    { id: 'transportation', label: 'Transportation', description: 'Parking, shuttles, traffic' },
    { id: 'other', label: 'Other', description: 'Any other feedback' },
  ];

  const submitFeedback = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full"
      >
        <div className="bg-green-500 text-white p-4">
          <div className="flex items-center">
            <button onClick={goBack} className="mr-4">
              <FaArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Feedback</h1>
              <p className="text-sm opacity-80">Help us improve</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <FaCheck className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-8">Your feedback has been submitted successfully. We appreciate your input to improve the Simhastha experience.</p>
          <button
            onClick={goBack}
            className="bg-green-500 text-white py-3 px-6 rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-green-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Feedback</h1>
            <p className="text-sm opacity-80">Help us improve</p>
          </div>
        </div>
      </div>
      
      {/* Rating */}
      <div className="bg-white p-6 border-b">
        <h2 className="text-center text-lg font-medium text-gray-800 mb-4">
          Rate your overall Simhastha 2028 experience
        </h2>
        <div className="flex justify-center space-x-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileTap={{ scale: 1.2 }}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <FaStar 
                size={36} 
                className={star <= rating ? "text-yellow-400" : "text-gray-300"} 
              />
            </motion.button>
          ))}
        </div>
        <div className="flex justify-between mt-4 px-4">
          <div className="flex flex-col items-center">
            <FaFrown size={20} className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Poor</span>
          </div>
          <div className="flex flex-col items-center">
            <FaMeh size={20} className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Average</span>
          </div>
          <div className="flex flex-col items-center">
            <FaSmile size={20} className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Excellent</span>
          </div>
        </div>
      </div>
      
      {/* Feedback Form */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-3">What are you providing feedback about?</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {feedbackTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFeedbackType(type.id)}
                className={`p-3 rounded-lg border text-left ${
                  feedbackType === type.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-gray-800">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Your comments</label>
            <textarea
              placeholder="Please share your experience or suggestions..."
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:border-green-500"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <button className="w-full border border-dashed border-gray-300 py-3 rounded-lg text-gray-500 flex items-center justify-center">
              <FaCamera className="mr-2" />
              Add Photos (optional)
            </button>
          </div>
          
          <button
            onClick={submitFeedback}
            disabled={!rating || !feedbackType}
            className={`w-full py-3 rounded-lg font-medium ${
              rating && feedbackType 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Feedback; 