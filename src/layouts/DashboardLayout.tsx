import React, { useState } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { LayoutDashboard, FolderKanban, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070F1E] flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-400">Loading MPLADS Decision Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070F1E] flex flex-col">
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 pb-20 md:pb-8 space-y-4 sm:space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (App-like experience on phones) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#0B192C]/95 backdrop-blur-lg border-t border-slate-800 py-1.5 px-3 flex items-center justify-around z-40">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/works"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <FolderKanban className="w-4 h-4" />
          <span>Works</span>
        </NavLink>

        <NavLink
          to="/works/MPLADS-00421"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
              isActive ? 'text-red-400' : 'text-red-300'
            }`
          }
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Hero (84)</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <MapPin className="w-4 h-4" />
          <span>GIS Map</span>
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Alerts</span>
        </NavLink>
      </div>
    </div>
  );
};
