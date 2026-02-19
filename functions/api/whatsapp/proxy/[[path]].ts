
export const onRequest: PagesFunction = async (context) => {
    const path = context.params.path;

    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, DeviceToken, profile-id, Accept, device-token',
        'Access-Control-Max-Age': '86400',
    };

    // Handle OPTIONS Preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders
        });
    }

    // Validate path is an array and not empty
    if (!Array.isArray(path) || path.length === 0) {
        return new Response('Invalid path', {
            status: 400,
            headers: corsHeaders
        });
    }

    // API Brasil Base URL
    const API_BRASIL_BASE = 'https://gateway.apibrasil.io/api/v2/whatsapp';

    // Reconstruct the target URL
    const targetPath = path.join('/');
    const targetUrl = `${API_BRASIL_BASE}/${targetPath}`;

    console.log(`[Proxy] Forwarding request to: ${targetUrl}`);

    // Explicitly extract headers handling case-insensitivity manually
    // Cloudflare Workers headers are case-insensitive accessible via .get()
    const newHeaders = new Headers();
    const auth = context.request.headers.get('Authorization') || context.request.headers.get('authorization');
    const deviceToken = context.request.headers.get('DeviceToken') || context.request.headers.get('devicetoken') || context.request.headers.get('device-token');
    const profileId = context.request.headers.get('profile-id') || context.request.headers.get('Profile-id') || context.request.headers.get('Profile-Id');

    // Set headers explicitly for the upstream request
    if (auth) newHeaders.set('Authorization', auth);
    if (deviceToken) newHeaders.set('DeviceToken', deviceToken);
    if (profileId) newHeaders.set('profile-id', profileId);

    // Always set content type and accept
    newHeaders.set('Content-Type', 'application/json');
    newHeaders.set('Accept', 'application/json');

    try {
        const { method, body } = context.request;

        // For GET/HEAD/OPTIONS methods, body must be null
        const fetchOptions: RequestInit = {
            method,
            headers: newHeaders,
        };

        if (method !== 'GET' && method !== 'HEAD') {
            fetchOptions.body = body;
        }

        const response = await fetch(targetUrl, fetchOptions);

        // Create a new response with the data from the upstream API
        const responseBody = await response.arrayBuffer();

        const responseHeaders = new Headers(response.headers);

        // Append CORS headers to the response
        Object.entries(corsHeaders).forEach(([key, value]) => {
            responseHeaders.set(key, value);
        });

        return new Response(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });

    } catch (err) {
        console.error('[Proxy] Error:', err);
        return Response.json(
            { success: false, error: 'Proxy Error: ' + String(err) },
            {
                status: 500,
                headers: corsHeaders
            }
        );
    }
};
