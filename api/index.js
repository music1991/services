require('dotenv').config(); 
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// 1. Configuración de URLs
// Asegúrate de que FRONTEND_URL en tu .env sea "http://localhost:3000"
const urlBase = process.env.FRONTEND_URL; 

// IMPORTANTE: Desestructuramos el objeto que exportamos en el handler
const { socketHandler, usersOnline } = require('../src/sockets/socket.handler');
const resourceRoutes = require('../src/routes/resource.routes');
const formRoutes = require('../src/routes/form.routes');

const app = express();
const httpServer = createServer(app);

// 2. Configuración de Sockets (Ajustado para CORS y estabilidad)
const io = new Server(httpServer, {
  path: "/socket.io/",
  cors: { 
    origin: urlBase, 
    methods: ["GET", "POST"],
    credentials: true 
  },
  transports: ['polling', 'websocket'] 
});

// Middleware de CORS para la API normal (HTTP)
app.use(cors({ 
  origin: urlBase,
  credentials: true 
}));

app.use(express.json());

// 3. Rutas estáticas (Tal como lo tenías)
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

// 4. Inicialización de Sockets
// Ejecutamos la función pasándole la instancia de 'io'
socketHandler(io);

// 5. Endpoints
app.use('/api/resources', resourceRoutes);

app.use('/api/form', formRoutes)

// Este endpoint usa el Map compartido para saber quién está online
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
    storage: process.env.CLOUDINARY_NAME ? 'cloudinary' : 'local'
  });
});

// 6. Manejo del servidor
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Aceptando conexiones de: ${urlBase}`);
});

module.exports = app;
