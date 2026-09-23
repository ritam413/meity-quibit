import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#242424] text-[#f6f3f1] pt-16 pb-12 border-t border-[#333333] font-content">
      <div className="max-w-[1432px] mx-auto px-6 sm:px-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#333333]">
          
          {/* Brand & Project Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-[#242424] flex items-center justify-center font-heading text-lg font-bold">
                Ψ
              </div>
              <span className="text-xl font-bold tracking-normal font-heading text-white">
                RUDRA-QEC APPLIANCE
              </span>
            </div>
            <p className="text-xs text-[#cecac8] max-w-[400px] leading-relaxed font-content">
              Quantum Error Correction & Mitigation Appliance for Superconducting Quantum Computers using Rudra Server.
            </p>
            <div className="text-[11px] text-[#797776] space-y-1 pt-2">
              <div>MeitY Sanction No: <strong>4(6)/2026-ITEA</strong></div>
              <div>PI: <strong>Prof. Amlan Chakrabarti</strong> (University of Calcutta)</div>
              <div>HPC Infrastructure: <strong>C-DAC PARAM-Rudra Node</strong></div>
            </div>
          </div>

          {/* Column 2: Architectures */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <span className="font-bold text-[#a0b5eb] uppercase tracking-wider block mb-2">
              Architectures
            </span>
            <ul className="space-y-2 text-[#cecac8]">
              <li><a href="#transforms" className="hover:text-white transition-colors">Surface Code (d=3)</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">Steane [[7,1,3]] CSS</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">Shor [[9,1,3]] Code</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">Bit-Flip [[3,1,3]]</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">Phase-Flip [[3,1,3]]</a></li>
            </ul>
          </div>

          {/* Column 3: Algorithms */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <span className="font-bold text-[#a0b5eb] uppercase tracking-wider block mb-2">
              Algorithms
            </span>
            <ul className="space-y-2 text-[#cecac8]">
              <li><a href="#transforms" className="hover:text-white transition-colors">Zero-Noise (ZNE)</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">Richardson Fit</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">Readout Mitigation</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">BQSKit Synthesis</a></li>
              <li><a href="#transforms" className="hover:text-white transition-colors">FragQC Cutting</a></li>
            </ul>
          </div>

          {/* Column 4: Documentation */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <span className="font-bold text-[#a0b5eb] uppercase tracking-wider block mb-2">
              Research Docs
            </span>
            <ul className="space-y-2 text-[#cecac8]">
              <li><a href="#faq" className="hover:text-white transition-colors">01. Problem Statement</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">02. Literature Review</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">03. System Architecture</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">04. Stabilizer Formalism</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">08. Primary Citations</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#797776]">
          <div>
            © 2026 MeitY Rudra-QEC Project. Developed by University of Calcutta & C-DAC.
          </div>
          <div className="flex items-center gap-6">
            <span>Govt. of India Ministry of Electronics and IT</span>
            <span>National Quantum Mission (NQM)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
