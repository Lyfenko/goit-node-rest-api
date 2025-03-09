import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') throw HttpError(401, 'Not authorized');

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(id);
    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, 'Not authorized');
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, 'Not authorized'));
  }
};

export default authenticate;