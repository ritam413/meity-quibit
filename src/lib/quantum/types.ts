export interface IComplex {
  readonly re: number;
  readonly im: number;
}

export type ComplexMatrix2x2 = [
  [IComplex, IComplex],
  [IComplex, IComplex]
];

export interface IKrausChannelResult {
  readonly channelType: 'amplitude_damping' | 'phase_damping' | 'depolarizing';
  readonly originalDensityMatrix: ComplexMatrix2x2;
  readonly evolvedDensityMatrix: ComplexMatrix2x2;
  readonly purity: number;
  readonly blochVector: { x: number; y: number; z: number };
  readonly fidelity: number;
}

export type QECCodeId = 'bit_flip' | 'phase_flip' | 'shor_9' | 'steane_7' | 'surface_code';

export interface IStabilizerGenerator {
  readonly name: string;
  readonly pauliString: string;
  readonly description: string;
  readonly weight: number;
}

export interface ISyndromeDecodeEntry {
  readonly error: string;
  readonly correction: string;
  readonly targetQubit: number | null;
  readonly operator: 'I' | 'X' | 'Y' | 'Z';
}

export interface IQECCodeDefinition {
  readonly id: QECCodeId;
  readonly name: string;
  readonly n: number;
  readonly k: number;
  readonly d: number;
  readonly description: string;
  readonly logicalZero: string;
  readonly logicalOne: string;
  readonly stabilizers: readonly IStabilizerGenerator[];
  readonly syndromeTable: Record<string, ISyndromeDecodeEntry>;
}

export interface IQECSimulationResult {
  readonly codeId: QECCodeId;
  readonly faultInjected: { targetQubit: number; errorType: 'X' | 'Y' | 'Z' } | null;
  readonly syndromeVector: string;
  readonly decodedError: string;
  readonly correctionApplied: string;
  readonly correctionSuccess: boolean;
  readonly postCorrectionFidelity: number;
  readonly executionTimeUs: number;
}

export type QEMFitMethod = 'richardson' | 'linear' | 'exponential';

export interface IZNEResult {
  readonly idealExpectation: number;
  readonly unmitigatedExpectation: number;
  readonly mitigatedExpectation: number;
  readonly errorSuppressionPercent: number;
  readonly fitMethod: QEMFitMethod;
  readonly scalePoints: readonly { scaleFactor: number; measuredExpectation: number; unitaryFoldingCount: number }[];
  readonly extrapolationCurve: readonly { scale: number; value: number }[];
}

export interface ITopologySpec {
  readonly id: 'heavy_hex' | 'grid_2d' | 'linear_chain';
  readonly name: string;
  readonly qubitCount: number;
  readonly couplingMap: readonly [number, number][];
  readonly avgT1Microseconds: number;
  readonly avgT2Microseconds: number;
  readonly cnotFidelityPercent: number;
}

export interface ITranspileResult {
  readonly topology: ITopologySpec;
  readonly bqskitOptLevel: 0 | 1 | 2 | 3;
  readonly initialGateCount: number;
  readonly finalGateCount: number;
  readonly swapGateCount: number;
  readonly circuitDepth: number;
  readonly estimatedFidelityPercent: number;
  readonly compilationTimeMs: number;
}
