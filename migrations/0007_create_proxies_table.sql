-- Migration: Create proxies table

CREATE TABLE IF NOT EXISTS proxies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    username TEXT,
    password TEXT,
    type TEXT DEFAULT 'socks5',
    status TEXT DEFAULT 'unknown',
    latency INTEGER,
    country TEXT,
    country_code TEXT,
    city TEXT,
    is_active INTEGER DEFAULT 0,
    last_tested TEXT,
    failure_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(admin_id, host, port)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_proxies_admin ON proxies(admin_id);
CREATE INDEX IF NOT EXISTS idx_proxies_active ON proxies(is_active);
