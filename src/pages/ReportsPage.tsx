import React, { useState } from 'react';
import { FileBarChart2, Download, Printer, ShieldAlert, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const handleExportCSV = (reportType: string) => {
    setIsExporting(true);
    setDownloadSuccess('');

    setTimeout(() => {
      // Create synthetic CSV download
      const headers = 'Work ID,Work Name,District,State,Category,Sanction Amount,Expenditure,Physical Progress,Financial Progress,Risk Score,Risk Level,Action\n';
      const sampleRow = 'MPLADS-00421,Community Infrastructure Development & Skill Hub,Pune,Maharashtra,Community Infrastructure,4200000,3450000,38%,82%,84,HIGH,PRIORITY_VERIFICATION\n';
      const sampleRow2 = 'MPLADS-00104,Construction of Multi-Purpose Cyclone Shelter,Pune,Maharashtra,Community Infrastructure,12000000,9600000,60%,80%,78,HIGH,PRIORITY_VERIFICATION\n';
      const sampleRow3 = 'MPLADS-00219,Underground Drainage Network,Pune,Maharashtra,Drainage & Sanitation,6500000,2600000,18%,40%,74,HIGH,FIELD_INSPECTION_REQUIRED\n';
      
      const blob = new Blob([headers + sampleRow + sampleRow2 + sampleRow3], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `MPLADS_AI_${reportType}_Export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setDownloadSuccess(`Successfully exported ${reportType} CSV dataset!`);
    }, 600);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileBarChart2 className="w-6 h-6 text-cyan-400" />
            Decision Intelligence Reports & Exports
          </h1>
          <p className="text-xs text-slate-400">
            Generate formal executive risk summaries, district inspection rosters, and analytical CSV exports
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Available Report Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-red-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-500/40 w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">National High-Risk Inspection Roster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprehensive list of all 52 high-risk works flagged with multi-signal cost, timeline, and similarity anomalies.
            </p>
          </div>
          <button
            onClick={() => handleExportCSV('High_Risk_Inspection_Roster')}
            disabled={isExporting}
            className="w-full py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Risk CSV</span>
          </button>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40 w-fit">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Full Works Dataset (1,000 Records)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full tabular export including sanction amounts, physical/financial progress percentages, and composite risk scores.
            </p>
          </div>
          <button
            onClick={() => handleExportCSV('All_Works_Master_Dataset')}
            disabled={isExporting}
            className="w-full py-2.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download Master CSV</span>
          </button>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/40 w-fit">
              <FileBarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Potential Duplicate Pairings Report</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detailed NLP cosine similarity and PostGIS spatial proximity collision report for district review.
            </p>
          </div>
          <button
            onClick={() => handleExportCSV('Duplicate_Pairs_Report')}
            disabled={isExporting}
            className="w-full py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download Similarity CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
