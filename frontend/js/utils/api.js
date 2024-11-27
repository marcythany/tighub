/**
 * Base configuration for API requests
 */
const API_BASE_URL = 'http://localhost:3000'; // URL do backend

const defaultOptions = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * Makes an API request with proper error handling
 * @param {string} endpoint - The API endpoint (e.g., '/users/profile')
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Response data
 * @throws {Error} API error with message
 */
export async function fetchAPI(endpoint, options = {}) {
    try {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(handleAPIError(error));
    }
}

/**
 * Checks if user is authenticated
 * @returns {Promise<{authenticated: boolean, user: object|null}>}
 */
export async function checkAuthentication() {
    try {
        const response = await fetchAPI('/auth/status');
        return response;
    } catch (error) {
        return { authenticated: false, user: null };
    }
}

/**
 * Get user profile data
 * @param {string} username - Optional username, if not provided returns current user's profile
 * @returns {Promise<object>} User profile data
 */
export async function getUserProfile(username = '') {
    const endpoint = username ? `/api/users/${username}` : '/api/users/profile';
    return await fetchAPI(endpoint);
}

/**
 * Get user repositories
 * @param {string} username - Optional username, if not provided returns current user's repositories
 * @returns {Promise<Array>} List of repositories
 */
export async function getUserRepositories(username = '') {
    const endpoint = username ? `/api/users/${username}/repositories` : '/api/repositories';
    return await fetchAPI(endpoint);
}

/**
 * Like a user
 * @param {string} username - Username to like
 * @returns {Promise<object>} Response data
 */
export async function likeUser(username) {
    return await fetchAPI(`/api/users/${username}/like`, {
        method: 'POST'
    });
}

/**
 * Unlike a user
 * @param {string} username - Username to unlike
 * @returns {Promise<object>} Response data
 */
export async function unlikeUser(username) {
    return await fetchAPI(`/api/users/${username}/unlike`, {
        method: 'POST'
    });
}

/**
 * Get liked users
 * @returns {Promise<Array>} List of liked users
 */
export async function getLikedUsers() {
    return await fetchAPI('/api/users/liked');
}

/**
 * Handles API errors and returns user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function handleAPIError(error) {
    if (error.message.includes('401')) {
        return 'You need to be logged in to perform this action.';
    }
    if (error.message.includes('403')) {
        return 'You do not have permission to perform this action.';
    }
    if (error.message.includes('404')) {
        return 'The requested resource was not found.';
    }
    if (error.message.includes('429')) {
        return 'Too many requests. Please try again later.';
    }
    if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        return 'Unable to connect to the server. Please check your internet connection.';
    }
    return error.message || 'An unexpected error occurred. Please try again later.';
}
