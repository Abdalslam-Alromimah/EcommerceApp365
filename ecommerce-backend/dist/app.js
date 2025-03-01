"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Generate Swagger specification
const swaggerSpec = (0, swagger_jsdoc_1.default)({
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
                                        idToken: {
                                            type: 'string',
                                            description: 'Firebase ID token',
                                        },
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
                        '400': {
                            description: 'Bad request (missing ID token)',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                        '401': {
                            description: 'Unauthorized (invalid or expired token)',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: { type: 'string' },
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
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Still scan for JSDoc, though paths are now explicit
});
// Serve Swagger UI at /api-docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Use the auth routes with the /auth prefix
app.use('/auth', authRoutes_1.default);
// Error handling middleware (must come last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce Backend!');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
//# sourceMappingURL=app.js.map