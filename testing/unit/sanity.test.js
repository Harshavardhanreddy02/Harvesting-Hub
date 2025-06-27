// Basic sanity test to ensure Jest is working properly

describe('Basic Unit Tests', () => {
  test('Jest is working correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('Async functions work correctly', async () => {
    const result = await Promise.resolve('async test passed');
    expect(result).toBe('async test passed');
  });
});
