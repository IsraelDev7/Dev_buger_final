import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authConfig from '../../config/auth.js';
import prisma from '../../database/index.js';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const userEmailOrPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ message: 'Make sure your password or email are correct' });
    };

    console.log('Session store request body:', request.body);
    if (!(await schema.isValid(request.body))) {
      console.log('Schema validation failed');
      return userEmailOrPasswordIncorrect();
    }

    const { email, password } = request.body;
    console.log('Attempting login for email:', email);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      console.log('User not found in database');
      return userEmailOrPasswordIncorrect();
    }

    console.log('User found, comparing passwords...');
    const isSamePassword = await bcrypt.compare(password, user.password_hash);

    if (!isSamePassword) {
      console.log('Password mismatch');
      return userEmailOrPasswordIncorrect();
    }

    console.log('Login successful for:', email);
    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name, admin: user.admin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
