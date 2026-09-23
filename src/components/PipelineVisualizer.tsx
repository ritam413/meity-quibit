import React, { useState, useEffect } from 'react';
import { 
  Activity, Play, Pause, RefreshCw, Cpu, Layers, 
  ShieldCheck, Zap, Sparkles, Filter, Database, CheckCircle2
} from 'lucide-react';
import { QECCodeEngine } from '../lib/quantum/qecCodes';
import { QuantumPhysicsEngine, C } from '../lib/quantum/quantumPhysics';
import { ComplexMatrix2x2 } from '../lib/quantum/types';

interface NodeData {
  id: string;
  label: string;
  type: 'qubit' | 'syndrome' | 'calibration' | 'circuit';
  image?: string;
  metrics: {
    coherence: string;
    fidelity: string;
    overhead: string;
  };
  samplePayload: Record<string, any>;
}

export const PipelineVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('logical-state');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeFaultQubit, setActiveFaultQubit] = useState<number>(1);
  const [activeErrorType, setActiveErrorType] = useState<'X' | 'Y' | 'Z'>('X');
  const [liveFidelity, setLiveFidelity] = useState<number>(99.85);
  const [liveSyndromeEps, setLiveSyndromeEps] = useState<number>(48200);

  // Live telemetry pulse
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setLiveSyndromeEps(prev => Math.floor(prev + (Math.random() * 600 - 300)));
      setLiveFidelity(prev => parseFloat(Math.min(99.98, Math.max(99.60, prev + (Math.random() * 0.04 - 0.02))).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const sourceNodes: NodeData[] = [
    {
      id: 'logical-state',
      label: 'LOGICAL |0_L⟩ STATE',
      type: 'qubit',
      image: '/assets/Superconducting Transmon Qubit Chip (Hero Pipeline Asset).jpeg',
      metrics: { coherence: '128.4 μs', fidelity: '99.94%', overhead: '3:1 physical' },
      samplePayload: {
        state: '|0_L⟩ = 1/√2 (|000⟩ + |111⟩)',
        encoding: '3-Qubit Repetition / Shor Concatenation',
        logicalPurity: 1.000,
        subsystem: 'MeitY QEC Core'
      }
    },
    {
      id: 'superconducting-qubits',
      label: 'SUPERCONDUCTING QUBITS',
      type: 'qubit',
      image: '/assets/Superconducting Transmon Qubit Chip (Hero Pipeline Asset).jpeg',
      metrics: { coherence: '85.2 μs', fidelity: '99.28%', overhead: 'Transmon' },
      samplePayload: {
        chip: 'Heavy-Hex 127Q Eagle',
        avgT1: '128.4 μs',
        avgT2: '112.6 μs',
        readoutError: '0.85%'
      }
    },
    {
      id: 'syndrome-ancillae',
      label: 'SYNDROME ANCILLAE',
      type: 'syndrome',
      metrics: { coherence: '110.0 μs', fidelity: '99.70%', overhead: '2 check qubits' },
      samplePayload: {
        stabilizerChecks: ['Z1Z2', 'Z2Z3'],
        parityReadout: 'Fast nondemolition (QND)',
        measurementDuration: '280 ns'
      }
    },
    {
      id: 'calibration-matrix',
      label: 'READOUT CALIBRATION M',
      type: 'calibration',
      metrics: { coherence: 'N/A', fidelity: '+4.2% gain', overhead: 'O(2^n) Invert' },
      samplePayload: {
        confusionMatrix: '[[0.985, 0.015], [0.012, 0.988]]',
        method: 'M^{-1} Unbiased Readout Inversion',
        mitigationStatus: 'Active'
      }
    },
    {
      id: 'raw-circuit',
      label: 'RAW UNITARY CIRCUIT',
      type: 'circuit',
      metrics: { coherence: 'Depth 38', fidelity: '94.20%', overhead: '24 CNOTs' },
      samplePayload: {
        algorithm: 'VQE / QAOA Ansatz',
        rawGateCount: 42,
        uncompiledSwaps: 14,
        targetPlatform: 'PARAM-Rudra HPC'
      }
    }
  ];

  const destNodes: NodeData[] = [
    {
      id: 'fault-tolerant-qubit',
      label: 'FAULT-TOLERANT LOGICAL QUBIT',
      type: 'qubit',
      metrics: { coherence: '850 μs (10x)', fidelity: `${liveFidelity}%`, overhead: 'Protected' },
      samplePayload: {
        postCorrectionState: '|0_L⟩ Stabilized',
        residualInfidelity: '< 0.06%',
        logicalErrorRate: '3.0e-5'
      }
    },
    {
      id: 'rudra-hpc-queue',
      label: 'C-DAC PARAM-RUDRA HPC',
      type: 'circuit',
      metrics: { coherence: '80 Cores', fidelity: '99.9%', overhead: '4x A100 GPU' },
      samplePayload: {
        cluster: 'PARAM-Rudra Quantum Node 01',
        gpuAcceleration: 'Qiskit-Aer-GPU / BQSKit',
        activeJobs: 3
      }
    },
    {
      id: 'qiskit-aer-engine',
      label: 'QISKIT AER & LATEX EXPORTER',
      type: 'calibration',
      metrics: { coherence: '1000 shots', fidelity: 'Verified', overhead: 'Zero-latency' },
      samplePayload: {
        exportTarget: 'Python Qiskit Aer / LaTeX Table',
        shots: 1000,
        validationStatus: 'Passed'
      }
    }
  ];

  const simulation = QECCodeEngine.simulateFault('bit_flip', activeFaultQubit, activeErrorType);

  return (
    <section id="platform" className="py-16 sm:py-24 max-w-[1432px] mx-auto px-6 sm:px-12">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <span className="font-content text-xs uppercase tracking-widest text-[#2b59d1] font-bold block mb-3">
            QEC & QEM APPLIANCE STUDIO
          </span>
          <h2 className="font-heading text-[38px] sm:text-[48px] text-[#242424] leading-tight max-w-[700px]">
            Real-Time Quantum Error Correction Pipeline
          </h2>
        </div>

        {/* Live Simulation Control */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="btn-pill-ghost py-2.5 px-5 text-xs flex items-center gap-2 cursor-pointer bg-white"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 text-[#2b59d1]" /> : <Play className="w-3.5 h-3.5 text-[#2b59d1]" />}
            {isSimulating ? 'PAUSE TELEMETRY' : 'RESUME TELEMETRY'}
          </button>
        </div>
      </div>

      {/* Main Interactive Studio Canvas */}
      <div className="monad-card p-6 sm:p-10 relative overflow-hidden bg-white/80 backdrop-blur-sm">
        
        {/* Top Studio HUD Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#f6f3f1] border border-[#cecac8] mb-10 font-mono-ui text-xs">
          <div>
            <span className="text-[#797776] block mb-1">STABILIZER PARITY RATE</span>
            <span className="text-base font-bold text-[#242424]">{liveSyndromeEps.toLocaleString()} checks/s</span>
          </div>
          <div>
            <span className="text-[#797776] block mb-1">LOGICAL FIDELITY</span>
            <span className="text-base font-bold text-[#2b59d1]">{liveFidelity}%</span>
          </div>
          <div>
            <span className="text-[#797776] block mb-1">DECODER LATENCY</span>
            <span className="text-base font-bold text-[#242424]">{simulation.executionTimeUs} μs</span>
          </div>
          <div>
            <span className="text-[#797776] block mb-1">RUDRA HPC STATUS</span>
            <span className="text-base font-bold text-[#15803d] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block animate-pulse" /> ONLINE (4 NODES)
            </span>
          </div>
        </div>

        {/* 3-Column Pipeline Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Quantum Input Sources */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-mono-ui text-xs uppercase font-bold text-[#797776] mb-3 px-2 flex justify-between">
              <span>QUANTUM INPUT SOURCES</span>
              <span>5 CHANNELS</span>
            </div>

            {sourceNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer font-mono-ui ${
                    isSelected 
                      ? 'bg-[#cfdaf5]/50 border-[#2b59d1] shadow-xs' 
                      : 'bg-[#f6f3f1] border-[#cecac8] hover:border-[#797776]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#242424]">{node.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#cecac8] text-[#2b59d1] font-semibold">
                      {node.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#4e4d4d]">
                    <span>Coh: {node.metrics.coherence}</span>
                    <span>Fid: {node.metrics.fidelity}</span>
                    <span>{node.metrics.overhead}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Central Transformation & Decoder Hub */}
          <div className="lg:col-span-4 space-y-4">
            <div className="font-mono-ui text-xs uppercase font-bold text-[#2b59d1] mb-3 px-2 flex justify-between">
              <span>QEC RECOVERY CORE</span>
              <span>LIVE ACTIVE</span>
            </div>

            {/* Central Transform Card with Video Animation */}
            <div className="p-6 rounded-3xl bg-[#242424] text-[#f6f3f1] border border-[#333333] shadow-md font-mono-ui overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#a7fccd] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#a7fccd]" /> SYNDROME DECODER & QEM
                </span>
                <span className="text-[11px] text-[#a0b5eb]">MeitY v2.4</span>
              </div>

              {/* Embedded Transformation Video Loop */}
              <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-[#444444] bg-[#111111]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-85"
                  src="/assets/Pipeline Transformation Hub Animation.mp4"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] text-[#a7fccd] font-semibold border border-[#333333]">
                  LIVE TOPOLOGY
                </div>
              </div>

              <div className="text-xs space-y-2.5 mb-5 bg-[#1a1a1a] p-3.5 rounded-xl border border-[#2e2e2e]">
                <div className="flex justify-between">
                  <span className="text-[#797776]">Active Architecture:</span>
                  <span className="text-white font-semibold">3-Qubit Bit-Flip [[3,1,3]]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#797776]">Extracted Syndrome:</span>
                  <span className="text-[#a7fccd] font-bold font-mono">S = ({simulation.syndromeVector})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#797776]">Decoded Diagnosis:</span>
                  <span className="text-[#ff9473] font-semibold">{simulation.decodedError}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#797776]">Applied Correction:</span>
                  <span className="text-[#a7fccd] font-semibold">{simulation.correctionApplied}</span>
                </div>
              </div>

              {/* Interactive Fault Injection Controls */}
              <div className="space-y-3 pt-2 border-t border-[#333333]">
                <span className="text-[11px] text-[#cecac8] block font-semibold">
                  INJECT PHYSICAL HARDWARE FAULT:
                </span>
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((q) => (
                    <button
                      key={q}
                      onClick={() => setActiveFaultQubit(q)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeFaultQubit === q 
                          ? 'bg-[#2b59d1] text-white' 
                          : 'bg-[#333333] text-[#cecac8] hover:bg-[#444444]'
                      }`}
                    >
                      Q{q}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {(['X', 'Z'] as const).map((err) => (
                    <button
                      key={err}
                      onClick={() => setActiveErrorType(err)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeErrorType === err 
                          ? 'bg-[#ff9473] text-[#242424]' 
                          : 'bg-[#333333] text-[#cecac8] hover:bg-[#444444]'
                      }`}
                    >
                      {err}-Error ({err === 'X' ? 'Bit-Flip' : 'Phase-Flip'})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Protected Output & Telemetry */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-mono-ui text-xs uppercase font-bold text-[#797776] mb-3 px-2 flex justify-between">
              <span>PROTECTED OUTPUT STREAMS</span>
              <span>HIGH FIDELITY</span>
            </div>

            {destNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer font-mono-ui ${
                    isSelected 
                      ? 'bg-[#cfdaf5]/50 border-[#2b59d1] shadow-xs' 
                      : 'bg-[#f6f3f1] border-[#cecac8] hover:border-[#797776]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#242424]">{node.label}</span>
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#4e4d4d]">
                    <span>{node.metrics.coherence}</span>
                    <span className="text-[#2b59d1] font-bold">{node.metrics.fidelity}</span>
                    <span>{node.metrics.overhead}</span>
                  </div>
                </div>
              );
            })}

            {/* Selected Node State Inspector */}
            <div className="mt-4 p-4 rounded-2xl bg-[#ffffff] border border-[#cecac8] font-mono-ui text-xs">
              <span className="text-[11px] text-[#797776] block mb-2 font-bold uppercase">
                INSPECTED PAYLOAD: {selectedNode}
              </span>
              <pre className="text-[11px] text-[#242424] overflow-x-auto bg-[#f6f3f1] p-3 rounded-xl border border-[#e5e5e5]">
                {JSON.stringify(
                  [...sourceNodes, ...destNodes].find(n => n.id === selectedNode)?.samplePayload || {},
                  null,
                  2
                )}
              </pre>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
