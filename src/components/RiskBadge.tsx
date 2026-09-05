import React from 'react';

interface RiskBadgeProps {
  score?: number;
  level: string;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  size = 'md',
  showScore = true,
}) => {
  const normLevel = level?.toUpperCase() || 'LOW';

  const colorStyles = {
    HIGH: 'bg-red-950/80 text-red-300 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
    MEDIUM: 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    LOW: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  }[normLevel] || 'bg-slate-800 text-slate-300 border-slate-600';

  const dotColor = {
    HIGH: 'bg-red-400 animate-pulse',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-emerald-400',
  }[normLevel] || 'bg-slate-400';

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${colorStyles} ${sizeStyles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{normLevel} RISK</span>
      {showScore && score !== undefined && (
        <span className="opacity-75 font-mono text-[0.9em]">({score}/100)</span>
      )}
    </span>
  );
};
