/**
 * Production-safe logging utility
 * Logs are disabled in production unless explicitly enabled via environment variable
 * Integrates with error tracking services (LogRocket automatically captures console errors)
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const enableLogging = process.env.ENABLE_LOGGING === 'true' || isDevelopment;

class Logger {
  private shouldLog(): boolean {
    if (!enableLogging && isProduction) {
      return false;
    }
    return true;
  }

  private formatMessage(message: string, context?: string): string {
    if (context) {
      return `[${context}] ${message}`;
    }
    return message;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.warn(this.formatMessage(message), ...args);
      // LogRocket automatically captures console.warn
    }
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    // Always log errors, even in production
    // LogRocket automatically captures console.error, no manual reporting needed
    if (error instanceof Error) {
      console.error(this.formatMessage(message), error.message, error.stack, ...args);
    } else {
      console.error(this.formatMessage(message), error, ...args);
    }
  }

  log(message: string, ...args: unknown[]): void {
    this.info(message, ...args);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for convenience
export default logger;

