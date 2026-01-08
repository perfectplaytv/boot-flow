import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabela de Usuários (Clientes)
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    server: text('server'),
    plan: text('plan').notNull(), // 'Mensal', 'Trimestral', etc.
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    status: text('status').notNull().default('Ativo'), // 'Ativo', 'Inativo', etc.
    expiration_date: text('expiration_date').notNull(),
    devices: integer('devices').default(0),
    credits: integer('credits').default(0),
    password: text('password'),
    bouquets: text('bouquets'),
    real_name: text('real_name'),
    whatsapp: text('whatsapp'),
    telegram: text('telegram'),
    observations: text('observations'),
    notes: text('notes'),
    m3u_url: text('m3u_url'),
    renewal_date: text('renewal_date'),
    phone: text('phone'),
    owner_uid: text('owner_uid'), // ID do admin/revenda que criou
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Revendedores
export const resellers = sqliteTable('resellers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    password: text('password'),
    permission: text('permission').default('reseller'),
    credits: integer('credits').default(10),
    personal_name: text('personal_name'),
    status: text('status').default('Ativo'),
    force_password_change: integer('force_password_change', { mode: 'boolean' }).default(false),
    servers: text('servers'),
    master_reseller: text('master_reseller'),
    disable_login_days: integer('disable_login_days').default(0),
    monthly_reseller: integer('monthly_reseller', { mode: 'boolean' }).default(false),
    telegram: text('telegram'),
    whatsapp: text('whatsapp'),
    observations: text('observations'),
    owner_uid: text('owner_uid'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Cobranças
export const cobrancas = sqliteTable('cobrancas', {
    id: text('id').primaryKey(), // UUID gerado no app
    cliente_id: text('cliente_id'), // Referência ao ID do cliente (pode ser string ou int convertido)
    valor: real('valor').notNull(),
    data_vencimento: text('data_vencimento').notNull(),
    status: text('status').notNull().default('pendente'), // 'pendente', 'pago', etc.
    descricao: text('descricao'),
    owner_uid: text('owner_uid'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});