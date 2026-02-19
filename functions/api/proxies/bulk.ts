// Bulk import proxies

interface Env {
    DB: D1Database;
}

interface ProxyInput {
    host: string;
    port: number;
    username?: string;
    password?: string;
    type?: string;
}

function parseProxyLine(line: string): ProxyInput | null {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // Format: host:port:username:password or host:port
    const parts = trimmed.split(':');

    if (parts.length >= 2) {
        const host = parts[0];
        const port = parseInt(parts[1]);

        if (isNaN(port)) return null;

        return {
            host,
            port,
            username: parts[2] || undefined,
            password: parts[3] || undefined,
            type: 'socks5', // Default to socks5
        };
    }

    return null;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        admin_id?: string;
        proxies?: ProxyInput[];
        text?: string; // Raw text with one proxy per line
    };

    const adminId = body.admin_id || 'default';
    let proxiesToAdd: ProxyInput[] = [];

    // Parse from text or use array
    if (body.text) {
        const lines = body.text.split('\n');
        for (const line of lines) {
            const parsed = parseProxyLine(line);
            if (parsed) {
                proxiesToAdd.push(parsed);
            }
        }
    } else if (body.proxies) {
        proxiesToAdd = body.proxies;
    }

    if (proxiesToAdd.length === 0) {
        return Response.json({
            success: false,
            error: 'No valid proxies found',
        }, { status: 400 });
    }

    try {
        // Ensure table exists
        await DB.prepare(`
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
            )
        `).run();

        const now = new Date().toISOString();
        let added = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const proxy of proxiesToAdd) {
            try {
                await DB.prepare(`
                    INSERT INTO proxies (admin_id, host, port, username, password, type, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    adminId,
                    proxy.host,
                    proxy.port,
                    proxy.username || null,
                    proxy.password || null,
                    proxy.type || 'socks5',
                    now,
                    now
                ).run();
                added++;
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'Unknown error';
                if (msg.includes('UNIQUE constraint')) {
                    skipped++;
                } else {
                    errors.push(`${proxy.host}:${proxy.port} - ${msg}`);
                }
            }
        }

        return Response.json({
            success: true,
            data: {
                total: proxiesToAdd.length,
                added,
                skipped,
                errors: errors.length,
                errorDetails: errors,
            },
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
