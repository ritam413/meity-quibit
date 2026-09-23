import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-[#000000] text-[#f6f3f1] py-2 px-4 sm:px-8 border-b border-[#242424] text-xs font-content flex items-center justify-between z-50">
      <div className="flex-1 flex items-center justify-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#242424] text-[#a7fccd] text-[11px] font-semibold border border-[#333333]">
          MEITY SANCTION NO: 4(6)/2026-ITEA
        </span>
        <span className="tracking-normal text-[#f6f3f1]">
          MeitY Rudra-QEC Appliance: C-DAC PARAM-Rudra Quantum-HPC Node Online | PI: Prof. Amlan Chakrabarti
        </span>
        <a
          href="#platform"
          className="inline-flex items-center gap-1 text-[#a0b5eb] hover:text-[#f6f3f1] underline underline-offset-4 transition-colors font-medium ml-1"
        >
          Research Docs <ArrowRight className="w-3 h-3 inline" />
        </a>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close notification"
        className="text-[#797776] hover:text-[#f6f3f1] p-1 rounded transition-colors ml-2 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
