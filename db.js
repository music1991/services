const { neon } = require('@neondatabase/serverless');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const sql = neon(process.env.DATABASE_URL);

const STATUS_ORDER = ['pending', 'in_progress', 'completed'];

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
    console.error('Error en DB (saveUserSession):', error);
    return { success: false };
  }
}

async function saveResourceToDB({ title, url, type }) {
  try {
    const result = await sql`
      INSERT INTO resources (title, url, type, created_at)
      VALUES (${title}, ${url}, ${type}, NOW())
      RETURNING *;
    `;

    if (!result || result.length === 0) {
      throw new Error('La base de datos no devolvió el recurso creado.');
    }

    return result[0];
  } catch (error) {
    console.error('Error en DB (saveResourceToDB):', error);
    throw error;
  }
}

async function getResourcesFromDB() {
  try {
    const resources = await sql`
      SELECT id, title, url, type, created_at
      FROM resources
      ORDER BY created_at DESC;
    `;
    return resources;
  } catch (error) {
    console.error('Error en DB (getResourcesFromDB):', error);
    throw error;
  }
}

async function getResourceByIdFromDB(id) {
  try {
    const result = await sql`
      SELECT id, title, url, type, created_at
      FROM resources
      WHERE id = ${id};
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error en DB (getResourceByIdFromDB):', error);
    throw error;
  }
}

async function patchEvaluationStatusById(evaluationId, newStatus) {
  try {
    const currentRecord = await sql`
      SELECT status FROM evaluations WHERE id = ${evaluationId}
    `;

    if (currentRecord.length === 0) {
      return { success: false, message: 'Evaluación no encontrada' };
    }

    const currentStatus = currentRecord[0].status;
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const targetIndex = STATUS_ORDER.indexOf(newStatus);

    if (currentIndex >= targetIndex) {
      return {
        success: true,
        message: `Sin cambios: el estado actual '${currentStatus}' es igual o posterior al solicitado '${newStatus}'.`,
        alreadyInStatus: true,
        currentStatus,
      };
    }

    // Solo permite avance secuencial (N → N+1)
    if (targetIndex !== currentIndex + 1) {
      return {
        success: false,
        message: `Movimiento inválido: no se puede pasar de '${currentStatus}' a '${newStatus}'. El avance debe ser secuencial.`,
        currentStatus,
      };
    }

    const result = await sql`
      UPDATE evaluations
      SET
        status = ${newStatus},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${evaluationId}
      RETURNING id, status;
    `;

    return {
      success: true,
      message: `Estado actualizado de '${currentStatus}' a '${newStatus}'`,
      evaluationId: result[0].id,
      newStatus: result[0].status,
    };
  } catch (error) {
    console.error('Error en DB (patchEvaluationStatusById):', error);
    throw error;
  }
}

async function updateEvaluationScoreByEmail({ email, score, responses }) {
  try {
    const userResult = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;

    if (!userResult.length) {
      return {
        success: false,
        evaluationId: null,
        message: 'Usuario no encontrado',
      };
    }

    const userId = userResult[0].id;

    const evaluationResult = await sql`
      SELECT id
      FROM evaluations
      WHERE user_id = ${userId}
        AND status = 'in_progress'
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (!evaluationResult.length) {
      return {
        success: false,
        evaluationId: null,
        message: 'No se encontró evaluación en estado in_progress para este usuario',
      };
    }

    const evaluationId = evaluationResult[0].id;

    const updateResult = await sql`
      UPDATE evaluations
      SET
        score = ${score},
        responses = ${JSON.stringify(responses)},
        status = 'completed',
        completed_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${evaluationId}
      RETURNING id;
    `;

    return {
      success: updateResult.length > 0,
      evaluationId: updateResult.length > 0 ? updateResult[0].id : null,
    };
  } catch (error) {
    console.error('Error en DB (updateEvaluationScoreByEmail):', error);
    throw error;
  }
}

module.exports = {
  saveUserSession,
  saveResourceToDB,
  getResourcesFromDB,
  getResourceByIdFromDB,
  updateEvaluationScoreByEmail,
  patchEvaluationStatusById,
};
