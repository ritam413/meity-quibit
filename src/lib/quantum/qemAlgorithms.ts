import { IZNEResult, QEMFitMethod } from './types';

export class QEMSuite {
  /**
   * Zero-Noise Extrapolation (ZNE) via Unitary Folding
   * Uses Richardson Lagrange weights, linear regression, or exponential decay.
   */
  static runZNE(
    idealExpectation: number = 0.85,
    baseNoise: number = 0.025,
    scaleFactors: number[] = [1, 2, 3, 5],
    fitMethod: QEMFitMethod = 'richardson'
  ): IZNEResult {
    const scalePoints = scaleFactors.map(lambda => {
      const decay = Math.exp(-lambda * baseNoise * 8.5);
      const measured = Math.max(-1, Math.min(1, idealExpectation * decay + (Math.random() - 0.5) * 0.008));
      return {
        scaleFactor: lambda,
        measuredExpectation: measured,
        unitaryFoldingCount: 2 * lambda - 1
      };
    });

    let mitigated = 0;
    const curve: { scale: number; value: number }[] = [];

    if (fitMethod === 'linear') {
      const n = scalePoints.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
      for (const d of scalePoints) {
        sumX += d.scaleFactor;
        sumY += d.measuredExpectation;
        sumXY += d.scaleFactor * d.measuredExpectation;
        sumXX += d.scaleFactor * d.scaleFactor;
      }
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      mitigated = intercept;

      for (let s = 0; s <= 6; s += 0.2) {
        curve.push({ scale: s, value: slope * s + intercept });
      }
    } else if (fitMethod === 'richardson') {
      // Richardson Extrapolation via Lagrange polynomial weights c_j = \prod_{k \neq j} \frac{-\lambda_k}{\lambda_j - \lambda_k}
      const x = scalePoints.map(d => d.scaleFactor);
      const y = scalePoints.map(d => d.measuredExpectation);
      let sum = 0;
      for (let i = 0; i < x.length; i++) {
        let prod = 1;
        for (let j = 0; j < x.length; j++) {
          if (i !== j) {
            prod *= (0 - x[j]) / (x[i] - x[j]);
          }
        }
        sum += y[i] * prod;
      }
      mitigated = sum;

      for (let s = 0; s <= 6; s += 0.2) {
        let curveY = 0;
        for (let i = 0; i < x.length; i++) {
          let prod = 1;
          for (let j = 0; j < x.length; j++) {
            if (i !== j) {
              prod *= (s - x[j]) / (x[i] - x[j]);
            }
          }
          curveY += y[i] * prod;
        }
        curve.push({ scale: s, value: curveY });
      }
    } else {
      // Exponential Fit: ln(y) = ln(A) - B*x
      const valid = scalePoints.filter(d => d.measuredExpectation > 0.001);
      if (valid.length >= 2) {
        const x = valid.map(d => d.scaleFactor);
        const logY = valid.map(d => Math.log(d.measuredExpectation));
        const n = x.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
          sumX += x[i]; sumY += logY[i]; sumXY += x[i] * logY[i]; sumXX += x[i] * x[i];
        }
        const b = -(n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const logA = (sumY + b * sumX) / n;
        const A = Math.exp(logA);
        mitigated = A;

        for (let s = 0; s <= 6; s += 0.2) {
          curve.push({ scale: s, value: A * Math.exp(-b * s) });
        }
      } else {
        mitigated = scalePoints[0].measuredExpectation;
      }
    }

    const unmitigated = scalePoints[0].measuredExpectation;
    const rawError = Math.abs(idealExpectation - unmitigated);
    const mitigatedError = Math.abs(idealExpectation - mitigated);
    const suppression = rawError > 0 ? Math.max(0, Math.min(99, ((rawError - mitigatedError) / rawError) * 100)) : 75;

    return {
      idealExpectation,
      unmitigatedExpectation: unmitigated,
      mitigatedExpectation: mitigated,
      errorSuppressionPercent: Math.round(suppression),
      fitMethod,
      scalePoints,
      extrapolationCurve: curve
    };
  }
}
