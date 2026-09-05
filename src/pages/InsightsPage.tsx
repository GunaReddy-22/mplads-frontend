import React from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, MapPin, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InsightsPage: React.FC = () => {
  const navigate = useNavigate();

  const insights = [
    {
      id: 1,
      type: 'COST_ANOMALY_HOTSPOT',
      title: 'Community Infrastructure Cost Outliers in Urban Peripheries',
      severity: 'HIGH',
      description: 'Peer regression analysis identified 14 community center projects in Pune and Nagpur districts with sanction costs 35–48% higher than standard State PWD Schedule of Rates.',
      action: 'Triggered automated desk review alerts and SoR benchmark validation.',
      workRef: 'MPLADS-00421',
      impact: '₹1.84 Cr potential budget variance scrutinized',
    },
    {
      id: 2,
      type: 'PROGRESS_VELOCITY_GAP',
      title: 'Expenditure vs Physical Verification Asymmetry',
      severity: 'HIGH',
      description: 'Disproportionate fund velocity detected in 18 rural drainage works where financial disbursement exceeds 75% but physical completion remains stalled below 40%.',
      action: 'Stage 2 payment holds recommended pending independent Measurement Book verification.',
      workRef: 'MPLADS-00350',
      impact: '18 high-risk works queued for priority physical inspection',
    },
    {
      id: 3,
      type: 'GEOSPATIAL_DUPLICATE_CLUSTER',
      title: 'Semantic Description Overlap in Adjacent Wards',
      severity: 'MEDIUM',
      description: 'Sentence Transformer NLP embeddings paired with PostGIS proximity detected 8 candidate pairs of community training centres within 2 km of each other with >88% scope overlap.',
      action: 'Dispatched spatial deduplication notices to Implementing Agencies.',
      workRef: 'MPLADS-00418',
      impact: 'Prevents double-allocation across contiguous administrative wards',
    },
    {
      id: 4,
      type: 'DELAY_CASCADE_PREDICTION',
      title: 'Monsoon Infrastructure Lag in Coastal Blocks',
      severity: 'MEDIUM',
      description: 'Timeline velocity models project a 4-month completion slippage across 32 road and culvert works sanctioned between Oct–Dec 2024 due to supply chain and seasonal halts.',
      action: 'Recommended revised revised milestone scheduling and agency follow-ups.',
      workRef: 'MPLADS-00219',
      impact: 'Early intervention prevents multi-year project abandonment',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
          AI Decision-Support Insights
        </h1>
        <p className="text-xs text-slate-400">
          Synthesized intelligence patterns transforming raw telemetry into actionable administrative interventions
        </p>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  ins.severity === 'HIGH'
                    ? 'bg-red-950 text-red-300 border-red-500/40'
                    : 'bg-amber-950 text-amber-300 border-amber-500/40'
                }`}>
                  {ins.severity} PRIORITY INSIGHT
                </span>
                <span className="text-xs font-mono text-cyan-400">{ins.impact}</span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {ins.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {ins.description}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                <strong className="text-cyan-400">Recommended Action: </strong>
                {ins.action}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 text-[11px]">Representative: {ins.workRef}</span>
              <button
                onClick={() => navigate(`/works/${ins.workRef}`)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1 shadow"
              >
                <span>Inspect Evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
