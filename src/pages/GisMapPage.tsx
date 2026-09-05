import React, { useEffect, useState } from 'react';
import { mapService } from '../services/api';
import { LeafletMap } from '../components/LeafletMap';
import { RiskBadge } from '../components/RiskBadge';
import { MapPin, Filter, Search, Sparkles, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GisMapPage: React.FC = () => {
  const [mapData, setMapData] = useState<{ markers: any[]; similarityLinks: any[] }>({
    markers: [],
    similarityLinks: [],
  });
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [riskFilter, setRiskFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchMapWorks = async () => {
    setIsLoading(true);
    try {
      const res = await mapService.getMapWorks({
        riskLevel: riskFilter || undefined,
        category: categoryFilter || undefined,
        limit: 500,
      });
      if (res.data.success) {
        setMapData(res.data.data);
      }
    } catch (e) {
      console.error('Error loading map data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapWorks();
  }, [riskFilter, categoryFilter]);

  // Filtered markers by search query
  const filteredMarkers = mapData.markers.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.workId.toLowerCase().includes(q) ||
      m.workName.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q)
    );
  });

  const handleFocusHeroCluster = () => {
    setMapCenter([18.525, 73.86]);
    setZoomLevel(13);
    const hero = mapData.markers.find((m) => m.workId === 'MPLADS-00421');
    if (hero) setSelectedMarker(hero);
  };

  const handleResetNationalView = () => {
    setMapCenter([20.5937, 78.9629]);
    setZoomLevel(5);
    setSelectedMarker(null);
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            GIS Risk Spatial Intelligence
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Interactive geospatial mapping with risk severity overlays
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFocusHeroCluster}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900/60 border border-red-500/50 text-red-300 text-[11px] sm:text-xs font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Cluster</span>
          </button>

          <button
            onClick={handleResetNationalView}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] sm:text-xs font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="col-span-2 sm:col-span-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search map..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Risk Tiers</option>
            <option value="HIGH">High Risk (70–100)</option>
            <option value="MEDIUM">Medium Risk (40–69)</option>
            <option value="LOW">Low Risk (0–39)</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Categories</option>
            <option value="Community Infrastructure">Community</option>
            <option value="Roads & Bridges">Roads</option>
            <option value="Water Facilities & RO Plants">Water</option>
            <option value="Schools & Educational Facilities">Schools</option>
            <option value="Public Health Centres">Health</option>
            <option value="Drainage & Sanitation">Drainage</option>
            <option value="Solar & Street Lighting">Solar</option>
          </select>
        </div>

        <div className="hidden sm:flex items-center justify-between px-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Markers:</span>
          <span className="font-mono font-bold text-cyan-400">{filteredMarkers.length}</span>
        </div>
      </div>

      {/* Main Map & Interactive Flyout Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative">
        {/* Leaflet Map Frame */}
        <div className={`transition-all duration-300 ${selectedMarker ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <LeafletMap
            markers={filteredMarkers}
            similarityLinks={mapData.similarityLinks}
            center={mapCenter}
            zoom={zoomLevel}
            height="calc(100vh - 280px)"
            onMarkerClick={(marker) => setSelectedMarker(marker)}
            selectedMarkerId={selectedMarker?.id}
          />
        </div>

        {/* Selected Marker Detail Flyout Sidebar / Modal */}
        {selectedMarker && (
          <div className="lg:col-span-4 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-3 animate-fadeIn fixed inset-x-3 bottom-16 sm:bottom-auto sm:inset-x-auto sm:relative z-30 max-h-[80vh] overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">{selectedMarker.workId}</span>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug mt-0.5 line-clamp-2">
                    {selectedMarker.workName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="text-slate-400 hover:text-white text-xs p-1.5 rounded-lg bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedMarker.isHeroCase && (
                <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Showcase Hero Anomaly Case</span>
                </div>
              )}

              {/* Risk Badge & Action */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold block">Risk Index</span>
                  <RiskBadge score={selectedMarker.riskScore} level={selectedMarker.riskLevel} size="sm" />
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold block">Action</span>
                  <span className="text-[11px] font-bold text-cyan-300">
                    {selectedMarker.recommendedAction?.replace(/_/g, ' ') || 'VERIFICATION'}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">Category</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedMarker.category}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">Location</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedMarker.district}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">Sanction Cost</span>
                  <span className="font-mono font-bold text-slate-200">₹{(selectedMarker.sanctionAmount / 100000).toFixed(2)} L</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">Status</span>
                  <span className="font-semibold text-cyan-400">{selectedMarker.status || 'ONGOING'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/works/${selectedMarker.workId}`)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Inspect Full Risk Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
