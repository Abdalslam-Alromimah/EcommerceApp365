import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes';
import productRoutes from './src/routes/productRoutes';
import cartRoutes from './src/routes/cartRoutes';
import orderRoutes from './src/routes/orderRoutes';
import userRoutes from './src/routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './swagger';

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('E-commerce Backend Live!'));

export const api = functions.https.onRequest(app);