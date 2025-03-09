import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { page, limit, favorite } = req.query;
    const contacts = await contactsService.listContacts(owner, page, limit, favorite);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const contact = await contactsService.getContactById(id, owner);
    if (!contact) throw HttpError(404, 'Not found');
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const removedContact = await contactsService.removeContact(id, owner);
    if (!removedContact) throw HttpError(404, 'Not found');
    res.json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const newContact = await contactsService.addContact(req.body, owner);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const updatedContact = await contactsService.updateContact(id, req.body, owner);
    if (!updatedContact) throw HttpError(404, 'Not found');
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const { id: owner } = req.user;
    if (favorite === undefined) throw HttpError(400, 'Missing field favorite');
    const updatedContact = await contactsService.updateStatusContact(id, { favorite }, owner);
    if (!updatedContact) throw HttpError(404, 'Not found');
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};