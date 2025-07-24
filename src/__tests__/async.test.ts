import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {
  writeFile,
  readFile,
  mkdir,
  rmdir,
  unlink,
  rename,
  appendFile,
  stat,
  access,
  rm,
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
        expect(['FileNotFoundError', 'UnknownError']).toContain(result.error.kind);
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
        expect(['FileNotFoundError', 'UnknownError']).toContain(result.error.kind);
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
        expect(['FileAlreadyExistsError', 'UnknownError']).toContain(result.error.kind);
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
        expect(['FileNotFoundError', 'UnknownError']).toContain(result.error.kind);
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
        expect(['FileNotFoundError', 'UnknownError']).toContain(result.error.kind);
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
        expect(['FileNotFoundError', 'UnknownError']).toContain(result.error.kind);
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
});
