import { mock } from "bun:test";

// Mock do DOM para testes
class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.classList = new Set();
        this.style = {};
        this.eventListeners = new Map();
        this.innerHTML = '';
        this.textContent = '';
        this._parentNode = null;
    }

    appendChild(child) {
        // Prevent circular references
        if (child === this || this.children.includes(child)) {
            return child;
        }
        
        // Remove from previous parent
        if (child._parentNode) {
            child._parentNode.removeChild(child);
        }
        
        this.children.push(child);
        child._parentNode = this;
        return child;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child._parentNode = null;
        }
        return child;
    }

    querySelector(selector) {
        // Simple selector matching for testing
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            const seen = new Set(); // Track seen elements to prevent infinite loops
            const queue = [this];
            
            while (queue.length > 0) {
                const element = queue.shift();
                if (seen.has(element)) continue; // Skip if already seen
                seen.add(element);
                
                if (element.classList && element.classList.has(className)) {
                    return element;
                }
                if (element.children) {
                    queue.push(...element.children);
                }
            }
        }
        return null;
    }

    querySelectorAll(selector) {
        const results = [];
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            const seen = new Set(); // Track seen elements to prevent infinite loops
            const queue = [this];
            
            while (queue.length > 0) {
                const element = queue.shift();
                if (seen.has(element)) continue; // Skip if already seen
                seen.add(element);
                
                if (element.classList && element.classList.has(className)) {
                    results.push(element);
                }
                if (element.children) {
                    queue.push(...element.children);
                }
            }
        }
        return results;
    }

    addEventListener(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(handler);
    }

    removeEventListener(event, handler) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).delete(handler);
        }
    }
}

// Mock do document
const mockBody = new MockElement('body');
globalThis.document = {
    createElement: (tagName) => new MockElement(tagName),
    body: mockBody,
    querySelector: (selector) => mockBody.querySelector(selector),
    querySelectorAll: (selector) => mockBody.querySelectorAll(selector)
};

// Mock do window
globalThis.window = {
    location: {
        href: ''
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    document: globalThis.document
};

// Mock do localStorage
globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
};

// Mock do languageManager
globalThis.languageManager = {
    addChangeListener: mock(() => () => {}),
    removeChangeListener: mock(),
    setLanguage: mock(),
    translate: mock((key) => key)
};

// Mock do eventBus
globalThis.Events = {
    API_ERROR: 'API_ERROR',
    THEME_CHANGED: 'THEME_CHANGED',
    LANGUAGE_CHANGED: 'LANGUAGE_CHANGED'
};

// Create mock functions
const onMock = mock((event, handler) => {
    // Return unsubscribe function
    return () => offMock(event, handler);
});

const offMock = mock();
const emitMock = mock();

globalThis.eventBus = {
    events: {},
    on: onMock,
    off: offMock,
    emit: emitMock
};

// Mock do fetch - start with empty response
let mockResponse = [];
const fetchMock = mock(async () => ({
    ok: true,
    json: async () => mockResponse
}));

globalThis.fetch = fetchMock;

// Helper to set mock response
globalThis.setMockResponse = (response) => {
    mockResponse = response;
};
