/**
 * SEED — Teams Improve
 * Ejecutar desde la carpeta services/: node seed.js
 *
 * Credenciales generadas:
 *   Admin  → carlos@teamsimprove.com  / Admin2024!
 *   Usuarios → (ver abajo)            / User2024!
 */

require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const sql = neon(process.env.DATABASE_URL);

// ─── IDs fijos para referencias cruzadas ──────────────────────────────────────
const ID = {
  // usuarios
  admin:  'a0000000-0000-0000-0000-000000000001',
  ana:    'a0000000-0000-0000-0000-000000000002',
  juan:   'a0000000-0000-0000-0000-000000000003',
  maria:  'a0000000-0000-0000-0000-000000000004',
  pedro:  'a0000000-0000-0000-0000-000000000005',
  lucia:  'a0000000-0000-0000-0000-000000000006',

  // cursos
  cGit:     'c0000000-0000-0000-0000-000000000001',
  cReact:   'c0000000-0000-0000-0000-000000000002',
  cNode:    'c0000000-0000-0000-0000-000000000003',
  cDocker:  'c0000000-0000-0000-0000-000000000004',
  cTesting: 'c0000000-0000-0000-0000-000000000005',

  // task templates
  ttDoc:     'f0000000-0000-0000-0000-000000000001',
  ttReview:  'f0000000-0000-0000-0000-000000000002',
  ttRefact:  'f0000000-0000-0000-0000-000000000003',
  ttFeature: 'f0000000-0000-0000-0000-000000000004',

  // tasks asignadas
  tsk1: 'd0000000-0000-0000-0000-000000000001',
  tsk2: 'd0000000-0000-0000-0000-000000000002',
  tsk3: 'd0000000-0000-0000-0000-000000000003',
  tsk4: 'd0000000-0000-0000-0000-000000000004',
  tsk5: 'd0000000-0000-0000-0000-000000000005',
  tsk6: 'd0000000-0000-0000-0000-000000000006',

  // evaluation templates
  etGit:     'e0000000-0000-0000-0000-000000000001',
  etReact:   'e0000000-0000-0000-0000-000000000002',
  etTesting: 'e0000000-0000-0000-0000-000000000003',

  // evaluations asignadas
  ev1: 'b0000000-0000-0000-0000-000000000001',
  ev2: 'b0000000-0000-0000-0000-000000000002',
  ev3: 'b0000000-0000-0000-0000-000000000003',
  ev4: 'b0000000-0000-0000-0000-000000000004',
  ev5: 'b0000000-0000-0000-0000-000000000005',

  // training lines
  tlFrontend: '10000000-0000-0000-0000-000000000001',
  tlQA:       '10000000-0000-0000-0000-000000000002',
  tlDevOps:   '10000000-0000-0000-0000-000000000003',

  // training line items
  tliF1: '20000000-0000-0000-0000-000000000001',
  tliF2: '20000000-0000-0000-0000-000000000002',
  tliF3: '20000000-0000-0000-0000-000000000003',
  tliF4: '20000000-0000-0000-0000-000000000004',
  tliQ1: '20000000-0000-0000-0000-000000000005',
  tliQ2: '20000000-0000-0000-0000-000000000006',
  tliQ3: '20000000-0000-0000-0000-000000000007',
  tliD1: '20000000-0000-0000-0000-000000000008',
  tliD2: '20000000-0000-0000-0000-000000000009',

  // certifications
  cert1: '30000000-0000-0000-0000-000000000001',
  cert2: '30000000-0000-0000-0000-000000000002',
};

