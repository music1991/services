const { saveUserSession } = require('../../db');

const usersOnline = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    socket.on('user:login', (userData) => {
      if (!userData || !userData.id) return;

      // Limpiar sesión previa del mismo usuario si reconecta
      for (const [socketId, user] of usersOnline.entries()) {
        if (user.userId === userData.id) {
          usersOnline.delete(socketId);
        }
      }

      usersOnline.set(socket.id, {
        userId: userData.id,
        name: userData.name,
        role: userData.role,
        loginTime: Date.now(),
      });

      io.emit('admin:update-list', Array.from(usersOnline.values()));
    });

    socket.on('disconnect', async () => {
      const user = usersOnline.get(socket.id);

      if (user) {
        const duration = Math.floor((Date.now() - user.loginTime) / 1000);
        if (duration > 0) await saveUserSession(user.userId, duration);
        usersOnline.delete(socket.id);
        io.emit('admin:update-list', Array.from(usersOnline.values()));
      }
    });
  });
};

module.exports = { socketHandler, usersOnline };
