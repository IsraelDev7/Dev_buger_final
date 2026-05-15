import * as Yup from 'yup';
import prisma from '../../database/index.js';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
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

    const { name } = request.body;
    const path = request.file?.filename || '';

    const categoryExists = await prisma.category.findFirst({ where: { name } });
    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name, path },
    });

    return response.json(category);
  }

  async index(request, response) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });

      const formattedCategories = categories.map((category) => ({
        ...category,
        url_image: category.path ? `/api/category-file/${category.path}` : null,
      }));

      return response.json(formattedCategories);
    } catch (error) {
      return response.status(500).json({ error: 'Failed to load categories', message: error.message });
    }
  }
}

export default new CategoryController();
