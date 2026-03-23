const resourceService = require('../services/resource.service');

const getResources = async (req, res) => {
  try {
    const resources = await resourceService.getAllResources();
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourceService.getResourceById(id);
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const uploadResource = async (req, res) => {
  try {
      console.log(" Llega bien por aqui a uploadResource");
    const { title, url, type } = req.body;
    let finalUrl = null;
      console.log(" Llega bien por aqui a uploadResource 2");
    if (req.file) {
      finalUrl = process.env.NODE_ENV === 'production' 
        ? req.file.path 
        : `http://localhost:4000/uploads/${req.file.filename}`;
    } else {
      finalUrl = url;

    }

    console.log("url final", finalUrl)

    if (!finalUrl && !title) {
      return res.status(400).json({ 
        success: false, 
        message: "Debe proporcionar al menos un título o un recurso (archivo/link)." 
      });
    }

    const newResource = await resourceService.createResource({
      title: title || (req.file ? req.file.originalname : "Recurso sin título"),
      url: finalUrl || "",
      type: type || (req.file ? "pdf" : "link")
    });

    res.status(200).json({ 
      success: true, 
      data: newResource 
    });

  } catch (error) {
    // ESTO ES LO QUE DEBES CAMBIAR:
    console.error("ERROR DETALLADO:", error); 
    
    // Si el error viene de la base de datos o Cloudinary, 
    // esto ayudará a que el log de Vercel no sea un simple [object Object]
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error desconocido en el servidor",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

const handleGoogleFormsWebhook = async (req, res) => {
  try {
    console.log("--- 🚀 NUEVA PETICIÓN WEBHOOK RECIBIDA ---");
    console.log("Headers:", req.headers['content-type']);
    console.log("Cuerpo (body):", JSON.stringify(req.body, null, 2));

    const { email, score, responses, form_id } = req.body;

    // Validación rápida para loguear si falta algo
    if (!email || !form_id) {
      console.warn("⚠️ Advertencia: Faltan campos clave (email o form_id)");
    }

    console.log(`Intentando actualizar DB para: ${email} | Form: ${form_id}`);

    const result = await resourceService.updateEvaluationScore({
      email,
      score: Number(score),
      responses: responses || {},
      googleFormId: form_id
    });

    if (!result.success) {
      console.error("❌ No se encontró coincidencia en la DB para este usuario/form.");
      return res.status(404).json({ success: false, message: "No se encontró evaluación pendiente" });
    }

    console.log("✅ Actualización exitosa en la base de datos. ID:", result.evaluationId);
    res.status(200).json({ success: true, message: "Puntaje y respuestas guardados" });

  } catch (error) {
    console.error("🔥 ERROR CRÍTICO EN WEBHOOK:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = { 
  uploadResource, 
  getResources,
  getById,
  handleGoogleFormsWebhook
};