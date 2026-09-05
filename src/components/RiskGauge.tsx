import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  level: string;
  recommendedAction?: string;
  modelVersion?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  recommendedAction,
  modelVersion = 'v1.2.4-hybrid-ensemble',
}) => {
  const normLevel = level?.toUpperCase() || 'LOW';

  // SVG Gauge calculations
  const radius = 68;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorConfig = {
    HIGH: {
      text: 'text-red-400',
      stroke: '#EF4444',
      bgGlow: 'shadow-[0_0_50px_rgba(239,68,68,0.25)] border-red-500/40',
      icon: ShieldAlert,
      tagBg: 'bg-red-950/70 border-red-500/40 text-red-300',
      actionText: 'PRIORITY VERIFICATION REQUIRED',
    },
    MEDIUM: {
      text: 'text-amber-400',
      stroke: '#F59E0B',
      bgGlow: 'shadow-[0_0_50px_rgba(245,158,11,0.2)] border-amber-500/40',
      icon: AlertTriangle,
      tagBg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
      actionText: 'DESK REVIEW & CLARIFICATION',
    },
    LOW: {
      text: 'text-emerald-400',
      stroke: '#10B981',
      bgGlow: 'shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/40',
      icon: ShieldCheck,
      tagBg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
      actionText: 'ROUTINE MONITORING',
    },
  }[normLevel] || {
    text: 'text-cyan-400',
    stroke: '#0284C7',
    bgGlow: 'shadow-glow border-cyan-500/40',
    icon: ShieldCheck,
    tagBg: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
    actionText: 'MONITORING',
  };

  const Icon = colorConfig.icon;

  return (
    <div className={`glass-panel p-6 rounded-2xl border ${colorConfig.bgGlow} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950/80 pointer-events-none" />

      {/* Top Tag */}
      <div className="flex items-center gap-2 mb-3 z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Composite Risk Index
        </span>
      </div>

      {/* SVG Circular Dial */}
      <div className="relative flex items-center justify-center z-10 my-1">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] drop-shadow-md">
          {/* Background circle */}
          <circle
            stroke="#1E293B"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated progress circle */}
          <circle
            stroke={colorConfig.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${colorConfig.text}`}>
              {score}
            </span>
            <span className="text-slate-500 font-mono text-sm ml-0.5">/100</span>
          </div>
          <span className={`text-[11px] font-bold tracking-wider mt-0.5 ${colorConfig.text}`}>
            {normLevel} RISK
          </span>
        </div>
      </div>

      {/* Action Recommendation */}
      <div className="mt-4 z-10 w-full">
        <div className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 ${colorConfig.tagBg}`}>
          <Icon className="w-4 h-4 shrink-0" />
          <span>{recommendedAction ? recommendedAction.replace(/_/g, ' ') : colorConfig.actionText}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Prototype Risk Classification</span>
          <span className="font-mono text-[10px] text-slate-500">{modelVersion}</span>
        </div>
      </div>
    </div>
  );
};
