import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Slide from '../Slide';

// Add this noise SVG for texture
const NoiseBg = () => (
  <svg className="absolute inset-0 opacity-[0.015] w-full h-full"
    viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <filter id='noiseFilter'>
      <feTurbulence 
        type='fractalNoise' 
        baseFrequency='0.65' 
        numOctaves='3' 
        stitchTiles='stitch' />
    </filter>
    <rect width='100%' height='100%' filter='url(#noiseFilter)' />
  </svg>
);

const Slide2 = ({ isActive }) => {
  const [showTint, setShowTint] = useState(false);
  const videoRef = useRef(null);

  const visionPoints = [
    {
      title: "Build the Foundation",
      subtitle: "Advanced Infrastructure",
      description: "City-wide surveillance system, connected to state-of-art command center",
      accent: "text-white"
    },
    {
      title: "Add Intelligence",
      subtitle: "Smart Analytics",
      description: "Like having thousands of alert guards watching over our city 24/7",
      accent: "text-white"
    },
    {
      title: "Ready for Growth",
      subtitle: "Future-Proof",
      description: "Seamlessly scale our security for major events like Rath Yatra",
      accent: "text-white"
    }
  ];

  // Add video background component with darker tint handling
  const VideoBackground = () => {
    useEffect(() => {
      if (videoRef.current) {
        const handleTimeUpdate = () => {
          const timeLeft = videoRef.current.duration - videoRef.current.currentTime;
          if (timeLeft < 2) { // Start showing tint earlier, at 2 seconds before end
            setShowTint(true);
          }
        };

        videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          }
        };
      }
    }, []);

    return (
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-[1.25] origin-bottom"
          autoPlay
          muted
          playsInline
          playbackRate={0.5}
        >
          <source src="/puri/drone2.mov" type="video/mp4" />
        </video>
        
        {/* Permanent dark overlay - reduced to 70% */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        
        {/* Additional tint overlay that fades in near video end - changed to 80% */}
        <motion.div 
          className="absolute inset-0 bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: showTint ? 0.80 : 0 }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>
    );
  };

  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
        <AnimatePresence>
          <VideoBackground />
        </AnimatePresence>

        {/* Remove gradient orbs and reduce noise opacity further */}
        <div className="opacity-30">
          <NoiseBg />
        </div>

        {/* Keep vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/90" />

        <div className="relative z-10 flex flex-col h-full text-white">
          {/* Update text classes for better visibility */}
          <motion.div
            className="pt-16 px-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.p 
              className="text-2xl font-light tracking-wide text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              The Vision
            </motion.p>
            <motion.h2
              className="text-7xl font-bold tracking-tight leading-tight text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Three steps to a<br />safer City.
            </motion.h2>
          </motion.div>

          {/* Vision Points with updated text colors */}
          <div className="flex-1 flex items-center px-16">
            <div className="grid grid-cols-3 gap-16 w-full">
              {visionPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 1 + (index * 0.2), 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <motion.span 
                    className="block text-8xl font-bold opacity-20 mb-4 text-white"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.2 }}
                    transition={{ delay: 1.2 + (index * 0.2), duration: 0.5 }}
                  >
                    0{index + 1}
                  </motion.span>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold mb-1 text-white">
                        {point.title}
                      </h3>
                      <p className="text-lg text-white font-medium">
                        {point.subtitle}
                      </p>
                    </div>
                    
                    <p className="text-base text-white leading-relaxed">
                      {point.description}
                    </p>
                  </div>

                  {/* Update decorative line */}
                  <motion.div 
                    className="absolute -top-8 left-0 h-[1px] bg-white opacity-30"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.5 + (index * 0.2), duration: 0.8 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom quote with updated color */}
          <motion.div
            className="text-center pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <p className="text-lg font-light tracking-wide text-white">
              Embracing technology to protect our heritage
            </p>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide2; 