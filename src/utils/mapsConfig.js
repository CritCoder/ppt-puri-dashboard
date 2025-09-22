import { useJsApiLoader } from '@react-google-maps/api';

export const MAPS_CONFIG = {
  googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
  libraries: ['places', 'directions'],
};

export const useGoogleMaps = () => {
  return useJsApiLoader(MAPS_CONFIG);
}; 