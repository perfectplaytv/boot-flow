-- Create servers table
CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    ip TEXT NOT NULL,
    porta INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'offline',
    cpu INTEGER DEFAULT 0,
    memoria INTEGER DEFAULT 0,
    disco INTEGER DEFAULT 0,
    ultima_atualizacao TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    versao TEXT NOT NULL,
    servidor TEXT NOT NULL, -- references servers(nome) or just string for now
    tipo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'inativo',
    usuarios INTEGER DEFAULT 0,
    ultima_atualizacao TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
