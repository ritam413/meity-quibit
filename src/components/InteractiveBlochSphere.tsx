import React, { useMemo, useState } from 'react';

interface InteractiveBlochSphereProps {
  gammaT1: number;
  lambdaT2: number;
  blochVector: { x: number; y: number; z: number };
  purity: number;
  fidelity: number;
}

export const InteractiveBlochSphere: React.FC<InteractiveBlochSphereProps> = ({
  gammaT1,
  lambdaT2,
  blochVector,
  purity,
  fidelity,
}) => {
  // Center of the 2D projected sphere
  const cx = 160;
  const cy = 115;
  const radius = 80;

  // 3D to 2D isometric/oblique projection
  const project3D = (x: number, y: number, z: number) => {
    const angleX = (215 * Math.PI) / 180;
    const angleY = (-25 * Math.PI) / 180;
    const scaleX = 0.52;
    const scaleY = 0.52;

    const px = cx + x * radius * scaleX * Math.cos(angleX) + y * radius * scaleY * Math.cos(angleY);
    const py = cy - z * radius - x * radius * scaleX * Math.sin(angleX) - y * radius * scaleY * Math.sin(angleY);
    return { px, py };
  };

  // Compute end point of current live Bloch vector
  const { px: tipX, py: tipY } = project3D(blochVector.x, blochVector.y, blochVector.z);
  
  // Projection on the XY equatorial plane (z = 0)
  const { px: projXY_X, py: projXY_Y } = project3D(blochVector.x, blochVector.y, 0);

  // Compute dynamic decoherence trajectory spiral points based on gammaT1 and lambdaT2
  const trajectoryPath = useMemo(() => {
    const steps = 48;
    const points: { px: number; py: number }[] = [];

    // Starting state |+> at t=0: x=1, y=0, z=0
    for (let i = 0; i <= steps; i++) {
      const tNorm = i / steps;
      const currentGamma = gammaT1 * tNorm;
      const currentLambda = lambdaT2 * tNorm;

      // Larmor precession angle (2.5 revolutions) + transverse decay
      const theta = tNorm * Math.PI * 5;
      const rTransverse = (1 - currentGamma) * (1 - currentLambda);
      const x = rTransverse * Math.cos(theta);
      const y = rTransverse * Math.sin(theta);
      const z = currentGamma; // Relaxes towards |0> (z = +1)

      points.push(project3D(x, y, z));
    }

    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.px.toFixed(1)} ${pt.py.toFixed(1)}` : `${acc} L ${pt.px.toFixed(1)} ${pt.py.toFixed(1)}`;
    }, '');
  }, [gammaT1, lambdaT2]);

  // Points for principal axes
  const pZPlus = project3D(0, 0, 1.28);
  const pZMinus = project3D(0, 0, -1.28);
  const pXPlus = project3D(1.35, 0, 0);
  const pYPlus = project3D(0, 1.35, 0);

  const blochLength = Math.hypot(blochVector.x, blochVector.y, blochVector.z);
  const purityStatus = purity > 0.95 ? 'Pure State' : purity > 0.7 ? 'Partially Mixed' : 'Mixed / Decohered';
  const purityBadgeColor = purity > 0.95 ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]' : purity > 0.7 ? 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]' : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#cecac8] bg-[#f7f4ee] p-3.5 shadow-xs select-none">
      
      {/* Header HUD */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#2b59d1] animate-pulse" />
          <span className="text-[11px] font-mono-ui uppercase font-bold text-[#242424]">
            Superconducting Bloch Sphere (T₁ & T₂*)
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono-ui text-[10px]">
          <span className={`px-2 py-0.5 rounded-full font-bold border ${purityBadgeColor}`}>
            {purityStatus}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#242424] text-[#a7fccd] font-bold shadow-xs">
            Purity: {purity.toFixed(3)}
          </span>
        </div>
      </div>

      {/* SVG Volumetric Bloch Sphere */}
      <div className="relative flex items-center justify-center py-1">
        <svg viewBox="0 0 320 230" className="w-full h-auto max-h-[210px] overflow-visible">
          <defs>
            {/* Volumetric Radial Gradient */}
            <radialGradient id="sphere-volumetric-fill" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#f0ece6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ded7cc" stopOpacity="0.75" />
            </radialGradient>

            {/* Equatorial Plane Gradient */}
            <linearGradient id="equator-plane-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2b59d1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#a0b5eb" stopOpacity="0.04" />
            </linearGradient>

            {/* Arrow Marker for Bloch Vector */}
            <marker
              id="bloch-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
            </marker>

            {/* Axis Arrow Marker */}
            <marker
              id="axis-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#797776" />
            </marker>

            {/* Vector Tip Glow */}
            <filter id="vector-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sphere Volumetric Glass Disc Base */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="url(#sphere-volumetric-fill)"
            stroke="#cecac8"
            strokeWidth="1.5"
            className="shadow-inner"
          />

          {/* Equatorial Plane Disc (Z = 0) */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={radius}
            ry={radius * 0.36}
            fill="url(#equator-plane-fill)"
            stroke="#2b59d1"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.75"
          />

          {/* Prime Meridian (X-Z plane) */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={radius * 0.36}
            ry={radius}
            fill="none"
            stroke="#cecac8"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />

          {/* Coordinate Axes */}
          {/* Z Axis (Polar: |0⟩ to |1⟩) */}
          <line
            x1={cx}
            y1={pZMinus.py}
            x2={cx}
            y2={pZPlus.py}
            stroke="#4e4d4d"
            strokeWidth="1.8"
            markerEnd="url(#axis-arrow)"
          />
          {/* X Axis */}
          <line
            x1={cx}
            y1={cy}
            x2={pXPlus.px}
            y2={pXPlus.py}
            stroke="#4e4d4d"
            strokeWidth="1.5"
            markerEnd="url(#axis-arrow)"
          />
          {/* Y Axis */}
          <line
            x1={cx}
            y1={cy}
            x2={pYPlus.px}
            y2={pYPlus.py}
            stroke="#4e4d4d"
            strokeWidth="1.5"
            markerEnd="url(#axis-arrow)"
          />

          {/* Coordinate Pole Labels */}
          <text
            x={cx}
            y={pZPlus.py - 6}
            textAnchor="middle"
            fill="#242424"
            fontSize="10.5"
            fontWeight="bold"
            fontFamily="monospace"
          >
            |0⟩ (+Z)
          </text>
          <text
            x={cx}
            y={pZMinus.py + 14}
            textAnchor="middle"
            fill="#242424"
            fontSize="10.5"
            fontWeight="bold"
            fontFamily="monospace"
          >
            |1⟩ (-Z)
          </text>
          <text
            x={pXPlus.px - 8}
            y={pXPlus.py + 13}
            textAnchor="middle"
            fill="#4e4d4d"
            fontSize="9.5"
            fontWeight="600"
            fontFamily="monospace"
          >
            +X (|+⟩)
          </text>
          <text
            x={pYPlus.px + 10}
            y={pYPlus.py + 11}
            textAnchor="middle"
            fill="#4e4d4d"
            fontSize="9.5"
            fontWeight="600"
            fontFamily="monospace"
          >
            +Y (|i⟩)
          </text>

          {/* Dynamic Decoherence Trajectory Spiral with Animated Dash Flow */}
          <path
            d={trajectoryPath}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.2"
            opacity="0.8"
            className="bloch-spiral-animated transition-all duration-300"
          />

          {/* Drop-projection shadow from tip down to XY equatorial plane */}
          <line
            x1={tipX}
            y1={tipY}
            x2={projXY_X}
            y2={projXY_Y}
            stroke="#60a5fa"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.8"
          />
          <circle
            cx={projXY_X}
            cy={projXY_Y}
            r="2.5"
            fill="#3b82f6"
            opacity="0.7"
          />

          {/* Live Bloch State Vector line */}
          <line
            x1={cx}
            y1={cy}
            x2={tipX}
            y2={tipY}
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            markerEnd="url(#bloch-arrow)"
            className="transition-all duration-200"
          />

          {/* Pulsing halo around the state vector tip */}
          <circle
            cx={tipX}
            cy={tipY}
            r="6"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            className="bloch-tip-halo"
          />

          {/* Vector Tip Core Dot */}
          <circle
            cx={tipX}
            cy={tipY}
            r="4.5"
            fill="#60a5fa"
            stroke="#1d4ed8"
            strokeWidth="2"
            filter="url(#vector-tip-glow)"
            className="transition-all duration-150"
          />

          {/* Center Origin Dot */}
          <circle cx={cx} cy={cy} r="3.5" fill="#242424" stroke="#ffffff" strokeWidth="1" />

          {/* Dynamic State Vector Label Badge */}
          <g className="transition-all duration-150">
            <rect
              x={tipX + (tipX > cx ? 8 : -46)}
              y={tipY - 14}
              width="38"
              height="14"
              rx="7"
              fill="#242424"
              opacity="0.9"
            />
            <text
              x={tipX + (tipX > cx ? 27 : -27)}
              y={tipY - 4}
              textAnchor="middle"
              fill="#a7fccd"
              fontSize="8.5"
              fontWeight="bold"
              fontFamily="monospace"
            >
              |ψ(t)⟩
            </text>
          </g>
        </svg>
      </div>

      {/* Real-time Telemetry Status Strip */}
      <div className="text-[11px] font-mono-ui px-2.5 py-1.5 rounded-xl bg-white border border-[#cecac8] grid grid-cols-4 gap-1 text-center shadow-2xs mt-1">
        <div>
          <span className="text-[#797776] block text-[9.5px]">rx (T₂*)</span>
          <span className="font-bold text-[#242424]">{blochVector.x.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-[#797776] block text-[9.5px]">rz (T₁)</span>
          <span className="font-bold text-[#242424]">{blochVector.z.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-[#797776] block text-[9.5px]">RADIUS |r|</span>
          <span className="font-bold text-[#2b59d1]">{blochLength.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-[#797776] block text-[9.5px]">FIDELITY F</span>
          <span className="font-bold text-[#15803d]">{(fidelity * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
