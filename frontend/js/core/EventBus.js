/**
 * EventBus for handling application-wide events
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = new Set();
        }
        this.events[event].add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Event handler to remove
     */
    off(event, callback) {
        if (this.events[event]) {
            this.events[event].delete(callback);
            if (this.events[event].size === 0) {
                delete this.events[event];
            }
        }
    }

    /**
     * Emit an event with data
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Subscribe to an event and unsubscribe after first emission
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (data) => {
            callback(data);
            unsubscribe();
        });
        return unsubscribe;
    }

    /**
     * Clear all event listeners
     */
    clear() {
        this.events = {};
    }
}

// Create a singleton instance
export const eventBus = new EventBus();

// Export event names as constants
export const Events = {
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_PROFILE_UPDATE: 'user:profile:update',
    LIKE_ADDED: 'like:added',
    LIKE_REMOVED: 'like:removed',
    THEME_CHANGED: 'theme:changed',
    LANGUAGE_CHANGED: 'language:changed',
    ERROR_OCCURRED: 'error:occurred',
    LOADING_START: 'loading:start',
    LOADING_END: 'loading:end'
};
