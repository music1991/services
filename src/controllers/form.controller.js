const formService = require('../services/form.service');

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];

const handleGoogleFormsWebhook = async (req, res) => {
  try {
    const { email, score, responses } = req.body;

    if (!email || score == null || responses == null) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: email, score, responses',
      });
    }

    const result = await formService.updateEvaluationScore({
      email,
      score: Number(score),
      responses,
    });

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'No se encontró una evaluación en estado in_progress para este usuario',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Puntaje y respuestas guardados correctamente',
      id: result.evaluationId,
    });
  } catch (error) {
    console.error('Error en handleGoogleFormsWebhook:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor',
    });
  }
};

const updateEvaluationStatus = async (req, res) => {
  try {
    const { evaluationId, status } = req.body;

    if (!evaluationId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: evaluationId, status',
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `El estado '${status}' no es válido. Valores permitidos: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const result = await formService.updateEvaluationStatus(evaluationId, status);

    if (!result.success) {
      const isNotFound = result.message?.toLowerCase().includes('no encontrada');
      return res.status(isNotFound ? 404 : 400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({ success: true, message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error en updateEvaluationStatus:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleGoogleFormsWebhook,
  updateEvaluationStatus,
};
