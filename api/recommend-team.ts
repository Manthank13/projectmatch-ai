import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleRecommendTeam } from '../server/routes/recommendTeam.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handleRecommendTeam(req as any, res as any);
}
