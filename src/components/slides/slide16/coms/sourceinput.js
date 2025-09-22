import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Polyline, Circle, DirectionsService, DirectionsRenderer, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaUsers, FaBus, FaCar, FaPlane, FaExclamationTriangle, FaShieldAlt, FaTrain, FaPlus, FaTrash, FaRoute, FaStop, FaPlay } from 'react-icons/fa';
import { Combobox } from '@headlessui/react';
import usePlacesAutocomplete, { 
  getGeocode, 
  getLatLng 
} from "use-places-autocomplete";

// Format number helper function
const formatNumber = (num) => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} Lakh`;
  } else {
    return num.toLocaleString();
  }
};

// SourceInput component
const SourceInput = ({ sources, onAdd, onRemove, transportMode = 'bus' }) => {
    const [searchValue, setSearchValue] = useState('');
    const [count, setCount] = useState('');
    const [paxPerUnit, setPaxPerUnit] = useState(transportMode === 'bus' ? '50' : '4');
    const [flowRate, setFlowRate] = useState('');
    
    // Update default values when transport mode changes
    useEffect(() => {
        setPaxPerUnit(transportMode === 'bus' ? '50' : '4');
    }, [transportMode]);
    
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        types: ["(cities)"],
        componentRestrictions: { country: "in" },
      },
      debounce: 300,
    });
  
    const handleInput = (e) => {
      // Update both local state and places autocomplete
      setSearchValue(e.target.value);
      setValue(e.target.value);
    };
  
    const handleSelect = async (description) => {
      try {
        const results = await getGeocode({ address: description });
        const { lat, lng } = await getLatLng(results[0]);
        
        if (count && paxPerUnit && flowRate) {
          const actualCount = transportMode === 'car' ? parseInt(count) * 100 : parseInt(count);
          const actualFlowRate = transportMode === 'car' ? parseInt(flowRate) * 100 : parseInt(flowRate);
          
          onAdd({ 
            place: description, 
            location: { lat, lng },
            count: actualCount, 
            paxPerUnit: parseInt(paxPerUnit),
            flowRate: actualFlowRate
          });
          setSearchValue('');
          setValue('');
          setCount('');
          setPaxPerUnit('');
          setFlowRate('');
          clearSuggestions();
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
  
    return (
      <div className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm text-white/60 mb-1 block">Source Location</label>
            <div className="relative">
              <input
                value={searchValue}
                onChange={handleInput}
                disabled={!ready}
                className="w-full bg-black/20 rounded-lg px-3 py-2 text-white placeholder-gray-500
                  focus:outline-none focus:ring-1 focus:ring-white/10"
                placeholder="Search cities..."
              />
              {status === "OK" && searchValue !== '' && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-900/95 backdrop-blur-sm rounded-lg py-1 text-sm max-h-60 overflow-auto">
                  {data.map(({ place_id, description }) => (
                    <li 
                      key={place_id}
                      className="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        setSearchValue(description);
                        clearSuggestions();
                      }}
                    >
                      {description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
  
          <div className="flex gap-2">
            <div className="w-24">
              <label className="text-sm text-white/60 mb-1 block">
                {transportMode === 'car' ? 'Cars (×100)' : 'Buses'}
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full bg-black/20 rounded-lg px-3 py-2 text-white
                  focus:outline-none focus:ring-1 focus:ring-white/10"
                placeholder={transportMode === 'car' ? 'Cars' : 'Buses'}
              />
            </div>
            <div className="w-24">
              <label className="text-sm text-white/60 mb-1 block">
                Pax/{transportMode === 'car' ? 'Car' : 'Bus'}
              </label>
              <input
                type="number"
                value={paxPerUnit}
                onChange={(e) => setPaxPerUnit(e.target.value)}
                className="w-full bg-black/20 rounded-lg px-3 py-2 text-white
                  focus:outline-none focus:ring-1 focus:ring-white/10"
                placeholder="Pax"
              />
            </div>
            <div className="w-24">
              <label className="text-sm text-white/60 mb-1 block">
                {transportMode === 'car' ? 'Flow/Hr (×100)' : 'Flow/Hr'}
              </label>
              <input
                type="number"
                value={flowRate}
                onChange={(e) => setFlowRate(e.target.value)}
                className="w-full bg-black/20 rounded-lg px-3 py-2 text-white
                  focus:outline-none focus:ring-1 focus:ring-white/10"
                placeholder="Flow"
              />
            </div>
            <button
              onClick={() => handleSelect(searchValue)}
              disabled={!searchValue || !count || !paxPerUnit || !flowRate}
              className="bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed 
                rounded-lg w-10 h-10 flex items-center justify-center text-white"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>
        </div>
  
        {/* List of added sources */}
        <div className="space-y-2">
          {sources.map((source, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{source.place}</div>
                <div className="text-sm text-white/60">
                  {transportMode === 'car' ? `${source.count / 100} cars` : `${source.count} buses`} × {source.paxPerUnit} pax = {formatNumber(source.count * source.paxPerUnit)}
                </div>
                <div className="text-sm text-white/40">
                  Flow rate: {transportMode === 'car' ? `${source.flowRate / 100} cars` : `${source.flowRate} buses`}/hour
                </div>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-red-400 hover:text-red-300"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

// AddSourcePopup component
const AddSourcePopup = ({ position, onAdd, onClose }) => {
  const [transportType, setTransportType] = useState('bus');
  const [count, setCount] = useState(1);
  const [paxPerUnit, setPaxPerUnit] = useState(50);
  const [flowRate, setFlowRate] = useState(10);

  // Update transport options
  const transportOptions = [
    { id: 'bus', label: 'Bus', icon: FaBus, defaultPax: 50 },
    { id: 'car', label: 'Car (×100)', icon: FaCar, defaultPax: 4 }
  ];

  // Update pax per unit when transport type changes
  useEffect(() => {
    const option = transportOptions.find(opt => opt.id === transportType);
    setPaxPerUnit(option.defaultPax);
  }, [transportType]);

  const handleAdd = () => {
    onAdd(transportType, {
      location: position,
      count: transportType === 'car' ? count * 100 : count,
      paxPerUnit,
      place: `${transportType.charAt(0).toUpperCase() + transportType.slice(1)} Source ${Math.random().toString(36).substr(2, 5)}`,
      flowRate: transportType === 'car' ? flowRate * 100 : flowRate
    });
    onClose();
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg min-w-[300px]">
      <h3 className="text-white font-medium mb-4">Add Transport Source</h3>
      
      {/* Transport Type Selection */}
      <div className="space-y-4 mb-4">
        <div className="flex gap-2">
          {transportOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setTransportType(option.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${transportType === option.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/60 hover:bg-white/5'}`}
            >
              <option.icon className="text-lg" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* Count Input */}
        <div>
          <label className="block text-white/60 text-sm mb-1">
            {transportType === 'car' ? 'Number of Cars (×100)' : 'Number of Buses'}
          </label>
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 0))}
            className="bg-white/5 text-white px-3 py-2 rounded-lg w-full"
          />
          {transportType === 'car' && (
            <div className="text-white/60 text-sm mt-1">
              Total cars: {count * 100}
            </div>
          )}
        </div>

        {/* Passengers per Unit */}
        <div>
          <label className="block text-white/60 text-sm mb-1">
            Passengers per {transportType === 'car' ? 'Car' : 'Bus'}
          </label>
          <input
            type="number"
            min="1"
            value={paxPerUnit}
            onChange={(e) => setPaxPerUnit(Math.max(1, parseInt(e.target.value) || 0))}
            className="bg-white/5 text-white px-3 py-2 rounded-lg w-full"
          />
          {transportType === 'car' && (
            <div className="text-white/60 text-sm mt-1">
              Total capacity: {count * 100 * paxPerUnit} passengers
            </div>
          )}
        </div>

        {/* Add Flow Rate Input */}
        <div>
          <label className="block text-white/60 text-sm mb-1">
            {transportType === 'car' ? 'Flow Rate (×100 vehicles/hour)' : 'Flow Rate (vehicles/hour)'}
          </label>
          <input
            type="number"
            min="1"
            value={flowRate}
            onChange={(e) => setFlowRate(Math.max(1, parseInt(e.target.value) || 0))}
            className="bg-white/5 text-white px-3 py-2 rounded-lg w-full"
          />
          {transportType === 'car' && (
            <div className="text-white/60 text-sm mt-1">
              Total flow: {flowRate * 100} vehicles/hour
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          Add Source
        </button>
      </div>
    </div>
  );
};

// Single export statement for both components
export { SourceInput, AddSourcePopup };