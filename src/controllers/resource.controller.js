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
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error desconocido en el servidor",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

module.exports = { 
  uploadResource, 
  getResources,
  getById
};