import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateEndDate,
  formatDate,
  getTodayString,
  isValidDateFormat,
  isDateTodayOrLater,
} from './dateUtils';

describe('dateUtils', () => {
  // ============================================
  // Property-Based Tests
  // ============================================

  describe('Property Tests', () => {
    /**
     * **Feature: payment-retry-and-party-date, Property 5: Date Calculation Correctness**
     * **Validates: Requirements 3.1, 3.3**
     * 
     * For any user-selected start date and subscription period of N months (1-12),
     * the calculated end date SHALL equal startDate + N months - 1 day.
     */
    it('Property 5: Date Calculation Correctness - endDate = startDate + months - 1 day', () => {
      fc.assert(
        fc.property(
          // Generate valid start dates (2024-01-01 to 2030-12-31)
          fc.date({
            min: new Date('2024-01-01'),
            max: new Date('2030-12-31'),
          }),
          // Generate months between 1 and 12
          fc.integer({ min: 1, max: 12 }),
          (startDate, months) => {
            const startDateStr = formatDate(startDate);
            const endDateStr = calculateEndDate(startDateStr, months);

            // Calculate expected end date manually
            const expectedEnd = new Date(startDate);
            expectedEnd.setMonth(expectedEnd.getMonth() + months);
            expectedEnd.setDate(expectedEnd.getDate() - 1);
            const expectedEndStr = formatDate(expectedEnd);

            return endDateStr === expectedEndStr;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: payment-retry-and-party-date, Property 6: Date Format Consistency**
     * **Validates: Requirements 3.4**
     * 
     * For any calculated date, the displayed format SHALL match the pattern YYYY-MM-DD.
     */
    it('Property 6: Date Format Consistency - all dates match YYYY-MM-DD pattern', () => {
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

      fc.assert(
        fc.property(
          fc.date({
            min: new Date('2020-01-01'),
            max: new Date('2030-12-31'),
          }),
          fc.integer({ min: 1, max: 12 }),
          (startDate, months) => {
            const startDateStr = formatDate(startDate);
            const endDateStr = calculateEndDate(startDateStr, months);

            // Both dates should match YYYY-MM-DD format
            if (!startDateStr || !endDateStr) return true;
            return (
              dateFormatRegex.test(startDateStr) &&
              dateFormatRegex.test(endDateStr)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: payment-retry-and-party-date, Property 7: Period Range Enforcement**
     * **Validates: Requirements 3.5**
     * 
     * For any party creation, the selectable subscription period SHALL be between 1 and 12 months inclusive.
     */
    it('Property 7: Period Range Enforcement - months outside 1-12 return empty string', () => {
      fc.assert(
        fc.property(
          fc.date({
            min: new Date('2024-01-01'),
            max: new Date('2030-12-31'),
          }),
          fc.integer({ min: -100, max: 0 }), // Invalid months (0 or negative)
          (startDate, invalidMonths) => {
            const startDateStr = formatDate(startDate);
            const endDateStr = calculateEndDate(startDateStr, invalidMonths);

            // Should return empty string for invalid months
            return endDateStr === '';
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * **Feature: payment-retry-and-party-date, Property 8: Button State Based on Selection**
     * **Validates: Requirements 3.6**
     * 
     * For any state where start date OR subscription period is not selected,
     * the "다음" button SHALL be disabled.
     */
    it('Property 8: Button State - empty inputs return empty endDate', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('', null, undefined), // Empty start date
          fc.integer({ min: 1, max: 12 }),
          (emptyStartDate, months) => {
            const endDateStr = calculateEndDate(emptyStartDate, months);
            return endDateStr === '';
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  // ============================================
  // Unit Tests
  // ============================================

  describe('Unit Tests', () => {
    describe('calculateEndDate', () => {
      it('should calculate end date correctly for 1 month', () => {
        expect(calculateEndDate('2024-01-15', 1)).toBe('2024-02-14');
      });

      it('should calculate end date correctly for 6 months', () => {
        expect(calculateEndDate('2024-01-01', 6)).toBe('2024-06-30');
      });

      it('should calculate end date correctly for 12 months', () => {
        expect(calculateEndDate('2024-01-01', 12)).toBe('2024-12-31');
      });

      it('should handle month-end edge cases', () => {
        // Starting from Jan 31, adding 1 month
        expect(calculateEndDate('2024-01-31', 1)).toBe('2024-03-01');
      });

      it('should return empty string for invalid inputs', () => {
        expect(calculateEndDate('', 1)).toBe('');
        expect(calculateEndDate('2024-01-01', 0)).toBe('');
        expect(calculateEndDate('2024-01-01', -1)).toBe('');
        expect(calculateEndDate('invalid-date', 1)).toBe('');
      });
    });

    describe('formatDate', () => {
      it('should format date correctly', () => {
        expect(formatDate(new Date('2024-01-15'))).toBe('2024-01-15');
      });

      it('should pad single digit months and days', () => {
        expect(formatDate(new Date('2024-01-05'))).toBe('2024-01-05');
      });

      it('should return empty string for invalid date', () => {
        expect(formatDate(null)).toBe('');
        expect(formatDate(new Date('invalid'))).toBe('');
      });
    });

    describe('getTodayString', () => {
      it('should return today in YYYY-MM-DD format', () => {
        const today = getTodayString();
        expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    describe('isValidDateFormat', () => {
      it('should return true for valid date format', () => {
        expect(isValidDateFormat('2024-01-15')).toBe(true);
      });

      it('should return false for invalid formats', () => {
        expect(isValidDateFormat('01-15-2024')).toBe(false);
        expect(isValidDateFormat('2024/01/15')).toBe(false);
        expect(isValidDateFormat('')).toBe(false);
        expect(isValidDateFormat(null)).toBe(false);
      });
    });

    describe('isDateTodayOrLater', () => {
      it('should return true for future dates', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        expect(isDateTodayOrLater(formatDate(futureDate))).toBe(true);
      });

      it('should return true for today', () => {
        expect(isDateTodayOrLater(getTodayString())).toBe(true);
      });

      it('should return false for past dates', () => {
        expect(isDateTodayOrLater('2020-01-01')).toBe(false);
      });
    });
  });
});
