import {
  BadRequestError,
  ConflictError,
  DataGsmError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ServerError,
  UnauthorizedError,
} from '../errors';

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
}

export class HttpClient {
  private readonly config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  get<T>(path: string, query?: QueryParams): Promise<T> {
    return this.request<T>({ method: 'GET', path, query });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, body });
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }

  /**
   * 응답 본문이 없는 요청(204 No Content 또는 빈 200)을 보냅니다.
   * 서버가 본문을 보내더라도 무시하고, 에러 응답은 그대로 예외로 던집니다.
   */
  async requestVoid(options: RequestOptions): Promise<void> {
    await this.request<unknown>(options);
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const url = this.buildUrl(options.path, options.query);
    const headers = this.buildHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId =
      this.config.timeout !== undefined
        ? setTimeout(() => controller.abort(), this.config.timeout)
        : undefined;

    try {
      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      if (error instanceof DataGsmError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout', error);
        }
        throw new NetworkError(`Network request failed: ${error.message}`, error);
      }

      throw new NetworkError('Unknown network error');
    }
  }

  private buildUrl(path: string, query?: QueryParams): string {
    const url = new URL(path, this.config.baseUrl);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private buildHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-API-KEY': this.config.apiKey,
      ...this.config.headers,
      ...additionalHeaders,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // 204 No Content 또는 빈 본문은 undefined로 처리한다.
    const text = await response.text();
    let responseData: unknown;
    let isInvalidJson = false;

    try {
      responseData = text ? JSON.parse(text) : undefined;
    } catch {
      isInvalidJson = true;
    }

    if (response.ok) {
      if (isInvalidJson) {
        throw new DataGsmError('Invalid JSON response', response.status, text);
      }
      return responseData as T;
    }

    const errorMessage = this.extractErrorMessage(responseData) || response.statusText;

    switch (response.status) {
      case 400:
        throw new BadRequestError(errorMessage, responseData);
      case 401:
        throw new UnauthorizedError(errorMessage, responseData);
      case 403:
        throw new ForbiddenError(errorMessage, responseData);
      case 404:
        throw new NotFoundError(errorMessage, responseData);
      case 409:
        throw new ConflictError(errorMessage, responseData);
      case 429: {
        const retryAfter = response.headers.get('Retry-After');
        const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
        throw new RateLimitError(errorMessage, retryAfterSeconds, responseData);
      }
      default:
        if (response.status >= 500) {
          throw new ServerError(errorMessage, response.status, responseData);
        }
        throw new DataGsmError(errorMessage, response.status, responseData);
    }
  }

  private extractErrorMessage(data: unknown): string | undefined {
    if (typeof data === 'object' && data !== null) {
      const errorData = data as Record<string, unknown>;
      if (typeof errorData.message === 'string') {
        return errorData.message;
      }
      if (typeof errorData.error === 'string') {
        return errorData.error;
      }
    }
    return undefined;
  }
}
