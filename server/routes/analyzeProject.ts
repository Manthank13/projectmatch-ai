import { Request, Response } from 'express';
import { callGeminiStructured } from '../geminiClient.js';

export interface ProjectAnalysisResponse {
  project_title: string;
  summary: string;
  team_size: number;
  mandatory_skills: string[];
  preferred_skills: string[];
  mandatory_domains: string[];
  preferred_domains: string[];
  roles: string[];
  minimum_availability: number;
  experience_requirements: string[];
  constraints: string[];
}

const PROJECT_ANALYSIS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    project_title: { type: 'STRING' },
    summary: { type: 'STRING' },
    team_size: { type: 'INTEGER' },
    mandatory_skills: { type: 'ARRAY', items: { type: 'STRING' } },
    preferred_skills: { type: 'ARRAY', items: { type: 'STRING' } },
    mandatory_domains: { type: 'ARRAY', items: { type: 'STRING' } },
    preferred_domains: { type: 'ARRAY', items: { type: 'STRING' } },
    roles: { type: 'ARRAY', items: { type: 'STRING' } },
    minimum_availability: { type: 'INTEGER' },
    experience_requirements: { type: 'ARRAY', items: { type: 'STRING' } },
    constraints: { type: 'ARRAY', items: { type: 'STRING' } }
  },
  required: [
    'project_title',
    'summary',
    'team_size',
    'mandatory_skills',
    'preferred_skills',
    'mandatory_domains',
    'preferred_domains',
    'roles',
    'minimum_availability',
    'experience_requirements',
    'constraints'
  ]
};

export async function handleAnalyzeProject(req: Request, res: Response) {
  try {
    const { title, description } = req.body || {};
    const inputContent = (description || title || '').trim();

    if (!inputContent) {
      return res.status(400).json({ error: 'Missing project title or description' });
    }

    console.log(`\n[ProjectMatch AI] ========================================`);
    console.log(`[ProjectMatch AI] Received project input: "${inputContent}"`);
    console.log(`[ProjectMatch AI] Calling Gemini for project requirements analysis...`);

    const prompt = `You are an elite ProjectMatch AI Architecture Analyst.
Analyze the following university project / hackathon brief and extract the strict technical requirements:

Project Input:
"${inputContent}"

Instructions:
1. Extract 3 to 5 realistic MANDATORY technical skills required to build this specific project.
2. Extract 2 to 4 PREFERRED technical skills that would give the team an edge.
3. Extract the primary academic domains (e.g. CSE, AI / ML, BACKEND, DESIGN, BIOTECH, ROBOTICS, ENVIRONMENT, DATA).
4. Specify recommended roles for each team member.
5. Set team_size (default to 4).
6. Set minimum_availability (in hours/week, typically 8 to 15).
7. Extract key constraints and technical experience prerequisites.

IMPORTANT: Tailor the skills precisely to what was requested (e.g., if it's a calling app, include WebRTC, Backend/API, Audio Streaming, Mobile/Web UI, Database; if it's crop disease detection, include Computer Vision, PyTorch, Image Processing, Agriculture/Plant Pathology). Do not invent unrelated domain requirements.`;

    const geminiResult = await callGeminiStructured<ProjectAnalysisResponse>({
      prompt,
      systemInstruction: 'You are an elite university talent architect. Extract structured project specifications as strict JSON matching the schema.',
      responseSchema: PROJECT_ANALYSIS_SCHEMA
    });

    console.log(`[ProjectMatch AI] Gemini response received successfully:`);
    console.log(`[ProjectMatch AI] Project Title: "${geminiResult.project_title}"`);
    console.log(`[ProjectMatch AI] Mandatory Skills:`, geminiResult.mandatory_skills);
    console.log(`[ProjectMatch AI] Mandatory Domains:`, geminiResult.mandatory_domains);
    console.log(`[ProjectMatch AI] Roles:`, geminiResult.roles);
    console.log(`[ProjectMatch AI] ========================================\n`);

    return res.json(geminiResult);
  } catch (error: any) {
    console.error('[ProjectMatch AI] Error in /api/analyze-project:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to reach Gemini API. Please verify GEMINI_API_KEY configuration.'
    });
  }
}
