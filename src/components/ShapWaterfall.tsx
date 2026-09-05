import React from 'react';
import { RiskContribution } from '../types';
import { Activity, Info } from 'lucide-react';

interface ShapWaterfallProps {
  contributions: RiskContribution[];
  totalScore: number;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  contributions,
  totalScore,
}) => {
  const maxPoints = Math.max(...contributions.map((c) => c.points), 35);

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Explainable Risk Factors (XAI / SHAP)</h3>
            <p className="text-xs text-slate-400">Signal contribution breakdown toward composite index</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Additive attribution model</span>
        </div>
      </div>

      <div className="space-y-3">
        {contributions.map((item, idx) => {
          const widthPercent = Math.min(100, Math.round((item.points / maxPoints) * 100));
          const isHighest = idx === 0;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isHighest ? 'text-red-300 font-semibold' : 'text-slate-200'}`}>
                  {item.factor}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{item.desc}</span>
                  <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-xs ${
                    isHighest
                      ? 'bg-red-950 text-red-300 border border-red-500/40'
                      : 'bg-slate-800 text-cyan-300'
                  }`}>
                    +{item.points} pts
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isHighest
                      ? 'bg-gradient-to-r from-red-500 to-amber-500'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-500'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-400 uppercase tracking-wider">Composite Calculated Total</span>
        <span className="font-mono text-base font-bold text-white bg-slate-900 px-3 py-1 rounded border border-slate-700">
          {totalScore} / 100
        </span>
      </div>
    </div>
  );
};
