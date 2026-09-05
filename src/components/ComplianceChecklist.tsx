import React from 'react';
import { ComplianceCheck } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

interface ComplianceChecklistProps {
  checks: ComplianceCheck[];
}

export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ checks }) => {
  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Rule-Based Compliance Checks</h3>
            <p className="text-xs text-slate-400">Automated statutory, rate adherence, and procedural checks</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {checks.map((c) => {
          const statusConfig = {
            PASSED: {
              icon: CheckCircle2,
              text: 'text-emerald-400',
              bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
              label: 'Passed',
            },
            REQUIRES_REVIEW: {
              icon: AlertTriangle,
              text: 'text-amber-400',
              bg: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
              label: 'Requires Review',
            },
            VIOLATION: {
              icon: XCircle,
              text: 'text-red-400',
              bg: 'bg-red-950/40 border-red-500/30 text-red-300',
              label: 'Deviation Flagged',
            },
          }[c.status] || {
            icon: AlertTriangle,
            text: 'text-slate-400',
            bg: 'bg-slate-900 border-slate-700 text-slate-300',
            label: 'Pending',
          };

          const Icon = statusConfig.icon;

          return (
            <div
              key={c.id}
              className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">{c.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{c.details}</p>
              </div>

              <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${statusConfig.bg}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{statusConfig.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
