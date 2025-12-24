import React, { useEffect, useState } from 'react';
import { generateBrief } from '../services/geminiService';
import { INITIAL_RISKS } from '../constants';
import { InstitutionalRole } from '../types';
import { FileText, Loader2, RefreshCw } from 'lucide-react';

interface BriefingPanelProps {
    role: InstitutionalRole;
}

const BriefingPanel: React.FC<BriefingPanelProps> = ({ role }) => {
  const [brief, setBrief] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadBrief = async () => {
    setLoading(true);
    const text = await generateBrief(INITIAL_RISKS, role);
    setBrief(text);
    setLoading(false);
  };

  useEffect(() => {
    loadBrief();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]); // Reload when role changes

  return (
    <div className="h-full bg-atlas-900 border border-atlas-800 rounded-xl flex flex-col overflow-hidden">
      <div className="p-4 border-b border-atlas-800 flex justify-between items-center bg-atlas-950/30">
        <h2 className="text-lg font-bold text-atlas-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-atlas-accent" />
          Daily Intelligence Brief
        </h2>
        <button 
          onClick={loadBrief}
          disabled={loading}
          className="p-2 hover:bg-atlas-800 rounded-full text-atlas-400 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {loading ? (
            <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-atlas-800 rounded w-3/4"></div>
                <div className="h-4 bg-atlas-800 rounded w-full"></div>
                <div className="h-4 bg-atlas-800 rounded w-5/6"></div>
                <div className="h-32 bg-atlas-800 rounded w-full mt-6"></div>
            </div>
        ) : (
            <div className="prose prose-invert prose-sm max-w-none text-atlas-300 whitespace-pre-wrap font-sans">
                {brief}
            </div>
        )}
      </div>
      
      <div className="p-3 bg-atlas-950 border-t border-atlas-800 flex justify-between items-center text-[10px] font-mono uppercase">
        <span className="text-atlas-600">Classified // For Official Use Only</span>
        <span className="text-atlas-500">EYES ONLY: {role}</span>
      </div>
    </div>
  );
};

export default BriefingPanel;