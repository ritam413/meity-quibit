import React, { useState } from 'react';
import { 
  Cpu, Layers, ShieldCheck, Zap, Activity, Sliders, 
  RefreshCw, CheckCircle2, TrendingUp, Sparkles, Database, Play
} from 'lucide-react';
import { QEC_CODES, QECCodeEngine } from '../lib/quantum/qecCodes';
import { QuantumPhysicsEngine, C } from '../lib/quantum/quantumPhysics';
import { QEMSuite } from '../lib/quantum/qemAlgorithms';
import { RudraTranspiler, TOPOLOGIES } from '../lib/quantum/rudraTranspiler';
import { QECCodeId, QEMFitMethod, ComplexMatrix2x2 } from '../lib/quantum/types';
import { InteractiveStabilizerLattice } from './InteractiveStabilizerLattice';
import { InteractiveBlochSphere } from './InteractiveBlochSphere';
import { TopologicalPlaquettePlate } from './TopologicalPlaquettePlate';
import { BlochDecoherencePlate } from './BlochDecoherencePlate';

const CODE_BUTTON_CONFIG: Record<QECCodeId, { title: string; subtitle: string }> = {
  bit_flip: { title: '3-Qubit Bit', subtitle: '[[3,1,3]]' },
  phase_flip: { title: '3-Qubit Phase', subtitle: '[[3,1,3]]' },
  shor_9: { title: 'Shor 9Q', subtitle: '[[9,1,3]]' },
  steane_7: { title: 'Steane 7Q', subtitle: '[[7,1,3]]' },
  surface_code: { title: 'Surface', subtitle: 'd=3 (17Q)' }
};

