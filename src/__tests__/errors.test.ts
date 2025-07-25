import { mapNodeError } from '../errors';
import {
  FileNotFoundError,
  PermissionDeniedError,
  DirectoryNotEmptyError,
  FileAlreadyExistsError,
  NotADirectoryError,
  IsADirectoryError,
  InvalidArgumentError,
  IOError,
  UnknownError,
} from '../errors';

describe('mapNodeError', () => {
  it('should map ENOENT to FileNotFoundError', () => {
    const nodeError = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
    nodeError.code = 'ENOENT';
    nodeError.path = '/test/file.txt';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(FileNotFoundError);
    expect(result.name).toBe('FileNotFoundError');
    expect(result.path).toBe('/test/file.txt');
    expect(result.cause).toBe(nodeError);
  });

  it('should map EACCES to PermissionDeniedError', () => {
    const nodeError = new Error('EACCES: permission denied') as NodeJS.ErrnoException;
    nodeError.code = 'EACCES';

    const result = mapNodeError(nodeError, '/test/file.txt');

    expect(result).toBeInstanceOf(PermissionDeniedError);
    expect(result.name).toBe('PermissionDeniedError');
    expect(result.path).toBe('/test/file.txt');
  });

  it('should map EPERM to PermissionDeniedError', () => {
    const nodeError = new Error('EPERM: operation not permitted') as NodeJS.ErrnoException;
    nodeError.code = 'EPERM';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(PermissionDeniedError);
    expect(result.name).toBe('PermissionDeniedError');
  });

  it('should map ENOTEMPTY to DirectoryNotEmptyError', () => {
    const nodeError = new Error('ENOTEMPTY: directory not empty') as NodeJS.ErrnoException;
    nodeError.code = 'ENOTEMPTY';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(DirectoryNotEmptyError);
    expect(result.name).toBe('DirectoryNotEmptyError');
  });

  it('should map EEXIST to FileAlreadyExistsError', () => {
    const nodeError = new Error('EEXIST: file already exists') as NodeJS.ErrnoException;
    nodeError.code = 'EEXIST';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(FileAlreadyExistsError);
    expect(result.name).toBe('FileAlreadyExistsError');
  });

  it('should map ENOTDIR to NotADirectoryError', () => {
    const nodeError = new Error('ENOTDIR: not a directory') as NodeJS.ErrnoException;
    nodeError.code = 'ENOTDIR';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(NotADirectoryError);
    expect(result.name).toBe('NotADirectoryError');
  });

  it('should map EISDIR to IsADirectoryError', () => {
    const nodeError = new Error(
      'EISDIR: illegal operation on a directory',
    ) as NodeJS.ErrnoException;
    nodeError.code = 'EISDIR';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(IsADirectoryError);
    expect(result.name).toBe('IsADirectoryError');
  });

  it('should map EINVAL to InvalidArgumentError', () => {
    const nodeError = new Error('EINVAL: invalid argument') as NodeJS.ErrnoException;
    nodeError.code = 'EINVAL';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(InvalidArgumentError);
    expect(result.name).toBe('InvalidArgumentError');
  });

  it('should map unknown error codes to IOError', () => {
    const nodeError = new Error('EIO: i/o error') as NodeJS.ErrnoException;
    nodeError.code = 'EIO';
    nodeError.syscall = 'open';

    const result = mapNodeError(nodeError);

    expect(result).toBeInstanceOf(IOError);
    expect(result.name).toBe('IOError');
    expect(result.syscall).toBe('open');
    expect(result.code).toBe('EIO');
  });

  it('should handle non-Error objects', () => {
    const result = mapNodeError('string error');

    expect(result).toBeInstanceOf(UnknownError);
    expect(result.name).toBe('UnknownError');
    expect(result.message).toBe('string error');
  });

  it('should handle Error objects without code', () => {
    const error = new Error('Some error');
    const result = mapNodeError(error);

    expect(result).toBeInstanceOf(IOError);
    expect(result.name).toBe('IOError');
    expect(result.message).toBe('Some error');
  });

  it('should use provided path over error path', () => {
    const nodeError = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
    nodeError.code = 'ENOENT';
    nodeError.path = '/original/path.txt';

    const result = mapNodeError(nodeError, '/provided/path.txt');

    expect(result.path).toBe('/provided/path.txt');
  });

  it('should have narrowly typed kind property', () => {
    const nodeError = new Error('ENOTDIR: not a directory') as NodeJS.ErrnoException;
    nodeError.code = 'ENOTDIR';

    const result = mapNodeError(nodeError);

    // This test verifies that the kind is narrowly typed
    expect(result.name).toBe('NotADirectoryError');

    // TypeScript should allow exhaustive checking
    function testExhaustiveSwitch(errorKind: typeof result.name): string {
      switch (errorKind) {
        case 'FileNotFoundError':
          return 'file not found';
        case 'PermissionDeniedError':
          return 'permission denied';
        case 'DirectoryNotEmptyError':
          return 'directory not empty';
        case 'FileAlreadyExistsError':
          return 'file exists';
        case 'NotADirectoryError':
          return 'not a directory';
        case 'IsADirectoryError':
          return 'is a directory';
        case 'InvalidArgumentError':
          return 'invalid argument';
        case 'IOError':
          return 'io error';
        case 'UnknownError':
          return 'unknown error';
        // TypeScript will ensure this is exhaustive
      }
    }

    expect(testExhaustiveSwitch(result.name)).toBe('not a directory');
  });
});
