import { login } from '../controllers/authControllers.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User.js');

describe('Login Controller', () => {
  let req, res, next;

  beforeEach(() => {

    req = {
      body: {
        email: 'test@example.com',
        password: 'testpassword',
      },
    };

    res = {
      statusCode: 200,
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('повинно повертати статус 200, токен і об\'єкт user з полями email та subscription (рядкових типів)', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@example.com',
      subscription: 'starter',
      password: 'hashedpassword',
    };

    User.findOne.mockResolvedValue(fakeUser);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue('fake-jwt-token');

    User.update.mockResolvedValue([1]);

    await login(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, fakeUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: fakeUser.id },
      process.env.SECRET_KEY,
      { expiresIn: '23h' }
    );
    expect(User.update).toHaveBeenCalledWith(
      { token: 'fake-jwt-token' },
      { where: { id: fakeUser.id } }
    );

    expect(res.json).toHaveBeenCalledWith({
      token: 'fake-jwt-token',
      user: { email: fakeUser.email, subscription: fakeUser.subscription },
    });

    expect(res.statusCode).toBe(200);
  });
});
