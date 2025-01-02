export class DateUtils {
  /**
   * Converts a Date object to an ISO string safely
   */
  static toISOString(date: Date | string | null | undefined): string | null {
    if (!date) return null;
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date');
      }
      return dateObj.toISOString();
    } catch (error) {
      console.error('Error converting date to ISO string:', error);
      return null;
    }
  }

  /**
   * Converts an ISO string to a Date object safely
   */
  static fromISOString(isoString: string | null | undefined): Date | null {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid ISO string');
      }
      return date;
    } catch (error) {
      console.error('Error converting ISO string to date:', error);
      return null;
    }
  }

  /**
   * Converts all date fields in an object from ISO strings to Date objects
   */
  static convertDates<T extends Record<string, any>>(obj: T, dateFields: (keyof T)[]): T {
    const result = { ...obj };
    for (const field of dateFields) {
      if (typeof result[field] === 'string') {
        const date = this.fromISOString(result[field]);
        if (date) {
          result[field] = date as T[keyof T];
        }
      }
    }
    return result;
  }
} 