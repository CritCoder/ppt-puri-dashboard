// Define major market and community locations in Puri
export const communityLocations = [
  { lat: 19.8075, lng: 85.8240, name: "Grand Road Market" },
  { lat: 19.8001, lng: 85.8301, name: "Swargadwar Market" },
  { lat: 19.8124, lng: 85.8287, name: "Railway Station Area" },
  { lat: 19.8077, lng: 85.8315, name: "Jagannath Temple Area" },
  { lat: 19.8141, lng: 85.8209, name: "Marine Drive" },
  { lat: 19.8011, lng: 85.8291, name: "Chakratirtha Road" },
  { lat: 19.8057, lng: 85.8255, name: "VIP Road" },
  { lat: 19.7976, lng: 85.8301, name: "Puri Beach Market" },
  { lat: 19.8082, lng: 85.8387, name: "Narendra Tank Area" },
  { lat: 19.8029, lng: 85.8194, name: "CT Road Junction" }
];

// Define all locations including entry points and highway cameras
export const locations = [
  // Command Center
  { 
    id: "center", 
    type: "command", 
    label: "Jagannath Temple",
    size: 100,
    position: { lat: 19.8077, lng: 85.8315 }
  },
  
  // Bhubaneswar Highway (NH-316) - West
  { 
    id: "4g1", 
    type: "4g", 
    label: "Bhubaneswar Entry",
    size: 80,
    position: { lat: 20.2961, lng: 85.8245 }
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `highway1-${i+1}`,
    type: "4g",
    label: `NH-316 Point ${i+1}`,
    size: 60,
    position: {
      lat: 19.8077 + (20.2961 - 19.8077) * ((i + 1) / 9),
      lng: 85.8315 + (85.8245 - 85.8315) * ((i + 1) / 9)
    }
  })),

  // Konark Highway (NH-316) - Northeast (adjusted to follow coastline)
  { 
    id: "4g2", 
    type: "4g", 
    label: "Konark Entry",
    size: 80,
    position: { lat: 19.8865, lng: 85.9750 }
  },
  ...Array.from({ length: 8 }, (_, i) => {
    // Calculate position with adjusted path to follow coastline
    const progress = (i + 1) / 9;
    return {
      id: `highway2-${i+1}`,
      type: "4g",
      label: `NH-316 Konark Point ${i+1}`,
      size: 60,
      position: {
        lat: 19.8077 + (19.8865 - 19.8077) * progress,
        // Keep longitude closer to coast (max 85.9300 to stay on land)
        lng: 85.8315 + Math.min((85.9750 - 85.8315) * progress, 85.9300 - 85.8315)
      }
    };
  }),

  // Brahmagiri Road - South
  { 
    id: "4g3", 
    type: "4g", 
    label: "Brahmagiri Entry",
    size: 80,
    position: { lat: 19.5823, lng: 85.7515 }
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `highway3-${i+1}`,
    type: "4g",
    label: `Brahmagiri Road Point ${i+1}`,
    size: 60,
    position: {
      lat: 19.8077 + (19.5823 - 19.8077) * ((i + 1) / 9),
      lng: 85.8315 + (85.7515 - 85.8315) * ((i + 1) / 9)
    }
  })),

  // Coastal Highway - North (adjusted to follow coastline)
  { 
    id: "4g4", 
    type: "4g", 
    label: "Coastal Highway",
    size: 80,
    position: { lat: 19.9651, lng: 85.8850 }
  },
  ...Array.from({ length: 8 }, (_, i) => {
    // Calculate position with adjusted path to follow coastline
    const progress = (i + 1) / 9;
    return {
      id: `highway4-${i+1}`,
      type: "4g",
      label: `Coastal Highway Point ${i+1}`,
      size: 60,
      position: {
        lat: 19.8077 + (19.9651 - 19.8077) * progress,
        // Keep longitude closer to coast (max 85.8750 to stay on land)
        lng: 85.8315 + Math.min((85.8850 - 85.8315) * progress, 85.8750 - 85.8315)
      }
    };
  }),

  // Satapada Road - Southwest
  {
    id: "4g5",
    type: "4g",
    label: "Satapada Entry",
    size: 80,
    position: { lat: 19.7137, lng: 85.4790 }
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `highway5-${i+1}`,
    type: "4g",
    label: `Satapada Road Point ${i+1}`,
    size: 60,
    position: {
      lat: 19.8077 + (19.7137 - 19.8077) * ((i + 1) / 9),
      lng: 85.8315 + (85.4790 - 85.8315) * ((i + 1) / 9)
    }
  })),

  // Beach Road - Southeast (adjusted to stay along beach, not in ocean)
  {
    id: "4g6",
    type: "4g",
    label: "South Beach Road",
    size: 80,
    position: { lat: 19.7520, lng: 85.8300 } // Moved west to stay on land
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `highway6-${i+1}`,
    type: "4g",
    label: `Beach Road Point ${i+1}`,
    size: 60,
    position: {
      lat: 19.8077 + (19.7520 - 19.8077) * ((i + 1) / 9),
      // Fix longitude to stay along coastline (85.8300 is approximately the coastline)
      lng: 85.8315 > 85.8300 ? 85.8300 : 85.8315
    }
  })),

  // Local points
  { 
    id: "local1", 
    type: "wifi", 
    label: "Railway Station",
    size: 60,
    position: { lat: 19.8124, lng: 85.8287 }
  },
  { 
    id: "local2", 
    type: "wifi", 
    label: "Grand Road",
    size: 60,
    position: { lat: 19.8075, lng: 85.8240 }
  },
  { 
    id: "local3", 
    type: "wifi", 
    label: "Puri Bus Stand",
    size: 60,
    position: { lat: 19.8001, lng: 85.8301 }
  }
];

// Export zoom presets
export const zoomPresets = [
  {
    name: "Jagannath Temple",
    icon: "🕉️",
    location: { lat: 19.8077, lng: 85.8315 },
    zoom: 15,
    description: "Temple complex and surrounding areas",
    type: "temple"
  },
  {
    name: "City Cameras",
    icon: "🏙️",
    location: { lat: 19.8075, lng: 85.8240 },
    zoom: 18,
    description: "Community camera network within city",
    type: "city"
  },
  {
    name: "Entry Points",
    icon: "🛣️",
    location: { lat: 19.8077, lng: 85.8400 }, // Adjusted to stay on land
    zoom: 8,
    description: "Highway monitoring network",
    type: "entry"
  }
]; 