export const BentoGrid: React.FC = () => {
  // Card 1: Stabilizer Decoders State
  const [selectedCode, setSelectedCode] = useState<QECCodeId>('bit_flip');
  const [faultQubit, setFaultQubit] = useState<number>(0);
  const [faultType, setFaultType] = useState<'X' | 'Z'>('X');
  const [card1ViewMode, setCard1ViewMode] = useState<'interactive' | 'schematic'>('interactive');

  // Card 2: Kraus Decoherence State
  const [gammaT1, setGammaT1] = useState<number>(0.15);
  const [lambdaT2, setLambdaT2] = useState<number>(0.10);
  const [card2ViewMode, setCard2ViewMode] = useState<'interactive' | 'schematic'>('interactive');

  // Card 3: ZNE Extrapolator State
  const [fitMethod, setFitMethod] = useState<QEMFitMethod>('richardson');
  const [baseNoise, setBaseNoise] = useState<number>(0.025);

  // Card 4: Rudra Transpiler State
  const [topology, setTopology] = useState<'heavy_hex' | 'grid_2d' | 'linear_chain'>('heavy_hex');
  const [optLevel, setOptLevel] = useState<0 | 1 | 2 | 3>(2);

  // Run Calculations
  const qecSim = QECCodeEngine.simulateFault(selectedCode, faultQubit, faultType);
  const initialRho: ComplexMatrix2x2 = [[C(0.5, 0), C(0.5, 0)], [C(0.5, 0), C(0.5, 0)]]; // |+><+|
  const krausDamping = QuantumPhysicsEngine.applyAmplitudeDamping(initialRho, gammaT1);
  const krausDephasing = QuantumPhysicsEngine.applyPhaseDamping(initialRho, lambdaT2);
  const zneResult = QEMSuite.runZNE(0.85, baseNoise, [1, 2, 3, 5], fitMethod);
  const transpileResult = RudraTranspiler.transpile(28, topology, optLevel);

  return (
    <section id="transforms" className="py-16 sm:py-24 max-w-[1432px] mx-auto px-6 sm:px-12">
      
      {/* Section Header */}
      <div className="mb-14 text-left">
        <span className="font-content text-xs uppercase tracking-widest text-[#2b59d1] font-bold block mb-3">
          QUANTUM ERROR CORRECTION SUITE
        </span>
        <h2 className="font-heading text-[38px] sm:text-[50px] text-[#242424] leading-tight max-w-[760px]">
          Four High-Precision Laboratories Built for Fault-Tolerant Research
        </h2>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ========================================================================= */}
        {/* CARD 1 (Left 6-Columns): Stabilizer Syndrome Decoders                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 monad-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#cfdaf5]/50 flex items-center justify-center text-[#2b59d1]">
                <ShieldCheck className="w-5 h-5" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#f6f3f1] border border-[#cecac8] rounded-xl font-content text-[11px]">
                <button
                  onClick={() => setCard1ViewMode('interactive')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    card1ViewMode === 'interactive' ? 'bg-[#2b59d1] text-white shadow-xs' : 'text-[#797776] hover:text-[#242424]'
                  }`}
                >
                  Live Visualizer
                </button>
                <button
                  onClick={() => setCard1ViewMode('schematic')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    card1ViewMode === 'schematic' ? 'bg-[#2b59d1] text-white shadow-xs' : 'text-[#797776] hover:text-[#242424]'
                  }`}
                >
                  Plate
                </button>
              </div>
            </div>

            <h3 className="font-heading text-2xl text-[#242424] mb-3">
              Stabilizer Syndrome Decoders
            </h3>

            <p className="font-subheading text-[16px] text-[#4e4d4d] leading-relaxed mb-6">
              Interactive parity stabilizer extraction and lookup decoding across 5 quantum code architectures.
            </p>

            {/* Dynamic Visualizer or Schematic View */}
            <div className="mb-6">
              {card1ViewMode === 'interactive' ? (
                <InteractiveStabilizerLattice
                  selectedCode={selectedCode}
                  faultQubit={faultQubit}
                  faultType={faultType}
                  onSelectQubit={(q) => setFaultQubit(q)}
                  syndromeVector={qecSim.syndromeVector}
                  decodedDiagnosis={qecSim.decodedError}
                />
              ) : (
                <TopologicalPlaquettePlate />
              )}
            </div>

            {/* Code Selector Segmented Control Deck */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1 bg-[#ede8e1] border border-[#cecac8] rounded-2xl mb-6 font-mono-ui text-[11px]">
              {(Object.keys(QEC_CODES) as QECCodeId[]).map((codeKey) => {
                const isSelected = selectedCode === codeKey;
                const config = CODE_BUTTON_CONFIG[codeKey];
                return (
                  <button
                    key={codeKey}
                    onClick={() => {
                      setSelectedCode(codeKey);
                      setFaultQubit(0);
                    }}
                    className={`py-2 px-1 rounded-xl font-bold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#2b59d1] text-white shadow-xs'
                        : 'bg-white/80 hover:bg-white text-[#4e4d4d] hover:text-[#242424] border border-[#cecac8]/60'
                    }`}
                  >
                    <span className="text-[11px] leading-tight font-bold">{config.title}</span>
                    <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-[#cfdaf5]' : 'text-[#797776]'}`}>
                      {config.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Simulation Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#cecac8] font-mono-ui text-xs space-y-3 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f0]">
                <span className="font-bold text-[#242424]">{QEC_CODES[selectedCode].name}</span>
                <span className="text-[#2b59d1]">Distance d={QEC_CODES[selectedCode].d}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797776]">Logical State:</span>
                <span className="text-[#242424] font-semibold">{QEC_CODES[selectedCode].logicalZero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797776]">Extracted Syndrome:</span>
                <span className="text-[#15803d] font-bold">({qecSim.syndromeVector})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797776]">Decoded Diagnosis:</span>
                <span className="text-[#b91c1c] font-semibold">{qecSim.decodedError}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797776]">Recovery Applied:</span>
                <span className="text-[#2b59d1] font-semibold">{qecSim.correctionApplied}</span>
              </div>
            </div>
          </div>

          {/* Fault Injection Footer Controls */}
          <div className="pt-4 border-t border-[#cecac8] flex flex-wrap items-center justify-between gap-3 font-mono-ui text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#797776] font-semibold text-[11px]">Fault:</span>
              {(['X', 'Z'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFaultType(t)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer text-[11px] ${
                    faultType === t 
                      ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-2xs' 
                      : 'bg-white text-[#242424] border-[#cecac8] hover:border-[#797776]'
                  }`}
                >
                  {t} (Flip)
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
              <span className="text-[#797776] font-semibold text-[11px] mr-1">Target:</span>
              {Array.from({ length: Math.min(QEC_CODES[selectedCode].n, 9) }, (_, q) => (
                <button
                  key={q}
                  onClick={() => setFaultQubit(q)}
                  className={`w-7 h-7 rounded-lg border font-bold cursor-pointer text-[11px] flex items-center justify-center transition-all ${
                    faultQubit === q 
                      ? 'bg-[#242424] text-white border-[#242424] shadow-2xs' 
                      : 'bg-white text-[#242424] border-[#cecac8] hover:border-[#797776]'
                  }`}
                >
                  {selectedCode === 'surface_code' ? `D${q + 1}` : `Q${q}`}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* CARD 2 (Right 6-Columns): Kraus Superconducting Noise & Bloch Purity      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 monad-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#cfdaf5]/50 flex items-center justify-center text-[#2b59d1]">
                <Activity className="w-5 h-5" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#f6f3f1] border border-[#cecac8] rounded-xl font-mono-ui text-[11px]">
                <button
                  onClick={() => setCard2ViewMode('interactive')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    card2ViewMode === 'interactive' ? 'bg-[#2b59d1] text-white shadow-xs' : 'text-[#797776] hover:text-[#242424]'
                  }`}
                >
                  Live 3D Vector
                </button>
                <button
                  onClick={() => setCard2ViewMode('schematic')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    card2ViewMode === 'schematic' ? 'bg-[#2b59d1] text-white shadow-xs' : 'text-[#797776] hover:text-[#242424]'
                  }`}
                >
                  Plate
                </button>
              </div>
            </div>

            <h3 className="font-heading text-2xl text-[#242424] mb-3">
              Superconducting Noise & Bloch Purity
            </h3>

            <p className="font-subheading text-[16px] text-[#4e4d4d] leading-relaxed mb-6">
              Simulate density matrix evolution under amplitude damping (T1) and pure dephasing (T2*).
            </p>

            {/* Dynamic Visualizer or Schematic View */}
            <div className="mb-6">
              {card2ViewMode === 'interactive' ? (
                <InteractiveBlochSphere
                  gammaT1={gammaT1}
                  lambdaT2={lambdaT2}
                  blochVector={krausDamping.blochVector}
                  purity={krausDamping.purity}
                  fidelity={krausDamping.fidelity}
                />
              ) : (
                <BlochDecoherencePlate />
              )}
            </div>


            {/* Noise Sliders */}
            <div className="space-y-4 mb-6 font-mono-ui text-xs">
              <div className="bg-white p-4 rounded-xl border border-[#cecac8]">
                <div className="flex justify-between mb-1.5 font-semibold">
                  <span>T1 Amplitude Damping (γ = 1 - e^-t/T1):</span>
                  <span className="text-[#2b59d1] font-bold">{(gammaT1 * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={gammaT1}
                  onChange={(e) => setGammaT1(parseFloat(e.target.value))}
                  className="w-full accent-[#2b59d1] cursor-pointer"
                />
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#cecac8]">
                <div className="flex justify-between mb-1.5 font-semibold">
                  <span>T2* Pure Dephasing (λ = 1 - e^-t/T2*):</span>
                  <span className="text-[#2b59d1] font-bold">{(lambdaT2 * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={lambdaT2}
                  onChange={(e) => setLambdaT2(parseFloat(e.target.value))}
                  className="w-full accent-[#2b59d1] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Density Matrix Purity Telemetry */}
          <div className="bg-[#242424] text-[#f6f3f1] p-4 rounded-2xl border border-[#333333] font-mono-ui text-xs grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[#797776] block mb-1">STATE PURITY</span>
              <span className="text-sm font-bold text-[#a7fccd]">
                {krausDamping.purity.toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-[#797776] block mb-1">BLOCH |r|</span>
              <span className="text-sm font-bold text-[#a0b5eb]">
                {Math.hypot(krausDamping.blochVector.x, krausDamping.blochVector.z).toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-[#797776] block mb-1">FIDELITY F</span>
              <span className="text-sm font-bold text-[#ff9473]">
                {(krausDamping.fidelity * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3 (Left 6-Columns): Zero-Noise Extrapolation (ZNE) Studio            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 monad-card flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#cfdaf5]/50 flex items-center justify-center text-[#2b59d1] mb-6">
              <TrendingUp className="w-5 h-5" />
            </div>

            <h3 className="font-heading text-2xl text-[#242424] mb-3">
              Zero-Noise Extrapolation (ZNE)
            </h3>

            <p className="font-subheading text-[16px] text-[#4e4d4d] leading-relaxed mb-6">
              Mitigate expectation values using unitary folding and Richardson Lagrange polynomial weights.
            </p>

            {/* Fit Method Selector Segmented Deck */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ede8e1] border border-[#cecac8] rounded-2xl mb-6 font-mono-ui text-[11px]">
              {[
                { id: 'richardson', label: 'Richardson', sub: 'Polynomial' },
                { id: 'linear', label: 'Linear', sub: 'O(λ) First-Order' },
                { id: 'exponential', label: 'Exp Fit', sub: 'Asymptotic' }
              ].map(method => {
                const isSelected = fitMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setFitMethod(method.id as QEMFitMethod)}
                    className={`py-2 px-1 rounded-xl font-bold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#2b59d1] text-white shadow-xs'
                        : 'bg-white/80 hover:bg-white text-[#4e4d4d] hover:text-[#242424] border border-[#cecac8]/60'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs leading-tight font-bold">{method.label}</span>
                    <span className={`text-[8.5px] sm:text-[9px] mt-0.5 hidden xs:inline ${isSelected ? 'text-[#cfdaf5]' : 'text-[#797776]'}`}>
                      {method.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ZNE Scale Points Table */}
            <div className="bg-white p-4 rounded-2xl border border-[#cecac8] font-mono-ui text-xs mb-6">
              <div className="grid grid-cols-3 text-[#797776] pb-2 border-b border-[#f0f0f0] font-semibold text-[11px]">
                <span>SCALE λ</span>
                <span>FOLDING G(G†G)^k</span>
                <span className="text-right">MEASURED ⟨O⟩</span>
              </div>
              {zneResult.scalePoints.map((pt) => (
                <div key={pt.scaleFactor} className="grid grid-cols-3 py-1.5 text-[#242424] text-[11px]">
                  <span className="font-bold">λ = {pt.scaleFactor}</span>
                  <span>{pt.unitaryFoldingCount} gates</span>
                  <span className="text-right font-semibold text-[#2b59d1]">{pt.measuredExpectation.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mitigated Result Strip */}
          <div className="p-3.5 rounded-2xl bg-[#f6f3f1] border border-[#cecac8] font-mono-ui text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[#797776] block text-[11px]">Unmitigated: <strong>{zneResult.unmitigatedExpectation.toFixed(3)}</strong></span>
              <span className="text-[#15803d] font-bold text-[11px]">Mitigated (λ→0): {zneResult.mitigatedExpectation.toFixed(3)}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#cfdaf5] text-[#2b59d1] font-bold text-[10.5px]">
              +{zneResult.errorSuppressionPercent}% SUPPRESSION
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 4 (Right 6-Columns): C-DAC PARAM-Rudra BQSKit Transpiler             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 monad-card flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#cfdaf5]/50 flex items-center justify-center text-[#2b59d1] mb-6">
              <Cpu className="w-5 h-5" />
            </div>

            <h3 className="font-heading text-2xl text-[#242424] mb-3">
              C-DAC PARAM-Rudra Transpiler
            </h3>

            <p className="font-subheading text-[16px] text-[#4e4d4d] leading-relaxed mb-6">
              Topology-aware routing, BQSKit numerical synthesis, and FragQC wire cutting for Rudra HPC.
            </p>

            {/* Embedded HPC Server Rack Video Loop */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 border border-[#cecac8] bg-[#1a1a1a] group">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-300"
                src="/assets/C-DAC PARAM-Rudra Server Rack Telemetry.mp4"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-[10px] text-[#a7fccd] font-mono-ui border border-[#333333]">
                PARAM-RUDRA TELEMETRY
              </div>
            </div>

            {/* Topology & Opt Level Selectors */}
            <div className="space-y-3 mb-6 font-mono-ui text-xs">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ede8e1] border border-[#cecac8] rounded-2xl">
                {[
                  { id: 'heavy_hex', label: 'Heavy-Hex', sub: '127Q Eagle' },
                  { id: 'grid_2d', label: '2D Grid', sub: '54Q Planar' },
                  { id: 'linear_chain', label: 'Linear', sub: '16Q Chain' }
                ].map(item => {
                  const isSelected = topology === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTopology(item.id as 'heavy_hex' | 'grid_2d' | 'linear_chain')}
                      className={`py-2 px-1 rounded-xl font-bold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#242424] text-white shadow-xs'
                          : 'bg-white/80 hover:bg-white text-[#4e4d4d] hover:text-[#242424] border border-[#cecac8]/60'
                      }`}
                    >
                      <span className="text-[11px] sm:text-xs leading-tight font-bold">{item.label}</span>
                      <span className={`text-[8.5px] sm:text-[9px] mt-0.5 hidden xs:inline ${isSelected ? 'text-[#a7fccd]' : 'text-[#797776]'}`}>
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </div>


              <div className="bg-white p-3 rounded-xl border border-[#cecac8] flex items-center justify-between">
                <span className="font-semibold text-[#797776]">BQSKit Optimization Level:</span>
                <div className="flex gap-1.5">
                  {([0, 1, 2, 3] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setOptLevel(lvl)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        optLevel === lvl 
                          ? 'bg-[#2b59d1] text-white' 
                          : 'bg-[#f6f3f1] text-[#242424] hover:bg-[#cecac8]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transpile Results Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#cecac8] font-mono-ui text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[#797776] block mb-1">GATES</span>
              <span className="text-sm font-bold text-[#242424]">{transpileResult.finalGateCount}</span>
            </div>
            <div>
              <span className="text-[#797776] block mb-1">SWAPS</span>
              <span className="text-sm font-bold text-[#2b59d1]">{transpileResult.swapGateCount}</span>
            </div>
            <div>
              <span className="text-[#797776] block mb-1">DEPTH</span>
              <span className="text-sm font-bold text-[#242424]">{transpileResult.circuitDepth}</span>
            </div>
            <div>
              <span className="text-[#797776] block mb-1">FIDELITY</span>
              <span className="text-sm font-bold text-[#15803d]">{transpileResult.estimatedFidelityPercent}%</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
