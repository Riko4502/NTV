import { describe, expect, it } from 'vitest';
import { getHealthColor, getSeverityColor } from './health';

describe('Health & Severity Color Utilities', () => {
  describe('getHealthColor', () => {
    it('should return success color for health > 85', () => {
      expect(getHealthColor(90)).toBe('var(--color-success)');
      expect(getHealthColor(86)).toBe('var(--color-success)');
    });

    it('should return warning color for health between 61 and 85', () => {
      expect(getHealthColor(85)).toBe('var(--color-warning)');
      expect(getHealthColor(70)).toBe('var(--color-warning)');
      expect(getHealthColor(61)).toBe('var(--color-warning)');
    });

    it('should return error color for health <= 60', () => {
      expect(getHealthColor(60)).toBe('var(--color-error)');
      expect(getHealthColor(40)).toBe('var(--color-error)');
      expect(getHealthColor(0)).toBe('var(--color-error)');
    });
  });

  describe('getSeverityColor', () => {
    it('should return error color for values > 80 (e.g. CPU/RAM overload)', () => {
      expect(getSeverityColor(85)).toBe('var(--color-error)');
      expect(getSeverityColor(81)).toBe('var(--color-error)');
    });

    it('should return warning color for values between 61 and 80', () => {
      expect(getSeverityColor(80)).toBe('var(--color-warning)');
      expect(getSeverityColor(70)).toBe('var(--color-warning)');
      expect(getSeverityColor(61)).toBe('var(--color-warning)');
    });

    it('should return success color for values <= 60', () => {
      expect(getSeverityColor(60)).toBe('var(--color-success)');
      expect(getSeverityColor(30)).toBe('var(--color-success)');
      expect(getSeverityColor(0)).toBe('var(--color-success)');
    });
  });
});
