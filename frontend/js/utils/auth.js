import { fetchAPI } from './api.js';

export async function checkAuthStatus() {
    try {
        const data = await fetchAPI('/auth/status');
        return {
            isAuthenticated: data.authenticated,
            user: data.user
        };
    } catch (error) {
        console.error('Auth check failed:', error);
        return {
            isAuthenticated: false,
            user: null
        };
    }
}

export function redirectToLogin() {
    window.location.href = '/pages/login.html';
}

export function redirectToSignup() {
    window.location.href = '/pages/signup.html';
}

export async function logout() {
    try {
        await fetchAPI('/auth/logout', { method: 'POST' });
        window.location.href = '/pages/login.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}
