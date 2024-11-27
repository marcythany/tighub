import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { api } from '../services/ApiClient.js';
import { eventBus, Events } from '../core/EventBus.js';

// Mock eventBus
const originalEmit = eventBus.emit;
let emitCalls = [];

beforeEach(() => {
    // Reset event bus calls
    emitCalls = [];
    eventBus.emit = (...args) => {
        emitCalls.push(args);
        return originalEmit.apply(eventBus, args);
    };
});

afterEach(() => {
    // Restore eventBus.emit
    eventBus.emit = originalEmit;
});

describe('ApiClient', () => {
    describe('request', () => {
        test('should make successful request', async () => {
            const testData = { message: 'success' };
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    status: 200,
                    json: async () => testData
                };
            };

            const result = await api.request('/test');
            
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/test');
            expect(result).toEqual(testData);
            expect(emitCalls).toContainEqual([Events.LOADING_START]);
            expect(emitCalls).toContainEqual([Events.LOADING_END]);
        });

        test('should handle request error', async () => {
            const errorData = { message: 'API Error' };
            let fetchCalled = false;
            
            globalThis.fetch = async () => {
                fetchCalled = true;
                return {
                    ok: false,
                    status: 400,
                    json: async () => errorData
                };
            };

            await expect(api.request('/test')).rejects.toThrow('API Error');
            expect(fetchCalled).toBe(true);
            expect(emitCalls).toContainEqual([Events.ERROR_OCCURRED, {
                message: 'API Error',
                status: 400,
                data: errorData
            }]);
        });

        test('should handle network error', async () => {
            let fetchCalled = false;
            
            globalThis.fetch = async () => {
                fetchCalled = true;
                throw new TypeError('Failed to fetch');
            };

            await expect(api.request('/test')).rejects.toThrow('Network Error');
            expect(fetchCalled).toBe(true);
            expect(emitCalls).toContainEqual([Events.ERROR_OCCURRED, {
                message: 'Network Error',
                status: 0,
                data: undefined
            }]);
        });
    });

    describe('HTTP methods', () => {
        test('GET request', async () => {
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    json: async () => ({})
                };
            };

            await api.get('/test');
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/test');
            expect(fetchOptions.method).toBe('GET');
        });

        test('POST request', async () => {
            const data = { key: 'value' };
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    json: async () => ({})
                };
            };

            await api.post('/test', data);
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/test');
            expect(fetchOptions.method).toBe('POST');
            expect(fetchOptions.body).toBe(JSON.stringify(data));
        });

        test('PUT request', async () => {
            const data = { key: 'value' };
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    json: async () => ({})
                };
            };

            await api.put('/test', data);
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/test');
            expect(fetchOptions.method).toBe('PUT');
            expect(fetchOptions.body).toBe(JSON.stringify(data));
        });

        test('DELETE request', async () => {
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    json: async () => ({})
                };
            };

            await api.delete('/test');
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/test');
            expect(fetchOptions.method).toBe('DELETE');
        });
    });

    describe('Authentication endpoints', () => {
        test('login should make GET request to /api/auth/github', async () => {
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    json: async () => ({})
                };
            };

            await api.auth.login();
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/api/auth/github');
            expect(fetchOptions.method).toBe('GET');
        });

        test('logout should make POST request to /api/auth/logout', async () => {
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    json: async () => ({})
                };
            };

            await api.auth.logout();
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/api/auth/logout');
            expect(fetchOptions.method).toBe('POST');
        });

        test('getUser should make GET request to /api/auth/user', async () => {
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchOptions = {};
            
            globalThis.fetch = async (url, options) => {
                fetchCalled = true;
                fetchUrl = url;
                fetchOptions = options;
                return {
                    ok: true,
                    json: async () => ({})
                };
            };

            await api.auth.getUser();
            expect(fetchCalled).toBe(true);
            expect(fetchUrl).toContain('/api/auth/user');
            expect(fetchOptions.method).toBe('GET');
        });
    });
});
