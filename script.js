// Import and initialize liquid glass buttons
let buttonInstances = {
    hero: [],
    projects: [],
    contact: []
};

// Smooth scroll animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.addEventListener('DOMContentLoaded', () => {
    initializeLiquidGlassButtons();

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => animateOnScroll.observe(el));

    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Add parallax effect to liquid background
    const liquidBg = document.querySelector('.liquid-bg');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (liquidBg) {
            liquidBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Enhanced glass card interactions
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add typing effect to hero subtitle (optional enhancement)
    const subtitle = document.querySelector('.hero-content h2');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        setTimeout(typeWriter, 1000);
    }

    // Smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #ec4899 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // Add particle effect on mouse move (optional)
    let particles = [];
    const maxParticles = 50;

    document.addEventListener('mousemove', (e) => {
        if (particles.length < maxParticles && Math.random() > 0.95) {
            createParticle(e.clientX, e.clientY);
        }
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            z-index: 9998;
            animation: particleFade 1s ease-out forwards;
        `;

        document.body.appendChild(particle);
        particles.push(particle);

        setTimeout(() => {
            particle.remove();
            particles = particles.filter(p => p !== particle);
        }, 1000);
    }

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFade {
            to {
                opacity: 0;
                transform: translateY(-50px) scale(0);
            }
        }
    `;
    document.head.appendChild(style);
});

/**
 * Initialize Liquid Glass Buttons
 * Creates glass buttons using the liquid-glass-js library
 */
function initializeLiquidGlassButtons() {
    // Check if liquid glass library is loaded
    if (typeof Container === 'undefined' || typeof Button === 'undefined') {
        console.warn('Liquid Glass library not loaded. Using fallback buttons.');
        createFallbackButtons();
        return;
    }

    // Hero CTA Buttons
    const heroButtonsContainer = document.getElementById('heroButtons');
    if (heroButtonsContainer) {
        const viewProjectsBtn = new Button({
            text: 'View Projects',
            size: 20,
            type: 'pill',
            tintOpacity: 0.3,
            onClick: () => {
                const projectsSection = document.getElementById('projects');
                projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        const githubBtn = new Button({
            text: 'GitHub Profile',
            size: 20,
            type: 'pill',
            tintOpacity: 0.3,
            onClick: () => {
                window.open('https://github.com/yourusername', '_blank');
            }
        });

        heroButtonsContainer.appendChild(viewProjectsBtn.element);
        heroButtonsContainer.appendChild(githubBtn.element);

        buttonInstances.hero = [viewProjectsBtn, githubBtn];
    }

    // Project Buttons
    const projectButtons = document.querySelectorAll('.project-buttons');
    projectButtons.forEach((container, index) => {
        const viewBtn = new Button({
            text: '→ View',
            size: 16,
            type: 'pill',
            tintOpacity: 0.4,
            onClick: () => {
                alert('Project link would open here');
            }
        });

        const githubProjectBtn = new Button({
            text: '★ GitHub',
            size: 16,
            type: 'pill',
            tintOpacity: 0.4,
            onClick: () => {
                alert('GitHub repository link would open here');
            }
        });

        container.appendChild(viewBtn.element);
        container.appendChild(githubProjectBtn.element);

        buttonInstances.projects.push(viewBtn, githubProjectBtn);
    });

    // Contact Buttons
    const contactLinks = document.getElementById('contactButtons');
    if (contactLinks) {
        const githubContactBtn = new Button({
            text: '💼 GitHub',
            size: 20,
            type: 'pill',
            tintOpacity: 0.3,
            onClick: () => {
                window.open('https://github.com/yourusername', '_blank');
            }
        });

        const linkedinBtn = new Button({
            text: '🔗 LinkedIn',
            size: 20,
            type: 'pill',
            tintOpacity: 0.3,
            onClick: () => {
                window.open('https://linkedin.com/in/yourprofile', '_blank');
            }
        });

        const emailBtn = new Button({
            text: '✉️ Email',
            size: 20,
            type: 'pill',
            tintOpacity: 0.3,
            onClick: () => {
                window.location.href = 'mailto:your.email@example.com';
            }
        });

        contactLinks.appendChild(githubContactBtn.element);
        contactLinks.appendChild(linkedinBtn.element);
        contactLinks.appendChild(emailBtn.element);

        buttonInstances.contact = [githubContactBtn, linkedinBtn, emailBtn];
    }
}

/**
 * Fallback button creation if liquid glass library is not loaded
 * Uses regular HTML buttons styled with CSS
 */
function createFallbackButtons() {
    console.log('Creating fallback buttons...');

    // Hero buttons fallback
    const heroContainer = document.getElementById('heroButtons');
    if (heroContainer) {
        const btn1 = document.createElement('a');
        btn1.href = '#projects';
        btn1.className = 'btn-primary';
        btn1.textContent = 'View Projects';

        const btn2 = document.createElement('a');
        btn2.href = 'https://github.com/yourusername';
        btn2.target = '_blank';
        btn2.className = 'btn-secondary';
        btn2.textContent = 'GitHub';

        heroContainer.appendChild(btn1);
        heroContainer.appendChild(btn2);
    }

    // Project buttons fallback
    document.querySelectorAll('.project-buttons').forEach(container => {
        const viewBtn = document.createElement('a');
        viewBtn.href = '#';
        viewBtn.className = 'project-link';
        viewBtn.textContent = 'View Project →';

        container.appendChild(viewBtn);
    });

    // Contact buttons fallback
    const contactContainer = document.getElementById('contactButtons');
    if (contactContainer) {
        const buttons = [
            { text: '💼 GitHub', href: 'https://github.com/yourusername' },
            { text: '🔗 LinkedIn', href: 'https://linkedin.com/in/yourprofile' },
            { text: '✉️ Email', href: 'mailto:your.email@example.com' }
        ];

        buttons.forEach(btn => {
            const anchor = document.createElement('a');
            anchor.href = btn.href;
            anchor.className = 'contact-btn';
            anchor.target = '_blank';
            anchor.textContent = btn.text;

            contactContainer.appendChild(anchor);
        });
    }
}

// Add fallback CSS for buttons
window.addEventListener('load', () => {
    const style = document.createElement('style');
    style.textContent = `
        .btn-primary, .btn-secondary {
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #6366f1, #ec4899);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4);
        }

        .btn-secondary {
            background: transparent;
            border-color: rgba(255, 255, 255, 0.3);
            color: white;
            backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.5);
        }

        .contact-btn {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 15px 30px;
            border-radius: 50px;
            color: white;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }

        .contact-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .project-link {
            color: #ec4899;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .project-link:hover {
            transform: translateX(5px);
        }
    `;
    document.head.appendChild(style);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Re-initialize buttons on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-render liquid glass buttons if needed
        Object.values(buttonInstances).flat().forEach(btn => {
            if (btn.updateSizeFromDOM) {
                btn.updateSizeFromDOM();
            }
        });
    }, 250);
});