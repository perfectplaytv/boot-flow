
interface Env {
    BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    // Estratégia: Pegar tudo depois de /api/storage/
    const url = new URL(context.request.url);
    // O path pode vir encoded pelo browser, então decodeURI é bom.
    const path = decodeURIComponent(url.pathname.replace('/api/storage/', ''));

    // Se for vazio ou "/"
    if (!path || path === '/') {
        return new Response('Arquivo não especificado', { status: 400 });
    }

    try {
        const object = await context.env.BUCKET.get(path);

        if (!object) {
            return new Response('Arquivo não encontrado', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
            headers,
        });

    } catch (error: unknown) {
        console.error('Erro storage download:', error);
        return new Response('Erro ao recuperar arquivo', { status: 500 });
    }
};
