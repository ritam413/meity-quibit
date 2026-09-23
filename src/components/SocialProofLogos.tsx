import React from 'react';

export const SocialProofLogos: React.FC = () => {
  const partners = [
    { name: 'MeitY India', tag: 'SANCTIONING BODY' },
    { name: 'C-DAC PARAM-Rudra', tag: 'HPC CLUSTER' },
    { name: 'University of Calcutta', tag: 'PI INSTITUTION' },
    { name: 'Qiskit Aer', tag: 'QUANTUM SIMULATOR' },
    { name: 'BQSKit LBNL', tag: 'UNITARY SYNTHESIS' },
    { name: 'IEEE Quantum', tag: 'STANDARDS' },
    { name: 'National Quantum Mission', tag: 'NQM ECOSYSTEM' },
  ];

  return (
    <section id="integrations" className="py-12 border-y border-[#cecac8]/60 bg-[#f6f3f1]">
      <div className="max-w-[1432px] mx-auto px-6 sm:px-12">
        <div className="text-center mb-6">
          <span className="font-content text-xs uppercase tracking-widest text-[#797776] font-semibold">
            SUPPORTED BY RESEARCH & HIGH-PERFORMANCE COMPUTING INFRASTRUCTURE
          </span>
        </div>

        {/* Desaturated Horizontal Partner Strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 hover:opacity-100 transition-opacity">
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="flex items-center gap-2 font-subheading text-base font-bold tracking-tight text-[#4e4d4d] hover:text-[#242424] transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#cecac8]" />
              <span>{partner.name}</span>
              <span className="font-content text-[10px] text-[#797776] border border-[#cecac8] px-2 py-0.5 rounded-full font-semibold">
                {partner.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
