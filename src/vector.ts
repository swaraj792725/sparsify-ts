import { SparseVectorData, SparsityStats } from './types.js';

export class SparseVector {
  readonly length: number;
  private readonly data: Map<number, number> = new Map();

  constructor(length: number, initialData?: SparseVectorData | Map<number, number> | number[]) {
    this.length = length;
    if (initialData) {
      if (Array.isArray(initialData)) {
        initialData.forEach((val, idx) => {
          if (val !== 0) this.set(idx, val);
        });
      } else if (initialData instanceof Map) {
        for (const [idx, val] of initialData.entries()) {
          if (val !== 0) this.set(idx, val);
        }
      } else {
        for (const [keyStr, val] of Object.entries(initialData)) {
          const idx = Number(keyStr);
          if (val !== 0) this.set(idx, val);
        }
      }
    }
  }

  get(index: number): number {
    return this.data.get(index) ?? 0;
  }

  set(index: number, value: number): this {
    if (index < 0 || index >= this.length) {
      throw new RangeError(`Index ${index} out of bounds for vector length ${this.length}`);
    }
    if (value === 0) {
      this.data.delete(index);
    } else {
      this.data.set(index, value);
    }
    return this;
  }

  /**
   * Computes the dot product with another sparse vector
   */
  dot(other: SparseVector): number {
    if (this.length !== other.length) {
      throw new Error(`Vector length mismatch: ${this.length} vs ${other.length}`);
    }
    let sum = 0;
    // Iterate over smaller data map for efficiency
    const [smaller, larger] = this.data.size < other.data.size ? [this, other] : [other, this];
    for (const [idx, val] of smaller.data.entries()) {
      sum += val * larger.get(idx);
    }
    return sum;
  }

  /**
   * Computes L2 Norm (Euclidean Length)
   */
  norm(): number {
    let sumSq = 0;
    for (const val of this.data.values()) {
      sumSq += val * val;
    }
    return Math.sqrt(sumSq);
  }

  /**
   * Computes Cosine Similarity with another SparseVector
   */
  cosineSimilarity(other: SparseVector): number {
    const normA = this.norm();
    const normB = other.norm();
    if (normA === 0 || normB === 0) return 0;
    return this.dot(other) / (normA * normB);
  }

  /**
   * Converts to dense array
   */
  toDense(): number[] {
    const arr = new Float64Array(this.length);
    for (const [idx, val] of this.data.entries()) {
      arr[idx] = val;
    }
    return Array.from(arr);
  }

  /**
   * Calculates sparsity and density statistics
   */
  stats(): SparsityStats {
    const nonZeroElements = this.data.size;
    const zeroElements = this.length - nonZeroElements;
    const density = this.length > 0 ? nonZeroElements / this.length : 0;
    const sparsityRatio = 1 - density;
    return {
      totalElements: this.length,
      nonZeroElements,
      zeroElements,
      density,
      sparsityRatio,
      memorySavedPercentage: sparsityRatio * 100,
    };
  }

  /**
   * Returns sparse key-value entries
   */
  entries(): Array<[number, number]> {
    return Array.from(this.data.entries());
  }
}
