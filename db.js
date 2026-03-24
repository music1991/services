const { neon } = require('@neondatabase/serverless');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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


async function saveResourceToDB({ title, url, type }) {
  try {
    // IMPORTANTE: Asegúrate de que los nombres de las columnas coincidan 
    // exactamente con los de tu tabla en Neon (Case-sensitive)
    const result = await sql`
      INSERT INTO resources (title, url, type, created_at)
      VALUES (${title}, ${url}, ${type}, NOW())
      RETURNING *;
    `;

    // Neon Serverless devuelve un array. Verificamos que no esté vacío.
    if (!result || result.length === 0) {
      throw new Error("La base de datos no devolvió el recurso creado.");
    }

    return result[0]; 
  } catch (error) {
    // Esto imprimirá el error REAL en los logs de Vercel (no solo [object Object])
    console.error("❌ Error detallado en Neon SQL:", error);
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

async function patchEvaluationStatusById(evaluationId, newStatus) {
  try {
    console.log(`--- 🔄 Validando flujo: ID ${evaluationId} -> Intento de Status: ${newStatus} ---`);

    // 1. Obtener el estado actual
    const currentRecord = await sql`
      SELECT status FROM evaluations WHERE id = ${evaluationId}
    `;

    if (currentRecord.length === 0) {
      return { success: false, message: "Evaluación no encontrada 1" };
    }

    const currentStatus = Number(currentRecord[0].status);
    const targetStatus = Number(newStatus);

    // 2. Controlar si ya tiene el estado o uno superior (Evita retrocesos)
    if (currentStatus >= targetStatus) {
      return {
        success: true, 
        message: `Sin cambios: El estado actual (${currentStatus}) es igual o superior al solicitado (${targetStatus}).`,
        alreadyInStatus: true,
        currentStatus
      };
    }

    // 3. Controlar que el avance sea escalonado (Solo permite N + 1)
    // Si quieres permitir saltos (ej: de 0 a 2), elimina esta validación.
    if (targetStatus !== currentStatus + 1) {
      return {
        success: false,
        message: `Movimiento inválido: No puedes pasar de ${currentStatus} a ${targetStatus}. Debe ser secuencial.`,
        currentStatus
      };
    }

    // 4. Si pasó las validaciones, ejecutamos el UPDATE
    const result = await sql`
      UPDATE evaluations
      SET 
        status = ${targetStatus},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${evaluationId}
      RETURNING id, status;
    `;

    return {
      success: true,
      message: `Estado actualizado de ${currentStatus} a ${targetStatus}`,
      evaluationId: result[0].id,
      newStatus: result[0].status
    };

  } catch (error) {
    console.error("❌ Error en patchEvaluationStatusById:", error);
    throw error;
  }
}




async function updateEvaluationScoreByEmailAndForm({ email, score, responses }) {
  try {
    console.log(`--- Ejecutando SQL para ${email} ---`);

    const result = await sql`
      UPDATE evaluations
      SET
        score = ${score},
        responses = ${JSON.stringify(responses)},
        status = 2,
        completed_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = (
        SELECT e.id
        FROM evaluations e
        INNER JOIN users u ON u.id = e.user_id
        WHERE u.email = ${email}
          AND e.status = 1
        ORDER BY e.created_at DESC
        LIMIT 1
      )
      RETURNING id;
    `;

    console.log("Resultado del Query (filas afectadas):", result.length);

    return {
      success: result.length > 0,
      evaluationId: result.length > 0 ? result[0].id : null,
    };
  } catch (error) {
    console.error("❌ Error de SQL en updateEvaluationScoreByEmail:", error);
    throw error;
  }
}

module.exports = { 
  saveUserSession, 
  saveResourceToDB, 
  getResourcesFromDB, 
  getResourceByIdFromDB,
  updateEvaluationScoreByEmailAndForm,
  patchEvaluationStatusById
};
