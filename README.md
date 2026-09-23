# ⚛️ MONAD Studio | Quantum Error Mitigation & Topological QEC Platform

An interactive, high-performance web platform for **Quantum Error Mitigation (QEM)**, **Topological Quantum Error Correction (QEC)**, and **C-DAC PARAM-Rudra Supercomputing Transpilation**. Built for researchers, engineers, and quantum computing enthusiasts.

---

## 🌟 Key Features

### 1. 🔄 Interactive Topological Lattice (Surface Code)
- Real-time 2D grid simulation of **Data Qubits** and **Syndrome Ancillae** (X-type & Z-type stabilizers).
- Physical fault injection (Bit-flip $X$, Phase-flip $Z$, $Y$, and Measurement errors).
- Automated minimum-weight matching & syndrome decoding with fault-tolerant stabilizers.
- Real-time logical fidelity $\mathcal{F}$ calculations based on physical error rate ($p$).

### 2. 🌐 Interactive Quantum Bloch Sphere
- 3D-projected vector dynamics showing quantum state vectors under decoherence and dephasing ($T_1$ relaxation, $T_2^*$ dephasing).
- Live trajectory tracking, purity computation ($\gamma = \text{Tr}(\rho^2)$), and mixed-state visualization.

### 3. ⚡ C-DAC PARAM-Rudra Quantum Transpilation Engine
- Transpiles open quantum circuits into **PARAM-Rudra HPC multi-node topological topologies**.
- Generates OpenQASM 3.0 & C-DAC Hybrid MPI/C++ kernel source code with coupling map synthesis.
- Hardware-native gate scheduling for superconducting transmon chipsets.

### 4. 📈 Quantum Algorithms & Research Exporter
- Interactive **Richardson Extrapolation (ZNE)** and **Probabilistic Error Cancellation (PEC)** simulators.
- Export research-ready datasets (CSV, JSON, OpenQASM 3.0, and LaTeX summary reports).
- ROI & compute overhead calculator for scaling physical to logical qubits ($N_{\text{logical}} = d^2$).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Quantum Simulation Engine**: Custom TypeScript scientific simulation modules (`src/lib/quantum/*`)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/monad-studio.git
   cd monad-studio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
monad-studio/
├── public/
│   ├── assets/              # High-fidelity visual & video assets
│   ├── favicon.svg          # Quantum brand icon
│   └── icons.svg
├── src/
│   ├── components/          # UI & Interactive Simulator Components
│   │   ├── AnnouncementBar.tsx
│   │   ├── BentoGrid.tsx
│   │   ├── BlochDecoherencePlate.tsx
│   │   ├── DemoModal.tsx
│   │   ├── FaqAccordion.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── InteractiveBlochSphere.tsx
│   │   ├── InteractiveStabilizerLattice.tsx
│   │   ├── Navbar.tsx
│   │   ├── PipelineVisualizer.tsx
│   │   ├── RoiCalculator.tsx
│   │   ├── SocialProofLogos.tsx
│   │   └── TopologicalPlaquettePlate.tsx
│   ├── lib/
│   │   └── quantum/         # Mathematical & Transpilation Library
│   │       ├── qecCodes.ts
│   │       ├── qemAlgorithms.ts
│   │       ├── quantumPhysics.ts
│   │       ├── researchExporter.ts
│   │       ├── rudraTranspiler.ts
│   │       └── types.ts
│   ├── App.tsx              # Main layout
│   ├── main.tsx             # Entry point
│   └── style.css            # Global styling & Tailwind directives
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
