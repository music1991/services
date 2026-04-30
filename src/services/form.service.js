const db = require('../../db');

const updateEvaluationScore = async (evaluationData) => {
  try {
    return await db.updateEvaluationScoreByEmail(evaluationData);
  } catch (error) {
    console.error('Error en form.service (updateEvaluationScore):', error.message);
    throw error;
  }
};

const updateEvaluationStatus = async (evaluationId, status) => {
  try {
    return await db.patchEvaluationStatusById(evaluationId, status);
  } catch (error) {
    console.error('Error en form.service (updateEvaluationStatus):', error.message);
    throw error;
  }
};

module.exports = {
  updateEvaluationScore,
  updateEvaluationStatus,
};
