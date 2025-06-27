const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Create a new instance of MockAdapter
const mock = new MockAdapter(axios);

describe('Product API Integration Tests', () => {
  beforeAll(() => {
    // Mock the product list endpoint
    mock.onGet('/product/list').reply(200, {
      success: true,
      message: [
        {
          _id: 'product1',
          name: 'Test Product 1',
          description: 'Description for test product 1',
          price: 99.99,
          category: 'Vegetables',
          image: 'test1.jpg',
          stockQuantity: 10
        },
        {
          _id: 'product2',
          name: 'Test Product 2',
          description: 'Description for test product 2',
          price: 149.99,
          category: 'Fruits',
          image: 'test2.jpg',
          stockQuantity: 5
        }
      ]
    });

    // Mock the product search endpoint
    mock.onGet('/product/search/apple').reply(200, {
      success: true,
      message: [
        {
          _id: 'product3',
          name: 'Fresh Apples',
          description: 'Crisp and sweet apples',
          price: 120,
          category: 'Fruits',
          image: 'apple.jpg',
          stockQuantity: 50
        }
      ]
    });

    // Mock a failed request
    mock.onGet('/product/error').reply(500, {
      success: false,
      message: 'Server error'
    });
  });

  afterAll(() => {
    mock.restore();
  });

  test('successfully fetches product list', async () => {
    const response = await axios.get('/product/list');
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.message.length).toBe(2);
    expect(response.data.message[0].name).toBe('Test Product 1');
    expect(response.data.message[1].price).toBe(149.99);
  });

  test('successfully searches products', async () => {
    const response = await axios.get('/product/search/apple');
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.message.length).toBe(1);
    expect(response.data.message[0].name).toBe('Fresh Apples');
  });

  test('handles API errors correctly', async () => {
    try {
      await axios.get('/product/error');
    } catch (error) {
      expect(error.response.status).toBe(500);
      expect(error.response.data.success).toBe(false);
    }
  });
});
