import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import { DashboardData } from '../types';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';
import { IntelligenceLayerCards } from '../components/IntelligenceLayerCards';
import { LeafletMap } from '../components/LeafletMap';
import {
  FolderKanban,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useNavigate, Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getStats();
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-400">Aggregating National Risk Telemetry...</p>
        </div>
      </div>
    );
  }

  const { kpis, riskDistribution, categoryRiskDistribution, priorityQueue, trendData } = data;

  // Mini map points from top high-risk priority queue
  const mapPoints = priorityQueue.map((item, idx) => ({
    id: item.id,
    workId: item.workId,
    workName: item.workName,
    category: item.category,
    district: item.district,
    state: item.state,
    sanctionAmount: item.sanctionAmount,
    riskScore: item.riskScore,
    riskLevel: item.riskLevel,
    isHeroCase: item.isHeroCase,
    lat: item.isHeroCase ? 18.5312 : (18.52 + idx * 0.4),
    lng: item.isHeroCase ? 73.8645 : (73.85 + idx * 0.4),
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
              National MPLADS Risk Dashboard
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              Live Evaluation
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Intelligent risk scoring, peer cost benchmarking, and prioritized inspection dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/works/MPLADS-00421"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-950/50 transition-all group"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hero Demo Case (84/100)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        <StatCard
          title="Total Works"
          value={kpis.totalWorks.toLocaleString()}
          subtitle="Monitored records"
          icon={FolderKanban}
          accentColor="blue"
          onClick={() => navigate('/works')}
        />
        <StatCard
          title="High Risk"
          value={kpis.highRiskCount}
          subtitle="Priority inspection"
          icon={ShieldAlert}
          accentColor="red"
          onClick={() => navigate('/works?riskLevel=HIGH')}
        />
        <StatCard
          title="Medium Risk"
          value={kpis.mediumRiskCount}
          subtitle="Desk review"
          icon={AlertTriangle}
          accentColor="amber"
          onClick={() => navigate('/works?riskLevel=MEDIUM')}
        />
        <StatCard
          title="Low Risk"
          value={kpis.lowRiskCount}
          subtitle="Normal progress"
          icon={ShieldCheck}
          accentColor="emerald"
          onClick={() => navigate('/works?riskLevel=LOW')}
        />
        <StatCard
          title="Sanctioned"
          value={`₹${(kpis.totalSanctioned / 10000000).toFixed(1)} Cr`}
          subtitle="Approved outlay"
          icon={IndianRupee}
          accentColor="cyan"
        />
        <StatCard
          title="Expenditure"
          value={`₹${(kpis.totalExpenditure / 10000000).toFixed(1)} Cr`}
          subtitle={`${kpis.utilizationRate.toFixed(1)}% utilized`}
          icon={TrendingUp}
          accentColor="cyan"
        />
      </div>

      {/* AI Intelligence Layer Architecture Cards */}
      <IntelligenceLayerCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Risk Distribution Donut */}
        <div className="lg:col-span-4 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-white">Risk Classification</h3>
              <span className="text-[10px] font-mono text-slate-400">1,000 Works</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-1">
              Multi-signal composite score distribution
            </p>

            <div className="h-48 sm:h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} works`, 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">{kpis.highRiskCount}</span>
                <span className="text-[9px] sm:text-[10px] text-red-400 font-bold uppercase">High Risk</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-slate-800 text-center">
            {riskDistribution.map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 p-1.5 sm:p-2 rounded-lg border border-slate-800">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-300 font-semibold truncate">{item.name.split(' ')[0]}</span>
                </div>
                <span className="font-mono text-xs sm:text-sm font-bold text-white">{item.count}</span>
                <span className="text-[9px] text-slate-500 block">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Risk Breakdown */}
        <div className="lg:col-span-8 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white">Risk Across Infrastructure Categories</h3>
              <p className="text-[11px] text-slate-400">High, medium, and low risk frequency per sector</p>
            </div>
            <Link to="/works" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-56 sm:h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRiskDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="category"
                  stroke="#64748B"
                  fontSize={9}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }} />
                <Bar dataKey="highRisk" name="High Risk" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="mediumRisk" name="Medium Risk" fill="#F59E0B" stackId="a" />
                <Bar dataKey="lowRisk" name="Low Risk" fill="#10B981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Inspection Queue ⭐⭐⭐ */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                Priority Inspection Queue
              </h3>
              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                Ranked by Risk
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Prioritizes high-risk works for on-ground field verification.
            </p>
          </div>
          <Link
            to="/works?riskLevel=HIGH"
            className="text-[11px] sm:text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All ({kpis.highRiskCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile View: Clean Card List */}
        <div className="space-y-2.5 sm:hidden">
          {priorityQueue.map((work) => (
            <div
              key={work.id}
              onClick={() => navigate(`/works/${work.workId}`)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                work.isHeroCase
                  ? 'bg-red-950/30 border-red-500/40 shadow-glow-danger'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                    {work.isHeroCase && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    <span className={work.isHeroCase ? 'text-amber-300' : 'text-cyan-400'}>
                      {work.workId}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-100 line-clamp-1 mt-0.5">{work.workName}</p>
                </div>
                <RiskBadge score={work.riskScore} level={work.riskLevel} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 my-2 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">Location</span>
                  <span className="text-slate-200">{work.district}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sanction Cost</span>
                  <span className="font-mono text-slate-200 font-semibold">₹{(work.sanctionAmount / 100000).toFixed(2)} L</span>
                </div>
              </div>

              <div className="text-[11px] text-red-300/90 bg-red-950/20 p-2 rounded border border-red-500/20 mb-2">
                {work.primaryReason}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-emerald-400 font-mono">
                  Phys: {work.physicalProgress}% • Fin: {work.financialProgress}%
                </span>
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet View: Tabular */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Work ID</th>
                <th className="pb-3 font-semibold">Work Name & Category</th>
                <th className="pb-3 font-semibold">District</th>
                <th className="pb-3 font-semibold">Sanction</th>
                <th className="pb-3 font-semibold">Progress</th>
                <th className="pb-3 font-semibold text-center">Risk Score</th>
                <th className="pb-3 font-semibold">Flag Reason</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {priorityQueue.map((work) => (
                <tr
                  key={work.id}
                  className={`hover:bg-slate-900/60 transition-colors ${
                    work.isHeroCase ? 'bg-red-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      {work.isHeroCase && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span className={work.isHeroCase ? 'text-amber-300' : 'text-cyan-400'}>
                        {work.workId}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 max-w-xs">
                    <p className="font-semibold text-slate-200 truncate">{work.workName}</p>
                    <p className="text-[11px] text-slate-400">{work.category}</p>
                  </td>
                  <td className="py-3.5 text-slate-300">
                    <div>{work.district}</div>
                    <div className="text-[10px] text-slate-500">{work.state}</div>
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-slate-200">
                    ₹{(work.sanctionAmount / 100000).toFixed(2)} L
                  </td>
                  <td className="py-3.5 w-32">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-emerald-400">P: {work.physicalProgress}%</span>
                        <span className="text-cyan-400">F: {work.financialProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${work.physicalProgress}%` }} />
                        <div className="bg-cyan-500 h-full opacity-60" style={{ width: `${Math.max(0, work.financialProgress - work.physicalProgress)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-center">
                    <RiskBadge score={work.riskScore} level={work.riskLevel} size="sm" />
                  </td>
                  <td className="py-3.5 max-w-xs text-[11px] text-slate-300 truncate">
                    {work.primaryReason}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/works/${work.workId}`)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-white font-semibold transition-colors inline-flex items-center gap-1 shadow"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Mini GIS Preview & Trend Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Interactive GIS Preview */}
        <div className="lg:col-span-6 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">Geospatial Risk Preview</h3>
            </div>
            <Link to="/map" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              <span>Full GIS Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <LeafletMap
            markers={mapPoints}
            center={[18.5204, 73.8567]}
            zoom={10}
            height="220px"
          />
        </div>

        {/* Risk Score Trends */}
        <div className="lg:col-span-6 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">Risk Evolution Trend</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">6-Month Trajectory</span>
          </div>

          <div className="h-56 sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="highRisk" name="High Risk Works" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="mediumRisk" name="Medium Risk Works" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="avgScore" name="Avg Risk Score" stroke="#0284C7" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};
