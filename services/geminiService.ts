import { GoogleGenAI } from "@google/genai";
import { SystemNode, ScenarioParam, SimulationResult, InstitutionalRole, PolicyAllocation, GRRSResult, DefensePosture, SpaceStressor, ASDRSResult } from '../types';

// API Key integrated safely for browser environments.
const getApiKey = () => {
    try {
        if (typeof process !== 'undefined' && process.env?.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {
        // Fallback or ignore
    }
    return 'AIzaSyDWTOVau-yJqOp_Tre47IJMzyrWo34Ntyc'; 
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const runSimulation = async (
  systems: SystemNode[],
  params: ScenarioParam[],
  role: InstitutionalRole,
  isWarGame: boolean = false
): Promise<SimulationResult> => {
  
  if (apiKey === 'dummy_key') {
      return new Promise(resolve => setTimeout(() => resolve({
          outcome: "MOCK: Financial contagion from logistics failure is spreading to sovereign debt markets.",
          impactScore: 82,
          affectedSystems: ['s1', 's7', 's8'],
          recommendations: ["Inject liquidity into reinsurance markets", "Deploy naval escorts"],
          timeline: "2 Weeks",
          financialImpact: "Estimated $40B loss in market capitalization.",
          ethicalConstraints: ["Naval deployment may violate territorial waters treaty"],
          adversarialAction: "Red Team initiated cyber-blockade on payment rails."
      }), 1500));
  }

  const systemStateStr = systems.map(s => `
    [${s.layer}] ${s.name} 
    - Status: ${s.status}
    - Load: ${s.load}%
    - Liquidity: ${s.financialMetrics?.liquidityIndex ?? 'N/A'}
    - Exposure: $${s.financialMetrics?.capitalExposure ?? 0}B
  `).join('\n');

  const paramsStr = params.map(p => `${p.label}: ${p.value}/100`).join(', ');

  const prompt = `
    ACT AS "ATLAS CORE", A STRATEGIC INTELLIGENCE ENGINE.
    CURRENT USER ROLE: ${role}
    MODE: ${isWarGame ? 'ADVERSARIAL WAR GAME (RED TEAM ACTIVE)' : 'STANDARD SIMULATION'}

    The user represents a specific institution. Tailor all output to their incentives, jurisdiction, and levers of power.

    SYSTEM STATE (Physical, Financial, Social, Info):
    ${systemStateStr}

    SCENARIO PARAMETERS:
    ${paramsStr}

    TASK:
    1. Simulate the propagation of shocks across layers (e.g. Physical failure -> Financial Panic -> Social Unrest).
    2. Identify specific "Second-Order Financial Effects" (Inflation, Capital Flight, Liquidity Crunch).
    3. Generate recommendations actionable by the ${role}.
    4. ${isWarGame ? 'Predict likely moves by an adversarial state actor exploiting these weaknesses.' : 'Identify structural vulnerabilities.'}
    5. Flag "Ethical & Legal Constraints" (e.g., violations of international law, humanitarian impact, privacy rights).

    Format response as JSON:
    {
      "outcome": "Executive summary string (max 2 sentences)",
      "impactScore": number (0-100),
      "affectedSystems": ["system_id"],
      "recommendations": ["string"],
      "timeline": "string",
      "financialImpact": "string describing capital flow/market effects",
      "ethicalConstraints": ["string"],
      "adversarialAction": "string (optional, what would the enemy do?)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SimulationResult;
  } catch (error) {
    console.error("Simulation failed", error);
    return {
        outcome: "Simulation failed. Connection to core intelligence node severed.",
        impactScore: 0,
        affectedSystems: [],
        recommendations: [],
        timeline: "N/A",
        financialImpact: "Unknown",
        ethicalConstraints: ["Data integrity compromised"]
    };
  }
};

export const runPolicyOptimization = async (
    allocations: PolicyAllocation[],
    isCooperative: boolean
): Promise<GRRSResult> => {
    if (apiKey === 'dummy_key') {
        return new Promise(resolve => setTimeout(() => resolve({
            strategies: [
                {
                    name: "Conservative Resilience",
                    riskReduction: 12,
                    cost: 45,
                    gdpImpact: "-0.5%",
                    politicalCapital: "LOW",
                    description: "Focuses on hardening existing assets with minimal regulatory disruption.",
                    winners: ["Heavy Industry", "Defense"],
                    losers: ["Tech Startups"],
                    spillover: "Neutral"
                }
            ],
            baselineRisk: 65,
            analysis: "Mock Analysis"
        }), 1500));
    }

    const allocationStr = allocations.map(a => `${a.domain}: $${a.budget}B (Intensity: ${a.intensity}/100)`).join('\n');

    const prompt = `
        ACT AS "GRRS" (Global Risk Reduction Simulation Service).
        
        CONTEXT:
        The user is simulating long-term policy strategies to reduce systemic global risk.
        Mode: ${isCooperative ? 'MULTILATERAL COOPERATION (Pooling resources, data sharing)' : 'UNILATERAL ACTION (National interests first)'}.

        INPUT ALLOCATIONS:
        ${allocationStr}

        TASK:
        Generate 3 distinct strategic outcomes based on these inputs:
        1. "Conservative": Minimal disruption, lower risk reduction, focuses on stability.
        2. "Aggressive": High cost, high disruption, maximum risk reduction (but potential for instability).
        3. "Balanced (Pareto Efficient)": The optimal trade-off between cost and risk reduction.

        For each strategy, estimate:
        - Risk Reduction (0-100 delta from baseline).
        - Total Cost (Billions USD).
        - GDP Impact (Growth or Contraction).
        - Political Capital Required (Low/Medium/High).
        - Winners/Losers (Sectors or demographics).
        - Spillover Effects (How this affects neighbors/rivals).

        Format response as JSON:
        {
            "baselineRisk": number (current estimated global risk 0-100),
            "analysis": "Short strategic commentary on the effectiveness of the input mix.",
            "strategies": [
                {
                    "name": "string",
                    "riskReduction": number,
                    "cost": number,
                    "gdpImpact": "string",
                    "politicalCapital": "string",
                    "description": "string",
                    "winners": ["string"],
                    "losers": ["string"],
                    "spillover": "string"
                }
            ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as GRRSResult;
    } catch (e) {
        console.error(e);
        return {
            baselineRisk: 0,
            analysis: "Service unavailable.",
            strategies: []
        };
    }
}

export const runASDRSSimulation = async (
    posture: DefensePosture,
    stressor: SpaceStressor,
    relianceLevel: number
): Promise<ASDRSResult> => {
    if (apiKey === 'dummy_key') return { stabilityIndex: 50, escalationProb: 30, misinterpretationRisk: 'MODERATE', civilianImpact: "Mock Impact", analysis: "Mock Analysis", mitigationStrategies: ["Strategy A"] };

    const prompt = `
        ACT AS "ASDRS" (Aerospace & Space Defense Risk Simulation Service).
        MISSION: Simulate strategic risk, stability, and escalation dynamics.
        
        CONSTRAINT: DO NOT PROVIDE OPERATIONAL TARGETING, OFFENSIVE PLANS, OR CLASSIFIED TECHNICAL VULNERABILITIES. 
        FOCUS STRICTLY ON STRATEGIC STABILITY, DETERRENCE, AND RESILIENCE.

        INPUTS:
        - National Posture: ${posture}
        - Current Stressor/Crisis: ${stressor}
        - Space Asset Reliance (Civilian/Mil): ${relianceLevel}%

        TASK:
        1. Analyze how the selected posture interacts with the stressor.
        2. Calculate a "Stability Index" and "Escalation Probability".
        3. Evaluate "Misinterpretation Risk" (chance of accidental conflict).
        4. Analyze "Civilian Impact" (economic, emergency services, logistics).
        5. Provide risk-reduction/mitigation strategies.

        Format response as JSON:
        {
            "stabilityIndex": number (0-100, where 100 is perfectly stable),
            "escalationProb": number (0-100),
            "misinterpretationRisk": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
            "civilianImpact": "string (focus on economic/infrastructure spillover)",
            "analysis": "string (Strategic commentary)",
            "mitigationStrategies": ["string"]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as ASDRSResult;
    } catch (e) {
        console.error(e);
        return {
            stabilityIndex: 0,
            escalationProb: 0,
            misinterpretationRisk: 'CRITICAL',
            civilianImpact: "Simulation Error",
            analysis: "Service Unavailable",
            mitigationStrategies: []
        };
    }
}

export const generateBrief = async (risks: any[], role: InstitutionalRole): Promise<string> => {
    if (apiKey === 'dummy_key') return "API Key missing.";

    const prompt = `
        Generate a classified intelligence brief for the: ${role}.
        Tone: Serious, Institutional, Urgent.
        
        Focus on:
        1. Risks relevant to this stakeholder's jurisdiction.
        2. Financial implications of physical risks.
        3. Strategic threats to stability.

        Raw Intel: ${JSON.stringify(risks)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "No brief generated.";
    } catch (e) {
        return "Brief generation unavailable.";
    }
}