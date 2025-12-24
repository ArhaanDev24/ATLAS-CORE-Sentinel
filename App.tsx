import React, { useState } from 'react';
import Navigation from './components/Navigation';
import MetricCard from './components/MetricCard';
import RiskMap from './components/RiskMap';
import SystemNetwork from './components/SystemNetwork';
import ScenarioBuilder from './components/ScenarioBuilder';
import BriefingPanel from './components/BriefingPanel';
import WarRoom from './components/WarRoom';
import PolicyEngine from './components/PolicyEngine';
import ASDRSModule from './components/ASDRSModule';
import { REGIONS, INITIAL_RISKS } from './constants';
import { InstitutionalRole } from './types';
import { AlertTriangle, TrendingUp, Activity, User, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<InstitutionalRole>(InstitutionalRole.GLOBAL_LOGISTICS);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-atlas-950 text-atlas-100 font-sans selection:bg-atlas-accent selection:text-atlas-950">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 p-4 lg:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
        {/* Header with Role Selector */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              {currentView === 'dashboard' && 'Global Risk Overview'}
              {currentView === 'network' && 'System Architecture Nexus'}
              {currentView === 'simulation' && 'Scenario Simulation Engine'}
              {currentView === 'warroom' && <span className="text-red-500">Adversarial War Room</span>}
              {currentView === 'policy' && 'GRRS: Policy Optimization'}
              {currentView === 'asdrs' && 'ASDRS: Aerospace Stability'}
              {currentView === 'brief' && 'Executive Intelligence'}
            </h1>
            <p className="text-atlas-400 text-sm mt-1 font-mono">
              SYSTEM TIME: {new Date().toISOString().split('T')[0]} // ZULU
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-atlas-900 border border-atlas-800 p-2 rounded-lg w-full lg:w-auto">
             <div className="flex items-center gap-2 px-2 border-r border-atlas-800 flex-1 lg:flex-none">
                <User className="w-4 h-4 text-atlas-500" />
                <div className="relative group w-full lg:w-auto">
                    <select 
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as InstitutionalRole)}
                        className="bg-transparent text-sm font-bold text-atlas-100 appearance-none pr-6 cursor-pointer focus:outline-none w-full lg:w-auto"
                    >
                        {Object.values(InstitutionalRole).map((role) => (
                            <option key={role} value={role} className="bg-atlas-900">{role}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-atlas-500 absolute right-0 top-1.5 pointer-events-none" />
                </div>
             </div>
             <span className="px-2 text-xs text-atlas-500 font-mono whitespace-nowrap">
               CLEARANCE: TS/SCI
             </span>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="space-y-6">
          
          {currentView === 'dashboard' && (
            <div className="flex flex-col gap-6">
              {/* Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Global Risk Index" value="64.2" trend="up" trendValue="4.2%" alert />
                <MetricCard label="Liquidity Stress" value="High" trend="up" trendValue="Critical" alert />
                <MetricCard label="System Load" value="78%" trend="up" trendValue="2%" />
                <MetricCard label="Forecast Conf." value="92.4%" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <RiskMap regions={REGIONS} />
                  <div className="bg-atlas-900/30 border border-atlas-800 rounded-xl p-6">
                    <h3 className="text-atlas-100 font-bold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-atlas-warning" />
                      Active Risk Signals
                    </h3>
                    <div className="space-y-3">
                      {INITIAL_RISKS.map(risk => (
                        <div key={risk.id} className="flex flex-col sm:flex-row items-start sm:justify-between p-3 bg-atlas-950/50 rounded border border-atlas-800/50 hover:border-atlas-700 transition-colors gap-2 sm:gap-0">
                          <div>
                             <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold
                                  ${risk.severity === 'CRITICAL' ? 'bg-atlas-danger text-atlas-950' : 'bg-atlas-warning text-atlas-950'}`}>
                                  {risk.severity}
                                </span>
                                <span className="text-xs text-atlas-500 font-mono uppercase px-2 py-0.5 bg-atlas-800/50 rounded border border-atlas-700/50">
                                    {risk.layer}
                                </span>
                                <span className="text-xs text-atlas-500 font-mono">{risk.timestamp.split('T')[1].substring(0,5)}</span>
                             </div>
                             <p className="text-sm text-atlas-300">{risk.description}</p>
                          </div>
                          <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                             <div className="text-xs text-atlas-500">CONFIDENCE</div>
                             <div className="text-sm font-mono text-atlas-accent">{Math.round(risk.confidence * 100)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:h-[800px]">
                  <BriefingPanel role={userRole} />
                </div>
              </div>
            </div>
          )}

          {currentView === 'network' && (
            <div className="h-[calc(100vh-250px)] min-h-[500px]">
              <SystemNetwork />
            </div>
          )}

          {currentView === 'simulation' && (
            <div className="h-full">
               <ScenarioBuilder role={userRole} />
            </div>
          )}

          {currentView === 'warroom' && (
            <div className="h-full">
               <WarRoom role={userRole} />
            </div>
          )}

          {currentView === 'policy' && (
            <div className="h-[calc(100vh-200px)]">
               <PolicyEngine />
            </div>
          )}

          {currentView === 'asdrs' && (
            <div className="h-[calc(100vh-200px)]">
               <ASDRSModule />
            </div>
          )}

          {currentView === 'brief' && (
             <div className="grid grid-cols-1 gap-6 h-[calc(100vh-200px)]">
               <BriefingPanel role={userRole} />
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;