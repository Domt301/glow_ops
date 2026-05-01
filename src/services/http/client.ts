import type { ApiResult } from '@/types';

class HttpClient {
  async get<T>(path: string): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.get not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
  async post<T>(path: string, _body: unknown): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.post not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
  async put<T>(path: string, _body: unknown): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.put not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
  async delete<T>(path: string): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.delete not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
}

export const httpClient = new HttpClient();
