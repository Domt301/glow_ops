import { env } from '@/config/env';
import type { ApiError, ApiResult } from '@/types';

export async function mockDelay(ms: number = env.MOCK_LATENCY_MS): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function maybeFail<T>(success: T): ApiResult<T> {
  if (Math.random() < env.MOCK_FAILURE_RATE) {
    const error: ApiError = {
      code: 'NETWORK_ERROR',
      message: 'Simulated mock failure',
    };
    return { ok: false, error };
  }
  return { ok: true, data: success };
}
