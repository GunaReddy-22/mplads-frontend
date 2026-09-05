import React from 'react';
import { Network, TrendingUp, Clock, Copy, ShieldAlert, MapPin } from 'lucide-react';

export const IntelligenceLayerCards: React.FC = () => {
  const engines = [
    {
      title: 'Multivariate Anomaly',
      algorithm: 'Isolation Forest / LOF',
      description: 'Ingests multidimensional project features to detect anomalous execution behaviors without requiring labeled fraud data.',
      icon: Network,
      badge: 'Planned ML Integration',
      weight: '25% Weight',
      color: 'border-blue-500/30 text-blue-400 bg-blue-950/40',
    },
    {
      title: 'Cost Intelligence',
      algorithm: 'Robust Peer Regression',
      description: 'Dynamic benchmark modeling across district, category, and scale to flag cost deviations exceeding state Schedule of Rates.',
      icon: TrendingUp,
      badge: 'Planned ML Integration',
      weight: '25% Weight',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40',
    },
    {
      title: 'Delay / Timeline Risk',
      algorithm: 'Timeline Velocity Analysis',
      description: 'Quantifies schedule slippage by comparing elapsed project timeframe against verified physical and financial milestones.',
      icon: Clock,
      badge: 'Planned ML Integration',
      weight: '20% Weight',
      color: 'border-amber-500/30 text-amber-400 bg-amber-950/40',
    },
    {
      title: 'Similarity & Duplication',
      algorithm: 'Sentence Transformers + Cosine',
      description: 'Detects semantic overlap in project descriptions paired with spatial proximity to highlight potentially duplicate works.',
      icon: Copy,
      badge: 'Planned ML Integration',
      weight: '15% Weight',
      color: 'border-purple-500/30 text-purple-400 bg-purple-950/40',
    },
    {
      title: 'Expenditure Velocity',
      algorithm: 'Milestone Discrepancy Rule',
      description: 'Flags unusual disbursement acceleration where financial progress disproportionately leads verified on-ground execution.',
      icon: ShieldAlert,
      badge: 'Planned ML Integration',
      weight: '10% Weight',
      color: 'border-red-500/30 text-red-400 bg-red-950/40',
    },
    {
      title: 'Spatial Intelligence',
      algorithm: 'PostGIS Proximity Engine',
      description: 'Geospatial clustering and radius queries across assembly constituencies to uncover localized anomaly density.',
      icon: MapPin,
      badge: 'Planned ML Integration',
      weight: '5% Weight',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            AI Intelligence Layer Architecture
          </h3>
          <p className="text-xs text-slate-400">
            Multi-engine decision support pipeline fusing statistical, semantic, and geospatial signals
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Ensemble Pipeline v1.2.4
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {engines.map((e, idx) => {
          const Icon = e.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`p-2 rounded-lg ${e.color} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 border border-slate-700/60">
                    {e.weight}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {e.title}
                </h4>
                <p className="text-xs font-mono text-cyan-400/90 mt-0.5 mb-2">
                  {e.algorithm}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {e.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Engine {idx + 1}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  {e.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
