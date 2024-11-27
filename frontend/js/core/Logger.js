import { eventBus, Events } from './EventBus.js';

/**
 * Log levels enum
 */
export const LogLevel = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};

/**
 * Logger class for consistent logging across the application
 */
class Logger {
    constructor() {
        this.level = process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG;
    }

    /**
     * Set the logging level
     * @param {LogLevel} level - The log level to set
     */
    setLevel(level) {
        this.level = level;
    }

    /**
     * Get numeric value for log level
     * @param {LogLevel} level - The log level
     * @returns {number} Numeric value of log level
     */
    getLevelValue(level) {
        const levels = {
            [LogLevel.ERROR]: 0,
            [LogLevel.WARN]: 1,
            [LogLevel.INFO]: 2,
            [LogLevel.DEBUG]: 3
        };
        return levels[level];
    }

    /**
     * Check if a log level should be displayed
     * @param {LogLevel} level - The log level to check
     * @returns {boolean} Whether the log should be displayed
     */
    shouldLog(level) {
        return this.getLevelValue(level) <= this.getLevelValue(this.level);
    }

    /**
     * Format a log message
     * @param {LogLevel} level - Log level
     * @param {string} message - Log message
     * @param {Object} [data] - Additional data to log
     * @returns {Object} Formatted log object
     */
    formatLog(level, message, data = {}) {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            correlationId: this.correlationId
        };
    }

    /**
     * Set correlation ID for request tracking
     * @param {string} id - Correlation ID
     */
    setCorrelationId(id) {
        this.correlationId = id;
    }

    /**
     * Log an error message
     * @param {string} message - Error message
     * @param {Error|Object} [error] - Error object or additional data
     */
    error(message, error = {}) {
        if (this.shouldLog(LogLevel.ERROR)) {
            const logData = this.formatLog(LogLevel.ERROR, message, {
                error: error instanceof Error ? {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                } : error
            });
            console.error(logData);
            eventBus.emit(Events.ERROR_OCCURRED, logData);
        }
    }

    /**
     * Log a warning message
     * @param {string} message - Warning message
     * @param {Object} [data] - Additional data
     */
    warn(message, data = {}) {
        if (this.shouldLog(LogLevel.WARN)) {
            const logData = this.formatLog(LogLevel.WARN, message, data);
            console.warn(logData);
        }
    }

    /**
     * Log an info message
     * @param {string} message - Info message
     * @param {Object} [data] - Additional data
     */
    info(message, data = {}) {
        if (this.shouldLog(LogLevel.INFO)) {
            const logData = this.formatLog(LogLevel.INFO, message, data);
            console.info(logData);
        }
    }

    /**
     * Log a debug message
     * @param {string} message - Debug message
     * @param {Object} [data] - Additional data
     */
    debug(message, data = {}) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            const logData = this.formatLog(LogLevel.DEBUG, message, data);
            console.debug(logData);
        }
    }

    /**
     * Create a child logger with a specific context
     * @param {Object} context - Context data to include in logs
     * @returns {Logger} New logger instance with context
     */
    withContext(context) {
        const childLogger = new Logger();
        childLogger.level = this.level;
        childLogger.correlationId = this.correlationId;
        childLogger.context = { ...this.context, ...context };
        return childLogger;
    }
}

// Export singleton instance
export const logger = new Logger();
