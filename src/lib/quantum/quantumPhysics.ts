import { IComplex, ComplexMatrix2x2, IKrausChannelResult } from './types';

export class Complex implements IComplex {
  constructor(public readonly re: number = 0, public readonly im: number = 0) {}

  add(c: IComplex): Complex {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  sub(c: IComplex): Complex {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  mul(c: IComplex | number): Complex {
    if (typeof c === 'number') return new Complex(this.re * c, this.im * c);
    return new Complex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re);
  }

  div(c: IComplex | number): Complex {
    if (typeof c === 'number') return new Complex(this.re / c, this.im / c);
    const denom = c.re * c.re + c.im * c.im;
    if (denom === 0) return new Complex(0, 0);
    return new Complex((this.re * c.re + this.im * c.im) / denom, (this.im * c.re - this.re * c.im) / denom);
  }

  conj(): Complex {
    return new Complex(this.re, -this.im);
  }

  abs(): number {
    return Math.hypot(this.re, this.im);
  }

  absSq(): number {
    return this.re * this.re + this.im * this.im;
  }

  phase(): number {
    return Math.atan2(this.im, this.re);
  }

  toString(decimals = 3): string {
    const r = this.re.toFixed(decimals);
    const i = Math.abs(this.im).toFixed(decimals);
    if (Math.abs(this.im) < 1e-5) return `${r}`;
    if (Math.abs(this.re) < 1e-5) return `${this.im < 0 ? '-' : ''}${i}i`;
    return `${r} ${this.im < 0 ? '-' : '+'} ${i}i`;
  }
}

export const C = (re: number, im = 0) => new Complex(re, im);

export class QuantumPhysicsEngine {
  /**
   * Applies Amplitude Damping (T1 relaxation) to a single-qubit density matrix
   */
  static applyAmplitudeDamping(rho: ComplexMatrix2x2, gamma: number): IKrausChannelResult {
    const g = Math.max(0, Math.min(1, gamma));
    const sqrt1g = Math.sqrt(1 - g);
    const sqrtg = Math.sqrt(g);

    // E0 = [[1, 0], [0, sqrt(1-g)]]
    // E1 = [[0, sqrt(g)], [0, 0]]
    // E0 rho E0^\dagger + E1 rho E1^\dagger
    const evolved: ComplexMatrix2x2 = [
      [
        C(rho[0][0].re + g * rho[1][1].re, 0),
        C(rho[0][1].re * sqrt1g, rho[0][1].im * sqrt1g)
      ],
      [
        C(rho[1][0].re * sqrt1g, rho[1][0].im * sqrt1g),
        C(rho[1][1].re * (1 - g), 0)
      ]
    ];

    return QuantumPhysicsEngine.buildChannelResult('amplitude_damping', rho, evolved);
  }

  /**
   * Applies Phase Damping (T2* pure dephasing) to a single-qubit density matrix
   */
  static applyPhaseDamping(rho: ComplexMatrix2x2, lambda: number): IKrausChannelResult {
    const l = Math.max(0, Math.min(1, lambda));
    const factor = Math.sqrt(1 - l);

    const evolved: ComplexMatrix2x2 = [
      [C(rho[0][0].re, 0), C(rho[0][1].re * factor, rho[0][1].im * factor)],
      [C(rho[1][0].re * factor, rho[1][0].im * factor), C(rho[1][1].re, 0)]
    ];

    return QuantumPhysicsEngine.buildChannelResult('phase_damping', rho, evolved);
  }

  /**
   * Applies Depolarizing Channel E(rho) = (1-p)rho + (p/3)(X rho X + Y rho Y + Z rho Z)
   */
  static applyDepolarizing(rho: ComplexMatrix2x2, p: number): IKrausChannelResult {
    const prob = Math.max(0, Math.min(1, p));
    const factor = 1 - (4 / 3) * prob;

    const evolved: ComplexMatrix2x2 = [
      [
        C(0.5 + (rho[0][0].re - 0.5) * factor, 0),
        C(rho[0][1].re * factor, rho[0][1].im * factor)
      ],
      [
        C(rho[1][0].re * factor, rho[1][0].im * factor),
        C(0.5 + (rho[1][1].re - 0.5) * factor, 0)
      ]
    ];

    return QuantumPhysicsEngine.buildChannelResult('depolarizing', rho, evolved);
  }

  static createPureState(theta: number, phi: number): ComplexMatrix2x2 {
    const cosHalf = Math.cos(theta / 2);
    const sinHalf = Math.sin(theta / 2);
    const a0 = C(cosHalf, 0);
    const a1 = new Complex(sinHalf * Math.cos(phi), sinHalf * Math.sin(phi));

    return [
      [C(a0.absSq(), 0), a0.mul(a1.conj())],
      [a1.mul(a0.conj()), C(a1.absSq(), 0)]
    ];
  }

  private static buildChannelResult(
    type: 'amplitude_damping' | 'phase_damping' | 'depolarizing',
    original: ComplexMatrix2x2,
    evolved: ComplexMatrix2x2
  ): IKrausChannelResult {
    // Purity: Tr(rho^2) = rho00^2 + rho11^2 + 2*|rho01|^2
    const purity = evolved[0][0].re * evolved[0][0].re +
      evolved[1][1].re * evolved[1][1].re +
      2 * (evolved[0][1].re * evolved[0][1].re + evolved[0][1].im * evolved[0][1].im);

    // Bloch coordinates: rx = 2 Re(rho01), ry = 2 Im(rho10), rz = rho00 - rho11
    const rx = 2 * evolved[0][1].re;
    const ry = 2 * evolved[1][0].im;
    const rz = evolved[0][0].re - evolved[1][1].re;

    // State fidelity: Tr(original * evolved)
    const fidelity = original[0][0].re * evolved[0][0].re +
      original[1][1].re * evolved[1][1].re +
      2 * (original[0][1].re * evolved[0][1].re + original[0][1].im * evolved[0][1].im);

    return {
      channelType: type,
      originalDensityMatrix: original,
      evolvedDensityMatrix: evolved,
      purity: Math.max(0.5, Math.min(1.0, purity)),
      blochVector: { x: rx, y: ry, z: rz },
      fidelity: Math.max(0, Math.min(1.0, fidelity))
    };
  }
}
