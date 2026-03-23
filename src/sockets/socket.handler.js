const { saveUserSession } = require('../../db');
const usersOnline = new Map();

// 1. Definimos la función con un nombre
const socketHandler = (io) => {
  console.log("✅ Socket Handler inicializado y esperando conexiones...");

  io.on("connection", (socket) => {
    console.log(`🔌 Nuevo intento de conexión: ID ${socket.id}`);

    socket.on("user:login", (userData) => {
      console.log(`👤 Intento de Login recibido de:`, userData);

      if (!userData || !userData.id) {
        console.log("⚠️ Login fallido: Datos incompletos");
        return;
      }

      // Limpiar duplicados
      for (let [socketId, user] of usersOnline.entries()) {
        if (user.userId === userData.id) {
          usersOnline.delete(socketId);
        }
      }

      usersOnline.set(socket.id, {
        userId: userData.id,
        name: userData.name,
        role: userData.role,
        loginTime: Date.now()
      });

      console.log(`✅ Usuario ${userData.name} conectado. Total online: ${usersOnline.size}`);
      io.emit("admin:update-list", Array.from(usersOnline.values()));
    });

    socket.on("disconnect", async (reason) => {
      const user = usersOnline.get(socket.id);
      console.log(`❌ Socket ${socket.id} desconectado. Motivo: ${reason}`);

      if (user) {
        const duration = Math.floor((Date.now() - user.loginTime) / 1000);
        if (duration > 0) await saveUserSession(user.userId, duration);
        usersOnline.delete(socket.id);
        io.emit("admin:update-list", Array.from(usersOnline.values()));
      }
    });
  });
};

// 2. EXPORTAMOS COMO OBJETO (Esto es lo que arregla el error en index.js)
module.exports = { socketHandler, usersOnline };
