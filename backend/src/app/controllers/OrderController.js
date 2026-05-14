import * as Yup from 'yup';
import prisma from '../../database/index.js';

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;

    const order = await prisma.order.create({
      data: {
        user_id: request.userId,
        products: JSON.stringify(products),
        status: 'Pedido realizado',
      },
    });

    return response.status(201).json(order);
  }

  async update(request, response) {
    const { admin: isAdmin } = request;
    if (!isAdmin) {
      return response.status(401).json({ error: 'User is not admin' });
    }

    const { id } = request.params;
    const { status } = request.body;

    try {
      const order = await prisma.order.update({
        where: { id },
        data: { status },
      });
      return response.json(order);
    } catch (err) {
      return response.status(404).json({ error: 'Order not found' });
    }
  }

  async index(request, response) {
    const orders = await prisma.order.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { created_at: 'desc' },
    });

    return response.json(orders);
  }
}

export default new OrderController();
