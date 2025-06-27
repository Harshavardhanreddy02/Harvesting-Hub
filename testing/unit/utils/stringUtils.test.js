// Basic utilities testing

// Simple utility functions to test
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatPrice(price) {
  return `₹${Number(price).toFixed(2)}`;
}

function truncate(str, length = 50) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

describe('String Utility Functions', () => {
  describe('capitalize', () => {
    test('capitalizes the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    test('handles empty strings', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });

  describe('formatPrice', () => {
    test('formats a number as a price string', () => {
      expect(formatPrice(10)).toBe('₹10.00');
      expect(formatPrice('25.5')).toBe('₹25.50');
    });
  });

  describe('truncate', () => {
    test('truncates a string if it exceeds the specified length', () => {
      const longString = 'This is a very long string that should be truncated';
      expect(truncate(longString, 10)).toBe('This is a ...');
    });

    test('does not truncate if string is shorter than limit', () => {
      expect(truncate('Short string', 20)).toBe('Short string');
    });

    test('handles empty strings', () => {
      expect(truncate('')).toBe('');
      expect(truncate(null)).toBe('');
    });
  });
});
