export const onRequestGet = async (context) => {
    try {
        const { results } = await context.env.DB.prepare(
            "SELECT * FROM plans WHERE active = 1 ORDER BY display_order ASC"
        ).all();

        const plans = results.map(p => ({
            ...p,
            // Parse do JSON armazenado como texto
            features: p.features ? JSON.parse(p.features) : [],
            is_popular: !!p.is_popular,
            active: !!p.active
        }));

        return new Response(JSON.stringify(plans), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};

export const onRequestPost = async (context) => {
    // TODO: Adicionar verificação de autenticação aqui
    try {
        const plan = await context.request.json();

        // Update simples (assume ID presente)
        if (plan.id) {
            await context.env.DB.prepare(
                `UPDATE plans SET name=?, price=?, description=?, clients_limit=?, is_popular=?, highlight=?, features=?, active=? WHERE id=?`
            ).bind(
                plan.name,
                plan.price,
                plan.description,
                plan.clients_limit,
                plan.is_popular ? 1 : 0,
                plan.highlight,
                JSON.stringify(plan.features),
                plan.active ? 1 : 0,
                plan.id
            ).run();

            return new Response(JSON.stringify({ success: true, id: plan.id }), { headers: { "Content-Type": "application/json" } });
        }

        // Create (opcional, se formos adicionar novos)
        // ...

        return new Response(JSON.stringify({ error: "ID not provided" }), { status: 400 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
