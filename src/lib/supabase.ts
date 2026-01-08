
// Mock do Supabase Client para não quebrar imports existentes
// TODO: Substituir por chamadas à API do Cloudflare

const mockSupabase = {
    from: () => ({
        select: () => ({
            eq: () => ({ single: () => ({ data: null, error: null }), maybeSingle: () => ({ data: null, error: null }) }),
            order: () => ({ data: [], error: null }),
            data: [],
            error: null
        }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
        // Adicione mais mocks conforme necessário
    }),
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { session: null }, error: new Error("Supabase removido. Use a nova API.") }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    },
    channel: () => ({
        on: () => ({ subscribe: () => { } }),
        subscribe: () => { }
    })
};

export const supabase = mockSupabase;
export type UserProfile = Record<string, unknown>;
