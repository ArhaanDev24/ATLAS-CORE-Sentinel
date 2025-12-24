import React, { useState, useRef, useEffect } from 'react';
import { Region } from '../types';
import { X, ZoomIn, ZoomOut, Move, Target, Activity, ShieldAlert } from 'lucide-react';

// --- CONSTANTS & TYPES ---

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 60;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.5;

// Mock connections between regions to visualize network dependencies
// Strength: 0-1 (opacity/width)
const REGION_CONNECTIONS = [
  { from: 'r1', to: 'r2', strength: 0.8, dashed: false }, // NAM <-> EMEA
  { from: 'r1', to: 'r3', strength: 0.6, dashed: true },  // NAM <-> APAC
  { from: 'r1', to: 'r4', strength: 0.9, dashed: false }, // NAM <-> LATAM
  { from: 'r2', to: 'r3', strength: 0.7, dashed: false }, // EMEA <-> APAC
  { from: 'r2', to: 'r4', strength: 0.4, dashed: true },  // EMEA <-> LATAM
];

// --- PROJECTION ENGINE ---
// Equirectangular projection mapping
const project = (lon: number, lat: number) => {
  const cLon = Math.max(-180, Math.min(180, lon));
  const cLat = Math.max(-90, Math.min(90, lat));
  const x = ((cLon + 180) / 360) * VIEW_WIDTH;
  const y = ((90 - cLat) / 180) * VIEW_HEIGHT; 
  return { x, y };
};

const REGION_LOCATIONS: Record<string, [number, number]> = {
  'r1': [-100, 40], // NAM
  'r2': [15, 48],   // EMEA
  'r3': [115, 35],  // APAC
  'r4': [-60, -15], // LATAM
};

// --- COMPONENT ---

interface RiskMapProps {
  regions: Region[];
}

