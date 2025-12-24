import React, { useState } from 'react';
import { SCENARIO_PARAMS, SYSTEMS } from '../constants';
import { runSimulation } from '../services/geminiService';
import { SimulationResult, ScenarioParam, InstitutionalRole } from '../types';
import { Play, RotateCcw, Loader2 } from 'lucide-react';

interface ScenarioBuilderProps {
    role: InstitutionalRole;
}

const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({ role }) => {
  const [params, setParams] = useState<ScenarioParam[]>(SCENARIO_PARAMS);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleParamChange = (id: string, newValue: number) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, value: newValue } : p));
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    const simResult = await runSimulation(SYSTEMS, params, role);
    setResult(simResult);
    setLoading(false);
  };

  const handleReset = () => {
    setParams(SCENARIO_PARAMS);
    setResult(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-atlas-900 border border-atlas-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-atlas-100">Parameters</h2>
            <button onClick={handleReset} className="p-2 hover:bg-atlas-800 rounded-full text-atlas-400">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-6">
            {params.map(param => (
              <div key={param.id}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-atlas-400 font-medium">{param.label}</label>
                  <span className="text-sm text-atlas-accent font-mono">{param.value}</span>
                </div>
                <input 
                  type="range" 
                  min={param.min} 
                  max={param.max} 
                  value={param.value} 
                  onChange={(e) => handleParamChange(param.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-atlas-800 rounded-lg appearance-none cursor-pointer accent-atlas-accent"
                />
                <p className="text-xs text-atlas-500 mt-1">{param.description}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full mt-8 bg-atlas-accent hover:bg-cyan-400 text-atlas-950 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <Play className="w-5 h-5 mr-2" />}
            {loading ? 'SIMULATING...' : 'RUN SIMULATION'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="w-full lg:w-2/3">
        <div className="bg-atlas-900 border border-atlas-800 rounded-xl p-6 h-full min-h-[500px] flex flex-col">
          <h2 className="text-lg font-bold text-atlas-100 mb-4 border-b border-atlas-800 pb-4 flex justify-between">
            <span>Simulation Outcomes</span>
            <span className="text-xs font-mono text-atlas-500 mt-1 uppercase">PERSPECTIVE: {role}</span>
          </h2>
          
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-atlas-500 opacity-50">
              <div className="w-16 h-16 border-2 border-dashed border-atlas-500 rounded-full mb-4 animate-spin-slow"></div>
              <p>Awaiting Parameter Input</p>
            </div>
          )}

          {loading && (
             <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-atlas-accent font-mono mb-2">PROCESSING...</div>
                <div className="w-64 bg-atlas-800 h-1 rounded overflow-hidden">
                    <div className="h-full bg-atlas-accent w-1/3 animate-loading-bar"></div>
                </div>
                <p className="text-xs text-atlas-500 mt-4">Simulating Capital Flow & Physical System Interaction...</p>
             </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in h-full overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-atlas-950/50 p-4 rounded-lg border border-atlas-800">
                    <div className="text-xs text-atlas-500 uppercase">Impact Score</div>
                    <div className={`text-3xl font-mono font-bold ${result.impactScore > 70 ? 'text-atlas-danger' : 'text-atlas-warning'}`}>
                        {result.impactScore}/100
                    </div>
                 </div>
                 <div className="bg-atlas-950/50 p-4 rounded-lg border border-atlas-800">
                    <div className="text-xs text-atlas-500 uppercase">Timeline Forecast</div>
                    <div className="text-xl font-mono font-bold text-atlas-100">
                        {result.timeline}
                    </div>
                 </div>
              </div>

              <div className="prose prose-invert max-w-none">
                 <h3 className="text-atlas-100 text-md font-bold mb-2">Executive Summary</h3>
                 <p className="text-atlas-400 text-sm leading-relaxed">{result.outcome}</p>
              </div>

              {/* Financial Layer Block */}
              <div className="bg-green-900/10 border border-green-900/30 p-4 rounded">
                 <h4 className="text-green-500 text-sm font-bold mb-2">Financial System Impact</h4>
                 <p className="text-atlas-300 text-sm">{result.financialImpact}</p>
              </div>

              <div>
                  <h3 className="text-atlas-100 text-md font-bold mb-2">Recommended Actions</h3>
                  <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start text-sm text-atlas-300">
                              <span className="text-atlas-accent mr-2">►</span>
                              {rec}
                          </li>
                      ))}
                  </ul>
              </div>

              {result.ethicalConstraints && result.ethicalConstraints.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-atlas-800/50">
                    <span className="text-[10px] text-atlas-500 uppercase tracking-widest">Constraint Validation</span>
                    <ul className="mt-2 text-xs text-atlas-400 list-disc list-inside">
                        {result.ethicalConstraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioBuilder;