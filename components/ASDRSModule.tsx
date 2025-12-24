import React, { useState } from 'react';
import { DefensePosture, SpaceStressor, ASDRSResult } from '../types';
import { runASDRSSimulation } from '../services/geminiService';
import LiveSpaceAwareness from './LiveSpaceAwareness';
import { Satellite, Shield, Radio, Activity, Globe, AlertTriangle, Radar, Zap, Eye, Layout } from 'lucide-react';

const ASDRSModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'SIMULATION' | 'LIVE'>('SIMULATION');
    const [posture, setPosture] = useState<DefensePosture>(DefensePosture.STRATEGIC_DETERRENCE);
    const [stressor, setStressor] = useState<SpaceStressor>(SpaceStressor.MISCALCULATION);
    const [reliance, setReliance] = useState<number>(75);
    const [result, setResult] = useState<ASDRSResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        const data = await runASDRSSimulation(posture, stressor, reliance);
        setResult(data);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Module Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-atlas-800 pb-4 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-atlas-100 flex items-center gap-2">
                        <Satellite className="w-6 h-6 text-atlas-accent" />
                        ASDRS
                    </h2>
                    <p className="text-xs text-atlas-400 mt-1 font-mono">
                        AEROSPACE & SPACE DEFENSE RISK SIMULATION
                    </p>
                </div>
                <div className="flex bg-atlas-900 rounded-lg p-1 border border-atlas-800">
                    <button
                        onClick={() => setActiveTab('SIMULATION')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'SIMULATION' 
                            ? 'bg-atlas-800 text-atlas-100 shadow-sm' 
                            : 'text-atlas-500 hover:text-atlas-300'
                        }`}
                    >
                        <Layout className="w-4 h-4" />
                        Strategic Simulation
                    </button>
                    <button
                        onClick={() => setActiveTab('LIVE')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'LIVE' 
                            ? 'bg-atlas-800 text-atlas-100 shadow-sm' 
                            : 'text-atlas-500 hover:text-atlas-300'
                        }`}
                    >
                        <Eye className="w-4 h-4" />
                        Live Awareness (LSASAB)
                    </button>
                </div>
            </div>

            {/* LIVE AWARENESS TAB */}
            {activeTab === 'LIVE' && (
                <div className="flex-1 min-h-[500px]">
                    <LiveSpaceAwareness />
                </div>
            )}

            {/* SIMULATION TAB */}
            {activeTab === 'SIMULATION' && (
                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
                    {/* Configuration Panel */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-atlas-950 border border-atlas-800 rounded-xl p-6 flex-1">
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-atlas-100 flex items-center gap-2 uppercase tracking-wide">
                                    <Radar className="w-4 h-4 text-atlas-500" />
                                    Simulation Parameters
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs text-atlas-500 font-bold uppercase mb-2 block">National Defense Posture</label>
                                    <div className="space-y-2">
                                        {Object.values(DefensePosture).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPosture(p)}
                                                className={`w-full text-left p-3 rounded text-sm transition-colors border ${posture === p ? 'bg-atlas-800 border-atlas-accent text-atlas-100' : 'bg-atlas-900 border-atlas-800 text-atlas-400 hover:bg-atlas-800'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {posture === p ? <Radar className="w-4 h-4 text-atlas-accent" /> : <div className="w-4 h-4" />}
                                                    {p}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-atlas-500 font-bold uppercase mb-2 block flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3 text-atlas-warning" />
                                        Active Stressor / Scenario
                                    </label>
                                    <select 
                                        value={stressor}
                                        onChange={(e) => setStressor(e.target.value as SpaceStressor)}
                                        className="w-full bg-atlas-900 border border-atlas-800 text-atlas-100 p-3 rounded focus:outline-none focus:border-atlas-accent"
                                    >
                                        {Object.values(SpaceStressor).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                     <div className="flex justify-between mb-2">
                                        <label className="text-xs text-atlas-500 font-bold uppercase">Space Asset Reliance</label>
                                        <span className="text-xs font-mono text-atlas-accent">{reliance}%</span>
                                     </div>
                                     <input 
                                        type="range" min="0" max="100" value={reliance}
                                        onChange={(e) => setReliance(parseInt(e.target.value))}
                                        className="w-full h-1 bg-atlas-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                     />
                                     <p className="text-[10px] text-atlas-500 mt-1">
                                        Degree of integration between civilian infrastructure and space-based PNT/Comms.
                                     </p>
                                </div>

                                <button 
                                    onClick={handleSimulate}
                                    disabled={loading}
                                    className="w-full mt-4 bg-blue-900/50 hover:bg-blue-900 border border-blue-700 text-blue-100 font-bold py-4 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Activity className="animate-spin" /> : <Shield className="w-5 h-5" />}
                                    {loading ? 'SIMULATING DYNAMICS...' : 'ANALYZE STABILITY'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Panel */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        {!result ? (
                            <div className="flex-1 bg-atlas-900 border border-atlas-800 rounded-xl flex items-center justify-center flex-col opacity-50 relative overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
                                    {[...Array(36)].map((_, i) => <div key={i} className="border border-blue-500/20"></div>)}
                                </div>
                                <Globe className="w-16 h-16 text-atlas-700 mb-4 animate-pulse" />
                                <h3 className="text-xl font-bold text-atlas-600">Orbital Stability Monitor</h3>
                                <p className="text-sm text-atlas-700 mt-2">Initialize simulation to assess escalation risks.</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">
                                {/* KPI Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-atlas-950 border border-atlas-800 rounded-lg p-4">
                                        <div className="text-[10px] text-atlas-500 uppercase tracking-widest mb-1">Stability Index</div>
                                        <div className={`text-3xl font-mono font-bold ${result.stabilityIndex < 50 ? 'text-atlas-danger' : 'text-atlas-success'}`}>
                                            {result.stabilityIndex}/100
                                        </div>
                                    </div>
                                    <div className="bg-atlas-950 border border-atlas-800 rounded-lg p-4">
                                        <div className="text-[10px] text-atlas-500 uppercase tracking-widest mb-1">Escalation Probability</div>
                                        <div className={`text-3xl font-mono font-bold ${result.escalationProb > 60 ? 'text-atlas-danger' : 'text-atlas-warning'}`}>
                                            {result.escalationProb}%
                                        </div>
                                    </div>
                                    <div className="bg-atlas-950 border border-atlas-800 rounded-lg p-4">
                                        <div className="text-[10px] text-atlas-500 uppercase tracking-widest mb-1">Misinterpretation Risk</div>
                                        <div className={`text-xl font-bold mt-1 ${
                                            result.misinterpretationRisk === 'CRITICAL' ? 'text-red-500 animate-pulse' : 
                                            result.misinterpretationRisk === 'HIGH' ? 'text-orange-500' : 'text-blue-400'
                                        }`}>
                                            {result.misinterpretationRisk}
                                        </div>
                                    </div>
                                </div>

                                {/* Analysis Body */}
                                <div className="bg-atlas-900 border border-atlas-800 rounded-xl p-6">
                                    <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Radio className="w-4 h-4" />
                                        Strategic Analysis
                                    </h3>
                                    <p className="text-atlas-100 leading-relaxed text-sm border-l-2 border-blue-500/50 pl-4">
                                        {result.analysis}
                                    </p>
                                </div>

                                {/* Impact & Mitigation */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-atlas-950/50 border border-atlas-800 rounded-xl p-5">
                                        <h4 className="text-atlas-100 font-bold text-sm mb-3 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            Civilian & Economic Spillover
                                        </h4>
                                        <p className="text-xs text-atlas-300 leading-relaxed">
                                            {result.civilianImpact}
                                        </p>
                                    </div>

                                    <div className="bg-atlas-950/50 border border-atlas-800 rounded-xl p-5">
                                        <h4 className="text-atlas-100 font-bold text-sm mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            Stabilization Strategies
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.mitigationStrategies.map((strat, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-atlas-300">
                                                    <span className="text-green-500 font-mono">0{i+1}</span>
                                                    {strat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ASDRSModule;