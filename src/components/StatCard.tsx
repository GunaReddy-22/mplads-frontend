import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'cyan' | 'red' | 'amber' | 'emerald' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'cyan',
  onClick,
}) => {
  const accentStyles = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      iconBg: 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(2,132,199,0.15)]',
    },
    red: {
      border: 'border-red-500/20 hover:border-red-500/50',
      iconBg: 'bg-red-950/60 text-red-400 border border-red-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/50',
      iconBg: 'bg-amber-950/60 text-amber-400 border border-amber-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      iconBg: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/50',
      iconBg: 'bg-blue-950/60 text-blue-400 border border-blue-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    },
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-xl border transition-all duration-200 ${accentStyles.border} ${accentStyles.glow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${accentStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className={`font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.value}
          </span>
          <span className="text-slate-500">{trend.label || 'vs last cycle'}</span>
        </div>
      )}
    </div>
  );
};
