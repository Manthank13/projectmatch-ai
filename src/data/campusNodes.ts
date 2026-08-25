import { CampusZone, Department, Campus } from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    campus: 'Main Campus (Kattankulathur)',
    description: 'Core computing, distributed algorithms, high-throughput backend services, and database engineering.',
    coreSkills: ['FastAPI', 'PostgreSQL', 'Docker', 'Distributed Systems', 'Python'],
    researchAreas: ['Distributed Systems', 'Cloud Computing', 'Database Optimization']
  },
  {
    id: 'dept-ai',
    name: 'AI & Machine Learning Lab',
    code: 'AI/ML',
    campus: 'Main Campus (Kattankulathur)',
    description: 'Neural networks, computer vision, natural language generation, and high-performance GPU model training.',
    coreSkills: ['Machine Learning', 'PyTorch', 'Computer Vision', 'Deep Learning', 'Data Analysis'],
    researchAreas: ['Generative AI', 'Remote Sensing Vision', 'Acoustic Classification']
  },
  {
    id: 'dept-biotech',
    name: 'Biotechnology & Marine Ecology',
    code: 'BIOTECH',
    campus: 'Research Annex (Ramapuram)',
    description: 'Marine ecotoxicology, genetic sequencing, bio-informatics, and ecological chemistry sensors.',
    coreSkills: ['Environmental Biology', 'Water Quality', 'Bioinformatics', 'Scientific Research'],
    researchAreas: ['Ocean Hypoxia', 'Microplastic Dispersion', 'Bio-Remediation']
  },
  {
    id: 'dept-design',
    name: 'Design & Interaction Studio',
    code: 'DESIGN',
    campus: 'Main Campus (Kattankulathur)',
    description: 'Human-computer interaction, geospatial UI, design systems, user ergonomics, and spatial computing.',
    coreSkills: ['Figma', 'UI/UX Design', 'User Research', 'Visual Design', 'Design Systems'],
    researchAreas: ['Complex Data Visualization', 'HUD Usability', 'Accessibility (WCAG)']
  },
  {
    id: 'dept-robotics',
    name: 'Robotics & Mechatronics',
    code: 'ROBOTICS',
    campus: 'City Tech Park (Vadapalani)',
    description: 'Autonomous rovers, drone avionics, SLAM odometry, and edge sensor fusion microcontrollers.',
    coreSkills: ['ROS / ROS2', 'SLAM & Navigation', 'IoT / Sensors', 'C++', 'Hardware Prototyping'],
    researchAreas: ['Autonomous Rovers', 'LiDAR Odometry', 'Energy-Harvesting IoT']
  },
  {
    id: 'dept-env',
    name: 'Civil & Environmental Science',
    code: 'ENVIRONMENT',
    campus: 'Research Annex (Ramapuram)',
    description: 'Precision agriculture, soil tension analytics, microgrid balance, and carbon footprint reduction.',
    coreSkills: ['Soil Chemistry', 'Crop Phenology', 'GIS Mapping', 'Carbon Auditing'],
    researchAreas: ['Satellite Agritech', 'Urban Flooding', 'Renewable Microgrids']
  },
  {
    id: 'dept-ece',
    name: 'Electronics & Communication',
    code: 'ECE',
    campus: 'City Tech Park (Vadapalani)',
    description: 'LoRaWAN networks, low-power embedded chips, RF communication, and sensor hardware telemetry.',
    coreSkills: ['Embedded C', 'LoRaWAN', 'PCB Design', 'Microcontrollers'],
    researchAreas: ['Long-Range Telemetry', 'Mesh Protocols', 'Edge AI Acceleration']
  },
  {
    id: 'dept-data',
    name: 'Data Science & Intelligence',
    code: 'DATA',
    campus: 'Research Annex (Ramapuram)',
    description: 'Big data pipelines, anomaly detection, statistical deduction, and forensic intelligence modeling.',
    coreSkills: ['Data Analysis', 'Statistical Deduction', 'Python', 'Kafka', 'Pandas'],
    researchAreas: ['Anomaly Detection', 'Multivariate Outliers', 'Forensic Data Science']
  }
];

