import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MarkerItem {
  id: string;
  workId: string;
  workName: string;
  category: string;
  lat: number;
  lng: number;
  district: string;
  state?: string;
  sanctionAmount: number;
  physicalProgress?: number;
  financialProgress?: number;
  status?: string;
  riskScore: number;
  riskLevel: string;
  isHeroCase?: boolean;
}

interface SimilarityLink {
  id: string;
  similarityScore: number;
  distanceKm: number;
  source: { lat: number; lng: number; workId: string; workName: string };
  target: { lat: number; lng: number; workId: string; workName: string };
}

interface LeafletMapProps {
  markers: MarkerItem[];
  similarityLinks?: SimilarityLink[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MarkerItem) => void;
  selectedMarkerId?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  markers,
  similarityLinks = [],
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
  height = '500px',
  onMarkerClick,
  selectedMarkerId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles for high-contrast government-tech UI
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center/zoom if changed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom]);

  // Update markers and lines
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // 1. Draw similarity link lines
    similarityLinks.forEach((link) => {
      const latlngs: L.LatLngTuple[] = [
        [link.source.lat, link.source.lng],
        [link.target.lat, link.target.lng],
      ];

      const polyline = L.polyline(latlngs, {
        color: '#A855F7',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.85,
      });

      polyline.bindTooltip(
        `<strong>Similarity Link:</strong> ${link.similarityScore}% match (${link.distanceKm} km)`,
        { sticky: true, className: 'leaflet-tooltip-custom' }
      );

      layerGroupRef.current?.addLayer(polyline);
    });

    // 2. Add circle markers
    markers.forEach((m) => {
      if (!m.lat || !m.lng) return;

      const isSelected = selectedMarkerId === m.id || selectedMarkerId === m.workId;
      const isHigh = m.riskLevel === 'HIGH' || m.riskScore >= 70;
      const isMed = m.riskLevel === 'MEDIUM' || (m.riskScore >= 40 && m.riskScore < 70);

      const fillColor = isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981';
      const strokeColor = isSelected ? '#38BDF8' : isHigh ? '#7F1D1D' : isMed ? '#78350F' : '#064E3B';
      const radius = m.isHeroCase ? 12 : isHigh ? 9 : 7;

      const circleMarker = L.circleMarker([m.lat, m.lng], {
        radius,
        fillColor,
        color: isSelected ? '#FFFFFF' : strokeColor,
        weight: isSelected ? 3 : 2,
        opacity: 1,
        fillOpacity: isHigh ? 0.9 : 0.75,
      });

      // HTML popup
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; color: #F1F5F9; min-width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
            <span style="font-weight: 700; color: #38BDF8; font-family: monospace;">${m.workId}</span>
            <span style="font-weight: 700; padding: 2px 6px; border-radius: 4px; font-size: 10px; background: ${fillColor}33; color: ${fillColor}; border: 1px solid ${fillColor}66;">
              ${m.riskScore}/100 (${m.riskLevel})
            </span>
          </div>
          <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; line-height: 1.3;">${m.workName}</div>
          <div style="color: #94A3B8; font-size: 11px; margin-bottom: 2px;">Category: <span style="color: #E2E8F0;">${m.category}</span></div>
          <div style="color: #94A3B8; font-size: 11px; margin-bottom: 2px;">District: <span style="color: #E2E8F0;">${m.district}</span></div>
          <div style="color: #94A3B8; font-size: 11px; margin-bottom: 6px;">Sanction: <span style="color: #38BDF8; font-family: monospace; font-weight: 600;">₹${(m.sanctionAmount / 100000).toFixed(2)} Lakhs</span></div>
          ${m.isHeroCase ? '<div style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #FCA5A5; font-size: 10px; padding: 3px 6px; border-radius: 4px; font-weight: 700; text-align: center; margin-bottom: 4px;">⭐ SHOWCASE HERO CASE</div>' : ''}
          <div style="margin-top: 6px; text-align: center;">
            <a href="/works/${m.workId}" style="display: block; background: #0284C7; color: white; text-decoration: none; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px;">View Full Work Details &rarr;</a>
          </div>
        </div>
      `;

      circleMarker.bindPopup(popupContent);

      circleMarker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(m);
        }
      });

      layerGroupRef.current?.addLayer(circleMarker);
    });
  }, [markers, similarityLinks, selectedMarkerId, onMarkerClick]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-xl" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 text-[11px] shadow-lg space-y-1.5 pointer-events-auto">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Risk Map Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <span className="text-slate-200">High Risk (70–100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
          <span className="text-slate-200">Medium Risk (40–69)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
          <span className="text-slate-200">Low Risk (0–39)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-400" />
          <span className="text-purple-300 font-medium">Similarity Vector Link</span>
        </div>
      </div>
    </div>
  );
};
