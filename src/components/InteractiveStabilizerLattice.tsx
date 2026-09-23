import React from 'react';
import { QECCodeId } from '../lib/quantum/types';
import { QEC_CODES } from '../lib/quantum/qecCodes';

interface InteractiveStabilizerLatticeProps {
  selectedCode: QECCodeId;
  faultQubit: number;
  faultType: 'X' | 'Z';
  onSelectQubit: (q: number) => void;
  syndromeVector: string;
  decodedDiagnosis: string;
}

export const InteractiveStabilizerLattice: React.FC<InteractiveStabilizerLatticeProps> = ({
  selectedCode,
  faultQubit,
  faultType,
  onSelectQubit,
  syndromeVector,
  decodedDiagnosis,
}) => {
  const code = QEC_CODES[selectedCode];

  // =========================================================================
  // SURFACE CODE (d=3, Surface-17) ROTATED TOPOLOGICAL GRID
  // =========================================================================
  if (selectedCode === 'surface_code') {
    // 9 data qubits in 3x3 diamond rotated geometry (scaled to 420x300 viewBox)
    const dataQubits = [
      { id: 0, label: 'D1', cx: 210, cy: 45 },
      { id: 1, label: 'D2', cx: 135, cy: 105 },
      { id: 2, label: 'D3', cx: 285, cy: 105 },
      { id: 3, label: 'D4', cx: 60, cy: 165 },
      { id: 4, label: 'D5', cx: 210, cy: 165 },
      { id: 5, label: 'D6', cx: 360, cy: 165 },
      { id: 6, label: 'D7', cx: 135, cy: 225 },
      { id: 7, label: 'D8', cx: 285, cy: 225 },
      { id: 8, label: 'D9', cx: 210, cy: 285 },
    ];

    // Plaquettes: 4 bulk diamond checks (2 Z-face red, 2 X-star blue) + 4 boundary checks
    const plaquettes = [
      { 
        id: 'Z1', 
        type: 'Z', 
        points: '135,105 210,45 285,105 210,165', 
        color: '#dc2626', 
        fillColor: '#fee2e2',
        label: 'Z₁', 
        desc: 'Z⊗⁴ Face (D1,D2,D3,D5)',
        qubitIds: [0, 1, 2, 4],
        cx: 210, 
        cy: 105 
      },
      { 
        id: 'X1', 
        type: 'X', 
        points: '60,165 135,105 210,165 135,225', 
        color: '#2563eb', 
        fillColor: '#dbeafe',
        label: 'X₁', 
        desc: 'X⊗⁴ Star (D2,D4,D5,D7)',
        qubitIds: [1, 3, 4, 6],
        cx: 135, 
        cy: 165 
      },
      { 
        id: 'X2', 
        type: 'X', 
        points: '210,165 285,105 360,165 285,225', 
        color: '#2563eb', 
        fillColor: '#dbeafe',
        label: 'X₂', 
        desc: 'X⊗⁴ Star (D3,D5,D6,D8)',
        qubitIds: [2, 4, 5, 7],
        cx: 285, 
        cy: 165 
      },
      { 
        id: 'Z2', 
        type: 'Z', 
        points: '135,225 210,165 285,225 210,285', 
        color: '#dc2626', 
        fillColor: '#fee2e2',
        label: 'Z₂', 
        desc: 'Z⊗⁴ Face (D5,D7,D8,D9)',
        qubitIds: [4, 6, 7, 8],
        cx: 210, 
        cy: 225 
      },
    ];

    // Check which plaquettes detect the injected error
    // X fault on data qubit is detected by adjacent Z-plaquettes
    // Z fault on data qubit is detected by adjacent X-plaquettes
    const isPlaquetteViolated = (p: typeof plaquettes[0]) => {
      if (faultType === 'X' && p.type === 'Z' && p.qubitIds.includes(faultQubit)) return true;
      if (faultType === 'Z' && p.type === 'X' && p.qubitIds.includes(faultQubit)) return true;
      return false;
    };

    const faultyQubitPos = dataQubits[faultQubit] || dataQubits[0];

    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#cecac8] bg-[#f7f4ee] p-3.5 shadow-xs select-none">
        {/* Header HUD */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#2563eb] animate-pulse shrink-0" />
            <span className="text-[11px] font-mono-ui uppercase font-bold text-[#242424] truncate">
              Surface-17 Plaquette Grid (d=3)
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono-ui text-[10px] shrink-0">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8] font-semibold border border-[#bfdbfe]">
              4 X-Plaquettes
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] font-semibold border border-[#fecaca]">
              4 Z-Plaquettes
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#242424] text-white font-bold shadow-xs whitespace-nowrap">
              Syndrome: {syndromeVector}
            </span>
          </div>
        </div>


        {/* Interactive SVG Lattice */}
        <div className="relative w-full flex justify-center py-1">
          <svg viewBox="0 0 420 310" className="w-full h-auto max-h-[250px] overflow-visible">
            <defs>
              <filter id="glow-fault" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker
                id="correction-arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#15803d" />
              </marker>
            </defs>

            {/* Outer Diamond Boundary Frame */}
            <line x1="210" y1="45" x2="60" y2="165" stroke="#cecac8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="210" y1="45" x2="360" y2="165" stroke="#cecac8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="60" y1="165" x2="210" y2="285" stroke="#cecac8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="360" y1="165" x2="210" y2="285" stroke="#cecac8" strokeWidth="2" strokeDasharray="4 4" />

            {/* Internal Entanglement Couplers */}
            <line x1="135" y1="105" x2="285" y2="225" stroke="#b0aba8" strokeWidth="2.5" />
            <line x1="285" y1="105" x2="135" y2="225" stroke="#b0aba8" strokeWidth="2.5" />
            <line x1="60" y1="165" x2="360" y2="165" stroke="#cecac8" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="210" y1="45" x2="210" y2="285" stroke="#cecac8" strokeWidth="1.5" strokeDasharray="2 2" />

            {/* Plaquette Polygons (Z Face / X Star) */}
            {plaquettes.map(p => {
              const violated = isPlaquetteViolated(p);
              return (
                <g key={p.id} className="transition-all duration-300 cursor-default">
                  <polygon
                    points={p.points}
                    fill={violated ? (p.type === 'Z' ? '#ef4444' : '#3b82f6') : (p.type === 'Z' ? '#fee2e2' : '#dbeafe')}
                    fillOpacity={violated ? '0.38' : '0.22'}
                    stroke={violated ? p.color : (p.type === 'Z' ? '#f87171' : '#60a5fa')}
                    strokeWidth={violated ? '3' : '1.5'}
                    strokeDasharray={violated ? '4 2' : 'none'}
                    className={violated ? (p.type === 'Z' ? 'plaquette-active-z' : 'plaquette-active-x') : ''}
                  />

                  {/* Plaquette Core Ancilla / Label */}
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r={violated ? 14 : 11}
                    fill={violated ? p.color : (p.type === 'Z' ? '#fecaca' : '#bfdbfe')}
                    stroke={violated ? '#ffffff' : p.color}
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <text
                    x={p.cx}
                    y={p.cy + 4}
                    textAnchor="middle"
                    fill={violated ? '#ffffff' : p.color}
                    fontSize={violated ? '11' : '10'}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {violated ? (p.type === 'Z' ? '-1' : '-1') : p.label}
                  </text>

                  {/* Dynamic Active Syndrome Badge */}
                  {violated && (
                    <g>
                      <rect
                        x={p.cx - 28}
                        y={p.cy - 22}
                        width="56"
                        height="14"
                        rx="7"
                        fill="#242424"
                        opacity="0.9"
                      />
                      <text
                        x={p.cx}
                        y={p.cy - 12}
                        textAnchor="middle"
                        fill="#a7fccd"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        DEFECT ⨂
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Anyon / Error Propagation Lines */}
            {plaquettes.filter(isPlaquetteViolated).map(p => (
              <line
                key={`err-line-${p.id}`}
                x1={faultyQubitPos.cx}
                y1={faultyQubitPos.cy}
                x2={p.cx}
                y2={p.cy}
                stroke={faultType === 'X' ? '#ef4444' : '#2563eb'}
                strokeWidth="2.5"
                className="syndrome-edge-active"
              />
            ))}

            {/* Data Qubit Nodes */}
            {dataQubits.map(q => {
              const isFaulty = faultQubit === q.id;
              return (
                <g
                  key={q.id}
                  onClick={() => onSelectQubit(q.id)}
                  className="cursor-pointer group"
                >
                  {/* Concentric ripple wave for faulty qubit (SVG centered) */}
                  {isFaulty && (
                    <>
                      <circle
                        cx={q.cx}
                        cy={q.cy}
                        r="24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="qubit-fault-ring"
                      />
                      <circle
                        cx={q.cx}
                        cy={q.cy}
                        r="30"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1"
                        opacity="0.3"
                        className="qubit-fault-ring"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </>
                  )}

                  {/* Outer glow ring on hover */}
                  <circle
                    cx={q.cx}
                    cy={q.cy}
                    r="17"
                    fill="none"
                    stroke={isFaulty ? '#ef4444' : '#2b59d1'}
                    strokeWidth="2"
                    opacity="0"
                    className="group-hover:opacity-60 transition-opacity"
                  />

                  {/* Main Qubit Body */}
                  <circle
                    cx={q.cx}
                    cy={q.cy}
                    r="13"
                    fill={isFaulty ? '#dc2626' : '#242424'}
                    stroke={isFaulty ? '#ffffff' : '#f7f4ee'}
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />

                  {/* Inner Label / Fault Symbol */}
                  <text
                    x={q.cx}
                    y={q.cy + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {isFaulty ? faultType : q.label}
                  </text>

                  {/* Data Qubit Name tag */}
                  <text
                    x={q.cx}
                    y={q.cy + (q.cy > 200 ? 24 : -18)}
                    textAnchor="middle"
                    fill={isFaulty ? '#dc2626' : '#4e4d4d'}
                    fontSize="9.5"
                    fontWeight={isFaulty ? 'bold' : '600'}
                    fontFamily="monospace"
                  >
                    {q.label} {isFaulty ? `(Fault: ${faultType})` : ''}
                  </text>
                </g>
              );
            })}

            {/* Recovery MWPM Arrow */}
            <g className="recovery-arrow">
              <path
                d={`M ${faultyQubitPos.cx} ${faultyQubitPos.cy - 34} L ${faultyQubitPos.cx} ${faultyQubitPos.cy - 16}`}
                stroke="#15803d"
                strokeWidth="2.5"
                markerEnd="url(#correction-arrow)"
              />
            </g>
          </svg>
        </div>

        {/* Real-time Status Diagnostic Strip */}
        <div className="text-[11px] font-mono-ui px-2.5 py-1.5 rounded-xl bg-white border border-[#cecac8] flex items-center justify-between mt-1 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
            <span className="text-[#dc2626] font-bold">
              Active Fault: {faultType} on D{faultQubit + 1}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803d]" />
            <span className="text-[#15803d] font-bold">
              MWPM Diagnosis: {decodedDiagnosis}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LINEAR & CONCATENATED CODE ARCHITECTURES (3-Qubit, Shor 9, Steane 7)
  // =========================================================================
  const totalQubits = code.n;
  const qubits = Array.from({ length: totalQubits }, (_, i) => ({
    id: i,
    label: `Q${i}`,
    cx: totalQubits <= 3 
      ? 80 + i * 130 
      : 38 + i * (344 / (totalQubits - 1)),
    cy: 78,
  }));

  const faultyQubitPos = qubits[Math.min(faultQubit, qubits.length - 1)] || qubits[0];
  const qubitRadius = totalQubits <= 3 ? 20 : 16;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#cecac8] bg-[#f7f4ee] p-3.5 shadow-xs select-none">
      {/* Header HUD with Responsive Text Truncation */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#2b59d1] animate-pulse shrink-0" />
          <span className="text-[11px] font-mono-ui uppercase font-bold text-[#242424] truncate">
            <span className="hidden sm:inline">Interactive </span>
            <span>{code.name.split(' ')[0]}</span>
            <span className="hidden md:inline"> • Parity Extractors</span>
          </span>
        </div>
        <span className="text-[10px] font-mono-ui px-2.5 py-0.5 rounded-full bg-[#242424] text-white font-bold shadow-xs shrink-0 whitespace-nowrap">
          Syndrome: {syndromeVector}
        </span>
      </div>

      {/* Interactive SVG Linear Register */}
      <div className="relative w-full flex justify-center py-1">
        <svg viewBox="0 0 420 165" className="w-full h-auto max-h-[170px] overflow-visible">
          <defs>
            <marker
              id="linear-recovery-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#15803d" />
            </marker>
          </defs>

          {/* Entanglement Bus Spine */}
          <line x1="20" y1="78" x2="400" y2="78" stroke="#cecac8" strokeWidth="3.5" strokeLinecap="round" />

          {/* Parity Stabilizer Measurement Arcs */}
          {totalQubits === 3 && (
            <g>
              {/* S1: Q0-Q1 Parity Arc */}
              <path
                d={`M ${qubits[0].cx} 55 Q ${(qubits[0].cx + qubits[1].cx) / 2} 24 ${qubits[1].cx} 55`}
                fill="none"
                stroke={syndromeVector[0] === '1' ? '#ef4444' : '#2b59d1'}
                strokeWidth={syndromeVector[0] === '1' ? '2.5' : '1.5'}
                strokeDasharray={syndromeVector[0] === '1' ? '4 3' : 'none'}
                className={syndromeVector[0] === '1' ? 'syndrome-edge-active' : ''}
              />
              <rect
                x={(qubits[0].cx + qubits[1].cx) / 2 - 22}
                y="16"
                width="44"
                height="14"
                rx="7"
                fill={syndromeVector[0] === '1' ? '#dc2626' : '#2b59d1'}
              />
              <text
                x={(qubits[0].cx + qubits[1].cx) / 2}
                y="26.5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="monospace"
              >
                S₁: {syndromeVector[0] === '1' ? '-1 (ERR)' : '+1 (OK)'}
              </text>

              {/* S2: Q1-Q2 Parity Arc */}
              <path
                d={`M ${qubits[1].cx} 55 Q ${(qubits[1].cx + qubits[2].cx) / 2} 24 ${qubits[2].cx} 55`}
                fill="none"
                stroke={syndromeVector[1] === '1' ? '#ef4444' : '#2b59d1'}
                strokeWidth={syndromeVector[1] === '1' ? '2.5' : '1.5'}
                strokeDasharray={syndromeVector[1] === '1' ? '4 3' : 'none'}
                className={syndromeVector[1] === '1' ? 'syndrome-edge-active' : ''}
              />
              <rect
                x={(qubits[1].cx + qubits[2].cx) / 2 - 22}
                y="16"
                width="44"
                height="14"
                rx="7"
                fill={syndromeVector[1] === '1' ? '#dc2626' : '#2b59d1'}
              />
              <text
                x={(qubits[1].cx + qubits[2].cx) / 2}
                y="26.5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="monospace"
              >
                S₂: {syndromeVector[1] === '1' ? '-1 (ERR)' : '+1 (OK)'}
              </text>
            </g>
          )}

          {/* Shor 9-Qubit Triplets Grouping Brackets */}
          {totalQubits === 9 && (
            <g>
              {[0, 1, 2].map(blockIdx => {
                const startX = qubits[blockIdx * 3].cx - 12;
                const endX = qubits[blockIdx * 3 + 2].cx + 12;
                return (
                  <g key={`shor-block-${blockIdx}`}>
                    <rect
                      x={startX}
                      y="45"
                      width={endX - startX}
                      height="66"
                      rx="8"
                      fill="#cfdaf5"
                      fillOpacity="0.25"
                      stroke="#a0b5eb"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={(startX + endX) / 2}
                      y="39"
                      textAnchor="middle"
                      fill="#2b59d1"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      GHZ Block {blockIdx + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Qubit Register Nodes with Enhanced Radius */}
          {qubits.map(q => {
            const isFaulty = faultQubit === q.id;
            return (
              <g 
                key={q.id} 
                onClick={() => onSelectQubit(q.id)} 
                className="cursor-pointer group"
              >
                {/* Concentric wave rings without off-screen clipping */}
                {isFaulty && (
                  <>
                    <circle
                      cx={q.cx}
                      cy={q.cy}
                      r={qubitRadius + 8}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="qubit-fault-ring"
                    />
                    <circle
                      cx={q.cx}
                      cy={q.cy}
                      r={qubitRadius + 15}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1"
                      opacity="0.3"
                      className="qubit-fault-ring"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </>
                )}

                {/* Hover ring */}
                <circle
                  cx={q.cx}
                  cy={q.cy}
                  r={qubitRadius + 5}
                  fill="none"
                  stroke="#2b59d1"
                  strokeWidth="2"
                  opacity="0"
                  className="group-hover:opacity-60 transition-opacity"
                />

                {/* Node Body with Increased Radius */}
                <circle
                  cx={q.cx}
                  cy={q.cy}
                  r={qubitRadius}
                  fill={isFaulty ? '#dc2626' : '#242424'}
                  stroke={isFaulty ? '#ffffff' : '#f7f4ee'}
                  strokeWidth="2.5"
                  className="transition-all duration-200 group-hover:scale-110"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />

                {/* Inside Text */}
                <text
                  x={q.cx}
                  y={q.cy + (totalQubits <= 3 ? 4.5 : 4)}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={totalQubits <= 3 ? '12.5' : '11'}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {isFaulty ? faultType : `q${q.id}`}
                </text>

                {/* Label Below Node */}
                <text
                  x={q.cx}
                  y={q.cy + 34}
                  textAnchor="middle"
                  fill={isFaulty ? '#dc2626' : '#4e4d4d'}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight={isFaulty ? 'bold' : '600'}
                >
                  {q.label}
                </text>
              </g>
            );
          })}

          {/* Recovery Indicator Arrow */}
          <g className="recovery-arrow">
            <path
              d={`M ${faultyQubitPos.cx} 40 L ${faultyQubitPos.cx} 52`}
              stroke="#15803d"
              strokeWidth="2.5"
              markerEnd="url(#linear-recovery-arrow)"
            />
          </g>
        </svg>
      </div>


      {/* Real-time Status Diagnostic Strip */}
      <div className="text-[11px] font-mono-ui px-2.5 py-1.5 rounded-xl bg-white border border-[#cecac8] flex items-center justify-between mt-1 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
          <span className="text-[#dc2626] font-bold">
            Injected: {faultType} on Q{faultQubit}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#15803d]" />
          <span className="text-[#15803d] font-bold">
            Diagnosis: {decodedDiagnosis}
          </span>
        </div>
      </div>
    </div>
  );
};
