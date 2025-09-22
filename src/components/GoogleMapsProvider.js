import { createContext, useContext, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext(null);

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export const GoogleMapsProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ["visualization", "places"],
    onUnmount: () => {
      if (window.google && window.google.maps) {
        delete window.google.maps;
      }
    }
  });

  const value = {
    isLoaded,
    loadError,
    mapInstance,
    setMapInstance
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}; 