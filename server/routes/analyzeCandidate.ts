import { Request, Response } from 'express';
import { callGeminiStructured } from '../geminiClient.js';

export interface CandidateAnalysisResponse {
  candidate_name: string;
  fit_score: number;
  fit_level: string;
  recommended_role: string;
  strong_matches: string[];
  missing_requirements: string[];
  partial_matches: string[];
  strengths: string[];
  concerns: string[];
  reasoning: string;
  source: 'gemini' | 'deterministic_fallback';
}

const CANDIDATE_ANALYSIS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    candidate_name: { type: 'STRING' },
    fit_score: { type: 'INTEGER' },
    fit_level: { type: 'STRING' },
    recommended_role: { type: 'STRING' },
    strong_matches: { type: 'ARRAY', items: { type: 'STRING' } },
    missing_requirements: { type: 'ARRAY', items: { type: 'STRING' } },
    partial_matches: { type: 'ARRAY', items: { type: 'STRING' } },
    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    concerns: { type: 'ARRAY', items: { type: 'STRING' } },
    reasoning: { type: 'STRING' }
  },
  required: [
    'candidate_name',
    'fit_score',
    'fit_level',
    'recommended_role',
    'strong_matches',
    'missing_requirements',
    'partial_matches',
    'strengths',
    'concerns',
    'reasoning'
  ]
};

export async function handleAnalyzeCandidate(req: Request, res: Response) {
  try {
    const { candidate, project_requirements } = req.body || {};
    if (!candidate) {
      return res.status(400).json({ error: 'Missing candidate data' });
    }

    const prompt = `Evaluate candidate fit against the following project requirements:
Candidate:
Name: ${candidate.name}
Department: ${candidate.department}
Role: ${candidate.role || 'Specialist'}
Skills: ${JSON.stringify(candidate.skills || [])}
Availability: ${candidate.availabilityHours || 10} hrs/week
Projects: ${JSON.stringify(candidate.projectPortfolio || candidate.pastProjects || [])}

Project Requirements:
${JSON.stringify(project_requirements || {})}

Provide candidate analysis in strict JSON matching the schema.`;

    const geminiResult = await callGeminiStructured<Omit<CandidateAnalysisResponse, 'source'>>({
      prompt,
      systemInstruction: 'You are an AI Candidate Evaluator for ProjectMatch. Assess skill alignments, capability gaps, and fit level with high analytical precision.',
      responseSchema: CANDIDATE_ANALYSIS_SCHEMA
    });

    if (geminiResult && typeof geminiResult.fit_score === 'number') {
      return res.json({
        ...geminiResult,
        source: 'gemini'
      });
    }

    // Deterministic Fallback
    const candidateSkills: any[] = candidate.skills || [];
    const strong = candidateSkills.filter(s => s.score >= 8).map(s => s.name);
    const partial = candidateSkills.filter(s => s.score >= 5 && s.score < 8).map(s => s.name);
    const fitScore = candidate.individualFitScore || Math.min(96, Math.max(50, strong.length * 15 + 30));

    return res.json({
      candidate_name: candidate.name,
      fit_score: fitScore,
      fit_level: fitScore >= 85 ? 'HIGH_SYNERGY' : fitScore >= 70 ? 'COMPATIBLE' : 'CATALYST_SPECIALIST',
      recommended_role: candidate.role || 'Technical Specialist',
      strong_matches: strong.slice(0, 4),
      missing_requirements: ['Hardware Low-Level Firmware'],
      partial_matches: partial.slice(0, 3),
      strengths: [`Demonstrated high proficiency in ${strong.slice(0, 2).join(', ')}`, 'Strong project portfolio evidence'],
      concerns: candidate.availabilityHours < 8 ? ['Weekly availability is constrained'] : [],
      reasoning: `${candidate.name} provides valuable technical depth in ${candidate.department}, directly strengthening team execution velocity.`,
      source: 'deterministic_fallback'
    });
  } catch (error: any) {
    console.error('Error in analyze-candidate:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze candidate' });
  }
}
