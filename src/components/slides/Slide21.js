import React from 'react';
import { motion } from 'framer-motion';
import Slide from '../Slide';

const MelaApp = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url(/public/pattern.svg)] bg-repeat opacity-5"></div>
        </div>
        
        {/* Content container */}
        <div className="container mx-auto h-full flex items-center">
          {/* Text content - left side */}
          <div className="w-1/2 text-white p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-5xl font-bold mb-6">MELA App for Simhastha</h1>
              <p className="text-xl text-indigo-200 mb-8">
                A comprehensive mobile experience designed for pilgrims attending 
                the Simhastha Kumbh Mela, providing essential services and information
                for a smooth spiritual journey.
              </p>
              <div className="flex flex-col space-y-4 text-lg mb-10">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-400 mr-3"></div>
                  <span>Real-time crowd management & alerts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-400 mr-3"></div>
                  <span>Lost & found services</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-400 mr-3"></div>
                  <span>Sacred locations & event schedules</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-400 mr-3"></div>
                  <span>Emergency assistance & health services</span>
                </div>
              </div>
              
              {/* QR Code Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center mt-8"
              >
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <img src="/qr.png" alt="MELA App QR Code" className="w-32 h-32" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-1">Scan to Experience</h3>
                  <p className="text-indigo-200">
                    Access the MELA App directly on your mobile device
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Mobile phone frame - right side */}
          <div className="w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              {/* Phone frame - now with increased width */}
              <div className="relative w-[380px] h-[760px] rounded-[40px] bg-black overflow-hidden shadow-2xl border-[14px] border-black">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-xl z-20"></div>
                
                {/* iframe container */}
                <div className="w-full h-full overflow-hidden rounded-[26px]">
                  <iframe 
                    src="https://melaapp.vercel.app/" 
                    className="w-full h-full border-0"
                    title="MELA App for Simhastha"
                  ></iframe>
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-200 rounded-full z-20"></div>
              </div>
              
              {/* Phone shadow - also adjusted */}
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-[340px] h-[24px] bg-black/20 blur-xl rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default MelaApp; 