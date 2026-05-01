import { generateId } from '@/utils/id';

describe('generateId', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1_714_565_600_000);
    Math.random = jest.fn(() => 0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Math.random = originalRandom;
  });

  it('includes the prefix, timestamp, and six random characters', () => {
    expect(generateId('scn')).toBe('scn_lvns37y8aaaaaa');
  });
});
