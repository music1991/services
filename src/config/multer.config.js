const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

let storage;

// Forzamos Cloudinary si existen las credenciales, ideal para Vercel
const useCloudinary = process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY;

if (useCloudinary) {
  // --- CONFIGURACIÓN PARA PRODUCCIÓN (VERCEL / CLOUDINARY) ---
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      // Determinamos el formato dinámicamente o dejamos que Cloudinary lo maneje
      const extension = path.extname(file.originalname).substring(1).toLowerCase();
      
      return {
        folder: 'recursos_app',
        // 'auto' permite subir PDFs, Docs y Fotos sin errores de formato
        resource_type: 'auto', 
        public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/\s+/g, '_')}`,
        // Formatos permitidos explícitamente
        allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg', 'zip']
      };
    },
  });
  console.log("☁️ Multer configurado con Cloudinary Storage");

} else {
  // --- CONFIGURACIÓN PARA DESARROLLO (LOCAL / DISK) ---
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const cleanName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${Date.now()}-${cleanName}`);
    }
  });
  console.log("📁 Multer configurado con Disk Storage Local");
}

// Configuración final de Multer
const upload = multer({ 
  storage: storage,
  limits: { 
    // Ojo: Vercel Free corta peticiones de > 4.5MB antes de llegar aquí
    fileSize: 10 * 1024 * 1024 
  } 
});

module.exports = upload;
