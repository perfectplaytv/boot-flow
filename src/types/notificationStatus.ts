export const TEMPLATE_STATUS = {
    ATIVO: 'Ativo',
    INATIVO: 'Inativo'
} as const;

export const HISTORICO_STATUS = {
    ENTREGUE: 'Entregue',
    LIDO: 'Lido',
    FALHA: 'Falha'
} as const;

export type TemplateStatus = typeof TEMPLATE_STATUS[keyof typeof TEMPLATE_STATUS];
export type HistoricoStatus = typeof HISTORICO_STATUS[keyof typeof HISTORICO_STATUS];
