import React, { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Play, Pause, Volume2, VolumeX, Sparkles, Cpu } from 'lucide-react';

interface HeroProps {
  onStartTrial: () => void;
  onViewIntegrations: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartTrial, onViewIntegrations }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-[#121212] text-[#f6f3f1]">

      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/assets/Hero Section.mp4"
        />

        {/* 
          OVERLAY LAYER: 
          Adjust the opacity / color below using either Tailwind `bg-black/30` 
          or explicit style `backgroundColor: 'rgba(0, 0, 0, 0.30)'`
        */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }} 
        />
      </div>

      <div className="max-w-[1432px] mx-auto px-6 sm:px-12 relative z-10 text-center">

        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono-ui text-[#cecac8] shadow-lg mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span className="text-white">MeitY Rudra-QEC Core v2.4 Active</span>
          <span className="text-white/30">|</span>
          <span className="text-[#a0b5eb] font-semibold">C-DAC PARAM-Rudra HPC</span>
        </div>

        {/* Main Editorial Display Headline */}
        <h1 className="font-heading text-[48px] sm:text-[68px] lg:text-[84px] leading-[1.08] text-white max-w-[1080px] mx-auto tracking-normal mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          Fault-Tolerant Quantum Computing,
          <br className="hidden sm:inline" />
          {' '}Made Real
        </h1>

        {/* SubHeading (Caudex) */}
        <p className="font-subheading text-[19px] sm:text-[23px] lg:text-[25px] text-[#f6f3f1] leading-[1.45] max-w-[820px] mx-auto mb-10 font-normal italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Real-time Quantum Error Correction (QEC) and Mitigation (QEM) appliance for superconducting quantum processors, accelerated by the C-DAC PARAM-Rudra HPC server cluster.
        </p>

        {/* Action Buttons & Video Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={onStartTrial}
            className="btn-pill-blue px-8 py-3.5 text-sm tracking-wide shadow-lg cursor-pointer font-content"
          >
            LAUNCH QEC LAB
          </button>
          <button
            onClick={onViewIntegrations}
            className="px-8 py-3.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-md hover:bg-white/10 text-white font-content text-sm font-semibold tracking-wide transition-all cursor-pointer"
          >
            VIEW BENCHMARKS
          </button>

          {/* Video Play/Pause & Audio Toggle Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-lg font-mono-ui text-xs">
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white" />}
            </button>
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-[#a7fccd]" />}
            </button>
          </div>
        </div>

        {/* Trust pill signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-content text-[#a0b5eb] mb-14">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#a7fccd]" /> MeitY Sanction No: 4(6)/2026-ITEA
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#a7fccd]" /> C-DAC PARAM-Rudra HPC Powered
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#a7fccd]" /> PI: Prof. Amlan Chakrabarti (Univ. of Calcutta)
          </span>
        </div>

        {/* Dual Featured Hardware Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[980px] mx-auto text-left">

          {/* Card A: Dilution Refrigerator */}
          <div className="group bg-[#1e1e1e]/90 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-xl hover:border-[#2b59d1] transition-all flex items-center gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative bg-black/40">
              <img
                src="/assets/Quantum_dilution_refrigerator_Dilution Refrigerator Golden ChandelierHero Side Asset.jpeg"
                alt="Dilution Refrigerator Cryostat"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold font-content text-[#a7fccd] tracking-wider uppercase block mb-1">
                MILLIKELVIN CRYOSTAT
              </span>
              <h4 className="font-subheading text-xl text-white font-bold leading-snug">
                Superconducting Cryo-Chamber
              </h4>
              <p className="font-content text-xs text-[#cecac8] mt-1 leading-relaxed">
                Operates at 15 mK to suppress thermal state excitations during stabilizer parity extraction.
              </p>
            </div>
          </div>

          {/* Card B: Transmon Qubit Chip */}
          <div className="group bg-[#1e1e1e]/90 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-xl hover:border-[#2b59d1] transition-all flex items-center gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative bg-black/40">
              <img
                src="/assets/Superconducting Transmon Qubit Chip (Hero Pipeline Asset).jpeg"
                alt="Superconducting Transmon Chip"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold font-content text-[#a7fccd] tracking-wider uppercase block mb-1">
                HARDWARE FABRICATION
              </span>
              <h4 className="font-subheading text-xl text-white font-bold leading-snug">
                127-Qubit Heavy-Hex Lattice
              </h4>
              <p className="font-content text-xs text-[#cecac8] mt-1 leading-relaxed">
                High-coherence transmon qubits with low-cross-talk coplanar waveguide resonators.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
