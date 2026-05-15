import * as Yup from 'yup';
import prisma from '../../database/index.js';

class ProductController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = request;
    if (!isAdmin) {
      return response.status(401).json({ error: 'User is not admin' });
    }

    const { name, price, category_id, offer, description } = request.body;
    const path = request.file?.filename || null;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category_id: parseInt(category_id),
        path: path || '',
        offer: offer === 'true' || offer === true,
      },
    });

    return response.json(product);
  }

  async update(request, response) {
    const { admin: isAdmin } = request;
    if (!isAdmin) {
      return response.status(401).json({ error: 'User is not admin' });
    }

    const { id } = request.params;
    const { name, price, category_id, offer, description } = request.body;
    const path = request.file?.filename;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category_id) updateData.category_id = parseInt(category_id);
    if (typeof offer !== 'undefined') updateData.offer = offer === 'true' || offer === true;
    if (path) updateData.path = path;

    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
      return response.json(product);
    } catch (err) {
      return response.status(404).json({ error: 'Product not found' });
    }
  }

  async updateRating(request, response) {
    const { id } = request.params;
    const { rating } = request.body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return response.status(400).json({ error: 'Invalid rating. Must be between 1 and 5.' });
    }

    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: { rating },
      });
      return response.json(product);
    } catch (err) {
      return response.status(404).json({ error: 'Product not found' });
    }
  }

  async index(request, response) {
    try {
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { created_at: 'desc' },
      });

      const formattedProducts = products.map((product) => ({
        ...product,
        url_image: product.path ? `/api/product-file/${product.path}` : null,
      }));

      return response.json(formattedProducts);
    } catch (error) {
      return response.status(500).json({ error: 'Failed to load products', message: error.message });
    }
  }
}

export default new ProductController();
