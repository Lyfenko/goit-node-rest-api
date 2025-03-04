import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import sequelize from '../db/db.js';

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => nanoid(),
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Contact;