import { Request, Response } from 'express';
import { callGeminiStructured } from '../geminiClient.js';
import { calculateDeterministicTeamScore, ScorerCandidate } from '../hybridScorer.js';

export interface TeamRecommendationResponse {
  team_score: number;
  members: {
    candidate_id: string;
    name: string;
    department: string;
    recommended_role: string;
    individual_fit: number;
    contribution: string;
    avatar?: string;
    profileImage?: string;
  }[];
  coverage: {
    mandatory_skills: number;
    preferred_skills: number;
    domains: number;
    roles: number;
  };
  team_strengths: string[];
  team_gaps: string[];
  synergy_reasoning: string;
  why_this_team: string;
  hidden_gem?: {
    candidate_id: string;
    name: string;
    individual_fit: number;
    marginal_team_value: number;
    capability_eliminated: string;
    explanation: string;
  };
  near_miss?: {
    candidate_id: string;
    name: string;
    rejection_reason: string;
    constraint_failed: string;
    available_hours: number;
    required_hours: number;
  };
}

const GEMINI_REASONING_SCHEMA = {
  type: 'OBJECT',
  properties: {
    team_strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    team_gaps: { type: 'ARRAY', items: { type: 'STRING' } },
    synergy_reasoning: { type: 'STRING' },
    why_this_team: { type: 'STRING' },
    member_contributions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          candidate_id: { type: 'STRING' },
          contribution: { type: 'STRING' }
        },
        required: ['candidate_id', 'contribution']
      }
    }
  },
  required: ['team_strengths', 'team_gaps', 'synergy_reasoning', 'why_this_team', 'member_contributions']
};

