// Telegram Account Verification API
// Verifies bot tokens by calling Telegram's getMe endpoint

interface Env {
    DB: D1Database;
}

interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    can_join_groups?: boolean;
    can_read_all_group_messages?: boolean;
    supports_inline_queries?: boolean;
}

interface TelegramResponse {
    ok: boolean;
    result?: TelegramUser;
    error_code?: number;
    description?: string;
}

interface VerifyResult {
    bot_id: number;
    name: string;
    username?: string;
    status: 'active' | 'restricted' | 'banned' | 'invalid' | 'error';
    telegram_id?: number;
    can_join_groups?: boolean;
    can_read_messages?: boolean;
    error_message?: string;
    verified_at: string;
}

async function verifyBotToken(token: string): Promise<{
    success: boolean;
    data?: TelegramUser;
    status: 'active' | 'restricted' | 'banned' | 'invalid' | 'error';
    error?: string;
}> {
    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
            method: 'GET',
        });

        const data: TelegramResponse = await response.json();

        if (data.ok && data.result) {
            // Bot is working
            // Check if it can join groups (not restricted)
            if (data.result.can_join_groups === false) {
                return {
                    success: true,
                    data: data.result,
                    status: 'restricted',
                    error: 'Bot cannot join groups (restricted)',
                };
            }
            return {
                success: true,
                data: data.result,
                status: 'active',
            };
        } else {
            // Check error type
            if (data.error_code === 401) {
                return {
                    success: false,
                    status: 'invalid',
                    error: 'Token inválido ou bot deletado',
                };
            } else if (data.error_code === 403) {
                return {
                    success: false,
                    status: 'banned',
                    error: 'Bot banido pelo Telegram',
                };
            } else {
                return {
                    success: false,
                    status: 'error',
                    error: data.description || 'Erro desconhecido',
                };
            }
        }
    } catch (error) {
        return {
            success: false,
            status: 'error',
            error: error instanceof Error ? error.message : 'Erro de conexão',
        };
    }
}

// GET - Get all bots with their status
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';

    try {
        const result = await DB.prepare(
            'SELECT * FROM heating_bots WHERE admin_id = ? ORDER BY name'
        ).bind(adminId).all();

        return Response.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};

// POST - Verify single bot or all bots
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        admin_id?: string;
        bot_id?: number; // If provided, verify single bot
        verify_all?: boolean; // If true, verify all bots
    };

    const adminId = body.admin_id || 'default';
    const results: VerifyResult[] = [];

    try {
        let botsToVerify: { id: number; name: string; token: string }[] = [];

        if (body.bot_id) {
            // Verify single bot
            const bot = await DB.prepare(
                'SELECT id, name, token FROM heating_bots WHERE id = ? AND admin_id = ?'
            ).bind(body.bot_id, adminId).first<{ id: number; name: string; token: string }>();

            if (bot) {
                botsToVerify = [bot];
            }
        } else if (body.verify_all) {
            // Verify all bots
            const bots = await DB.prepare(
                'SELECT id, name, token FROM heating_bots WHERE admin_id = ?'
            ).bind(adminId).all<{ id: number; name: string; token: string }>();

            botsToVerify = bots.results;
        }

        if (botsToVerify.length === 0) {
            return Response.json({
                success: false,
                error: 'No bots to verify',
            }, { status: 400 });
        }

        // Verify each bot
        for (const bot of botsToVerify) {
            const verification = await verifyBotToken(bot.token);
            const now = new Date().toISOString();

            // Update bot status in database
            await DB.prepare(`
                UPDATE heating_bots 
                SET status = ?,
                    username = ?,
                    validation_error = ?,
                    last_validated_at = ?,
                    updated_at = ?
                WHERE id = ?
            `).bind(
                verification.status === 'active' ? 'active' :
                    verification.status === 'restricted' ? 'restricted' : 'error',
                verification.data?.username || null,
                verification.error || null,
                now,
                now,
                bot.id
            ).run();

            results.push({
                bot_id: bot.id,
                name: bot.name,
                username: verification.data?.username,
                status: verification.status,
                telegram_id: verification.data?.id,
                can_join_groups: verification.data?.can_join_groups,
                can_read_messages: verification.data?.can_read_all_group_messages,
                error_message: verification.error,
                verified_at: now,
            });
        }

        // Calculate summary
        const summary = {
            total: results.length,
            active: results.filter(r => r.status === 'active').length,
            restricted: results.filter(r => r.status === 'restricted').length,
            banned: results.filter(r => r.status === 'banned').length,
            invalid: results.filter(r => r.status === 'invalid').length,
            error: results.filter(r => r.status === 'error').length,
        };

        return Response.json({
            success: true,
            data: {
                results,
                summary,
            },
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
