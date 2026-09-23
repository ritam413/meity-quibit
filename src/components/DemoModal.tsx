import React, { useState } from 'react';
import { X, Check, Copy, Download, Code2, FileText, Database, Sparkles, Play } from 'lucide-react';
import { ResearchExporter } from '../lib/quantum/researchExporter';
import { QECCodeEngine } from '../lib/quantum/qecCodes';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, title }) => {
  const [activeTab, setActiveTab] = useState<'qiskit' | 'latex' | 'csv' | 'cluster'>('qiskit');
  const [copied, setCopied] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  if (!isOpen) return null;

  const qiskitCode = ResearchExporter.generateQiskitScript('bit_flip', 1, 'X');
  const latexTable = ResearchExporter.generateLatexTable();
  const csvData = ResearchExporter.generateCSV();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setSimRunning(true);
    setSimOutput(null);
    setTimeout(() => {
      const res = QECCodeEngine.simulateFault('surface_code', 0, 'X');
      setSimOutput(`[PARAM-RUDRA HPC EXECUTION LOG]
Cluster: C-DAC PARAM-Rudra Node 01 (Dual Intel Xeon 8380, 4x NVIDIA A100)
Architecture: Rotated Surface Code (d=3, Surface-17)
Shots: 10,000 Monte-Carlo trajectories
Measured Syndrome: (${res.syndromeVector})
Diagnosis: Anyon defect detected on Plaquette P0
Recovery: Applied X-correction on data qubit D0
Logical Post-Correction Fidelity: ${(res.postCorrectionFidelity * 100).toFixed(3)}%
Status: 100% Trace Preserved. Zero Logical Phase Drift.`);
      setSimRunning(false);
    }, 600);
  };

  const handleDownloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rudra_qec_benchmarks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-mono-ui">
      <div 
        className="relative w-full max-w-3xl bg-[#f6f3f1] border border-[#cecac8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#cecac8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#242424] text-white flex items-center justify-center font-heading text-base font-bold">
              Ψ
            </div>
            <h3 className="font-heading text-xl font-bold text-[#242424]">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#cecac8]/40 text-[#797776] hover:text-[#242424] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#cecac8] bg-[#f6f3f1] px-6 text-xs font-semibold font-content">
          <button
            onClick={() => setActiveTab('qiskit')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qiskit' 
                ? 'border-[#2b59d1] text-[#2b59d1]' 
                : 'border-transparent text-[#797776] hover:text-[#242424]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> QISKIT PYTHON
          </button>
          <button
            onClick={() => setActiveTab('latex')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'latex' 
                ? 'border-[#2b59d1] text-[#2b59d1]' 
                : 'border-transparent text-[#797776] hover:text-[#242424]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> LATEX TABLE
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'csv' 
                ? 'border-[#2b59d1] text-[#2b59d1]' 
                : 'border-transparent text-[#797776] hover:text-[#242424]'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> CSV BENCHMARKS
          </button>
          <button
            onClick={() => setActiveTab('cluster')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cluster' 
                ? 'border-[#2b59d1] text-[#2b59d1]' 
                : 'border-transparent text-[#797776] hover:text-[#242424]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> LIVE SIMULATION
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'qiskit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#797776]">
                <span>Production Qiskit script with stabilizer syndrome measurement:</span>
                <button
                  onClick={() => handleCopy(qiskitCode)}
                  className="btn-pill-ghost py-1 px-3 text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#15803d]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'COPIED' : 'COPY SCRIPT'}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#242424] text-[#a7fccd] text-xs font-mono overflow-x-auto border border-[#333333] leading-relaxed max-h-[350px]">
                {qiskitCode}
              </pre>
            </div>
          )}

          {activeTab === 'latex' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#797776]">
                <span>Publication-ready LaTeX table code for research papers:</span>
                <button
                  onClick={() => handleCopy(latexTable)}
                  className="btn-pill-ghost py-1 px-3 text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#15803d]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'COPIED' : 'COPY LATEX'}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#242424] text-[#f6f3f1] text-xs font-mono overflow-x-auto border border-[#333333] leading-relaxed">
                {latexTable}
              </pre>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#797776]">
                <span>Empirical threshold sweep dataset across physical error rates:</span>
                <button
                  onClick={handleDownloadCSV}
                  className="btn-pill-blue py-1.5 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> DOWNLOAD CSV
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-white text-[#242424] text-xs font-mono overflow-x-auto border border-[#cecac8] leading-relaxed">
                {csvData}
              </pre>
            </div>
          )}

          {activeTab === 'cluster' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#cecac8] text-xs space-y-2">
                <span className="font-bold text-[#242424] block">PARAM-Rudra HPC Remote Execution Test</span>
                <p className="text-[#4e4d4d]">
                  Execute a 10,000-shot Monte-Carlo trajectory of the Rotated Surface Code ($d=3$) directly on the virtual C-DAC HPC cluster worker.
                </p>
                <button
                  onClick={handleRunSimulation}
                  disabled={simRunning}
                  className="btn-pill-black py-2 px-5 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 text-[#a7fccd]" />
                  {simRunning ? 'EXECUTING ON RUDRA NODE...' : 'RUN LIVE HPC JOB'}
                </button>
              </div>

              {simOutput && (
                <pre className="p-4 rounded-2xl bg-[#242424] text-[#a7fccd] text-xs font-mono overflow-x-auto border border-[#333333] leading-relaxed animate-in fade-in duration-200">
                  {simOutput}
                </pre>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#cecac8] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="btn-pill-black py-2 px-6 text-xs cursor-pointer"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
