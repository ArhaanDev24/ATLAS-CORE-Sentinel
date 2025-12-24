import React from 'react';
import { SYSTEMS } from '../constants';
import { SystemNode, SystemType, SystemLayer } from '../types';
import { Zap, Truck, DollarSign, CloudRain, Shield, Landmark, Users, Radio } from 'lucide-react';

const SystemIcon = ({ type, className }: { type: SystemType, className?: string }) => {
  switch (type) {
    case SystemType.ENERGY: return <Zap className={className} />;
    case SystemType.LOGISTICS: return <Truck className={className} />;
    case SystemType.FINANCE: return <DollarSign className={className} />;
    case SystemType.CLIMATE: return <CloudRain className={className} />;
    case SystemType.CYBER: return <Shield className={className} />;
    case SystemType.POLITICAL: return <Landmark className={className} />;
    case SystemType.SOCIAL: return <Users className={className} />;
    default: return <Radio className={className} />;
  }
};

const SystemNetwork: React.FC = () => {
  // Enhanced static layout for multi-layer visualization
  const nodePositions: Record<string, { x: number, y: number }> = {
    's1': { x: 40, y: 30 }, // Logistics (Phys)
    's2': { x: 20, y: 20 }, // Energy (Phys)
    's4': { x: 60, y: 20 }, // Semi (Phys)
    
    's3': { x: 80, y: 50 }, // Swift (Fin)
    's7': { x: 60, y: 50 }, // Insurance (Fin)
    
    's5': { x: 20, y: 80 }, // Stability (Soc)
    's8': { x: 40, y: 80 }, // Public Trust (Soc)
    
    's6': { x: 80, y: 80 }, // Cyber (Info)
    's9': { x: 60, y: 90 }, // Disinfo (Info)
  };

  const getLayerColor = (layer: SystemLayer) => {
    switch (layer) {
      case SystemLayer.PHYSICAL: return 'border-atlas-accent text-atlas-accent';
      case SystemLayer.FINANCIAL: return 'border-green-500 text-green-500';
      case SystemLayer.SOCIAL: return 'border-pink-500 text-pink-500';
      case SystemLayer.INFO: return 'border-purple-500 text-purple-500';
      default: return 'border-atlas-500 text-atlas-500';
    }
  };

  return (
    <div className="w-full h-full bg-atlas-950 p-4 md:p-6 rounded-xl border border-atlas-800 relative overflow-hidden flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
         <h3 className="text-atlas-100 text-lg font-medium flex items-center gap-2">
            <ActivityIcon /> SYSTEM OF SYSTEMS NEXUS
         </h3>
         <div className="flex flex-wrap gap-2 md:gap-4 text-xs font-mono">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-atlas-accent rounded-full"></div><span className="hidden sm:inline">PHYSICAL</span><span className="sm:hidden">PHYS</span></span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="hidden sm:inline">FINANCIAL</span><span className="sm:hidden">FIN</span></span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-pink-500 rounded-full"></div><span className="hidden sm:inline">SOCIAL</span><span className="sm:hidden">SOC</span></span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full"></div>INFO</span>
         </div>
       </div>
       
       <div className="relative flex-1 w-full bg-atlas-900/20 rounded-lg border border-atlas-800/50 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {SYSTEMS.map(sys => 
              sys.dependencies.map(depId => {
                const start = nodePositions[sys.id];
                const end = nodePositions[depId];
                if (!start || !end) return null;
                return (
                  <line 
                    key={`${sys.id}-${depId}`}
                    x1={`${start.x}%`} y1={`${start.y}%`}
                    x2={`${end.x}%`} y2={`${end.y}%`}
                    stroke="#475569" 
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                )
              })
            )}
          </svg>

          {SYSTEMS.map((sys) => {
             const pos = nodePositions[sys.id];
             if(!pos) return null;
             const colorClass = getLayerColor(sys.layer);
             
             return (
               <div 
                key={sys.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-28 md:w-40 bg-atlas-900 border-l-2 md:border-l-4 ${colorClass} bg-opacity-90 rounded p-2 md:p-3 shadow-xl z-10 transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
               >
                 <div className="flex items-center gap-2 mb-1 md:mb-2 border-b border-atlas-800 pb-1">
                   <SystemIcon type={sys.type} className={`w-3 h-3 ${colorClass.split(' ')[1]}`} />
                   <span className="text-[8px] md:text-[10px] font-bold text-atlas-100 truncate uppercase tracking-wider">{sys.name}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-[8px] md:text-[9px] font-mono text-atlas-400">
                    <div>
                        <div>LOAD</div>
                        <div className={`text-atlas-100 ${sys.load > 90 ? 'text-atlas-danger' : ''}`}>{sys.load}%</div>
                    </div>
                    {sys.financialMetrics && (
                        <div>
                             <div>CAP</div>
                             <div className="text-atlas-100">${sys.financialMetrics.capitalExposure}B</div>
                        </div>
                    )}
                 </div>
               </div>
             );
          })}
       </div>
       
       <div className="mt-4 p-2 bg-atlas-900/50 border border-atlas-800 rounded text-[10px] md:text-xs text-atlas-500 font-mono text-center">
          DIGITAL TWIN RESOLUTION: MACRO-REGIONAL // UPDATE INTERVAL: 4HRS
       </div>
    </div>
  );
};

const ActivityIcon = () => (
  <svg className="w-5 h-5 text-atlas-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

export default SystemNetwork;