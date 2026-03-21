const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// 1. Configuración de URLs
const urlBase = process.env.FRONTEND_URL || "*"; 

const resourceRoutes = require('./src/routes/resource.routes');
const socketHandler = require('./src/sockets/socket.handler');

const app = express();
const httpServer = createServer(app);

// 2. Configuración de Sockets (Limitado en Vercel)
const io = new Server(httpServer, {
  cors: { 
    origin: urlBase, 
    methods: ["GET", "POST"],
    credentials: true 
  },
  // Agregamos esto para mejorar la compatibilidad en Vercel
  transports: ['polling', 'websocket'] 
});

app.use(cors({ origin: urlBase }));
app.use(express.json());

// 3. Rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const usersOnline = socketHandler(io);

app.use('/api/resources', resourceRoutes);

app.get('/api/online-ids', (req, res) => {
  res.json(Array.from(usersOnline.values()));
});

// 4. EL CAMBIO CLAVE PARA VERCEL:
// Solo hacemos el .listen si NO estamos en producción (Vercel)
// Si estamos en Vercel, él se encarga de manejar la 'app' exportada.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000; 
  httpServer.listen(PORT, () => {
    console.log(` Servidor local en http://localhost:${PORT}`);
  });
}

// 5. Exportar la app para que Vercel la convierta en Serverless Function
module.exports = app;
