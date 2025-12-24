export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum SystemLayer {
  PHYSICAL = 'PHYSICAL',   // Infrastructure, Logistics, Energy
  FINANCIAL = 'FINANCIAL', // Markets, Capital, Insurance
  INFO = 'INFO',           // Cyber, Data, Comms
  SOCIAL = 'SOCIAL'        // Political, Public Trust, Labor
}

export enum SystemType {
  LOGISTICS = 'LOGISTICS',
  ENERGY = 'ENERGY',
  FINANCE = 'FINANCE',
  POLITICAL = 'POLITICAL',
  CLIMATE = 'CLIMATE',
  CYBER = 'CYBER',
  SOCIAL = 'SOCIAL'
}

export enum InstitutionalRole {
  GLOBAL_LOGISTICS = 'Global Logistics Command',
  CENTRAL_BANK = 'Central Bank Oversight',
  DEFENSE_COUNCIL = 'National Defense Council',
  ENERGY_CONGLOMERATE = 'Energy Syndicate'
}

export interface Region {
  id: string;
  name: string;
  code: string;
  riskScore: number; // 0-100
  coordinates: [number, number]; // Simplified x,y for map
}

export interface SystemNode {
  id: string;
  name: string;
  type: SystemType;
  layer: SystemLayer;
  status: 'STABLE' | 'DEGRADED' | 'FAILING';
  load: number; // 0-100%
  financialMetrics?: {
    liquidityIndex: number; // 0-100
    capitalExposure: number; // USD Billions
  };
  dependencies: string[]; // IDs of systems this depends on
}

export interface RiskSignal {
  id: string;
  timestamp: string;
  regionId: string;
  systemId: string;
  severity: RiskLevel;
  description: string;
  confidence: number; // 0.0 - 1.0
  layer: SystemLayer;
}

export interface ScenarioParam {
  id: string;
  label: string;
  value: number; // 0-100
  min: number;
  max: number;
  description: string;
}

export interface SimulationResult {
  outcome: string;
  impactScore: number;
  affectedSystems: string[];
  recommendations: string[];
  timeline: string;
  financialImpact: string;
  ethicalConstraints: string[];
  adversarialAction?: string;
}

export interface UserSession {
  role: InstitutionalRole;
  clearanceLevel: number;
}

// GRRS Specific Types
export enum PolicyDomain {
  INFRASTRUCTURE = 'Resilient Infrastructure',
  CYBER_SECURITY = 'Cyber Sovereignty',
  CLIMATE_ADAPT = 'Climate Adaptation',
  SOCIAL_SAFETY = 'Social Cohesion',
  DIPLOMACY = 'Diplomatic Engagement'
}

export interface PolicyAllocation {
  domain: PolicyDomain;
  budget: number; // Billions USD
  intensity: number; // 0-100 (Regulatory pressure)
}

export interface StrategyResult {
  name: string;
  riskReduction: number; // Delta in Global Risk Index
  cost: number; // Total Cost
  gdpImpact: string; // e.g., "+2.1%"
  politicalCapital: 'LOW' | 'MEDIUM' | 'HIGH'; // Cost to implement
  description: string;
  winners: string[];
  losers: string[];
  spillover: string; // Effects on other nations
}

export interface GRRSResult {
  strategies: StrategyResult[];
  baselineRisk: number;
  analysis: string;
}

// ASDRS Specific Types
export enum DefensePosture {
  STRATEGIC_DETERRENCE = 'Strategic Deterrence (Status Quo)',
  DEFENSIVE_RESILIENCE = 'Defensive Resilience & Redundancy',
  ASYMMETRIC_DENIAL = 'Asymmetric Denial (A2/AD)',
  COOPERATIVE_TRANSPARENCY = 'Cooperative Transparency'
}

export enum SpaceStressor {
  DEBRIS_CASCADE = 'Kessler Syndrome / Debris Cascade',
  COMMS_BLACKOUT = 'Global Comms/Nav Blackout',
  MISCALCULATION = 'Early Warning False Alarm',
  TREATY_EXIT = 'Major Power Treaty Withdrawal'
}

export interface ASDRSResult {
  stabilityIndex: number; // 0-100 (100 is stable)
  escalationProb: number; // 0-100
  misinterpretationRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  civilianImpact: string;
  analysis: string;
  mitigationStrategies: string[];
}

// LSASAB Specific Types
export enum OrbitalLayer {
  LEO = 'LEO',
  MEO = 'MEO',
  GEO = 'GEO'
}

export enum ObjectCategory {
  CIVIL = 'CIVIL',
  COMMERCIAL = 'COMMERCIAL',
  DEFENSE = 'DEFENSE', // Abstracted
  DEBRIS = 'DEBRIS'
}

export interface OrbitalObject {
  id: string;
  layer: OrbitalLayer;
  category: ObjectCategory;
  inclination: number; // degrees
  velocity: number; // abstract speed
  anomalyScore: number; // 0-100
}