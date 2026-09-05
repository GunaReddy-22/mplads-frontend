import React, { useState } from 'react';
import { inspectionService } from '../services/api';
import { ShieldCheck, Upload, CheckCircle2, AlertCircle, Hash, MapPin, X } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workId: string;
  workName: string;
  latitude: number;
  longitude: number;
  onSuccess: (newInspection: any) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  workId,
  workName,
  latitude,
  longitude,
  onSuccess,
}) => {
  const [status, setStatus] = useState('FIELD_INSPECTION_REQUIRED');
  const [remarks, setRemarks] = useState('');
  const [evidenceFileName, setEvidenceFileName] = useState('site-inspection-geo-evidence.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Please enter verification remarks and finding observations.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await inspectionService.createInspection({
        workId,
        status,
        remarks,
        evidenceFileName,
        latitude,
        longitude,
      });

      if (res.data.success) {
        setGeneratedHash(res.data.data.evidenceHash);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(res.data.data);
          onClose();
          setIsSuccess(false);
          setRemarks('');
        }, 1800);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Record Human Verification & Inspection</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  Human-in-the-Loop
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {workId} • {workName.slice(0, 42)}...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-success animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Verification Recorded Successfully</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              The on-ground observation and geotagged evidence hash have been immutably committed to the audit trail.
            </p>
            {generatedHash && (
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 break-all max-w-md mx-auto">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Evidence SHA-256 Hash</span>
                {generatedHash}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Verification Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Inspection / Verification Determination
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="FIELD_INSPECTION_REQUIRED">Field Inspection Required (Physical site team dispatched)</option>
                <option value="REQUIRES_CLARIFICATION">Requires Clarification (Notice sent to Implementing Agency)</option>
                <option value="DOCUMENT_REVIEW_REQUIRED">Document Review Required (Measurement Book / SoR audit)</option>
                <option value="VERIFIED_NO_ISSUE">Verified — No Issue Found (Legitimate variance explained)</option>
                <option value="ESCALATED">Escalate for Higher Authority Review</option>
              </select>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Authorized Officer Remarks & Field Findings
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter detailed field observation, contractor response, reason for cost or timeline variance..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Simulated Evidence & Geotagging */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  Upload Geotagged Site Evidence
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">Simulated GPS & SHA-256</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={evidenceFileName}
                  onChange={(e) => setEvidenceFileName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setEvidenceFileName(`site-photo-${Date.now().toString().slice(-4)}.jpg`)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                >
                  Regenerate
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  GPS: {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Hash className="w-3 h-3" />
                  Auto-hashed upon commit
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recording in Audit Log...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit & Commit Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