const RiskMap: React.FC<RiskMapProps> = ({ regions }) => {
  // State
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [viewState, setViewState] = useState({ x: 0, y: 0, zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper: Risk Color
  const getRiskColor = (score: number) => {
    if (score > 80) return '#ef4444'; // Red-500
    if (score > 60) return '#f97316'; // Orange-500
    if (score > 40) return '#eab308'; // Yellow-500
    return '#10b981'; // Emerald-500
  };

  // Helper: Get projected coordinates
  const getRegionCoords = (region: Region) => {
      if (REGION_LOCATIONS[region.id]) {
          const [lon, lat] = REGION_LOCATIONS[region.id];
          return project(lon, lat);
      }
      return { x: region.coordinates[0], y: region.coordinates[1] };
  };

  // --- INTERACTION HANDLERS ---

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setViewState(prev => {
      const newZoom = Math.min(Math.max(prev.zoom + delta, MIN_ZOOM), MAX_ZOOM);
      return { ...prev, zoom: newZoom };
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !svgRef.current) return;
    const dxPx = e.clientX - lastMousePos.current.x;
    const dyPx = e.clientY - lastMousePos.current.y;
    
    // Convert pixel delta to SVG coordinate delta
    const svgWidth = svgRef.current.clientWidth;
    const scaleFactor = (VIEW_WIDTH / viewState.zoom) / svgWidth;

    setViewState(prev => ({
      ...prev,
      x: prev.x - (dxPx * scaleFactor),
      y: prev.y - (dyPx * scaleFactor),
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedRegionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const panStep = 5 / viewState.zoom;
    switch(e.key) {
      case 'ArrowUp': setViewState(p => ({ ...p, y: p.y - panStep })); break;
      case 'ArrowDown': setViewState(p => ({ ...p, y: p.y + panStep })); break;
      case 'ArrowLeft': setViewState(p => ({ ...p, x: p.x - panStep })); break;
      case 'ArrowRight': setViewState(p => ({ ...p, x: p.x + panStep })); break;
      case '+': case '=': setViewState(p => ({ ...p, zoom: Math.min(p.zoom + 0.1, MAX_ZOOM) })); break;
      case '-': setViewState(p => ({ ...p, zoom: Math.max(p.zoom - 0.1, MIN_ZOOM) })); break;
      case 'Escape': setSelectedRegionId(null); break;
      case 'Enter': case ' ': if(selectedRegionId === null && regions.length > 0) setSelectedRegionId(regions[0].id); break;
    }
  };

  // ViewBox Calculation
  const vbW = VIEW_WIDTH / viewState.zoom;
  const vbH = VIEW_HEIGHT / viewState.zoom;
  const viewBox = `${viewState.x} ${viewState.y} ${vbW} ${vbH}`;

  const selectedRegion = regions.find(r => r.id === selectedRegionId);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] bg-atlas-900/30 border border-atlas-800 rounded-xl overflow-hidden group outline-none focus:ring-1 focus:ring-atlas-500/50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Interactive Global Risk Map"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Map Background Pattern (Linear Grid - "Old Background") */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
             backgroundSize: '20px 20px',
             // Keeping grid static to match original feel, or uncomment below to make it move
             // backgroundPosition: `${-viewState.x * 10}px ${-viewState.y * 10}px` 
           }}>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1">
        <button 
           className="p-1.5 bg-atlas-950 border border-atlas-800 text-atlas-400 hover:text-atlas-100 rounded shadow-lg transition-colors"
           onClick={(e) => { e.stopPropagation(); setViewState(p => ({...p, zoom: Math.min(p.zoom + 0.2, MAX_ZOOM)})); }}
           title="Zoom In"
        >
           <ZoomIn className="w-4 h-4" />
        </button>
        <button 
           className="p-1.5 bg-atlas-950 border border-atlas-800 text-atlas-400 hover:text-atlas-100 rounded shadow-lg transition-colors"
           onClick={(e) => { e.stopPropagation(); setViewState(p => ({...p, zoom: Math.max(p.zoom - 0.2, MIN_ZOOM)})); }}
           title="Zoom Out"
        >
           <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Map Layer */}
      <svg 
        ref={svgRef}
        className="w-full h-full relative z-10 block"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connection Lines */}
        <g className="connections-layer pointer-events-none">
          {REGION_CONNECTIONS.map((conn, idx) => {
            const r1 = regions.find(r => r.id === conn.from);
            const r2 = regions.find(r => r.id === conn.to);
            if (!r1 || !r2) return null;
            
            const p1 = getRegionCoords(r1);
            const p2 = getRegionCoords(r2);
            const isRelevant = selectedRegionId ? (conn.from === selectedRegionId || conn.to === selectedRegionId) : true;
            
            return (
              <line
                key={`${conn.from}-${conn.to}-${idx}`}
                x1={p1.x} y1={p1.y}
                x2={p2.x} y2={p2.y}
                stroke={isRelevant ? '#94a3b8' : '#334155'}
                strokeWidth={conn.strength * 0.5}
                strokeDasharray={conn.dashed ? "1, 1" : "none"}
                strokeOpacity={isRelevant ? 0.6 : 0.2}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Region Nodes */}
        {regions.map((region) => {
          const { x, y } = getRegionCoords(region);
          const isSelected = selectedRegionId === region.id;
          const color = getRiskColor(region.riskScore);
          const confidence = 0.85; // Mock confidence for visualization

          return (
            <g 
              key={region.id}
              onClick={(e) => { e.stopPropagation(); setSelectedRegionId(region.id); }}
              className="cursor-pointer group"
            >
              {/* Hit Area */}
              <circle cx={x} cy={y} r="8" fill="transparent" />

              {/* Pulse for High Risk */}
              {region.riskScore > 60 && (
                <circle cx={x} cy={y} r="2" fill={color} opacity="0.3">
                  <animate attributeName="r" from="2" to="8" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Selection Ring */}
              {isSelected && (
                <circle 
                   cx={x} cy={y} r="5" 
                   fill="none" stroke={color} strokeWidth="0.2"
                   strokeDasharray="1 0.5"
                   className="animate-spin-slow"
                />
              )}

              {/* Node Core */}
              <circle 
                cx={x} cy={y} r={isSelected ? 1.5 : 1.2} 
                fill={color} 
                stroke={isSelected ? '#fff' : '#0f172a'}
                strokeWidth="0.2"
                className="transition-all duration-300"
              />
              
              {/* Text Label */}
              <text 
                x={x} y={y + 3} 
                fontSize="1.5" 
                fill={isSelected ? '#f1f5f9' : '#64748b'} 
                textAnchor="middle" 
                className={`font-mono tracking-tighter transition-all duration-300 ${isSelected ? 'font-bold' : ''}`}
              >
                {region.code}
              </text>

              {/* Risk Score */}
              <text 
                x={x} y={y + 5} 
                fontSize="1.1" 
                fill={color} 
                textAnchor="middle" 
                className="font-mono font-bold"
              >
                {region.riskScore}
              </text>

              {/* Confidence Bar */}
              <rect 
                x={x - 2} y={y + 6} width="4" height="0.3" 
                fill="#1e293b" 
              />
              <rect 
                x={x - 2} y={y + 6} width={4 * confidence} height="0.3" 
                fill={color} fillOpacity="0.7"
              />
              
              {/* Tooltip (CSS Hover) */}
              <title>{`${region.name} [${region.code}]\nRisk: ${region.riskScore}/100\nStatus: ${region.riskScore > 60 ? 'UNSTABLE' : 'STABLE'}`}</title>
            </g>
          );
        })}
      </svg>
      
      {/* Navigation Hint */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none select-none">
         <div className="text-[10px] text-atlas-600 font-mono flex items-center gap-2 bg-atlas-950/50 px-2 py-1 rounded border border-atlas-800/50">
            <Move className="w-3 h-3" />
            <span>PAN: DRAG // ZOOM: SCROLL</span>
         </div>
      </div>

      {/* Inline Detail Panel (Top Right Overlay) */}
      {selectedRegion && (
        <div 
            className="absolute top-4 right-4 w-64 bg-atlas-950/90 border border-atlas-700 backdrop-blur-md shadow-2xl z-30 flex flex-col rounded-lg animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-3 border-b border-atlas-800">
             <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-atlas-accent" />
                <span className="text-[10px] font-mono font-bold text-atlas-100 uppercase tracking-widest">
                   REGION INTEL
                </span>
             </div>
             <button 
                onClick={() => setSelectedRegionId(null)}
                className="text-atlas-500 hover:text-atlas-100 transition-colors"
             >
                <X className="w-3 h-3" />
             </button>
          </div>

          <div className="p-4 space-y-4">
             <div className="space-y-1">
                <div className="text-[10px] font-mono text-atlas-500 uppercase">Designation</div>
                <div className="text-sm font-bold text-atlas-100">{selectedRegion.name}</div>
                <div className="text-[10px] font-mono text-atlas-400">{selectedRegion.code} // ID: {selectedRegion.id.toUpperCase()}</div>
             </div>

             <div className="flex items-center gap-4 bg-atlas-900/50 p-2 rounded border border-atlas-800/50">
                <div className="flex-1">
                   <div className="text-[10px] font-mono text-atlas-500 uppercase mb-1">Risk Index</div>
                   <div className="text-xl font-mono font-bold" style={{ color: getRiskColor(selectedRegion.riskScore) }}>
                      {selectedRegion.riskScore}
                   </div>
                </div>
                <div className="flex-1 border-l border-atlas-800 pl-4">
                    <div className="text-[10px] font-mono text-atlas-500 uppercase mb-1">Status</div>
                    <div className="text-xs font-bold text-atlas-100">
                        {selectedRegion.riskScore > 80 ? 'CRITICAL' : selectedRegion.riskScore > 60 ? 'HIGH' : selectedRegion.riskScore > 40 ? 'ELEVATED' : 'NOMINAL'}
                    </div>
                </div>
             </div>

             {selectedRegion.riskScore > 60 && (
                 <div className="flex items-start gap-2 p-2 bg-red-950/20 border border-red-900/30 rounded">
                    <ShieldAlert className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                    <div className="text-[10px] text-red-400 leading-tight">
                        <strong>ALERT:</strong> Elevated instability detected. Monitor regional nodes for cascading failure.
                    </div>
                 </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMap;