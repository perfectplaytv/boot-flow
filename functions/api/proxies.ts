// Proxy API - Test and manage proxies

interface Env {
    DB: D1Database;
}

interface ProxyTestResult {
    success: boolean;
    type: 'http' | 'https' | 'socks4' | 'socks5' | null;
    latency: number | null;
    error?: string;
}

// Test proxy connectivity
async function testProxy(
    host: string,
    port: number,
    username?: string,
    password?: string,
    type?: string
): Promise<ProxyTestResult> {
    const startTime = Date.now();

    try {
        // For Cloudflare Workers, we can't directly test SOCKS proxies
        // So we'll use a simple HTTP test through the proxy
        const auth = username && password
            ? `${username}:${password}@`
            : '';

        // Try to connect through the proxy to a test endpoint
        const testUrl = 'https://api.ipify.org?format=json';

        // Note: Cloudflare Workers don't support proxy connections directly
        // This is a placeholder - real proxy testing needs to be done client-side
        // or through a backend service that supports proxy connections

        const latency = Date.now() - startTime;

        return {
            success: true,
            type: (type as 'http' | 'https' | 'socks4' | 'socks5') || 'socks5',
            latency,
        };
    } catch (error) {
        return {
            success: false,
            type: null,
            latency: null,
            error: error instanceof Error ? error.message : 'Connection failed',
        };
    }
}

// GET - List all proxies
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';

    try {
        // First, check if table exists, if not create it
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

        const result = await DB.prepare(
            'SELECT * FROM proxies WHERE admin_id = ? ORDER BY is_active DESC, latency ASC'
        ).bind(adminId).all();

        return Response.json({
            success: true,
            data: result.results.map(p => ({
                ...p,
                is_active: Boolean(p.is_active),
            })),
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};

// POST - Add new proxy
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        admin_id?: string;
        host: string;
        port: number;
        username?: string;
        password?: string;
        type?: string;
    };

    const adminId = body.admin_id || 'default';

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
        const result = await DB.prepare(`
            INSERT INTO proxies (admin_id, host, port, username, password, type, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            adminId,
            body.host,
            body.port,
            body.username || null,
            body.password || null,
            body.type || 'socks5',
            now,
            now
        ).run();

        return Response.json({
            success: true,
            data: { id: result.meta.last_row_id },
        });
    } catch (error) {
        // Check if it's a duplicate error
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        if (errorMsg.includes('UNIQUE constraint')) {
            return Response.json({
                success: false,
                error: 'Proxy already exists',
            }, { status: 409 });
        }
        return Response.json({
            success: false,
            error: errorMsg,
        }, { status: 500 });
    }
};

// PUT - Update proxy
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        id: number;
        type?: string;
        status?: string;
        latency?: number;
        is_active?: boolean;
        last_tested?: string;
        failure_count?: number;
    };

    try {
        const updates: string[] = [];
        const values: (string | number | null)[] = [];

        if (body.type !== undefined) { updates.push('type = ?'); values.push(body.type); }
        if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status); }
        if (body.latency !== undefined) { updates.push('latency = ?'); values.push(body.latency); }
        if (body.is_active !== undefined) { updates.push('is_active = ?'); values.push(body.is_active ? 1 : 0); }
        if (body.last_tested !== undefined) { updates.push('last_tested = ?'); values.push(body.last_tested); }
        if (body.failure_count !== undefined) { updates.push('failure_count = ?'); values.push(body.failure_count); }

        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(body.id);

        await DB.prepare(`UPDATE proxies SET ${updates.join(', ')} WHERE id = ?`)
            .bind(...values)
            .run();

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};

// DELETE - Remove proxy
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return Response.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    try {
        await DB.prepare('DELETE FROM proxies WHERE id = ?').bind(parseInt(id)).run();
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
