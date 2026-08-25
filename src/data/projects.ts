import { ProjectArchetype } from '../types';

export const INITIAL_PROJECTS: ProjectArchetype[] = [
  {
    id: 'proj-interstellar',
    title: 'AI Ocean Pollution Monitoring & Prediction Platform',
    slug: 'interstellar',
    movieTag: '01 — INTERSTELLAR',
    tag: 'AI × ENVIRONMENT',
    description: 'Build an AI-powered platform for monitoring and predicting ocean pollution using satellite imagery, oceanographic data and environmental measurements.',
    teamSize: 4,
    minAvailability: 8,
    minExperience: 'Intermediate (1+ hackathons)',
    icon: '🌊',
    accentColor: '#FF6B6B',
    mandatoryDomain: 'ENVIRONMENT',
    preferredDomain: 'AI / ML',
    mandatorySkills: [
      'Machine Learning',
      'Data Analysis',
      'Backend/API Development',
      'Environmental/Ocean Domain Knowledge'
    ],
    preferredSkills: [
      'Remote Sensing',
      'GIS',
      'Frontend Development',
      'IoT/Sensors'
    ],
    preferredDepartments: ['CSE', 'Biotechnology & Marine Ecology', 'Design Studio'],
    constraints: ['Must run inference under 2 seconds', 'Minimum 8 hours/week availability overlap'],
    idealTeamIds: ['S011', 'S012', 'S004', 'S013'], // Aarav, Rohan, Kavya, Ananya (or Tony, Gru, Shrek, Barbie)
    nearMissId: 'S015',
    hiddenValueId: 'S004'
  },
  {
    id: 'proj-martian',
    title: 'Martian Botany & Autonomous Crop Stress Forecaster',
    slug: 'the-martian',
    movieTag: '02 — THE MARTIAN',
    tag: 'AI × AGRICULTURE',
    description: 'AI & IoT precision agriculture platform fusing drone multispectral imagery and soil moisture mesh to detect early crop stress and optimize micro-irrigation.',
    teamSize: 4,
    minAvailability: 9,
    minExperience: 'Beginner to Intermediate',
    icon: '🪐',
    accentColor: '#6CA3B9',
    mandatoryDomain: 'ENVIRONMENT',
    mandatorySkills: [
      'Machine Learning',
      'Agricultural Domain',
      'IoT / Sensors',
      'Backend/API Development'
    ],
    preferredSkills: [
      'Remote Sensing / UAV',
      'Soil Chemistry',
      'GIS',
      'Frontend Development'
    ],
    idealTeamIds: ['S001', 'S017', 'S010', 'S005'],
    nearMissId: 'S015',
    hiddenValueId: 'S017'
  },
  {
    id: 'proj-ironman',
    title: 'Exosuit Biometric Telemetry & HUD Interface',
    slug: 'iron-man',
    movieTag: '03 — IRON MAN',
    tag: 'AI × ROBOTICS',
    description: 'Real-time heads-up display focusing on biometric sensor ingestion, edge computer vision kinematics, and low-latency motor actuation telemetry.',
    teamSize: 4,
    minAvailability: 10,
    minExperience: 'Advanced Prototyping',
    icon: '🤖',
    accentColor: '#FF5252',
    mandatoryDomain: 'ROBOTICS',
    mandatorySkills: [
      'Robotics & C++',
      'Computer Vision',
      'Hardware & IoT',
      'UI/UX Design'
    ],
    preferredSkills: [
      'Sensor Fusion',
      'WebGL / 3D',
      'Embedded Systems',
      'FastAPI'
    ],
    idealTeamIds: ['S001', 'S003', 'S006', 'S002'],
    nearMissId: 'S015',
    hiddenValueId: 'S006'
  },
  {
    id: 'proj-walle',
    title: 'Autonomous Waste Sorting & Solar Rover Fleet',
    slug: 'wall-e',
    movieTag: '04 — WALL-E',
    tag: 'ENVIRONMENT × ROBOTICS',
    description: 'Solar-powered autonomous rover fleet navigating campus grounds with SLAM, classifying recyclable debris using on-device computer vision, and mapping waste density.',
    teamSize: 4,
    minAvailability: 10,
    minExperience: 'Intermediate',
    icon: '🌱',
    accentColor: '#A7A1FF',
    mandatoryDomain: 'ROBOTICS',
    mandatorySkills: [
      'ROS / ROS2',
      'SLAM & Navigation',
      'Environmental Domain',
      'Backend/API Development'
    ],
    preferredSkills: [
      'Computer Vision',
      'IoT / Sensors',
      'Chassis Kinematics',
      'Mobile Telemetry'
    ],
    idealTeamIds: ['S016', 'S010', 'S007', 'S005'],
    nearMissId: 'S015',
    hiddenValueId: 'S007'
  },
  {
    id: 'proj-mazerunner',
    title: 'Dynamic Evacuation & Complex Grid Pathfinding',
    slug: 'the-maze-runner',
    movieTag: '05 — THE MAZE RUNNER',
    tag: 'OPTIMIZATION × AUTONOMOUS SYSTEMS',
    description: 'Decentralized spatial pathfinding network calculating dynamic safe routing in rapidly shifting disaster environments with ad-hoc wireless mesh telemetry.',
    teamSize: 4,
    minAvailability: 9,
    minExperience: 'Intermediate',
    icon: '🏃',
    accentColor: '#F59E0B',
    mandatoryDomain: 'DATA',
    mandatorySkills: [
      'Data Analysis',
      'Distributed Systems',
      'GIS Mapping',
      'UI/UX Design'
    ],
    preferredSkills: [
      'Ad-hoc Mesh',
      'Python',
      'Mobile Sensors',
      'Offline Caching'
    ],
    idealTeamIds: ['S008', 'S005', 'S006', 'S014'],
    nearMissId: 'S015',
    hiddenValueId: 'S008'
  },
  {
    id: 'proj-endgame',
    title: 'Global Emergency Resource Dispatch & Triage Mesh',
    slug: 'avengers-endgame',
    movieTag: '06 — AVENGERS: ENDGAME',
    tag: 'DISASTER RESPONSE',
    description: 'Zero-downtime crisis coordination platform mapping critical shelter capacity, blood supply logistics, and hospital triage escalations over encrypted peer-to-peer channels.',
    teamSize: 4,
    minAvailability: 10,
    minExperience: 'Advanced',
    icon: '⚡',
    accentColor: '#AE2F34',
    mandatoryDomain: 'CSE',
    mandatorySkills: [
      'Backend/API Development',
      'Data Analysis',
      'Cybersecurity & Auditing',
      'Scientific Research'
    ],
    preferredSkills: [
      'UI/UX Design',
      'Distributed Systems',
      'Mobile Sensors',
      'Cloud Sync'
    ],
    idealTeamIds: ['S005', 'S009', 'S008', 'S006'],
    nearMissId: 'S015',
    hiddenValueId: 'S009'
  }
];
