const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// 1. Configuración de URLs
const urlBase = process.env.FRONTEND_URL || "*"; 

// Ajustamos los require para que suban un nivel desde la carpeta /api
const resourceRoutes = require('../src/routes/resource.routes');
const socketHandler = require('../src/sockets/socket.handler');

const app = express();
const httpServer = createServer(app);

// 2. Configuración de Sockets
const io = new Server(httpServer, {
  cors: { 
    origin: urlBase, 
    methods: ["GET", "POST"],
    credentials: true 
  },
  transports: ['polling', 'websocket'] 
});

app.use(cors({ origin: urlBase }));
app.use(express.json());

// 3. Rutas estáticas (Corregido para Vercel)
// Usamos process.cwd() para asegurar que encuentre la carpeta en la raíz
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

const usersOnline = socketHandler(io);

// 4. Endpoints
app.use('/api/resources', resourceRoutes);

app.get('/api/online-ids', (req, res) => {
  res.json(Array.from(usersOnline.values()));
});

// Endpoint de Salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    // IMPORTANTE: Verifica que este nombre coincida con tu panel de Vercel
    storage: process.env.CLOUDINARY_NAME ? 'cloudinary' : 'local'
  });
});

// 5. Manejo del servidor
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000; // Cambiado a 4000 para no chocar con el front
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor local en http://localhost:${PORT}`);
  });
}

// EXPORTAR ES VITAL PARA VERCEL
module.exports = app;
