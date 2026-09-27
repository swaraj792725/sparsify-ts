import { CSRMatrixData, COOMatrixData, SparsityStats } from './types.js';
import { SparseVector } from './vector.js';

export class SparseMatrix {
  readonly rows: number;
  readonly cols: number;
  private readonly data: Map<string, number> = new Map();

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
  }

  static fromDense(dense: number[][]): SparseMatrix {
    const rows = dense.length;
    const cols = dense[0]?.length ?? 0;
    const mat = new SparseMatrix(rows, cols);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = dense[r][c];
        if (val !== 0) {
          mat.set(r, c, val);
        }
      }
    }
    return mat;
  }

  private key(row: number, col: number): string {
    return `${row},${col}`;
  }

  get(row: number, col: number): number {
    return this.data.get(this.key(row, col)) ?? 0;
  }

  set(row: number, col: number, value: number): this {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new RangeError(`Matrix position (${row}, ${col}) out of bounds (${this.rows}x${this.cols})`);
    }
    const k = this.key(row, col);
    if (value === 0) {
      this.data.delete(k);
    } else {
      this.data.set(k, value);
    }
    return this;
  }

  /**
   * Multiplies matrix by a SparseVector (Ax = b)
   */
  multiplyVector(vec: SparseVector): SparseVector {
    if (this.cols !== vec.length) {
      throw new Error(`Dimension mismatch: Matrix cols ${this.cols} vs Vector len ${vec.length}`);
    }
    const result = new SparseVector(this.rows);
    for (const [k, val] of this.data.entries()) {
      const [rStr, cStr] = k.split(',');
      const r = Number(rStr);
      const c = Number(cStr);
      const vecVal = vec.get(c);
      if (vecVal !== 0) {
        result.set(r, result.get(r) + val * vecVal);
      }
    }
    return result;
  }

  /**
   * Encodes matrix into Compressed Sparse Row (CSR) format
   */
  toCSR(): CSRMatrixData {
    const values: number[] = [];
    const columnIndices: number[] = [];
    const rowPointers: number[] = new Array(this.rows + 1).fill(0);

    let count = 0;
    for (let r = 0; r < this.rows; r++) {
      rowPointers[r] = count;
      for (let c = 0; c < this.cols; c++) {
        const val = this.get(r, c);
        if (val !== 0) {
          values.push(val);
          columnIndices.push(c);
          count++;
        }
      }
    }
    rowPointers[this.rows] = count;

    return {
      values,
      columnIndices,
      rowPointers,
      rows: this.rows,
      cols: this.cols,
    };
  }

  /**
   * Calculates statistics on sparsity and memory optimization
   */
  stats(): SparsityStats {
    const totalElements = this.rows * this.cols;
    const nonZeroElements = this.data.size;
    const zeroElements = totalElements - nonZeroElements;
    const density = totalElements > 0 ? nonZeroElements / totalElements : 0;
    const sparsityRatio = 1 - density;

    return {
      totalElements,
      nonZeroElements,
      zeroElements,
      density,
      sparsityRatio,
      memorySavedPercentage: sparsityRatio * 100,
    };
  }
}
