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
    const { title, url, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: title, type',
      });
    }

    let finalUrl;
    if (req.file) {
      finalUrl = process.env.NODE_ENV === 'production'
        ? req.file.path
        : `http://localhost:4000/uploads/${req.file.filename}`;
    } else {
      finalUrl = url || '';
    }

    const newResource = await resourceService.createResource({ title, url: finalUrl, type });

    res.status(200).json({ success: true, data: newResource });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error desconocido en el servidor',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

module.exports = {
  uploadResource,
  getResources,
  getById,
};
