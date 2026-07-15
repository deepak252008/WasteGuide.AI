import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import api from '../api';
import { Phone, Clock, MapPin, ShieldAlert, Award, ArrowLeft } from 'lucide-react';

const FILTER_TYPES = [
  { value: '', label: 'ALL FACILITIES' },
  { value: 'recycling', label: 'RECYCLING' },
  { value: 'ewaste', label: 'E-WASTE' },
  { value: 'organic', label: 'ORGANIC' },
  { value: 'hazardous', label: 'HAZARDOUS' }
];

const createMarkerIcon = (colorCode) => {
  return L.divIcon({
    html: `<div style="background-color: ${colorCode}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6)"></div>`,
    className: 'custom-leaflet-marker',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const MapPage = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerGroupRef = useRef(null);
  const markersRef = useRef({});

  // 1. Fetch Centers from API based on Filter
  const fetchCenters = async (activeFilter) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/get-centers', {
        params: { waste_type: activeFilter }
      });
      setCenters(res.data);
      if (res.data.length > 0 && !selectedCenter) {
        setSelectedCenter(res.data[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch collection centers. Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Initial mount check for pre-filter and map initialization
  useEffect(() => {
    // Check if redirect from Home page with selected category filter
    const preFilter = sessionStorage.getItem('map_filter_category');
    let initialFilter = '';
    if (preFilter) {
      initialFilter = preFilter;
      setFilter(preFilter);
      sessionStorage.removeItem('map_filter_category'); // consume
    }
    
    fetchCenters(initialFilter);

    // Initialize Leaflet Map
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([17.43, 78.41], 11);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      markerGroupRef.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 3. Re-fetch when filter changes
  const handleFilterChange = (typeVal) => {
    setFilter(typeVal);
    fetchCenters(typeVal);
  };

  // 4. Draw markers when centers list updates
  useEffect(() => {
    if (markerGroupRef.current && mapInstance.current) {
      // Clear old layers
      markerGroupRef.current.clearLayers();
      markersRef.current = {};

      centers.forEach((center) => {
        const icon = createMarkerIcon(center.color_code);
        const marker = L.marker([center.latitude, center.longitude], { icon })
          .bindPopup(`
            <div style="font-size: 11px; font-weight: bold; font-family: monospace; color: #ecfdf5;">${center.name}</div>
            <div style="font-size: 9px; font-family: monospace; color: #7f9c8b; margin-top: 3px;">
              TYPE: ${center.facility_type.toUpperCase()} <br/>
              DIST: ${center.distance_km} KM
            </div>
          `);

        marker.on('click', () => {
          setSelectedCenter(center);
        });

        marker.addTo(markerGroupRef.current);
        markersRef.current[center.id] = marker;
      });

      // Fit bounds if we have centers
      if (centers.length > 0) {
        const group = new L.featureGroup(Object.values(markersRef.current));
        mapInstance.current.fitBounds(group.getBounds().pad(0.15));
      }
    }
  }, [centers]);

  // 5. Side-list click handler
  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
    if (mapInstance.current) {
      mapInstance.current.setView([center.latitude, center.longitude], 13);
    }
    const marker = markersRef.current[center.id];
    if (marker) {
      marker.openPopup();
    }
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)]">
      {/* Side Control Panel */}
      <div className="w-full md:w-96 border-r border-terminal-border flex flex-col bg-terminal-card overflow-y-auto">
        {/* Filters section */}
        <div className="p-4 border-b border-terminal-border bg-terminal-bg/40">
          <span className="text-[10px] font-mono text-terminal-muted uppercase tracking-wider block mb-2">
            FILTER BY WASTE TYPE
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleFilterChange(t.value)}
                className={`px-2 py-1.5 border border-terminal-border rounded text-[10px] font-mono transition-colors focus:outline-none ${
                  filter.toLowerCase() === t.value.toLowerCase()
                    ? 'border-terminal-accent text-terminal-accent bg-terminal-accent/5'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of centers */}
        <div className="flex-grow divide-y divide-terminal-border/60 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-terminal-muted">
              LOADING COLLECTION DIRECTORY...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-xs font-mono text-terminal-danger">
              {error}
            </div>
          ) : centers.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-terminal-muted">
              NO DIRECTORY RECORDS FOUND.
            </div>
          ) : (
            centers.map((center) => (
              <div
                key={center.id}
                onClick={() => handleSelectCenter(center)}
                className={`p-4 cursor-pointer hover:bg-terminal-border/10 transition-colors ${
                  selectedCenter?.id === center.id ? 'bg-terminal-border/20 border-l-2 border-l-terminal-accent' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-xs font-mono font-bold uppercase text-terminal-text leading-tight">
                    {center.name}
                  </h3>
                  <span className="text-[10px] font-mono text-terminal-accent font-semibold shrink-0">
                    {center.distance_km} km
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-terminal-muted font-sans">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{center.address}</span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: center.color_code }}
                  ></span>
                  <span className="text-[9px] font-mono uppercase text-terminal-muted tracking-wider">
                    {center.facility_type} facility
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        {selectedCenter && (
          <div className="p-5 border-t border-terminal-border bg-terminal-bg/50">
            <h4 className="text-[10px] font-mono text-terminal-accent tracking-widest uppercase mb-2">
              FACILITY DATA SHEET
            </h4>
            <h3 className="text-sm font-mono font-bold uppercase text-terminal-text mb-3">
              {selectedCenter.name}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-terminal-muted shrink-0 mt-0.5" />
                <span className="text-terminal-text/80">{selectedCenter.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-terminal-muted shrink-0" />
                <span className="text-terminal-text/80 font-mono">{selectedCenter.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-terminal-muted shrink-0" />
                <span className="text-terminal-text/80 font-mono">{selectedCenter.hours}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-terminal-border/50">
              <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-wider block mb-1.5">
                ACCEPTED WASTE TYPES
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedCenter.accepted_waste.map((w, idx) => (
                  <span key={idx} className="text-[10px] font-mono bg-terminal-bg border border-terminal-border/80 text-terminal-muted px-1.5 py-0.5 rounded">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map Div Container */}
      <div className="flex-grow h-64 md:h-auto relative">
        <div ref={mapRef} className="absolute inset-0"></div>
      </div>
    </div>
  );
};

export default MapPage;
