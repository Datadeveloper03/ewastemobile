import { NearbyFacility } from '@/types/circuscan';

const SEEDED_FACILITIES: Omit<NearbyFacility, 'distanceKm'>[] = [
  // --- CHENNAI & SOUTH REGION ---
  { 
    name: "OnePlus Exclusive Service Center", 
    type: "Repair", 
    address: "Door No. 120, GN Chetty Road, T. Nagar, Chennai", 
    contact: "+91 1800-102-8411", 
    timings: "10:00 AM - 7:30 PM (Mon-Sat)",
    verifiedGovt: true,
    brandAuthorized: "OnePlus",
    lat: 13.0418, 
    lng: 80.2341 
  },
  { 
    name: "Apple Authorized Service Provider (B2X)", 
    type: "Repair", 
    address: "Express Avenue Mall, Club House Road, Royapettah, Chennai", 
    contact: "+91 44-2846-4400", 
    timings: "10:30 AM - 8:30 PM (All Days)",
    verifiedGovt: true,
    brandAuthorized: "Apple",
    lat: 13.0588, 
    lng: 80.2642 
  },
  { 
    name: "Samsung Smart Care Service Center", 
    type: "Repair", 
    address: "Old No 45, New No 92, G.S.T Road, Tambaram, Chennai", 
    contact: "+91 1800-572-6786", 
    timings: "09:30 AM - 7:00 PM (Mon-Sat)",
    verifiedGovt: true,
    brandAuthorized: "Samsung",
    lat: 12.9249, 
    lng: 80.1000 
  },
  { 
    name: "Karo Sambhav Certified Recycler Hub", 
    type: "Recycler", 
    address: "Plot 42, SIDCO Industrial Estate, Guindy, Chennai", 
    contact: "+91 80-4113-7744", 
    timings: "09:00 AM - 6:00 PM (Mon-Fri)",
    verifiedGovt: true,
    lat: 13.0067, 
    lng: 80.2033 
  },
  { 
    name: "Croma E-Care Drop Bin (Green Exchange)", 
    type: "Collection_Bin", 
    address: "Local Croma Megastore Outlet, Anna Salai, Chennai", 
    contact: "+91 1800-572-7662", 
    timings: "10:30 AM - 9:30 PM (All Days)",
    verifiedGovt: true,
    lat: 13.0827, 
    lng: 80.2707 
  },
  { 
    name: "Reliance ResQ Electronics Care", 
    type: "Repair", 
    address: "Reliance Digital Megastore, 100 Feet Road, Vadapalani, Chennai", 
    contact: "+91 1800-889-1055", 
    timings: "10:00 AM - 9:00 PM (All Days)",
    verifiedGovt: true,
    lat: 13.0500, 
    lng: 80.2120 
  },

  // --- BENGALURU ---
  { 
    name: "Cerebra Green E-Waste Dismantling & Urban Mine", 
    type: "Recycler", 
    address: "Peenya Industrial Area Phase 1, Bengaluru", 
    contact: "+91 80-2210-4400", 
    timings: "09:00 AM - 6:00 PM (Mon-Fri)",
    verifiedGovt: true,
    lat: 13.0285, 
    lng: 77.5197 
  },
  { 
    name: "Saahas Zero Waste Circular Hub", 
    type: "Recycler", 
    address: "Kengeri Satellite Town, Mysuru Road, Bengaluru", 
    contact: "+91 80-4168-9389", 
    timings: "09:30 AM - 5:30 PM (Mon-Sat)",
    verifiedGovt: true,
    lat: 12.9177, 
    lng: 77.4838 
  },
  { 
    name: "SP Road Hardware & Motherboard Lab", 
    type: "Repair", 
    address: "Sadhar Patrappa Road, City Market, Bengaluru", 
    contact: "+91 94480-22114", 
    timings: "10:30 AM - 8:30 PM (Mon-Sat)",
    verifiedGovt: false,
    lat: 12.9658, 
    lng: 77.5791 
  },

  // --- MUMBAI & PUNE ---
  { 
    name: "Ecoreco E-Waste Management Ltd", 
    type: "Recycler", 
    address: "Eco House, Mahakali Caves Road, Andheri East, Mumbai", 
    contact: "+91 22-4005-2951", 
    timings: "09:00 AM - 6:00 PM (Mon-Fri)",
    verifiedGovt: true,
    lat: 19.1136, 
    lng: 72.8697 
  },
  { 
    name: "Lamington Road Hardware Center", 
    type: "Repair", 
    address: "Grant Road Station West, Lamington Road, Mumbai", 
    contact: "+91 98200-44551", 
    timings: "10:30 AM - 8:30 PM (Mon-Sat)",
    verifiedGovt: false,
    lat: 18.9633, 
    lng: 72.8166 
  },
  { 
    name: "Vijay Sales Green Disposal Bin", 
    type: "Collection_Bin", 
    address: "SV Road, Bandra West, Mumbai", 
    contact: "+91 1800-267-0099", 
    timings: "10:00 AM - 9:00 PM (All Days)",
    verifiedGovt: true,
    lat: 19.0596, 
    lng: 72.8295 
  },

  // --- DELHI NCR ---
  { 
    name: "Attero Recycling Logistics Plant", 
    type: "Recycler", 
    address: "Plot 17, Okhla Industrial Area Phase II, New Delhi", 
    contact: "+91 11-4050-8800", 
    timings: "09:30 AM - 6:00 PM (Mon-Fri)",
    verifiedGovt: true,
    lat: 28.5355, 
    lng: 77.2732 
  },
  { 
    name: "Nehru Place Hardware & Chip Repair Cluster", 
    type: "Repair", 
    address: "Kalka Ji Main Road, Nehru Place, New Delhi", 
    contact: "+91 98110-88321", 
    timings: "10:30 AM - 8:00 PM (Mon-Sat)",
    verifiedGovt: false,
    lat: 28.5492, 
    lng: 77.2526 
  },
  { 
    name: "Hulladek E-Waste Drop Box", 
    type: "Collection_Bin", 
    address: "Select Citywalk E-Bin Zone, District Centre Saket, New Delhi", 
    contact: "+91 90510-77777", 
    timings: "10:00 AM - 10:00 PM (All Days)",
    verifiedGovt: true,
    lat: 28.5284, 
    lng: 77.2191 
  },

  // --- HYDERABAD & KOLKATA ---
  { 
    name: "ITC WOW E-Waste Collection Drive", 
    type: "Collection_Bin", 
    address: "Ameerpet Metro Junction, Greenlands, Hyderabad", 
    contact: "+91 40-2345-6789", 
    timings: "09:00 AM - 8:00 PM (All Days)",
    verifiedGovt: true,
    lat: 17.4375, 
    lng: 78.4482 
  },
  { 
    name: "Hulladek Recycling Kolkata Headquarters", 
    type: "Recycler", 
    address: "4, Fairlie Place, BBD Bagh, Kolkata", 
    contact: "+91 90510-77777", 
    timings: "09:30 AM - 6:00 PM (Mon-Sat)",
    verifiedGovt: true,
    lat: 22.5726, 
    lng: 88.3639 
  }
];

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

