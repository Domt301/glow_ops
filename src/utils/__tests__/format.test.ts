import { formatDuration, formatScore, formatStreak } from '@/utils/format';

describe('format utilities', () => {
  it('rounds and pads scores to two digits', () => {
    expect(formatScore(0)).toBe('00');
    expect(formatScore(7.4)).toBe('07');
    expect(formatScore(87.5)).toBe('88');
    expect(formatScore(100)).toBe('100');
  });

  it('formats minute durations as minutes, hours, or mixed units', () => {
    expect(formatDuration(5)).toBe('5 min');
    expect(formatDuration(60)).toBe('1 hr');
    expect(formatDuration(135)).toBe('2 hr 15 min');
  });

  it('formats streak labels', () => {
    expect(formatStreak(1)).toBe('1-day streak');
    expect(formatStreak(14)).toBe('14-day streak');
  });
});
