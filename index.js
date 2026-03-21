const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const urlBase = "http://localhost:3000";

const resourceRoutes = require('./src/routes/resource.routes');
const socketHandler = require('./src/sockets/socket.handler');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: urlBase, methods: ["GET", "POST"] }
});

app.use(cors({ origin: urlBase }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const usersOnline = socketHandler(io);

app.use('/api/resources', resourceRoutes);

app.get('/api/online-ids', (req, res) => {
  res.json(Array.from(usersOnline.values()));
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor centralizado en http://localhost:${PORT}`);
});
