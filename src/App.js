import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Slide1 from './components/slides/Slide1';
import Slide2 from './components/slides/Slide2';
import Slide3 from './components/slides/Slide3';
import Slide4 from './components/slides/Slide4';
import Slide5 from './components/slides/Slide5';
import Slide6 from './components/slides/Slide6';
import Slide7 from './components/slides/Slide7';
import Slide8 from './components/slides/Slide8';
import Slide9 from './components/slides/Slide9';
import Slide10 from './components/slides/Slide10';
import Slide11 from './components/slides/Slide11';
import Slide13 from './components/slides/Slide13';
import Slide14 from './components/slides/Slide14';
import Slide15 from './components/slides/Slide15';
import Slide16 from './components/slides/Slide16';
import Slide17 from './components/slides/Slide17';
import Slide17_1 from './components/slides/Slide17_1';
import Slide18 from './components/slides/Slide18';
import Slide19 from './components/slides/Slide19';
import Slide20 from './components/slides/Slide20';
import Slide21 from './components/slides/Slide21';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';

function App() {
  const [currentSlide, setCurrentSlide] = useState(11);
  const totalSlides = 21;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Update keyboard navigation to include dependencies
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case 'Space':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [nextSlide, prevSlide]); // Add dependencies

  const slides = [
    <Slide1 key="slide1" isActive={currentSlide === 1} />,
    <Slide2 key="slide2" isActive={currentSlide === 2} />,
    <Slide3 key="slide3" isActive={currentSlide === 3} />,
    <Slide4 key="slide4" isActive={currentSlide === 4} />,
    <Slide5 key="slide5" isActive={currentSlide === 5} />,
    <Slide6 key="slide6" isActive={currentSlide === 6} />,
    <Slide7 key="slide7" isActive={currentSlide === 7} />,
    <Slide8 key="slide8" isActive={currentSlide === 8} />,
    <Slide9 key="slide9" isActive={currentSlide === 9} />,
    <Slide10 key="slide10" isActive={currentSlide === 10} />,
    <Slide11 key="slide11" isActive={currentSlide === 11} />,
    <Slide13 key="slide13" isActive={currentSlide === 12} />,
    <Slide14 key="slide14" isActive={currentSlide === 13} />,
    <Slide15 key="slide15" isActive={currentSlide === 14} />,
    <Slide16 key="slide16" isActive={currentSlide === 15} />,
    <Slide17 key="slide17" isActive={currentSlide === 16} />,
    <Slide17_1 key="slide17_1" isActive={currentSlide === 17} />,
    <Slide18 key="slide18" isActive={currentSlide === 18} />,
    <Slide20 key="slide20" isActive={currentSlide === 19} />,
    <Slide21 key="slide21" isActive={currentSlide === 20} />,
    <Slide19 key="slide19" isActive={currentSlide === 21} />,
  ];

  return (
    <GoogleMapsProvider>
      <div className="h-screen w-screen overflow-hidden bg-black relative">
        {slides}

        {/* Slide Navigation UI */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === i + 1 
                  ? 'bg-white w-4' 
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              onClick={() => setCurrentSlide(i + 1)}
            />
          ))}
        </div>

        {/* Slide Number Indicator */}
        <div className="fixed bottom-8 right-8 text-white/20 text-sm">
          {currentSlide} / {totalSlides}
        </div>
      </div>
    </GoogleMapsProvider>
  );
}

export default App;
