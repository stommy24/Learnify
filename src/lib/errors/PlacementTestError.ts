export enum PlacementTestErrorCodes {
  TEST_NOT_FOUND = 'TEST_NOT_FOUND',
  TEST_ALREADY_COMPLETED = 'TEST_ALREADY_COMPLETED',
  INVALID_ANSWER = 'INVALID_ANSWER',
  RATE_LIMITED = 'RATE_LIMITED',
  DATABASE_ERROR = 'DATABASE_ERROR'
}

export class PlacementTestError extends Error {
  code: PlacementTestErrorCodes;
  status: number;

  constructor(
    message: string, 
    code: PlacementTestErrorCodes, 
    status: number = 500
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'PlacementTestError';
  }
} 