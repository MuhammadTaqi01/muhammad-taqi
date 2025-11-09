// ===================================
// Muhammad's Portfolio - Main JavaScript
// ===================================

// ===== Utility Functions =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== Theme Toggle =====
class ThemeManager {
    constructor() {
        this.themeToggle = $('#themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateIcon();

        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcon();
        
        // Add animation effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    updateIcon() {
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ===== Navigation =====
class Navigation {
    constructor() {
        this.navbar = $('#navbar');
        this.navToggle = $('#navToggle');
        this.navMenu = $('#navMenu');
        this.navLinks = $$('.nav-link');
        this.init();
    }

    init() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Smooth scroll for all anchor links
        this.setupSmoothScroll();
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && $(href)) {
                    e.preventDefault();
                    const target = $(href);
                    const offsetTop = target.offsetTop - 80;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== Scroll Animations =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = $$('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
        this.init();
    }

    init() {
        // Create Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        this.animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
}

// ===== Skills Progress Animation =====
class SkillsAnimator {
    constructor() {
        this.skillsSection = $('#skills');
        this.skillBars = $$('.skill-progress');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.checkPosition());
    }

    checkPosition() {
        if (this.animated) return;

        const sectionTop = this.skillsSection.offsetTop;
        const sectionHeight = this.skillsSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition > sectionTop + (sectionHeight / 3)) {
            this.animateSkills();
            this.animated = true;
        }
    }

    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.style.getPropertyValue('--progress');
            }, index * 100);
        });
    }
}

// ===== Back to Top Button =====
class BackToTop {
    constructor() {
        this.button = $('#backToTop');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== Contact Form =====
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contactForm');
        this.formSuccess = document.querySelector('#formSuccess');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value,
            subject: document.querySelector('#subject').value,
            message: document.querySelector('#message').value
        };

        // Validate form
        if (!this.validateForm(formData)) return;

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Send form data to PHP
        const result = await this.sendFormData(formData);

        // If successful
        if (result && result.status === 'success') {
            this.form.style.display = 'none';
            this.formSuccess.style.display = 'block';
            this.formSuccess.classList.add('show');

            // Reset form after delay
            setTimeout(() => {
                this.form.style.display = 'flex';
                this.formSuccess.classList.remove('show');
                this.formSuccess.style.display = 'none';
                this.form.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 5000);
        } else {
            // Restore button state on error
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async sendFormData(data) {
        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data)
            });

            const result = await response.json();
            console.log('Server Response:', result);

            if (!response.ok || result.status !== 'success') {
                this.showError(result.message || 'Failed to send message.');
                return null;
            }

            return result;
        } catch (error) {
            console.error('Error sending form:', error);
            this.showError('Something went wrong. Please try again later.');
            return null;
        }
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim()) {
            this.showError('Please enter your name');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        if (!data.subject.trim()) {
            this.showError('Please enter a subject');
            return false;
        }

        if (!data.message.trim()) {
            this.showError('Please enter your message');
            return false;
        }

        return true;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }
}

// ===== Newsletter Form =====
class NewsletterForm {
    constructor() {
        this.form = $('#newsletterForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const email = this.form.querySelector('input[type="email"]').value;

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Simulate subscription
        console.log('Newsletter subscription:', email);

        this.showMessage('Thank you for subscribing!', 'success');
        this.form.reset();
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// ===== Typing Effect =====
class TypingEffect {
    constructor(element, words, delay = 100) {
        this.element = element;
        this.words = words;
        this.delay = delay;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.delay;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== Cursor Effect =====
class CursorEffect {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            width: 10px;
            height: 10px;
            background: var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;

        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'custom-cursor-follower';
        this.cursorFollower.style.cssText = `
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.15s ease;
            display: none;
        `;

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);

        // Only enable on desktop
        if (window.innerWidth > 768) {
            this.cursor.style.display = 'block';
            this.cursorFollower.style.display = 'block';
            this.addEventListeners();
        }
    }

    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 5 + 'px';
            this.cursor.style.top = e.clientY - 5 + 'px';
            
            setTimeout(() => {
                this.cursorFollower.style.left = e.clientX - 20 + 'px';
                this.cursorFollower.style.top = e.clientY - 20 + 'px';
            }, 50);
        });

        // Scale cursor on interactive elements
        const interactiveElements = $$('a, button, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursorFollower.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

// ===== Parallax Effect =====
class ParallaxEffect {
    constructor() {
        this.shapes = $$('.shape');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

// ===== Lazy Loading Images =====
class LazyLoader {
    constructor() {
        this.images = $$('img[data-src]');
        this.init();
    }

    init() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }
}

// ===== Performance Monitoring =====
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log page load performance
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        });
    }
}

// ===== Add CSS Animations =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new Navigation();
    new ScrollAnimations();
    new SkillsAnimator();
    new BackToTop();
    new ContactForm();
    new NewsletterForm();
    new ParallaxEffect();
    new LazyLoader();
    new PerformanceMonitor();
    
    // Optional: Custom cursor (uncomment if desired)
    // new CursorEffect();

    // Optional: Typing effect for hero subtitle (uncomment if desired)
    // const heroSubtitle = $('.hero-subtitle');
    // if (heroSubtitle) {
    //     const titles = ['Software Engineer', 'Full-Stack Developer', 'Problem Solver', 'Tech Enthusiast'];
    //     new TypingEffect(heroSubtitle, titles, 100);
    // }

    // Log welcome message
    console.log('%c👋 Welcome to Muhammad\'s Portfolio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c🚀 Built with HTML, CSS, and JavaScript', 'color: #764ba2; font-size: 14px;');
    console.log('%c💼 Looking to collaborate? Get in touch!', 'color: #f093fb; font-size: 14px;');
});

// ===== Prevent console errors =====
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
});

// ===== Handle online/offline status =====
window.addEventListener('online', () => {
    console.log('✅ Back online');
});

window.addEventListener('offline', () => {
    console.log('❌ No internet connection');
});

// ===== Export for testing (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        Navigation,
        ScrollAnimations,
        ContactForm
    };
}