import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {
  access,
  appendFile,
  chmod,
  chown,
  copyFile,
  cp,
  lchmod,
  lchown,
  link,
  lstat,
  lutimes,
  mkdir,
  mkdtemp,
  open,
  opendir,
  readdir,
  readFile,
  readlink,
  realpath,
  rename,
  rm,
  rmdir,
  stat,
  symlink,
  truncate,
  unlink,
  utimes,
  watch,
  writeFile,
} from '../async';

describe('async fs wrappers', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'neverthrow-fs-async-test-'));
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('writeFile and readFile', () => {
    it('should write and read a text file', async () => {
      const filePath = path.join(testDir, 'test.txt');
      const content = 'Hello, Async World!';

      const writeResult = await writeFile(filePath, content);
      expect(writeResult.isOk()).toBe(true);

      const readResult = await readFile(filePath, 'utf8');
      expect(readResult.isOk()).toBe(true);
      if (readResult.isOk()) {
        expect(readResult.value).toBe(content);
      }
    });

    it('should write and read a buffer', async () => {
      const filePath = path.join(testDir, 'test.bin');
      const content = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

      const writeResult = await writeFile(filePath, content);
      expect(writeResult.isOk()).toBe(true);

      const readResult = await readFile(filePath);
      expect(readResult.isOk()).toBe(true);
      if (readResult.isOk()) {
        expect(Buffer.compare(readResult.value, content)).toBe(0);
      }
    });

    it('should return error when reading non-existent file', async () => {
      const filePath = path.join(testDir, 'non-existent.txt');

      const result = await readFile(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
        expect(result.error.message).toContain('ENOENT');
        expect(result.error.message).toContain(filePath);
      }
    });
  });

  describe('access', () => {
    it('should succeed for existing file', async () => {
      const filePath = path.join(testDir, 'exists.txt');
      await fs.writeFile(filePath, 'content');

      const result = await access(filePath);
      expect(result.isOk()).toBe(true);
    });

    it('should return error for non-existent file', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = await access(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('mkdir and rmdir', () => {
    it('should create and remove directory', async () => {
      const dirPath = path.join(testDir, 'newdir');

      const mkResult = await mkdir(dirPath);
      expect(mkResult.isOk()).toBe(true);

      const exists = await fs
        .access(dirPath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);

      const rmResult = await rmdir(dirPath);
      expect(rmResult.isOk()).toBe(true);

      const existsAfter = await fs
        .access(dirPath)
        .then(() => true)
        .catch(() => false);
      expect(existsAfter).toBe(false);
    });

    it('should create directory recursively', async () => {
      const dirPath = path.join(testDir, 'a', 'b', 'c');

      const result = await mkdir(dirPath, { recursive: true });
      expect(result.isOk()).toBe(true);

      const exists = await fs
        .access(dirPath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('should return error when creating existing directory', async () => {
      const dirPath = path.join(testDir, 'existing');
      await fs.mkdir(dirPath);

      const result = await mkdir(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileAlreadyExistsError']).toContain(result.error.kind);
        expect(result.error.message).toContain('EEXIST');
      }
    });
  });

  describe('appendFile', () => {
    it('should append to existing file', async () => {
      const filePath = path.join(testDir, 'append.txt');
      await fs.writeFile(filePath, 'Hello');

      const result = await appendFile(filePath, ', Async World!');
      expect(result.isOk()).toBe(true);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toBe('Hello, Async World!');
    });

    it('should create file if not exists', async () => {
      const filePath = path.join(testDir, 'new-append.txt');

      const result = await appendFile(filePath, 'New async content');
      expect(result.isOk()).toBe(true);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toBe('New async content');
    });
  });

  describe('rename', () => {
    it('should rename file', async () => {
      const oldPath = path.join(testDir, 'old.txt');
      const newPath = path.join(testDir, 'new.txt');
      await fs.writeFile(oldPath, 'content');

      const result = await rename(oldPath, newPath);
      expect(result.isOk()).toBe(true);

      const oldExists = await fs
        .access(oldPath)
        .then(() => true)
        .catch(() => false);
      expect(oldExists).toBe(false);

      const newExists = await fs
        .access(newPath)
        .then(() => true)
        .catch(() => false);
      expect(newExists).toBe(true);
    });

    it('should return error when renaming non-existent file', async () => {
      const oldPath = path.join(testDir, 'non-existent.txt');
      const newPath = path.join(testDir, 'new.txt');

      const result = await rename(oldPath, newPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('unlink', () => {
    it('should remove file', async () => {
      const filePath = path.join(testDir, 'remove.txt');
      await fs.writeFile(filePath, 'content');

      const result = await unlink(filePath);
      expect(result.isOk()).toBe(true);

      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(false);
    });

    it('should return error when removing non-existent file', async () => {
      const filePath = path.join(testDir, 'non-existent.txt');

      const result = await unlink(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('stat', () => {
    it('should get file stats', async () => {
      const filePath = path.join(testDir, 'stat.txt');
      await fs.writeFile(filePath, 'content');

      const result = await stat(filePath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.isFile()).toBe(true);
        expect(result.value.isDirectory()).toBe(false);
        expect(result.value.size).toBeGreaterThan(0);
      }
    });

    it('should get directory stats', async () => {
      const result = await stat(testDir);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.isFile()).toBe(false);
        expect(result.value.isDirectory()).toBe(true);
      }
    });

    it('should return error for non-existent path', async () => {
      const filePath = path.join(testDir, 'non-existent.txt');

      const result = await stat(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
        expect(result.error.message).toContain('ENOENT');
      }
    });
  });

  describe('rm', () => {
    it('should remove file', async () => {
      const filePath = path.join(testDir, 'remove.txt');
      await fs.writeFile(filePath, 'content');

      const result = await rm(filePath);
      expect(result.isOk()).toBe(true);

      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(false);
    });

    it('should remove directory recursively', async () => {
      const dirPath = path.join(testDir, 'remove-dir');
      await fs.mkdir(dirPath);
      await fs.writeFile(path.join(dirPath, 'file.txt'), 'content');

      const result = await rm(dirPath, { recursive: true });
      expect(result.isOk()).toBe(true);

      const exists = await fs
        .access(dirPath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(false);
    });
  });

  describe('chmod', () => {
    it('should change file permissions', async () => {
      const filePath = path.join(testDir, 'chmod.txt');
      await fs.writeFile(filePath, 'content');

      const result = await chmod(filePath, 0o644);
      expect(result.isOk()).toBe(true);

      const stats = await fs.stat(filePath);
      expect(stats.mode & 0o777).toBe(0o644);
    });

    it('should return error for non-existent file', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = await chmod(filePath, 0o644);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('chown', () => {
    it('should change file ownership', async () => {
      const filePath = path.join(testDir, 'chown.txt');
      await fs.writeFile(filePath, 'content');
      const stats = await fs.stat(filePath);

      const result = await chown(filePath, stats.uid, stats.gid);
      expect(result.isOk()).toBe(true);
    });

    it('should return error for non-existent file', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = await chown(filePath, 1000, 1000);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('copyFile', () => {
    it('should copy file', async () => {
      const srcPath = path.join(testDir, 'source.txt');
      const destPath = path.join(testDir, 'dest.txt');
      const content = 'copy content';
      await fs.writeFile(srcPath, content);

      const result = await copyFile(srcPath, destPath);
      expect(result.isOk()).toBe(true);

      const destContent = await fs.readFile(destPath, 'utf8');
      expect(destContent).toBe(content);
    });

    it('should return error when source does not exist', async () => {
      const srcPath = path.join(testDir, 'not-exists.txt');
      const destPath = path.join(testDir, 'dest.txt');

      const result = await copyFile(srcPath, destPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('cp', () => {
    it('should copy directory recursively', async () => {
      const srcDir = path.join(testDir, 'src-dir');
      const destDir = path.join(testDir, 'dest-dir');
      await fs.mkdir(srcDir);
      await fs.writeFile(path.join(srcDir, 'file.txt'), 'content');

      const result = await cp(srcDir, destDir, { recursive: true });
      expect(result.isOk()).toBe(true);

      const destContent = await fs.readFile(path.join(destDir, 'file.txt'), 'utf8');
      expect(destContent).toBe('content');
    });

    it('should return error when source does not exist', async () => {
      const srcDir = path.join(testDir, 'not-exists');
      const destDir = path.join(testDir, 'dest-dir');

      const result = await cp(srcDir, destDir);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('link', () => {
    it('should create hard link', async () => {
      const srcPath = path.join(testDir, 'link-source.txt');
      const linkPath = path.join(testDir, 'link-dest.txt');
      const content = 'link content';
      await fs.writeFile(srcPath, content);

      const result = await link(srcPath, linkPath);
      expect(result.isOk()).toBe(true);

      const linkContent = await fs.readFile(linkPath, 'utf8');
      expect(linkContent).toBe(content);

      const srcStats = await fs.stat(srcPath);
      const linkStats = await fs.stat(linkPath);
      expect(srcStats.ino).toBe(linkStats.ino);
    });

    it('should return error when source does not exist', async () => {
      const srcPath = path.join(testDir, 'not-exists.txt');
      const linkPath = path.join(testDir, 'link.txt');

      const result = await link(srcPath, linkPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('lchown and lchmod', () => {
    it('should change symlink ownership', async () => {
      const filePath = path.join(testDir, 'lchown.txt');
      const linkPath = path.join(testDir, 'lchown-link.txt');
      await fs.writeFile(filePath, 'content');
      await fs.symlink(filePath, linkPath);
      const stats = await fs.lstat(linkPath);

      const result = await lchown(linkPath, stats.uid, stats.gid);
      expect(result.isOk()).toBe(true);
    });

    // Skip lchmod test as it's not available on all platforms
    it.skip('should change symlink permissions', async () => {
      const filePath = path.join(testDir, 'lchmod.txt');
      const linkPath = path.join(testDir, 'lchmod-link.txt');
      await fs.writeFile(filePath, 'content');
      await fs.symlink(filePath, linkPath);

      const result = await lchmod(linkPath, 0o644);
      expect(result.isOk()).toBe(true);
    });
  });

  describe('lstat', () => {
    it('should get symlink stats', async () => {
      const filePath = path.join(testDir, 'lstat.txt');
      const linkPath = path.join(testDir, 'lstat-link.txt');
      await fs.writeFile(filePath, 'content');
      await fs.symlink(filePath, linkPath);

      const result = await lstat(linkPath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.isSymbolicLink()).toBe(true);
        expect(result.value.isFile()).toBe(false);
      }
    });

    it('should return error for non-existent path', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = await lstat(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('lutimes', () => {
    it('should change symlink timestamps', async () => {
      const filePath = path.join(testDir, 'lutimes.txt');
      const linkPath = path.join(testDir, 'lutimes-link.txt');
      await fs.writeFile(filePath, 'content');
      await fs.symlink(filePath, linkPath);

      const now = new Date();
      const result = await lutimes(linkPath, now, now);
      expect(result.isOk()).toBe(true);
    });
  });

  describe('mkdtemp', () => {
    it('should create temporary directory', async () => {
      const prefix = path.join(testDir, 'temp-');

      const result = await mkdtemp(prefix);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toMatch(/temp-/);
        const exists = await fs
          .access(result.value)
          .then(() => true)
          .catch(() => false);
        expect(exists).toBe(true);
        const stats = await fs.stat(result.value);
        expect(stats.isDirectory()).toBe(true);
      }
    });
  });

  describe('open and FileHandle operations', () => {
    it('should open file and get FileHandle', async () => {
      const filePath = path.join(testDir, 'open.txt');
      await fs.writeFile(filePath, 'content');

      const result = await open(filePath, 'r');
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.fd).toBeGreaterThan(0);
        await result.value.close();
      }
    });

    it('should return error for non-existent file', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = await open(filePath, 'r');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('opendir', () => {
    it('should open directory for scanning', async () => {
      const file1 = path.join(testDir, 'file1.txt');
      await fs.writeFile(file1, 'content1');

      const result = await opendir(testDir);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        let foundFile = false;
        for await (const dirent of result.value) {
          if (dirent.name === 'file1.txt') {
            foundFile = true;
            break;
          }
        }
        expect(foundFile).toBe(true);
        // Note: Dir handle closes automatically when iteration completes
      }
    });

    it('should return error for non-existent directory', async () => {
      const dirPath = path.join(testDir, 'not-exists');

      const result = await opendir(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('readdir', () => {
    it('should read directory contents', async () => {
      const file1 = path.join(testDir, 'file1.txt');
      const file2 = path.join(testDir, 'file2.txt');
      await fs.writeFile(file1, 'content1');
      await fs.writeFile(file2, 'content2');

      const result = await readdir(testDir);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toContain('file1.txt');
        expect(result.value).toContain('file2.txt');
      }
    });

    it('should read directory with withFileTypes option', async () => {
      const file1 = path.join(testDir, 'file1.txt');
      const subdir = path.join(testDir, 'subdir');
      await fs.writeFile(file1, 'content1');
      await fs.mkdir(subdir);

      const result = await readdir(testDir, { withFileTypes: true });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.length).toBeGreaterThan(0);
        const fileEntry = result.value.find((entry) => entry.name === 'file1.txt');
        const dirEntry = result.value.find((entry) => entry.name === 'subdir');
        expect(fileEntry?.isFile()).toBe(true);
        expect(dirEntry?.isDirectory()).toBe(true);
      }
    });

    it('should return error for non-existent directory', async () => {
      const dirPath = path.join(testDir, 'not-exists');

      const result = await readdir(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('readlink', () => {
    it('should read symbolic link', async () => {
      const filePath = path.join(testDir, 'readlink.txt');
      const linkPath = path.join(testDir, 'readlink-link.txt');
      await fs.writeFile(filePath, 'content');
      await fs.symlink(filePath, linkPath);

      const result = await readlink(linkPath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(filePath);
      }
    });

    it('should return error for non-symlink', async () => {
      const filePath = path.join(testDir, 'regular.txt');
      await fs.writeFile(filePath, 'content');

      const result = await readlink(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['InvalidArgumentError']).toContain(result.error.kind);
      }
    });
  });

  describe('realpath', () => {
    it('should resolve real path', async () => {
      const filePath = path.join(testDir, 'realpath.txt');
      const linkPath = path.join(testDir, 'realpath-link.txt');
      await fs.writeFile(filePath, 'content');
      await fs.symlink(filePath, linkPath);

      const result = await realpath(linkPath);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(filePath);
      }
    });

    it('should return error for non-existent path', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = await realpath(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('symlink', () => {
    it('should create symbolic link', async () => {
      const filePath = path.join(testDir, 'symlink.txt');
      const linkPath = path.join(testDir, 'symlink-link.txt');
      const content = 'symlink content';
      await fs.writeFile(filePath, content);

      const result = await symlink(filePath, linkPath);
      expect(result.isOk()).toBe(true);

      const linkContent = await fs.readFile(linkPath, 'utf8');
      expect(linkContent).toBe(content);
      const linkStats = await fs.lstat(linkPath);
      expect(linkStats.isSymbolicLink()).toBe(true);
    });

    it('should return error when target already exists', async () => {
      const filePath = path.join(testDir, 'symlink2.txt');
      const linkPath = path.join(testDir, 'symlink2-link.txt');
      await fs.writeFile(filePath, 'content');
      await fs.writeFile(linkPath, 'existing');

      const result = await symlink(filePath, linkPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileAlreadyExistsError']).toContain(result.error.kind);
      }
    });
  });

  describe('truncate', () => {
    it('should truncate file', async () => {
      const filePath = path.join(testDir, 'truncate.txt');
      const content = 'this is a long content';
      await fs.writeFile(filePath, content);

      const result = await truncate(filePath, 10);
      expect(result.isOk()).toBe(true);

      const truncatedContent = await fs.readFile(filePath, 'utf8');
      expect(truncatedContent).toBe('this is a ');
    });

    it('should return error for non-existent file', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');

      const result = await truncate(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('utimes', () => {
    it('should change file timestamps', async () => {
      const filePath = path.join(testDir, 'utimes.txt');
      await fs.writeFile(filePath, 'content');

      const now = new Date();
      const result = await utimes(filePath, now, now);
      expect(result.isOk()).toBe(true);
    });

    it('should return error for non-existent file', async () => {
      const filePath = path.join(testDir, 'not-exists.txt');
      const now = new Date();

      const result = await utimes(filePath, now, now);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  describe('watch', () => {
    it('should create file watcher', async () => {
      const result = await watch(testDir);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(typeof result.value[Symbol.asyncIterator]).toBe('function');
      }
    });

    // Skip this test as fs.watch doesn't immediately fail for non-existent paths
    it.skip('should return error for non-existent path', async () => {
      const dirPath = path.join(testDir, 'not-exists');

      const result = await watch(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });

  // Additional tests for better error coverage
  describe('additional error handling tests', () => {
    it('should handle FileHandle in appendFile', async () => {
      const filePath = path.join(testDir, 'append-handle.txt');
      await fs.writeFile(filePath, 'Hello');
      const handle = await fs.open(filePath, 'a');

      const result = await appendFile(handle, ', FileHandle!');
      expect(result.isOk()).toBe(true);

      await handle.close();
      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toBe('Hello, FileHandle!');
    });

    it('should handle FileHandle in readFile', async () => {
      const filePath = path.join(testDir, 'handle.txt');
      await fs.writeFile(filePath, 'handle content');
      const handle = await fs.open(filePath, 'r');

      const result = await readFile(handle);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.toString()).toBe('handle content');
      }

      await handle.close();
    });

    it('should handle FileHandle in writeFile', async () => {
      const filePath = path.join(testDir, 'write-handle.txt');
      const handle = await fs.open(filePath, 'w');

      const result = await writeFile(handle, 'FileHandle content');
      expect(result.isOk()).toBe(true);

      await handle.close();
      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toBe('FileHandle content');
    });

    it('should return error when rmdir on non-empty directory', async () => {
      const dirPath = path.join(testDir, 'non-empty');
      await fs.mkdir(dirPath);
      await fs.writeFile(path.join(dirPath, 'file.txt'), 'content');

      const result = await rmdir(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['DirectoryNotEmptyError']).toContain(result.error.kind);
      }
    });

    it('should test appendFile error with invalid path', async () => {
      const invalidPath = path.join(testDir, 'nonexistent-dir', 'file.txt');

      const result = await appendFile(invalidPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
        expect(result.error.message).toContain('ENOENT');
      }
    });

    it('should test appendFile error when appending to directory', async () => {
      const dirPath = path.join(testDir, 'append-error-dir');
      await fs.mkdir(dirPath);

      const result = await appendFile(dirPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IsADirectoryError']).toContain(result.error.kind);
      }
    });

    it('should test writeFile error with invalid path', async () => {
      const invalidPath = path.join(testDir, 'nonexistent-dir', 'file.txt');

      const result = await writeFile(invalidPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
        expect(result.error.message).toContain('ENOENT');
      }
    });

    it('should test writeFile error when writing to directory', async () => {
      const dirPath = path.join(testDir, 'write-error-dir');
      await fs.mkdir(dirPath);

      const result = await writeFile(dirPath, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IsADirectoryError']).toContain(result.error.kind);
      }
    });

    it('should test readFile with closed FileHandle', async () => {
      const filePath = path.join(testDir, 'closed-handle.txt');
      await fs.writeFile(filePath, 'content');
      const handle = await fs.open(filePath, 'r');
      await handle.close();

      const result = await readFile(handle);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IOError']).toContain(result.error.kind);
      }
    });

    it('should test writeFile with closed FileHandle', async () => {
      const filePath = path.join(testDir, 'closed-write-handle.txt');
      const handle = await fs.open(filePath, 'w');
      await handle.close();

      const result = await writeFile(handle, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IOError']).toContain(result.error.kind);
      }
    });

    it('should test appendFile with closed FileHandle', async () => {
      const filePath = path.join(testDir, 'closed-append-handle.txt');
      await fs.writeFile(filePath, 'initial');
      const handle = await fs.open(filePath, 'a');
      await handle.close();

      const result = await appendFile(handle, 'content');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IOError']).toContain(result.error.kind);
      }
    });

    it('should test lchown error with non-existent file', async () => {
      const invalidPath = path.join(testDir, 'nonexistent.txt');

      const result = await lchown(invalidPath, 1000, 1000);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test lchmod error with non-existent file', async () => {
      const invalidPath = path.join(testDir, 'nonexistent.txt');

      const result = await lchmod(invalidPath, 0o644);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError', 'IOError']).toContain(result.error.kind);
      }
    });

    it('should test lutimes error with non-existent file', async () => {
      const invalidPath = path.join(testDir, 'nonexistent.txt');
      const now = new Date();

      const result = await lutimes(invalidPath, now, now);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test rm error with non-existent file', async () => {
      const invalidPath = path.join(testDir, 'nonexistent.txt');

      const result = await rm(invalidPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test additional mkdir error scenarios', async () => {
      // Test mkdir with permission denied by trying to create in /dev
      const result = await mkdir('/dev/test-mkdir');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['PermissionDeniedError', 'FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test chmod error with permission denied', async () => {
      const filePath = path.join(testDir, 'chmod-perm.txt');
      await fs.writeFile(filePath, 'content');

      // Try to chmod with invalid permissions or on read-only filesystem
      const result = await chmod('/dev/null', 0o644);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['PermissionDeniedError', 'IOError']).toContain(result.error.kind);
      }
    });

    it('should test chown error with permission denied', async () => {
      const result = await chown('/dev/null', 0, 0);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['PermissionDeniedError', 'IOError']).toContain(result.error.kind);
      }
    });

    it('should test copyFile error with permission denied on destination', async () => {
      const srcPath = path.join(testDir, 'copy-src.txt');
      await fs.writeFile(srcPath, 'content');

      const result = await copyFile(srcPath, '/dev/null/invalid');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['NotADirectoryError', 'PermissionDeniedError']).toContain(result.error.kind);
      }
    });

    it('should test cp error with invalid source', async () => {
      const result = await cp('/nonexistent/source', path.join(testDir, 'dest'));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test link error with permission denied', async () => {
      const srcPath = path.join(testDir, 'link-src.txt');
      await fs.writeFile(srcPath, 'content');

      const result = await link(srcPath, '/dev/null/invalid');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['NotADirectoryError', 'PermissionDeniedError']).toContain(result.error.kind);
      }
    });

    it('should test mkdir error with invalid parent path', async () => {
      const result = await mkdir('/nonexistent/parent/child');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test opendir error with permission denied', async () => {
      const result = await opendir('/root/.ssh');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['PermissionDeniedError', 'FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test readlink error with regular file', async () => {
      const filePath = path.join(testDir, 'regular-file.txt');
      await fs.writeFile(filePath, 'content');

      const result = await readlink(filePath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['InvalidArgumentError']).toContain(result.error.kind);
      }
    });

    it('should test realpath error with non-existent path', async () => {
      const result = await realpath('/nonexistent/path');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test rename error with cross-device move', async () => {
      const srcPath = path.join(testDir, 'rename-src.txt');
      await fs.writeFile(srcPath, 'content');

      // Try to rename to a location that might cause cross-device error
      const result = await rename(srcPath, '/tmp/nonexistent/dest.txt');
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError', 'PermissionDeniedError']).toContain(result.error.kind);
      }
    });

    it('should test stat error with broken symlink', async () => {
      const linkPath = path.join(testDir, 'broken-link');
      await fs.symlink('/nonexistent/target', linkPath);

      const result = await stat(linkPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });

    it('should test symlink error with existing target', async () => {
      const targetPath = path.join(testDir, 'target.txt');
      const linkPath = path.join(testDir, 'existing-link');
      await fs.writeFile(targetPath, 'content');
      await fs.writeFile(linkPath, 'existing');

      const result = await symlink(targetPath, linkPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileAlreadyExistsError']).toContain(result.error.kind);
      }
    });

    it('should test truncate error with directory', async () => {
      const dirPath = path.join(testDir, 'truncate-dir');
      await fs.mkdir(dirPath);

      const result = await truncate(dirPath, 10);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IsADirectoryError']).toContain(result.error.kind);
      }
    });

    it('should test unlink error with directory', async () => {
      const dirPath = path.join(testDir, 'unlink-dir');
      await fs.mkdir(dirPath);

      const result = await unlink(dirPath);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['IsADirectoryError', 'PermissionDeniedError']).toContain(result.error.kind);
      }
    });

    it('should test utimes error with non-existent file', async () => {
      const invalidPath = path.join(testDir, 'nonexistent.txt');
      const now = new Date();

      const result = await utimes(invalidPath, now, now);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(['FileNotFoundError']).toContain(result.error.kind);
      }
    });
  });
});
