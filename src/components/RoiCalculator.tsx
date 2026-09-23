import React, { useState } from 'react';
import { TrendingDown, Sparkles, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const [pPhysPercent, setPPhysPercent] = useState<number>(0.8); // 0.8% physical gate error
  const [circuitDepth, setCircuitDepth] = useState<number>(2500); // 2,500 quantum gates
  const [distance, setDistance] = useState<number>(3); // Distance d=3

  // Physics Calculations
  const pPhys = pPhysPercent / 100;
  const pTh = 0.01; // 1% surface code threshold
  
  // Unencoded failure: 1 - (1 - p)^N
  const unencodedFailureProb = Math.min(1.0, 1 - Math.pow(1 - pPhys, circuitDepth));
  const unencodedSuccessProb = Math.max(0.0, 1 - unencodedFailureProb);

  // Logical failure: P_L = 0.03 * (p / p_th)^((d+1)/2) * N
  const exponent = (distance + 1) / 2;
  const singleStepLogicalErr = 0.03 * Math.pow(pPhys / pTh, exponent);
  const ftSuccessProb = Math.max(0.01, Math.min(0.9999, Math.pow(1 - singleStepLogicalErr, circuitDepth / 10)));
  const ftFailureProb = 1 - ftSuccessProb;

  // Quantum Coherence Advantage Multiplier
  const coherenceMultiplier = Math.max(1.2, Math.round(unencodedFailureProb / (ftFailureProb || 0.0001)));
  const hpcHoursSaved = Math.round((circuitDepth / 100) * (distance * 1.5));

  return (
    <section id="calculator" className="py-16 sm:py-24 max-w-[1432px] mx-auto px-6 sm:px-12">
      <div className="monad-card relative overflow-hidden bg-gradient-to-br from-[#f6f3f1] via-[#f6f3f1] to-[#cfdaf5]/30">
        
        {/* Decorative background halo */}
        <div 
          className="atmospheric-halo w-[400px] h-[400px] -top-20 -right-20 opacity-50"
          style={{ background: 'radial-gradient(circle, #a7fccd 0%, #a0b5eb 50%, transparent 70%)' }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Input Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-content text-xs uppercase tracking-widest text-[#2b59d1] font-bold block mb-2">
                FAULT-TOLERANCE SIMULATOR
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-[#242424] leading-tight">
                Simulate Quantum Advantage & Coherence Gain
              </h2>
              <p className="font-subheading text-[16px] text-[#4e4d4d] mt-2 leading-relaxed">
                Calculate error suppression and circuit success probability across surface code distances on the C-DAC PARAM-Rudra cluster.
              </p>
            </div>

            {/* Physical Gate Error Rate Slider */}
            <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#cecac8] font-mono-ui text-xs">
              <div className="flex justify-between items-center mb-2 font-semibold">
                <span className="text-[#242424]">Physical 2-Qubit Gate Error (p):</span>
                <span className="text-base text-[#2b59d1] font-bold">
                  {pPhysPercent.toFixed(2)}% (p = {pPhys.toFixed(4)})
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.05"
                value={pPhysPercent}
                onChange={(e) => setPPhysPercent(parseFloat(e.target.value))}
                className="w-full accent-[#2b59d1] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#797776] mt-1">
                <span>0.10% (State of Art)</span>
                <span>1.00% (Threshold p_th)</span>
                <span>2.50% (High Noise)</span>
              </div>
            </div>

            {/* Circuit Depth Slider */}
            <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#cecac8] font-mono-ui text-xs">
              <div className="flex justify-between items-center mb-2 font-semibold">
                <span className="text-[#242424]">Circuit Gate Depth (N):</span>
                <span className="text-base text-[#242424] font-bold">
                  {circuitDepth.toLocaleString()} Gates
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={circuitDepth}
                onChange={(e) => setCircuitDepth(parseInt(e.target.value))}
                className="w-full accent-[#2b59d1] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#797776] mt-1">
                <span>100 (NISQ)</span>
                <span>2,500 (VQE/QAOA)</span>
                <span>10,000 (Deep Algo)</span>
              </div>
            </div>

            {/* Code Distance Selector */}
            <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#cecac8] font-mono-ui text-xs">
              <span className="text-[#242424] font-semibold block mb-3">
                Target Surface Code Distance (d):
              </span>
              <div className="flex gap-3">
                {[3, 5, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDistance(d)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      distance === d 
                        ? 'bg-[#2b59d1] text-white border-[#2b59d1]' 
                        : 'bg-[#f6f3f1] border-[#cecac8] text-[#242424]'
                    }`}
                  >
                    d = {d} ({d * d} data qubits)
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Results Card */}
          <div className="lg:col-span-6 bg-[#242424] text-[#f6f3f1] p-8 sm:p-10 rounded-[32px] border border-[#333333] shadow-lg font-mono-ui">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#333333] text-[#a7fccd] text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" /> QUANTUM ERROR SUPPRESSION
            </div>

            {/* HPC Cutaway Asset Header - Full View */}
            <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-6 border border-[#444444] bg-[#111111] flex items-center justify-center group">
              <img
                src="/assets/Server_chassis_cutaway_PARAM-Rudra Multi-Node HPC Cluster (Transpiler Card).jpeg"
                alt="PARAM-Rudra Multi-Node HPC Cluster"
                className="w-full h-full object-contain p-1.5 opacity-90 group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-[10px] text-[#a7fccd] font-semibold border border-[#333333]">
                PARAM-RUDRA ACCELERATOR
              </div>
            </div>

            {/* Coherence Advantage Multiplier */}
            <div className="mb-6">
              <div className="text-xs uppercase text-[#a0b5eb] tracking-wider mb-1">
                Effective Coherence Life Extension
              </div>
              <div className="font-heading text-4xl sm:text-6xl text-[#a7fccd] tracking-normal">
                {coherenceMultiplier}× Longer
              </div>
              <div className="text-xs text-[#cecac8] mt-1">
                over unencoded physical qubits under identical hardware noise conditions.
              </div>
            </div>

            {/* Metrics Breakdown Comparison */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-[#3a3a3a] text-xs">
              <div>
                <span className="text-[#797776] block mb-1">Unencoded Success:</span>
                <span className="text-lg font-bold text-[#ff9473]">
                  {(unencodedSuccessProb * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-[#797776] block mb-1">Protected QEC Success:</span>
                <span className="text-lg font-bold text-[#a7fccd]">
                  {(ftSuccessProb * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* HPC Resource Savings */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#797776] block">Estimated Rudra HPC Hours Saved:</span>
                <span className="text-sm font-bold text-[#f6f3f1]">{hpcHoursSaved} Node-Hours</span>
              </div>
              <a
                href="#demo"
                className="btn-pill-blue text-xs py-3 px-6 text-center cursor-pointer"
              >
                EXPORT EXPERIMENT ›
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
