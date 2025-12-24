import { Region, SystemNode, SystemType, SystemLayer, RiskLevel, RiskSignal, ScenarioParam, PolicyDomain } from './types';

export const REGIONS: Region[] = [
  { id: 'r1', name: 'North America', code: 'NAM', riskScore: 35, coordinates: [20, 30] },
  { id: 'r2', name: 'EMEA', code: 'EMEA', riskScore: 62, coordinates: [55, 35] },
  { id: 'r3', name: 'APAC', code: 'APAC', riskScore: 48, coordinates: [80, 50] },
  { id: 'r4', name: 'LATAM', code: 'LATAM', riskScore: 55, coordinates: [25, 70] },
];

export const SYSTEMS: SystemNode[] = [
  // PHYSICAL LAYER
  { id: 's1', name: 'Global Shipping Grid', type: SystemType.LOGISTICS, layer: SystemLayer.PHYSICAL, status: 'DEGRADED', load: 88, dependencies: ['s2', 's5'], financialMetrics: { liquidityIndex: 60, capitalExposure: 450 } },
  { id: 's2', name: 'N. Atlantic Energy', type: SystemType.ENERGY, layer: SystemLayer.PHYSICAL, status: 'STABLE', load: 65, dependencies: ['s5'], financialMetrics: { liquidityIndex: 85, capitalExposure: 1200 } },
  { id: 's4', name: 'Semi-conductor Supply', type: SystemType.LOGISTICS, layer: SystemLayer.PHYSICAL, status: 'FAILING', load: 98, dependencies: ['s1', 's2'], financialMetrics: { liquidityIndex: 40, capitalExposure: 800 } },
  
  // FINANCIAL LAYER
  { id: 's3', name: 'SWIFT/Interbank', type: SystemType.FINANCE, layer: SystemLayer.FINANCIAL, status: 'STABLE', load: 45, dependencies: ['s6'], financialMetrics: { liquidityIndex: 95, capitalExposure: 5000 } },
  { id: 's7', name: 'Global Re-Insurance', type: SystemType.FINANCE, layer: SystemLayer.FINANCIAL, status: 'DEGRADED', load: 78, dependencies: ['s1', 's2', 's5'], financialMetrics: { liquidityIndex: 55, capitalExposure: 3000 } },

  // SOCIAL / POLITICAL LAYER
  { id: 's5', name: 'Regional Stability (EU)', type: SystemType.POLITICAL, layer: SystemLayer.SOCIAL, status: 'DEGRADED', load: 75, dependencies: [], financialMetrics: { liquidityIndex: 0, capitalExposure: 0 } },
  { id: 's8', name: 'Public Trust Index', type: SystemType.SOCIAL, layer: SystemLayer.SOCIAL, status: 'DEGRADED', load: 60, dependencies: ['s5', 's9'], financialMetrics: { liquidityIndex: 0, capitalExposure: 0 } },

  // INFO / CYBER LAYER
  { id: 's6', name: 'Global Cyber Defense', type: SystemType.CYBER, layer: SystemLayer.INFO, status: 'DEGRADED', load: 82, dependencies: [], financialMetrics: { liquidityIndex: 70, capitalExposure: 200 } },
  { id: 's9', name: 'Disinformation Filter', type: SystemType.CYBER, layer: SystemLayer.INFO, status: 'FAILING', load: 92, dependencies: [], financialMetrics: { liquidityIndex: 0, capitalExposure: 0 } },
];

export const INITIAL_RISKS: RiskSignal[] = [
  { id: 'rk1', timestamp: '2024-10-24T08:00:00Z', regionId: 'r2', systemId: 's5', layer: SystemLayer.SOCIAL, severity: RiskLevel.HIGH, description: 'Escalating border tensions disrupting energy transit.', confidence: 0.89 },
  { id: 'rk2', timestamp: '2024-10-24T09:15:00Z', regionId: 'r3', systemId: 's4', layer: SystemLayer.PHYSICAL, severity: RiskLevel.CRITICAL, description: 'Critical shortage of raw silicon precursors.', confidence: 0.95 },
  { id: 'rk3', timestamp: '2024-10-24T10:30:00Z', regionId: 'r1', systemId: 's6', layer: SystemLayer.INFO, severity: RiskLevel.MODERATE, description: 'Anomalous probe traffic detected on infrastructure endpoints.', confidence: 0.65 },
  { id: 'rk4', timestamp: '2024-10-24T11:45:00Z', regionId: 'r2', systemId: 's7', layer: SystemLayer.FINANCIAL, severity: RiskLevel.HIGH, description: 'Insurance premiums on tanker routes spiked 400% overnight.', confidence: 0.91 },
];

export const SCENARIO_PARAMS: ScenarioParam[] = [
  { id: 'p1', label: 'Geopolitical Tension', value: 50, min: 0, max: 100, description: 'Aggregated index of diplomatic friction.' },
  { id: 'p2', label: 'Energy Price Volatility', value: 30, min: 0, max: 100, description: 'Variance in global oil/gas indices.' },
  { id: 'p3', label: 'Capital Cost (Rates)', value: 55, min: 0, max: 100, description: 'Central bank base rates and lending tightness.' },
  { id: 'p4', label: 'Info-War Saturation', value: 40, min: 0, max: 100, description: 'Prevalence of state-sponsored disinformation.' },
];

export const DEFAULT_POLICY_ALLOCATIONS = [
  { domain: PolicyDomain.INFRASTRUCTURE, budget: 10, intensity: 30 },
  { domain: PolicyDomain.CYBER_SECURITY, budget: 10, intensity: 50 },
  { domain: PolicyDomain.CLIMATE_ADAPT, budget: 5, intensity: 20 },
  { domain: PolicyDomain.SOCIAL_SAFETY, budget: 15, intensity: 40 },
  { domain: PolicyDomain.DIPLOMACY, budget: 2, intensity: 60 },
];