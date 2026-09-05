import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { worksService } from '../services/api';
import { Work, SimilarWorkItem, ComplianceCheck, AuditLogItem } from '../types';
import { RiskGauge } from '../components/RiskGauge';
import { ShapWaterfall } from '../components/ShapWaterfall';
import { SimilarWorksCard } from '../components/SimilarWorksCard';
import { ComplianceChecklist } from '../components/ComplianceChecklist';
import { VerificationModal } from '../components/VerificationModal';
import { LeafletMap } from '../components/LeafletMap';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  History,
  Info,
} from 'lucide-react';

export const WorkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [work, setWork] = useState<any | null>(null);
  const [similarWorks, setSimilarWorks] = useState<SimilarWorkItem[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const fetchWorkDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await worksService.getWorkById(id);
      if (res.data.success) {
        setWork(res.data.data);
        setSimilarWorks(res.data.data.similarWorks || []);
        setComplianceChecks(res.data.data.complianceChecks || []);
        setAuditLogs(res.data.data.auditLogs || []);
      }
    } catch (e) {
      console.error('Error fetching work detail:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkDetail();
  }, [id]);

  const handleVerificationSuccess = (newInspection: any) => {
    fetchWorkDetail();
  };

  if (isLoading || !work) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-400">Loading Work Telemetry & Risk Profile...</p>
        </div>
      </div>
    );
  }

  const risk = work.risk || {
    overallScore: 0,
    riskLevel: 'LOW',
    reasons: [],
    contributions: [],
    recommendedAction: 'ROUTINE_INSPECTION',
    modelVersion: 'v1.2.4-hybrid-ensemble',
  };

  // Coordinates for mini map
  const mapMarkers = [
    {
      id: work.id,
      workId: work.workId,
      workName: work.workName,
      category: work.category,
      lat: work.latitude,
      lng: work.longitude,
      district: work.district.name,
      sanctionAmount: work.sanctionAmount,
      riskScore: risk.overallScore,
      riskLevel: risk.riskLevel,
      isHeroCase: work.isHeroCase,
    },
    ...similarWorks.map((sw) => ({
      id: sw.idRef,
      workId: sw.workId,
      workName: sw.workName,
      category: sw.category,
      lat: sw.latitude,
      lng: sw.longitude,
      district: sw.district,
      sanctionAmount: sw.sanctionAmount,
      riskScore: sw.riskScore,
      riskLevel: sw.riskScore >= 70 ? 'HIGH' : 'MEDIUM',
    })),
  ];

  const similarityLinks = similarWorks.map((sw) => ({
    id: sw.id,
    similarityScore: sw.similarityScore,
    distanceKm: sw.distanceKm,
    source: { lat: work.latitude, lng: work.longitude, workId: work.workId, workName: work.workName },
    target: { lat: sw.latitude, lng: sw.longitude, workId: sw.workId, workName: sw.workName },
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <button
            onClick={() => navigate('/works')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0 mt-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400">{work.workId}</span>
              {work.isHeroCase && (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  HERO SHOWCASE
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              {work.workName}
            </h1>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Start Human Verification</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Risk Dial & Contributors, Right Project Info & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Column: Risk Gauge & SHAP Waterfall */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          {/* Big Visual Risk Dial */}
          <RiskGauge
            score={risk.overallScore}
            level={risk.riskLevel}
            recommendedAction={risk.recommendedAction}
            modelVersion={risk.modelVersion}
          />

          {/* Explainable AI Factors (SHAP Waterfall) */}
          <ShapWaterfall
            contributions={risk.contributions}
            totalScore={risk.overallScore}
          />
        </div>

        {/* Right Column: Why Flagged, Project Metadata, & Financials */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          
          {/* "Why Was This Project Flagged?" Card */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-500/40">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Why was this project flagged?
              </h3>
            </div>

            <div className="space-y-2">
              {risk.reasons.map((reason: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>

            {/* Critical Caution Notice */}
            <div className="mt-3.5 p-2.5 sm:p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 flex items-start sm:items-center gap-2 text-[11px] sm:text-xs text-amber-200/90 leading-relaxed">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>Decision Support Note: </strong>
                Elevated-risk indicator for inspection prioritization, not a confirmed fraud determination.
              </span>
            </div>
          </div>

          {/* Project Details & Financials Grid */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-white">Project Scope & Administrative Details</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
              <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Category</span>
                <span className="font-semibold text-slate-200 mt-0.5 block truncate">{work.category}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Location</span>
                <span className="font-semibold text-slate-200 mt-0.5 block truncate">{work.district.name}, {work.state.name}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Implementing Agency</span>
                <span className="font-semibold text-slate-200 mt-0.5 block truncate">{work.agency.name}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Status</span>
                <span className="font-semibold text-cyan-400 mt-0.5 block">{work.status}</span>
              </div>
            </div>

            {/* Dual Progress Bars & Financials */}
            <div className="bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Execution Progress</span>
                <span className="font-mono text-[10px] sm:text-[11px] text-slate-400">
                  Gap: {(work.financialProgress - work.physicalProgress).toFixed(1)}%
                </span>
              </div>

              {/* Progress visual */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Physical Progress</span>
                    <span className="font-mono font-bold text-emerald-400">{work.physicalProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${work.physicalProgress}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Financial Disbursement</span>
                    <span className="font-mono font-bold text-cyan-400">{work.financialProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${work.financialProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Financial stats row */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-slate-800/80 text-[11px] sm:text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[9px] sm:text-[10px] block">Sanction</span>
                  <span className="font-bold text-white">₹{(work.sanctionAmount / 100000).toFixed(2)} L</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] sm:text-[10px] block">Peer Median</span>
                  <span className="font-bold text-slate-300">₹{(work.peerBenchmarkCost ? work.peerBenchmarkCost / 100000 : 30.4).toFixed(2)} L</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] sm:text-[10px] block">Expenditure</span>
                  <span className="font-bold text-cyan-400">₹{(work.expenditureAmount / 100000).toFixed(2)} L</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Potentially Similar Works & Compliance Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-6">
          <SimilarWorksCard
            currentWorkId={work.workId}
            similarWorks={similarWorks}
          />
        </div>
        <div className="lg:col-span-6">
          <ComplianceChecklist checks={complianceChecks} />
        </div>
      </div>

      {/* Mini GIS Map & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Project Location Map */}
        <div className="lg:col-span-6 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">Geospatial Site Context</h3>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
              {work.latitude.toFixed(4)}° N, {work.longitude.toFixed(4)}° E
            </span>
          </div>

          <LeafletMap
            markers={mapMarkers}
            similarityLinks={similarityLinks}
            center={[work.latitude, work.longitude]}
            zoom={13}
            height="220px"
          />
        </div>

        {/* Audit Trail & History */}
        <div className="lg:col-span-6 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-white">Verification Trail</h3>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                Immutable Log
              </span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <History className="w-7 h-7 mx-auto mb-1.5 opacity-40" />
                <p>No field inspections or overrides recorded yet.</p>
                <p className="text-[10px] mt-1 text-slate-400">Click &ldquo;Start Human Verification&rdquo; to record findings.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {auditLogs.map((log) => {
                  let details: any = {};
                  try {
                    details = JSON.parse(log.details);
                  } catch (e) {}

                  return (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-cyan-400 text-[11px]">{log.action.replace(/_/g, ' ')}</span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{details.remarks || 'Action committed'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Record field verification</span>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
            >
              Verify Now
            </button>
          </div>
        </div>
      </div>

      {/* Verification Modal Dialog */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        workId={work.workId}
        workName={work.workName}
        latitude={work.latitude}
        longitude={work.longitude}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
};
