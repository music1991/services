const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

// --- SECCIÓN DE SESIONES (TU CÓDIGO ACTUAL) ---
async function saveUserSession(userId, durationSeconds) {
  try {
    await sql`
      INSERT INTO work_sessions (user_id, session_date, duration)
      VALUES (${userId}, CURRENT_DATE, ${durationSeconds})
      ON CONFLICT (user_id, session_date) 
      DO UPDATE SET 
        duration = work_sessions.duration + EXCLUDED.duration;
    `;
    return { success: true };
  } catch (error) {
    console.error("❌ Error en DB (Session):", error);
    return { success: false };
  }
}

// --- NUEVA SECCIÓN DE RECURSOS ---

// 1. Guardar un nuevo recurso
async function saveResourceToDB({ title, url, type }) {
  try {
    const result = await sql`
      INSERT INTO resources (title, url, type, created_at)
      VALUES (${title}, ${url}, ${type}, NOW())
      RETURNING *;
    `;
    
    // 🔍 PRUEBA ESTO: Mira si result es un array o un objeto
    console.log("DB Result Raw:", result[0]); 

    // Neon suele devolver un array directo [ {id: 1, ...} ]
    // Si ves que en la terminal sale [ { ... } ], usa result[0]
    //throw new error("ERROR", result[0])
    return result[0]; 
  } catch (error) {
    console.error("❌ Error en SQL:", error);
    throw error;
  }
}

// 2. Obtener listado completo
async function getResourcesFromDB() {
  try {
    const resources = await sql`
      SELECT id, title, url, type, created_at 
      FROM resources 
      ORDER BY created_at DESC;
    `;
    return resources;
  } catch (error) {
    console.error("❌ Error en DB (Get Resources):", error);
    throw error;
  }
}

// 3. Obtener un recurso por ID
async function getResourceByIdFromDB(id) {
  try {
    const result = await sql`
      SELECT id, title, url, type, created_at 
      FROM resources 
      WHERE id = ${id};
    `;
    return result[0] || null;
  } catch (error) {
    console.error("❌ Error en DB (Get Resource By ID):", error);
    throw error;
  }
}

module.exports = { 
  saveUserSession, 
  saveResourceToDB, 
  getResourcesFromDB, 
  getResourceByIdFromDB 
};
