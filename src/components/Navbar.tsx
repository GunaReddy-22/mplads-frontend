import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Bell, User, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#0B192C]/95 backdrop-blur-md border-b border-slate-800/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left Branding & Mobile Hamburger */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Mobile menu toggle button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 md:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-glow border border-cyan-400/40 group-hover:scale-105 transition-transform shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                MPLADS AI
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Decision Layer
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Risk Intelligence for eSAKSHI
            </p>
          </div>
        </Link>
      </div>

      {/* Center Prototype Notice Badge (Desktop) */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-medium">Prototype Demo</span>
        <span className="text-slate-600">•</span>
        <span className="text-cyan-400 font-mono text-[11px]">Synthetic Dataset (1,000 Works)</span>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link to Hero Case (Desktop & Tablet) */}
        <Link
          to="/works/MPLADS-00421"
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-semibold hover:bg-red-900/50 transition-colors shadow-[0_0_12px_rgba(239,68,68,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Hero (84/100)</span>
        </Link>

        {/* Alerts Bell */}
        <Link
          to="/alerts"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 relative transition-colors"
          title="Risk Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </Link>

        {/* Officer Profile */}
        <div className="flex items-center gap-2 pl-1.5 sm:pl-2.5 border-l border-slate-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
              {user?.name || 'Dr. Ramesh Sharma'}
            </p>
            <p className="text-[10px] text-cyan-400 font-mono">
              Central Admin
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
