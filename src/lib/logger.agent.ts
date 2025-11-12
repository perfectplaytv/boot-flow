type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LoggerOptions {
  namespace?: string;
  level?: LogLevel;
  transport?: (level: LogLevel, message: string, meta?: Record<string, unknown>) => void;
}

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const defaultTransport: NonNullable<LoggerOptions['transport']> = (level, message, meta) => {
  const payload = meta ? `${message} ${JSON.stringify(meta)}` : message;
  switch (level) {
    case 'debug':
    case 'info':
      console.log(`[${level}]`, payload);
      break;
    case 'warn':
      console.warn(`[${level}]`, payload);
      break;
    case 'error':
      console.error(`[${level}]`, payload);
      break;
    default:
      console.log(payload);
  }
};

export const createAgentLogger = (options?: LoggerOptions) => {
  const namespace = options?.namespace ?? 'agent';
  const minLevel = options?.level ?? 'info';
  const transport = options?.transport ?? defaultTransport;

  const log = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
    if (levelPriority[level] < levelPriority[minLevel]) return;
    const formatted = `[${namespace}] ${message}`;
    transport(level, formatted, meta);
  };

  return {
    info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
    error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
    debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  };
};

export const agentLogger = createAgentLogger();
