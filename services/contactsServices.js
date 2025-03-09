import Contact from '../models/Contact.js';

export const listContacts = async (owner, page = 1, limit = 20, favorite) => {
  const offset = (page - 1) * limit;
  const where = { owner };
  if (favorite !== undefined) where.favorite = favorite;
  return await Contact.findAll({
    where,
    limit,
    offset,
  });
};

export const getContactById = async (id, owner) => {
  return await Contact.findOne({ where: { id, owner } });
};

export const removeContact = async (id, owner) => {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

export const addContact = async (data, owner) => {
  return await Contact.create({ ...data, owner });
};

export const updateContact = async (id, data, owner) => {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  return await contact.update(data);
};

export const updateStatusContact = async (id, { favorite }, owner) => {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  contact.favorite = favorite;
  await contact.save();
  return contact;
};