export const INITIAL_CAMPUSES: Campus[] = [
  {
    id: 'camp-main',
    name: 'SRM Innovation Grid — Main Campus',
    location: 'Kattankulathur, Chennai',
    description: 'Flagship academic campus with supercomputing clusters, central maker arena, and multi-disciplinary incubators.',
    departments: ['CSE', 'AI/ML', 'DESIGN', 'ROBOTICS'],
    labs: ['NVIDIA H100 GPU Cluster', 'Spatial Design Suite', 'Autonomous Rover Track']
  },
  {
    id: 'camp-city',
    name: 'SRM Innovation Grid — City Tech Park',
    location: 'Vadapalani, Chennai',
    description: 'Urban tech acceleration center focusing on robotics, embedded IoT hardware, and venture prototyping.',
    departments: ['ROBOTICS', 'ECE', 'CSE'],
    labs: ['LoRaWAN Sensor Mesh Gateway', 'Rapid Hardware Fab', 'IoT Test Arena']
  },
  {
    id: 'camp-annex',
    name: 'SRM Innovation Grid — Research Annex',
    location: 'Ramapuram, Chennai',
    description: 'Dedicated environmental sciences, biotechnology wet labs, and marine ecotoxicology research stations.',
    departments: ['BIOTECH', 'ENVIRONMENT', 'DATA'],
    labs: ['Marine Ecotox Spectrometry', 'Bio-Informatics Core', 'Hydro-Data Station']
  }
];

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: 'ai-lab',
    name: 'AI LAB',
    code: 'ZONE-ALPHA',
    tagline: 'Deep Learning & Neural Synthesis',
    description: 'Houses 64x NVIDIA GPU compute clusters dedicated to foundation model research and satellite vision.',
    activeStudents: 5,
    coreDomains: ['Machine Learning', 'Computer Vision', 'PyTorch', 'Data Analysis'],
    coordinates: { x: 20, y: 25 },
    color: '#FF6B6B',
    telemetry: {
      gpuLoad: '89.4%',
      activeExperiments: 14,
      talentUtilization: '94%'
    }
  },
  {
    id: 'cse-hub',
    name: 'CSE',
    code: 'ZONE-BETA',
    tagline: 'Core Systems & Backend Engineering',
    description: 'High-throughput API development, distributed database topologies, and microservice meshes.',
    activeStudents: 4,
    coreDomains: ['FastAPI', 'PostgreSQL', 'Backend/API', 'Docker'],
    coordinates: { x: 48, y: 18 },
    color: '#5953AB',
    telemetry: {
      gpuLoad: '72.0%',
      activeExperiments: 10,
      talentUtilization: '90%'
    }
  },
  {
    id: 'biotech-lab',
    name: 'BIOTECH LAB',
    code: 'ZONE-GAMMA',
    tagline: 'Marine Ecotoxicology & Bio-Informatics',
    description: 'Equipped with water spectrometry benches and microplate fluorometers for ecological tracking.',
    activeStudents: 3,
    coreDomains: ['Environmental Biology', 'Water Quality', 'Scientific Research'],
    coordinates: { x: 78, y: 22 },
    color: '#2B6579',
    telemetry: {
      gpuLoad: '42.1%',
      activeExperiments: 8,
      talentUtilization: '91%'
    }
  },
  {
    id: 'design-studio',
    name: 'DESIGN STUDIO',
    code: 'ZONE-DELTA',
    tagline: 'Human-Computer Interaction & HUD Design',
    description: 'Usability testing suites, complex geospatial HUD prototyping, and design systems.',
    activeStudents: 3,
    coreDomains: ['UI/UX Design', 'Figma', 'User Research', 'Visual Branding'],
    coordinates: { x: 82, y: 65 },
    color: '#FFB3B0',
    telemetry: {
      gpuLoad: '58.7%',
      activeExperiments: 7,
      talentUtilization: '88%'
    }
  },
  {
    id: 'robotics-lab',
    name: 'ROBOTICS LAB',
    code: 'ZONE-EPSILON',
    tagline: 'Autonomous Systems & Edge Hardware',
    description: 'Autonomous rover indoor testing grounds, LiDAR tracks, and embedded sensor gateways.',
    activeStudents: 4,
    coreDomains: ['ROS / ROS2', 'SLAM & Navigation', 'IoT / Sensors', 'C++'],
    coordinates: { x: 18, y: 72 },
    color: '#A7A1FF',
    telemetry: {
      gpuLoad: '76.3%',
      activeExperiments: 12,
      talentUtilization: '96%'
    }
  },
  {
    id: 'environment-lab',
    name: 'ENVIRONMENT LAB',
    code: 'ZONE-ZETA',
    tagline: 'Wetlands Chemistry & Carbon Forensics',
    description: 'Soil moisture tension arrays, agricultural drone multispectral telemetry, and microgrid testbeds.',
    activeStudents: 3,
    coreDomains: ['Environmental Domain', 'Soil Chemistry', 'Crop Phenology', 'GIS'],
    coordinates: { x: 48, y: 78 },
    color: '#6CA3B9',
    telemetry: {
      gpuLoad: '38.0%',
      activeExperiments: 6,
      talentUtilization: '89%'
    }
  },
  {
    id: 'data-center',
    name: 'DATA CENTER',
    code: 'ZONE-ETA',
    tagline: 'Kafka Telemetry & Distributed Storage',
    description: 'Central campus server infrastructure managing real-time data pipelines and cybersecurity defenses.',
    activeStudents: 3,
    coreDomains: ['Data Analysis', 'Cybersecurity & Auditing', 'Python', 'Kafka'],
    coordinates: { x: 32, y: 48 },
    color: '#8C84FA',
    telemetry: {
      gpuLoad: '95.2%',
      activeExperiments: 18,
      talentUtilization: '98%'
    }
  },
  {
    id: 'innovation-hub',
    name: 'INNOVATION HUB',
    code: 'ZONE-THETA',
    tagline: 'Interdisciplinary Squad Synthesis',
    description: 'Central collaboration space where engineers, designers, scientists, and product leaders build hackathon ventures.',
    activeStudents: 4,
    coreDomains: ['Product Strategy', 'Scientific Research', 'Rapid Prototyping'],
    coordinates: { x: 65, y: 48 },
    color: '#AE2F34',
    telemetry: {
      gpuLoad: '64.0%',
      activeExperiments: 11,
      talentUtilization: '95%'
    }
  }
];
