import * as fs from 'node:fs/promises';
import type { PathLike, Mode } from 'node:fs';
import { ResultAsync } from 'neverthrow';
import { mapNodeError } from './errors';
import type { FsResultAsync } from './errors';
import type {
  ReadFileOptions,
  WriteFileOptions,
  AppendFileOptions,
  MkdirOptions,
  RmdirOptions,
  ReaddirOptions,
  RmOptions,
  CpOptions,
  StatOptions,
  StatResult,
  FileHandle,
  Dir,
  Dirent,
} from './types';

/**
 * Tests a user's permissions for the file or directory.
 * @param path - Path to test
 * @param mode - Optional mode to test
 * @returns ResultAsync indicating success or an FsError
 */
export function access(path: PathLike, mode?: number): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.access(path, mode), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Appends data to a file, creating the file if it does not exist.
 * @param file - Filename or FileHandle
 * @param data - Data to append
 * @param options - Write options
 * @returns ResultAsync indicating success or an FsError
 */
export function appendFile(
  file: PathLike | FileHandle,
  data: string | Uint8Array,
  options?: AppendFileOptions,
): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.appendFile(file, data, options), (error) =>
    mapNodeError(error, typeof file === 'object' && 'fd' in file ? undefined : file.toString()),
  );
}

/**
 * Changes the permissions of a file.
 * @param path - Path to the file
 * @param mode - New permissions
 * @returns ResultAsync indicating success or an FsError
 */
export function chmod(path: PathLike, mode: Mode): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.chmod(path, mode), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Changes the owner and group of a file.
 * @param path - Path to the file
 * @param uid - User ID
 * @param gid - Group ID
 * @returns ResultAsync indicating success or an FsError
 */
export function chown(path: PathLike, uid: number, gid: number): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.chown(path, uid, gid), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Asynchronously copies src to dest.
 * @param src - Source path
 * @param dest - Destination path
 * @param mode - Optional mode for the copy
 * @returns ResultAsync indicating success or an FsError
 */
export function copyFile(src: PathLike, dest: PathLike, mode?: number): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.copyFile(src, dest, mode), (error) =>
    mapNodeError(error, src.toString()),
  );
}

/**
 * Asynchronously copies entire directory structures.
 * @param src - Source path
 * @param dest - Destination path
 * @param options - Copy options
 * @returns ResultAsync indicating success or an FsError
 */
export function cp(
  src: string | URL,
  dest: string | URL,
  options?: CpOptions,
): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.cp(src, dest, options), (error) =>
    mapNodeError(error, src.toString()),
  );
}

/**
 * Creates a hard link.
 * @param existingPath - Path to existing file
 * @param newPath - Path for the new link
 * @returns ResultAsync indicating success or an FsError
 */
export function link(existingPath: PathLike, newPath: PathLike): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.link(existingPath, newPath), (error) =>
    mapNodeError(error, existingPath.toString()),
  );
}

/**
 * Changes the ownership of a symbolic link.
 * @param path - Path to the symbolic link
 * @param uid - User ID
 * @param gid - Group ID
 * @returns ResultAsync indicating success or an FsError
 */
export function lchown(path: PathLike, uid: number, gid: number): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.lchown(path, uid, gid), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Changes the permissions of a symbolic link.
 * @param path - Path to the symbolic link
 * @param mode - New permissions
 * @returns ResultAsync indicating success or an FsError
 */
export function lchmod(path: PathLike, mode: Mode): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.lchmod(path, mode), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Changes file timestamps of a symbolic link.
 * @param path - Path to the symbolic link
 * @param atime - Access time
 * @param mtime - Modification time
 * @returns ResultAsync indicating success or an FsError
 */
export function lutimes(
  path: PathLike,
  atime: string | number | Date,
  mtime: string | number | Date,
): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.lutimes(path, atime, mtime), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Creates a directory.
 * @param path - Path of the directory to create
 * @param options - Options for directory creation
 * @returns ResultAsync containing the path of the first directory created (if recursive) or undefined
 */
