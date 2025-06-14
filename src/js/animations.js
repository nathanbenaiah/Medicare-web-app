// Animation Utilities
const animations = {
    fadeIn: [
        { opacity: 0 },
        { opacity: 1 }
    ],
    slideUp: [
        { transform: 'translateY(20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
    ],
    slideDown: [
        { transform: 'translateY(-20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
    ],
    scale: [
        { transform: 'scale(0.95)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
    ]
};

const timing = {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

// Intersection Observer for reveal animations
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const animation = element.dataset.animation || 'fadeIn';
            
            element.animate(animations[animation], {
                ...timing,
                fill: 'forwards'
            });
            
            revealObserver.unobserve(element);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Initialize reveal animations
document.querySelectorAll('[data-animation]').forEach(element => {
    element.style.opacity = '0';
    revealObserver.observe(element);
});

// Modal animations
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    
    modal.classList.remove('hidden');
    
    backdrop.animate([
        { opacity: 0 },
        { opacity: 1 }
    ], timing);
    
    content.animate(animations.scale, timing);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    
    const backdropAnim = backdrop.animate([
        { opacity: 1 },
        { opacity: 0 }
    ], timing);
    
    const contentAnim = content.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.95)', opacity: 0 }
    ], timing);
    
    Promise.all([
        backdropAnim.finished,
        contentAnim.finished
    ]).then(() => {
        modal.classList.add('hidden');
    });
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);
    
    toast.animate(animations.slideUp, timing);
    
    setTimeout(() => {
        const animation = toast.animate([
            { transform: 'translateX(0)', opacity: 1 },
            { transform: 'translateX(100%)', opacity: 0 }
        ], timing);
        
        animation.onfinish = () => toast.remove();
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Loading animations
function showLoading(element) {
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.removeAttribute('aria-busy');
}

// Export utilities
window.animations = {
    show: showModal,
    hide: hideModal,
    toast: showToast,
    showLoading,
    hideLoading
}; 