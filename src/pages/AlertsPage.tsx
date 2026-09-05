import React, { useEffect, useState } from 'react';
import { alertService } from '../services/api';
import { AlertItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ShieldAlert, Filter, CheckCircle2, Clock, XCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await alertService.getAlerts({
        status: statusFilter || undefined,
        riskLevel: riskFilter || undefined,
      });
      if (res.data.success) {
        setAlerts(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load alerts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, riskFilter]);

  const handleUpdateStatus = async (alertId: string, newStatus: string) => {
    try {
      await alertService.updateStatus(alertId, {
        status: newStatus,
        remarks: `Alert transitioned to ${newStatus} by officer`,
      });
      fetchAlerts();
    } catch (e) {
      console.error('Failed to update alert:', e);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Risk Alerts & Decision Queue
          </h1>
          <p className="text-xs text-slate-400">
            Real-time notifications triggered by multi-model anomaly thresholds and spatial proximity collisions
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-cyan-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {alerts.length} Active System Alerts
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          {['', 'NEW', 'UNDER_REVIEW', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st === '' ? 'All Workflow Status' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Severities</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-mono">Fetching risk alert stream...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-200">No active alerts found</p>
          <p className="text-xs text-slate-400">All current anomaly indicators are either resolved or within tolerances.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isHigh = alert.riskLevel === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`glass-panel p-4 md:p-5 rounded-2xl border transition-all ${
                  isHigh ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Left: Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {alert.work.workId}
                      </span>
                      <RiskBadge score={alert.work.riskScore} level={alert.riskLevel} size="sm" />
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {alert.alertType.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alert.status === 'NEW'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                          : alert.status === 'UNDER_REVIEW'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {alert.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{alert.description}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Project: {alert.work.workName} • {alert.work.district}, {alert.work.state}
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {alert.status === 'NEW' && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'UNDER_REVIEW')}
                        className="px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
                      >
                        Mark Under Review
                      </button>
                    )}
                    {alert.status === 'UNDER_REVIEW' && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors"
                      >
                        Resolve Alert
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/works/${alert.work.workId}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
                    >
                      <span>Inspect Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
