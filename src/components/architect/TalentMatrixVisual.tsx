import React, { useState, useEffect, useRef, useMemo } from 'react';
import { INITIAL_STUDENTS } from '../../data/students';
import { Student } from '../../types';
import { getStudentAvatar } from '../../utils/avatar';

interface NodePosition {
  student: Student;
  angle: number;
  distanceRatio: number;
  xPct: number;
  yPct: number;
  color: string;
  glowColor: string;
  domain: string;
}

interface Connection {
  sourceId: string;
  targetId: string;
  type: 'synergy' | 'domain' | 'complementary';
  label?: string;
}

const DOMAIN_CLUSTERS = [
  { id: 'AI / ML', label: 'AI / ML', x: '12%', y: '16%', color: '#00E5FF' },
  { id: 'CSE', label: 'CSE', x: '86%', y: '16%', color: '#8B5CF6' },
  { id: 'ROBOTICS', label: 'ROBOTICS', x: '90%', y: '50%', color: '#F59E0B' },
  { id: 'BIOTECH', label: 'BIOTECH', x: '84%', y: '82%', color: '#10B981' },
  { id: 'ENVIRONMENT', label: 'ENVIRONMENT', x: '48%', y: '90%', color: '#34D399' },
  { id: 'DESIGN', label: 'DESIGN', x: '14%', y: '82%', color: '#EC4899' },
  { id: 'DATA', label: 'DATA', x: '10%', y: '50%', color: '#38BDF8' },
  { id: 'ECE', label: 'ECE', x: '48%', y: '10%', color: '#6366F1' }
];

const SCAN_STATES = [
  '✦ AI SCANNING TALENT NETWORK',
  '✦ 16 STUDENTS INDEXED',
  '✦ 46 SKILLS MAPPED',
  '✦ COMPLEMENTARY TALENT DETECTED',
  '✦ TEAM SYNERGY 94%'
];

// Pre-defined high-synergy team candidate IDs for the "Find My Team" animation
const DREAM_SQUAD_IDS = ['S001', 'S002', 'S003', 'S006'];

