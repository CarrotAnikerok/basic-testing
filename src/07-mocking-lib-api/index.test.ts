// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockedGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue({
      get: mockedGet,
    } as unknown as ReturnType<typeof mockedAxios.create>);
  });

  test('should create instance with provided base url', async () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';
    mockedGet.mockResolvedValue({ data: [] });

    await throttledGetDataFromApi('/something');

    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const path = '/something';
    mockedGet.mockResolvedValue({ data: [] });

    await throttledGetDataFromApi(path);

    expect(mockedGet).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const responseData = ['mew', 'mew'];
    mockedGet.mockResolvedValue({ data: responseData });

    const result = await throttledGetDataFromApi('/something');

    expect(result).toBe(responseData);
  });
});