export function mkdir(path: PathLike, options?: MkdirOptions): FsResultAsync<string | undefined> {
  return ResultAsync.fromPromise(fs.mkdir(path, options), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Creates a unique temporary directory.
 * @param prefix - Directory prefix
 * @param options - Encoding options
 * @returns ResultAsync containing the path to the created directory
 */
export function mkdtemp(
  prefix: string,
  options?: BufferEncoding | { encoding?: BufferEncoding },
): FsResultAsync<string> {
  return ResultAsync.fromPromise(fs.mkdtemp(prefix, options), (error) => mapNodeError(error));
}

/**
 * Opens a FileHandle.
 * @param path - Path to the file
 * @param flags - File system flags
 * @param mode - File mode
 * @returns ResultAsync containing the FileHandle
 */
export function open(
  path: PathLike,
  flags?: string | number,
  mode?: Mode,
): FsResultAsync<FileHandle> {
  return ResultAsync.fromPromise(fs.open(path, flags, mode), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Asynchronously opens a directory for iterative scanning.
 * @param path - Path to the directory
 * @param options - Options for opening
 * @returns ResultAsync containing the Dir object
 */
export function opendir(
  path: PathLike,
  options?: { encoding?: BufferEncoding; bufferSize?: number },
): FsResultAsync<Dir> {
  return ResultAsync.fromPromise(fs.opendir(path, options), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Reads the contents of a directory.
 * @param path - Path to the directory
 * @param options - Options for reading
 * @returns ResultAsync containing array of filenames or Dirent objects
 */
export function readdir(path: PathLike): FsResultAsync<string[]>;
export function readdir(path: PathLike, options: { withFileTypes: true }): FsResultAsync<Dirent[]>;
export function readdir(
  path: PathLike,
  options: ReaddirOptions,
): FsResultAsync<string[] | Buffer[] | Dirent[]>;
export function readdir(
  path: PathLike,
  options?: ReaddirOptions,
): FsResultAsync<string[] | Buffer[] | Dirent[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ResultAsync.fromPromise(fs.readdir(path, options as any), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Reads the entire contents of a file.
 * @param path - Path to the file or FileHandle
 * @param options - Options for reading
 * @returns ResultAsync containing the file contents
 */
export function readFile(path: PathLike | FileHandle): FsResultAsync<Buffer>;
export function readFile(
  path: PathLike | FileHandle,
  options: { encoding: BufferEncoding; flag?: string } | BufferEncoding,
): FsResultAsync<string>;
export function readFile(
  path: PathLike | FileHandle,
  options?: ReadFileOptions | BufferEncoding | null,
): FsResultAsync<string | Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ResultAsync.fromPromise(fs.readFile(path, options as any), (error) =>
    mapNodeError(error, typeof path === 'object' && 'fd' in path ? undefined : path.toString()),
  );
}

/**
 * Reads the value of a symbolic link.
 * @param path - Path to the symbolic link
 * @param options - Encoding options
 * @returns ResultAsync containing the link string
 */
export function readlink(
  path: PathLike,
  options?: BufferEncoding | { encoding?: BufferEncoding },
): FsResultAsync<string> {
  return ResultAsync.fromPromise(fs.readlink(path, options), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Computes the canonical pathname by resolving `.`, `..` and symbolic links.
 * @param path - Path to resolve
 * @param options - Encoding options
 * @returns ResultAsync containing the resolved path
 */
export function realpath(
  path: PathLike,
  options?: BufferEncoding | { encoding?: BufferEncoding },
): FsResultAsync<string> {
  return ResultAsync.fromPromise(fs.realpath(path, options), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Renames a file or directory.
 * @param oldPath - Current path
 * @param newPath - New path
 * @returns ResultAsync indicating success or an FsError
 */
export function rename(oldPath: PathLike, newPath: PathLike): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.rename(oldPath, newPath), (error) =>
    mapNodeError(error, oldPath.toString()),
  );
}

/**
 * Removes a directory.
 * @param path - Path to the directory
 * @param options - Options for removal
 * @returns ResultAsync indicating success or an FsError
 */
export function rmdir(path: PathLike, options?: RmdirOptions): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.rmdir(path, options), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Removes files and directories.
 * @param path - Path to remove
 * @param options - Options for removal
 * @returns ResultAsync indicating success or an FsError
 */
export function rm(path: PathLike, options?: RmOptions): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.rm(path, options), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Retrieves statistics for the file.
 * @param path - Path to the file
 * @param options - Options for stat
 * @returns ResultAsync containing file statistics
 */
export function stat<T extends StatOptions = StatOptions>(
  path: PathLike,
  options?: T,
): FsResultAsync<StatResult<T>> {
  return ResultAsync.fromPromise(fs.stat(path, options) as Promise<StatResult<T>>, (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Retrieves statistics for the file or symbolic link.
 * @param path - Path to the file
 * @param options - Options for stat
 * @returns ResultAsync containing file statistics
 */
export function lstat<T extends StatOptions = StatOptions>(
  path: PathLike,
  options?: T,
): FsResultAsync<StatResult<T>> {
  return ResultAsync.fromPromise(fs.lstat(path, options) as Promise<StatResult<T>>, (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Creates a symbolic link.
 * @param target - Target of the link
 * @param path - Path of the link to create
 * @param type - Type of the link (only used on Windows)
 * @returns ResultAsync indicating success or an FsError
 */
export function symlink(target: PathLike, path: PathLike, type?: string): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.symlink(target, path, type), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Truncates a file.
 * @param path - Path to the file
 * @param len - Length to truncate to
 * @returns ResultAsync indicating success or an FsError
 */
export function truncate(path: PathLike, len?: number): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.truncate(path, len), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Removes a file or symbolic link.
 * @param path - Path to the file
 * @returns ResultAsync indicating success or an FsError
 */
export function unlink(path: PathLike): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.unlink(path), (error) => mapNodeError(error, path.toString()));
}

/**
 * Changes file timestamps.
 * @param path - Path to the file
 * @param atime - Access time
 * @param mtime - Modification time
 * @returns ResultAsync indicating success or an FsError
 */
export function utimes(
  path: PathLike,
  atime: string | number | Date,
  mtime: string | number | Date,
): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.utimes(path, atime, mtime), (error) =>
    mapNodeError(error, path.toString()),
  );
}

/**
 * Returns an async iterator that watches for changes on filename.
 * @param filename - File or directory to watch
 * @param options - Watch options
 * @returns ResultAsync containing the async iterator
 */
export function watch(
  filename: PathLike,
  options?: {
    encoding?: BufferEncoding;
    persistent?: boolean;
    recursive?: boolean;
    signal?: AbortSignal;
  },
): FsResultAsync<AsyncIterable<fs.FileChangeInfo<string>>> {
  return ResultAsync.fromPromise(Promise.resolve(fs.watch(filename, options)), (error) =>
    mapNodeError(error, filename.toString()),
  );
}

/**
 * Writes data to a file, replacing the file if it already exists.
 * @param file - Filename or FileHandle
 * @param data - Data to write
 * @param options - Write options
 * @returns ResultAsync indicating success or an FsError
 */
export function writeFile(
  file: PathLike | FileHandle,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>,
  options?: WriteFileOptions,
): FsResultAsync<void> {
  return ResultAsync.fromPromise(fs.writeFile(file, data, options), (error) =>
    mapNodeError(error, typeof file === 'object' && 'fd' in file ? undefined : file.toString()),
  );
}
