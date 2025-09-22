import { useEffect, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, OverlayView, MarkerClusterer, TrafficLayer } from '@react-google-maps/api';
import { FaCarAlt, FaAmbulance, FaFire, FaVideo, FaPhoneVolume, FaSatelliteDish, FaCarSide, FaCity, FaRoad } from 'react-icons/fa';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

const mapOptions = {
  center: { lat: 19.8135, lng: 85.8312 },
  zoom: 14,
  styles: [
    {
      "featureType": "all",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#E3F2FD" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ECEFF1" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{ "color": "#CFD8DC" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#90A4AE" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#E8F5E9" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{ "color": "#E1F5FE" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#37474F" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#FFFFFF" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#263238" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#2E7D32" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#C8E6C9" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#37474F" }]
    }
  ],
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false
};

const layerPresets = [
  {
    category: "Traffic",
    icon: FaRoad,
    items: [
      {
        name: "Live Traffic",
        description: "Real-time traffic conditions",
        type: "traffic",
        location: { lat: 19.8135, lng: 85.8312 }
      }
    ]
  },
  {
    category: "Response Units",
    icon: FaCarSide,
    items: [
      {
        name: "PCR Vans",
        description: "Police Control Room vehicles",
        type: "pcr",
        location: { lat: 19.8135, lng: 85.8312 }
      },
      {
        name: "Fire Units",
        description: "Fire engines and rescue units",
        type: "fire",
        location: { lat: 19.8135, lng: 85.8312 }
      },
      {
        name: "Ambulances",
        description: "Emergency medical services",
        type: "ambulance",
        location: { lat: 19.8135, lng: 85.8312 }
      }
    ]
  }
];

const getMarkerIcon = (type) => {
  switch(type) {
    case 'pcr':
      return { icon: FaCarAlt, color: 'bg-purple-500' };
    case 'fire':
      return { icon: FaFire, color: 'bg-red-500' };
    case 'ambulance':
      return { icon: FaAmbulance, color: 'bg-green-500' };
    case 'camera':
      return { icon: FaVideo, color: 'bg-gray-500' };
    case 'emergency-box':
      return { icon: FaPhoneVolume, color: 'bg-orange-500' };
    case 'sensor':
      return { icon: FaSatelliteDish, color: 'bg-cyan-500' };
    default:
      return { icon: FaCarAlt, color: 'bg-blue-500' };
  }
};

const LayerSelector = ({ onSelect, activeLayers, presets }) => (
  <div className="space-y-2">
    {presets.map((category, index) => (
      <div key={category.category} className="space-y-1">
        <div className="flex items-center gap-2 text-gray-600 text-xs font-medium mb-1">
          <category.icon className="w-4 h-4" />
          <span>{category.category}</span>
        </div>
        {category.items.map(item => (
          <button
            key={item.type}
            className={`w-full p-2 rounded-lg transition-all duration-300 group
              ${activeLayers.includes(item.type) 
                ? 'bg-blue-500 border-blue-600 shadow-sm' 
                : 'bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300'}
              border`}
            onClick={() => onSelect(item)}
          >
            <div className="flex items-center space-x-2">
              <div className={`text-lg ${
                activeLayers.includes(item.type) 
                  ? 'text-white' 
                  : 'text-gray-600'
              }`}>
                {getMarkerIcon(item.type).icon({ className: 'w-4 h-4' })}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${
                  activeLayers.includes(item.type) 
                    ? 'text-white' 
                    : 'text-gray-700'
                }`}>
                  {item.name}
                </p>
                <p className={`text-[10px] truncate ${
                  activeLayers.includes(item.type)
                    ? 'text-blue-50'
                    : 'text-gray-500'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    ))}
  </div>
);

const ResourceMap = ({ 
  activeLayers = ['traffic'],
  vehicles = [], 
  infrastructure = [],
  onLayerToggle,
  showInfrastructure = false
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWhqRzAuNA-EnG0vodnS377w_nCVYQz04",
    libraries: ["visualization"]
  });

  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const renderMarker = (item) => {
    const { icon: Icon, color } = getMarkerIcon(item.type);
    
    return (
      <OverlayView
        key={item.id}
        position={item.position}
        mapPaneName={OverlayView.OVERLAY_LAYER}
      >
        <div className="relative">
          <div className={`relative p-2 rounded-lg shadow-lg border border-white/20 ${color} transform-gpu hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium text-gray-700 rounded-full bg-white/90 shadow-md whitespace-nowrap">
            {item.label}
          </div>
        </div>
      </OverlayView>
    );
  };

  // Conditionally render layer presets based on the page
  const visiblePresets = showInfrastructure ? 
    layerPresets.concat([
      {
        category: "Infrastructure",
        icon: FaCity,
        items: [
          {
            name: "CCTV Network",
            description: "Surveillance cameras",
            type: "camera",
            location: { lat: 19.8135, lng: 85.8312 }
          },
          {
            name: "Emergency Points",
            description: "SOS and help points",
            type: "emergency-box",
            location: { lat: 19.8135, lng: 85.8312 }
          },
          {
            name: "Smart Sensors",
            description: "IoT and monitoring devices",
            type: "sensor",
            location: { lat: 19.8135, lng: 85.8312 }
          }
        ]
      }
    ]) : 
    layerPresets;

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative h-full w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {/* Traffic Layer */}
        {activeLayers.includes('traffic') && <TrafficLayer />}

        {/* Vehicles Layer */}
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {vehicles.filter(vehicle => activeLayers.includes(vehicle.type)).map(vehicle => 
                renderMarker({ ...vehicle, clusterer })
              )}
            </>
          )}
        </MarkerClusterer>

        {/* Infrastructure Layer - only show if enabled */}
        {showInfrastructure && (
          <MarkerClusterer>
            {(clusterer) => (
              <>
                {infrastructure.filter(item => activeLayers.includes(item.type)).map(item => 
                  renderMarker({ ...item, clusterer })
                )}
              </>
            )}
          </MarkerClusterer>
        )}
      </GoogleMap>

      {/* Layer Selector Sidebar */}
      <div className="absolute left-0 top-0 w-[220px] p-4 h-full z-50">
        <div className="p-3 rounded-xl bg-white/80 shadow-lg border border-gray-200 backdrop-blur-md">
          <h3 className="text-gray-900 font-semibold mb-2 text-sm">Resource Layers</h3>
          <LayerSelector 
            onSelect={(layer) => onLayerToggle(layer.type)}
            activeLayers={activeLayers}
            presets={visiblePresets}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceMap; 