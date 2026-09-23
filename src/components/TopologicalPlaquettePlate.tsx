import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Activity, ShieldAlert, Cpu, Eye } from 'lucide-react';

interface PlaquettePlateProps {
  onSelectDataQubit?: (q: number) => void;
}

export const TopologicalPlaquettePlate: React.FC<PlaquettePlateProps> = () => {
  const [activeCycleStage, setActiveCycleStage] = useState<0 | 1 | 2 | 3>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewSubMode, setViewSubMode] = useState<'animated_grid' | 'cryo_micrograph'>('animated_grid');
  const [injectedFault, setInjectedFault] = useState<{ qubitId: number; type: 'X' | 'Z' }>({
    qubitId: 4, // D5 default center
    type: 'X'
  });

  // Cycle through Stabilizer Extraction stages:
  // 0: State Ready / Idle
  // 1: X-Basis Syndrome Extraction (Cobalt Blue Wave)
  // 2: Z-Basis Syndrome Extraction (Ruby Red Wave)
  // 3: MWPM Syndrome Readout & Anyon Annihilation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveCycleStage(prev => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Data qubits (D1..D9) coordinates in 460x360 SVG canvas
  const dataQubits = [
    { id: 0, label: 'D1', cx: 230, cy: 50 },
    { id: 1, label: 'D2', cx: 145, cy: 115 },
    { id: 2, label: 'D3', cx: 315, cy: 115 },
    { id: 3, label: 'D4', cx: 60, cy: 180 },
    { id: 4, label: 'D5', cx: 230, cy: 180 },
    { id: 5, label: 'D6', cx: 400, cy: 180 },
    { id: 6, label: 'D7', cx: 145, cy: 245 },
    { id: 7, label: 'D8', cx: 315, cy: 245 },
    { id: 8, label: 'D9', cx: 230, cy: 310 },
  ];

  // 8 Plaquettes (4 bulk diamond checks + 4 boundary triangular checks)
  const plaquettes = [
    // Top Z-Face 1
    {
      id: 'Z1',
      type: 'Z' as const,
      label: 'Z₁',
      points: '145,115 230,50 315,115 230,180',
      qubitIds: [0, 1, 2, 4],
      cx: 230,
      cy: 115,
      color: '#dc2626',
      fillBase: '#fee2e2'
    },
    // Left X-Star 1
    {
      id: 'X1',
      type: 'X' as const,
      label: 'X₁',
      points: '60,180 145,115 230,180 145,245',
      qubitIds: [1, 3, 4, 6],
      cx: 145,
      cy: 180,
      color: '#2563eb',
      fillBase: '#dbeafe'
    },
    // Right X-Star 2
    {
      id: 'X2',
      type: 'X' as const,
      label: 'X₂',
      points: '230,180 315,115 400,180 315,245',
      qubitIds: [2, 4, 5, 7],
      cx: 315,
      cy: 180,
      color: '#2563eb',
      fillBase: '#dbeafe'
    },
    // Bottom Z-Face 2
    {
      id: 'Z2',
      type: 'Z' as const,
      label: 'Z₂',
      points: '145,245 230,180 315,245 230,310',
      qubitIds: [4, 6, 7, 8],
      cx: 230,
      cy: 245,
      color: '#dc2626',
      fillBase: '#fee2e2'
    },
  ];

  const faultyQubit = dataQubits[injectedFault.qubitId] || dataQubits[4];

  // Plaquette excitation check based on stabilizer physics
  const isPlaquetteExcited = (p: typeof plaquettes[0]) => {
    if (injectedFault.type === 'X' && p.type === 'Z' && p.qubitIds.includes(injectedFault.qubitId)) {
      return true;
    }
    if (injectedFault.type === 'Z' && p.type === 'X' && p.qubitIds.includes(injectedFault.qubitId)) {
      return true;
    }
    return false;
  };

  const excitedPlaquettes = plaquettes.filter(isPlaquetteExcited);

  const stageDescriptions = [
    { title: 'STAGE 1: STATE PREPARATION', desc: 'Ancilla reset to |0⟩ / |+⟩ ground states', color: 'text-[#2b59d1]' },
    { title: 'STAGE 2: X-STABILIZER EXTRACTION', desc: 'Cobalt stars entangle & measure X⊗⁴ parity', color: 'text-[#2563eb]' },
    { title: 'STAGE 3: Z-STABILIZER EXTRACTION', desc: 'Ruby faces entangle & measure Z⊗⁴ parity', color: 'text-[#dc2626]' },
    { title: 'STAGE 4: SYNDROME DECODING & MWPM', desc: 'Anyon defects paired & corrected in real-time', color: 'text-[#15803d]' },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#cecac8] bg-[#f7f4ee] p-4 shadow-xs select-none">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#cecac8]/70">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-white border border-[#cecac8] rounded-xl font-content text-[10px]">
            <button
              onClick={() => setViewSubMode('animated_grid')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewSubMode === 'animated_grid' ? 'bg-[#242424] text-white shadow-2xs' : 'text-[#797776] hover:text-[#242424]'
              }`}
            >
              Animated Lattice
            </button>
            <button
              onClick={() => setViewSubMode('cryo_micrograph')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewSubMode === 'cryo_micrograph' ? 'bg-[#242424] text-white shadow-2xs' : 'text-[#797776] hover:text-[#242424]'
              }`}
            >
              Cryo Micrograph
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-mono-ui text-[#4e4d4d] font-bold">
            Distance-3 (Surface-17)
          </span>
        </div>

        {/* Cycle Playback Controls */}
        {viewSubMode === 'animated_grid' && (
          <div className="flex items-center gap-1.5 font-mono-ui text-[11px]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#cecac8] hover:border-[#242424] text-[#242424] font-bold cursor-pointer transition-all shadow-2xs"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-[#2b59d1]" /> : <Play className="w-3 h-3 text-[#15803d]" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => setActiveCycleStage(0)}
              title="Reset Stabilizer Cycle"
              className="p-1.5 rounded-lg bg-white border border-[#cecac8] hover:border-[#242424] text-[#797776] hover:text-[#242424] cursor-pointer transition-all shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {viewSubMode === 'cryo_micrograph' ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-[#cecac8] bg-white group flex items-center justify-center p-2 shadow-2xs min-h-[260px]">
          <img
            src="/assets/Rotated Surface Code Topological Lattice (Bento Card 1).jpeg"
            alt="Rotated Surface Code Lattice"
            className="w-full h-auto max-h-[250px] object-contain rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-[10px] text-white font-mono-ui border border-white/10 shadow-xs">
            TOPOLOGICAL PLAQUETTE GRID (MICROGRAPH)
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          {/* Stabilizer Cycle Progress Beads */}
          <div className="grid grid-cols-4 gap-1.5 mb-2.5">
            {[0, 1, 2, 3].map(stage => (
              <button
                key={stage}
                onClick={() => {
                  setActiveCycleStage(stage as 0 | 1 | 2 | 3);
                  setIsPlaying(false);
                }}
                className={`py-1 px-1 rounded-lg text-center font-mono-ui text-[9.5px] font-bold border transition-all cursor-pointer ${
                  activeCycleStage === stage
                    ? 'bg-[#242424] text-white border-[#242424] shadow-xs'
                    : 'bg-white text-[#797776] border-[#cecac8] hover:border-[#797776]'
                }`}
              >
                Stage {stage + 1}
              </button>
            ))}
          </div>

          {/* Canvas SVG Grid */}
          <div className="relative w-full flex justify-center py-1">
            <svg viewBox="0 0 460 360" className="w-full h-auto max-h-[260px] overflow-visible">
              <defs>
                <marker
                  id="plate-recovery-arrow"
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

              {/* Grid Background Diamond Frame */}
              <polygon
                points="230,50 60,180 230,310 400,180"
                fill="#ffffff"
                fillOpacity="0.6"
                stroke="#cecac8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Internal Interconnecting Mesh Lines */}
              <line x1="145" y1="115" x2="315" y2="245" stroke="#b0aba8" strokeWidth="2.5" />
              <line x1="315" y1="115" x2="145" y2="245" stroke="#b0aba8" strokeWidth="2.5" />
              <line x1="60" y1="180" x2="400" y2="180" stroke="#cecac8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="230" y1="50" x2="230" y2="310" stroke="#cecac8" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Plaquette Polygons */}
              {plaquettes.map(p => {
                const excited = isPlaquetteExcited(p);
                const isCycleActive = 
                  (p.type === 'X' && activeCycleStage === 1) ||
                  (p.type === 'Z' && activeCycleStage === 2) ||
                  activeCycleStage === 3;

                return (
                  <g key={`plate-plq-${p.id}`} className="transition-all duration-300">
                    <polygon
                      points={p.points}
                      fill={excited ? (p.type === 'Z' ? '#ef4444' : '#3b82f6') : (p.type === 'Z' ? '#fee2e2' : '#dbeafe')}
                      fillOpacity={excited ? '0.45' : isCycleActive ? '0.28' : '0.15'}
                      stroke={excited ? p.color : (p.type === 'Z' ? '#f87171' : '#60a5fa')}
                      strokeWidth={excited ? '3' : isCycleActive ? '2' : '1.5'}
                      strokeDasharray={excited ? '4 2' : 'none'}
                      className={excited ? (p.type === 'Z' ? 'plaquette-active-z' : 'plaquette-active-x') : ''}
                    />

                    {/* Plaquette Ancilla Hub */}
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r={excited ? 15 : 12}
                      fill={excited ? p.color : (p.type === 'Z' ? '#fecaca' : '#bfdbfe')}
                      stroke={excited ? '#ffffff' : p.color}
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />

                    <text
                      x={p.cx}
                      y={p.cy + 4}
                      textAnchor="middle"
                      fill={excited ? '#ffffff' : p.color}
                      fontSize={excited ? '11' : '10'}
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {excited ? '-1' : p.label}
                    </text>

                    {/* Excited Defect Flag */}
                    {excited && (
                      <g>
                        <rect
                          x={p.cx - 28}
                          y={p.cy - 24}
                          width="56"
                          height="14"
                          rx="7"
                          fill="#242424"
                          opacity="0.95"
                        />
                        <text
                          x={p.cx}
                          y={p.cy - 14}
                          textAnchor="middle"
                          fill="#a7fccd"
                          fontSize="8.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          ANYON ⨂
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Anyon String Lines connecting faulty qubit to excited plaquettes */}
              {excitedPlaquettes.map(p => (
                <line
                  key={`anyon-line-${p.id}`}
                  x1={faultyQubit.cx}
                  y1={faultyQubit.cy}
                  x2={p.cx}
                  y2={p.cy}
                  stroke={injectedFault.type === 'X' ? '#dc2626' : '#2563eb'}
                  strokeWidth="2.5"
                  className="syndrome-edge-active"
                />
              ))}

              {/* Data Qubits D1 to D9 */}
              {dataQubits.map(q => {
                const isFaulty = injectedFault.qubitId === q.id;
                return (
                  <g
                    key={`plate-data-${q.id}`}
                    onClick={() => setInjectedFault({ qubitId: q.id, type: injectedFault.type })}
                    className="cursor-pointer group"
                  >
                    {/* Concentric ripple wave for faulty qubit */}
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
                          r="32"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="1"
                          opacity="0.3"
                          className="qubit-fault-ring"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </>
                    )}

                    {/* Outer hover highlight */}
                    <circle
                      cx={q.cx}
                      cy={q.cy}
                      r="18"
                      fill="none"
                      stroke="#2b59d1"
                      strokeWidth="2"
                      opacity="0"
                      className="group-hover:opacity-60 transition-opacity"
                    />

                    {/* Qubit Body */}
                    <circle
                      cx={q.cx}
                      cy={q.cy}
                      r="13.5"
                      fill={isFaulty ? '#dc2626' : '#242424'}
                      stroke={isFaulty ? '#ffffff' : '#f7f4ee'}
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:scale-110"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />

                    {/* Label */}
                    <text
                      x={q.cx}
                      y={q.cy + 3.5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {isFaulty ? injectedFault.type : q.label}
                    </text>

                    {/* Qubit Tag */}
                    <text
                      x={q.cx}
                      y={q.cy + (q.cy > 220 ? 25 : -18)}
                      textAnchor="middle"
                      fill={isFaulty ? '#dc2626' : '#4e4d4d'}
                      fontSize="9.5"
                      fontWeight={isFaulty ? 'bold' : '600'}
                      fontFamily="monospace"
                    >
                      {q.label}
                    </text>
                  </g>
                );
              })}

              {/* MWPM Correction Line & Arrow */}
              {activeCycleStage === 3 && (
                <g className="recovery-arrow">
                  <path
                    d={`M ${faultyQubit.cx} ${faultyQubit.cy - 36} L ${faultyQubit.cx} ${faultyQubit.cy - 18}`}
                    stroke="#15803d"
                    strokeWidth="3"
                    markerEnd="url(#plate-recovery-arrow)"
                  />
                  <rect
                    x={faultyQubit.cx - 32}
                    y={faultyQubit.cy - 52}
                    width="64"
                    height="14"
                    rx="7"
                    fill="#15803d"
                  />
                  <text
                    x={faultyQubit.cx}
                    y={faultyQubit.cy - 42}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    APPLY {injectedFault.type}†
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Fault & Stage Diagnostic Bar */}
          <div className="mt-2 pt-2 border-t border-[#cecac8]/70 flex flex-wrap items-center justify-between gap-2 font-mono-ui text-[10.5px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#797776]">Inject Error:</span>
              {(['X', 'Z'] as const).map(t => (
                <button
                  key={`inj-btn-${t}`}
                  onClick={() => setInjectedFault({ qubitId: injectedFault.qubitId, type: t })}
                  className={`px-2 py-0.5 rounded-md font-bold border transition-all cursor-pointer ${
                    injectedFault.type === t ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-white text-[#242424] border-[#cecac8]'
                  }`}
                >
                  {t} (Flip)
                </button>
              ))}
              <span className="text-[#4e4d4d] ml-1">on <strong>D{injectedFault.qubitId + 1}</strong></span>
            </div>

            <div className={`font-bold ${stageDescriptions[activeCycleStage].color}`}>
              {stageDescriptions[activeCycleStage].title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
