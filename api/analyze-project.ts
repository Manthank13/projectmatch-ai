import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleAnalyzeProject } from '../server/routes/analyzeProject';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handleAnalyzeProject(req as any, res as any);
}
