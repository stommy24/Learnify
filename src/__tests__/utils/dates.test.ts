import { DateUtils } from '@/utils/dates';

describe('DateUtils', () => {
  describe('toISOString', () => {
    it('converts valid Date to ISO string', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      expect(DateUtils.toISOString(date)).toBe('2024-01-01T12:00:00.000Z');
    });

    it('handles null input', () => {
      expect(DateUtils.toISOString(null)).toBeNull();
    });

    it('handles invalid date', () => {
      expect(DateUtils.toISOString(new Date('invalid'))).toBeNull();
    });
  });

  describe('fromISOString', () => {
    it('converts valid ISO string to Date', () => {
      const isoString = '2024-01-01T12:00:00.000Z';
      const result = DateUtils.fromISOString(isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe(isoString);
    });

    it('handles null input', () => {
      expect(DateUtils.fromISOString(null)).toBeNull();
    });

    it('handles invalid ISO string', () => {
      expect(DateUtils.fromISOString('invalid')).toBeNull();
    });
  });

  describe('convertDates', () => {
    it('converts date fields in object', () => {
      const obj = {
        id: '1',
        name: 'Test',
        createdAt: '2024-01-01T12:00:00.000Z',
        updatedAt: '2024-01-01T13:00:00.000Z',
      };

      const result = DateUtils.convertDates(obj, ['createdAt', 'updatedAt']);
      
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.id).toBe('1');
      expect(result.name).toBe('Test');
    });
  });
}); 