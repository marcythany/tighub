/**
 * Base Component class that provides core functionality for all components
 */
export class Component {
    constructor(container) {
        if (!container) {
            throw new Error('Container element is required');
        }
        this.container = container;
        this.state = this.getInitialState();
        this.initialize();
    }

    /**
     * Get initial state for the component
     * Can be overridden by child classes
     * @returns {Object} Initial state
     */
    getInitialState() {
        return {};
    }

    /**
     * Initialize the component
     */
    initialize() {
        this.render();
    }

    /**
     * Set component state and trigger re-render
     * @param {Object} newState - New state to merge with existing state
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    /**
     * Get the component's current state
     * @returns {Object} Current state
     */
    getState() {
        return this.state;
    }

    /**
     * Helper method to create an element with classes and attributes
     * @param {string} tagName - HTML tag name
     * @param {Object} options - Element options (classes, attributes, etc.)
     * @returns {HTMLElement} Created element
     */
    createElement(tagName, options = {}) {
        const element = document.createElement(tagName);
        
        if (options.classes) {
            element.classList.add(...options.classes);
        }
        
        if (options.text) {
            element.textContent = options.text;
        }
        
        if (options.innerHTML) {
            element.innerHTML = options.innerHTML;
        }
        
        if (options.attributes) {
            for (const [key, value] of Object.entries(options.attributes)) {
                element.setAttribute(key, value);
            }
        }
        
        return element;
    }

    /**
     * Render the component (to be implemented by child classes)
     */
    render() {
        // To be implemented by child classes
    }

    /**
     * Mount the component (to be implemented by child classes)
     */
    mount() {
        // To be implemented by child classes
    }

    /**
     * Unmount the component (to be implemented by child classes)
     */
    unmount() {
        // To be implemented by child classes
    }

    /**
     * Bind an event listener to an element
     * @param {HTMLElement} element - Element to bind the event to
     * @param {string} event - Event name
     * @param {Function} handler - Event handler function
     */
    on(element, event, handler) {
        if (!element || !event || !handler) {
            throw new Error('Element, event, and handler are required for event binding');
        }
        element.addEventListener(event, handler.bind(this));
    }

    /**
     * Clean up and destroy the component
     */
    destroy() {
        this.unmount();
        this.container.innerHTML = '';
    }
}
