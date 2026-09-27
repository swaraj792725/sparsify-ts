import { describe, test, expect } from 'vitest';
import { SparseVector, SparseMatrix } from '../src/index.js';

describe('sparsify-ts', () => {
  describe('SparseVector', () => {
    test('handles sparse vector operations, dot product, and cosine similarity', () => {
      const v1 = new SparseVector(1000, { 10: 3, 500: 4 });
      const v2 = new SparseVector(1000, { 10: 2, 500: 1, 999: 10 });

      expect(v1.get(10)).toBe(3);
      expect(v1.get(500)).toBe(4);
      expect(v1.get(0)).toBe(0);

      // Dot product: 3*2 + 4*1 = 10
      expect(v1.dot(v2)).toBe(10);

      // Norms: v1 = sqrt(3^2 + 4^2) = 5
      expect(v1.norm()).toBe(5);

      const stats = v1.stats();
      expect(stats.nonZeroElements).toBe(2);
      expect(stats.totalElements).toBe(1000);
      expect(stats.sparsityRatio).toBe(0.998);
      expect(stats.memorySavedPercentage).toBe(99.8);
    });
  });

  describe('SparseMatrix', () => {
    test('handles CSR encoding and matrix-vector multiplication', () => {
      const mat = SparseMatrix.fromDense([
        [1, 0, 0, 2],
        [0, 0, 3, 0],
        [4, 0, 0, 5],
      ]);

      const csr = mat.toCSR();
      expect(csr.values).toEqual([1, 2, 3, 4, 5]);
      expect(csr.columnIndices).toEqual([0, 3, 2, 0, 3]);
      expect(csr.rowPointers).toEqual([0, 2, 3, 5]);

      const x = new SparseVector(4, [1, 0, 2, 3]);
      const Ax = mat.multiplyVector(x);

      // Row 0: 1*1 + 0 + 0 + 2*3 = 7
      // Row 1: 0 + 0 + 3*2 + 0 = 6
      // Row 2: 4*1 + 0 + 0 + 5*3 = 19
      expect(Ax.toDense()).toEqual([7, 6, 19]);

      const stats = mat.stats();
      expect(stats.nonZeroElements).toBe(5);
      expect(stats.totalElements).toBe(12);
    });
  });
});
