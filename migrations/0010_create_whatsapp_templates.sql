-- Migration: Create whatsapp_templates table

CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    tag TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'Ativo',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_tag ON whatsapp_templates(tag);
