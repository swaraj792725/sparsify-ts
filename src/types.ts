export type SparseVectorData = Record<number, number>;

export interface CSRMatrixData {
  values: number[];
  columnIndices: number[];
  rowPointers: number[];
  rows: number;
  cols: number;
}

export interface COOMatrixData {
  rows: number;
  cols: number;
  entries: Array<{ row: number; col: number; value: number }>;
}

export interface SparsityStats {
  totalElements: number;
  nonZeroElements: number;
  zeroElements: number;
  density: number; // Ratio of non-zero to total elements (0 to 1)
  sparsityRatio: number; // Ratio of zero to total elements (0 to 1)
  memorySavedPercentage: number;
}