async function seed() {
  console.log('Iniciando seed...\n');

  const adminHash = await bcrypt.hash('Admin2024!', 10);
  const userHash  = await bcrypt.hash('User2024!',  10);

  console.log('Credenciales:');
  console.log('  Admin → carlos@teamsimprove.com  / Admin2024!');
  console.log('  Users → *@teamsimprove.com       / User2024!\n');

  // ── 1. USERS ──────────────────────────────────────────────────────────────
  console.log('→ users');
  const users = [
    { id: ID.admin, name: 'Carlos Administrador', email: 'carlos@teamsimprove.com', hash: adminHash, role: 'admin' },
    { id: ID.ana,   name: 'Ana García',           email: 'ana@teamsimprove.com',    hash: userHash,  role: 'user'  },
    { id: ID.juan,  name: 'Juan López',           email: 'juan@teamsimprove.com',   hash: userHash,  role: 'user'  },
    { id: ID.maria, name: 'María Rodríguez',      email: 'maria@teamsimprove.com',  hash: userHash,  role: 'user'  },
    { id: ID.pedro, name: 'Pedro Martínez',       email: 'pedro@teamsimprove.com',  hash: userHash,  role: 'user'  },
    { id: ID.lucia, name: 'Lucía Fernández',      email: 'lucia@teamsimprove.com',  hash: userHash,  role: 'user'  },
  ];
  for (const u of users) {
    await sql`
      INSERT INTO users (id, name, email, password_hash, role, verified)
      VALUES (${u.id}, ${u.name}, ${u.email}, ${u.hash}, ${u.role}, true)
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 2. DATA_USER (perfiles) ────────────────────────────────────────────────
  console.log('→ data_user');
  const profiles = [
    { uid: ID.admin, first: 'Carlos',  last: 'Administrador', phone: '+54 381 400-0001', bio: 'Administrador del sistema Teams Improve.', country: 'Argentina', city: 'San Miguel de Tucumán' },
    { uid: ID.ana,   first: 'Ana',     last: 'García',        phone: '+54 381 400-0002', bio: 'Desarrolladora Frontend con 3 años de experiencia en React.',   country: 'Argentina', city: 'Tucumán' },
    { uid: ID.juan,  first: 'Juan',    last: 'López',         phone: '+54 381 400-0003', bio: 'Desarrollador Backend especializado en Node.js y PostgreSQL.',  country: 'Argentina', city: 'Tucumán' },
    { uid: ID.maria, first: 'María',   last: 'Rodríguez',     phone: '+54 381 400-0004', bio: 'QA Engineer con experiencia en testing manual y automatizado.', country: 'Argentina', city: 'Tucumán' },
    { uid: ID.pedro, first: 'Pedro',   last: 'Martínez',      phone: '+54 381 400-0005', bio: 'DevOps Engineer, infraestructura cloud y CI/CD.',                country: 'Argentina', city: 'Tucumán' },
    { uid: ID.lucia, first: 'Lucía',   last: 'Fernández',     phone: '+54 381 400-0006', bio: 'Desarrolladora Fullstack Junior, en proceso de onboarding.',    country: 'Argentina', city: 'Tucumán' },
  ];
  for (const p of profiles) {
    await sql`
      INSERT INTO data_user (user_id, first_name, last_name, phone, bio, country, city)
      VALUES (${p.uid}, ${p.first}, ${p.last}, ${p.phone}, ${p.bio}, ${p.country}, ${p.city})
      ON CONFLICT (user_id) DO NOTHING
    `;
  }

  // ── 3. SECTORS ────────────────────────────────────────────────────────────
  console.log('→ sectors');
  const sectors = ['Desarrollo Frontend', 'Desarrollo Backend', 'QA / Testing', 'DevOps / Infraestructura'];
  for (const name of sectors) {
    await sql`INSERT INTO sectors (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING`;
  }
  const sectorRows = await sql`SELECT id, name FROM sectors ORDER BY id`;
  const sectorId = Object.fromEntries(sectorRows.map(s => [s.name, s.id]));

  // Asignar sectores a usuarios
  const sectorMap = [
    { uid: ID.ana,   sector: 'Desarrollo Frontend' },
    { uid: ID.lucia, sector: 'Desarrollo Frontend' },
    { uid: ID.juan,  sector: 'Desarrollo Backend'  },
    { uid: ID.maria, sector: 'QA / Testing'         },
    { uid: ID.pedro, sector: 'DevOps / Infraestructura' },
  ];
  for (const { uid, sector } of sectorMap) {
    await sql`UPDATE data_user SET sector_id = ${sectorId[sector]} WHERE user_id = ${uid}`;
  }

  // ── 4. PROVIDERS ──────────────────────────────────────────────────────────
  console.log('→ providers');
  const providers = [
    { name: 'Platzi',   website: 'https://platzi.com',   contact: 'empresas@platzi.com' },
    { name: 'Udemy',    website: 'https://udemy.com',    contact: 'business@udemy.com'  },
    { name: 'Coursera', website: 'https://coursera.org', contact: 'enterprise@coursera.org' },
  ];
  for (const p of providers) {
    await sql`INSERT INTO providers (name, website, contact) VALUES (${p.name}, ${p.website}, ${p.contact}) ON CONFLICT (name) DO NOTHING`;
  }
  const provRows = await sql`SELECT id, name FROM providers`;
  const provId = Object.fromEntries(provRows.map(p => [p.name, p.id]));

  // ── 5. COURSES ────────────────────────────────────────────────────────────
  console.log('→ courses');
  const courses = [
    { id: ID.cGit,     title: 'Git y GitHub Avanzado',        description: 'Flujo de trabajo profesional con Git: ramas, rebase, cherry-pick, hooks y GitHub Actions.', source: 'internal',  provider_id: null,              url: null,                                    duration_h: 8,  cost_per_user: 0,    currency: 'ARS' },
    { id: ID.cReact,   title: 'React 19 — De Cero a Experto', description: 'Hooks avanzados, Server Components, Suspense, Context y patrones modernos en React.',         source: 'external',  provider_id: provId['Platzi'],   url: 'https://platzi.com/cursos/react/',      duration_h: 20, cost_per_user: 2500, currency: 'ARS' },
    { id: ID.cNode,    title: 'Node.js y Express REST API',   description: 'Construcción de APIs REST con Node.js, Express 5, autenticación JWT y PostgreSQL.',           source: 'external',  provider_id: provId['Udemy'],    url: 'https://udemy.com/course/nodejs-api',   duration_h: 15, cost_per_user: 3200, currency: 'ARS' },
    { id: ID.cDocker,  title: 'Docker y Kubernetes Básico',   description: 'Contenerización de aplicaciones, Docker Compose, intro a Kubernetes y CI/CD con Docker.',     source: 'internal',  provider_id: null,              url: null,                                    duration_h: 10, cost_per_user: 0,    currency: 'ARS' },
    { id: ID.cTesting, title: 'Testing con Jest y Cypress',   description: 'Unit testing, integration testing y E2E testing. TDD en proyectos JavaScript modernos.',       source: 'external',  provider_id: provId['Coursera'], url: 'https://coursera.org/learn/testing-js', duration_h: 12, cost_per_user: 4100, currency: 'ARS' },
  ];
  for (const c of courses) {
    await sql`
      INSERT INTO courses (id, title, description, source, provider_id, url, duration_h, cost_per_user, currency, created_by)
      VALUES (${c.id}, ${c.title}, ${c.description}, ${c.source}, ${c.provider_id}, ${c.url}, ${c.duration_h}, ${c.cost_per_user}, ${c.currency}, ${ID.admin})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 6. TASK TEMPLATES ─────────────────────────────────────────────────────
  console.log('→ task_templates');
  const taskTemplates = [
    { id: ID.ttDoc,     title: 'Documentar endpoints de API',   description: 'Crear documentación OpenAPI/Swagger para todos los endpoints del módulo asignado.',             type: 'report',  estimated_hours: 4, requirements: JSON.stringify([]) },
    { id: ID.ttReview,  title: 'Code Review — Pull Request',    description: 'Revisar el código del PR asignado: estilo, lógica, seguridad y performance. Dejar comentarios.',  type: 'project', estimated_hours: 2, requirements: JSON.stringify([]) },
    { id: ID.ttRefact,  title: 'Refactoring de módulo legado',  description: 'Refactorizar el módulo indicado aplicando principios SOLID. Mantener los tests en verde.',         type: 'project', estimated_hours: 8, requirements: JSON.stringify([]) },
    { id: ID.ttFeature, title: 'Implementar nueva funcionalidad', description: 'Desarrollar la feature asignada según los criterios de aceptación del ticket.',                 type: 'project', estimated_hours: 6, requirements: JSON.stringify([]) },
  ];
  for (const tt of taskTemplates) {
    await sql`
      INSERT INTO task_templates (id, title, description, type, estimated_hours, requirements, created_by)
      VALUES (${tt.id}, ${tt.title}, ${tt.description}, ${tt.type}, ${tt.estimated_hours}, ${tt.requirements}::jsonb, ${ID.admin})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 7. TASKS ASIGNADAS ────────────────────────────────────────────────────
  console.log('→ tasks');
  const tasks = [
    { id: ID.tsk1, template_id: ID.ttDoc,     user_id: ID.ana,   title: 'Documentar API — Módulo Usuarios',     description: 'Documentar todos los endpoints del módulo de usuarios usando Swagger.',          status: 'completed',  progress: 100, due_date: '2026-04-15', details: JSON.stringify({ instructions: 'Usar el estándar OpenAPI 3.0. Ver ticket #101.', type: 'report', estimatedHours: 4 }) },
    { id: ID.tsk2, template_id: ID.ttReview,  user_id: ID.ana,   title: 'Code Review — PR #42 Training Module', description: 'Revisar el PR del módulo de formación antes del merge a main.',                  status: 'in-progress', progress: 60,  due_date: '2026-05-10', details: JSON.stringify({ instructions: 'Foco en seguridad y validaciones. Ticket #142.', type: 'project', estimatedHours: 2 }) },
    { id: ID.tsk3, template_id: ID.ttFeature, user_id: ID.juan,  title: 'Implementar endpoint ROI',             description: 'Desarrollar el endpoint /api/training/roi con los cálculos de retorno.',        status: 'in-progress', progress: 40,  due_date: '2026-05-15', details: JSON.stringify({ instructions: 'Seguir la especificación del documento de diseño ROI v2.', type: 'project', estimatedHours: 6 }) },
    { id: ID.tsk4, template_id: ID.ttRefact,  user_id: ID.juan,  title: 'Refactoring módulo de autenticación', description: 'Aplicar Clean Architecture al módulo de auth. Tests deben pasar.',               status: 'pending',     progress: 0,   due_date: '2026-05-20', details: JSON.stringify({ instructions: 'Mantener compatibilidad con tokens existentes.', type: 'project', estimatedHours: 8 }) },
    { id: ID.tsk5, template_id: ID.ttDoc,     user_id: ID.maria, title: 'Documentar plan de pruebas — v2.0',   description: 'Documentar los casos de prueba del módulo de formación en Confluence.',           status: 'pending',     progress: 0,   due_date: '2026-05-12', details: JSON.stringify({ instructions: 'Incluir casos positivos, negativos y edge cases.', type: 'report', estimatedHours: 4 }) },
    { id: ID.tsk6, template_id: ID.ttFeature, user_id: ID.pedro, title: 'Pipeline CI/CD para módulo training', description: 'Configurar GitHub Actions para deploy automático del módulo de formación.',      status: 'pending',     progress: 0,   due_date: '2026-05-18', details: JSON.stringify({ instructions: 'Incluir steps: lint, test, build, deploy a staging.', type: 'project', estimatedHours: 6 }) },
  ];
  for (const t of tasks) {
    await sql`
      INSERT INTO tasks (id, template_id, user_id, assigned_by, title, description, status, progress, assigned_date, due_date, details)
      VALUES (${t.id}, ${t.template_id}, ${t.user_id}, ${ID.admin}, ${t.title}, ${t.description},
              ${t.status}, ${t.progress}, NOW() - INTERVAL '10 days', ${t.due_date}, ${t.details}::jsonb)
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 8. EVALUATION TEMPLATES ───────────────────────────────────────────────
  console.log('→ evaluation_templates');
  const evalTemplates = [
    { id: ID.etGit,     title: 'Evaluación Git — Fundamentos',          description: 'Evalúa conocimientos de Git: comandos básicos, branching y resolución de conflictos.',     type: 'skills',       status: 'active',    google_form_id: null,            online: false, max_score: 100, source: 'internal', cost_per_user: 0,    passing_score_pct: 60 },
    { id: ID.etReact,   title: 'Evaluación React 19 — Fundamentals',    description: 'Evalúa comprensión de hooks, ciclo de vida, estado y props en React moderno.',              type: 'skills',       status: 'active',    google_form_id: null,            online: false, max_score: 100, source: 'internal', cost_per_user: 0,    passing_score_pct: 70 },
    { id: ID.etTesting, title: 'Evaluación Testing — Jest y Cypress',   description: 'Evalúa capacidad de escribir tests unitarios y E2E. Incluye ejercicio práctico.',            type: 'skills',       status: 'active',    google_form_id: null,            online: false, max_score: 100, source: 'internal', cost_per_user: 0,    passing_score_pct: 65 },
  ];
  for (const et of evalTemplates) {
    await sql`
      INSERT INTO evaluation_templates (id, title, description, type, status, created_by, google_form_id, online, max_score, source, cost_per_user, passing_score_pct)
      VALUES (${et.id}, ${et.title}, ${et.description}, ${et.type}, ${et.status}, ${ID.admin},
              ${et.google_form_id}, ${et.online}, ${et.max_score}, ${et.source}, ${et.cost_per_user}, ${et.passing_score_pct})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 9. EVALUATIONS ASIGNADAS ──────────────────────────────────────────────
  console.log('→ evaluations');
  const evaluations = [
    { id: ID.ev1, template_id: ID.etGit,     user_id: ID.ana,   status: 'completed',  score: 88,  max_score: 100, due_date: '2026-04-30', completed_date: '2026-04-22' },
    { id: ID.ev2, template_id: ID.etReact,   user_id: ID.ana,   status: 'pending',    score: null, max_score: 100, due_date: '2026-05-20', completed_date: null },
    { id: ID.ev3, template_id: ID.etGit,     user_id: ID.juan,  status: 'completed',  score: 74,  max_score: 100, due_date: '2026-04-30', completed_date: '2026-04-25' },
    { id: ID.ev4, template_id: ID.etTesting, user_id: ID.maria, status: 'in_progress', score: null, max_score: 100, due_date: '2026-05-15', completed_date: null },
    { id: ID.ev5, template_id: ID.etGit,     user_id: ID.lucia, status: 'pending',    score: null, max_score: 100, due_date: '2026-05-10', completed_date: null },
  ];
  for (const ev of evaluations) {
    await sql`
      INSERT INTO evaluations (id, template_id, user_id, assigned_by, status, score, max_score, assigned_date, due_date, completed_date, responses)
      VALUES (${ev.id}, ${ev.template_id}, ${ev.user_id}, ${ID.admin}, ${ev.status},
              ${ev.score}, ${ev.max_score}, NOW() - INTERVAL '15 days', ${ev.due_date},
              ${ev.completed_date ?? null}, ${JSON.stringify({})}::jsonb)
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 10. TRAINING LINES ────────────────────────────────────────────────────
  console.log('→ training_lines');
  const trainingLines = [
    { id: ID.tlFrontend, title: 'Onboarding — Desarrollador Frontend', description: 'Plan de incorporación para desarrolladores Frontend. Cubre Git, React y metodologías del equipo.', mandatory: true  },
    { id: ID.tlQA,       title: 'Capacitación QA Avanzado',            description: 'Formación en testing automatizado con Jest y Cypress para el equipo de QA.',                         mandatory: false },
    { id: ID.tlDevOps,   title: 'DevOps Básico — Contenedores',        description: 'Introducción a Docker, Kubernetes y pipelines CI/CD para todo el equipo técnico.',                   mandatory: false },
  ];
  for (const tl of trainingLines) {
    await sql`
      INSERT INTO training_lines (id, title, description, mandatory, created_by)
      VALUES (${tl.id}, ${tl.title}, ${tl.description}, ${tl.mandatory}, ${ID.admin})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 11. TRAINING LINE SECTORS ─────────────────────────────────────────────
  console.log('→ training_line_sectors');
  const tlSectors = [
    { line: ID.tlFrontend, sector: 'Desarrollo Frontend' },
    { line: ID.tlQA,       sector: 'QA / Testing' },
    { line: ID.tlDevOps,   sector: 'Desarrollo Frontend' },
    { line: ID.tlDevOps,   sector: 'Desarrollo Backend' },
    { line: ID.tlDevOps,   sector: 'DevOps / Infraestructura' },
  ];
  for (const { line, sector } of tlSectors) {
    await sql`
      INSERT INTO training_line_sectors (training_line_id, sector_id)
      VALUES (${line}, ${sectorId[sector]})
      ON CONFLICT DO NOTHING
    `;
  }

  // ── 12. TRAINING LINE ITEMS ───────────────────────────────────────────────
  console.log('→ training_line_items');
  const items = [
    // Onboarding Frontend: Curso Git → Eval Git → Curso React → Tarea Review
    { id: ID.tliF1, line: ID.tlFrontend, type: 'course',     course_id: ID.cGit,       eval_id: null,        task_id: null,         order: 1 },
    { id: ID.tliF2, line: ID.tlFrontend, type: 'evaluation', course_id: null,           eval_id: ID.etGit,    task_id: null,         order: 2 },
    { id: ID.tliF3, line: ID.tlFrontend, type: 'course',     course_id: ID.cReact,     eval_id: null,        task_id: null,         order: 3 },
    { id: ID.tliF4, line: ID.tlFrontend, type: 'task',       course_id: null,           eval_id: null,        task_id: ID.ttReview,  order: 4 },
    // QA Avanzado: Curso Testing → Eval Testing → Tarea Documentar
    { id: ID.tliQ1, line: ID.tlQA,       type: 'course',     course_id: ID.cTesting,   eval_id: null,        task_id: null,         order: 1 },
    { id: ID.tliQ2, line: ID.tlQA,       type: 'evaluation', course_id: null,           eval_id: ID.etTesting, task_id: null,        order: 2 },
    { id: ID.tliQ3, line: ID.tlQA,       type: 'task',       course_id: null,           eval_id: null,        task_id: ID.ttDoc,     order: 3 },
    // DevOps Básico: Curso Docker → Tarea Feature
    { id: ID.tliD1, line: ID.tlDevOps,   type: 'course',     course_id: ID.cDocker,    eval_id: null,        task_id: null,         order: 1 },
    { id: ID.tliD2, line: ID.tlDevOps,   type: 'task',       course_id: null,           eval_id: null,        task_id: ID.ttFeature, order: 2 },
  ];
  for (const item of items) {
    await sql`
      INSERT INTO training_line_items (id, training_line_id, item_type, course_id, evaluation_template_id, task_template_id, order_index)
      VALUES (${item.id}, ${item.line}, ${item.type}, ${item.course_id}, ${item.eval_id}, ${item.task_id}, ${item.order})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // ── 13. COURSE ENROLLMENTS ────────────────────────────────────────────────
  console.log('→ course_enrollments');
  const enrollments = [
    { user_id: ID.ana,   course_id: ID.cGit,   line_id: ID.tlFrontend, status: 'completed', completed_at: '2026-04-20' },
    { user_id: ID.ana,   course_id: ID.cReact, line_id: ID.tlFrontend, status: 'in_progress', completed_at: null },
    { user_id: ID.lucia, course_id: ID.cGit,   line_id: ID.tlFrontend, status: 'enrolled',   completed_at: null },
    { user_id: ID.maria, course_id: ID.cTesting, line_id: ID.tlQA,     status: 'in_progress', completed_at: null },
    { user_id: ID.pedro, course_id: ID.cDocker, line_id: ID.tlDevOps,  status: 'enrolled',   completed_at: null },
  ];
  for (const e of enrollments) {
    await sql`
      INSERT INTO course_enrollments (user_id, course_id, training_line_id, status, enrolled_at, completed_at)
      VALUES (${e.user_id}, ${e.course_id}, ${e.line_id}, ${e.status}, NOW() - INTERVAL '20 days', ${e.completed_at ?? null})
      ON CONFLICT (user_id, course_id, training_line_id) DO NOTHING
    `;
  }

  // ── 14. TRAINING LINE PROGRESS ────────────────────────────────────────────
  console.log('→ training_line_progress');
  const progress = [
    { user_id: ID.ana,   line_id: ID.tlFrontend, total: 4, completed: 2 },
    { user_id: ID.lucia, line_id: ID.tlFrontend, total: 4, completed: 0 },
    { user_id: ID.maria, line_id: ID.tlQA,       total: 3, completed: 0 },
    { user_id: ID.pedro, line_id: ID.tlDevOps,   total: 2, completed: 0 },
    { user_id: ID.juan,  line_id: ID.tlDevOps,   total: 2, completed: 0 },
  ];
  for (const p of progress) {
    await sql`
      INSERT INTO training_line_progress (user_id, training_line_id, total_items, completed_items, last_updated)
      VALUES (${p.user_id}, ${p.line_id}, ${p.total}, ${p.completed}, NOW())
      ON CONFLICT (user_id, training_line_id) DO NOTHING
    `;
  }

  // ── 15. CERTIFICATIONS ────────────────────────────────────────────────────
  console.log('→ certifications');
  await sql`
    INSERT INTO certifications (id, user_id, course_id, title, issuer, issued_date, credential_url, verified)
    VALUES
      (${ID.cert1}, ${ID.ana},  ${ID.cGit}, 'Git y GitHub Avanzado', 'Teams Improve',  '2026-04-20', null, true),
      (${ID.cert2}, ${ID.juan}, ${ID.cGit}, 'Git y GitHub Avanzado', 'Teams Improve',  '2026-04-26', null, true)
    ON CONFLICT (id) DO NOTHING
  `;

  // ── 16. PRODUCTIVITY METRICS ──────────────────────────────────────────────
  console.log('→ productivity_metrics');
  const metrics = [
    { user_id: ID.ana,   t_completed: 1, t_assigned: 2, score: 72 },
    { user_id: ID.juan,  t_completed: 1, t_assigned: 2, score: 65 },
    { user_id: ID.maria, t_completed: 0, t_assigned: 1, score: 50 },
    { user_id: ID.pedro, t_completed: 0, t_assigned: 1, score: 45 },
    { user_id: ID.lucia, t_completed: 0, t_assigned: 0, score: 30 },
  ];
  for (const m of metrics) {
    await sql`
      INSERT INTO productivity_metrics (user_id, date, tasks_completed, tasks_assigned, total_work_time, productivity_score)
      VALUES (${m.user_id}, CURRENT_DATE, ${m.t_completed}, ${m.t_assigned}, 14400, ${m.score})
      ON CONFLICT (user_id, date) DO NOTHING
    `;
  }

  // ── 17. WORK SESSIONS ─────────────────────────────────────────────────────
  console.log('→ work_sessions');
  const sessions = [
    { user_id: ID.ana,   duration: 18000 },
    { user_id: ID.juan,  duration: 21600 },
    { user_id: ID.maria, duration: 14400 },
    { user_id: ID.pedro, duration: 10800 },
    { user_id: ID.lucia, duration: 7200  },
  ];
  for (const s of sessions) {
    await sql`
      INSERT INTO work_sessions (user_id, session_date, duration)
      VALUES (${s.user_id}, CURRENT_DATE, ${s.duration})
      ON CONFLICT (user_id, session_date) DO NOTHING
    `;
  }

  // ── 18. ROI SNAPSHOTS ─────────────────────────────────────────────────────
  console.log('→ training_roi_snapshots');
  const snapshots = [
    { user_id: ID.ana,   line_id: ID.tlFrontend, avg_prod: 62, avg_eval: 70, task_pct: 50, cost: 2500 },
    { user_id: ID.lucia, line_id: ID.tlFrontend, avg_prod: 30, avg_eval: 0,  task_pct: 0,  cost: 2500 },
    { user_id: ID.maria, line_id: ID.tlQA,       avg_prod: 50, avg_eval: 0,  task_pct: 0,  cost: 4100 },
  ];
  for (const s of snapshots) {
    await sql`
      INSERT INTO training_roi_snapshots (user_id, training_line_id, snapshot_date, avg_productivity, avg_eval_score, tasks_completion_pct, training_cost)
      VALUES (${s.user_id}, ${s.line_id}, CURRENT_DATE - INTERVAL '20 days', ${s.avg_prod}, ${s.avg_eval}, ${s.task_pct}, ${s.cost})
      ON CONFLICT (user_id, training_line_id) DO NOTHING
    `;
  }

  console.log('\n✓ Seed completado.\n');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  CREDENCIALES                                    ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log('║  Admin   carlos@teamsimprove.com  / Admin2024!   ║');
  console.log('║  User    ana@teamsimprove.com     / User2024!    ║');
  console.log('║  User    juan@teamsimprove.com    / User2024!    ║');
  console.log('║  User    maria@teamsimprove.com   / User2024!    ║');
  console.log('║  User    pedro@teamsimprove.com   / User2024!    ║');
  console.log('║  User    lucia@teamsimprove.com   / User2024!    ║');
  console.log('╚══════════════════════════════════════════════════╝');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
