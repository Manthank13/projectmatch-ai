import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { handleAnalyzeProject } from './routes/analyzeProject.js';
import { handleAnalyzeCandidate } from './routes/analyzeCandidate.js';
import { handleRecommendTeam } from './routes/recommendTeam.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    gemini_configured: !!process.env.GEMINI_API_KEY,
    gemini_key_prefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 8) + '...' : null
  });
});

// AI Endpoints
app.post('/api/analyze-project', handleAnalyzeProject);
app.post('/api/analyze-candidate', handleAnalyzeCandidate);
app.post('/api/recommend-team', handleRecommendTeam);

app.listen(PORT, () => {
  console.log(`[ProjectMatch Server] Listening on http://localhost:${PORT}`);
  console.log(`[ProjectMatch Server] Gemini AI Integration: ${process.env.GEMINI_API_KEY ? 'CONFIGURED ✓' : 'NOT CONFIGURED ✗'}`);
});
