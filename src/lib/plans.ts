// Configuração dos planos e suas features
export interface PlanConfig {
    name: string;
    price: string;
    priceValue: number;
    maxClients: number;
    features: string[];
    description: string;
}

export const PLANS: Record<string, PlanConfig> = {
    'Essencial': {
        name: 'Essencial',
        price: 'R$ 0',
        priceValue: 0,
        maxClients: 5,
        description: 'Para quem está começando e quer organizar o jogo',
        features: [
            '5 clientes',
            'Gestor Bot',
            'Link WhatsApp',
            'WhatsAPI própria (envios ilimitados)',
            'Campanhas WhatsApp',
            'Envio de e-mail',
            'Emite cobranças',
            'Link de pagamento',
            'Financeiro completo',
            'Faturas de clientes',
            'Área do cliente',
            'Exportar dados financeiros',
            'Integração Mercado Pago',
            'Envio de produtos digitais'
        ]
    },
    'Profissional': {
        name: 'Profissional',
        price: 'R$ 29,90',
        priceValue: 29.90,
        maxClients: 50,
        description: 'Para quem já tem fluxo e precisa escalar com estrutura',
        features: [
            '50 clientes',
            'Tudo do Essencial',
            'Prioridade no suporte'
        ]
    },
    'Business': {
        name: 'Business',
        price: 'R$ 39,90',
        priceValue: 39.90,
        maxClients: 100,
        description: 'Para quem está crescendo firme e quer automação séria',
        features: [
            '100 clientes',
            'Tudo do Profissional',
            'Recursos avançados de automação'
        ]
    },
    'Elite': {
        name: 'Elite',
        price: 'R$ 59,90',
        priceValue: 59.90,
        maxClients: 1000,
        description: 'Para quem quer jogar no nível alto e dominar o mercado',
        features: [
            '1.000 clientes',
            'Tudo do Business',
            'Suporte VIP',
            'Migração assistida',
            'Auditoria rápida do funil'
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
