
interface Env {
    BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const key = context.params.key as string;

    // Se o key vier com "uploads/..." a rota /api/storage/[key] pega só o primeiro segmento se não usarmos [key]. 
    // Na verdade, Pages Functions com [key] pegam apenas um nível.
    // SE a gente quiser passar caminhos com barras, melhor usar [...path].
    // Mas vamos tentar simplificar. O R2 key pode conter barras.
    // Vamos usar o path completo da URL para extrair a key.

    // Estratégia: Pegar tudo depois de /api/storage/
    const url = new URL(context.request.url);
    const path = url.pathname.replace('/api/storage/', '');
    // path agora deve ser "uploads/userid/arquivo.png"

    if (!path) {
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
        return new Response('Erro ao recuperar arquivo', { status: 500 });
    }
};
