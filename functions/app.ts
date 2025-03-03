// src/app.ts
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Request, Response, NextFunction } from 'express';
import { initProductsTable } from './models/productModel';
import { initCartTable } from './models/cartModel';
import { initOrdersTable } from './models/orderModel';
import { initUsersTable } from './models/userModel';
import { testConnection } from './utils/dbConnection';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'E-commerce Backend API',
      version: '1.0.0',
      description: 'API documentation for the E-commerce application backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    paths: {
      '/auth/login': {
        post: {
          summary: 'Authenticate a user with a Firebase ID token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    idToken: { type: 'string', description: 'Firebase ID token' },
                  },
                  required: ['idToken'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      user: {
                        type: 'object',
                        properties: {
                          uid: { type: 'string' },
                          email: { type: 'string', nullable: true },
                          displayName: { type: 'string', nullable: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Bad request (missing ID token)' },
            '401': { description: 'Unauthorized (invalid or expired token)' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/products': {
        get: {
          summary: 'List all products',
          tags: ['Products'],
          responses: {
            '200': {
              description: 'List of products',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      products: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            price: { type: 'number' },
                            stock: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/products/add': {
        post: {
          summary: 'Add a new product',
          tags: ['Products'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'integer' },
                  },
                  required: ['name', 'price', 'stock'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Product created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      product: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          description: { type: 'string' },
                          price: { type: 'number' },
                          stock: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Bad request (missing required fields)' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/cart': {
        get: {
          summary: 'View user cart',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User cart contents',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      cart: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            userId: { type: 'string' },
                            productId: { type: 'integer' },
                            quantity: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/cart/add': {
        post: {
          summary: 'Add item to cart',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    productId: { type: 'integer' },
                    quantity: { type: 'integer' },
                  },
                  required: ['productId', 'quantity'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Item added to cart',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      cartItem: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          userId: { type: 'string' },
                          productId: { type: 'integer' },
                          quantity: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Bad request (missing or invalid fields)' },
            '401': { description: 'Unauthorized' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/users/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    uid: { type: 'string', description: 'Unique user ID (e.g., Firebase UID)' },
                    email: { type: 'string', nullable: true },
                    displayName: { type: 'string', nullable: true },
                  },
                  required: ['uid'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'User created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      user: {
                        type: 'object',
                        properties: {
                          uid: { type: 'string' },
                          email: { type: 'string', nullable: true },
                          displayName: { type: 'string', nullable: true },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Bad request (e.g., missing UID)' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/users/me': {
        get: {
          summary: 'Get current user',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      user: {
                        type: 'object',
                        properties: {
                          uid: { type: 'string' },
                          email: { type: 'string', nullable: true },
                          displayName: { type: 'string', nullable: true },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized (invalid or missing token)' },
            '404': { description: 'User not found' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/users/{displayName}': {
        get: {
          summary: 'Get user by display name',
          tags: ['Users'],
          parameters: [
            {
              name: 'displayName',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'The display name of the user',
            },
          ],
          responses: {
            '200': {
              description: 'User data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      user: {
                        type: 'object',
                        properties: {
                          uid: { type: 'string' },
                          email: { type: 'string', nullable: true },
                          displayName: { type: 'string', nullable: true },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '404': { description: 'User not found' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/orders/create': {
        post: {
          summary: 'Create an order from cart',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          responses: {
            '201': {
              description: 'Order created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      order: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          userId: { type: 'string' },
                          total: { type: 'number' },
                          status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Bad request (e.g., empty cart)' },
            '401': { description: 'Unauthorized' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/orders/{id}': {
        get: {
          summary: 'Get order by ID',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'Order ID',
            },
          ],
          responses: {
            '200': {
              description: 'Order details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      order: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          userId: { type: 'string' },
                          total: { type: 'number' },
                          status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                      items: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            orderId: { type: 'integer' },
                            productId: { type: 'integer' },
                            quantity: { type: 'integer' },
                            price: { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Order not found' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/orders': {
        get: {
          summary: 'List user orders',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of orders',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      orders: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            userId: { type: 'string' },
                            total: { type: 'number' },
                            status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] },
                            createdAt: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
            '500': { description: 'Internal server error' },
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
          description: 'Firebase ID token in the format "Bearer <token>"',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use routes with their prefixes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Error handling middleware (must come last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the E-commerce Backend!');
});

// Start server and initialize database
app.listen(port, async () => {
  try {
    console.log('Testing database connection...');
    await testConnection();
    
    console.log('Initializing users table...');
    await initUsersTable();    // First: required by orders
    
    console.log('Initializing products table...');
    await initProductsTable(); // Second: required by cart and orders
    
    console.log('Initializing cart table...');
    await initCartTable();     // Third: depends on products
    
    console.log('Initializing orders table...');
    await initOrdersTable();   // Last: depends on users and products
    
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
});