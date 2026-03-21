const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Ajuste para tomar URL de entorno o permitir todas en Vercel
const urlBase = process.env.FRONTEND_URL || "*"; 

const resourceRoutes = require('./src/routes/resource.routes');
const socketHandler = require('./src/sockets/socket.handler');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { 
    origin: urlBase, 
    methods: ["GET", "POST"],
    credentials: true 
  }
});

// Configuración de CORS dinámica
app.use(cors({ origin: urlBase }));
app.use(express.json());

// Nota: En Vercel esta carpeta es de solo lectura, Cloudinary se encargará de esto
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const usersOnline = socketHandler(io);

app.use('/api/resources', resourceRoutes);

app.get('/api/online-ids', (req, res) => {
  res.json(Array.from(usersOnline.values()));
});

// Vercel asigna el puerto automáticamente
const PORT = process.env.PORT || 3000; 
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
});
