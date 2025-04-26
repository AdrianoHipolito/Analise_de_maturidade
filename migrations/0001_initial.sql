-- Migration number: 0001 	 2025-04-25T00:00:00.000Z
-- Criação das tabelas iniciais do sistema

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT "user",
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de segmentos de negócio
CREATE TABLE IF NOT EXISTS business_segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de modelos de questionários
CREATE TABLE IF NOT EXISTS questionnaire_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  business_segment_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_segment_id) REFERENCES business_segments(id)
);

-- Tabela de dimensões
CREATE TABLE IF NOT EXISTS dimensions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  weight REAL DEFAULT 1.0,
  order_num INTEGER NOT NULL,
  questionnaire_template_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (questionnaire_template_id) REFERENCES questionnaire_templates(id)
);

-- Tabela de critérios
CREATE TABLE IF NOT EXISTS criteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL,
  dimension_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dimension_id) REFERENCES dimensions(id)
);

-- Tabela de níveis de maturidade
CREATE TABLE IF NOT EXISTS maturity_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL,
  description TEXT NOT NULL,
  criteria_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (criteria_id) REFERENCES criteria(id)
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  questionnaire_template_id INTEGER NOT NULL,
  company_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT "in_progress",
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (questionnaire_template_id) REFERENCES questionnaire_templates(id)
);

-- Tabela de respostas
CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  criteria_id INTEGER NOT NULL,
  maturity_level INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id),
  FOREIGN KEY (criteria_id) REFERENCES criteria(id)
);

-- Tabela de relatórios
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  overall_score REAL NOT NULL,
  maturity_level TEXT NOT NULL,
  pdf_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

-- Tabela de logs de email
CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);
