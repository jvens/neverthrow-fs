import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  accessSync,
  appendFileSync,
  chmodSync,
  chownSync,
  copyFileSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmdirSync,
  rmSync,
  statSync,
  symlinkSync,
  truncateSync,
  unlinkSync,
  utimesSync,
  writeFileSync,
} from '../sync';

describe('sync fs wrappers', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neverthrow-fs-test-'));
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('writeFileSync and readFileSync', () => {
    it('should write and read a text file', () => {
      const filePath = path.join(testDir, 'test.txt');
      const content = 'Hello, World!';

      const writeResult = writeFileSync(filePath, content);
      expect(writeResult.isOk()).toBe(true);

      const readResult = readFileSync(filePath, 'utf8');
      expect(readResult.isOk()).toBe(true);
      if (readResult.isOk()) {
        expect(readResult.value).toBe(content);
      }
    });

    it('should write and read a buffer', () => {
      const filePath = path.join(testDir, 'test.bin');
      const content = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

      const writeResult = writeFileSync(filePath, content);
      expect(writeResult.isOk()).toBe(true);

      const readResult = readFileSync(filePath);
      expect(readResult.isOk()).toBe(true);
      if (readResult.isOk()) {
        expect(Buffer.compare(readResult.value, content)).toBe(0);
      }
    });

    it('should return error when reading non-existent file', () => {
      const filePath = path.join(testDir, 'non-existent.txt');

      const result = readFileSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        // Note: There appears to be a Jest-specific issue with error mapping
        // The functionality works correctly outside of Jest test environment
        expect(['FileNotFoundError']).toContain(result.error.name);
        expect(result.error.message).toContain('ENOENT');
        expect(result.error.message).toContain(filePath);
      }
    });
  });

  describe('existsSync', () => {
    it('should return true for existing file', () => {
      const filePath = path.join(testDir, 'exists.txt');
      fs.writeFileSync(filePath, 'content');

      const result = existsSync(filePath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(true);
      }
    });

    it('should return false for non-existent file', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = existsSync(filePath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(false);
      }
    });
  });

  describe('mkdirSync and rmdirSync', () => {
    it('should create and remove directory', () => {
      const dirPath = path.join(testDir, 'newdir');

      const mkResult = mkdirSync(dirPath);
      expect(mkResult.isOk()).toBe(true);
      expect(fs.existsSync(dirPath)).toBe(true);

      const rmResult = rmdirSync(dirPath);
      expect(rmResult.isOk()).toBe(true);
      expect(fs.existsSync(dirPath)).toBe(false);
    });

    it('should create directory recursively', () => {
      const dirPath = path.join(testDir, 'a', 'b', 'c');

      const result = mkdirSync(dirPath, { recursive: true });
      expect(result.isOk()).toBe(true);
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should return error when creating existing directory', () => {
      const dirPath = path.join(testDir, 'existing');
      fs.mkdirSync(dirPath);

      const result = mkdirSync(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileAlreadyExistsError']).toContain(result.error.name);
        expect(result.error.message).toContain('EEXIST');
      }
    });
  });

  describe('appendFileSync', () => {
    it('should append to existing file', () => {
      const filePath = path.join(testDir, 'append.txt');
      fs.writeFileSync(filePath, 'Hello');

      const result = appendFileSync(filePath, ', World!');
      expect(result.isOk()).toBe(true);

      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toBe('Hello, World!');
    });

    it('should create file if not exists', () => {
      const filePath = path.join(testDir, 'new-append.txt');

      const result = appendFileSync(filePath, 'New content');
      expect(result.isOk()).toBe(true);

      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toBe('New content');
    });
  });

  describe('renameSync', () => {
    it('should rename file', () => {
      const oldPath = path.join(testDir, 'old.txt');
      const newPath = path.join(testDir, 'new.txt');
      fs.writeFileSync(oldPath, 'content');

      const result = renameSync(oldPath, newPath);
      expect(result.isOk()).toBe(true);
      expect(fs.existsSync(oldPath)).toBe(false);
      expect(fs.existsSync(newPath)).toBe(true);
    });

    it('should return error when renaming non-existent file', () => {
      const oldPath = path.join(testDir, 'non-existent.txt');
      const newPath = path.join(testDir, 'new.txt');

      const result = renameSync(oldPath, newPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('unlinkSync', () => {
    it('should remove file', () => {
      const filePath = path.join(testDir, 'remove.txt');
      fs.writeFileSync(filePath, 'content');

      const result = unlinkSync(filePath);
      expect(result.isOk()).toBe(true);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should return error when removing non-existent file', () => {
      const filePath = path.join(testDir, 'non-existent.txt');

      const result = unlinkSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('statSync', () => {
    it('should get file stats', () => {
      const filePath = path.join(testDir, 'stat.txt');
      fs.writeFileSync(filePath, 'content');

      const result = statSync(filePath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.isFile()).toBe(true);
        expect(result.value.isDirectory()).toBe(false);
        expect(result.value.size).toBeGreaterThan(0);
      }
    });

    it('should get directory stats', () => {
      const result = statSync(testDir);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.isFile()).toBe(false);
        expect(result.value.isDirectory()).toBe(true);
      }
    });

    it('should return error for non-existent path', () => {
      const filePath = path.join(testDir, 'non-existent.txt');

      const result = statSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('accessSync', () => {
    it('should succeed for existing file', () => {
      const filePath = path.join(testDir, 'access.txt');
      fs.writeFileSync(filePath, 'content');

      const result = accessSync(filePath);
      expect(result.isOk()).toBe(true);
    });

    it('should return error for non-existent file', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = accessSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('chmodSync', () => {
    it('should change file permissions', () => {
      const filePath = path.join(testDir, 'chmod.txt');
      fs.writeFileSync(filePath, 'content');

      const result = chmodSync(filePath, 0o644);
      expect(result.isOk()).toBe(true);

      const stats = fs.statSync(filePath);
      expect(stats.mode & 0o777).toBe(0o644);
    });

    it('should return error for non-existent file', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = chmodSync(filePath, 0o644);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('chownSync', () => {
    it('should change file ownership', () => {
      const filePath = path.join(testDir, 'chown.txt');
      fs.writeFileSync(filePath, 'content');
      const stats = fs.statSync(filePath);

      // Use current uid/gid to avoid permission errors
      const result = chownSync(filePath, stats.uid, stats.gid);
      expect(result.isOk()).toBe(true);
    });

    it('should return error for non-existent file', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = chownSync(filePath, 1000, 1000);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('copyFileSync', () => {
    it('should copy file', () => {
      const srcPath = path.join(testDir, 'source.txt');
      const destPath = path.join(testDir, 'dest.txt');
      const content = 'copy content';
      fs.writeFileSync(srcPath, content);

      const result = copyFileSync(srcPath, destPath);
      expect(result.isOk()).toBe(true);
      expect(fs.readFileSync(destPath, 'utf8')).toBe(content);
    });

    it('should return error when source does not exist', () => {
      const srcPath = path.join(testDir, 'not-exists.txt');
      const destPath = path.join(testDir, 'dest.txt');

      const result = copyFileSync(srcPath, destPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('linkSync', () => {
    it('should create hard link', () => {
      const srcPath = path.join(testDir, 'link-source.txt');
      const linkPath = path.join(testDir, 'link-dest.txt');
      const content = 'link content';
      fs.writeFileSync(srcPath, content);

      const result = linkSync(srcPath, linkPath);
      expect(result.isOk()).toBe(true);
      expect(fs.readFileSync(linkPath, 'utf8')).toBe(content);

      const srcStats = fs.statSync(srcPath);
      const linkStats = fs.statSync(linkPath);
      expect(srcStats.ino).toBe(linkStats.ino);
    });

    it('should return error when source does not exist', () => {
      const srcPath = path.join(testDir, 'not-exists.txt');
      const linkPath = path.join(testDir, 'link.txt');

      const result = linkSync(srcPath, linkPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('lstatSync', () => {
    it('should get symlink stats', () => {
      const filePath = path.join(testDir, 'lstat.txt');
      const linkPath = path.join(testDir, 'lstat-link.txt');
      fs.writeFileSync(filePath, 'content');
      fs.symlinkSync(filePath, linkPath);

      const result = lstatSync(linkPath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.isSymbolicLink()).toBe(true);
        expect(result.value.isFile()).toBe(false);
      }
    });

    it('should return error for non-existent path', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = lstatSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('mkdtempSync', () => {
    it('should create temporary directory', () => {
      const prefix = path.join(testDir, 'temp-');

      const result = mkdtempSync(prefix);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toMatch(/temp-/);
        expect(fs.existsSync(result.value)).toBe(true);
        expect(fs.statSync(result.value).isDirectory()).toBe(true);
      }
    });
  });

  describe('readdirSync', () => {
    it('should read directory contents', () => {
      const file1 = path.join(testDir, 'file1.txt');
      const file2 = path.join(testDir, 'file2.txt');
      fs.writeFileSync(file1, 'content1');
      fs.writeFileSync(file2, 'content2');

      const result = readdirSync(testDir);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toContain('file1.txt');
        expect(result.value).toContain('file2.txt');
      }
    });

    it('should read directory with withFileTypes option', () => {
      const file1 = path.join(testDir, 'file1.txt');
      const subdir = path.join(testDir, 'subdir');
      fs.writeFileSync(file1, 'content1');
      fs.mkdirSync(subdir);

      const result = readdirSync(testDir, { withFileTypes: true });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.length).toBeGreaterThan(0);
        const fileEntry = result.value.find((entry) => entry.name === 'file1.txt');
        const dirEntry = result.value.find((entry) => entry.name === 'subdir');
        expect(fileEntry?.isFile()).toBe(true);
        expect(dirEntry?.isDirectory()).toBe(true);
      }
    });

    it('should return error for non-existent directory', () => {
      const dirPath = path.join(testDir, 'not-exists');

      const result = readdirSync(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('readlinkSync', () => {
    it('should read symbolic link', () => {
      const filePath = path.join(testDir, 'readlink.txt');
      const linkPath = path.join(testDir, 'readlink-link.txt');
      fs.writeFileSync(filePath, 'content');
      fs.symlinkSync(filePath, linkPath);

      const result = readlinkSync(linkPath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(filePath);
      }
    });

    it('should return error for non-symlink', () => {
      const filePath = path.join(testDir, 'regular.txt');
      fs.writeFileSync(filePath, 'content');

      const result = readlinkSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['InvalidArgumentError']).toContain(result.error.name);
      }
    });
  });

  describe('realpathSync', () => {
    it('should resolve real path', () => {
      const filePath = path.join(testDir, 'realpath.txt');
      const linkPath = path.join(testDir, 'realpath-link.txt');
      fs.writeFileSync(filePath, 'content');
      fs.symlinkSync(filePath, linkPath);

      const result = realpathSync(linkPath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(filePath);
      }
    });

    it('should return error for non-existent path', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = realpathSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('rmSync', () => {
    it('should remove file', () => {
      const filePath = path.join(testDir, 'rm.txt');
      fs.writeFileSync(filePath, 'content');

      const result = rmSync(filePath);
      expect(result.isOk()).toBe(true);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should remove directory recursively', () => {
      const dirPath = path.join(testDir, 'rm-dir');
      fs.mkdirSync(dirPath);
      fs.writeFileSync(path.join(dirPath, 'file.txt'), 'content');

      const result = rmSync(dirPath, { recursive: true });
      expect(result.isOk()).toBe(true);
      expect(fs.existsSync(dirPath)).toBe(false);
    });

    it('should return error for non-existent path', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = rmSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('symlinkSync', () => {
    it('should create symbolic link', () => {
      const filePath = path.join(testDir, 'symlink.txt');
      const linkPath = path.join(testDir, 'symlink-link.txt');
      const content = 'symlink content';
      fs.writeFileSync(filePath, content);

      const result = symlinkSync(filePath, linkPath);
      expect(result.isOk()).toBe(true);
      expect(fs.readFileSync(linkPath, 'utf8')).toBe(content);
      expect(fs.lstatSync(linkPath).isSymbolicLink()).toBe(true);
    });

    it('should return error when target already exists', () => {
      const filePath = path.join(testDir, 'symlink2.txt');
      const linkPath = path.join(testDir, 'symlink2-link.txt');
      fs.writeFileSync(filePath, 'content');
      fs.writeFileSync(linkPath, 'existing');

      const result = symlinkSync(filePath, linkPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileAlreadyExistsError']).toContain(result.error.name);
      }
    });
  });

  describe('truncateSync', () => {
    it('should truncate file', () => {
      const filePath = path.join(testDir, 'truncate.txt');
      const content = 'this is a long content';
      fs.writeFileSync(filePath, content);

      const result = truncateSync(filePath, 10);
      expect(result.isOk()).toBe(true);
      expect(fs.readFileSync(filePath, 'utf8')).toBe('this is a ');
    });

    it('should return error for non-existent file', () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = truncateSync(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  describe('utimesSync', () => {
    it('should change file timestamps', () => {
      const filePath = path.join(testDir, 'utimes.txt');
      fs.writeFileSync(filePath, 'content');

      const now = new Date();
      const result = utimesSync(filePath, now, now);
      expect(result.isOk()).toBe(true);
    });

    it('should return error for non-existent file', () => {
      const filePath = path.join(testDir, 'not-exists.txt');
      const now = new Date();

      const result = utimesSync(filePath, now, now);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });

  // Additional tests for better error coverage
  describe('additional error handling tests', () => {
    it('should handle number file descriptor in appendFileSync', async () => {
      const filePath = path.join(testDir, 'append-fd.txt');
      fs.writeFileSync(filePath, 'Hello');
      const fd = fs.openSync(filePath, 'a');

      const result = appendFileSync(fd, ', FD!');
      expect(result.isOk()).toBe(true);

      fs.closeSync(fd);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toBe('Hello, FD!');
    });

    it('should handle number file descriptor in readFileSync', async () => {
      const filePath = path.join(testDir, 'read-fd.txt');
      fs.writeFileSync(filePath, 'FD content');
      const fd = fs.openSync(filePath, 'r');

      const result = readFileSync(fd);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.toString()).toBe('FD content');
      }

      fs.closeSync(fd);
    });

    it('should handle number file descriptor in writeFileSync', async () => {
      const filePath = path.join(testDir, 'write-fd.txt');
      const fd = fs.openSync(filePath, 'w');

      const result = writeFileSync(fd, 'FD write content');
      expect(result.isOk()).toBe(true);

      fs.closeSync(fd);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toBe('FD write content');
    });

    it('should return error when rmdirSync on non-empty directory', () => {
      const dirPath = path.join(testDir, 'non-empty-sync');
      fs.mkdirSync(dirPath);
      fs.writeFileSync(path.join(dirPath, 'file.txt'), 'content');

      const result = rmdirSync(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['DirectoryNotEmptyError']).toContain(result.error.name);
      }
    });

    it('should handle existsSync with special error case', () => {
      // existsSync should never throw, but let's test edge case
      const result = existsSync('');
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(typeof result.value).toBe('boolean');
      }
    });

    it('should handle mkdtemp error case', () => {
      // Try to create temp dir with invalid path (contains null byte)
      const result = mkdtempSync('/invalid/path/with\0null');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['InvalidArgumentError', 'FileNotFoundError', 'IOError']).toContain(
          result.error.name,
        );
      }
    });

    it('should test appendFileSync error with invalid path', () => {
      const invalidPath = path.join(testDir, 'nonexistent-dir', 'file.txt');

      const result = appendFileSync(invalidPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
        expect(result.error.message).toContain('ENOENT');
      }
    });

    it('should test appendFileSync error when appending to directory', () => {
      const dirPath = path.join(testDir, 'append-error-dir');
      fs.mkdirSync(dirPath);

      const result = appendFileSync(dirPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IsADirectoryError']).toContain(result.error.name);
      }
    });

    it('should test writeFileSync error with invalid path', () => {
      const invalidPath = path.join(testDir, 'nonexistent-dir', 'file.txt');

      const result = writeFileSync(invalidPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
        expect(result.error.message).toContain('ENOENT');
      }
    });

    it('should test writeFileSync error when writing to directory', () => {
      const dirPath = path.join(testDir, 'write-error-dir');
      fs.mkdirSync(dirPath);

      const result = writeFileSync(dirPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IsADirectoryError']).toContain(result.error.name);
      }
    });

    it('should test writeFileSync with invalid file descriptor', () => {
      // Test with an invalid file descriptor
      const result = writeFileSync(-1, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IOError', 'InvalidArgumentError']).toContain(result.error.name);
      }
    });

    it('should test appendFileSync with invalid file descriptor', () => {
      // Test with an invalid file descriptor
      const result = appendFileSync(-1, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IOError', 'InvalidArgumentError']).toContain(result.error.name);
      }
    });

    it('should test readFileSync with invalid file descriptor', () => {
      // Test with an invalid file descriptor
      const result = readFileSync(-1);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IOError', 'InvalidArgumentError']).toContain(result.error.name);
      }
    });

    it('should test mkdtempSync with invalid parent directory', () => {
      // Test with a path that doesn't exist
      const invalidParent = path.join(testDir, 'nonexistent', 'temp-');

      const result = mkdtempSync(invalidParent);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.name);
      }
    });
  });
});
