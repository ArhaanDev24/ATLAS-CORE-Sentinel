import React, { useEffect, useRef, useState } from 'react';
import { OrbitalObject, OrbitalLayer, ObjectCategory } from '../types';
import { Globe, RefreshCw, Filter, Layers, AlertOctagon, Info } from 'lucide-react';

const LiveSpaceAwareness: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<OrbitalObject[]>([]);
  const [filterLayer, setFilterLayer] = useState<OrbitalLayer | 'ALL'>('ALL');
  const [showDebris, setShowDebris] = useState(true);
  const [rotation, setRotation] = useState(0);

  // Generate Mock Orbital Data
  useEffect(() => {
    const newObjects: OrbitalObject[] = [];
    const layers = [OrbitalLayer.LEO, OrbitalLayer.MEO, OrbitalLayer.GEO];
    const categories = [ObjectCategory.CIVIL, ObjectCategory.COMMERCIAL, ObjectCategory.DEFENSE, ObjectCategory.DEBRIS];
    
    for (let i = 0; i < 200; i++) {
        newObjects.push({
            id: `obj-${i}`,
            layer: layers[Math.floor(Math.random() * layers.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            inclination: Math.random() * Math.PI * 2,
            velocity: 0.005 + Math.random() * 0.02,
            anomalyScore: Math.random() * 100
        });
    }
    setObjects(newObjects);
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear Canvas
      ctx.fillStyle = '#020617'; // atlas-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const earthRadius = 80;
      
      // Update Rotation
      setRotation(prev => (prev + 0.002) % (Math.PI * 2));
      const currentRotation = rotation;

      // Draw Earth (Wireframe)
      ctx.strokeStyle = '#06b6d4'; // atlas-accent
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Latitude Lines (Simple simulation)
      for(let i = 1; i < 5; i++) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, earthRadius, earthRadius * Math.sin(i * 0.5 + currentRotation * 0.2), 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, 0.2)`;
          ctx.stroke();
      }

      // Draw Objects
      objects.forEach((obj, index) => {
        if (!showDebris && obj.category === ObjectCategory.DEBRIS) return;
        if (filterLayer !== 'ALL' && obj.layer !== filterLayer) return;

        // Calculate Orbit Radius based on Layer
        let orbitRadius = earthRadius + 40;
        if (obj.layer === OrbitalLayer.MEO) orbitRadius = earthRadius + 100;
        if (obj.layer === OrbitalLayer.GEO) orbitRadius = earthRadius + 180;

        // Calculate 3D Position
        // Simple orbital simulation: Objects rotate around Y axis primarily, with inclination
        const speed = obj.category === ObjectCategory.DEBRIS ? obj.velocity * 1.5 : obj.velocity;
        const time = Date.now() * 0.001;
        const angle = obj.inclination + (time * speed);
        
        // 3D Coordinates (Simplified)
        const x3d = Math.cos(angle) * orbitRadius;
        const z3d = Math.sin(angle) * orbitRadius;
        const y3d = Math.sin(angle + obj.inclination) * (orbitRadius * 0.5);

        // Apply Global Rotation (Earth spin)
        const rotX = x3d * Math.cos(currentRotation) - z3d * Math.sin(currentRotation);
        const rotZ = x3d * Math.sin(currentRotation) + z3d * Math.cos(currentRotation);

        // Project to 2D
        const scale = 300 / (300 + rotZ); // Perspective projection
        const x2d = centerX + rotX * scale;
        const y2d = centerY + y3d * scale;
        const size = Math.max(1, 4 * scale);

        // Determine Color
        let color = '#94a3b8'; // default
        if (obj.category === ObjectCategory.CIVIL) color = '#10b981'; // Green
        if (obj.category === ObjectCategory.COMMERCIAL) color = '#3b82f6'; // Blue
        if (obj.category === ObjectCategory.DEFENSE) color = '#f59e0b'; // Amber
        if (obj.category === ObjectCategory.DEBRIS) color = '#ef4444'; // Red

        // Draw Object
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw Orbit Path (Faint) - Only for a few to avoid clutter
        if (index % 10 === 0) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, orbitRadius * scale, (orbitRadius * 0.4) * scale, obj.inclination, 0, Math.PI * 2);
            ctx.strokeStyle = `${color}10`; // Very faint
            ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [objects, filterLayer, showDebris, rotation]);

  return (
    <div className="relative h-full w-full bg-atlas-950 rounded-xl overflow-hidden border border-atlas-800 flex flex-col">
       {/* HUD Header */}
       <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-atlas-950 to-transparent z-10 flex justify-between items-start pointer-events-none">
          <div>
            <h3 className="text-atlas-100 font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-atlas-accent" />
                LSASAB
            </h3>
            <p className="text-[10px] text-atlas-500 font-mono tracking-widest uppercase">
                Live Space & Aerospace Situational Awareness
            </p>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <div className="text-[10px] text-atlas-500 uppercase">Tracked Objects</div>
                <div className="text-xl font-mono text-atlas-100 font-bold">{objects.length}</div>
             </div>
             <div className="text-right">
                <div className="text-[10px] text-atlas-500 uppercase">Congestion Idx</div>
                <div className="text-xl font-mono text-atlas-warning font-bold">HIGH</div>
             </div>
          </div>
       </div>

       {/* Canvas Layer */}
       <canvas 
         ref={canvasRef} 
         width={800} 
         height={600} 
         className="w-full h-full object-cover"
       />

       {/* HUD Controls */}
       <div className="absolute bottom-0 left-0 right-0 p-4 bg-atlas-900/80 backdrop-blur-md border-t border-atlas-800 flex flex-col md:flex-row gap-4 justify-between items-center z-20">
          
          {/* Filters */}
          <div className="flex items-center gap-2">
             <Filter className="w-4 h-4 text-atlas-400" />
             <div className="flex bg-atlas-950 rounded p-1 border border-atlas-800">
                <button 
                    onClick={() => setFilterLayer('ALL')}
                    className={`px-3 py-1 text-xs rounded transition-colors ${filterLayer === 'ALL' ? 'bg-atlas-800 text-atlas-100' : 'text-atlas-500 hover:text-atlas-300'}`}
                >
                    ALL
                </button>
                <button 
                    onClick={() => setFilterLayer(OrbitalLayer.LEO)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${filterLayer === OrbitalLayer.LEO ? 'bg-atlas-800 text-atlas-100' : 'text-atlas-500 hover:text-atlas-300'}`}
                >
                    LEO
                </button>
                <button 
                    onClick={() => setFilterLayer(OrbitalLayer.GEO)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${filterLayer === OrbitalLayer.GEO ? 'bg-atlas-800 text-atlas-100' : 'text-atlas-500 hover:text-atlas-300'}`}
                >
                    GEO
                </button>
             </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowDebris(!showDebris)}
                className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded border transition-colors ${showDebris ? 'bg-red-900/20 text-red-400 border-red-900/50' : 'bg-atlas-950 text-atlas-500 border-atlas-800'}`}
             >
                <AlertOctagon className="w-3 h-3" />
                DEBRIS FIELD
             </button>
             <button className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded border border-atlas-800 bg-atlas-950 text-atlas-400">
                <RefreshCw className="w-3 h-3" />
                SYNC: LIVE
             </button>
          </div>
       </div>
       
       {/* Legend Overlay */}
       <div className="absolute top-20 left-4 bg-atlas-950/80 p-3 rounded border border-atlas-800 pointer-events-none backdrop-blur-sm">
          <div className="space-y-2 text-[10px] font-mono">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span className="text-atlas-300">CIVIL/SCI</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> <span className="text-atlas-300">COMMERCIAL</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> <span className="text-atlas-300">DEFENSE (ABS)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> <span className="text-atlas-300">DEBRIS/UNK</span>
             </div>
          </div>
       </div>

       {/* Warning Banner */}
       <div className="absolute top-20 right-4 w-48 bg-atlas-950/80 p-3 rounded border border-atlas-800 backdrop-blur-sm">
          <div className="flex items-start gap-2">
             <Info className="w-4 h-4 text-atlas-accent shrink-0 mt-0.5" />
             <p className="text-[10px] text-atlas-400 leading-tight">
                <strong>VISIBILITY NOTE:</strong><br/>
                All defense assets are abstracted to generic orbital slots. Precision telemetry restricted.
             </p>
          </div>
       </div>

    </div>
  );
};

export default LiveSpaceAwareness;