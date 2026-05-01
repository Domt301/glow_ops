import { daysBetween, formatDate, formatDateShort, todayYmd } from '@/utils/date';

describe('date utilities', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats ISO timestamps into readable dates', () => {
    expect(formatDate('2026-05-01T09:30:00Z')).toBe('May 1, 2026');
    expect(formatDateShort('2026-12-09T12:00:00Z')).toBe('12/9');
  });

  it('rounds calendar-like day differences', () => {
    expect(daysBetween('2026-05-01T00:00:00Z', '2026-05-08T00:00:00Z')).toBe(7);
    expect(daysBetween('2026-05-08T00:00:00Z', '2026-05-01T00:00:00Z')).toBe(-7);
    expect(daysBetween('2026-05-01T08:00:00Z', '2026-05-02T19:00:00Z')).toBe(1);
  });

  it('returns today in YYYY-MM-DD format', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-01T15:45:00Z'));

    expect(todayYmd()).toBe('2026-05-01');
  });
});
