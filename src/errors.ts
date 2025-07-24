import { Result, ResultAsync } from 'neverthrow';

/**
 * Union type of all possible error kinds
 */
export type FsErrorName =
  | 'FileNotFoundError'
  | 'PermissionDeniedError'
  | 'DirectoryNotEmptyError'
  | 'FileAlreadyExistsError'
  | 'NotADirectoryError'
  | 'IsADirectoryError'
  | 'InvalidArgumentError'
  | 'IOError'
  | 'UnknownError';

/**
 * Base interface for all file system errors.
 * Provides a consistent structure for error handling across the library.
 */
export interface FsError extends Error {
  /** The type of error that occurred */
  readonly name: FsErrorName;
  /** Human-readable error message */
  readonly message: string;
  /** The underlying cause of the error, if available */
  readonly cause?: unknown;
  /** The file system path related to the error, if applicable */
  readonly path?: string;
  /** The system call that triggered the error, if applicable */
  readonly syscall?: string;
  /** The system error code, if applicable */
  readonly code?: string;
}

/**
 * Error thrown when a file or directory cannot be found.
 * Corresponds to Node.js ENOENT error.
 */
export class FileNotFoundError implements FsError {
  readonly name = 'FileNotFoundError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Error thrown when permission is denied to access a file or directory.
 * Corresponds to Node.js EACCES and EPERM errors.
 */
export class PermissionDeniedError implements FsError {
  readonly name = 'PermissionDeniedError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Error thrown when attempting to remove a directory that is not empty.
 * Corresponds to Node.js ENOTEMPTY error.
 */
export class DirectoryNotEmptyError implements FsError {
  readonly name = 'DirectoryNotEmptyError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Error thrown when attempting to create a file or directory that already exists.
 * Corresponds to Node.js EEXIST error.
 */
export class FileAlreadyExistsError implements FsError {
  readonly name = 'FileAlreadyExistsError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Error thrown when a directory operation is performed on a non-directory.
 * Corresponds to Node.js ENOTDIR error.
 */
export class NotADirectoryError implements FsError {
  readonly name = 'NotADirectoryError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Error thrown when a file operation is performed on a directory.
 * Corresponds to Node.js EISDIR error.
 */
export class IsADirectoryError implements FsError {
  readonly name = 'IsADirectoryError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Error thrown when invalid arguments are provided to a file system operation.
 * Corresponds to Node.js EINVAL error.
 */
export class InvalidArgumentError implements FsError {
  readonly name = 'InvalidArgumentError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * General I/O error for file system operations.
 * Used for errors that don't fall into more specific categories.
 */
export class IOError implements FsError {
  readonly name = 'IOError' as const;
  constructor(
    readonly message: string,
    readonly path?: string,
    readonly syscall?: string,
    readonly code?: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Error used when the underlying error type cannot be determined.
 * This is a catch-all for unexpected error conditions.
 */
export class UnknownError implements FsError {
  readonly name = 'UnknownError' as const;
  constructor(
    readonly message: string,
    readonly cause?: unknown,
  ) {}
}

/**
 * Maps Node.js file system errors to our custom error types.
 * This provides a consistent error interface regardless of the underlying error.
 *
 * @param error - The error thrown by Node.js fs operations
 * @param path - Optional path to include in the error for context
 * @returns A typed FsError instance
 */
export function mapNodeError(error: unknown, path?: string): FsError {
  // Check if this looks like a Node.js error by examining its structure
  // This works in both Jest (where instanceof Error fails due to serialization)
  // and production environments
  const isNodeError =
    error && typeof error === 'object' && 'message' in error && typeof error.message === 'string';

  if (isNodeError) {
    const nodeErr = error as NodeJS.ErrnoException;
    const message = nodeErr.message || 'Unknown error';

    switch (nodeErr.code) {
      case 'ENOENT':
        return new FileNotFoundError(message, path || nodeErr.path, error);
      case 'EACCES':
      case 'EPERM':
        return new PermissionDeniedError(message, path || nodeErr.path, error);
      case 'ENOTEMPTY':
        return new DirectoryNotEmptyError(message, path || nodeErr.path, error);
      case 'EEXIST':
        return new FileAlreadyExistsError(message, path || nodeErr.path, error);
      case 'ENOTDIR':
        return new NotADirectoryError(message, path || nodeErr.path, error);
      case 'EISDIR':
        return new IsADirectoryError(message, path || nodeErr.path, error);
      case 'EINVAL':
        return new InvalidArgumentError(message, path || nodeErr.path, error);
      default:
        return new IOError(message, path || nodeErr.path, nodeErr.syscall, nodeErr.code, error);
    }
  }

  // Fallback for non-Error objects
  const message = error instanceof Error ? error.message : String(error);
  return new UnknownError(message, error);
}

/**
 * Type alias for synchronous file system operation results.
 * All sync operations return a Result containing either the success value or an FsError.
 */
export type FsResult<T> = Result<T, FsError>;

/**
 * Type alias for asynchronous file system operation results.
 * All async operations return a ResultAsync containing either the success value or an FsError.
 */
export type FsResultAsync<T> = ResultAsync<T, FsError>;
