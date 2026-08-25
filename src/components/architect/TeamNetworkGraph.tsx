import React, { useState } from 'react';
import { Network, Activity, Cpu, Sparkles, User, Zap } from 'lucide-react';
import { playHoverSound, playClickSound } from '../../utils/sound';

interface TeamNetworkGraphProps {
  networkData: {
    nodes: Array<{
      id: string;
      label: string;
      role?: string;
      type: 'project' | 'member' | 'skill';
      category?: string;
      color?: string;
    }>;
    links: Array<{
      source: string;
      target: string;
      strength: number;
      label?: string;
    }>;
  };
}

export const TeamNetworkGraph: React.FC<TeamNetworkGraphProps> = ({ networkData }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Position topology for 4-member interdisciplinary team
  const nodePositions: Record<string, { x: number; y: number }> = {
    proj: { x: 50, y: 50 },
    aarav: { x: 26, y: 28 },
    rohan: { x: 74, y: 28 },
    kavya: { x: 74, y: 72 },
    ananya: { x: 26, y: 72 },
    'sk-ml': { x: 12, y: 15 },
    'sk-be': { x: 88, y: 15 },
    'sk-env': { x: 88, y: 85 },
    'sk-ux': { x: 12, y: 85 },
    // Fallback dynamic positions
    'S001': { x: 26, y: 28 },
    'S002': { x: 74, y: 28 },
    'S003': { x: 26, y: 72 },
    'S004': { x: 74, y: 72 },
    'sk-0': { x: 12, y: 15 },
    'sk-1': { x: 88, y: 15 },
    'sk-2': { x: 88, y: 85 },
  };

  const getNodePos = (id: string, idx: number, total: number) => {
    if (nodePositions[id]) return nodePositions[id];
    // Dynamic circular layout fallback
    if (id === 'proj') return { x: 50, y: 50 };
    const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: 50 + 35 * Math.cos(angle),
      y: 50 + 35 * Math.sin(angle)
    };
  };

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyber-cyan/30 via-white/[0.05] to-cyber-violet/20 shadow-holo my-10">
      <div className="rounded-[22px] bg-cyber-card/95 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
              <Network className="w-5 h-5 text-cyber-cyan" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>INTERDISCIPLINARY COLLABORATION TOPOLOGY</span>
              </h4>
              <p className="text-xs font-mono text-slate-400">
                Pulsing neural channels indicate cross-domain data transfer & API interfaces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan"></span>
              <span className="text-slate-300">AI / Tech</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-emerald"></span>
              <span className="text-slate-300">Domain Science</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-magenta"></span>
              <span className="text-slate-300">Design / UX</span>
            </div>
          </div>
        </div>

        {/* SVG Network Graph Canvas */}
        <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl bg-cyber-bg/80 border border-white/[0.05] flex items-center justify-center p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Glowing gradient lines */}
              <linearGradient id="linkGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="linkGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Links */}
            {networkData.links.map((link, idx) => {
              const srcNode = networkData.nodes.find(n => n.id === link.source);
              const tgtNode = networkData.nodes.find(n => n.id === link.target);
              const srcIdx = networkData.nodes.findIndex(n => n.id === link.source);
              const tgtIdx = networkData.nodes.findIndex(n => n.id === link.target);

              const p1 = getNodePos(link.source, srcIdx, networkData.nodes.length);
              const p2 = getNodePos(link.target, tgtIdx, networkData.nodes.length);

              const isHighlighted = activeNode === link.source || activeNode === link.target;

              return (
                <g key={`${link.source}-${link.target}-${idx}`}>
                  {/* Connection Line */}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isHighlighted ? '#00f5d4' : 'rgba(6, 182, 212, 0.3)'}
                    strokeWidth={isHighlighted ? 1.5 : 0.8}
                    strokeDasharray={link.source === 'proj' ? '2 2' : undefined}
                    filter={isHighlighted ? 'url(#glow)' : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Pulsing energy dot traveling along line */}
                  <circle r="0.8" fill="#00f5d4">
                    <animateMotion
                      dur={`${3 + (idx % 3)}s`}
                      repeatCount="indefinite"
                      path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                    />
                  </circle>
                </g>
              );
            })}

            {/* Render Nodes */}
            {networkData.nodes.map((node, idx) => {
              const pos = getNodePos(node.id, idx, networkData.nodes.length);
              const isCenter = node.type === 'project';
              const isMember = node.type === 'member';
              const isSkill = node.type === 'skill';
              const isHovered = activeNode === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseEnter={() => {
                    playHoverSound();
                    setActiveNode(node.id);
                  }}
                  onMouseLeave={() => setActiveNode(null)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Ring for Core Nodes */}
                  {isCenter && (
                    <circle
                      r="10"
                      fill="none"
                      stroke="#00f5d4"
                      strokeWidth="0.4"
                      strokeOpacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isCenter ? 8 : isMember ? 6 : 4.5}
                    fill={isCenter ? '#030712' : '#080e21'}
                    stroke={node.color || '#00f5d4'}
                    strokeWidth={isHovered ? 1.5 : 1}
                    filter={isHovered ? 'url(#glow)' : undefined}
                    className="transition-all duration-300 group-hover:scale-110"
                  />

                  {/* Inner Accent Fill */}
                  <circle
                    r={isCenter ? 6.5 : isMember ? 4.5 : 3.5}
                    fill={node.color || '#00f5d4'}
                    fillOpacity={isCenter ? 0.25 : 0.15}
                  />

                  {/* Node Icon / Symbol */}
                  {isCenter ? (
                    <text
                      textAnchor="middle"
                      dy="1.5"
                      fill="#00f5d4"
                      fontSize="3.8"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ⚡
                    </text>
                  ) : isMember ? (
                    <text
                      textAnchor="middle"
                      dy="1.2"
                      fill="#ffffff"
                      fontSize="3"
                      fontFamily="sans-serif"
                    >
                      {node.label.charAt(0)}
                    </text>
                  ) : (
                    <text
                      textAnchor="middle"
                      dy="1"
                      fill={node.color || '#38bdf8'}
                      fontSize="2.2"
                      fontFamily="monospace"
                    >
                      ★
                    </text>
                  )}

                  {/* Label under node */}
                  <text
                    textAnchor="middle"
                    y={isCenter ? 12 : isMember ? 9.5 : 7.5}
                    fill={isHovered ? '#00f5d4' : '#e2e8f0'}
                    fontSize={isCenter ? 2.8 : 2.2}
                    fontFamily="monospace"
                    fontWeight={isCenter || isMember ? 'bold' : 'normal'}
                  >
                    {node.label}
                  </text>

                  {/* Role Subtext if member */}
                  {node.role && (
                    <text
                      textAnchor="middle"
                      y={12.2}
                      fill="#94a3b8"
                      fontSize="1.7"
                      fontFamily="monospace"
                    >
                      {node.role}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Details Panel */}
          {activeNode && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-3 rounded-xl bg-cyber-card/95 border border-cyber-cyan/40 backdrop-blur-xl shadow-cyan-glow text-xs font-mono text-slate-200">
              <span className="text-[10px] text-cyber-cyan block font-bold uppercase">
                ACTIVE NODE INSPECTOR
              </span>
              <p className="font-bold text-white text-sm">
                {networkData.nodes.find(n => n.id === activeNode)?.label}
              </p>
              {networkData.nodes.find(n => n.id === activeNode)?.role && (
                <p className="text-cyber-violet">
                  {networkData.nodes.find(n => n.id === activeNode)?.role}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Subtext */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Aarav (ML) ↔ Rohan (Backend) ↔ Kavya (Environment) ↔ Ananya (UX)</span>
          </div>
          <span className="text-cyber-emerald font-semibold">Zero Redundancy • 100% Interdisciplinary</span>
        </div>
      </div>
    </div>
  );
};
