import { motion } from 'framer-motion';
import Slide from '../Slide';
import { FaCity } from 'react-icons/fa';
import { SiGoogleanalytics } from 'react-icons/si';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { useEffect, useState } from 'react';

const Slide1 = ({ isActive }) => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Modernizing Safety & Security for our Cities";
  
  useEffect(() => {
    if (isActive) {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 200); // Changed from 50 to 200 milliseconds for slower typing

      return () => clearInterval(typingInterval);
    } else {
      setDisplayText('');
    }
  }, [isActive]);

  // Particle effect for the background
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  return (
    <Slide isActive={isActive}>
      {/* Background Video Container */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src="/puri/dronetemple1.mov"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                width: particle.size,
                height: particle.size
              }}
              initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
              animate={{
                y: [`${particle.y}%`, `${particle.y - 20}%`],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-white z-10">
        {/* City Icon with Glow Effect */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1, delay: 0.2 }}
        >
          <FaCity className="text-7xl text-orange-400 filter drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
        </motion.div>

        {/* Main Title with Animated Underline */}
        <motion.div 
          className="relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <h1 className="text-8xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-white">
            Safe & Smart City
          </h1>
          <motion.div 
            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          />
        </motion.div>

        {/* Subtitle with Glow */}
        <motion.h2 
          className="text-4xl font-semibold mb-8 mt-12 text-center text-orange-300 filter drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          Safer City, Safer Future
        </motion.h2>

        {/* Description with Typing Effect */}
        <motion.p 
          className="text-2xl text-center max-w-2xl mx-auto text-gray-100 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {displayText}
          <motion.span
            className="inline-block w-0.5 h-5 bg-white ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.p>

        {/* Press Any Key Prompt */}
        <motion.div
          className="absolute bottom-8 left-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-lg font-medium tracking-wider text-orange-200 filter drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]">Press Any Key to Continue</p>
        </motion.div>
      </div>
    </Slide>
  );
};

export default Slide1;