export const TalentMatrixVisual: React.FC<{
  onTriggerArchitect?: () => void;
  isTriggeredFromHero?: boolean;
}> = ({ onTriggerArchitect, isTriggeredFromHero }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredStudentId, setHoveredStudentId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [architectComplete, setArchitectComplete] = useState(false);
  const [architectStageText, setArchitectStageText] = useState('');

  // 12 key students mapped to orbital positions
  const nodes = useMemo<NodePosition[]>(() => {
    const selectedStudents = INITIAL_STUDENTS.slice(0, 12);
    const domainColors: Record<string, { color: string; glow: string }> = {
      'AI / ML': { color: '#00E5FF', glow: 'rgba(0, 229, 255, 0.4)' },
      'CSE': { color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' },
      'ROBOTICS': { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' },
      'BIOTECH': { color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
      'ENVIRONMENT': { color: '#34D399', glow: 'rgba(52, 211, 153, 0.4)' },
      'DESIGN': { color: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)' },
      'BACKEND': { color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' },
      'PRODUCT': { color: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)' }
    };

    // Calculate orbital coordinates around center (50%, 50%)
    return selectedStudents.map((student, i) => {
      const primaryDomain = student.domains[0] || 'AI / ML';
      const colors = domainColors[primaryDomain] || { color: '#00E5FF', glow: 'rgba(0, 229, 255, 0.4)' };

      // Distribute evenly in an elliptical orbit
      const angle = (i / selectedStudents.length) * 2 * Math.PI - Math.PI / 2;
      // Elliptical radii: X radius ~ 38%, Y radius ~ 36%
      const rx = 37;
      const ry = 35;
      const xPct = 50 + rx * Math.cos(angle);
      const yPct = 50 + ry * Math.sin(angle);

      return {
        student,
        angle,
        distanceRatio: 1,
        xPct,
        yPct,
        color: colors.color,
        glowColor: colors.glow,
        domain: primaryDomain
      };
    });
  }, []);

  // Meaningful interdisciplinary compatibility connections
  const connections = useMemo<Connection[]>(() => [
    { sourceId: 'S001', targetId: 'S003', type: 'synergy', label: 'AI & Vision' },
    { sourceId: 'S001', targetId: 'S005', type: 'complementary', label: 'Hardware ↔ Scaling' },
    { sourceId: 'S002', targetId: 'S004', type: 'domain', label: 'Bio ↔ Marine Data' },
    { sourceId: 'S003', targetId: 'S006', type: 'complementary', label: 'Vision ↔ UX Design' },
    { sourceId: 'S006', targetId: 'S008', type: 'synergy', label: 'UX ↔ WebGL' },
    { sourceId: 'S001', targetId: 'S011', type: 'domain', label: 'Robotics ↔ Firmware' },
    { sourceId: 'S004', targetId: 'S009', type: 'domain', label: 'Marine ↔ Satellite GIS' },
    { sourceId: 'S002', targetId: 'S012', type: 'synergy', label: 'Bio Research ↔ HPC' },
    { sourceId: 'S005', targetId: 'S010', type: 'complementary', label: 'Backend ↔ SecOps' },
    { sourceId: 'S001', targetId: 'S002', type: 'synergy', label: 'Lead AI ↔ Bio Sensor' },
    { sourceId: 'S003', targetId: 'S004', type: 'complementary', label: 'Vision ↔ Sensor Data' },
    { sourceId: 'S005', targetId: 'S006', type: 'complementary', label: 'API ↔ Product UI' }
  ], []);

  // Autonomous Telemetry Scanner Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setScanStepIndex(prev => (prev + 1) % SCAN_STATES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Trigger Team Discovery Sequence
  const handleTriggerSquadDiscovery = () => {
    if (isArchitecting) return;
    setIsArchitecting(true);
    setArchitectComplete(false);

    setArchitectStageText('AI SCANNING NETWORK...');
    setTimeout(() => {
      setArchitectStageText('ANALYZING 46+ SKILLS & CONSTRAINTS...');
    }, 800);

    setTimeout(() => {
      setArchitectStageText('MAPPING COMPLEMENTARY TALENT...');
    }, 1600);

    setTimeout(() => {
      setArchitectStageText('TEAM ARCHITECTURE READY • 94% SYNERGY');
      setArchitectComplete(true);
      setIsArchitecting(false);
    }, 2400);
  };

  // External trigger sync from parent hero button
  useEffect(() => {
    if (isTriggeredFromHero) {
      handleTriggerSquadDiscovery();
    }
  }, [isTriggeredFromHero]);

  // Canvas-based Animated Traveling Photons & Glowing Grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 540);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Traveling Photons along lines
    const particles = connections.map((conn, idx) => ({
      connIndex: idx,
      progress: (idx * 0.15) % 1,
      speed: 0.004 + (idx % 3) * 0.002
    }));

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      const isLightMode = document.documentElement.classList.contains('light');

      // 1. Draw subtle background cyber grid
      const gridSize = 40;
      ctx.strokeStyle = isLightMode ? 'rgba(2, 132, 199, 0.05)' : 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Center holographic glow concentric rings
      const cx = width * 0.5;
      const cy = height * 0.5;
      const corePulse = Math.sin(tick * 0.04) * 8;

      // Outer radar circle
      ctx.strokeStyle = isLightMode ? 'rgba(2, 132, 199, 0.12)' : 'rgba(0, 229, 255, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, 140 + corePulse, 0, Math.PI * 2);
      ctx.stroke();

      // Middle concentric ring
      ctx.strokeStyle = isLightMode ? 'rgba(139, 92, 246, 0.18)' : 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(cx, cy, 95 - corePulse * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // 3. Draw Connection Lines between nodes
      connections.forEach((conn, idx) => {
        const sourceNode = nodes.find(n => n.student.id === conn.sourceId);
        const targetNode = nodes.find(n => n.student.id === conn.targetId);
        if (!sourceNode || !targetNode) return;

        const x1 = (sourceNode.xPct / 100) * width;
        const y1 = (sourceNode.yPct / 100) * height;
        const x2 = (targetNode.xPct / 100) * width;
        const y2 = (targetNode.yPct / 100) * height;

        const isHoverConnected =
          hoveredStudentId === conn.sourceId || hoveredStudentId === conn.targetId;
        const isSquadLine =
          (architectComplete || isArchitecting) &&
          DREAM_SQUAD_IDS.includes(conn.sourceId) &&
          DREAM_SQUAD_IDS.includes(conn.targetId);
        const isCategoryActive =
          selectedCategory &&
          (sourceNode.domain === selectedCategory || targetNode.domain === selectedCategory);

        const isHighlighted = isHoverConnected || isSquadLine || isCategoryActive;
        const isDimmed =
          (hoveredStudentId && !isHoverConnected) ||
          (selectedCategory && !isCategoryActive);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (isHighlighted) {
          ctx.strokeStyle = isSquadLine ? '#00E5FF' : sourceNode.color;
          ctx.lineWidth = isSquadLine ? 2.5 : 2.0;
          ctx.globalAlpha = 0.9;
          ctx.shadowColor = isSquadLine ? '#00E5FF' : sourceNode.color;
          ctx.shadowBlur = 12;
        } else if (isDimmed) {
          ctx.strokeStyle = isLightMode ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3;
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = isLightMode ? 'rgba(2, 132, 199, 0.22)' : 'rgba(0, 229, 255, 0.18)';
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.7;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
        ctx.globalAlpha = 1.0;

        // Draw traveling photon particle along active/highlighted lines
        const particle = particles[idx];
        particle.progress = (particle.progress + particle.speed) % 1;
        const px = x1 + (x2 - x1) * particle.progress;
        const py = y1 + (y2 - y1) * particle.progress;

        ctx.beginPath();
        ctx.arc(px, py, isHighlighted ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? '#00E5FF' : (isLightMode ? '#0284C7' : '#38BDF8');
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = isHighlighted ? 10 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Draw Radial lines to Center AI Core for dream squad nodes
      if (architectComplete || isArchitecting) {
        DREAM_SQUAD_IDS.forEach(id => {
          const node = nodes.find(n => n.student.id === id);
          if (!node) return;
          const nx = (node.xPct / 100) * width;
          const ny = (node.yPct / 100) * height;

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [nodes, connections, hoveredStudentId, selectedCategory, isArchitecting, architectComplete]);

  const activeHoveredNode = nodes.find(n => n.student.id === hoveredStudentId);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[540px] mx-auto rounded-3xl overflow-hidden glass-identity-card border border-cyan-500/25 dark:border-cyan-400/20 shadow-2xl p-4 flex items-center justify-center select-none"
    >
      {/* Background Interactive HTML5 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Floating AI Telemetry Capsule */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/80 dark:bg-space-black/70 backdrop-blur-md border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-[10px] sm:text-xs font-headline font-bold shadow-cyan-glow">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="truncate max-w-[200px] sm:max-w-none">
            {architectStageText || SCAN_STATES[scanStepIndex]}
          </span>
        </div>

        <button
          type="button"
          onClick={handleTriggerSquadDiscovery}
          className="pointer-events-auto px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-600 dark:text-cyan-300 text-[10px] font-headline font-extrabold transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xs text-cyan-500">auto_awesome</span>
          <span>{architectComplete ? 'RESET' : 'TEST SCAN'}</span>
        </button>
      </div>

      {/* Floating Department Cluster Badges (Perimeter) */}
      {DOMAIN_CLUSTERS.map(cluster => {
        const isSelected = selectedCategory === cluster.id;
        return (
          <button
            key={cluster.id}
            type="button"
            onClick={() => setSelectedCategory(isSelected ? null : cluster.id)}
            style={{ left: cluster.x, top: cluster.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[9px] font-headline font-extrabold tracking-wider transition-all duration-300 z-10 cursor-pointer shadow-sm ${
              isSelected
                ? 'bg-cyan-500 text-space-black ring-2 ring-cyan-300 scale-110 shadow-cyan-glow'
                : 'bg-surface/85 dark:bg-space-black/80 text-on-surface-variant hover:text-cyan-500 dark:hover:text-cyan-300 border border-outline-variant hover:border-cyan-400/50 hover:scale-105'
            }`}
          >
            {cluster.label}
          </button>
        );
      })}

      {/* Central Holographic AI Core */}
      <div
        onClick={handleTriggerSquadDiscovery}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center cursor-pointer group"
        title="Click to Synthesize Complementary Team"
      >
        {/* Holographic Glowing Orb */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-600/25 to-cyan-400/30 backdrop-blur-xl border border-cyan-400/60 shadow-cyan-glow flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-300 transition-all duration-300">
          {/* Animated concentric ring pulses */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-25 pointer-events-none" />
          <div className="absolute -inset-2 rounded-full border border-violet-500/30 animate-spin-slow opacity-60 pointer-events-none" />

          {/* Central Logo & Core Text */}
          <div className="flex flex-col items-center text-center px-1">
            <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-300 text-xl sm:text-2xl font-bold animate-pulse">
              psychology
            </span>
            <span className="text-[9px] sm:text-[10px] font-headline font-extrabold text-on-surface tracking-wider leading-none mt-0.5">
              PROJECTMATCH
            </span>
            <span className="text-[8px] font-mono text-cyan-600 dark:text-cyan-400 font-bold tracking-widest uppercase">
              AI CORE
            </span>
          </div>
        </div>

        {/* Small Pulsing Indicator Tag */}
        <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-surface-container/90 border border-outline-variant/80 text-[8px] font-mono text-on-surface-variant font-bold shadow-sm flex items-center gap-1 group-hover:text-cyan-500">
          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
          <span>TEAM ARCHITECT</span>
        </div>
      </div>

      {/* Floating Student Nodes (12 Orbital Personas) */}
      {nodes.map(node => {
        const isHovered = hoveredStudentId === node.student.id;
        const isDreamSquad =
          (architectComplete || isArchitecting) && DREAM_SQUAD_IDS.includes(node.student.id);
        const isCategoryMatch = selectedCategory && node.domain === selectedCategory;
        const isDimmed =
          (hoveredStudentId && !isHovered) ||
          (selectedCategory && !isCategoryMatch);

        const avatarSrc = getStudentAvatar(node.student);
        const topSkill = node.student.skills[0];

        return (
          <div
            key={node.student.id}
            onMouseEnter={() => setHoveredStudentId(node.student.id)}
            onMouseLeave={() => setHoveredStudentId(null)}
            style={{
              left: `${node.xPct}%`,
              top: `${node.yPct}%`
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 cursor-pointer ${
              isDimmed ? 'opacity-35 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            {/* Circular Avatar Container with Domain Glow */}
            <div
              className={`relative rounded-full p-0.5 transition-all duration-300 ${
                isDreamSquad
                  ? 'ring-4 ring-cyan-400 shadow-cyan-glow scale-110 animate-bounce-subtle'
                  : isHovered
                  ? 'ring-3 ring-cyan-400 shadow-cyan-glow scale-115'
                  : 'hover:ring-2 hover:ring-cyan-400/60'
              }`}
              style={{
                boxShadow: isHovered || isDreamSquad ? `0 0 16px ${node.glowColor}` : 'none'
              }}
            >
              {/* Photo Image */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-surface border border-outline-variant flex items-center justify-center">
                <img
                  src={avatarSrc}
                  alt={node.student.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Verified / Domain Pill Indicator */}
              <span
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-surface flex items-center justify-center"
                style={{ backgroundColor: node.color }}
                title={node.domain}
              />
            </div>

            {/* Sub-label Name Pill (Visible on Desktop / Hover) */}
            <div
              className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[9px] font-headline font-bold transition-all pointer-events-none ${
                isHovered || isDreamSquad
                  ? 'bg-surface-elevated text-on-surface border border-cyan-400/50 shadow-sm opacity-100 scale-105'
                  : 'bg-surface/75 text-on-surface-variant border border-outline-variant/40 opacity-80'
              }`}
            >
              <span>{node.student.name.split(' ')[0]}</span>
              {topSkill && (
                <span className="text-cyan-600 dark:text-cyan-400 font-extrabold ml-1">
                  {topSkill.score}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Interactive Glass Hover Tooltip Card (Bounded to Visual Container) */}
      {activeHoveredNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64 glass-identity-card rounded-2xl p-3.5 border border-cyan-400/50 shadow-2xl z-30 animate-fadeIn pointer-events-none">
          <div className="flex items-start justify-between gap-2 border-b border-outline-variant/50 pb-2 mb-2">
            <div className="min-w-0">
              <h4 className="font-headline font-extrabold text-on-surface text-xs truncate">
                {activeHoveredNode.student.name}
              </h4>
              <p className="text-[10px] font-headline font-bold text-cyan-600 dark:text-cyan-400 truncate">
                {activeHoveredNode.student.role}
              </p>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-[9px] font-headline font-extrabold flex-shrink-0">
              94% SYNERGY
            </span>
          </div>

          {/* Top 3 Skills */}
          <div className="space-y-1">
            <span className="text-[9px] font-headline font-bold text-on-surface-variant uppercase tracking-wider block">
              Top Capabilities:
            </span>
            <div className="flex flex-wrap gap-1">
              {activeHoveredNode.student.skills.slice(0, 3).map(sk => (
                <span
                  key={sk.name}
                  className="px-2 py-0.5 rounded-full bg-surface-container text-[9px] font-headline text-on-surface flex items-center gap-1 border border-outline-variant/60"
                >
                  <span>{sk.name}</span>
                  <strong className="text-cyan-600 dark:text-cyan-400 font-extrabold">
                    {sk.score}/10
                  </strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Architected Dream Team Glass Banner Overlay */}
      {architectComplete && (
        <div className="absolute bottom-4 left-4 right-4 z-30 p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-violet-600/20 to-cyan-400/20 border border-cyan-400/50 backdrop-blur-xl shadow-cyan-glow flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500 text-space-black flex items-center justify-center font-extrabold text-xs">
              ✦
            </div>
            <div>
              <span className="text-[11px] font-headline font-extrabold text-on-surface block leading-tight">
                AI-ARCHITECTED TEAM
              </span>
              <span className="text-[9px] font-body text-cyan-600 dark:text-cyan-300 block">
                Tony • Shuri • Peter • Barbie
              </span>
            </div>
          </div>

          <span className="px-2 py-1 rounded-lg bg-cyan-500 text-space-black text-[10px] font-headline font-extrabold shadow-sm">
            94% SYNERGY
          </span>
        </div>
      )}
    </div>
  );
};
