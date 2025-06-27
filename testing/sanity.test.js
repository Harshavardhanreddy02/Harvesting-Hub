// Basic sanity test to ensure Jest is working

describe('Sanity test', () => {
  test('Jest is working', () => {
    expect(1 + 1).toBe(2);
  });
  
  test('Async test works', async () => {
    const result = await Promise.resolve('async test');
    expect(result).toBe('async test');
  });
});
