import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.js';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import CategoryController from './app/controllers/CategoryController.js';
import OrderController from './app/controllers/OrderController.js';
import StripeController from './app/controllers/StripeController.js';
import authMiddleware from './app/middlewares/auth.js';

const upload = multer(multerConfig);
const routes = new Router();

// Health check
routes.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Public routes
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/products', ProductController.index);
routes.get('/categories', CategoryController.index);

// Protected routes
routes.use(authMiddleware);

routes.post('/products', upload.single('file'), ProductController.store);
routes.put('/products/:id', upload.single('file'), ProductController.update);
routes.patch('/products/:id/rating', ProductController.updateRating);

routes.post('/categories', upload.single('file'), CategoryController.store);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

routes.post('/create-payment-intent', StripeController.store);

export default routes;
