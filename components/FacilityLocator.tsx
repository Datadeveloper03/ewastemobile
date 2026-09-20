'use client';
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Search, 
  Loader2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Store,
  Sparkles
} from 'lucide-react';
import { NearbyFacility } from '@/types/circuscan';
import { getNearbyFacilitiesByPincode } from '@/lib/locations';

interface FacilityLocatorProps {
  initialFacilities?: NearbyFacility[];
}

export default function FacilityLocator({ initialFacilities }: FacilityLocatorProps) {
  const [pincode, setPincode] = useState('600001');
  const [facilities, setFacilities] = useState<NearbyFacility[]>(initialFacilities || []);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Collection_Bin' | 'Repair' | 'Recycler'>('All');
  const [activeFacility, setActiveFacility] = useState<NearbyFacility | null>(null);

  const fetchFacilities = async (code: string) => {
    setLoading(true);
    try {
      const results = await getNearbyFacilitiesByPincode(code);
      setFacilities(results);
      if (results.length > 0) {
        setActiveFacility(results[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFacilities || initialFacilities.length === 0) {
      fetchFacilities(pincode);
    } else {
      setActiveFacility(initialFacilities[0]);
    }
  }, []);

  const handleQuickCity = (code: string) => {
    setPincode(code);
    fetchFacilities(code);
  };

  const filteredFacilities = facilities.filter(f => {
    if (selectedFilter === 'All') return true;
    return f.type === selectedFilter;
  });

  const currentMapCenter = activeFacility 
    ? { lat: activeFacility.lat, lng: activeFacility.lng } 
    : facilities.length > 0 
      ? { lat: facilities[0].lat, lng: facilities[0].lng } 
      : { lat: 13.0827, lng: 80.2707 };

  // OpenStreetMap embed URL with dynamic marker
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentMapCenter.lng - 0.04}%2C${currentMapCenter.lat - 0.03}%2C${currentMapCenter.lng + 0.04}%2C${currentMapCenter.lat + 0.03}&layer=mapnik&marker=${currentMapCenter.lat}%2C${currentMapCenter.lng}`;

  const getFacilityTypeBadge = (type: NearbyFacility['type']) => {
    switch (type) {
      case 'Collection_Bin':
        return {
          label: 'E-Waste Drop Bin',
          class: 'badge-glow-green text-[10px] font-black'
        };
      case 'Repair':
        return {
          label: 'Authorized Service / Repair',
          class: 'badge-glow-blue text-[10px] font-black'
        };
      case 'Recycler':
        return {
          label: 'CPCB Certified Recycler',
          class: 'badge-glow-amber text-[10px] font-black'
        };
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel border border-cyan-500/30 rounded-3xl p-5 sm:p-7 text-white flex flex-col gap-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Drop-Off & Repair Hub Locator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
            Verified Indian E-Waste Centers
          </h3>
          <p className="text-xs text-slate-300">
            CPCB licensed urban miners, authorized brand service centers & retail drop boxes
          </p>
        </div>

        {/* Pincode Search Bar */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            maxLength={6}
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && pincode.length >= 3 && fetchFacilities(pincode)}
            className="w-28 px-3.5 py-2 text-xs font-mono font-bold bg-slate-950/60 border border-cyan-500/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md"
          />
          <button
            onClick={() => fetchFacilities(pincode)}
            disabled={loading || pincode.length < 3}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white transition flex items-center justify-center font-bold text-xs shadow-md shadow-cyan-950/50"
            title="Locate Centers"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick City Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-cyan-200/80 font-bold">Quick Cities:</span>
        {[
          { city: 'Chennai', pin: '600001' },
          { city: 'Bengaluru', pin: '560001' },
          { city: 'Mumbai', pin: '400001' },
          { city: 'Delhi NCR', pin: '110001' },
          { city: 'Hyderabad', pin: '500001' },
          { city: 'Kolkata', pin: '700001' }
        ].map((c) => (
          <button
            key={c.pin}
            onClick={() => handleQuickCity(c.pin)}
            className={`text-[11px] px-3 py-1 rounded-xl border transition font-medium backdrop-blur-md ${
              pincode === c.pin
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 font-bold shadow-sm'
                : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            {c.city}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE VISUAL MAP EMBED                                              */}
      {/* ========================================================================= */}
      <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg bg-slate-950/80">
        <iframe
          title="Facility Location Map"
          src={mapEmbedUrl}
          className="w-full h-full border-0 filter contrast-[1.05] brightness-90"
          loading="lazy"
        />

        {/* Map Header Floating Overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Drop-Off Map • Pincode {pincode}</span>
          </div>

          {activeFacility && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeFacility.lat},${activeFacility.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md transition active:scale-95"
            >
              <span>Directions</span>
              <Navigation className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Active Selected Facility Indicator Bar */}
        {activeFacility && (
          <div className="absolute bottom-2 inset-x-2 p-2.5 rounded-xl bg-slate-950/90 border border-white/10 backdrop-blur-md flex items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{activeFacility.name}</span>
                <span className="text-[10px] text-slate-300 block truncate">{activeFacility.address}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex-shrink-0">
              {activeFacility.distanceKm} km
            </span>
          </div>
        )}
      </div>

      {/* Type Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['All', 'Collection_Bin', 'Repair', 'Recycler'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition backdrop-blur-md ${
              selectedFilter === filter
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white'
            }`}
          >
            {filter === 'All' ? 'All Verified Hubs' : filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Facility Cards List */}
      <div className="flex flex-col gap-3">
        {filteredFacilities.length > 0 ? (
          filteredFacilities.map((facility, idx) => {
            const badge = getFacilityTypeBadge(facility.type);
            const isSelected = activeFacility?.name === facility.name;
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;

            return (
              <div
                key={idx}
                onClick={() => setActiveFacility(facility)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md ${
                  isSelected 
                    ? 'bg-slate-900/80 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400' 
                    : 'bg-slate-950/40 border-white/10 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {facility.name}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-full ${badge.class}`}>
                      {badge.label}
                    </span>
                    {facility.verifiedGovt && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>CPCB Authorized</span>
                      </span>
                    )}
                    {facility.brandAuthorized && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                        {facility.brandAuthorized} Care
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300">
                    {facility.address}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-slate-400">
                    {facility.timings && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{facility.timings}</span>
                      </div>
                    )}
                    {facility.contact && (
                      <a
                        href={`tel:${facility.contact.replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-mono font-medium"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{facility.contact}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-cyan-300">
                      {facility.distanceKm} km
                    </span>
                    <div className="text-[10px] text-slate-400 font-medium">Distance</div>
                  </div>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition flex items-center justify-center shadow-md shadow-cyan-950/40 active:scale-95"
                    title="Get Directions on Google Maps"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No facilities matching this filter in selected pincode region.
          </div>
        )}
      </div>
    </div>
  );
}

