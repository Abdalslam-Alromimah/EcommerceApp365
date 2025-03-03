import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
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
    '/cart/add': {
      post: {
        summary: 'Add item to cart',
        tags: ['Cart'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'integer',
                    description: 'The ID of the product to add to the cart',
                  },
                  quantity: {
                    type: 'integer',
                    description: 'The quantity of the product to add',
                  },
                },
                required: ['productId', 'quantity'],
              },
              example: {
                productId: 2,
                quantity: 1,
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Item added to cart',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    cartItem: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        userId: {
                          type: 'string',
                        },
                        productId: {
                          type: 'integer',
                        },
                        quantity: {
                          type: 'integer',
                        },
                      },
                    },
                  },
                },
                example: {
                  success: true,
                  cartItem: {
                    id: 1,
                    userId: 'vFXtn9nAz7hS1FhMN70iKEhHGhE2',
                    productId: 2,
                    quantity: 1,
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request (missing or invalid fields)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                    },
                  },
                },
                example: {
                  error: 'Unauthorized: No token provided',
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
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
        description: 'Enter the Firebase ID token in the format "Bearer <token>"',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export default options;