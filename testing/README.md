# Harvest Hub Testing

This directory contains the test suite for the Harvest Hub application, focusing on unit tests and integration tests.

## Testing Strategy

We've implemented two main types of tests:

1. **Unit Tests**: Testing individual functions in isolation
   - These tests are fast and focused on specific logic
   - Ideal for testing business logic, utility functions, and reducer behavior

2. **Integration Tests**: Testing how components work together
   - API integration tests with mocked responses
   - Tests the data flow between different parts of the application

## Running Tests

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests with CI configuration
npm run test:ci
```

## Test Structure

- `/unit`: Unit tests for individual functions and components
  - `/utils`: Tests for utility functions
  - `/context`: Tests for context providers and reducers

- `/integration`: Integration tests for API endpoints and component interactions
  - `/api`: Tests for API endpoints with mocked responses

## Coverage Reports

After running tests, a coverage report is generated in the `/coverage` directory. Open `coverage/lcov-report/index.html` in a browser to view the detailed report.

## Troubleshooting

If you encounter the error `sh: 1: jest: not found`, run:

```bash
npm install --legacy-peer-deps
```

If that doesn't work, install Jest globally:

```bash
npm install -g jest
```

## CI/CD Integration

This test suite is integrated with GitHub Actions for continuous integration. When code is pushed to the main branches, tests are automatically run. See the workflow configuration in `.github/workflows/ci.yml`.

## CI/CD Implementation Details

Our CI/CD pipeline uses GitHub Actions and consists of the following stages:

### 1. Test Stage
- Automatically runs whenever code is pushed to the repository
- Executes all unit and integration tests
- Generates code coverage reports
- Fails the build if tests don't pass

### 2. Build Stage
- Triggered after successful test completion
- Builds the application for production
- Creates Docker images for containerization
- Saves artifacts for deployment

### 3. Deploy Stage (Setup Required)
- Currently configured for manual deployment
- Can be extended to support automatic deployment to:
  - Heroku
  - AWS
  - Google Cloud
  - Azure
  - Vercel or Netlify (for frontend)

## Setting Up CI/CD

To complete the CI/CD setup:

1. Ensure your GitHub repository has the following secrets configured:
   - `NPM_TOKEN`: For accessing private npm packages (if any)
   - `DOCKER_USERNAME` and `DOCKER_PASSWORD`: For pushing Docker images

2. Choose a deployment platform and add its credentials as secrets:
   - For Heroku: `HEROKU_API_KEY`
   - For AWS: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
   - For GCP: `GCP_SA_KEY`

3. Update the workflow file to include deployment steps specific to your chosen platform.

4. Create a Dockerfile at the project root if you want to use container-based deployment.

## Example GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, master, development ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd testing
          npm install --legacy-peer-deps
          
      - name: Run tests
        run: |
          cd testing
          npm test
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: testing/coverage/
          
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build frontend
        run: |
          cd client
          npm install --legacy-peer-deps
          npm run build
          
      - name: Build Docker image
        run: |
          docker build -t harvest-hub:latest .
          
      - name: Save Docker image
        run: |
          docker save harvest-hub:latest > harvest-hub-image.tar
          
      - name: Upload Docker image
        uses: actions/upload-artifact@v3
        with:
          name: docker-image
          path: harvest-hub-image.tar
          
  # Uncomment and configure when ready for automatic deployment
  # deploy:
  #   needs: build
  #   runs-on: ubuntu-latest
  #   
  #   steps:
  #     - name: Download Docker image
  #       uses: actions/download-artifact@v3
  #       with:
  #         name: docker-image
  #     
  #     - name: Load Docker image
  #       run: |
  #         docker load < harvest-hub-image.tar
  #     
  #     - name: Deploy to your platform
  #       run: |
  #         # Add deployment commands here
```
