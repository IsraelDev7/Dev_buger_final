import express from 'express';
import cors from 'cors';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
    this.app.use((err, req, res, next) => {
      console.error('--- Global Error Handler ---');
      console.error(err);
      return res.status(500).json({ error: 'Internal server error', message: err.message });
    });
  }
}

export default new App().app;
