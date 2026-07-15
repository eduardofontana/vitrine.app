type LogLevel = "error" | "warn" | "info";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

function formatEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }
  const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
  return `[${entry.level.toUpperCase()}] ${entry.message}${ctx}`;
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  error: (message: string, context?: Record<string, unknown>) =>
    log("error", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    log("warn", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", message, context),

  auth: {
    loginFailed: (email: string, ip: string, reason: string) =>
      log("warn", "Login failed", { email, ip, reason }),
    unauthorized: (userId: string | null, endpoint: string, ip: string) =>
      log("warn", "Unauthorized access attempt", { userId, endpoint, ip }),
  },

  admin: {
    action: (adminId: string, action: string, targetId: string) =>
      log("info", "Admin action", { adminId, action, targetId }),
  },
};
