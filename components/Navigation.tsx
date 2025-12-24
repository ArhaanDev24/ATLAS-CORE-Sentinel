import React from 'react';
import { LayoutDashboard, Globe, Activity, FileText, Settings, ShieldAlert, Crosshair, Scale, Satellite } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Risk Map', icon: Globe },
    { id: 'network', label: 'System Nexus', icon: Activity },
    { id: 'simulation', label: 'Simulate', icon: LayoutDashboard },
    { id: 'warroom', label: 'War Room', icon: Crosshair },
    { id: 'policy', label: 'Policy Engine', icon: Scale },
    { id: 'asdrs', label: 'ASDRS', icon: Satellite },
    { id: 'brief', label: 'Exec Brief', icon: FileText },
  ];

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <div className="hidden md:flex w-20 lg:w-64 bg-atlas-950 border-r border-atlas-800 flex-col justify-between h-screen sticky top-0 z-50">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-atlas-800">
            <ShieldAlert className="w-8 h-8 text-atlas-accent" />
            <span className="hidden lg:block ml-3 font-bold text-lg tracking-wider text-atlas-100">ATLAS<span className="text-atlas-500">CORE</span></span>
          </div>

          <nav className="mt-6 flex flex-col gap-2 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isWarRoom = item.id === 'warroom';
              
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center p-3 rounded-md transition-all duration-200 group
                    ${isActive 
                      ? 'bg-atlas-800 text-atlas-accent border-l-2 border-atlas-accent' 
                      : 'text-atlas-400 hover:bg-atlas-900 hover:text-atlas-100'
                    }
                    ${isWarRoom && !isActive ? 'text-red-400 hover:text-red-100 hover:bg-red-900/20' : ''}
                    ${isWarRoom && isActive ? 'bg-red-900/20 text-red-500 border-red-500' : ''}
                    `}
                >
                  <Icon className={`w-5 h-5 
                      ${isActive ? (isWarRoom ? 'text-red-500' : 'text-atlas-accent') : (isWarRoom ? 'text-red-400' : 'text-atlas-500 group-hover:text-atlas-100')}
                  `} />
                  <span className="hidden lg:block ml-3 text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-atlas-800">
          <div className="flex items-center gap-3 text-xs text-atlas-500">
              <div className="w-2 h-2 rounded-full bg-atlas-success animate-pulse"></div>
              <span className="hidden lg:block">SENTINEL: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-atlas-950 border-t border-atlas-800 flex justify-around items-center z-50 px-2 pb-safe bg-opacity-95 backdrop-blur-md">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isWarRoom = item.id === 'warroom';
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                   ${isActive ? 'text-atlas-accent' : 'text-atlas-500'}
                   ${isWarRoom && isActive ? 'text-red-500' : ''}
                   ${isWarRoom && !isActive ? 'text-red-400/70' : ''}
                `}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[9px] font-medium tracking-wide">{item.label.split(' ')[0]}</span>
              </button>
            )
        })}
      </div>
    </>
  );
};

export default Navigation;