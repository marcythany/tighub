import { describe, test, expect, beforeEach, jest } from 'bun:test';
import { Component } from '../core/Component.js';

// Mock document
const mockElement = {
    classList: {
        add: (...classes) => {},
    },
    setAttribute: (key, value) => {},
};

global.document = {
    createElement: () => ({ ...mockElement }),
};

// Test component implementation
class TestComponent extends Component {
    getInitialState() {
        return { count: 0 };
    }

    render() {
        this.container.innerHTML = `Count: ${this.state.count}`;
    }

    increment() {
        this.setState({ count: this.state.count + 1 });
    }
}

describe('Component', () => {
    let container;

    beforeEach(() => {
        container = {
            innerHTML: '',
        };
    });

    describe('initialization', () => {
        test('should require container element', () => {
            expect(() => new Component()).toThrow('Container element is required');
        });

        test('should initialize with container', () => {
            const component = new Component(container);
            expect(component.container).toBe(container);
        });

        test('should initialize with empty state by default', () => {
            const component = new Component(container);
            expect(component.getState()).toEqual({});
        });

        test('should initialize with custom initial state', () => {
            const component = new TestComponent(container);
            expect(component.getState()).toEqual({ count: 0 });
        });
    });

    describe('state management', () => {
        test('should update state and trigger render', () => {
            const component = new TestComponent(container);
            component.increment();
            expect(component.getState().count).toBe(1);
            expect(container.innerHTML).toBe('Count: 1');
        });

        test('should merge new state with existing state', () => {
            const component = new TestComponent(container);
            component.setState({ newProp: 'test' });
            expect(component.getState()).toEqual({
                count: 0,
                newProp: 'test'
            });
        });

        test('should not mutate previous state', () => {
            const component = new TestComponent(container);
            const prevState = component.getState();
            component.setState({ newProp: 'test' });
            expect(prevState).toEqual({ count: 0 });
        });
    });

    describe('element creation', () => {
        test('should create element with tag name', () => {
            const component = new Component(container);
            const element = component.createElement('div');
            expect(element).toBeDefined();
        });

        test('should add classes to element', () => {
            const mockAdd = jest.fn();
            mockElement.classList.add = mockAdd;

            const component = new Component(container);
            component.createElement('div', {
                classes: ['test-class', 'another-class']
            });

            expect(mockAdd).toHaveBeenCalledWith('test-class', 'another-class');
        });

        test('should set text content', () => {
            const component = new Component(container);
            const element = component.createElement('div', {
                text: 'Test content'
            });
            expect(element.textContent).toBe('Test content');
        });

        test('should set innerHTML', () => {
            const component = new Component(container);
            const element = component.createElement('div', {
                innerHTML: '<span>Test</span>'
            });
            expect(element.innerHTML).toBe('<span>Test</span>');
        });

        test('should set attributes', () => {
            const mockSetAttribute = jest.fn();
            mockElement.setAttribute = mockSetAttribute;

            const component = new Component(container);
            component.createElement('div', {
                attributes: {
                    id: 'test-id',
                    'data-test': 'value'
                }
            });

            expect(mockSetAttribute).toHaveBeenCalledWith('id', 'test-id');
            expect(mockSetAttribute).toHaveBeenCalledWith('data-test', 'value');
        });
    });

    describe('lifecycle methods', () => {
        test('should call render on initialization', () => {
            const renderSpy = jest.fn();
            class SpyComponent extends Component {
                render() {
                    renderSpy();
                }
            }

            new SpyComponent(container);
            expect(renderSpy).toHaveBeenCalled();
        });

        test('should have mount method', () => {
            const component = new Component(container);
            expect(() => component.mount()).not.toThrow();
        });

        test('should have unmount method', () => {
            const component = new Component(container);
            expect(() => component.unmount()).not.toThrow();
        });
    });
});
