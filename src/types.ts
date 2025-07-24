import type { Stats, Dirent, BigIntStats, StatOptions, Dir } from 'node:fs';
import type { FileHandle } from 'node:fs/promises';

/**
 * Re-export common fs types for convenience
 */
export type { Stats, Dirent, BigIntStats, StatOptions, Dir, FileHandle };

/**
 * Options for file reading operations
 */
export interface ReadFileOptions {
  encoding?: BufferEncoding | null;
  flag?: string;
}

/**
 * Options for file writing operations
 */
export interface WriteFileOptions {
  encoding?: BufferEncoding | null;
  mode?: number | string;
  flag?: string;
}

/**
 * Options for appending to files
 */
export interface AppendFileOptions {
  encoding?: BufferEncoding | null;
  mode?: number | string;
  flag?: string;
}

/**
 * Options for creating directories
 */
export interface MkdirOptions {
  recursive?: boolean;
  mode?: number | string;
}

/**
 * Options for removing directories
 */
export interface RmdirOptions {
  recursive?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Options for reading directories
 */
export interface ReaddirOptions {
  encoding?: BufferEncoding | null;
  withFileTypes?: boolean;
}

/**
 * Options for copying files
 */
export interface CopyFileOptions {
  mode?: number;
}

/**
 * Options for removing files and directories
 */
export interface RmOptions {
  force?: boolean;
  maxRetries?: number;
  recursive?: boolean;
  retryDelay?: number;
}

/**
 * Options for copying entire directory structures
 */
export interface CpOptions {
  dereference?: boolean;
  errorOnExist?: boolean;
  filter?: (source: string, destination: string) => boolean | Promise<boolean>;
  force?: boolean;
  preserveTimestamps?: boolean;
  recursive?: boolean;
}

/**
 * Options for watching files
 */
export interface WatchOptions {
  persistent?: boolean;
  recursive?: boolean;
  encoding?: BufferEncoding;
}

/**
 * Result of readdir when withFileTypes is true
 */
export type ReaddirResult<T extends ReaddirOptions> = T extends { withFileTypes: true }
  ? Dirent[]
  : string[];

/**
 * Result of stat operations with bigint option
 */
export type StatResult<T extends StatOptions> = T extends { bigint: true } ? BigIntStats : Stats;