// Comprehensive region centroids for common Indian pincode prefixes
const PINCODE_PREFIX_COORDS: Record<string, { lat: number; lon: number; region: string }> = {
  '1': { lat: 28.6139, lon: 77.2090, region: 'Delhi NCR / Haryana / Punjab' },
  '2': { lat: 26.8467, lon: 80.9462, region: 'Uttar Pradesh / Uttarakhand' },
  '3': { lat: 23.0225, lon: 72.5714, region: 'Gujarat / Rajasthan' },
  '4': { lat: 19.0760, lon: 72.8777, region: 'Maharashtra / Goa' },
  '5': { lat: 17.3850, lon: 78.4867, region: 'Andhra Pradesh / Telangana' },
  '6': { lat: 13.0827, lon: 80.2707, region: 'Tamil Nadu / Kerala' },
  '7': { lat: 22.5726, lon: 88.3639, region: 'West Bengal / Odisha / North East' },
  '8': { lat: 25.5941, lon: 85.1376, region: 'Bihar / Jharkhand' },
};

export async function getNearbyFacilitiesByPincode(pincode: string): Promise<NearbyFacility[]> {
  const cleaned = pincode.replace(/\D/g, '').trim();
  let lat = 13.0827; // Default Chennai
  let lon = 80.2707;

  if (cleaned.length >= 1 && PINCODE_PREFIX_COORDS[cleaned[0]]) {
    lat = PINCODE_PREFIX_COORDS[cleaned[0]].lat;
    lon = PINCODE_PREFIX_COORDS[cleaned[0]].lon;
  }

  // Fast path for default pincode to avoid network latency during initial triage
  if (cleaned === '600001') {
    return SEEDED_FACILITIES.map(facility => ({
      ...facility,
      distanceKm: haversineDistance(lat, lon, facility.lat, facility.lng)
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(cleaned)}&country=India&format=json`,
      {
        headers: { 'User-Agent': 'CircuScan-E-Waste-App/1.0' },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      }
    }
  } catch {
    // Fall back smoothly to regional prefix coords
  }

  // Calculate distance, sort ascending, and take top 4 facilities
  return SEEDED_FACILITIES.map(facility => ({
    ...facility,
    distanceKm: haversineDistance(lat, lon, facility.lat, facility.lng)
  }))
  .sort((a, b) => a.distanceKm - b.distanceKm)
  .slice(0, 4);
}
