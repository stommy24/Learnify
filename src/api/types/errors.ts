export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}

export class APIErrorResponse extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, any>;

  constructor(error: APIError) {
    super(error.message);
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    Object.setPrototypeOf(this, APIErrorResponse.prototype);
  }
} 