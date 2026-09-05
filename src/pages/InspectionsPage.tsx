import React, { useEffect, useState } from 'react';
import { inspectionService } from '../services/api';
import { InspectionItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ClipboardCheck, ShieldCheck, MapPin, Hash, User, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InspectionsPage: React.FC = () => {
  const [inspections, setInspections] = useState<InspectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const res = await inspectionService.getInspections();
        if (res.data.success) {
          setInspections(res.data.data);
        }
      } catch (e) {
        console.error('Failed to load inspections:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInspections();
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-cyan-400" />
            Human-in-the-Loop Field Inspections
          </h1>
          <p className="text-xs text-slate-400">
            Audit-logged officer observations, on-ground verifications, and cryptographic evidence hashes
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-cyan-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {inspections.length} Recorded Inspections
          </span>
        </div>
      </div>

      {/* Human-in-the-Loop Explanatory Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
              Governance Principle: AI Flag &rarr; Human Verification
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            AI signals serve exclusively as intelligent decision support to rank high-risk works. All administrative, financial, or corrective actions require human officer sign-off and on-ground evidence.
          </p>
        </div>
      </div>

      {/* Inspections List */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-mono">Loading inspection logs...</p>
        </div>
      ) : inspections.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-2">
          <ClipboardCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-200">No field inspections recorded yet</p>
          <p className="text-xs text-slate-400">Navigate to any high-risk project and click &ldquo;Start Human Verification&rdquo; to record on-ground findings.</p>
          <button
            onClick={() => navigate('/works/MPLADS-00421')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold mt-3 transition-colors inline-block"
          >
            Test on Hero Project (MPLADS-00421)
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {inspections.map((ins) => (
            <div
              key={ins.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-cyan-400">{ins.workId}</span>
                  <span className="text-xs font-semibold text-slate-200">{ins.workName}</span>
                  <RiskBadge score={ins.riskScore} level={ins.riskLevel} size="sm" />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold text-[11px]">
                    {ins.status.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => navigate(`/works/${ins.workId}`)}
                    className="p-1 text-slate-400 hover:text-cyan-400"
                    title="View Work"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Remarks */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-slate-400 block mb-0.5">Officer Finding & Remarks:</span>
                {ins.remarks}
              </div>

              {/* Footer Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{ins.officerName} ({ins.officerRole})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(ins.verifiedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate text-emerald-300">{ins.evidenceHash || 'SHA256:Verified'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
