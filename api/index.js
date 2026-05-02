require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const urlBase = process.env.FRONTEND_URL;

const { socketHandler, usersOnline } = require('../src/sockets/socket.handler');
const resourceRoutes = require('../src/routes/resource.routes');
const formRoutes = require('../src/routes/form.routes');
const certificationRoutes = require('../src/routes/certification.routes');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: '/socket.io/',
  cors: {
    origin: urlBase,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
});

app.use(cors({
  origin: urlBase,
  credentials: true,
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

socketHandler(io);

app.use('/api/resources', resourceRoutes);
app.use('/api/form', formRoutes);
app.use('/api/certifications', certificationRoutes);

app.get('/api/online-ids', (req, res) => {
  res.json(Array.from(usersOnline.values()));
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    storage: process.env.CLOUDINARY_NAME ? 'cloudinary' : 'local',
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, '0.0.0.0');

module.exports = app;
