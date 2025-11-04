/**
 * Button.js - Liquid Glass Button Class
 * Extends Container with button-specific functionality
 * Part of liquid-glass-js library
 */

class Button extends Container {
    constructor(options = {}) {
        super(options);

        this.buttonOptions = {
            text: options.text || 'Button',
            size: options.size || 48,
            onClick: options.onClick || null,
            warp: options.warp || false,
            ...options
        };

        this.setupButton();
    }

    setupButton() {
        // Update element class
        this.element.className = `glass-button glass-button-${this.options.type}`;

        // Remove existing content
        this.contentElement.innerHTML = '';

        // Create button content
        const textSpan = document.createElement('span');
        textSpan.className = 'glass-button-text';
        textSpan.textContent = this.buttonOptions.text;
        textSpan.style.cssText = `
            font-size: ${this.buttonOptions.size}px;
            font-weight: 600;
            white-space: nowrap;
            padding: ${this.buttonOptions.size / 2}px ${this.buttonOptions.size}px;
            display: block;
        `;

        this.contentElement.appendChild(textSpan);

        // Apply button styles
        this.applyButtonStyles();

        // Add click handler
        this.setupClickHandler();
    }

    applyButtonStyles() {
        const size = this.buttonOptions.size;
        const padding = size / 2;

        this.element.style.cssText = `
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: ${this.options.borderRadius}px;
            overflow: hidden;
            padding: ${padding}px ${size}px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffffff;
            user-select: none;
            -webkit-user-select: none;
        `;
    }

    setupClickHandler() {
        // Remove previous listeners
        this.element.onclick = null;

        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Trigger ripple effect
            this.createRipple(e);

            // Call user callback
            if (this.buttonOptions.onClick) {
                this.buttonOptions.onClick(this.buttonOptions.text);
            }
        });

        // Hover effects
        this.element.addEventListener('mouseenter', () => {
            this.element.style.transform = 'translateY(-2px) scale(1.02)';
            this.element.style.boxShadow = '0 12px 40px rgba(31, 38, 135, 0.5)';
            this.element.style.background = 'rgba(255, 255, 255, 0.25)';
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'translateY(0) scale(1)';
            this.element.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
            this.element.style.background = 'rgba(255, 255, 255, 0.15)';
        });

        // Click animation
        this.element.addEventListener('mousedown', () => {
            this.element.style.transform = 'translateY(1px) scale(0.98)';
        });

        this.element.addEventListener('mouseup', () => {
            this.element.style.transform = 'translateY(-2px) scale(1.02)';
        });
    }

    createRipple(event) {
        const ripple = document.createElement('span');
        const rect = this.element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        // Add ripple animation if not already in styles
        if (!document.querySelector('style[data-ripple-animation]')) {
            const style = document.createElement('style');
            style.setAttribute('data-ripple-animation', 'true');
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        this.element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    setText(text) {
        this.buttonOptions.text = text;
        const textSpan = this.contentElement.querySelector('.glass-button-text');
        if (textSpan) {
            textSpan.textContent = text;
        }
    }

    setClickHandler(callback) {
        this.buttonOptions.onClick = callback;
        this.setupClickHandler();
    }

    // Override applyStyles to prevent conflicts
    applyStyles() {
        // Intentionally empty to avoid parent's style application
        // Styles are applied in applyButtonStyles
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Button;
}