/**
 * Container.js - Core Liquid Glass Container Class
 * Part of liquid-glass-js library
 * WebGL-powered glass effects with real-time refraction and blur
 */

class Container {
    static instances = [];

    constructor(options = {}) {
        this.options = {
            borderRadius: options.borderRadius || 48,
            type: options.type || 'rounded', // 'rounded', 'circle', 'pill'
            tintOpacity: options.tintOpacity || 0.2,
            ...options
        };

        this.element = null;
        this.canvas = null;
        this.gl_refs = null;
        this.children = [];
        this.contentElement = null;

        this.init();
        Container.instances.push(this);
    }

    init() {
        // Create main container element
        this.element = document.createElement('div');
        this.element.className = `glass-container glass-container-${this.options.type}`;

        // Create canvas for WebGL
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'glass-canvas';

        // Setup WebGL context
        this.setupWebGL();

        // Create content container
        this.contentElement = document.createElement('div');
        this.contentElement.className = 'glass-content';

        // Append to main element
        this.element.appendChild(this.canvas);
        this.element.appendChild(this.contentElement);

        // Apply styles
        this.applyStyles();

        // Setup event listeners
        this.setupEventListeners();
    }

    setupWebGL() {
        try {
            this.gl_refs = {
                gl: this.canvas.getContext('webgl2') || this.canvas.getContext('webgl'),
                program: null,
                positionBuffer: null,
                texCoordBuffer: null,
                framebuffer: null,
                texture: null
            };

            if (!this.gl_refs.gl) {
                console.warn('WebGL not supported, using CSS fallback');
                return;
            }

            const gl = this.gl_refs.gl;

            // Vertex shader
            const vertexShader = `
                precision highp float;
                attribute vec2 a_position;
                attribute vec2 a_texCoord;
                uniform vec2 u_resolution;
                varying vec2 v_texCoord;

                void main() {
                    vec2 zeroToOne = a_position / u_resolution;
                    vec2 zeroToTwo = zeroToOne * 2.0;
                    vec2 clipSpace = zeroToTwo - 1.0;
                    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                    v_texCoord = a_texCoord;
                }
            `;

            // Fragment shader with glass effects
            const fragmentShader = `
                precision highp float;
                uniform sampler2D u_texture;
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform float u_tintOpacity;
                varying vec2 v_texCoord;

                const float PI = 3.14159265359;

                void main() {
                    vec2 uv = v_texCoord;

                    // Glass refraction effect
                    float refraction = sin(uv.x * 10.0 + u_time) * 0.01;
                    refraction += sin(uv.y * 10.0 + u_time) * 0.01;

                    vec2 refractedUv = uv + vec2(refraction);

                    // Sample texture with refraction
                    vec4 color = texture2D(u_texture, refractedUv);

                    // Add glass tint
                    vec4 tint = vec4(1.0, 1.0, 1.0, 0.1);
                    color = mix(color, tint, u_tintOpacity);

                    // Add highlight for glass effect
                    float highlight = smoothstep(0.4, 0.6, uv.x) * smoothstep(0.3, 0.1, uv.y);
                    color += vec4(vec3(highlight * 0.2), 0.0);

                    gl_FragColor = color;
                }
            `;

            this.gl_refs.program = this.createProgram(gl, vertexShader, fragmentShader);
            this.setupBuffers();

        } catch (error) {
            console.error('WebGL setup error:', error);
        }
    }

    createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
        }

        return program;
    }

    compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    setupBuffers() {
        const gl = this.gl_refs.gl;
        const program = this.gl_refs.program;

        // Position buffer
        const positions = [0, 0, 0, this.canvas.height, this.canvas.width, 0, 
                          this.canvas.width, this.canvas.height];

        this.gl_refs.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gl_refs.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }

    applyStyles() {
        this.element.style.cssText = `
            position: relative;
            display: inline-block;
            border-radius: ${this.options.borderRadius}px;
            overflow: hidden;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        `;

        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
        `;

        this.contentElement.style.cssText = `
            position: relative;
            z-index: 1;
        `;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        this.element.addEventListener('mouseenter', () => this.render());
    }

    handleResize() {
        this.updateSizeFromDOM();
    }

    updateSizeFromDOM() {
        const rect = this.element.getBoundingClientRect();
        if (this.canvas) {
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }
    }

    addChild(childElement) {
        if (childElement instanceof Container || childElement instanceof Button) {
            this.children.push(childElement);
            this.contentElement.appendChild(childElement.element);
        } else {
            this.contentElement.appendChild(childElement);
        }
    }

    removeChild(childElement) {
        this.children = this.children.filter(c => c !== childElement);
        if (childElement.element) {
            childElement.element.remove();
        } else {
            childElement.remove();
        }
    }

    render() {
        if (!this.gl_refs || !this.gl_refs.gl) return;

        const gl = this.gl_refs.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Container;
}