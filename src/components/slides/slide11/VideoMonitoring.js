import { motion } from 'framer-motion';
import { BiFullscreen, BiX, BiVideo, BiGrid, BiFullscreen as BiExpand } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import { MdOutlineSettingsInputAntenna } from 'react-icons/md';

const VideoCell = ({ channel, isActive = false, onExpand }) => {
  // Modify getVideoSource to repeat the pattern every 4 channels
  const getVideoSource = (channelNum) => {
    // Convert channel numbers to 1-4 pattern
    const normalizedChannel = ((channelNum - 1) % 4) + 1;
    switch(normalizedChannel) {
      case 1: return "/carvideos/anpr1.mp4";
      case 2: return "/carvideos/anpr2.mov";
      case 3: return "/carvideos/anpr3.mov";
      case 4: return "/carvideos/anpr5.mov";
      default: return "/carvideos/anpr1.mp4";
    }
  };

  return (
    <div className="bg-black/40 relative w-full h-full backdrop-blur-sm" 
      style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
    >
      {isActive ? (
        <div className="absolute inset-0 group">
          <div className="w-full h-full">
            <div className="w-full h-full bg-black">
              <video 
                className="w-full h-full block transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ objectFit: 'cover' }}
                playsInline
                autoPlay
                muted
                loop
                src={getVideoSource(channel)}
              />
            </div>
          </div>
          {/* Elegant overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Channel info with better styling */}
          <div className="absolute top-3 left-3 z-10 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center bg-black/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
              <BiVideo className="text-purple-500 mr-2" />
              <span className="text-xs font-medium text-white">Channel {channel}</span>
            </div>
          </div>

          {/* Control buttons */}
          <div className="absolute top-3 right-3 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={onExpand}
              className="bg-black/80 backdrop-blur-md p-2 rounded-full hover:bg-black/90 border border-white/10 transition-colors"
            >
              <BiFullscreen className="text-white text-sm" />
            </button>
            <button className="bg-black/80 backdrop-blur-md p-2 rounded-full hover:bg-black/90 border border-white/10 transition-colors">
              <BiX className="text-white text-sm" />
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BiVideo className="text-3xl mb-2 mx-auto" />
            <div className="text-xs">No Signal</div>
          </div>
        </div>
      )}
    </div>
  );
};

const FullScreenVideo = ({ onClose }) => {
  return (
    <div className="relative w-full h-full bg-black">
      <video 
        className="w-full h-full"
        style={{ objectFit: 'cover' }}
        playsInline
        autoPlay
        muted
        loop
        src="/vms3.mov"
      />
      <div className="absolute top-3 right-3 z-10 flex space-x-2">
        <button 
          onClick={onClose}
          className="bg-black/80 backdrop-blur-md p-2 rounded-full hover:bg-black/90 border border-white/10 transition-colors"
        >
          <BiX className="text-white text-sm" />
        </button>
      </div>
    </div>
  );
};

const ViewToggle = ({ isGridView, onToggle, isRemoteStream }) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
      <button 
        onClick={() => onToggle('grid')}
        className={`p-3 rounded-full backdrop-blur-md border transition-all
          ${isGridView 
            ? 'bg-purple-500/20 border-purple-500/50 text-purple-500' 
            : 'bg-black/50 border-white/10 text-white/70 hover:bg-black/70'}`}
      >
        <BiGrid className="text-xl" />
      </button>
      <button 
        onClick={() => onToggle('full')}
        className={`p-3 rounded-full backdrop-blur-md border transition-all
          ${!isGridView && !isRemoteStream
            ? 'bg-purple-500/20 border-purple-500/50 text-purple-500' 
            : 'bg-black/50 border-white/10 text-white/70 hover:bg-black/70'}`}
      >
        <BiExpand className="text-xl" />
      </button>
      <button 
        onClick={() => onToggle('remote')}
        className={`p-3 rounded-full backdrop-blur-md border transition-all
          ${isRemoteStream 
            ? 'bg-purple-500/20 border-purple-500/50 text-purple-500' 
            : 'bg-black/50 border-white/10 text-white/70 hover:bg-black/70'}`}
      >
        <MdOutlineSettingsInputAntenna className="text-xl" />
      </button>
    </div>
  );
};

const ConnectingAnimation = () => {
  return (
    <motion.div 
      className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-30"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 mb-6 mx-auto relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated circles */}
          <motion.div 
            className="absolute inset-0 border-4 border-purple-500/20 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute inset-0 border-4 border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <MdOutlineSettingsInputAntenna className="text-4xl text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        <motion.h3 
          className="text-xl font-medium text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Connecting to Command Center
        </motion.h3>
        <motion.div 
          className="flex items-center justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const VideoMonitoring = () => {
  const [view, setView] = useState('grid');
  const [isConnecting, setIsConnecting] = useState(true);
  const totalCells = 16;
  // Update activeCells to include 4 rows of the same pattern
  const activeCells = [
    1, 2, 3, 4,     // First row
    5, 6, 7, 8,     // Second row
    9, 10, 11, 12,  // Third row
    13, 14, 15, 16  // Fourth row
  ];

  useEffect(() => {
    // Hide connecting animation after 2.5 seconds
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleViewToggle = (newView) => {
    setView(newView);
  };

  return (
    <motion.div 
      className="flex-1 h-full pt-16 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ViewToggle 
        isGridView={view === 'grid'}
        isRemoteStream={view === 'remote'}
        onToggle={handleViewToggle}
      />

      {isConnecting && <ConnectingAnimation />}

      {view === 'grid' && (
        <motion.div 
          className="w-full h-full grid grid-cols-4 bg-black/20 backdrop-blur-sm"
          style={{ 
            gridAutoRows: '1fr',
            gap: '1px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        >
          {[...Array(totalCells)].map((_, index) => (
            <VideoCell 
              key={index + 1}
              channel={index + 1}
              isActive={activeCells.includes(index + 1)}
              onExpand={() => setView('full')}
            />
          ))}
        </motion.div>
      )}

      {view === 'full' && (
        <FullScreenVideo onClose={() => setView('grid')} />
      )}

      {view === 'remote' && (
        <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center text-gray-400">
            <MdOutlineSettingsInputAntenna className="text-6xl mb-4 mx-auto" />
            <p className="text-lg">Connecting to Remote Stream...</p>
            <p className="text-sm mt-2">Attempting to establish connection</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VideoMonitoring; 