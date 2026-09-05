import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  ShieldAlert,
  ClipboardCheck,
  BrainCircuit,
  Database,
  FileBarChart2,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Works Explorer', path: '/works', icon: FolderKanban },
    { label: 'GIS Risk Map', path: '/map', icon: MapPin },
    { label: 'Alerts Center', path: '/alerts', icon: ShieldAlert },
    { label: 'Inspections Queue', path: '/inspections', icon: ClipboardCheck },
    { label: 'AI Risk Insights', path: '/insights', icon: BrainCircuit },
    { label: 'Data Quality & Lineage', path: '/data-quality', icon: Database },
    { label: 'Reports & Export', path: '/reports', icon: FileBarChart2 },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-3.5 overflow-y-auto">
      <div className="space-y-5">
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Navigation Menu</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Group */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Intelligence Modules
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(2,132,199,0.15)] font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Intentional Showcase Links */}
        <div className="pt-2 border-t border-slate-800/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 flex items-center justify-between">
            <span>Demo Test Cases</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </p>
          <div className="space-y-1">
            <NavLink
              to="/works/MPLADS-00421"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-red-950/80 text-red-300 border border-red-500/50'
                    : 'text-slate-300 hover:bg-slate-800/70'
                }`
              }
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono font-semibold">Hero Case</span>
              </div>
              <span className="text-[10px] font-mono text-red-400 font-bold">84/100</span>
            </NavLink>

            <NavLink
              to="/works/MPLADS-00104"
              onClick={onCloseMobile}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            >
              <span className="font-mono">Case 1: High Cost</span>
              <span className="text-[10px] font-mono text-amber-400">78/100</span>
            </NavLink>

            <NavLink
              to="/works/MPLADS-00219"
              onClick={onCloseMobile}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            >
              <span className="font-mono">Case 2: Delayed</span>
              <span className="text-[10px] font-mono text-amber-400">74/100</span>
            </NavLink>

            <NavLink
              to="/works/MPLADS-00350"
              onClick={onCloseMobile}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            >
              <span className="font-mono">Case 3: Fin Mismatch</span>
              <span className="text-[10px] font-mono text-amber-400">76/100</span>
            </NavLink>

            <NavLink
              to="/works/MPLADS-00418"
              onClick={onCloseMobile}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            >
              <span className="font-mono">Case 4: Similar Work</span>
              <span className="text-[10px] font-mono text-purple-400">91% Sim</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">System Status</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
          <div className="text-slate-500 font-mono text-[10px]">
            eSAKSHI Sync • Realtime
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-[#0B192C]/70 border-r border-slate-800/80 hidden md:flex flex-col justify-between shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Slide-in Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0B192C] border-r border-slate-800 shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
