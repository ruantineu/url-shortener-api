const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
}));
app.use(express.json());

// Swagger setup
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'URL Shortener API',
    version: '1.0.0',
    description: 'API for shortening URLs',
  },
  servers: [{ url: process.env.BASE_URL }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered' },
          '400': { description: 'Invalid input' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login a user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/short': {
      post: {
        summary: 'Shorten a URL',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  original_url: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'URL shortened' },
          '400': { description: 'Invalid URL' },
        },
      },
    },
    '/urls': {
      get: {
        summary: 'List user URLs',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of URLs' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/urls/{id}': {
      put: {
        summary: 'Update a URL',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  original_url: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'URL updated' },
          '400': { description: 'Invalid input' },
          '404': { description: 'URL not found' },
        },
      },
      delete: {
        summary: 'Delete a URL',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'URL deleted' },
          '404': { description: 'URL not found' },
        },
      },
    },
    '/{short_url}': {
      get: {
        summary: 'Redirect to original URL',
        parameters: [
          {
            name: 'short_url',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '302': { description: 'Redirect to original URL' },
          '404': { description: 'URL not found' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', authRoutes);
app.use('/', urlRoutes);

// Database sync
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at ${process.env.BASE_URL}/api-docs`);
});