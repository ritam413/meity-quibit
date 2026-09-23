import React, { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { BentoGrid } from './components/BentoGrid';
import { SocialProofLogos } from './components/SocialProofLogos';
import { RoiCalculator } from './components/RoiCalculator';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';

export const App: React.FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('MeitY Rudra-QEC Interactive Sandbox');

  const handleOpenDemo = () => {
    setModalTitle('MeitY Rudra-QEC Interactive Sandbox & Exporter');
    setDemoModalOpen(true);
  };

  const handleOpenCluster = () => {
    setModalTitle('C-DAC PARAM-Rudra HPC Remote Cluster Console');
    setDemoModalOpen(true);
  };

  const handleViewBenchmarks = () => {
    const el = document.getElementById('transforms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f3f1] text-[#242424] selection:bg-[#cfdaf5] selection:text-[#242424]">
      {/* Top Announcement Strip */}
      <AnnouncementBar />

      {/* Main Editorial Navigation */}
      <Navbar 
        onOpenDemoModal={handleOpenDemo}
        onOpenLoginModal={handleOpenCluster}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Typographic Hero Section */}
        <Hero 
          onStartTrial={handleOpenDemo}
          onViewIntegrations={handleViewBenchmarks}
        />

        {/* Interactive Quantum Data Pipeline Architecture Studio */}
        <PipelineVisualizer />

        {/* 4 Interactive Quantum Laboratories Bento Grid */}
        <BentoGrid />

        {/* Research Partners & Hardware Strip */}
        <SocialProofLogos />

        {/* Quantum Fault-Tolerance & Coherence Advantage Simulator */}
        <RoiCalculator />

        {/* Technical FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Interactive Experiment & Exporter Sandbox Modal */}
      <DemoModal 
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
};

export default App;
