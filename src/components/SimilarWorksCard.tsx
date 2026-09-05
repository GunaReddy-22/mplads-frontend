import React from 'react';
import { SimilarWorkItem } from '../types';
import { Copy, MapPin, ArrowRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SimilarWorksCardProps {
  currentWorkId: string;
  similarWorks: SimilarWorkItem[];
}

export const SimilarWorksCard: React.FC<SimilarWorksCardProps> = ({
  currentWorkId,
  similarWorks,
}) => {
  const navigate = useNavigate();

  if (!similarWorks || similarWorks.length === 0) {
    return (
      <div className="glass-panel p-5 rounded-xl border border-slate-800 text-center py-8">
        <Copy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400 font-medium">No Potential Similar Works Flagged</p>
        <p className="text-xs text-slate-500 mt-1">NLP embeddings and spatial clustering found no conflicting scope within a 5 km radius.</p>
      </div>
    );
  }

  const primarySimilar = similarWorks[0];

  return (
    <div className="glass-panel p-5 rounded-xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.1)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-950/70 text-purple-400 border border-purple-500/30">
            <Copy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Potentially Similar Work Detected</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                NLP + GIS Match
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High semantic description overlap & close geographic proximity
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-purple-300">
            {primarySimilar.similarityScore}%
          </span>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Similarity Index</p>
        </div>
      </div>

      {/* Comparison Box */}
      <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500 font-mono">Comparing:</span>
            <span className="font-mono font-semibold text-cyan-400">{currentWorkId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono font-semibold text-purple-400">{primarySimilar.workId}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{primarySimilar.distanceKm} km apart</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-200">{primarySimilar.workName}</p>
          <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-slate-400">
            <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">Category</span>
              <span className="font-medium text-slate-200">{primarySimilar.category}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">Sanction Cost</span>
              <span className="font-medium font-mono text-slate-200">₹{(primarySimilar.sanctionAmount / 100000).toFixed(2)} L</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">Location</span>
              <span className="font-medium text-slate-200">{primarySimilar.district}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-purple-950/30 p-2.5 rounded border border-purple-500/20 leading-relaxed">
          <span className="font-semibold text-purple-300">Intelligence Note: </span>
          {primarySimilar.reasons}
        </div>
      </div>

      {/* Warning caveat + Actions */}
      <div className="mt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Elevated-risk indicator for verification, not a fraud determination.</span>
        </div>

        <button
          onClick={() => navigate(`/works/${primarySimilar.workId}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-colors"
        >
          <span>View Matched Work</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
