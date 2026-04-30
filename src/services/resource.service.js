const db = require('../../db');

const getAllResources = async () => {
  return await db.getResourcesFromDB();
};

const getResourceById = async (id) => {
  const resource = await db.getResourceByIdFromDB(id);
  if (!resource) {
    throw new Error('Recurso no encontrado');
  }
  return resource;
};

const createResource = async (resourceData) => {
  return await db.saveResourceToDB(resourceData);
};

module.exports = { getAllResources, getResourceById, createResource };
