export function formatScore(n: number): string {
  return String(Math.round(n)).padStart(2, '0');
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

export function formatStreak(days: number): string {
  return `${days}-day streak`;
}
