-- Migration: Create Heating (Aquecer Contas) Tables
-- Description: Tables for the automated group warming/heating system

-- Table: heating_groups - Groups where messages will be sent
CREATE TABLE IF NOT EXISTS heating_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id TEXT NOT NULL,
    name TEXT NOT NULL,
    chat_id TEXT NOT NULL UNIQUE,
    description TEXT,
    tags TEXT, -- JSON array of tags
    is_active INTEGER DEFAULT 1,
    last_test_at TEXT,
    test_status TEXT DEFAULT 'pending', -- pending, success, failed
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Table: heating_bots - Bot identities with their tokens
CREATE TABLE IF NOT EXISTS heating_bots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id TEXT NOT NULL,
    name TEXT NOT NULL,
    token TEXT NOT NULL,
    username TEXT,
    status TEXT DEFAULT 'active', -- active, inactive, error
    max_messages_per_hour INTEGER DEFAULT 10,
    max_messages_per_day INTEGER DEFAULT 100,
    messages_sent_today INTEGER DEFAULT 0,
    messages_sent_this_hour INTEGER DEFAULT 0,
    last_reset_hour TEXT,
    last_reset_day TEXT,
    last_validated_at TEXT,
    validation_error TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Table: heating_campaigns - Campaign configurations
CREATE TABLE IF NOT EXISTS heating_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id TEXT NOT NULL,
    name TEXT NOT NULL,
    group_id INTEGER NOT NULL REFERENCES heating_groups(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'paused', -- paused, running, stopped, completed
    send_mode TEXT DEFAULT 'sequential', -- sequential, random, no_repeat
    interval_min INTEGER DEFAULT 90, -- minimum interval in seconds
    interval_max INTEGER DEFAULT 180, -- maximum interval in seconds
    window_start TEXT DEFAULT '09:00', -- start time HH:MM
    window_end TEXT DEFAULT '22:00', -- end time HH:MM
    max_messages_per_bot_per_day INTEGER DEFAULT 50,
    message_index INTEGER DEFAULT 0, -- for sequential mode
    total_messages_sent INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    last_sent_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Table: heating_campaign_bots - Junction table for campaign-bot relationship
CREATE TABLE IF NOT EXISTS heating_campaign_bots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES heating_campaigns(id) ON DELETE CASCADE,
    bot_id INTEGER NOT NULL REFERENCES heating_bots(id) ON DELETE CASCADE,
    messages_sent_today INTEGER DEFAULT 0,
    last_sent_at TEXT,
    next_send_at TEXT,
    UNIQUE(campaign_id, bot_id)
);

-- Table: heating_messages - Pre-defined messages for campaigns
CREATE TABLE IF NOT EXISTS heating_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES heating_campaigns(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    times_sent INTEGER DEFAULT 0,
    last_sent_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Table: heating_logs - Logs of sent messages and errors
CREATE TABLE IF NOT EXISTS heating_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES heating_campaigns(id) ON DELETE CASCADE,
    bot_id INTEGER REFERENCES heating_bots(id) ON DELETE SET NULL,
    message_id INTEGER REFERENCES heating_messages(id) ON DELETE SET NULL,
    status TEXT NOT NULL, -- success, error, skipped
    error_message TEXT,
    telegram_message_id TEXT, -- ID returned by Telegram
    sent_at TEXT DEFAULT (datetime('now'))
);

-- Table: heating_bot_state - Track state per bot per campaign
CREATE TABLE IF NOT EXISTS heating_bot_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES heating_campaigns(id) ON DELETE CASCADE,
    bot_id INTEGER NOT NULL REFERENCES heating_bots(id) ON DELETE CASCADE,
    last_sent_at TEXT,
    next_scheduled_at TEXT,
    messages_sent_today INTEGER DEFAULT 0,
    last_message_index INTEGER DEFAULT 0,
    last_reset_date TEXT,
    UNIQUE(campaign_id, bot_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_heating_groups_admin ON heating_groups(admin_id);
CREATE INDEX IF NOT EXISTS idx_heating_bots_admin ON heating_bots(admin_id);
CREATE INDEX IF NOT EXISTS idx_heating_campaigns_admin ON heating_campaigns(admin_id);
CREATE INDEX IF NOT EXISTS idx_heating_campaigns_status ON heating_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_heating_logs_campaign ON heating_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_heating_logs_sent_at ON heating_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_heating_bot_state_next ON heating_bot_state(next_scheduled_at);
