import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Activity, Sparkles, Sliders, Eye } from 'lucide-react';
import { QuantumPhysicsEngine, C } from '../lib/quantum/quantumPhysics';
import { ComplexMatrix2x2 } from '../lib/quantum/types';

interface BlochDecoherencePlateProps {
  initialGamma?: number;
  initialLambda?: number;
}

export const BlochDecoherencePlate: React.FC<BlochDecoherencePlateProps> = () => {
  const [viewSubMode, setViewSubMode] = useState<'animated_lab' | 'cryo_micrograph'>('animated_lab');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeStep, setTimeStep] = useState<number>(0);
  const [selectedInitialState, setSelectedInitialState] = useState<'plus' | 'one' | 'minus_i'>('plus');
  const [plateT1Rate, setPlateT1Rate] = useState<number>(0.25);
  const [plateT2Rate, setPlateT2Rate] = useState<number>(0.35);

  // Time evolution loop (0 to 100 steps)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeStep(prev => (prev >= 100 ? 0 : prev + 1));
    }, 60);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Initial Density Matrix rho_0
  const initialRho: ComplexMatrix2x2 = useMemo(() => {
    if (selectedInitialState === 'plus') {
      // |+><+| = [[0.5, 0.5], [0.5, 0.5]]
      return [[C(0.5, 0), C(0.5, 0)], [C(0.5, 0), C(0.5, 0)]];
    } else if (selectedInitialState === 'one') {
      // |1><1| = [[0, 0], [0, 1]]
      return [[C(0, 0), C(0, 0)], [C(0, 0), C(1, 0)]];
    } else {
      // |-i><-i| = [[0.5, 0.5i], [-0.5i, 0.5]]
      return [[C(0.5, 0), C(0, 0.5)], [C(0, -0.5), C(0.5, 0)]];
    }
  }, [selectedInitialState]);

  // Compute time-dependent damping and dephasing factors
  const tNorm = timeStep / 100;
  const currentGamma = 1 - Math.exp(-tNorm * plateT1Rate * 4);
  const currentLambda = 1 - Math.exp(-tNorm * plateT2Rate * 4);

  // Apply Kraus evolution
  const dampingEvolution = QuantumPhysicsEngine.applyAmplitudeDamping(initialRho, currentGamma);
  const fullEvolution = QuantumPhysicsEngine.applyPhaseDamping(dampingEvolution.evolvedDensityMatrix, currentLambda);

  // Projected 3D coordinates
  const cx = 170;
  const cy = 120;
  const radius = 80;

  const project3D = (x: number, y: number, z: number) => {
    const angleX = (215 * Math.PI) / 180;
    const angleY = (-25 * Math.PI) / 180;
    const scaleX = 0.52;
    const scaleY = 0.52;

    const px = cx + x * radius * scaleX * Math.cos(angleX) + y * radius * scaleY * Math.cos(angleY);
    const py = cy - z * radius - x * radius * scaleX * Math.sin(angleX) - y * radius * scaleY * Math.sin(angleY);
    return { px, py };
  };

  // Trajectory history curve up to current timeStep
  const historyPath = useMemo(() => {
    const points: { px: number; py: number }[] = [];
    const maxSteps = 40;
    const currentSteps = Math.max(1, Math.round(tNorm * maxSteps));

    for (let i = 0; i <= currentSteps; i++) {
      const stepNorm = i / maxSteps;
      const g = 1 - Math.exp(-stepNorm * plateT1Rate * 4);
      const l = 1 - Math.exp(-stepNorm * plateT2Rate * 4);

      // Precession
      const theta = stepNorm * Math.PI * 6;
      let initX = selectedInitialState === 'plus' ? 1 : 0;
      let initY = selectedInitialState === 'minus_i' ? -1 : 0;
      let initZ = selectedInitialState === 'one' ? -1 : 0;

      const rTrans = (1 - g) * (1 - l);
      const x = rTrans * (initX * Math.cos(theta) - initY * Math.sin(theta));
      const y = rTrans * (initX * Math.sin(theta) + initY * Math.cos(theta));
      const z = initZ * (1 - g) + g * (1); // Relaxes towards |0> (z = +1)

      points.push(project3D(x, y, z));
    }

    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.px.toFixed(1)} ${pt.py.toFixed(1)}` : `${acc} L ${pt.px.toFixed(1)} ${pt.py.toFixed(1)}`;
    }, '');
  }, [tNorm, plateT1Rate, plateT2Rate, selectedInitialState]);

  // Current Vector tip
  const { px: tipX, py: tipY } = project3D(
    fullEvolution.blochVector.x,
    fullEvolution.blochVector.y,
    fullEvolution.blochVector.z
  );

  const pZPlus = project3D(0, 0, 1.28);
  const pZMinus = project3D(0, 0, -1.28);
  const pXPlus = project3D(1.35, 0, 0);
  const pYPlus = project3D(0, 1.35, 0);

  // Density matrix elements
  const rho00 = fullEvolution.evolvedDensityMatrix[0][0].re;
  const rho11 = fullEvolution.evolvedDensityMatrix[1][1].re;
  const rho01_mag = Math.hypot(fullEvolution.evolvedDensityMatrix[0][1].re, fullEvolution.evolvedDensityMatrix[0][1].im);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#cecac8] bg-[#f7f4ee] p-4 shadow-xs select-none">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#cecac8]/70">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-white border border-[#cecac8] rounded-xl font-content text-[10px]">
            <button
              onClick={() => setViewSubMode('animated_lab')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewSubMode === 'animated_lab' ? 'bg-[#242424] text-white shadow-2xs' : 'text-[#797776] hover:text-[#242424]'
              }`}
            >
              3D Decoherence Lab
            </button>
            <button
              onClick={() => setViewSubMode('cryo_micrograph')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewSubMode === 'cryo_micrograph' ? 'bg-[#242424] text-white shadow-2xs' : 'text-[#797776] hover:text-[#242424]'
              }`}
            >
              Cryo Trajectory
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-mono-ui text-[#4e4d4d] font-bold">
            Kraus Evolution
          </span>
        </div>

        {/* Playback Controls */}
        {viewSubMode === 'animated_lab' && (
          <div className="flex items-center gap-1.5 font-mono-ui text-[11px]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#cecac8] hover:border-[#242424] text-[#242424] font-bold cursor-pointer transition-all shadow-2xs"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-[#2b59d1]" /> : <Play className="w-3 h-3 text-[#15803d]" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => setTimeStep(0)}
              title="Reset Time Evolution"
              className="p-1.5 rounded-lg bg-white border border-[#cecac8] hover:border-[#242424] text-[#797776] hover:text-[#242424] cursor-pointer transition-all shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Main View */}
      {viewSubMode === 'cryo_micrograph' ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-[#cecac8] bg-white group flex items-center justify-center p-2 shadow-2xs min-h-[260px]">
          <img
            src="/assets/Quantum Bloch Sphere with Decoherence Trajectory (Bento Card 2).jpeg"
            alt="Quantum Bloch Sphere Decoherence Trajectory"
            className="w-full h-auto max-h-[250px] object-contain rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-[10px] text-white font-mono-ui border border-white/10 shadow-xs">
            DECOHERENCE TRAJECTORY (SPECIMEN)
          </div>
        </div>
      ) : (
        <div>
          {/* Initial State Selectors */}
          <div className="flex items-center justify-between gap-2 mb-2 font-mono-ui text-[10px]">
            <div className="flex items-center gap-1">
              <span className="text-[#797776]">Initial State |ψ₀⟩:</span>
              {(['plus', 'one', 'minus_i'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedInitialState(st);
                    setTimeStep(0);
                  }}
                  className={`px-2 py-0.5 rounded-md font-bold border transition-all cursor-pointer ${
                    selectedInitialState === st 
                      ? 'bg-[#2b59d1] text-white border-[#2b59d1] shadow-2xs' 
                      : 'bg-white text-[#242424] border-[#cecac8]'
                  }`}
                >
                  {st === 'plus' ? '|+⟩ (Superposition)' : st === 'one' ? '|1⟩ (Excited)' : '|-i⟩ (Phase)'}
                </button>
              ))}
            </div>

            <span className="text-[#2b59d1] font-bold">t = {(tNorm * 5).toFixed(1)} μs</span>
          </div>

          {/* SVG 3D Animated Bloch Canvas */}
          <div className="relative w-full flex justify-center py-1">
            <svg viewBox="0 0 340 240" className="w-full h-auto max-h-[230px] overflow-visible">
              <defs>
                <radialGradient id="plate-sphere-grad" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#f0ece6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ded7cc" stopOpacity="0.75" />
                </radialGradient>
                <marker
                  id="plate-bloch-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
                </marker>
                <marker
                  id="plate-axis-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#797776" />
                </marker>
              </defs>

              {/* Sphere Background */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="url(#plate-sphere-grad)"
                stroke="#cecac8"
                strokeWidth="1.5"
              />

              {/* Equator & Meridian */}
              <ellipse
                cx={cx}
                cy={cy}
                rx={radius}
                ry={radius * 0.36}
                fill="#2b59d1"
                fillOpacity="0.08"
                stroke="#2b59d1"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx={radius * 0.36}
                ry={radius}
                fill="none"
                stroke="#cecac8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />

              {/* Axes */}
              <line x1={cx} y1={pZMinus.py} x2={cx} y2={pZPlus.py} stroke="#4e4d4d" strokeWidth="1.8" markerEnd="url(#plate-axis-arrow)" />
              <line x1={cx} y1={cy} x2={pXPlus.px} y2={pXPlus.py} stroke="#4e4d4d" strokeWidth="1.5" markerEnd="url(#plate-axis-arrow)" />
              <line x1={cx} y1={cy} x2={pYPlus.px} y2={pYPlus.py} stroke="#4e4d4d" strokeWidth="1.5" markerEnd="url(#plate-axis-arrow)" />

              {/* Pole Labels */}
              <text x={cx} y={pZPlus.py - 6} textAnchor="middle" fill="#242424" fontSize="10.5" fontWeight="bold" fontFamily="monospace">
                |0⟩ (Ground)
              </text>
              <text x={cx} y={pZMinus.py + 14} textAnchor="middle" fill="#242424" fontSize="10.5" fontWeight="bold" fontFamily="monospace">
                |1⟩ (Excited)
              </text>
              <text x={pXPlus.px - 8} y={pXPlus.py + 12} textAnchor="middle" fill="#4e4d4d" fontSize="9.5" fontWeight="600" fontFamily="monospace">
                +X
              </text>
              <text x={pYPlus.px + 10} y={pYPlus.py + 10} textAnchor="middle" fill="#4e4d4d" fontSize="9.5" fontWeight="600" fontFamily="monospace">
                +Y
              </text>

              {/* Live Trajectory Trace */}
              <path
                d={historyPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                opacity="0.85"
                className="transition-all duration-75"
              />

              {/* Active State Vector */}
              <line
                x1={cx}
                y1={cy}
                x2={tipX}
                y2={tipY}
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
                markerEnd="url(#plate-bloch-arrow)"
                className="transition-all duration-75"
              />

              {/* Vector Tip Pulse */}
              <circle
                cx={tipX}
                cy={tipY}
                r="6"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="bloch-tip-halo"
              />
              <circle
                cx={tipX}
                cy={tipY}
                r="4.5"
                fill="#60a5fa"
                stroke="#1d4ed8"
                strokeWidth="2"
              />

              {/* Origin */}
              <circle cx={cx} cy={cy} r="3.5" fill="#242424" />

              {/* State Vector Tag */}
              <g>
                <rect
                  x={tipX + (tipX > cx ? 8 : -46)}
                  y={tipY - 14}
                  width="38"
                  height="14"
                  rx="7"
                  fill="#242424"
                  opacity="0.95"
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

          {/* Density Matrix rho(t) Live Display */}
          <div className="mt-2 pt-2 border-t border-[#cecac8]/70 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-ui text-[10px]">
            {/* 2x2 Matrix */}
            <div className="bg-white p-2.5 rounded-xl border border-[#cecac8] shadow-2xs">
              <span className="text-[#797776] block font-bold mb-1">DENSITY MATRIX ρ(t):</span>
              <div className="grid grid-cols-2 gap-1.5 text-center font-bold text-[#242424]">
                <div className="p-1 rounded bg-[#f6f3f1] border border-[#cecac8]/60">
                  <span className="text-[9px] text-[#797776] block">ρ₀₀ (|0⟩)</span>
                  {rho00.toFixed(3)}
                </div>
                <div className="p-1 rounded bg-[#f6f3f1] border border-[#cecac8]/60 text-[#2b59d1]">
                  <span className="text-[9px] text-[#797776] block">ρ₀₁ (Coherence)</span>
                  {rho01_mag.toFixed(3)}
                </div>
                <div className="p-1 rounded bg-[#f6f3f1] border border-[#cecac8]/60 text-[#2b59d1]">
                  <span className="text-[9px] text-[#797776] block">ρ₁₀</span>
                  {rho01_mag.toFixed(3)}
                </div>
                <div className="p-1 rounded bg-[#f6f3f1] border border-[#cecac8]/60">
                  <span className="text-[9px] text-[#797776] block">ρ₁₁ (|1⟩)</span>
                  {rho11.toFixed(3)}
                </div>
              </div>
            </div>

            {/* Coherence & Purity Status */}
            <div className="bg-white p-2.5 rounded-xl border border-[#cecac8] flex flex-col justify-between shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="text-[#797776]">State Purity Tr(ρ²):</span>
                <span className="font-bold text-[#15803d]">{fullEvolution.purity.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#797776]">Off-Diagonal Coherence:</span>
                <span className="font-bold text-[#2b59d1]">{(rho01_mag * 200).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#f0ece6] h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-[#2b59d1] h-full transition-all duration-100"
                  style={{ width: `${Math.min(100, fullEvolution.purity * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
