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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Enriquecer os pedidos com os detalhes dos produtos
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const productsArray = JSON.parse(order.products);
        
        const enrichedProducts = await Promise.all(
          productsArray.map(async (product) => {
            const productDetails = await prisma.product.findFirst({
              where: { id: product.id },
              include: { category: true },
            });

            return {
              id: product.id,
              quantity: product.quantity,
              name: productDetails?.name || 'Produto removido',
              category: productDetails?.category?.name || 'Sem categoria',
              url: productDetails?.path ? `http://localhost:3001/product-file/${productDetails.path}` : '',
              price: productDetails?.price || 0,
            };
          })
        );

        return {
          id: order.id,
          clientName: order.user?.name || 'Cliente',
          status: order.status,
          createdAt: order.created_at,
          products: enrichedProducts,
        };
      })
    );

    return response.json(formattedOrders);
  }
}

export default new OrderController();
