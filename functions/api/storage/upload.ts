
import { verifyToken } from '../../utils/auth';

interface Env {
    BUCKET: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        // 1. Autenticação
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');
        const user = await verifyToken(token);
        if (!user) {
            return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
        }

        // 2. Processar Upload
        const formData = await context.request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return new Response(JSON.stringify({ error: 'Arquivo não enviado' }), { status: 400 });
        }

        // Validar tipo de arquivo e tamanho (Opcional, mas recomendado)
        // Limite de 5MB por exemplo
        if (file.size > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: 'Arquivo muito grande (Máx 5MB)' }), { status: 400 });
        }

        // 3. Gerar Nome Único
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        // Sanitizar nome do arquivo
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${user.id}/${timestamp}-${random}-${safeName}`;

        // 4. Salvar no R2
        // Convertemos para ArrayBuffer para salvar
        const arrayBuffer = await file.arrayBuffer();

        await context.env.BUCKET.put(key, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
            customMetadata: {
                uploadedBy: String(user.id),
                originalName: file.name
            }
        });

        // 5. Retornar URL (URL relativa à nossa API de download que criaremos)
        const url = `/api/storage/${key}`;

        return new Response(JSON.stringify({
            success: true,
            key,
            url,
            type: file.type,
            size: file.size
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro no upload';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};
