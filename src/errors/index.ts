export class DataGsmError extends Error {
  public readonly statusCode?: number;
  public readonly response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = 'DataGsmError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, DataGsmError.prototype);
  }
}

export class BadRequestError extends DataGsmError {
  constructor(message: string, response?: unknown) {
    super(message, 400, response);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends DataGsmError {
  constructor(message: string, response?: unknown) {
    super(message, 401, response);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends DataGsmError {
  constructor(message: string, response?: unknown) {
    super(message, 403, response);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends DataGsmError {
  constructor(message: string, response?: unknown) {
    super(message, 404, response);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends DataGsmError {
  constructor(message: string, response?: unknown) {
    super(message, 409, response);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class RateLimitError extends DataGsmError {
  public readonly retryAfter?: number;

  constructor(message: string, retryAfter?: number, response?: unknown) {
    super(message, 429, response);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class ServerError extends DataGsmError {
  constructor(message: string, statusCode: number, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class NetworkError extends DataGsmError {
  public readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
