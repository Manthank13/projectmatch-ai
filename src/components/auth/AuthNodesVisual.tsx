import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label?: string;
  isPerimeterOnly?: boolean;
}

export const AuthNodesVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#00E5FF', '#8B5CF6', '#10B981', '#38BDF8', '#F59E0B', '#EC4899'];
    const roles = [
      'AI Architect',
      'Designer',
      'Biotech',
      'Full Stack',
      'Robotics',
      'Researcher'
    ];

    // Position the 6 labeled nodes explicitly along perimeter anchors
    const perimeterAnchors = [
      { xRatio: 0.15, yRatio: 0.15, vx: 0.2, vy: 0.1 },
      { xRatio: 0.85, yRatio: 0.15, vx: -0.2, vy: 0.15 },
      { xRatio: 0.1, yRatio: 0.85, vx: 0.15, vy: -0.2 },
      { xRatio: 0.88, yRatio: 0.85, vx: -0.15, vy: -0.15 },
      { xRatio: 0.5, yRatio: 0.08, vx: 0.25, vy: 0.05 },
      { xRatio: 0.5, yRatio: 0.92, vx: -0.2, vy: -0.05 }
    ];

    const nodes: Node[] = [
      ...roles.map((role, i) => {
        const anchor = perimeterAnchors[i];
        return {
          x: width * anchor.xRatio,
          y: height * anchor.yRatio,
          vx: anchor.vx,
          vy: anchor.vy,
          radius: 4.5,
          color: colors[i % colors.length],
          label: role,
          isPerimeterOnly: true
        };
      }),
      // Ambient background particles
      ...Array.from({ length: 14 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 2,
        color: colors[i % colors.length],
        label: undefined,
        isPerimeterOnly: false
      }))
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLightMode = document.documentElement.classList.contains('light');
      const centerX = width / 2;
      const centerY = height / 2;
      const exclusionRadiusX = width * 0.32;
      const exclusionRadiusY = height * 0.28;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * (isLightMode ? 0.18 : 0.25);
            ctx.strokeStyle = isLightMode
              ? `rgba(2, 132, 199, ${alpha})`
              : `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Perimeter bounds
        if (node.x < 15 || node.x > width - 15) node.vx *= -1;
        if (node.y < 15 || node.y > height - 15) node.vy *= -1;

        // Repel labeled nodes away from central headline zone
        if (node.isPerimeterOnly) {
          const dx = node.x - centerX;
          const dy = node.y - centerY;
          const normDist = (dx * dx) / (exclusionRadiusX * exclusionRadiusX) + (dy * dy) / (exclusionRadiusY * exclusionRadiusY);

          if (normDist < 1.0) {
            // Push gently outward
            const angle = Math.atan2(dy, dx);
            node.vx += Math.cos(angle) * 0.08;
            node.vy += Math.sin(angle) * 0.08;
          }
        }

        // Outer halo glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${isLightMode ? '25' : '18'}`;
        ctx.fill();

        // Core node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Perimeter Role Label (rendered clearly without ever overlapping center)
        if (node.label) {
          ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = isLightMode ? '#0F172A' : '#F4F6FB';

          // Position text to not get clipped
          const textX = node.x > width * 0.75 ? node.x - 70 : node.x + 8;
          const textY = node.y < 30 ? node.y + 14 : node.y + 3;

          // Glass pill backdrop for label
          const textWidth = ctx.measureText(node.label).width;
          ctx.fillStyle = isLightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(8, 11, 18, 0.85)';
          ctx.strokeStyle = isLightMode ? 'rgba(15, 23, 42, 0.12)' : 'rgba(0, 229, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(textX - 4, textY - 11, textWidth + 8, 16, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isLightMode ? '#0F172A' : '#F4F6FB';
          ctx.fillText(node.label, textX, textY);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center overflow-hidden rounded-3xl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 text-center p-6 sm:p-8 max-w-sm space-y-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-headline font-bold shadow-cyan-glow">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>SRM INNOVATION GRID</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
          Find your people.<br />
          <span className="gradient-cyan-violet">Build something great.</span>
        </h2>
        <p className="text-xs sm:text-sm font-body text-on-surface-variant leading-relaxed">
          ProjectMatch uses AI to discover complementary teammates across your university for hackathons, research, and startups.
        </p>
      </div>
    </div>
  );
};
