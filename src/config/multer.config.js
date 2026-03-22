const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Verificación de variables de entorno
const hasCloudinaryConfig = process.env.CLOUDINARY_URL;

// 2. Configurar Cloudinary (usa automáticamente CLOUDINARY_URL)
if (hasCloudinaryConfig) {
  cloudinary.config({
    secure: true
  });
  console.log("✅ Cloudinary configurado con CLOUDINARY_URL");
}


let storage;

if (hasCloudinaryConfig) {
  // CONFIGURACIÓN PARA VERCEL (CLOUDINARY)
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'recursos',      // opcional
        resource_type: 'auto',   // permite PDF, imágenes, etc.
      };
    },
  });

  console.log(" Almacenamiento configurado en Cloudinary");

} else {
  // CONFIGURACIÓN PARA TU PC (LOCAL)
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const cleanName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${Date.now()}-${cleanName}`);
    }
  });
  console.log(" Almacenamiento configurado en disco local");
}

// 2. Configuración de Multer con límites de Vercel
const upload = multer({ 
  storage: storage,
  limits: { 
    // Vercel Free tiene un límite estricto de 4.5MB por petición completa.
    // Ponemos 4MB aquí para dejar margen a los demás campos del body.
    fileSize: 4 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    // Filtro de seguridad para tipos de archivos
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo PDF, imágenes y Word.'));
    }
  }
});

module.exports = upload;
