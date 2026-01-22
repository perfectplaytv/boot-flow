
interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;

    // TODO: Add proper Admin Authentication check here
    // const session = await getAdminSession(context.request);
    // if (!session) return new Response('Unauthorized', { status: 401 });

    try {
        // Query principal: Busca revendas e seus limites
        // Note: Using 'resellers' table. Ensure it matches your schema (e.g., singular vs plural)
        // Checking schema: migrations indicate table is 'resellers'
        const resellers = await DB.prepare(`
            SELECT 
                r.id, 
                r.name, 
                r.email, 
                r.plan_name, 
                r.status, 
                r.created_at,
                r.max_clients, 
                r.max_resellers, 
                r.max_apps, 
                r.max_charges,
                r.feature_analytics, 
                r.feature_botgram, 
                r.support_level
            FROM resellers r
            ORDER BY r.created_at DESC
        `).all();

        const data = [];

        // Para cada revenda, computar uso REAL (Counts)
        // Optimization: In a real heavy-load scenario, use a single aggregated query or indexed views.
        // For standard usage, this loop is acceptable if reseller count < 1000.
        for (const r of resellers.results) {
            // Count Clients
            // Assuming 'clientes' table has reseller_id
            const clientCount = await DB.prepare('SELECT COUNT(*) as count FROM clientes WHERE reseller_id = ?').bind(r.id).first('count') || 0;

            // Count Apps (Placeholder: assumes no apps table or apps table with reseller_id)
            // If apps table doesn't exist yet, return 0 to avoid crash
            // const appCount = await DB.prepare('SELECT COUNT(*) as count FROM apps WHERE reseller_id = ?').bind(r.id).first('count') || 0;
            const appCount = 0;

            // Count Charges (Placeholder)
            // const chargeCount = await DB.prepare('SELECT COUNT(*) as count FROM cobrancas WHERE reseller_id = ?').bind(r.id).first('count') || 0;
            const chargeCount = 0;

            data.push({
                ...r,
                usage: {
                    clients: clientCount,
                    apps: appCount,
                    charges: chargeCount
                }
            });
        }

        return Response.json({ success: true, data });

    } catch (e) {
        return Response.json({ success: false, error: e instanceof Error ? e.message : 'Error fetching reseller plans' }, { status: 500 });
    }
};
