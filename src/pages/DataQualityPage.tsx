import React, { useEffect, useState } from 'react';
import { dataQualityService } from '../services/api';
import { Database, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, Layers, ArrowRight } from 'lucide-react';

export const DataQualityPage: React.FC = () => {
  const [qualityData, setQualityData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await dataQualityService.getReport();
        if (res.data.success) {
          setQualityData(res.data.data);
        }
      } catch (e) {
        console.error('Failed to load data quality:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (isLoading || !qualityData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-400">Auditing Data Quality & Lineage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Database className="w-6 h-6 text-cyan-400" />
          Data Quality & Ingestion Lineage
        </h1>
        <p className="text-xs text-slate-400">
          Automated integrity scoring, boundary validation, and provenance tracking for eSAKSHI datasets
        </p>
      </div>

      {/* Top Health Score Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            Data Integrity Audit Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">{qualityData.overallHealthScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              High Trust Level
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            1,000 synthetic MPLADS records evaluated across 6 automated sanity dimensions before feature ingestion.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Coordinates Valid</span>
            <span className="font-bold text-cyan-300">{qualityData.coordinateCompleteness}%</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Financial Sanity</span>
            <span className="font-bold text-emerald-300">{qualityData.financialSanityRate}%</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Chronology Valid</span>
            <span className="font-bold text-cyan-300">{qualityData.timelineChronologyValid}%</span>
          </div>
        </div>
      </div>

      {/* Automated Data Health Dimension Checklist */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white">Automated Pre-Ingestion Integrity Rules</h3>

        <div className="space-y-2.5">
          {qualityData.checks.map((check: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-semibold text-slate-200">{check.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{check.details}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">{check.score}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  check.status === 'PASS'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}>
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Lineage & Provenance Metadata */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-white">Data Lineage & Provenance</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">Source System</span>
            <p className="font-semibold text-slate-200">{qualityData.dataLineage.sourceSystem}</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">Dataset Version Tag</span>
            <p className="font-mono font-semibold text-cyan-400">{qualityData.dataLineage.datasetVersion}</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">Ingestion Protocol</span>
            <p className="font-semibold text-slate-200">{qualityData.dataLineage.ingestionProtocol}</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">Validation Checksum (SHA-256)</span>
            <p className="font-mono text-[11px] text-slate-400 truncate">{qualityData.dataLineage.validationHash}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
