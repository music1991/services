const db = require('../../db');

const updateEvaluationScore = async (evaluationData) => {
  try {
    console.log("--- 🛠️ SERVICE: Procesando actualización ---");
    
    const result = await db.updateEvaluationScoreByEmailAndForm(evaluationData);
    
    return result;
  } catch (error) {
    console.error("❌ Error en Resource Service:", error.message);
    throw error;
  }
};

module.exports = {
  updateEvaluationScore
};