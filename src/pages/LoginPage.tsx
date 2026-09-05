import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, CheckCircle, Database, Cpu, Activity, MapPin } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070F1E] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Dynamic Background Mesh / GIS Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E3E62_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Visual & Mission Panel */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#0B192C] via-[#0F223D] to-[#070F1E] p-5 sm:p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            {/* Government Emblem / Tech Header */}
            <div className="flex items-center gap-3 mb-5 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow border border-cyan-400/40 shrink-0">
                <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">MPLADS AI</h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    Decision Support
                  </span>
                </div>
                <p className="text-xs text-cyan-400/90 font-medium">
                  Risk Intelligence & Decision Support System for MPLADS
                </p>
              </div>
            </div>

            {/* Core Proposition Box */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 mb-8 backdrop-blur-md">
              <p className="text-sm font-semibold text-cyan-200 leading-relaxed italic">
                “We don’t replace eSAKSHI — we make eSAKSHI intelligent.”
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automated continuous feature analysis across thousands of developmental works, detecting cost deviations, timeline delays, expenditure velocity spikes, and spatial duplication.
              </p>
            </div>

            {/* Step-by-Step Architecture Pipeline */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Intelligent Decision Pipeline
              </p>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>eSAKSHI / MPLADS Ingestion</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Multi-Signal Risk Scoring</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Explainable AI (SHAP)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Human-in-the-Loop Review</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>MoSPI Smart Governance Initiative</span>
            <span className="font-mono text-cyan-400/80">SIH 2026</span>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="lg:col-span-5 p-5 sm:p-8 md:p-12 flex flex-col justify-between bg-slate-950/60">
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[11px] mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Prototype Demo • Seeded Data</span>
              </div>
              <h2 className="text-xl font-bold text-white">Officer Sign In</h2>
              <p className="text-xs text-slate-400 mt-1">
                Access the national risk analytics & decision support console
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@mplads.ai"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Decision Support Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-500">
              Authorized Government Personnel • Ministry of Statistics and Programme Implementation
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
