const db = require('../../db');
/* Services for Resources */
const getAllResources = async () => {
  return await db.getResourcesFromDB();
};

const getResourceById = async (id) => {
  const resource = await db.getResourceByIdFromDB(id);
  if (!resource || resource.length === 0) {
    throw new Error("Recurso no encontrado");
  }
  
  return resource[0];
};

const createResource = async (resourceData) => {
  const result = await db.saveResourceToDB(resourceData);
  return result; 
};

/* Services for form */
const updateEvaluationScore = async (evaluationData) => {
  const result = await db.updateEvaluationScoreByEmail(evaluationData);
  return result;
};

module.exports = { getAllResources, getResourceById, createResource, updateEvaluationScore };
