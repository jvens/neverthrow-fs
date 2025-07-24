import * as fs from 'node:fs';
import { ok, err } from 'neverthrow';
import { mapNodeError } from './errors';
import type { FsResult } from './errors';
import type {
  ReadFileOptions,
  WriteFileOptions,
  AppendFileOptions,
  MkdirOptions,
  RmdirOptions,
  ReaddirOptions,
  ReaddirResult,
  RmOptions,
  StatOptions,
  StatResult,
} from './types';

/**
 * Synchronously tests a user's permissions for the file or directory.
 * @param path - Path to test
 * @param mode - Optional mode to test
 * @returns Result indicating success or an FsError
 */
export function accessSync(path: fs.PathLike, mode?: number): FsResult<void> {
  try {
    fs.accessSync(path, mode);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously appends data to a file, creating the file if it does not exist.
 * @param file - Filename or file descriptor
 * @param data - Data to append
 * @param options - Write options
 * @returns Result indicating success or an FsError
 */
export function appendFileSync(
  file: fs.PathLike | number,
  data: string | Uint8Array,
  options?: AppendFileOptions,
): FsResult<void> {
  try {
    fs.appendFileSync(file, data, options);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, typeof file === 'number' ? undefined : file.toString()));
  }
}

/**
 * Synchronously changes the permissions of a file.
 * @param path - Path to the file
 * @param mode - New permissions
 * @returns Result indicating success or an FsError
 */
