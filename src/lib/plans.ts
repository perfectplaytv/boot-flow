// Configuração dos planos e suas features
export interface PlanConfig {
    name: string;
    price: string;
    priceValue: number;
    maxClients: number;
    maxResellers: number;
    maxApps: number;
    maxBilling: number;
    maxWhatsAppConnections: number;
    maxWhatsAppNotifications: number;
    maxGateways: number;
    hasAnalytics: boolean;
    hasBotGram: boolean;
    hasPlansAndPricing: number;
    features: string[];
    description: string;
}

export const PLANS: Record<string, PlanConfig> = {
    'Essencial': {
        name: 'Essencial',
        price: 'R$ 0',
        priceValue: 0,
        maxClients: 5,
        maxResellers: 5,
        maxApps: 5,
        maxBilling: 5,
        maxWhatsAppConnections: 1,
        maxWhatsAppNotifications: 5,
        maxGateways: 4,
        hasAnalytics: false,
        hasBotGram: false,
        hasPlansAndPricing: 0,
        description: 'Para quem está começando e quer organizar o jogo',
        features: [
            '5 Clientes',
            '5 Revendas',
            '5 Aplicativos',
            'Lista de Servidores (5)',
            'Lista de Aplicativos (5)',
            '5 Cobranças',
            '1 Conexão WhatsApp Business',
            '5 Notificações WhatsApp',
            '4 Gateways de Pagamentos',
            'Perfil',
            'Faturamento',
            'Segurança'
        ]
    },
    'Profissional': {
        name: 'Profissional',
        price: 'R$ 29,90',
        priceValue: 29.90,
        maxClients: 50,
        maxResellers: 50,
        maxApps: 15,
        maxBilling: 50,
        maxWhatsAppConnections: 1,
        maxWhatsAppNotifications: 25,
        maxGateways: 4,
        hasAnalytics: false,
        hasBotGram: false,
        hasPlansAndPricing: 0,
        description: 'Para quem já tem fluxo e precisa escalar com estrutura',
        features: [
            '50 Clientes',
            '50 Revendas',
            '15 Aplicativos',
            'Lista de Servidores (15)',
            'Lista de Aplicativos (15)',
            '50 Cobranças',
            '1 Conexão WhatsApp Business',
            '25 Notificações WhatsApp',
            '4 Gateways de Pagamentos',
            'Perfil + Notificações + Integrações',
            'Faturamento + Segurança',
            'Tudo do Essencial',
            'Prioridade no suporte'
        ]
    },
    'Business': {
        name: 'Business',
        price: 'R$ 39,90',
        priceValue: 39.90,
        maxClients: 100,
        maxResellers: 100,
        maxApps: 100,
        maxBilling: 100,
        maxWhatsAppConnections: 2,
        maxWhatsAppNotifications: 100,
        maxGateways: 5,
        hasAnalytics: true,
        hasBotGram: false,
        hasPlansAndPricing: 3,
        description: 'Para quem está crescendo firme e quer automação séria',
        features: [
            '100 Clientes',
            '100 Revendas',
            '100 Aplicativos',
            'Lista de Servidores (100)',
            'Lista de Aplicativos (100)',
            '3 Planos e Preços',
            '100 Cobranças',
            '2 Conexões WhatsApp Business',
            '100 Notificações WhatsApp',
            '5 Gateways de Pagamentos',
            'Painel de Análises completo',
            'Perfil + Notificações + Integrações',
            'Faturamento + Segurança',
            'Tudo do Profissional',
            'Recursos avançados de automação'
        ]
    },
    'Elite': {
        name: 'Elite',
        price: 'R$ 59,90',
        priceValue: 59.90,
        maxClients: 10000,
        maxResellers: 10000,
        maxApps: 1000,
        maxBilling: 10000,
        maxWhatsAppConnections: 5,
        maxWhatsAppNotifications: 1000,
        maxGateways: 10,
        hasAnalytics: true,
        hasBotGram: true,
        hasPlansAndPricing: 10,
        description: 'Para quem quer jogar no nível alto e dominar o mercado',
        features: [
            '10.000 Clientes',
            '10.000 Revendas',
            '1.000 Aplicativos',
            'Lista de Servidores (1.000)',
            'Lista de Aplicativos (1.000)',
            'Painel BotGram',
            'Tudo do Business',
            'Suporte VIP'
        ]
    }
};

// Função para obter o limite de clientes pelo nome do plano
export function getMaxClientsByPlan(planName: string): number {
    return PLANS[planName]?.maxClients || 5;
}

// Função para verificar se uma feature está disponível no plano
export function hasFeature(planName: string, feature: string): boolean {
    const plan = PLANS[planName];
    if (!plan) return false;

    // Features cumulativas - cada plano inclui as do anterior
    const planOrder = ['Essencial', 'Profissional', 'Business', 'Elite'];
    const planIndex = planOrder.indexOf(planName);

    // Verificar em todos os planos até o atual
    for (let i = 0; i <= planIndex; i++) {
        const currentPlan = PLANS[planOrder[i]];
        if (currentPlan?.features.includes(feature)) {
            return true;
        }
    }

    return false;
}

// Função para gerar senha aleatória
export function generatePassword(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
