const formService = require('../services/form.service');

const handleGoogleFormsWebhook = async (req, res) => {
  try {
    console.log("--- 🚀 NUEVA PETICIÓN WEBHOOK RECIBIDA ---");
    console.log("Cuerpo (body):", JSON.stringify(req.body, null, 2));

    const { email, score, responses } = req.body;

    if (!email) {
      console.warn("⚠️ Advertencia: Falta email");
      return res.status(400).json({
        success: false,
        message: "Falta el campo obligatorio: email",
      });
    }

    console.log(`Intentando actualizar evaluación para email: ${email}`);

    const result = await formService.updateEvaluationScoreByEmail({
      email,
      score: Number(score) || 0,
      responses: responses || {},
    });

    if (!result.success) {
      console.error("❌ No se encontró una evaluación activa para ese usuario.");
      return res.status(404).json({
        success: false,
        message: "No se encontró una evaluación en estado 1 para este usuario",
      });
    }

    console.log("✅ Actualización exitosa en la base de datos. ID:", result.evaluationId);

    return res.status(200).json({
      success: true,
      message: "Puntaje y respuestas guardados correctamente",
      id: result.evaluationId,
    });
  } catch (error) {
    console.error("🔥 ERROR CRÍTICO EN WEBHOOK:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
};

const updateEvaluationStatus = async (req, res) => {
  try {
    const { evaluationId, status } = req.body;

    console.log("DATOS", evaluationId, status)

    // CONTROLAR EL ESTADO
    const result = await formService.updateEvaluationStatus(evaluationId, status);

    if (!result.success) {
      return res.status(404).json({ success: false, message: "Evaluación no encontrada 2" });
    }

    return res.status(200).json({ success: true, message: "Campo 'status' actualizado" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  handleGoogleFormsWebhook,
  updateEvaluationStatus
};