import React, { useState } from 'react';

interface CampusNetworkGraphProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const NETWORK_NODES = [
  { id: 'AI / ML', label: 'AI / ML', x: 50, y: 22, color: '#00E5FF', lightColor: '#0284C7' },
  { id: 'CSE', label: 'CSE', x: 22, y: 40, color: '#8B5CF6', lightColor: '#7C3AED' },
  { id: 'BIOTECH', label: 'BIOTECH', x: 78, y: 40, color: '#10B981', lightColor: '#059669' },
  { id: 'DESIGN', label: 'DESIGN', x: 30, y: 75, color: '#EC4899', lightColor: '#DB2777' },
  { id: 'ROBOTICS', label: 'ROBOTICS', x: 70, y: 75, color: '#F59E0B', lightColor: '#D97706' },
  { id: 'ENVIRONMENT', label: 'ENV', x: 50, y: 90, color: '#34D399', lightColor: '#10B981' }
];

const CONNECTIONS = [
  { from: 'AI / ML', to: 'CSE' },
  { from: 'AI / ML', to: 'BIOTECH' },
  { from: 'AI / ML', to: 'DESIGN' },
  { from: 'AI / ML', to: 'ROBOTICS' },
  { from: 'CSE', to: 'DESIGN' },
  { from: 'BIOTECH', to: 'ENVIRONMENT' },
  { from: 'ROBOTICS', to: 'ENVIRONMENT' },
  { from: 'ROBOTICS', to: 'CSE' }
];

export const CampusNetworkGraph: React.FC<CampusNetworkGraphProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col justify-between">
      {/* SVG Connected Topology Graph */}
      <div className="relative w-full h-48 bg-surface-container/40 dark:bg-surface-container/40 rounded-2xl border border-outline-variant overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Connection Lines */}
          {CONNECTIONS.map((conn, idx) => {
            const fromNode = NETWORK_NODES.find(n => n.id === conn.from);
            const toNode = NETWORK_NODES.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const isHighlighted =
              hoveredNode === conn.from ||
              hoveredNode === conn.to ||
              selectedCategory === conn.from ||
              selectedCategory === conn.to;

            return (
              <line
                key={idx}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={isHighlighted ? '#00E5FF' : 'currentColor'}
                strokeOpacity={isHighlighted ? 0.9 : 0.15}
                strokeWidth={isHighlighted ? '1.8' : '1'}
                strokeDasharray={isHighlighted ? 'none' : '3 3'}
                className="transition-all duration-300 text-outline"
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {NETWORK_NODES.map(node => {
          const isSelected = selectedCategory === node.id;
          const isHovered = hoveredNode === node.id;

          return (
            <button
              key={node.id}
              type="button"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => onSelectCategory(isSelected ? 'ALL' : node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[10px] font-headline font-bold transition-all duration-300 shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-space-black dark:text-space-black font-extrabold shadow-cyan-glow scale-110 ring-2 ring-cyan-300'
                  : isHovered
                  ? 'bg-surface-elevated text-on-surface border border-cyan-400/60 scale-105 shadow-sm'
                  : 'bg-surface/90 text-on-surface-variant border border-outline-variant hover:border-cyan-400/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: node.color }} />
              <span>{node.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-3 mt-3 border-t border-outline-variant/40 flex items-center justify-between text-[10px] font-headline text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Active Research Nodes</span>
        </span>
        <button
          onClick={() => onSelectCategory('ALL')}
          className="text-cyan-500 dark:text-cyan-400 hover:underline font-bold"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
};
