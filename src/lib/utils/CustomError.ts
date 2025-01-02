export class CustomError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'CustomError';
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  static fromError(error: Error): CustomError {
    return new CustomError('UNKNOWN_ERROR', error.message);
  }
} 