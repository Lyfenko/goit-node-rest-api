import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) throw HttpError(409, 'Email in use');

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }, true);
    const newUser = await User.create({
      email,
      password: hashPassword,
        avatarURL,
    });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(401, 'Email or password is wrong');

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');

    const payload = { id: user.id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.update({ token }, { where: { id: user.id } });

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await User.update({ token: null }, { where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const { id } = req.user;
    await User.update({ subscription }, { where: { id } });
    const user = await User.findByPk(id);
    res.json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { path: tempPath, originalname } = req.file;
    const avatarDir = path.join(process.cwd(), 'public', 'avatars');
    const newFilename = `${id}_${nanoid()}${path.extname(originalname)}`;
    const newPath = path.join(avatarDir, newFilename);

    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${newFilename}`;
    await User.update({ avatarURL }, { where: { id } });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};