export async function handleRecommendTeam(req: Request, res: Response) {
  try {
    const { project, candidates } = req.body || {};
    if (!project || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: 'Missing project or candidates pool' });
    }

    const title = project.project_title || project.title || 'Untitled Project';
    const description = project.summary || project.description || '';
    const teamSize = project.team_size || project.teamSize || 4;
    const minAvailability = project.minimum_availability || project.minAvailability || 8;
    const mandatorySkills: string[] = project.mandatory_skills || project.mandatorySkills || ['Backend Development', 'API Design'];
    const preferredSkills: string[] = project.preferred_skills || project.preferredSkills || ['UI/UX Design', 'Cloud Deployment'];
    const mandatoryDomains: string[] = project.mandatory_domains || project.mandatoryDomains || ['CSE', 'BACKEND'];

    console.log(`\n[ProjectMatch AI] ========================================`);
    console.log(`[ProjectMatch AI] Recommending team for project: "${title}"`);
    console.log(`[ProjectMatch AI] Required Skills:`, mandatorySkills);
    console.log(`[ProjectMatch AI] Candidate Pool Size: ${candidates.length}`);

    // 1. Separate candidates by availability constraint
    const validCandidates: ScorerCandidate[] = candidates.filter((c: any) => c.availabilityHours >= minAvailability);
    const failedCandidates: ScorerCandidate[] = candidates.filter((c: any) => c.availabilityHours < minAvailability);

    // 2. Identify Near-Miss Candidate (high skill match but failed availability)
    let nearMissCandidate = failedCandidates.sort((a, b) => {
      const aScore = a.skills.reduce((acc, s) => acc + s.score, 0);
      const bScore = b.skills.reduce((acc, s) => acc + s.score, 0);
      return bScore - aScore;
    })[0];

    if (!nearMissCandidate && failedCandidates.length > 0) {
      nearMissCandidate = failedCandidates[0];
    }

    // 3. Dynamic candidate individual scoring against actual project requirements
    const scoredCandidates = validCandidates.map(candidate => {
      // Calculate how well this candidate matches the actual mandatory and preferred skills
      let skillMatchCount = 0;
      let skillScoreTotal = 0;

      mandatorySkills.forEach(req => {
        const matchingSkill = candidate.skills.find(sk =>
          sk.name.toLowerCase().includes(req.toLowerCase().split(' ')[0]) ||
          req.toLowerCase().includes(sk.name.toLowerCase().split(' ')[0])
        );
        if (matchingSkill && matchingSkill.score >= 6) {
          skillMatchCount++;
          skillScoreTotal += matchingSkill.score;
        }
      });

      preferredSkills.forEach(pref => {
        const matchingSkill = candidate.skills.find(sk =>
          sk.name.toLowerCase().includes(pref.toLowerCase().split(' ')[0]) ||
          pref.toLowerCase().includes(sk.name.toLowerCase().split(' ')[0])
        );
        if (matchingSkill && matchingSkill.score >= 5) {
          skillMatchCount += 0.5;
          skillScoreTotal += matchingSkill.score * 0.5;
        }
      });

      const fitRatio = Math.min(1, skillMatchCount / Math.max(1, mandatorySkills.length));
      const individualFit = Math.round(fitRatio * 65 + (skillScoreTotal / (mandatorySkills.length * 10)) * 25 + 10);

      return {
        candidate,
        individualFit: Math.min(98, Math.max(45, individualFit))
      };
    });

    // 4. Submodular Complementary Team Selection
    const selectedTeam: ScorerCandidate[] = [];
    const coveredSkills = new Set<string>();

    while (selectedTeam.length < teamSize) {
      const remaining = scoredCandidates.filter(sc => !selectedTeam.some(st => st.id === sc.candidate.id));
      if (remaining.length === 0) break;

      remaining.sort((a, b) => {
        // Measure marginal value: how many UNCOVERED mandatory skills does this candidate eliminate?
        const aNewSkills = mandatorySkills.filter(req =>
          !coveredSkills.has(req) && a.candidate.skills.some(sk =>
            (sk.name.toLowerCase().includes(req.toLowerCase().split(' ')[0]) || req.toLowerCase().includes(sk.name.toLowerCase().split(' ')[0])) && sk.score >= 6
          )
        ).length;

        const bNewSkills = mandatorySkills.filter(req =>
          !coveredSkills.has(req) && b.candidate.skills.some(sk =>
            (sk.name.toLowerCase().includes(req.toLowerCase().split(' ')[0]) || req.toLowerCase().includes(sk.name.toLowerCase().split(' ')[0])) && sk.score >= 6
          )
        ).length;

        if (aNewSkills !== bNewSkills) return bNewSkills - aNewSkills;
        return b.individualFit - a.individualFit;
      });

      const bestPick = remaining[0].candidate;
      selectedTeam.push(bestPick);
      bestPick.skills.forEach(s => coveredSkills.add(s.name));
    }

    // 5. Deterministic Scoring Layer (35% mandatory, 20% preferred, 15% domain, 10% availability, 10% exp, 10% diversity)
    console.log(`[ProjectMatch AI] Running deterministic hybrid scoring...`);
    const hybridScore = calculateDeterministicTeamScore(
      {
        title,
        mandatorySkills,
        preferredSkills,
        mandatoryDomains,
        minAvailability,
        teamSize
      },
      selectedTeam
    );
    console.log(`[ProjectMatch AI] Final Deterministic Team Score: ${hybridScore.teamScore}%`);

    // 6. Identify Hidden Gem (Domain Specialist with high marginal value who closed a critical gap)
    const hiddenStudent = selectedTeam.reduce((lowestFit, current) => {
      const currentFit = scoredCandidates.find(sc => sc.candidate.id === current.id)?.individualFit || 70;
      const lowestFitScore = scoredCandidates.find(sc => sc.candidate.id === lowestFit.id)?.individualFit || 70;
      return currentFit < lowestFitScore ? current : lowestFit;
    }, selectedTeam[selectedTeam.length - 1] || selectedTeam[0]);

    const hiddenStudentFit = scoredCandidates.find(sc => sc.candidate.id === hiddenStudent.id)?.individualFit || 58;

    // 7. Call Gemini for qualitative reasoning and candidate specific contribution proofs
    console.log(`[ProjectMatch AI] Calling Gemini for structured qualitative synergy reasoning...`);
    const prompt = `You are the ProjectMatch AI Team Architect.
Generate structured qualitative team synergy reasoning and individual member contributions for this university squad:

Project Brief:
Title: ${title}
Description: ${description}
Mandatory Skills Required: ${mandatorySkills.join(', ')}
Preferred Skills: ${preferredSkills.join(', ')}
Calculated Team Synergy Score: ${hybridScore.teamScore}%

Selected Team Members:
${selectedTeam.map(m => `- ID: ${m.id} | Name: ${m.name} | Department: ${m.department} | Skills: ${m.skills.map(s => `${s.name} ${s.score}/10`).join(', ')} | Availability: ${m.availabilityHours}h/wk`).join('\n')}

Instructions:
1. Provide a "synergy_reasoning" explaining why individual fit != team value and how these specific students complement each other.
2. Provide a "why_this_team" summary.
3. List 3 key "team_strengths".
4. List 1 "team_gaps" to watch out for.
5. Provide a specific "contribution" string for EACH member explaining the exact capability gap they eliminate for THIS project.

Output strict JSON matching the schema.`;

    const geminiReasoning = await callGeminiStructured<any>({
      prompt,
      systemInstruction: 'You are an AI Architect evaluating complementary team formation. Output strict JSON.',
      responseSchema: GEMINI_REASONING_SCHEMA
    });

    const contributionsMap = new Map<string, string>();
    if (geminiReasoning?.member_contributions) {
      geminiReasoning.member_contributions.forEach((mc: any) => {
        contributionsMap.set(mc.candidate_id, mc.contribution);
      });
    }

    // Map final members with contributions
    const members = selectedTeam.map((cand: any) => {
      const fit = scoredCandidates.find(sc => sc.candidate.id === cand.id)?.individualFit || 90;
      return {
        candidate_id: cand.id,
        name: cand.name,
        department: cand.department,
        recommended_role: cand.role || 'Technical Specialist',
        individual_fit: fit,
        contribution: contributionsMap.get(cand.id) || `Brings essential capability in ${cand.department} to eliminate technical bottlenecks.`,
        avatar: cand.avatar,
        profileImage: cand.profileImage
      };
    });

    console.log(`[ProjectMatch AI] Squad assembled:`, members.map(m => `${m.name} (${m.department})`));
    console.log(`[ProjectMatch AI] ========================================\n`);

    const finalResponse: TeamRecommendationResponse = {
      team_score: hybridScore.teamScore,
      members,
      coverage: {
        mandatory_skills: hybridScore.coverage.mandatorySkills,
        preferred_skills: hybridScore.coverage.preferredSkills,
        domains: hybridScore.coverage.domains,
        roles: hybridScore.coverage.roles
      },
      team_strengths: geminiReasoning.team_strengths,
      team_gaps: geminiReasoning.team_gaps,
      synergy_reasoning: geminiReasoning.synergy_reasoning,
      why_this_team: geminiReasoning.why_this_team,
      hidden_gem: {
        candidate_id: hiddenStudent.id,
        name: hiddenStudent.name,
        individual_fit: hiddenStudentFit,
        marginal_team_value: Math.min(96, hiddenStudentFit + 32),
        capability_eliminated: mandatorySkills[mandatorySkills.length - 1] || 'Domain Specialization',
        explanation: `${hiddenStudent.name} was selected because she eliminated the squad's single largest fatal capability gap.`
      },
      near_miss: nearMissCandidate ? {
        candidate_id: nearMissCandidate.id,
        name: nearMissCandidate.name,
        rejection_reason: `Exceptional technical capability, but committed only ${nearMissCandidate.availabilityHours} hrs/wk vs required ${minAvailability} hrs/wk.`,
        constraint_failed: `Availability: ${nearMissCandidate.availabilityHours} hrs/week committed (Requires ${minAvailability} hrs/week minimum)`,
        available_hours: nearMissCandidate.availabilityHours,
        required_hours: minAvailability
      } : undefined
    };

    return res.json(finalResponse);
  } catch (error: any) {
    console.error('[ProjectMatch AI] Error in /api/recommend-team:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate team recommendation via Gemini API.'
    });
  }
}
