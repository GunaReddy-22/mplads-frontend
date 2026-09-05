import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { worksService } from '../services/api';
import { Work } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { Search, Filter, ChevronLeft, ChevronRight, Sparkles, FolderKanban, SlidersHorizontal } from 'lucide-react';

export const WorksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states from URL params
  const search = searchParams.get('search') || '';
  const riskLevel = searchParams.get('riskLevel') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sortBy') || 'riskScore';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const fetchWorks = async () => {
      setIsLoading(true);
      try {
        const res = await worksService.getWorks({
          page,
          limit: 15,
          search,
          riskLevel: riskLevel || undefined,
          category: category || undefined,
          status: status || undefined,
          sortBy,
          sortOrder: 'desc',
        });
        if (res.data.success) {
          setWorks(res.data.data.works);
          setPagination(res.data.data.pagination);
        }
      } catch (e) {
        console.error('Error fetching works:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorks();
  }, [search, riskLevel, category, status, sortBy, page]);

  const updateFilters = (newParams: Record<string, string>) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated: Record<string, string> = { ...current, ...newParams, page: '1' };
    
    // Remove empty keys
    Object.keys(updated).forEach((k) => {
      if (!updated[k]) delete updated[k];
    });

    setSearchParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handlePageChange = (newPage: number) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, page: newPage.toString() });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            MPLADS Works Explorer
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Search, filter, and inspect developmental projects prioritized by AI risk signals
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            {pagination.total} Total Records
          </span>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden p-2 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 text-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-3">
        {/* Search row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 sm:top-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Work ID (e.g. MPLADS-00421), title, district..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow shrink-0"
          >
            Search
          </button>
        </form>

        {/* Dropdowns row (Visible on desktop / Collapsible on mobile) */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 ${showMobileFilters ? 'block' : 'hidden sm:grid'}`}>
          {/* Risk Level Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Risk Tier</label>
            <select
              value={riskLevel}
              onChange={(e) => updateFilters({ riskLevel: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Risk Tiers</option>
              <option value="HIGH">High Risk (70–100)</option>
              <option value="MEDIUM">Medium Risk (40–69)</option>
              <option value="LOW">Low Risk (0–39)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Categories</option>
              <option value="Community Infrastructure">Community Infrastructure</option>
              <option value="Roads & Bridges">Roads & Bridges</option>
              <option value="Water Facilities & RO Plants">Water Facilities</option>
              <option value="Schools & Educational Facilities">Schools & Education</option>
              <option value="Public Health Centres">Public Health</option>
              <option value="Drainage & Sanitation">Drainage</option>
              <option value="Solar & Street Lighting">Solar Lighting</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Statuses</option>
              <option value="ONGOING">Ongoing</option>
              <option value="DELAYED">Delayed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="riskScore">Highest Risk Score</option>
              <option value="sanctionAmount">Sanction Cost</option>
              <option value="physicalProgress">Physical Progress</option>
              <option value="sanctionDate">Sanction Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Works Content (Cards on Mobile, Table on Tablet/Desktop) */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-mono">Filtering records...</p>
          </div>
        ) : works.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No works matched your filter</p>
            <button
              onClick={() => setSearchParams({})}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-semibold mt-2"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="sm:hidden divide-y divide-slate-800/80 p-3 space-y-3">
              {works.map((work) => (
                <div
                  key={work.id}
                  onClick={() => navigate(`/works/${work.workId}`)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    work.isHeroCase ? 'bg-red-950/20 border-red-500/40' : 'bg-slate-900/80 border-slate-800'
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
                    <RiskBadge score={work.risk?.overallScore || 0} level={work.risk?.riskLevel || 'LOW'} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 my-2 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">District</span>
                      <span className="text-slate-200">{work.district.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Sanction Amount</span>
                      <span className="font-mono text-slate-200 font-semibold">₹{(work.sanctionAmount / 100000).toFixed(2)} L</span>
                    </div>
                  </div>

                  <div className="space-y-1 my-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-emerald-400">Phys: {work.physicalProgress}%</span>
                      <span className="text-cyan-400">Fin: {work.financialProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${work.physicalProgress}%` }} />
                      <div className="bg-cyan-500 h-full opacity-60" style={{ width: `${Math.max(0, work.financialProgress - work.physicalProgress)}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-500">{work.category}</span>
                    <span className="font-semibold text-cyan-400">Inspect &rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop View: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-semibold">Work ID</th>
                    <th className="py-3 px-4 font-semibold">Work Name & Scope</th>
                    <th className="py-3 px-4 font-semibold">District</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Sanction / Exp</th>
                    <th className="py-3 px-4 font-semibold">Progress</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-center">Risk Tier</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {works.map((work) => (
                    <tr
                      key={work.id}
                      className={`hover:bg-slate-900/70 transition-colors cursor-pointer ${
                        work.isHeroCase ? 'bg-red-950/20' : ''
                      }`}
                      onClick={() => navigate(`/works/${work.workId}`)}
                    >
                      <td className="py-3 px-4 font-mono font-bold">
                        <div className="flex items-center gap-1.5">
                          {work.isHeroCase && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          <span className={work.isHeroCase ? 'text-amber-300' : 'text-cyan-400'}>
                            {work.workId}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-semibold text-slate-100 truncate">{work.workName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{work.description}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div>{work.district.name}</div>
                        <div className="text-[10px] text-slate-500">{work.state.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {work.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="font-semibold text-slate-200">₹{(work.sanctionAmount / 100000).toFixed(2)} L</div>
                        <div className="text-[10px] text-slate-500">Exp: ₹{(work.expenditureAmount / 100000).toFixed(2)} L</div>
                      </td>
                      <td className="py-3 px-4 w-32">
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
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          work.status === 'DELAYED'
                            ? 'bg-red-950 text-red-300 border-red-500/40'
                            : work.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : 'bg-blue-950 text-blue-300 border-blue-500/40'
                        }`}>
                          {work.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <RiskBadge
                          score={work.risk?.overallScore || 0}
                          level={work.risk?.riskLevel || 'LOW'}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/works/${work.workId}`)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] sm:text-xs">
            Page <span className="font-mono font-bold text-white">{pagination.page}</span> /{' '}
            <span className="font-mono font-bold text-white">{pagination.totalPages}</span>
          </span>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
