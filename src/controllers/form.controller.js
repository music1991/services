const resourceService = require('../services/form.service');

const handleGoogleFormsWebhook = async (req, res) => {
  try {
    console.log("--- 🚀 NUEVA PETICIÓN WEBHOOK RECIBIDA ---");
    // Imprimimos el body para verificar que Google nos mande email, score y responses
    console.log("Cuerpo (body):", JSON.stringify(req.body, null, 2));

    const { email, score, responses, form_id } = req.body;

    // 1. Validación de seguridad básica
    if (!email || !form_id) {
      console.warn("⚠️ Advertencia: Faltan campos clave (email o form_id)");
      return res.status(400).json({ 
        success: false, 
        message: "Faltan campos obligatorios: email o form_id" 
      });
    }

    console.log(`Intentando actualizar DB para: ${email} | Form: ${form_id}`);

    // 2. Llamada al Service que acabas de crear
    const result = await resourceService.updateEvaluationScore({
      email,
      score: Number(score),
      responses: responses || {},
      googleFormId: form_id
    });

    // 3. Verificación de si se encontró la evaluación en la DB
    if (!result.success) {
      console.error("❌ No se encontró coincidencia en la DB para este usuario/form.");
      return res.status(404).json({ 
        success: false, 
        message: "No se encontró una evaluación pendiente para este usuario y formulario" 
      });
    }

    console.log("✅ Actualización exitosa en la base de datos. ID:", result.evaluationId);
    
    // 4. Respuesta exitosa para que Google sepa que todo salió bien
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
