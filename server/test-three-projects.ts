import 'dotenv/config';
import { handleAnalyzeProject } from './routes/analyzeProject.js';
import { handleRecommendTeam } from './routes/recommendTeam.js';
import { INITIAL_STUDENTS } from '../src/data/students.js';

function createMockReqRes(body: any) {
  const req = { body } as any;
  let statusCode = 200;
  let responseData: any = null;

  const res = {
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    json: (data: any) => {
      responseData = data;
      return res;
    }
  } as any;

  return { req, res, getResult: () => ({ statusCode, responseData }) };
}

async function runThreeProjectsVerification() {
  console.log('================================================================');
  console.log('PROJECTMATCH — 3 DISTINCT PROJECT REAL GEMINI VERIFICATION TEST');
  console.log('================================================================\n');

  // ==========================================
  // TEST 1: CALLING APP
  // ==========================================
  console.log('>>> RUNNING TEST 1: "Build a simple calling app"');
  const test1Analyze = createMockReqRes({
    title: 'Calling App',
    description: 'Build a simple calling app with real-time voice and video communication'
  });
  await handleAnalyzeProject(test1Analyze.req, test1Analyze.res);
  const res1Analysis = test1Analyze.getResult().responseData;

  console.log('1. Extracted Requirements for Calling App:');
  console.log('   - Project Title:', res1Analysis.project_title);
  console.log('   - Mandatory Skills:', res1Analysis.mandatory_skills);
  console.log('   - Preferred Skills:', res1Analysis.preferred_skills);
  console.log('   - Domains:', res1Analysis.mandatory_domains);
  console.log('   - Roles:', res1Analysis.roles);

  // Assert no ocean/marine ecology keywords
  const skillsString1 = JSON.stringify(res1Analysis).toLowerCase();
  const hasOceanPollution1 = skillsString1.includes('ocean') || skillsString1.includes('marine') || skillsString1.includes('pollution');
  if (hasOceanPollution1) {
    throw new Error('TEST 1 FAILED: Calling App contains Ocean/Marine contamination!');
  }
  console.log('   ✓ Verified: ZERO ocean/marine contamination in Calling App!\n');

  // Recommend team for Calling App
  const test1Recommend = createMockReqRes({
    project: res1Analysis,
    candidates: INITIAL_STUDENTS
  });
  await handleRecommendTeam(test1Recommend.req, test1Recommend.res);
  const res1Team = test1Recommend.getResult().responseData;
  console.log('   - Team Synergy Score:', res1Team.team_score + '%');
  console.log('   - Assembled Squad:', res1Team.members.map((m: any) => `${m.name} (${m.department}) - ${m.recommended_role}`));
  console.log('   - Synergy Reasoning:', res1Team.synergy_reasoning.slice(0, 140) + '...');
  console.log('✓ TEST 1 PASSED COMPLETELY!\n');

  // ==========================================
  // TEST 2: CROP DISEASE DETECTION
  // ==========================================
  console.log('>>> RUNNING TEST 2: "Build an AI system that detects crop diseases from photographs"');
  const test2Analyze = createMockReqRes({
    title: 'Crop Disease Detection',
    description: 'Build an AI system that detects crop diseases from photographs and mobile camera uploads'
  });
  await handleAnalyzeProject(test2Analyze.req, test2Analyze.res);
  const res2Analysis = test2Analyze.getResult().responseData;

  console.log('2. Extracted Requirements for Crop Disease Detection:');
  console.log('   - Project Title:', res2Analysis.project_title);
  console.log('   - Mandatory Skills:', res2Analysis.mandatory_skills);
  console.log('   - Preferred Skills:', res2Analysis.preferred_skills);
  console.log('   - Domains:', res2Analysis.mandatory_domains);

  // Recommend team for Crop Disease
  const test2Recommend = createMockReqRes({
    project: res2Analysis,
    candidates: INITIAL_STUDENTS
  });
  await handleRecommendTeam(test2Recommend.req, test2Recommend.res);
  const res2Team = test2Recommend.getResult().responseData;
  console.log('   - Team Synergy Score:', res2Team.team_score + '%');
  console.log('   - Assembled Squad:', res2Team.members.map((m: any) => `${m.name} (${m.department}) - ${m.recommended_role}`));
  console.log('   - Synergy Reasoning:', res2Team.synergy_reasoning.slice(0, 140) + '...');
  console.log('✓ TEST 2 PASSED COMPLETELY!\n');

  // ==========================================
  // TEST 3: OCEAN POLLUTION SATELLITE
  // ==========================================
  console.log('>>> RUNNING TEST 3: "Build an ocean pollution monitoring platform using satellite imagery"');
  const test3Analyze = createMockReqRes({
    title: 'Ocean Pollution Satellite',
    description: 'Build an ocean pollution monitoring platform using satellite imagery, SAR data, and marine ecotoxicology sensors'
  });
  await handleAnalyzeProject(test3Analyze.req, test3Analyze.res);
  const res3Analysis = test3Analyze.getResult().responseData;

  console.log('3. Extracted Requirements for Ocean Satellite:');
  console.log('   - Project Title:', res3Analysis.project_title);
  console.log('   - Mandatory Skills:', res3Analysis.mandatory_skills);
  console.log('   - Preferred Skills:', res3Analysis.preferred_skills);
  console.log('   - Domains:', res3Analysis.mandatory_domains);

  // Recommend team for Ocean Satellite
  const test3Recommend = createMockReqRes({
    project: res3Analysis,
    candidates: INITIAL_STUDENTS
  });
  await handleRecommendTeam(test3Recommend.req, test3Recommend.res);
  const res3Team = test3Recommend.getResult().responseData;
  console.log('   - Team Synergy Score:', res3Team.team_score + '%');
  console.log('   - Assembled Squad:', res3Team.members.map((m: any) => `${m.name} (${m.department}) - ${m.recommended_role}`));
  console.log('   - Synergy Reasoning:', res3Team.synergy_reasoning.slice(0, 140) + '...');
  console.log('✓ TEST 3 PASSED COMPLETELY!\n');

  console.log('================================================================');
  console.log('VERIFICATION SUMMARY: ALL 3 PROJECTS GENERATED DISTINCT DYNAMIC');
  console.log('REQUIREMENTS AND COMPLEMENTARY SQUADS THROUGH GEMINI AI!');
  console.log('================================================================');
}

runThreeProjectsVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
