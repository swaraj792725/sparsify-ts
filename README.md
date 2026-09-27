# @swaraj792725/sparsify-ts ⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/swaraj792725/sparsify-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/swaraj792725/sparsify-ts/actions)

> **Ultra-fast, zero-dependency, type-safe sparse matrix & vector computation engine for Node.js & TypeScript.**  
> Inspired by high-efficiency tensor & embedding memory management (`sparsify`).

---

## Features

- ⚡ **Zero External Dependencies**: Ultra-lightweight footprint, high performance.
- 📐 **Sparse Vector Algebra**: Fast sparse dot products, L2 norm, and cosine similarity.
- 🧱 **Compressed Sparse Row (CSR) & COO Formats**: Efficient matrix-vector multiplication (`Ax = b`) and memory encoding.
- 📊 **Sparsity & Memory Analysis**: Real-time measurement of memory saved and non-zero density ratios.
- 🎯 **100% Type-Safe**: Native TypeScript compilation with ESM and CommonJS exports.

---

## Installation

```bash
npm install @swaraj792725/sparsify-ts
```

---

## Quick Start

### Sparse Vector Operations

```typescript
import { SparseVector } from '@swaraj792725/sparsify-ts';

// Create a sparse vector of length 1,000,000 with only 2 non-zero elements
const vecA = new SparseVector(1000000, { 42: 3.5, 999999: 4.2 });
const vecB = new SparseVector(1000000, { 42: 2.0, 999999: 1.0 });

// Ultra-fast sparse dot product (skips zero indices)
const dotProduct = vecA.dot(vecB); // 3.5 * 2.0 + 4.2 * 1.0 = 11.2

// Cosine similarity
const similarity = vecA.cosineSimilarity(vecB);

// Inspect memory optimization stats
const stats = vecA.stats();
console.log(`Memory Saved: ${stats.memorySavedPercentage.toFixed(2)}%`);
// Memory Saved: 99.99%
```

### Sparse Matrix & CSR Encoding

```typescript
import { SparseMatrix, SparseVector } from '@swaraj792725/sparsify-ts';

// Convert dense 2D array to sparse representation
const matrix = SparseMatrix.fromDense([
  [1, 0, 0, 2],
  [0, 0, 3, 0],
  [4, 0, 0, 5],
]);

// Multiply matrix by sparse vector Ax = b
const x = new SparseVector(4, [1, 0, 2, 3]);
const result = matrix.multiplyVector(x);

console.log(result.toDense()); // [7, 6, 19]

// Encode into Compressed Sparse Row (CSR) format
const csr = matrix.toCSR();
console.log(csr.values); // [1, 2, 3, 4, 5]
```

---

## License

[MIT](./LICENSE) © Swaraj Jakanoor / Daylink Ltd
