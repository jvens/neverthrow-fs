/**
 * @module @jvens/neverthrow-fs
 *
 * A type-safe wrapper around Node.js fs and fs/promises APIs using neverthrow's Result types.
 *
 * This library provides:
 * - Synchronous fs operations that return `Result<T, FsError>`
 * - Asynchronous fs operations that return `ResultAsync<T, FsError>`
 * - Consistent error handling across all file system operations
 * - Full TypeScript support with accurate type definitions
 *
 * @example
 * ```typescript
 * // Main import (recommended) - imports both sync and async functions
 * import { readFile, readFileSync, writeFile, writeFileSync } from '@jvens/neverthrow-fs';
 *
 * // Or import from specific modules
 * import { readFileSync } from '@jvens/neverthrow-fs/sync';
 * import { readFile } from '@jvens/neverthrow-fs/async';
 *
 * // Synchronous usage
 * const result = readFileSync('/path/to/file.txt', 'utf8');
 * if (result.isOk()) {
 *   console.log(result.value);
 * } else {
 *   console.error(result.error.message);
 * }
 *
 * // Asynchronous usage
 * const asyncResult = await readFile('/path/to/file.txt', 'utf8');
 * asyncResult
 *   .map(content => console.log(content))
 *   .mapErr(error => console.error(error.message));
 * ```
 */

// Re-export everything from sync and async modules
export * from './sync';
export * as sync from './sync';
export * from './async';
export * as async from './async';

// Re-export error types and utilities
export * from './errors';
export type { FsErrorName } from './errors';

// Re-export type definitions
export * from './types';
