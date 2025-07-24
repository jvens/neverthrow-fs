# @jvens/neverthrow-fs

[![npm version](https://badge.fury.io/js/@jvens%2Fneverthrow-fs.svg)](https://badge.fury.io/js/@jvens%2Fneverthrow-fs)
[![CI](https://github.com/jvens/neverthrow-fs/actions/workflows/ci.yml/badge.svg)](https://github.com/jvens/neverthrow-fs/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jvens/neverthrow-fs/branch/main/graph/badge.svg)](https://codecov.io/gh/jvens/neverthrow-fs)

A type-safe wrapper around Node.js `fs` and `fs/promises` APIs using [neverthrow](https://github.com/supermacro/neverthrow)'s `Result` and `ResultAsync` types for explicit error handling.

## 🚀 Features

- **Type-safe error handling**: All file system operations return `Result<T, FsError>` or `ResultAsync<T, FsError>`
- **Comprehensive coverage**: Wraps all major `fs` and `fs/promises` functions
- **Detailed error types**: Specific error classes for different failure scenarios (FileNotFound, PermissionDenied, etc.)
- **Tree-shakeable**: Import only what you need
- **Dual module support**: CommonJS and ESM compatible
- **Full TypeScript support**: Accurate type definitions included

## 📦 Installation

```bash
npm install @jvens/neverthrow-fs neverthrow
```

Note: `neverthrow` is a peer dependency and must be installed separately.

## 🔧 Usage

### Synchronous Operations

```typescript
import { readFileSync, writeFileSync, existsSync } from '@jvens/neverthrow-fs/sync';

// Reading a file
const result = readFileSync('/path/to/file.txt', 'utf8');
if (result.isOk()) {
  console.log('File contents:', result.value);
} else {
  console.error('Error reading file:', result.error.message);
  console.error('Error type:', result.error.kind);
}

// Writing a file with error handling
const writeResult = writeFileSync('/path/to/output.txt', 'Hello, World!');
writeResult
  .map(() => console.log('File written successfully'))
  .mapErr((error) => console.error(`Failed to write file: ${error.message}`));

// Checking file existence
const exists = existsSync('/path/to/file.txt');
if (exists.isOk() && exists.value) {
  console.log('File exists');
}
```

### Asynchronous Operations

```typescript
import { readFile, writeFile, mkdir, stat } from '@jvens/neverthrow-fs/async';

// Reading a file asynchronously
const result = await readFile('/path/to/file.txt', 'utf8');
result
  .map((contents) => console.log('File contents:', contents))
  .mapErr((error) => console.error('Error:', error.message));

// Chaining operations
const processFile = await readFile('/input.txt', 'utf8')
  .andThen(async (content) => {
    const processed = content.toUpperCase();
    return writeFile('/output.txt', processed);
  });

if (processFile.isErr()) {
  console.error('Operation failed:', processFile.error.message);
}

// Creating directories with proper error handling
const dirResult = await mkdir('/path/to/new/directory', { recursive: true });
if (dirResult.isErr()) {
  if (dirResult.error.kind === 'FileAlreadyExistsError') {
    console.log('Directory already exists');
  } else {
    console.error('Failed to create directory:', dirResult.error.message);
  }
}
```

### Mixed Import Style

```typescript
import * as fs from '@jvens/neverthrow-fs';

const syncResult = fs.readFileSync('/file.txt', 'utf8');
const asyncResult = await fs.readFile('/file.txt', 'utf8');
```

## 🎯 Error Types

The library provides specific error types for better error handling:

```typescript
import type { FsError } from '@jvens/neverthrow-fs';

// Available error types:
// - FileNotFoundError (ENOENT)
// - PermissionDeniedError (EACCES, EPERM)  
// - DirectoryNotEmptyError (ENOTEMPTY)
// - FileAlreadyExistsError (EEXIST)
// - NotADirectoryError (ENOTDIR)
// - IsADirectoryError (EISDIR)
// - InvalidArgumentError (EINVAL)
// - IOError (other filesystem errors)
// - UnknownError (unexpected errors)

function handleError(error: FsError) {
  switch (error.kind) {
    case 'FileNotFoundError':
      console.log('File not found:', error.path);
      break;
    case 'PermissionDeniedError':
      console.log('Permission denied for:', error.path);
      break;
    case 'FileAlreadyExistsError':
      console.log('File already exists:', error.path);
      break;
    default:
      console.log('Unexpected error:', error.message);
  }
}
```

## 📚 API Reference

### Synchronous Functions (from `/sync`)

All functions return `Result<T, FsError>`:

- `accessSync(path, mode?)` - Test file permissions
- `appendFileSync(file, data, options?)` - Append to file
- `chmodSync(path, mode)` - Change permissions
- `chownSync(path, uid, gid)` - Change ownership
- `copyFileSync(src, dest, mode?)` - Copy file
- `existsSync(path)` - Check if file exists
- `linkSync(existingPath, newPath)` - Create hard link
- `mkdirSync(path, options?)` - Create directory
- `mkdtempSync(prefix, options?)` - Create temp directory
- `readdirSync(path, options?)` - Read dir contents
- `readFileSync(path, options?)` - Read file
- `readlinkSync(path, options?)` - Read symlink
- `realpathSync(path, options?)` - Resolve path
- `renameSync(oldPath, newPath)` - Rename file/dir
- `rmdirSync(path, options?)` - Remove directory
- `rmSync(path, options?)` - Remove files/dirs
- `statSync(path, options?)` - Get file stats
- `lstatSync(path, options?)` - Get file stats (no symlink follow)
- `symlinkSync(target, path, type?)` - Create symlink
- `truncateSync(path, len?)` - Truncate file
- `unlinkSync(path)` - Remove file
- `utimesSync(path, atime, mtime)` - Update timestamps
- `writeFileSync(file, data, options?)` - Write file

### Asynchronous Functions (from `/async`)

All functions return `ResultAsync<T, FsError>`:

- `access(path, mode?)` - Test file permissions
- `appendFile(file, data, options?)` - Append to file
- `chmod(path, mode)` - Change permissions
- `chown(path, uid, gid)` - Change ownership
- `copyFile(src, dest, mode?)` - Copy file
- `cp(src, dest, options?)` - Copy recursively
- `link(existingPath, newPath)` - Create hard link
- `lchown(path, uid, gid)` - Change symlink ownership
- `lchmod(path, mode)` - Change symlink permissions
- `lutimes(path, atime, mtime)` - Update symlink timestamps
- `mkdir(path, options?)` - Create directory
- `mkdtemp(prefix, options?)` - Create temp directory
- `open(path, flags?, mode?)` - Open file handle
- `opendir(path, options?)` - Open directory
- `readdir(path, options?)` - Read dir contents
- `readFile(path, options?)` - Read file
- `readlink(path, options?)` - Read symlink
- `realpath(path, options?)` - Resolve path
- `rename(oldPath, newPath)` - Rename file/dir
- `rmdir(path, options?)` - Remove directory
- `rm(path, options?)` - Remove files/dirs
- `stat(path, options?)` - Get file stats
- `lstat(path, options?)` - Get file stats (no symlink follow)
- `symlink(target, path, type?)` - Create symlink
- `truncate(path, len?)` - Truncate file
- `unlink(path)` - Remove file
- `utimes(path, atime, mtime)` - Update timestamps
- `watch(filename, options?)` - Watch for changes
- `writeFile(file, data, options?)` - Write file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/jvens/neverthrow-fs.git
cd neverthrow-fs

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the package
npm run build

# Run linter
npm run lint

# Run type checking
npm run typecheck
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [neverthrow](https://github.com/supermacro/neverthrow) - The excellent Result type library this package builds upon
- [Node.js fs module](https://nodejs.org/api/fs.html) - The underlying filesystem API