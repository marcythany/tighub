import { describe, test, expect, beforeEach } from 'bun:test';
import { eventBus, Events } from '../core/EventBus.js';

describe('EventBus', () => {
    beforeEach(() => {
        eventBus.clear();
    });

    describe('event subscription', () => {
        test('should subscribe to events', () => {
            let called = false;
            const callback = () => { called = true; };
            
            eventBus.on('test', callback);
            eventBus.emit('test');
            
            expect(called).toBe(true);
        });

        test('should unsubscribe from events using returned function', () => {
            let callCount = 0;
            const callback = () => { callCount++; };
            
            const unsubscribe = eventBus.on('test', callback);
            eventBus.emit('test');
            expect(callCount).toBe(1);

            unsubscribe();
            eventBus.emit('test');
            expect(callCount).toBe(1); // Should not increase
        });

        test('should unsubscribe from events using off method', () => {
            let callCount = 0;
            const callback = () => { callCount++; };
            
            eventBus.on('test', callback);
            eventBus.emit('test');
            expect(callCount).toBe(1);

            eventBus.off('test', callback);
            eventBus.emit('test');
            expect(callCount).toBe(1); // Should not increase
        });

        test('should handle multiple subscribers', () => {
            let count1 = 0, count2 = 0;
            const callback1 = () => { count1++; };
            const callback2 = () => { count2++; };
            
            eventBus.on('test', callback1);
            eventBus.on('test', callback2);
            eventBus.emit('test');
            
            expect(count1).toBe(1);
            expect(count2).toBe(1);
        });
    });

    describe('event emission', () => {
        test('should emit events with data', () => {
            let receivedData = null;
            const callback = (data) => { receivedData = data; };
            
            eventBus.on('test', callback);
            eventBus.emit('test', { value: 42 });
            
            expect(receivedData).toEqual({ value: 42 });
        });

        test('should handle emission of unsubscribed events', () => {
            // Should not throw
            eventBus.emit('nonexistent', { value: 42 });
        });

        test('should handle errors in callbacks', () => {
            const errorCallback = () => {
                throw new Error('Test error');
            };
            
            eventBus.on('test', errorCallback);
            // Should not throw
            eventBus.emit('test');
        });
    });

    describe('once subscription', () => {
        test('should trigger callback only once', () => {
            let callCount = 0;
            const callback = () => { callCount++; };
            
            eventBus.once('test', callback);
            eventBus.emit('test');
            eventBus.emit('test');
            
            expect(callCount).toBe(1);
        });

        test('should handle data in once callback', () => {
            let receivedData = null;
            const callback = (data) => { receivedData = data; };
            
            eventBus.once('test', callback);
            eventBus.emit('test', { value: 42 });
            
            expect(receivedData).toEqual({ value: 42 });
        });

        test('should allow unsubscribe before emission', () => {
            let called = false;
            const callback = () => { called = true; };
            
            const unsubscribe = eventBus.once('test', callback);
            unsubscribe();
            eventBus.emit('test');
            
            expect(called).toBe(false);
        });
    });

    describe('event clearing', () => {
        test('should clear all event listeners', () => {
            let count1 = 0, count2 = 0;
            eventBus.on('test1', () => { count1++; });
            eventBus.on('test2', () => { count2++; });
            
            eventBus.clear();
            eventBus.emit('test1');
            eventBus.emit('test2');
            
            expect(count1).toBe(0);
            expect(count2).toBe(0);
        });
    });

    describe('predefined events', () => {
        test('should define all required events', () => {
            const requiredEvents = [
                'USER_LOGIN',
                'USER_LOGOUT',
                'USER_PROFILE_UPDATE',
                'LIKE_ADDED',
                'LIKE_REMOVED',
                'THEME_CHANGED',
                'LANGUAGE_CHANGED',
                'ERROR_OCCURRED',
                'LOADING_START',
                'LOADING_END'
            ];

            requiredEvents.forEach(event => {
                expect(Events[event]).toBeDefined();
                expect(typeof Events[event]).toBe('string');
            });
        });

        test('should use correct event names', () => {
            expect(Events.USER_LOGIN).toBe('user:login');
            expect(Events.USER_LOGOUT).toBe('user:logout');
            expect(Events.ERROR_OCCURRED).toBe('error:occurred');
            expect(Events.LOADING_START).toBe('loading:start');
            expect(Events.LOADING_END).toBe('loading:end');
        });
    });
});
