import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to check which API routes are actually implemented
const getImplementedRoutes = () => {
  const backendDir = join(__dirname, '..');
  const routesDir = join(backendDir, 'routes');
  const controllersDir = join(backendDir, 'controllers');
  
  // Get list of route files that exist
  const routeFiles = fs.existsSync(routesDir) ? 
    fs.readdirSync(routesDir)
      .filter(file => file.endsWith('.js') || file.endsWith('.route.js'))
      .map(file => file.replace('.route.js', '').replace('.js', '')) : [];
      
  // Get list of controller files that exist
  const controllerFiles = fs.existsSync(controllersDir) ?
    fs.readdirSync(controllersDir)
      .filter(file => file.endsWith('.js'))
      .map(file => file.replace('.js', '')) : [];
      
  return {
    routeFiles,
    controllerFiles
  };
};

// Get implemented routes
const { routeFiles, controllerFiles } = getImplementedRoutes();
console.log('✓ Detected route files:', routeFiles);
console.log('✓ Detected controller files:', controllerFiles);

// Exclude rating documentation if it's not implemented
const excludedDocs = [];
if (!routeFiles.includes('rating') && !controllerFiles.includes('rating')) {
  excludedDocs.push('rating');
  console.log('⚠️ Rating routes not implemented, excluding from documentation');
}

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Harvest Hub API Documentation',
      version: '1.0.0',
      description: 'API documentation for Harvest Hub - connecting farmers and consumers',
      contact: {
        name: 'Harvest Hub Team',
        url: 'https://harvesthub.com',
        email: 'support@harvesthub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: "Bearer your-token-here"'
        }
      }
    }
  },
  apis: [
    // Only include routes documentation files that are actually implemented
    ...routeFiles.map(route => join(__dirname, 'routes', `${route}.js`))
      .filter(path => !excludedDocs.some(excl => path.includes(excl)) && fs.existsSync(path)),
    
    // Include all model documentation
    join(__dirname, 'models', '*.js')
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Middleware to help with token retrieval from cookies/localStorage for Swagger UI
  app.use('/api-docs', (req, res, next) => {
    // You can add custom middleware here to pass tokens from cookies if needed
    next();
  });

  // Swagger UI with enhanced options for authorization
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .authorization__btn { display: block; }
      .auth-wrapper { margin: 1em 0; }
      .auth-container { margin: 0 0 1em 0; }
      .auth-container .wrapper { margin-top: 1em; }
    `,
    customSiteTitle: 'Harvest Hub API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      withCredentials: true
    },
    // Add a custom HTML snippet with instructions for authentication
    customfavIcon: null,
    customJs: null,
    customCssUrl: null,
    customfavIconUrl: null,
    beforeContext: () => {
      return `
        <div style="padding: 1em; background-color: #e8f4ff; border-left: 4px solid #0078d7; margin-bottom: 1em;">
          <h3 style="margin-top: 0;">Authentication Instructions</h3>
          <p>Several API endpoints require authentication. Follow these steps to authorize:</p>
          <ol style="margin-bottom: 0;">
            <li>Log in using the POST /api/auth/login endpoint to get a token</li>
            <li>Click the Authorize button (🔓) at the top right</li>
            <li>In the "bearerAuth (JWT)" section, enter your token in the format: <code>Bearer your-token-here</code></li>
            <li>Click "Authorize" then "Close"</li>
            <li>Now you can use protected endpoints</li>
          </ol>
        </div>
      `;
    }
  }));

  console.log('📚 Swagger documentation available at /api-docs');
  console.log('🔐 Secure endpoints can be tested by clicking the "Authorize" button');
};

export default setupSwagger;
