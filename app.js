import express from "express";
import morgan from "morgan";
import cors from "cors";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

import contactsRouter from "./routes/contactsRouter.js";
import sequelize from './db/db.js';
import authRouter from './routes/authRouter.js';
import User from './models/User.js';
import Contact from './models/Contact.js';
import gravatar from "gravatar";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
app.use(express.static('public'));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('З\'єднання з базою даних встановлено');

    // Синхронізуємо модель із базою даних
    await sequelize.sync({ alter: true });
    console.log('База даних синхронізована');

    let defaultUser = await User.findOrCreate({
      where: { email: 'default@example.com' },
      defaults: {
        password: await bcrypt.hash('defaultpassword', 10),
        subscription: 'starter',
        avatarURL: gravatar.url('default@example.com', { s: '200', r: 'pg', d: 'mm' }, true),
      },
    });
    defaultUser = defaultUser[0];

    await Contact.update({ owner: defaultUser.id }, { where: { owner: null } });

    await sequelize.sync({ alter: true });

    const contacts = await Contact.findAll();
    if (contacts.length > 0) {
      await Contact.update({ createdAt: new Date() }, { where: {} });
      const { queryInterface } = sequelize;
      await queryInterface.changeColumn('Contacts', 'createdAt', {
        type: DataTypes.DATE,
        allowNull: false,
      });
    }

    console.log('Базу даних успішно ініціалізовано');
  } catch (error) {
    console.error('Помилка ініціалізації бази даних:', error);
    process.exit(1);
  }
}

initializeDatabase().then(() => {
  app.listen(3000, () => {
    console.log("Сервер запущено. Використовуйте наш API на порту: 3000");
  });
});