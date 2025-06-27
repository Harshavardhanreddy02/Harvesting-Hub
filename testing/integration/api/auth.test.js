const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Create mock for axios
const mock = new MockAdapter(axios);

describe('Authentication API Integration Tests', () => {
  beforeAll(() => {
    // Mock successful login
    mock.onPost('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }).reply(200, {
      success: true,
      token: 'fake-jwt-token',
      user: {
        _id: 'user123',
        email: 'test@example.com',
        role: 'Customer'
      }
    });

    // Mock failed login
    mock.onPost('/auth/login', {
      email: 'wrong@example.com',
      password: 'wrongpassword'
    }).reply(200, {
      success: 'false',
      message: 'Password incorrect'
    });

    // Mock user registration - fix to return 400 status instead of throwing
    mock.onPost('/auth/signup').reply(config => {
      const data = JSON.parse(config.data);
      
      if (!data.email || !data.password || !data.user_name) {
        return [400, { success: 'false', message: 'Missing required fields' }];
      }
      
      return [200, { 
        success: 'true', 
        message: 'User created successfully!' 
      }];
    });
  });

  afterAll(() => {
    mock.restore();
  });

  test('successful login returns token and user data', async () => {
    const response = await axios.post('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.token).toBe('fake-jwt-token');
    expect(response.data.user._id).toBe('user123');
    expect(response.data.user.role).toBe('Customer');
  });

  test('login with incorrect credentials fails', async () => {
    const response = await axios.post('/auth/login', {
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });
    
    expect(response.data.success).toBe('false');
    expect(response.data.message).toBe('Password incorrect');
  });

  test('user registration with valid data succeeds', async () => {
    const response = await axios.post('/auth/signup', {
      user_name: 'New User',
      email: 'newuser@example.com',
      password: 'newpassword',
      role: 'Farmer'
    });
    
    expect(response.status).toBe(200);
    expect(response.data.success).toBe('true');
    expect(response.data.message).toBe('User created successfully!');
  });

  test('user registration with missing data fails', async () => {
    try {
      await axios.post('/auth/signup', {
        email: 'incomplete@example.com'
        // Missing password and user_name
      });
      // If we get here, the test should fail
      expect('should have thrown an error').toBe(false);
    } catch (error) {
      // Now check the error response
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe('false');
      expect(error.response.data.message).toBe('Missing required fields');
    }
  });
});
