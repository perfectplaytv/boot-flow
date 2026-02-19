/**
 * ===========================================
 * WhatsApp Link Shortener - Cloudflare Worker
 * ===========================================
 * 
 * Sistema de links curtos para redirecionamento ao WhatsApp
 * com mensagens personalizadas por rota.
 * 
 * Rotas disponíveis:
 * - /teste   → Solicitar teste do sistema
 * - /valores → Saber valores
 * - /planos  → Conhecer planos
 * - /duvidas → Tirar dúvidas
 * 
 * @author BootFlow
 * @version 1.0.0
 */

// ============================================
// CONFIGURAÇÃO PRINCIPAL
// ============================================

const CONFIG = {
    // Número do WhatsApp (formato internacional sem +)
    phone: "5527996467244",

    // Prefixo de origem (para tracking)
    defaultSource: "telegram",

    // URL base do WhatsApp
    waBaseUrl: "https://wa.me",
} as const;

// ============================================
// MAPEAMENTO DE ROTAS E MENSAGENS
// ============================================

interface RouteConfig {
    message: string;
    source?: string;  // Origem do lead (telegram, site, bio, etc)
    campaign?: string; // ID da campanha para tracking
}

const ROUTES: Record<string, RouteConfig> = {
    // ========== ROTAS PRINCIPAIS ==========
    "/teste": {
        message: "Olá! Vim do Telegram e gostaria de solicitar um teste do sistema.",
        source: "telegram",
        campaign: "teste-gratis"
    },
    "/valores": {
        message: "Olá! Vim do Telegram e gostaria de saber os valores.",
        source: "telegram",
        campaign: "consulta-precos"
    },
    "/planos": {
        message: "Oi! Estou vindo do Telegram e quero conhecer os planos disponíveis.",
        source: "telegram",
        campaign: "conhecer-planos"
    },
    "/duvidas": {
        message: "Olá! Vim do Telegram e tenho algumas dúvidas, pode me ajudar?",
        source: "telegram",
        campaign: "suporte"
    },

    // ========== ROTAS ADICIONAIS (EXPANDIR CONFORME NECESSÁRIO) ==========
    "/suporte": {
        message: "Olá! Preciso de suporte técnico, pode me ajudar?",
        source: "site",
        campaign: "suporte-tecnico"
    },
    "/indicacao": {
        message: "Olá! Fui indicado por um amigo e gostaria de saber mais sobre o sistema.",
        source: "indicacao",
        campaign: "programa-indicacao"
    },
    "/promo": {
        message: "Olá! Vi uma promoção e gostaria de mais informações.",
        source: "ads",
        campaign: "promocao-ativa"
    },

    // ========== ALIAS / ROTAS ALTERNATIVAS ==========
    "/t": { // Alias curto para /teste
        message: "Olá! Vim do Telegram e gostaria de solicitar um teste do sistema.",
        source: "telegram",
        campaign: "teste-gratis"
    },
    "/v": { // Alias curto para /valores
        message: "Olá! Vim do Telegram e gostaria de saber os valores.",
        source: "telegram",
        campaign: "consulta-precos"
    },
    "/p": { // Alias curto para /planos
        message: "Oi! Estou vindo do Telegram e quero conhecer os planos disponíveis.",
        source: "telegram",
        campaign: "conhecer-planos"
    },
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Gera a URL completa do WhatsApp com mensagem
 */
function buildWhatsAppUrl(message: string, phone: string = CONFIG.phone): string {
    const encodedMessage = encodeURIComponent(message);
    return `${CONFIG.waBaseUrl}/${phone}?text=${encodedMessage}`;
}

/**
 * Gera resposta de redirecionamento 302
 */
function redirectToWhatsApp(route: RouteConfig): Response {
    const url = buildWhatsAppUrl(route.message);

    return new Response(null, {
        status: 302,
        headers: {
            "Location": url,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Source": route.source || CONFIG.defaultSource,
            "X-Campaign": route.campaign || "direct",
        }
    });
}

/**
 * Página 404 elegante
 */
function notFoundPage(): Response {
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link não encontrado | BootFlow</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .error-code {
      font-size: 6rem;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; opacity: 0.9; }
    p { opacity: 0.7; margin-bottom: 2rem; }
    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
    }
    .links {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .links a {
      color: #667eea;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 20px;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .links a:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: #667eea;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-code">404</div>
    <h1>Link não encontrado</h1>
    <p>Este link não existe ou foi removido.</p>
    <a href="https://wa.me/${CONFIG.phone}" class="btn">
      💬 Falar no WhatsApp
    </a>
    <div class="links">
      <a href="/teste">📋 Teste Grátis</a>
      <a href="/valores">💰 Valores</a>
      <a href="/planos">📦 Planos</a>
      <a href="/duvidas">❓ Dúvidas</a>
    </div>
  </div>
</body>
</html>
  `.trim();

    return new Response(html, {
        status: 404,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache"
        }
    });
}

/**
 * Página inicial com lista de links disponíveis
 */
function homePage(): Response {
    const routeList = Object.entries(ROUTES)
        .filter(([path]) => !path.match(/^\/[a-z]$/)) // Exclui alias curtos
        .map(([path, config]) => `
      <a href="${path}" class="route-card">
        <span class="path">${path}</span>
        <span class="desc">${config.campaign?.replace(/-/g, ' ')}</span>
      </a>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Links Rápidos | BootFlow</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      padding: 2rem;
    }
    .container {
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    .logo { font-size: 2rem; margin-bottom: 0.5rem; }
    h1 { font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem; }
    .routes {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .route-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      text-decoration: none;
      color: white;
      transition: all 0.2s;
    }
    .route-card:hover {
      background: rgba(255,255,255,0.1);
      border-color: #25D366;
      transform: translateX(5px);
    }
    .path {
      font-family: monospace;
      font-size: 1rem;
      color: #25D366;
      font-weight: 600;
    }
    .desc {
      font-size: 0.875rem;
      opacity: 0.7;
      text-transform: capitalize;
    }
    .footer {
      margin-top: 2rem;
      opacity: 0.5;
      font-size: 0.75rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🚀</div>
    <h1>Links Rápidos para WhatsApp</h1>
    <div class="routes">
      ${routeList}
    </div>
    <p class="footer">Powered by BootFlow</p>
  </div>
</body>
</html>
  `.trim();

    return new Response(html, {
        status: 200,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
        }
    });
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

export default {
    async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const pathname = url.pathname.toLowerCase();

        // Rota raiz: mostrar página inicial
        if (pathname === "/" || pathname === "") {
            return homePage();
        }

        // Verificar se a rota existe
        const route = ROUTES[pathname];

        if (route) {
            // Log opcional (descomente se usar KV ou Analytics)
            // await logClick(env, pathname, route, request);

            return redirectToWhatsApp(route);
        }

        // Rota dinâmica: /custom?msg=MENSAGEM
        if (pathname === "/custom" && url.searchParams.has("msg")) {
            const customMessage = url.searchParams.get("msg") || "";
            return redirectToWhatsApp({ message: customMessage, source: "custom" });
        }

        // 404 para rotas não encontradas
        return notFoundPage();
    }
};

// ============================================
// FUNÇÃO DE LOG (OPCIONAL)
// ============================================

// Descomente e configure se quiser tracking de cliques
/*
interface Env {
  CLICK_TRACKER?: KVNamespace;
  ANALYTICS?: AnalyticsEngineDataset;
}

async function logClick(
  env: Env,
  pathname: string,
  route: RouteConfig,
  request: Request
): Promise<void> {
  const timestamp = new Date().toISOString();
  const userAgent = request.headers.get("user-agent") || "unknown";
  const country = request.headers.get("cf-ipcountry") || "unknown";
  
  // Log em KV (contagem simples)
  if (env.CLICK_TRACKER) {
    const key = `clicks:${pathname}:${new Date().toISOString().split('T')[0]}`;
    const current = parseInt(await env.CLICK_TRACKER.get(key) || "0");
    await env.CLICK_TRACKER.put(key, String(current + 1), { expirationTtl: 86400 * 30 });
  }
  
  // Log em Analytics Engine
  if (env.ANALYTICS) {
    env.ANALYTICS.writeDataPoint({
      blobs: [pathname, route.source || "unknown", route.campaign || "unknown", country, userAgent],
      doubles: [1], // count
      indexes: [pathname]
    });
  }
}
*/
