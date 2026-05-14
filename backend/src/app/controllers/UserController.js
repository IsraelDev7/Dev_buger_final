import { v4 } from 'uuid';
import * as Yup from 'yup';
import prisma from '../../database/index.js';
import bcrypt from 'bcrypt';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = request.body;

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return response.status(409).json({ error: 'User already exists' });
    }

    const password_hash = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        id: v4(),
        name,
        email,
        password_hash,
        admin: admin || false,
      },
    });

    return response.status(201).json({ id: user.id, name, email, admin: user.admin });
  }
}

export default new UserController();
