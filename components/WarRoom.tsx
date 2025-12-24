import React, { useState } from 'react';
import { runSimulation } from '../services/geminiService';
import { SYSTEMS, SCENARIO_PARAMS } from '../constants';
import { InstitutionalRole, SimulationResult } from '../types';
import { Crosshair, Shield, Sword, AlertOctagon, Terminal } from 'lucide-react';

interface WarRoomProps {
  role: InstitutionalRole;
}

const WarRoom: React.FC<WarRoomProps> = ({ role }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runWarGame = async () => {
    setAnalyzing(true);
    const simResult = await runSimulation(SYSTEMS, SCENARIO_PARAMS, role, true);
    setResult(simResult);
    setAnalyzing(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Control Center */}
      <div className="w-full lg:w-1/3 bg-atlas-950 border border-atlas-800 rounded-xl overflow-hidden flex flex-col">
        <div className="bg-red-950/20 p-4 border-b border-red-900/30">
          <h2 className="text-red-500 font-bold flex items-center gap-2 tracking-widest uppercase">
            <Sword className="w-5 h-5" />
            Adversarial Simulator
          </h2>
          <p className="text-xs text-red-400/60 font-mono mt-1">RED TEAM AI ACTIVE // UNRESTRICTED WARFARE MODEL</p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-6">
           <div className="bg-atlas-900/50 p-4 rounded border border-atlas-800">
              <label className="text-xs text-atlas-500 font-mono uppercase">Current Posture</label>
              <div className="text-atlas-100 font-bold mt-1">DEFENSIVE / DETERRENCE</div>
           </div>

           <div className="bg-atlas-900/50 p-4 rounded border border-atlas-800">
              <label className="text-xs text-atlas-500 font-mono uppercase">Adversary Profile</label>
              <select className="w-full bg-atlas-950 border border-atlas-700 text-atlas-100 text-sm mt-2 p-2 rounded">
                  <option>State Actor (Tier 1)</option>
                  <option>Rogue Syndicate</option>
                  <option>Cyber-Insurgent Collective</option>
              </select>
           </div>
           
           <div className="mt-auto">
             <button 
                onClick={runWarGame}
                disabled={analyzing}
                className="w-full bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 font-bold py-4 rounded flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
             >
                {analyzing ? <AlertOctagon className="animate-spin" /> : <Crosshair className="group-hover:scale-110 transition-transform" />}
                {analyzing ? 'RUNNING WAR GAMES...' : 'INITIATE WAR GAME'}
             </button>
             <p className="text-[10px] text-center text-atlas-600 mt-3 font-mono">
                WARNING: SIMULATION INCLUDES LETHAL & KINETIC SCENARIOS
             </p>
           </div>
        </div>
      </div>

      {/* Strategic Display */}
      <div className="w-full lg:w-2/3 bg-atlas-900 border border-atlas-800 rounded-xl p-6 relative overflow-hidden">
         {!result && !analyzing && (
            <div className="absolute inset-0 flex items-center justify-center flex-col opacity-30 pointer-events-none">
                <Shield className="w-32 h-32 text-atlas-700 mb-4" />
                <div className="text-2xl font-bold text-atlas-700 uppercase tracking-widest">Awaiting Command</div>
            </div>
         )}

         {analyzing && (
            <div className="h-full flex flex-col items-center justify-center font-mono text-red-500">
                <Terminal className="w-12 h-12 mb-4 animate-pulse" />
                <div className="text-lg">MODELING ADVERSARIAL VECTORS...</div>
                <div className="text-sm mt-2 text-red-700">CALCULATING 2ND ORDER BLOWBACK</div>
            </div>
         )}

         {result && (
            <div className="space-y-6 animate-fade-in h-full overflow-y-auto pr-2">
                <div className="flex items-center justify-between border-b border-atlas-800 pb-4">
                    <div>
                        <div className="text-xs text-atlas-500 font-mono">SCENARIO OUTCOME</div>
                        <h3 className="text-xl font-bold text-atlas-100">{result.outcome}</h3>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-atlas-500 font-mono">THREAT LEVEL</div>
                        <div className="text-2xl font-bold text-red-500">{result.impactScore}/100</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-950/10 border border-red-900/30 p-4 rounded">
                        <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                            <Crosshair className="w-4 h-4" /> PREDICTED ENEMY ACTION
                        </h4>
                        <p className="text-atlas-300 text-sm">{result.adversarialAction || "No clear adversarial vector identified."}</p>
                    </div>
                    
                    <div className="bg-atlas-950/50 border border-atlas-800 p-4 rounded">
                        <h4 className="text-atlas-400 font-bold text-sm mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> FINANCIAL FALLOUT
                        </h4>
                        <p className="text-atlas-300 text-sm">{result.financialImpact}</p>
                    </div>
                </div>

                <div className="bg-atlas-950 p-4 rounded border border-atlas-800">
                    <h4 className="text-atlas-100 font-bold text-sm mb-3">STRATEGIC RECOMMENDATIONS</h4>
                    <ul className="space-y-2">
                        {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-atlas-300">
                                <span className="text-atlas-accent font-mono">0{i+1}</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>

                {result.ethicalConstraints.length > 0 && (
                    <div className="border-l-2 border-yellow-600 bg-yellow-900/10 p-4">
                        <h4 className="text-yellow-500 font-bold text-xs uppercase mb-1">Constraints & Legal Barriers</h4>
                        <ul className="list-disc list-inside text-xs text-yellow-200/70 space-y-1">
                            {result.ethicalConstraints.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                )}
            </div>
         )}
      </div>
    </div>
  );
};

const DollarSign = ({ className }: {className?: string}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)

export default WarRoom;