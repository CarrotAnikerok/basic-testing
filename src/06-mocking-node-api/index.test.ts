// Uncomment the code below and write your tests
import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const time = 1000;
    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, time);
    expect(setTimeout).toHaveBeenCalledWith(callback, time);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const time = 1000;
    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, time);
    expect(setTimeout).toHaveBeenCalledWith(callback, time);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const time = 1000;
    jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, time);
    expect(setInterval).toHaveBeenCalledWith(callback, time);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const time = 1000;
    jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, time);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(callback, time);

    for (let i = 0; i < 4; i++) {
      jest.runOnlyPendingTimers();
      expect(callback).toHaveBeenCalled();
    }
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join');

    const pathToFile = 'mew.txt';
    await readFileAsynchronously(pathToFile);

    expect(path.join).toHaveBeenCalledWith(expect.anything(), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.mocked(existsSync).mockReturnValue(false);
    const result = await readFileAsynchronously('mew.txt');
    expect(result).toBe(null);
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'mew mew mew';

    jest.mocked(existsSync).mockReturnValue(true);
    jest.mocked(readFile).mockResolvedValue(Buffer.from(fileContent));

    const result = await readFileAsynchronously('mew.txt');

    expect(result).toBe(fileContent);
  });
});
