// API para criar um novo revendedor após confirmação de pagamento
interface Env {
    DB: D1Database;
}

interface ResellerData {
    name: string;
    email: string;
    cpf: string;
    plan: string;
    price: string;
    whatsapp?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const data = await context.request.json() as ResellerData;

        if (!data.name || !data.email) {
            return new Response(JSON.stringify({ error: "Nome e email são obrigatórios" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Gerar username a partir do email (antes do @)
        const username = data.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

        // Verificar se já existe um revendedor com esse email
        const existing = await context.env.DB.prepare(
            "SELECT id FROM resellers WHERE email = ?"
        ).bind(data.email).first();

        if (existing) {
            return new Response(JSON.stringify({
                error: "Já existe um revendedor com este email",
                reseller_id: existing.id
            }), {
                status: 409,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Inserir novo revendedor
        const result = await context.env.DB.prepare(`
            INSERT INTO resellers (
                username,
                email,
                personal_name,
                permission,
                credits,
                status,
                whatsapp,
                observations,
                plan_name,
                plan_price,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).bind(
            username,
            data.email,
            data.name,
            'reseller',
            10, // créditos iniciais
            'Ativo',
            data.whatsapp || '',
            `CPF: ${data.cpf}`,
            data.plan || '',
            data.price || ''
        ).run();

        return new Response(JSON.stringify({
            success: true,
            message: "Revendedor criado com sucesso",
            reseller_id: result.meta.last_row_id,
            username: username
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Erro ao criar revendedor:", err);
        return new Response(JSON.stringify({
            error: err instanceof Error ? err.message : "Erro interno do servidor"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
