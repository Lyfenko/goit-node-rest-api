import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import sequelize from '../db/db.js';
import User from './User.js';

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
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Contact.belongsTo(User, { foreignKey: 'owner' });
User.hasMany(Contact, { foreignKey: 'owner' });

export default Contact;