// Types for the Aquecer Contas (Group Heating) feature

export interface HeatingGroup {
    id: number;
    admin_id: string;
    name: string;
    chat_id: string;
    description?: string;
    tags?: string[];
    is_active: boolean;
    last_test_at?: string;
    test_status: 'pending' | 'success' | 'failed';
    created_at: string;
    updated_at: string;
}

export interface HeatingBot {
    id: number;
    admin_id: string;
    name: string;
    token: string;
    username?: string;
    status: 'active' | 'inactive' | 'error';
    max_messages_per_hour: number;
    max_messages_per_day: number;
    messages_sent_today: number;
    messages_sent_this_hour: number;
    last_validated_at?: string;
    validation_error?: string;
    created_at: string;
    updated_at: string;
}

export interface HeatingCampaign {
    id: number;
    admin_id: string;
    name: string;
    group_id: number;
    group_name?: string; // Populated from join
    status: 'paused' | 'running' | 'stopped' | 'completed';
    send_mode: 'sequential' | 'random' | 'no_repeat';
    interval_min: number;
    interval_max: number;
    window_start: string;
    window_end: string;
    max_messages_per_bot_per_day: number;
    message_index: number;
    total_messages_sent: number;
    total_errors: number;
    last_sent_at?: string;
    created_at: string;
    updated_at: string;
    // Relations
    bots?: HeatingCampaignBot[];
    messages?: HeatingMessage[];
}

export interface HeatingCampaignBot {
    id: number;
    campaign_id: number;
    bot_id: number;
    bot_name?: string; // Populated from join
    bot_username?: string;
    messages_sent_today: number;
    last_sent_at?: string;
    next_send_at?: string;
}

export interface HeatingMessage {
    id: number;
    campaign_id: number;
    content: string;
    order_index: number;
    times_sent: number;
    last_sent_at?: string;
    created_at: string;
}

export interface HeatingLog {
    id: number;
    campaign_id: number;
    bot_id?: number;
    bot_name?: string; // Populated from join
    message_id?: number;
    message_preview?: string; // First 50 chars of message
    status: 'success' | 'error' | 'skipped';
    error_message?: string;
    telegram_message_id?: string;
    sent_at: string;
}

export interface HeatingBotState {
    id: number;
    campaign_id: number;
    bot_id: number;
    last_sent_at?: string;
    next_scheduled_at?: string;
    messages_sent_today: number;
    last_message_index: number;
    last_reset_date?: string;
}

// Form types for creating/editing
export interface CreateHeatingGroupForm {
    name: string;
    chat_id: string;
    description?: string;
    tags?: string;
}

export interface CreateHeatingBotForm {
    name: string;
    token: string;
    max_messages_per_hour: number;
    max_messages_per_day: number;
}

export interface CreateHeatingCampaignForm {
    name: string;
    group_id: number;
    bot_ids: number[];
    messages: string[];
    send_mode: 'sequential' | 'random' | 'no_repeat';
    interval_min: number;
    interval_max: number;
    window_start: string;
    window_end: string;
    max_messages_per_bot_per_day: number;
}

// Stats
export interface HeatingStats {
    totalGroups: number;
    totalBots: number;
    activeBots: number;
    totalCampaigns: number;
    runningCampaigns: number;
    totalMessagesSent: number;
    totalErrors: number;
    successRate: number;
}

// API Response types
export interface TelegramBotInfo {
    ok: boolean;
    result?: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username: string;
        can_join_groups: boolean;
        can_read_all_group_messages: boolean;
    };
    error_code?: number;
    description?: string;
}

export interface TelegramSendMessageResponse {
    ok: boolean;
    result?: {
        message_id: number;
        chat: {
            id: number;
            title?: string;
            type: string;
        };
        date: number;
        text?: string;
    };
    error_code?: number;
    description?: string;
}
