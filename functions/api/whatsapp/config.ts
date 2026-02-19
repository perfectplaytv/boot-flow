
interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;

    try {
        const config = await DB.prepare(`
      SELECT key, value FROM app_config 
      WHERE key IN ('whatsapp_bearer_token', 'whatsapp_profile_id', 'whatsapp_phone_number')
    `).all<{ key: string, value: string }>();

        const result = {
            bearerToken: config.results.find(c => c.key === 'whatsapp_bearer_token')?.value || '',
            profileId: config.results.find(c => c.key === 'whatsapp_profile_id')?.value || '',
            phoneNumber: config.results.find(c => c.key === 'whatsapp_phone_number')?.value || '',
        };

        return Response.json({ success: true, data: result });
    } catch (error) {
        return Response.json({ success: false, error: 'Database error' }, { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        bearerToken?: string;
        profileId?: string;
        phoneNumber?: string;
    };

    try {
        const batch = [];
        const now = new Date().toISOString();

        if (body.bearerToken !== undefined) {
            batch.push(DB.prepare(`
        INSERT INTO app_config (key, value, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind('whatsapp_bearer_token', body.bearerToken, now));
        }

        if (body.profileId !== undefined) {
            batch.push(DB.prepare(`
        INSERT INTO app_config (key, value, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind('whatsapp_profile_id', body.profileId, now));
        }

        if (body.phoneNumber !== undefined) {
            batch.push(DB.prepare(`
        INSERT INTO app_config (key, value, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind('whatsapp_phone_number', body.phoneNumber, now));
        }

        if (batch.length > 0) {
            await DB.batch(batch);
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error saving config:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
};
