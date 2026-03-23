const resourceService = require('../services/form.service');

const handleGoogleFormsWebhook = async (req, res) => {
  try {
    console.log("--- 🚀 NUEVA PETICIÓN WEBHOOK RECIBIDA ---");
    console.log("Cuerpo (body):", JSON.stringify(req.body, null, 2));

    const { evaluationId, score, responses } = req.body;

    // Validación básica
    if (!evaluationId) {
      console.warn("⚠️ Advertencia: Falta evaluationId");
      return res.status(400).json({
        success: false,
        message: "Falta el campo obligatorio: evaluationId"
      });
    }

    console.log(`Intentando actualizar DB para evaluationId: ${evaluationId}`);

    const result = await resourceService.updateEvaluationScore({
      evaluationId,
      score: Number(score) || 0,
      responses: responses || {}
    });

    if (!result.success) {
      console.error("❌ No se encontró coincidencia en la DB para ese evaluationId.");
      return res.status(404).json({
        success: false,
        message: "No se encontró la evaluación a actualizar"
      });
    }

    console.log("✅ Actualización exitosa en la base de datos. ID:", result.evaluationId);

    return res.status(200).json({
      success: true,
      message: "Puntaje y respuestas guardados correctamente",
      id: result.evaluationId
    });

  } catch (error) {
    console.error("🔥 ERROR CRÍTICO EN WEBHOOK:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

module.exports = {
  handleGoogleFormsWebhook
};