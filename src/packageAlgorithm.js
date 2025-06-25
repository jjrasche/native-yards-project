// packageAlgorithm.js - Native Yards Package Generation

// Configuration - Easy to adjust
const CONFIG = {
  plantsPerSqft: 0.03, // 3 plants per 100 sqft
  seedCoveragePerLb: 200, // 1 lb covers 200 sqft
  baseDiscount: 0.25, // 25% off retail
  
  // Price points
  pricing: {
    plantCost: 8, // per plant retail
    seedCost: 25, // per lb retail
    guideCost: 15, // flat rate
  },
  
  // Minimum quantities
  minimums: {
    plants: 5,
    seeds: 0.5, // lbs
  }
};

// Hardiness zone lookup (simplified - you'd want a real ZIP to zone API)
const getHardinessZone = (zipCode) => {
  const firstDigit = zipCode.toString()[0];
  const zoneMap = {
    '0': '5a', '1': '5b', '2': '6a', '3': '6b', '4': '7a',
    '5': '7b', '6': '8a', '7': '8b', '8': '9a', '9': '9b'
  };
  return zoneMap[firstDigit] || '6b';
};

// Native plants database (expand this with real data)
const NATIVE_PLANTS = {
  '5a': [
    { name: 'Wild Bergamot', type: 'wildflower', sunlight: 'full' },
    { name: 'Purple Prairie Clover', type: 'wildflower', sunlight: 'full' },
    { name: 'Little Bluestem Grass', type: 'grass', sunlight: 'full' },
  ],
  '5b': [
    { name: 'Black-Eyed Susan', type: 'wildflower', sunlight: 'full' },
    { name: 'Purple Coneflower', type: 'wildflower', sunlight: 'partial' },
    { name: 'Prairie Dropseed', type: 'grass', sunlight: 'full' },
  ],
  '6a': [
    { name: 'Wild Columbine', type: 'wildflower', sunlight: 'shade' },
    { name: 'Butterfly Milkweed', type: 'wildflower', sunlight: 'full' },
    { name: 'Switchgrass', type: 'grass', sunlight: 'full' },
  ],
  '6b': [
    { name: 'Purple Coneflower', type: 'wildflower', sunlight: 'full' },
    { name: 'Black-Eyed Susan', type: 'wildflower', sunlight: 'full' },
    { name: 'Little Bluestem Grass', type: 'grass', sunlight: 'full' },
    { name: 'Wild Bergamot', type: 'wildflower', sunlight: 'partial' },
    { name: 'Blazing Star', type: 'wildflower', sunlight: 'full' },
  ],
  '7a': [
    { name: 'Blanket Flower', type: 'wildflower', sunlight: 'full' },
    { name: 'Purple Coneflower', type: 'wildflower', sunlight: 'full' },
    { name: 'Mexican Feather Grass', type: 'grass', sunlight: 'full' },
  ],
  // Add more zones...
};

// Convert yard size to square feet
const getSquareFeet = (yardSize) => {
  const sizeMap = {
    'tiny': 500,
    'small': 3000,
    'medium': 7500,
    'large': 15000,
    'xlarge': 30000
  };
  return sizeMap[yardSize] || 5000;
};

// Select appropriate plants based on goals
const selectPlants = (zone, desires, plantCount) => {
  const availablePlants = NATIVE_PLANTS[zone] || NATIVE_PLANTS['6b'];
  const selectedPlants = [];
  
  // Filter plants based on desires
  let plantPool = [...availablePlants];
  
  if (desires.includes('pollinators')) {
    plantPool = plantPool.filter(p => p.type === 'wildflower');
  }
  
  if (desires.includes('low_maintenance')) {
    plantPool = plantPool.filter(p => p.type === 'grass' || p.sunlight === 'full');
  }
  
  // Distribute plants evenly
  const plantsPerType = Math.max(CONFIG.minimums.plants, Math.ceil(plantCount / plantPool.length));
  
  plantPool.forEach(plant => {
    selectedPlants.push({
      ...plant,
      quantity: plantsPerType
    });
  });
  
  return selectedPlants;
};

// Main package generation function
export const generatePackage = (formData) => {
  const { zip_code, yard_size, desires = [], budget } = formData;
  
  // Calculate basics
  const zone = getHardinessZone(zip_code);
  const sqft = getSquareFeet(yard_size);
  const plantCount = Math.max(
    CONFIG.minimums.plants * 3, 
    Math.ceil(sqft * CONFIG.plantsPerSqft)
  );
  const seedAmount = Math.max(
    CONFIG.minimums.seeds,
    sqft / CONFIG.seedCoveragePerLb
  );
  
  // Build package
  const _package = {
    zone,
    sqft,
    plants: selectPlants(zone, desires, plantCount),
    seeds: {
      type: desires.includes('meadow') ? 'Wildflower Meadow Mix' : 'Native Grass & Flower Mix',
      amount: Math.ceil(seedAmount * 2) / 2, // Round to nearest 0.5 lb
      coverage: Math.round(seedAmount * CONFIG.seedCoveragePerLb)
    },
    extras: ['Native Yards Setup Guide', 'Plant Care Calendar']
  };
  
  // Add desire-specific extras
  if (desires.includes('wildlife')) {
    _package.extras.push('Certified Wildlife Habitat Sign');
  }
  if (desires.includes('edible')) {
    _package.extras.push('Native Edibles Guide');
  }
  
  // Calculate pricing
  const plantsCost = _package.plants.reduce((sum, p) => sum + (p.quantity * CONFIG.pricing.plantCost), 0);
  const seedsCost = _package.seeds.amount * CONFIG.pricing.seedCost;
  const extrasCost = CONFIG.pricing.guideCost;
  
  const retailTotal = plantsCost + seedsCost + extrasCost;
  const discount = budget === 'low' ? 0.35 : CONFIG.baseDiscount;
  const finalPrice = Math.round(retailTotal * (1 - discount));
  
  return {
    ..._package,
    pricing: {
      retail: retailTotal,
      discount: Math.round(retailTotal * discount),
      final: finalPrice
    },
    summary: {
      totalPlants: _package.plants.reduce((sum, p) => sum + p.quantity, 0),
      totalCoverage: sqft,
      co2Offset: Math.round(sqft * 0.0003 * 10) / 10 // tons per year
    }
  };
};

// Format package for display
export const formatPackageDisplay = (_package) => {
  const items = [];
  
  // Add plants
  _package.plants.forEach(plant => {
    items.push({
      emoji: '🌱',
      name: `${plant.quantity} ${plant.name}`,
      detail: `${plant.type}, ${plant.sunlight} sun`
    });
  });
  
  // Add seeds
  items.push({
    emoji: '🌰',
    name: `${_package.seeds.amount} lb ${_package.seeds.type}`,
    detail: `Covers ${_package.seeds.coverage} sq ft`
  });
  
  // Add extras
  _package.extras.forEach(extra => {
    items.push({
      emoji: '📚',
      name: extra,
      detail: null
    });
  });
  
  return items;
};