export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errors: any[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 