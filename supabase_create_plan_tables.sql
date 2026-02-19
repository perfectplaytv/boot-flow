-- Tabelas para cada plano de assinatura
CREATE TABLE essencial (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  criado_em TIMESTAMP DEFAULT now()
);

CREATE TABLE profissional (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  criado_em TIMESTAMP DEFAULT now()
);

CREATE TABLE business (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  criado_em TIMESTAMP DEFAULT now()
);

CREATE TABLE elite (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  criado_em TIMESTAMP DEFAULT now()
);

-- Adapte os campos conforme necessário para o seu fluxo de cadastro.