
interface Env {
    DB: D1Database;
}

interface TelegramResponse {
    ok: boolean;
    result?: any;
    description?: string;
    error_code?: number;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const groupId = url.searchParams.get("id");

    if (!groupId) {
        return Response.json({ success: false, error: "Missing group id" }, { status: 400 });
    }

    try {
        // 1. Get group details
        const group = await DB.prepare("SELECT * FROM heating_groups WHERE id = ?").bind(groupId).first<{ id: number, chat_id: string, name: string }>();

        if (!group) {
            return Response.json({ success: false, error: "Grupo não encontrado no banco de dados" }, { status: 404 });
        }

        // 2. Get any active bot to perform the check
        // Ideally we should use a bot that is assigned to a campaign for this group, 
        // but any bot in the group would do. Failsafe: pick the first active bot.
        const bot = await DB.prepare("SELECT * FROM heating_bots WHERE status = 'active' ORDER BY RANDOM() LIMIT 1").first<{ token: string, name: string }>();

        if (!bot) {
            return Response.json({ success: false, error: "Nenhum bot ativo disponível para verificar o status" }, { status: 400 });
        }

        // Extract Bot ID from token (first part before :)
        const botTelegramId = bot.token.split(':')[0];

        // 3. Call getChat to check generalized status
        const chatRes = await fetch(`https://api.telegram.org/bot${bot.token}/getChat?chat_id=${group.chat_id}`);
        const chatData: TelegramResponse = await chatRes.json();

        let status = 'active'; // Default assumption
        let details = 'Grupo acessível';
        let memberStatus = '';

        if (!chatData.ok) {
            const err = chatData.description?.toLowerCase() || "";
            if (err.includes("chat not found")) {
                status = 'not_found';
                details = 'Chat não encontrado (Bot não é membro ou ID incorreto)';
            } else if (err.includes("kicked") || err.includes("blocked")) {
                status = 'blocked';
                details = 'Bot foi removido ou bloqueado pelo grupo';
            } else if (err.includes("deactivated")) {
                status = 'banned';
                details = 'Grupo foi desativado/banido pelo Telegram';
            } else {
                status = 'error';
                details = `Erro API: ${chatData.description}`;
            }
        } else {
            // 4. If getChat works, check getChatMember to see specific permissions
            const memberRes = await fetch(`https://api.telegram.org/bot${bot.token}/getChatMember?chat_id=${group.chat_id}&user_id=${botTelegramId}`);
            const memberData: TelegramResponse = await memberRes.json();

            if (memberData.ok && memberData.result) {
                memberStatus = memberData.result.status; // creator, administrator, member, restricted, left, kicked

                if (memberStatus === 'kicked') {
                    status = 'blocked';
                    details = 'Bot está banido do grupo';
                } else if (memberStatus === 'left') {
                    status = 'not_found';
                    details = 'Bot não é membro do grupo';
                } else if (memberStatus === 'restricted') {
                    status = 'restricted';
                    const perms = memberData.result;
                    if (perms.can_send_messages === false) {
                        details = 'Bot está restrito (não pode enviar mensagens)';
                    } else {
                        details = 'Bot está restrito (possui limitações)';
                    }
                } else {
                    // administrator, member, creator
                    status = 'active';
                    details = `Ativo (Bot é ${memberStatus})`;
                }
            }
        }

        // 5. Update group in DB with new status
        await DB.prepare("UPDATE heating_groups SET test_status = ?, last_test_at = ? WHERE id = ?")
            .bind(status, new Date().toISOString(), groupId)
            .run();

        return Response.json({
            success: true,
            data: {
                status,
                details,
                bot_used: bot.name,
                chat_info: chatData.ok ? {
                    title: chatData.result.title,
                    type: chatData.result.type,
                    description: chatData.result.description
                } : null
            }
        });

    } catch (e) {
        return Response.json({
            success: false,
            error: e instanceof Error ? e.message : "Erro desconhecido ao verificar grupo"
        }, { status: 500 });
    }
};
