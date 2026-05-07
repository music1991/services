-- Performance indexes for Teams Improve
-- Run once against the Neon PostgreSQL database

CREATE INDEX IF NOT EXISTS idx_work_sessions_user_date
  ON work_sessions (user_id, session_date);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id
  ON tasks (user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON tasks (status);

CREATE INDEX IF NOT EXISTS idx_tasks_user_status
  ON tasks (user_id, status);

CREATE INDEX IF NOT EXISTS idx_evaluations_user_id
  ON evaluations (user_id);

CREATE INDEX IF NOT EXISTS idx_evaluations_template_user
  ON evaluations (template_id, user_id);

CREATE INDEX IF NOT EXISTS idx_productivity_metrics_user_date
  ON productivity_metrics (user_id, date);

CREATE INDEX IF NOT EXISTS idx_users_role
  ON users (role);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_course
  ON course_enrollments (user_id, course_id);

CREATE INDEX IF NOT EXISTS idx_training_line_progress_user
  ON training_line_progress (user_id, training_line_id);