export function chmodSync(path: fs.PathLike, mode: fs.Mode): FsResult<void> {
  try {
    fs.chmodSync(path, mode);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously changes the owner and group of a file.
 * @param path - Path to the file
 * @param uid - User ID
 * @param gid - Group ID
 * @returns Result indicating success or an FsError
 */
export function chownSync(path: fs.PathLike, uid: number, gid: number): FsResult<void> {
  try {
    fs.chownSync(path, uid, gid);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously copies src to dest.
 * @param src - Source path
 * @param dest - Destination path
 * @param mode - Optional mode for the copy
 * @returns Result indicating success or an FsError
 */
export function copyFileSync(src: fs.PathLike, dest: fs.PathLike, mode?: number): FsResult<void> {
  try {
    fs.copyFileSync(src, dest, mode);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, src.toString()));
  }
}

/**
 * Synchronously tests whether the given path exists.
 * @param path - Path to test
 * @returns Result containing boolean indicating existence
 */
export function existsSync(path: fs.PathLike): FsResult<boolean> {
  try {
    return ok(fs.existsSync(path));
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously creates a hard link.
 * @param existingPath - Path to existing file
 * @param newPath - Path for the new link
 * @returns Result indicating success or an FsError
 */
export function linkSync(existingPath: fs.PathLike, newPath: fs.PathLike): FsResult<void> {
  try {
    fs.linkSync(existingPath, newPath);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, existingPath.toString()));
  }
}

/**
 * Synchronously creates a directory.
 * @param path - Path of the directory to create
 * @param options - Options for directory creation
 * @returns Result containing the path of the first directory created (if recursive) or undefined
 */
export function mkdirSync(path: fs.PathLike, options?: MkdirOptions): FsResult<string | undefined> {
  try {
    const result = fs.mkdirSync(path, options);
    return ok(result);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously creates a unique temporary directory.
 * @param prefix - Directory prefix
 * @param options - Encoding options
 * @returns Result containing the path to the created directory
 */
export function mkdtempSync(
  prefix: string,
  options?: BufferEncoding | { encoding?: BufferEncoding },
): FsResult<string> {
  try {
    return ok(fs.mkdtempSync(prefix, options));
  } catch (error) {
    return err(mapNodeError(error));
  }
}

/**
 * Synchronously reads the contents of a directory.
 * @param path - Path to the directory
 * @param options - Options for reading
 * @returns Result containing array of filenames or Dirent objects
 */
export function readdirSync<T extends ReaddirOptions = {}>(
  path: fs.PathLike,
  options?: T,
): FsResult<ReaddirResult<T>> {
  try {
    const result = fs.readdirSync(path, options as any) as ReaddirResult<T>;
    return ok(result);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously reads the entire contents of a file.
 * @param path - Path to the file
 * @param options - Options for reading
 * @returns Result containing the file contents
 */
export function readFileSync(
  path: fs.PathLike | number,
  options?: { encoding?: null; flag?: string } | null,
): FsResult<Buffer>;
export function readFileSync(
  path: fs.PathLike | number,
  options: { encoding: BufferEncoding; flag?: string } | BufferEncoding,
): FsResult<string>;
export function readFileSync(
  path: fs.PathLike | number,
  options?: ReadFileOptions | BufferEncoding | null,
): FsResult<string | Buffer> {
  try {
    const result = fs.readFileSync(path, options as any);
    return ok(result);
  } catch (error) {
    return err(mapNodeError(error, typeof path === 'number' ? undefined : path.toString()));
  }
}

/**
 * Synchronously reads the value of a symbolic link.
 * @param path - Path to the symbolic link
 * @param options - Encoding options
 * @returns Result containing the link string
 */
export function readlinkSync(
  path: fs.PathLike,
  options?: BufferEncoding | { encoding?: BufferEncoding },
): FsResult<string> {
  try {
    return ok(fs.readlinkSync(path, options));
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously computes the canonical pathname by resolving `.`, `..` and symbolic links.
 * @param path - Path to resolve
 * @param options - Encoding options
 * @returns Result containing the resolved path
 */
export function realpathSync(
  path: fs.PathLike,
  options?: BufferEncoding | { encoding?: BufferEncoding },
): FsResult<string> {
  try {
    return ok(fs.realpathSync(path, options));
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously renames a file or directory.
 * @param oldPath - Current path
 * @param newPath - New path
 * @returns Result indicating success or an FsError
 */
export function renameSync(oldPath: fs.PathLike, newPath: fs.PathLike): FsResult<void> {
  try {
    fs.renameSync(oldPath, newPath);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, oldPath.toString()));
  }
}

/**
 * Synchronously removes a directory.
 * @param path - Path to the directory
 * @param options - Options for removal
 * @returns Result indicating success or an FsError
 */
export function rmdirSync(path: fs.PathLike, options?: RmdirOptions): FsResult<void> {
  try {
    fs.rmdirSync(path, options);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously removes files and directories.
 * @param path - Path to remove
 * @param options - Options for removal
 * @returns Result indicating success or an FsError
 */
export function rmSync(path: fs.PathLike, options?: RmOptions): FsResult<void> {
  try {
    fs.rmSync(path, options);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously retrieves statistics for the file.
 * @param path - Path to the file
 * @param options - Options for stat
 * @returns Result containing file statistics
 */
export function statSync<T extends StatOptions = {}>(
  path: fs.PathLike,
  options?: T,
): FsResult<StatResult<T>> {
  try {
    const result = fs.statSync(path, options) as StatResult<T>;
    return ok(result);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously retrieves statistics for the file or symbolic link.
 * @param path - Path to the file
 * @param options - Options for stat
 * @returns Result containing file statistics
 */
export function lstatSync<T extends StatOptions = {}>(
  path: fs.PathLike,
  options?: T,
): FsResult<StatResult<T>> {
  try {
    const result = fs.lstatSync(path, options) as StatResult<T>;
    return ok(result);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously creates a symbolic link.
 * @param target - Target of the link
 * @param path - Path of the link to create
 * @param type - Type of the link (only used on Windows)
 * @returns Result indicating success or an FsError
 */
export function symlinkSync(
  target: fs.PathLike,
  path: fs.PathLike,
  type?: fs.symlink.Type,
): FsResult<void> {
  try {
    fs.symlinkSync(target, path, type);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously truncates a file.
 * @param path - Path to the file
 * @param len - Length to truncate to
 * @returns Result indicating success or an FsError
 */
export function truncateSync(path: fs.PathLike, len?: number): FsResult<void> {
  try {
    fs.truncateSync(path, len);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously removes a file or symbolic link.
 * @param path - Path to the file
 * @returns Result indicating success or an FsError
 */
export function unlinkSync(path: fs.PathLike): FsResult<void> {
  try {
    fs.unlinkSync(path);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously changes file timestamps.
 * @param path - Path to the file
 * @param atime - Access time
 * @param mtime - Modification time
 * @returns Result indicating success or an FsError
 */
export function utimesSync(
  path: fs.PathLike,
  atime: string | number | Date,
  mtime: string | number | Date,
): FsResult<void> {
  try {
    fs.utimesSync(path, atime, mtime);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, path.toString()));
  }
}

/**
 * Synchronously writes data to a file, replacing the file if it already exists.
 * @param file - Filename or file descriptor
 * @param data - Data to write
 * @param options - Write options
 * @returns Result indicating success or an FsError
 */
export function writeFileSync(
  file: fs.PathLike | number,
  data: string | NodeJS.ArrayBufferView,
  options?: WriteFileOptions,
): FsResult<void> {
  try {
    fs.writeFileSync(file, data, options);
    return ok(undefined);
  } catch (error) {
    return err(mapNodeError(error, typeof file === 'number' ? undefined : file.toString()));
  }
}
