import React, { useState } from 'react';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenDemoModal: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoModal, onOpenLoginModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 w-full bg-[#f6f3f1]/90 backdrop-blur-md z-40 border-b border-[#cecac8]/40 transition-all">
      <div className="max-w-[1432px] mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#242424] text-[#f6f3f1] flex items-center justify-center font-heading text-xl font-bold shadow-xs">
            Ψ
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-normal text-[#242424]">
              RUDRA-QEC
            </span>
            <span className="text-[10px] font-content text-[#797776] -mt-1 tracking-widest font-semibold">
              MeitY QUANTUM APPLIANCE
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-content font-semibold text-[#242424] tracking-wider uppercase">
          <a href="#platform" className="hover:text-[#2b59d1] transition-colors">
            QEC Pipeline
          </a>

          <div className="relative group">
            <button
              onClick={() => toggleDropdown('architectures')}
              className="flex items-center gap-1.5 hover:text-[#2b59d1] transition-colors uppercase tracking-wider cursor-pointer"
            >
              Architectures
              <ChevronDown className="w-3.5 h-3.5 text-[#797776] group-hover:text-[#2b59d1] transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#f6f3f1] border border-[#cecac8] rounded-2xl p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <a href="#transforms" className="block p-2.5 rounded-xl hover:bg-[#cfdaf5]/50 transition-colors">
                <div className="text-xs font-semibold text-[#242424]">Rotated Surface Code (d=3)</div>
                <div className="text-[11px] text-[#4e4d4d] normal-case">Topological face and star stabilizers</div>
              </a>
              <a href="#transforms" className="block p-2.5 rounded-xl hover:bg-[#cfdaf5]/50 transition-colors">
                <div className="text-xs font-semibold text-[#242424]">Steane [[7,1,3]] CSS Code</div>
                <div className="text-[11px] text-[#4e4d4d] normal-case">Transversal Clifford parity gates</div>
              </a>
              <a href="#transforms" className="block p-2.5 rounded-xl hover:bg-[#cfdaf5]/50 transition-colors">
                <div className="text-xs font-semibold text-[#242424]">Shor [[9,1,3]] Concatenated</div>
                <div className="text-[11px] text-[#4e4d4d] normal-case">Arbitrary single-qubit fault correction</div>
              </a>
            </div>
          </div>

          <a href="#transforms" className="hover:text-[#2b59d1] transition-colors">
            Decoders & QEM
          </a>

          <a href="#calculator" className="hover:text-[#2b59d1] transition-colors">
            Threshold Simulator
          </a>

          <a href="#faq" className="hover:text-[#2b59d1] transition-colors">
            Research Docs
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenLoginModal}
            className="btn-pill-ghost py-2.5 px-6 text-xs"
          >
            HPC CLUSTER ›
          </button>
          <button
            onClick={onOpenDemoModal}
            className="btn-pill-blue py-2.5 px-6 text-xs"
          >
            LAUNCH QEC LAB ›
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#242424] p-2 hover:bg-[#cfdaf5]/40 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f6f3f1] border-b border-[#cecac8] px-6 py-6 font-mono-ui space-y-4">
          <a
            href="#platform"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase text-[#242424] hover:text-[#2b59d1] py-2"
          >
            QEC Pipeline
          </a>
          <a
            href="#transforms"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase text-[#242424] hover:text-[#2b59d1] py-2"
          >
            Stabilizer Decoders
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase text-[#242424] hover:text-[#2b59d1] py-2"
          >
            Threshold Simulator
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase text-[#242424] hover:text-[#2b59d1] py-2"
          >
            Research Docs
          </a>
          <div className="pt-4 border-t border-[#cecac8] flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal();
              }}
              className="btn-pill-black w-full justify-center"
            >
              HPC CLUSTER ›
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="btn-pill-blue w-full justify-center"
            >
              LAUNCH QEC LAB ›
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
