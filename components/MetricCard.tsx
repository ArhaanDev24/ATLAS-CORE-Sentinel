import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  alert?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, trendValue, alert }) => {
  return (
    <div className={`p-4 rounded-lg border ${alert ? 'border-atlas-danger/50 bg-atlas-danger/5' : 'border-atlas-800 bg-atlas-900/50'} backdrop-blur-sm`}>
      <div className="text-atlas-500 text-xs font-mono uppercase tracking-widest mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div className={`text-2xl font-bold font-mono ${alert ? 'text-atlas-danger' : 'text-atlas-100'}`}>
          {value}
        </div>
        {trend && (
          <div className={`text-xs font-medium flex items-center
            ${trend === 'up' ? 'text-atlas-danger' : trend === 'down' ? 'text-atlas-success' : 'text-atlas-400'}`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;