// Oswalda Produções & Eventos - Advanced JavaScript with Enhanced Animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAdvancedScrollEffects();
    initFormHandling();
    initLazyLoading();
    initAdvancedAnimations();
    initIntersectionObserver();
    initSmoothScrolling();
    
    console.log('Oswalda Produções website loaded successfully!');
});

// Enhanced Navigation with Advanced Effects
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollTop = 0;
    
    // Advanced navbar scroll effects with hide/show functionality
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
            
            // Hide navbar when scrolling down, show when scrolling up
            if (scrollDirection === 'down' && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else if (scrollDirection === 'up') {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Active nav link highlighting with smooth transitions
    const currentLocation = location.pathname;
    navLinks.forEach((link, index) => {
        if (link.getAttribute('href') === currentLocation || 
            (currentLocation === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
            
            // Add staggered entrance animation
            setTimeout(() => {
                link.style.animation = `slideInFromBottom 0.6s ease ${index * 0.1}s both`;
            }, 300);
        }
        
        // Add hover sound effect simulation
        link.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'pulse 0.6s ease';
        });
    });
}

// Advanced Intersection Observer for Smooth Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on position
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for different animation types
    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .flip-in, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

// Smooth Scrolling Enhancement
function initSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Smooth scroll to top functionality
    const scrollToTopBtn = document.createElement('div');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Enhanced Scroll Effects with Parallax and Advanced Animations
function initAdvancedScrollEffects() {
    // Enhanced parallax effect for hero video
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            const opacity = Math.max(0, 1 - scrolled / window.innerHeight);
            
            heroVideo.style.transform = `translateY(${parallax}px) scale(${1 + scrolled * 0.0002})`;
            heroVideo.style.opacity = opacity;
            
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    
    // Advanced text reveal animation
    const textElements = document.querySelectorAll('h1, h2, h3, p, .lead');
    textElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.8s ease ${index * 0.1}s`;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(element);
    });
}

// Enhanced Form Handling with Success Animation
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        contactForm.addEventListener('submit', function(e) {
            // Add loading state with enhanced animation
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="loading-spinner"></div> Enviando...';
            submitBtn.style.background = 'linear-gradient(45deg, #6c757d, #495057)';
            
            // Form validation
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                e.preventDefault();
                resetSubmitButton();
                showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                e.preventDefault();
                resetSubmitButton();
                showAlert('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // If validation passes, show success animation after form submission
            setTimeout(() => {
                showSuccessAnimation();
                resetSubmitButton();
            }, 2000);
        });
        
        function resetSubmitButton() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.background = '';
        }
        
        // Enhanced real-time validation with smooth animations
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 0 20px rgba(0, 123, 255, 0.3)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }
}

// Success Animation Function
function showSuccessAnimation() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-animation';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h4>Mensagem Enviada!</h4>
        <p>Obrigado pelo contato. Retornaremos em breve.</p>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 500);
    }, 3000);
}

// Fade out animation
const fadeOutKeyframes = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = fadeOutKeyframes;
document.head.appendChild(styleSheet);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Advanced Animations and Interactive Effects
function initAdvancedAnimations() {
    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '') + 
                                            (counter.textContent.includes('%') ? '%' : '');
                    }, 16);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
    
    // Portfolio item hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um e-mail válido.';
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value && !/^[\d\s\+\-\(\)]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um telefone válido.';
    }
    
    // Apply validation classes
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    // Show/hide error message
    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!isValid && errorMessage) {
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = errorMessage;
    } else if (errorDiv) {
        errorDiv.remove();
    }
    
    return isValid;
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Find flash messages container or create one
    let container = document.querySelector('.flash-messages');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-messages';
        document.body.appendChild(container);
    }
    
    container.appendChild(alertDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Language switching with smooth transition and video switching
document.addEventListener('DOMContentLoaded', function() {
    // Initialize video display based on current language
    initLanguageVideos();
});

function initLanguageVideos() {
    const currentLanguage = document.documentElement.lang || 'pt';
    switchLanguageVideo(currentLanguage);
}

function switchLanguageVideo(language) {
    const allVideos = document.querySelectorAll('.language-video');
    allVideos.forEach(video => {
        video.style.display = 'none';
    });
    
    const targetVideo = document.getElementById(`video-${language}`);
    if (targetVideo) {
        targetVideo.style.display = 'block';
    }
}

// Language switching with smooth transition
document.querySelectorAll('a[href*="/set_language/"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = this.href;
        }, 300);
    });
});

// Service worker registration for PWA capabilities (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add PWA support
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Client Portfolio Image Switching
let clientImageIndexes = {
    'cirque-paris': 0,
    'europa-circus': 0,
    'cirque-mondial': 0
};

function switchClientImage(clientId) {
    const container = document.querySelector(`[data-client="${clientId}"]`).closest('.client-card');
    const images = container.querySelectorAll(`[data-client="${clientId}"]`);
    const currentImageSpan = container.querySelector('.current-image');
    
    if (images.length <= 1) return; // No switching for single images
    
    // Add switching animation
    container.classList.add('switching');
    
    // Hide current image
    images[clientImageIndexes[clientId]].classList.remove('active-img');
    
    // Move to next image
    clientImageIndexes[clientId] = (clientImageIndexes[clientId] + 1) % images.length;
    
    // Show new image with delay for smooth transition
    setTimeout(() => {
        images[clientImageIndexes[clientId]].classList.add('active-img');
        currentImageSpan.textContent = clientImageIndexes[clientId] + 1;
        container.classList.remove('switching');
    }, 300);
}

// Auto-switch images on hover (optional)
document.addEventListener('DOMContentLoaded', function() {
    const clientCards = document.querySelectorAll('.client-card');
    
    clientCards.forEach(card => {
        const images = card.querySelectorAll('.client-img');
        if (images.length > 1) {
            let autoSwitchInterval;
            
            card.addEventListener('mouseenter', function() {
                const clientId = images[0].getAttribute('data-client');
                autoSwitchInterval = setInterval(() => {
                    switchClientImage(clientId);
                }, 2000);
            });
            
            card.addEventListener('mouseleave', function() {
                clearInterval(autoSwitchInterval);
            });
        }
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log loading time for optimization
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Log any JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('main') || document.querySelector('#main-content');
        if (mainContent) {
            mainContent.focus();
            e.preventDefault();
        }
    }
});

// WhatsApp button enhancement
const whatsappBtn = document.querySelector('.whatsapp-float a');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
        // Add click analytics or tracking here if needed
        console.log('WhatsApp button clicked');
    });
}

// Print styles optimization
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});
