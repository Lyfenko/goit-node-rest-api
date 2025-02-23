import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.join(process.cwd(), 'db', 'contacts.json');

async function listContacts() {
    try {
        const data = await readFile(contactsPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading contacts:', err.message);
        return [];
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        const contact = contacts.find(c => c.id === contactId);
        return contact || null;
    } catch (err) {
        console.error('Error finding contact:', err.message);
        return null;
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        const newContacts = contacts.filter(c => c.id !== contactId);

        if (contacts.length === newContacts.length) {
            console.log(`❌ Contact with ID ${contactId} not found`);
            return null;
        }

        await writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
        return contacts.find(c => c.id === contactId);
    } catch (err) {
        console.error('Error removing contact:', err.message);
        return null;
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const newContact = { id: nanoid(), name, email, phone };
        const newContacts = [...contacts, newContact];

        await writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
        return newContact;
    } catch (err) {
        console.error('Error adding contact:', err.message);
        return null;
    }
}

async function updateContact(contactId, updatedData) {
    try {
        const contacts = await listContacts();
        const index = contacts.findIndex(c => c.id === contactId);

        if (index === -1) {
            console.log(`❌ Contact with ID ${contactId} not found`);
            return null;
        }

        const updatedContact = { ...contacts[index], ...updatedData };
        contacts[index] = updatedContact;

        await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return updatedContact;
    } catch (err) {
        console.error('Error updating contact:', err.message);
        return null;
    }
}

export { listContacts, getContactById, removeContact, addContact, updateContact };