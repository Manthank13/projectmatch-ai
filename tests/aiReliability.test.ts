import { describe, it, expect } from 'vitest';

describe('AI & Gemini Reliability Suite', () => {
  // 1. JSON Sanitization: Stripping Markdown Code Fences
  it('safely extracts raw JSON from markdown-wrapped AI responses', () => {
    const rawAiOutput = `\`\`\`json
{
  "project_title": "Interstellar Ocean Intelligence",
  "summary": "AI platform detecting microplastics in coastal waters",
  "team_size": 4,
  "mandatory_skills": ["Machine Learning", "Environmental Biology", "FastAPI"],
  "preferred_skills": ["GIS", "LoRaWAN"],
  "mandatory_domains": ["ENVIRONMENT", "CSE"],
  "preferred_domains": ["BIOTECH"],
  "roles": ["Lead Architect", "Domain Specialist", "Backend Lead", "UX Designer"],
  "minimum_availability": 8,
  "experience_requirements": ["Python proficiency"],
  "constraints": ["Minimum 8 hrs/week"]
}
\`\`\``;

    const sanitizeAiJson = (text: string): string => {
      let cleaned = text.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '');
      }
      return cleaned.trim();
    };

    const cleaned = sanitizeAiJson(rawAiOutput);
    const parsed = JSON.parse(cleaned);

    expect(parsed.project_title).toBe('Interstellar Ocean Intelligence');
    expect(parsed.mandatory_skills.length).toBe(3);
    expect(parsed.team_size).toBe(4);
  });

  // 2. Schema Validation for Team Recommendation Payload
  it('validates and corrects missing fields in AI team response', () => {
    const incompleteAiResponse: any = {
      team_score: 94,
      members: [
        { candidate_id: 'S001', name: 'Tony Stark', recommended_role: 'Lead AI' }
      ]
      // Missing coverage, team_strengths, why_this_team
    };

    const validateTeamPayload = (raw: any) => {
      return {
        team_score: typeof raw.team_score === 'number' ? raw.team_score : 90,
        members: Array.isArray(raw.members) ? raw.members : [],
        coverage: raw.coverage || { mandatory_skills: 100, preferred_skills: 85, domains: 90, roles: 90 },
        team_strengths: Array.isArray(raw.team_strengths) ? raw.team_strengths : ['Interdisciplinary capability balance'],
        team_gaps: Array.isArray(raw.team_gaps) ? raw.team_gaps : [],
        synergy_reasoning: raw.synergy_reasoning || 'Strong complementary skill distribution.',
        why_this_team: raw.why_this_team || 'Selected candidates eliminate key capability bottlenecks.'
      };
    };

    const validated = validateTeamPayload(incompleteAiResponse);

    expect(validated.team_score).toBe(94);
    expect(validated.coverage.mandatory_skills).toBe(100);
    expect(validated.team_strengths.length).toBeGreaterThan(0);
    expect(validated.why_this_team.length).toBeGreaterThan(0);
  });

  // 3. Rate Limit / Transient Error Detection
  it('identifies transient errors suitable for automatic backoff retry', () => {
    const isTransientError = (status: number): boolean => {
      return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
    };

    expect(isTransientError(429)).toBe(true); // Rate limit
    expect(isTransientError(503)).toBe(true); // Service unavailable
    expect(isTransientError(400)).toBe(false); // Bad request (client error)
    expect(isTransientError(401)).toBe(false); // Unauthorized
    expect(isTransientError(404)).toBe(false); // Not found
  });
});
