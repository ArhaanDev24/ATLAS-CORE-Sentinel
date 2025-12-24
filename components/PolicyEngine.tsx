import React, { useState } from 'react';
import { DEFAULT_POLICY_ALLOCATIONS } from '../constants';
import { PolicyAllocation, GRRSResult } from '../types';
import { runPolicyOptimization } from '../services/geminiService';
import { Sliders, Scale, Users, Globe, ChevronRight, TrendingUp, AlertCircle, Play } from 'lucide-react';

const PolicyEngine: React.FC = () => {
    const [allocations, setAllocations] = useState<PolicyAllocation[]>(DEFAULT_POLICY_ALLOCATIONS);
    const [cooperative, setCooperative] = useState(true);
    const [result, setResult] = useState<GRRSResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpdate = (index: number, field: keyof PolicyAllocation, value: number) => {
        const newAllocations = [...allocations];
        // @ts-ignore
        newAllocations[index][field] = value;
        setAllocations(newAllocations);
    };

    const handleOptimize = async () => {
        setLoading(true);
        const data = await runPolicyOptimization(allocations, cooperative);
        setResult(data);
        setLoading(false);
    };

    const totalBudget = allocations.reduce((acc, curr) => acc + curr.budget, 0);

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-full">
            {/* Input Panel */}
            <div className="w-full xl:w-1/3 flex flex-col gap-6">
                <div className="bg-atlas-950 border border-atlas-800 rounded-xl p-6 flex-1 overflow-y-auto">
                    <div className="mb-6 border-b border-atlas-800 pb-4">
                        <h2 className="text-xl font-bold text-atlas-100 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-atlas-accent" />
                            Policy & Budget Allocator
                        </h2>
                        <p className="text-xs text-atlas-400 mt-2">
                            Define strategic inputs for the Global Risk Reduction Simulation (GRRS).
                        </p>
                    </div>

                    <div className="space-y-6">
                        {allocations.map((alloc, idx) => (
                            <div key={alloc.domain} className="bg-atlas-900/50 p-4 rounded border border-atlas-800/50 hover:border-atlas-700 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-sm text-atlas-100">{alloc.domain}</span>
                                    <span className="font-mono text-xs text-atlas-500">${alloc.budget}B</span>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex justify-between text-[10px] text-atlas-400 mb-1">
                                        <span>BUDGET</span>
                                        <span>{alloc.budget}B</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" value={alloc.budget}
                                        onChange={(e) => handleUpdate(idx, 'budget', parseInt(e.target.value))}
                                        className="w-full h-1 bg-atlas-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-atlas-400 mb-1">
                                        <span>REGULATORY INTENSITY</span>
                                        <span>{alloc.intensity}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" value={alloc.intensity}
                                        onChange={(e) => handleUpdate(idx, 'intensity', parseInt(e.target.value))}
                                        className="w-full h-1 bg-atlas-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-atlas-800">
                        <div className="flex items-center justify-between mb-4 bg-atlas-900 p-3 rounded cursor-pointer" onClick={() => setCooperative(!cooperative)}>
                            <div className="flex items-center gap-2">
                                <Globe className={`w-4 h-4 ${cooperative ? 'text-atlas-accent' : 'text-atlas-500'}`} />
                                <span className="text-sm font-medium text-atlas-100">Multilateral Cooperation</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${cooperative ? 'bg-atlas-accent' : 'bg-atlas-800'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${cooperative ? 'left-6' : 'left-1'}`}></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4 px-2">
                             <span className="text-sm text-atlas-400">Total Expenditure</span>
                             <span className="text-xl font-mono font-bold text-atlas-100">${totalBudget}B</span>
                        </div>

                        <button 
                            onClick={handleOptimize}
                            disabled={loading}
                            className="w-full bg-atlas-100 hover:bg-white text-atlas-950 font-bold py-4 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? <Scale className="animate-spin" /> : <Play className="w-5 h-5" />}
                            {loading ? 'OPTIMIZING...' : 'RUN SIMULATION'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Panel */}
            <div className="w-full xl:w-2/3 flex flex-col gap-6">
                {!result ? (
                    <div className="flex-1 bg-atlas-900 border border-atlas-800 rounded-xl flex items-center justify-center flex-col opacity-50">
                        <TrendingUp className="w-16 h-16 text-atlas-700 mb-4" />
                        <h3 className="text-xl font-bold text-atlas-600">Awaiting Simulation</h3>
                        <p className="text-sm text-atlas-700 mt-2">Configure budget and regulatory parameters to generate risk surfaces.</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">
                        {/* Summary Card */}
                        <div className="bg-atlas-900 border border-atlas-800 rounded-xl p-6">
                            <h3 className="text-atlas-400 text-xs font-bold uppercase tracking-widest mb-2">System Analysis</h3>
                            <p className="text-atlas-100 text-lg leading-relaxed">{result.analysis}</p>
                            <div className="mt-4 flex items-center gap-4 text-sm font-mono text-atlas-500">
                                <span>BASELINE RISK: {result.baselineRisk}/100</span>
                                <span>•</span>
                                <span>MODE: {cooperative ? 'COOPERATIVE' : 'UNILATERAL'}</span>
                            </div>
                        </div>

                        {/* Strategies */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.strategies.map((strat, i) => (
                                <div key={i} className="bg-atlas-950 border border-atlas-800 rounded-xl p-5 hover:border-atlas-600 transition-colors flex flex-col">
                                    <div className="mb-4">
                                        <div className="text-xs font-mono text-atlas-500 mb-1">STRATEGY {i+1}</div>
                                        <h4 className="text-lg font-bold text-atlas-100">{strat.name}</h4>
                                    </div>
                                    
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <div className="text-[10px] text-atlas-400 uppercase">Risk Reduction</div>
                                            <div className="text-2xl font-bold text-atlas-accent">-{strat.riskReduction}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-atlas-400 uppercase">Cost</div>
                                            <div className="text-xl font-mono text-atlas-100">${strat.cost}B</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 flex-1">
                                        <p className="text-xs text-atlas-300 leading-relaxed">{strat.description}</p>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                            <div className="bg-atlas-900 p-2 rounded">
                                                <span className="text-atlas-500 block">GDP</span>
                                                <span className={strat.gdpImpact.includes('-') ? 'text-red-400' : 'text-green-400'}>{strat.gdpImpact}</span>
                                            </div>
                                            <div className="bg-atlas-900 p-2 rounded">
                                                <span className="text-atlas-500 block">POLITICAL CAP</span>
                                                <span className="text-atlas-100">{strat.politicalCapital}</span>
                                            </div>
                                        </div>

                                        <div className="bg-atlas-900/50 p-2 rounded border border-atlas-800/50">
                                            <div className="text-[10px] text-atlas-500 uppercase mb-1">Spillover</div>
                                            <div className="text-xs text-atlas-400 italic">{strat.spillover}</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-atlas-800">
                                        <div className="flex gap-2 mb-2">
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                            <span className="text-[10px] text-green-500">{strat.winners.join(', ')}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <AlertCircle className="w-3 h-3 text-red-500" />
                                            <span className="text-[10px] text-red-500">{strat.losers.join(', ')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PolicyEngine;