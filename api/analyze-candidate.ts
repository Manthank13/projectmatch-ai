import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleAnalyzeCandidate } from '../server/routes/analyzeCandidate';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handleAnalyzeCandidate(req as any, res as any);
}
