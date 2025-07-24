"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownError = exports.IOError = exports.InvalidArgumentError = exports.IsADirectoryError = exports.NotADirectoryError = exports.FileAlreadyExistsError = exports.DirectoryNotEmptyError = exports.PermissionDeniedError = exports.FileNotFoundError = void 0;
exports.mapNodeError = mapNodeError;
/**
 * Error thrown when a file or directory cannot be found.
 * Corresponds to Node.js ENOENT error.
 */
class FileNotFoundError {
    constructor(message, path, cause) {
        this.message = message;
        this.path = path;
        this.cause = cause;
        this.kind = 'FileNotFoundError';
    }
}
exports.FileNotFoundError = FileNotFoundError;
/**
 * Error thrown when permission is denied to access a file or directory.
 * Corresponds to Node.js EACCES and EPERM errors.
 */
class PermissionDeniedError {
    constructor(message, path, cause) {
        this.message = message;
        this.path = path;
        this.cause = cause;
        this.kind = 'PermissionDeniedError';
    }
}
exports.PermissionDeniedError = PermissionDeniedError;
/**
 * Error thrown when attempting to remove a directory that is not empty.
 * Corresponds to Node.js ENOTEMPTY error.
 */
class DirectoryNotEmptyError {
    constructor(message, path, cause) {
        this.message = message;
        this.path = path;
        this.cause = cause;
        this.kind = 'DirectoryNotEmptyError';
    }
}
exports.DirectoryNotEmptyError = DirectoryNotEmptyError;
/**
 * Error thrown when attempting to create a file or directory that already exists.
 * Corresponds to Node.js EEXIST error.
 */
class FileAlreadyExistsError {
    constructor(message, path, cause) {
        this.message = message;
        this.path = path;
        this.cause = cause;
        this.kind = 'FileAlreadyExistsError';
    }
}
exports.FileAlreadyExistsError = FileAlreadyExistsError;
/**
 * Error thrown when a directory operation is performed on a non-directory.
 * Corresponds to Node.js ENOTDIR error.
 */
class NotADirectoryError {
    constructor(message, path, cause) {
        this.message = message;
        this.path = path;
        this.cause = cause;
        this.kind = 'NotADirectoryError';
    }
}
exports.NotADirectoryError = NotADirectoryError;
/**
 * Error thrown when a file operation is performed on a directory.
 * Corresponds to Node.js EISDIR error.
 */
class IsADirectoryError {
    constructor(message, path, cause) {
        this.message = message;
        this.path = path;
        this.cause = cause;
        this.kind = 'IsADirectoryError';
    }
}
exports.IsADirectoryError = IsADirectoryError;
/**
 * Error thrown when invalid arguments are provided to a file system operation.
 * Corresponds to Node.js EINVAL error.
 */
class InvalidArgumentError {
    constructor(message, path, cause) {
        this.message = message;
        this.path = path;
        this.cause = cause;
        this.kind = 'InvalidArgumentError';
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
/**
 * General I/O error for file system operations.
 * Used for errors that don't fall into more specific categories.
 */
class IOError {
    constructor(message, path, syscall, code, cause) {
        this.message = message;
        this.path = path;
        this.syscall = syscall;
        this.code = code;
        this.cause = cause;
        this.kind = 'IOError';
    }
}
exports.IOError = IOError;
/**
 * Error used when the underlying error type cannot be determined.
 * This is a catch-all for unexpected error conditions.
 */
class UnknownError {
    constructor(message, cause) {
        this.message = message;
        this.cause = cause;
        this.kind = 'UnknownError';
    }
}
exports.UnknownError = UnknownError;
/**
 * Maps Node.js file system errors to our custom error types.
 * This provides a consistent error interface regardless of the underlying error.
 *
 * @param error - The error thrown by Node.js fs operations
 * @param path - Optional path to include in the error for context
 * @returns A typed FsError instance
 */
function mapNodeError(error, path) {
    if (error instanceof Error) {
        const nodeErr = error;
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
    return new UnknownError(error instanceof Error ? error.message : String(error), error);
}
