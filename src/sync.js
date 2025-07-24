"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessSync = accessSync;
exports.appendFileSync = appendFileSync;
exports.chmodSync = chmodSync;
exports.chownSync = chownSync;
exports.copyFileSync = copyFileSync;
exports.existsSync = existsSync;
exports.linkSync = linkSync;
exports.mkdirSync = mkdirSync;
exports.mkdtempSync = mkdtempSync;
exports.readdirSync = readdirSync;
exports.readFileSync = readFileSync;
exports.readlinkSync = readlinkSync;
exports.realpathSync = realpathSync;
exports.renameSync = renameSync;
exports.rmdirSync = rmdirSync;
exports.rmSync = rmSync;
exports.statSync = statSync;
exports.lstatSync = lstatSync;
exports.symlinkSync = symlinkSync;
exports.truncateSync = truncateSync;
exports.unlinkSync = unlinkSync;
exports.utimesSync = utimesSync;
exports.writeFileSync = writeFileSync;
const fs = __importStar(require("node:fs"));
const neverthrow_1 = require("neverthrow");
const errors_1 = require("./errors");
/**
 * Synchronously tests a user's permissions for the file or directory.
 * @param path - Path to test
 * @param mode - Optional mode to test
 * @returns Result indicating success or an FsError
 */
function accessSync(path, mode) {
    try {
        fs.accessSync(path, mode);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously appends data to a file, creating the file if it does not exist.
 * @param file - Filename or file descriptor
 * @param data - Data to append
 * @param options - Write options
 * @returns Result indicating success or an FsError
 */
function appendFileSync(file, data, options) {
    try {
        fs.appendFileSync(file, data, options);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, typeof file === 'number' ? undefined : file.toString()));
    }
}
/**
 * Synchronously changes the permissions of a file.
 * @param path - Path to the file
 * @param mode - New permissions
 * @returns Result indicating success or an FsError
 */
function chmodSync(path, mode) {
    try {
        fs.chmodSync(path, mode);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously changes the owner and group of a file.
 * @param path - Path to the file
 * @param uid - User ID
 * @param gid - Group ID
 * @returns Result indicating success or an FsError
 */
function chownSync(path, uid, gid) {
    try {
        fs.chownSync(path, uid, gid);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously copies src to dest.
 * @param src - Source path
 * @param dest - Destination path
 * @param mode - Optional mode for the copy
 * @returns Result indicating success or an FsError
 */
function copyFileSync(src, dest, mode) {
    try {
        fs.copyFileSync(src, dest, mode);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, src.toString()));
    }
}
/**
 * Synchronously tests whether the given path exists.
 * @param path - Path to test
 * @returns Result containing boolean indicating existence
 */
function existsSync(path) {
    try {
        return (0, neverthrow_1.ok)(fs.existsSync(path));
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously creates a hard link.
 * @param existingPath - Path to existing file
 * @param newPath - Path for the new link
 * @returns Result indicating success or an FsError
 */
function linkSync(existingPath, newPath) {
    try {
        fs.linkSync(existingPath, newPath);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, existingPath.toString()));
    }
}
/**
 * Synchronously creates a directory.
 * @param path - Path of the directory to create
 * @param options - Options for directory creation
 * @returns Result containing the path of the first directory created (if recursive) or undefined
 */
function mkdirSync(path, options) {
    try {
        const result = fs.mkdirSync(path, options);
        return (0, neverthrow_1.ok)(result);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously creates a unique temporary directory.
 * @param prefix - Directory prefix
 * @param options - Encoding options
 * @returns Result containing the path to the created directory
 */
function mkdtempSync(prefix, options) {
    try {
        return (0, neverthrow_1.ok)(fs.mkdtempSync(prefix, options));
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error));
    }
}
/**
 * Synchronously reads the contents of a directory.
 * @param path - Path to the directory
 * @param options - Options for reading
 * @returns Result containing array of filenames or Dirent objects
 */
function readdirSync(path, options) {
    try {
        const result = fs.readdirSync(path, options);
        return (0, neverthrow_1.ok)(result);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
function readFileSync(path, options) {
    try {
        const result = fs.readFileSync(path, options);
        return (0, neverthrow_1.ok)(result);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, typeof path === 'number' ? undefined : path.toString()));
    }
}
/**
 * Synchronously reads the value of a symbolic link.
 * @param path - Path to the symbolic link
 * @param options - Encoding options
 * @returns Result containing the link string
 */
function readlinkSync(path, options) {
    try {
        return (0, neverthrow_1.ok)(fs.readlinkSync(path, options));
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously computes the canonical pathname by resolving `.`, `..` and symbolic links.
 * @param path - Path to resolve
 * @param options - Encoding options
 * @returns Result containing the resolved path
 */
function realpathSync(path, options) {
    try {
        return (0, neverthrow_1.ok)(fs.realpathSync(path, options));
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously renames a file or directory.
 * @param oldPath - Current path
 * @param newPath - New path
 * @returns Result indicating success or an FsError
 */
function renameSync(oldPath, newPath) {
    try {
        fs.renameSync(oldPath, newPath);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, oldPath.toString()));
    }
}
/**
 * Synchronously removes a directory.
 * @param path - Path to the directory
 * @param options - Options for removal
 * @returns Result indicating success or an FsError
 */
function rmdirSync(path, options) {
    try {
        fs.rmdirSync(path, options);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously removes files and directories.
 * @param path - Path to remove
 * @param options - Options for removal
 * @returns Result indicating success or an FsError
 */
function rmSync(path, options) {
    try {
        fs.rmSync(path, options);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously retrieves statistics for the file.
 * @param path - Path to the file
 * @param options - Options for stat
 * @returns Result containing file statistics
 */
function statSync(path, options) {
    try {
        const result = fs.statSync(path, options);
        return (0, neverthrow_1.ok)(result);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously retrieves statistics for the file or symbolic link.
 * @param path - Path to the file
 * @param options - Options for stat
 * @returns Result containing file statistics
 */
function lstatSync(path, options) {
    try {
        const result = fs.lstatSync(path, options);
        return (0, neverthrow_1.ok)(result);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously creates a symbolic link.
 * @param target - Target of the link
 * @param path - Path of the link to create
 * @param type - Type of the link (only used on Windows)
 * @returns Result indicating success or an FsError
 */
function symlinkSync(target, path, type) {
    try {
        fs.symlinkSync(target, path, type);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously truncates a file.
 * @param path - Path to the file
 * @param len - Length to truncate to
 * @returns Result indicating success or an FsError
 */
function truncateSync(path, len) {
    try {
        fs.truncateSync(path, len);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously removes a file or symbolic link.
 * @param path - Path to the file
 * @returns Result indicating success or an FsError
 */
function unlinkSync(path) {
    try {
        fs.unlinkSync(path);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously changes file timestamps.
 * @param path - Path to the file
 * @param atime - Access time
 * @param mtime - Modification time
 * @returns Result indicating success or an FsError
 */
function utimesSync(path, atime, mtime) {
    try {
        fs.utimesSync(path, atime, mtime);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, path.toString()));
    }
}
/**
 * Synchronously writes data to a file, replacing the file if it already exists.
 * @param file - Filename or file descriptor
 * @param data - Data to write
 * @param options - Write options
 * @returns Result indicating success or an FsError
 */
function writeFileSync(file, data, options) {
    try {
        fs.writeFileSync(file, data, options);
        return (0, neverthrow_1.ok)(undefined);
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, errors_1.mapNodeError)(error, typeof file === 'number' ? undefined : file.toString()));
    }
}
