import { eventBus, Events } from '../core/EventBus.js';

/**
 * Custom error class for API-related errors
 */
class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Centralized API client for handling all HTTP requests
 */
class ApiClient {
    constructor() {
        this.baseURL = import.meta.env.PROD ? '/api' : 'http://localhost:3000';
    }

    /**
     * Make an HTTP request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} Response data
     * @throws {ApiError} When request fails
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        try {
            eventBus.emit(Events.LOADING_START);
            
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await this.handleResponse(response);
            
            eventBus.emit(Events.LOADING_END);
            return data;
        } catch (error) {
            eventBus.emit(Events.LOADING_END);
            
            // Convert network errors to ApiError
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                const networkError = new ApiError('Network Error', 0);
                networkError.originalError = error;
                this.handleError(networkError);
                throw networkError;
            }

            // If it's already an ApiError, just handle and rethrow
            if (error instanceof ApiError) {
                this.handleError(error);
                throw error;
            }

            // Convert unknown errors to ApiError
            const apiError = new ApiError(
                error.message || 'Unknown error occurred',
                error.status || 500,
                error.data
            );
            this.handleError(apiError);
            throw apiError;
        }
    }

    /**
     * Handle API response
     * @param {Response} response - Fetch response object
     * @returns {Promise} Parsed response data
     * @throws {ApiError} When response is not ok or parsing fails
     */
    async handleResponse(response) {
        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new ApiError(
                'Invalid response format',
                response.status
            );
        }

        if (!response.ok) {
            throw new ApiError(
                data?.message || data?.error || 'API Error',
                response.status,
                data
            );
        }

        return data;
    }

    /**
     * Handle API errors
     * @param {ApiError} error - Error object
     */
    handleError(error) {
        console.error('API Error:', error);
        eventBus.emit(Events.ERROR_OCCURRED, {
            message: error.message,
            status: error.status,
            data: error.data || undefined
        });
    }

    // Convenience methods for common HTTP methods
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // API endpoints
    auth = {
        login: () => this.get('/api/auth/github'),
        logout: () => this.post('/api/auth/logout'),
        getUser: () => this.get('/api/auth/user')
    };

    users = {
        getProfile: (username) => this.get(`/users/${username}`),
        getLikes: (username) => this.get(`/users/${username}/likes`),
        addLike: (username) => this.post(`/users/${username}/likes`),
        removeLike: (username) => this.delete(`/users/${username}/likes`)
    };

    repos = {
        get: (owner, repo) => this.get(`/repos/${owner}/${repo}`),
        getLikes: (owner, repo) => this.get(`/repos/${owner}/${repo}/likes`),
        addLike: (owner, repo) => this.post(`/repos/${owner}/${repo}/likes`),
        removeLike: (owner, repo) => this.delete(`/repos/${owner}/${repo}/likes`)
    };
}

// Export singleton instance
export const api = new ApiClient();
