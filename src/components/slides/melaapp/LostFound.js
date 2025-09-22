import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch, FaPlus, FaUser, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const LostFound = ({ goBack }) => {
  const [activeTab, setActiveTab] = useState('lost');
  
  // Sample data for lost and found items
  const lostItems = [
    { id: 1, type: 'wallet', name: 'Brown Leather Wallet', location: 'Near Ram Ghat', time: '2 hours ago', image: '/melaapp/wallet.jpg', description: 'Contains ID cards and some cash', contact: '9876543210' },
    { id: 2, type: 'phone', name: 'Samsung Galaxy Phone', location: 'Mahakal Temple Entrance', time: '5 hours ago', image: '/melaapp/phone.jpg', description: 'Black color with cracked screen', contact: '9876543211' },
    { id: 3, type: 'bag', name: 'Red Backpack', location: 'Food Court Area', time: '1 day ago', image: '/melaapp/bag.jpg', description: 'Contains clothes and personal items', contact: '9876543212' }
  ];
  
  const foundItems = [
    { id: 1, type: 'watch', name: 'Gold Wristwatch', location: 'Harsiddhi Temple', time: '3 hours ago', image: '/melaapp/watch.jpg', description: 'Found near the entrance', contact: 'Police Booth #3' },
    { id: 2, type: 'glasses', name: 'Spectacles', location: 'Near Parking Lot B', time: '7 hours ago', image: '/melaapp/glasses.jpg', description: 'In a black case', contact: 'Lost & Found Center' }
  ];
  
  const items = activeTab === 'lost' ? lostItems : foundItems;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-purple-500 text-white p-4">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Lost & Found</h1>
            <p className="text-sm opacity-80">Report or find lost items</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 font-medium text-center ${activeTab === 'lost' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('lost')}
        >
          Lost Items
        </button>
        <button
          className={`flex-1 py-3 font-medium text-center ${activeTab === 'found' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('found')}
        >
          Found Items
        </button>
      </div>
      
      {/* Search bar */}
      <div className="p-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {/* Items list */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow mb-4 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden mr-3">
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-400 text-xs">Image</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                      <FaMapMarkerAlt className="text-purple-400 mr-1" size={12} />
                      {item.location}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="text-purple-400 mr-1" size={12} />
                      {item.time}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {item.description}
                </div>
              </div>
              <div className="bg-purple-50 p-3 flex justify-between items-center">
                <span className="text-sm text-purple-700">Contact: {item.contact}</span>
                <button className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm">
                  {activeTab === 'lost' ? 'I Found It' : 'Claim'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Add button */}
      <button className="absolute bottom-20 right-4 w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
        <FaPlus size={20} />
      </button>
    </motion.div>
  );
};

export default LostFound; 