import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What is the objective of the MeitY Rudra-QEC Appliance project?',
      answer: 'Sanctioned under MeitY Order No: 4(6)/2026-ITEA (PI: Prof. Amlan Chakrabarti, University of Calcutta), the project delivers an end-to-end Quantum Error Correction (QEC) and Mitigation (QEM) appliance for superconducting quantum processors powered by the indigenous C-DAC PARAM-Rudra HPC server cluster.'
    },
    {
      question: 'How does the Rotated Surface Code achieve a ~1% fault-tolerance threshold?',
      answer: 'Following Fowler et al. (Phys. Rev. A 86, 032324), the rotated surface code arranges data qubits and syndrome ancillae on a 2D checkerboard grid with weight-4 face checks (Z-plaquettes) and star checks (X-stars). Topological defects are matched via minimum-weight perfect matching (MWPM), enabling error suppression whenever physical gate error is below the ~1% threshold.'
    },
    {
      question: 'How does Zero-Noise Extrapolation (ZNE) operate on NISQ hardware?',
      answer: 'Zero-Noise Extrapolation (Temme et al., 2017) intentionally amplifies circuit noise via unitary gate folding (U -> U(U^dagger U)^n). Expectation values are measured across multiple scale factors (lambda = 1, 2, 3, 5) and extrapolated back to the zero-noise limit (lambda -> 0) using exact Richardson Lagrange polynomial weights.'
    },
    {
      question: 'How does C-DAC PARAM-Rudra accelerate quantum synthesis and transpilation?',
      answer: 'The PARAM-Rudra HPC cluster features dual-socket Intel Xeon Scalable processors and NVIDIA A100 GPUs. It runs BQSKit (Berkeley Quantum Synthesis Toolkit) QSearch A* optimal depth synthesis for small subcircuits and QFAST continuous-space hierarchical compilation, with FragQC circuit wire cutting for distributed execution.'
    },
    {
      question: 'What is the distinction between QEC and QEM in the appliance stack?',
      answer: 'Quantum Error Correction (QEC) actively detects and corrects faults during runtime using redundant physical qubits and stabilizer syndrome measurements. Quantum Error Mitigation (QEM) is software-driven post-processing (such as ZNE and readout matrix inversion) that reduces noise in expectation values without requiring extra logical ancilla overhead.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 max-w-[1432px] mx-auto px-6 sm:px-12 border-t border-[#cecac8]/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Heading */}
        <div className="lg:col-span-5">
          <span className="font-content text-xs uppercase tracking-widest text-[#2b59d1] font-bold block mb-3">
            TECHNICAL DOCUMENTATION
          </span>
          <h2 className="font-heading text-[38px] sm:text-[46px] text-[#242424] leading-tight mb-4">
            Frequently Asked Questions & Formalism
          </h2>
          <p className="font-subheading text-[16px] text-[#4e4d4d] leading-relaxed mb-6">
            Detailed answers regarding stabilizer formalisms, open quantum system Kraus channels, C-DAC Rudra HPC acceleration, and research documentation.
          </p>
          <a
            href="#platform"
            className="btn-pill-ghost text-xs py-2.5 px-6 inline-flex font-content"
          >
            VIEW ARCHITECTURE SPEC ›
          </a>
        </div>

        {/* Right Column: Accordion */}
        <div className="lg:col-span-7 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-[#ffffff] border border-[#cecac8] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-subheading text-base sm:text-lg font-bold text-[#242424]">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-[#f6f3f1] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#cfdaf5]' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-[#242424]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="font-content px-6 pb-6 text-sm sm:text-[15px] text-[#4e4d4d] leading-relaxed border-t border-[#f0f0f0] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
