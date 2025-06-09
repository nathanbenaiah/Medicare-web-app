/**
 * Medicare+ Mobile Menu Handler
 * Universal mobile navigation system for all pages
 */

class MobileMenuManager {
    constructor() {
        this.mobileMenu = null;
        this.mobileBackdrop = null;
        this.mobileToggle = null;
        this.navbar = null;
        this.isOpen = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Get DOM elements
        this.mobileMenu = document.getElementById('mobileMenuOverlay');
        this.mobileBackdrop = document.getElementById('mobileMenuBackdrop');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navbar = document.querySelector('.modern-navbar');

        // Bind events
        this.bindEvents();
        
        // Set active page
        this.setActivePage();
        
        // Handle resize events
        this.handleResize();
    }

    bindEvents() {
        // Mobile toggle button
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }

        // Backdrop click
        if (this.mobileBackdrop) {
            this.mobileBackdrop.addEventListener('click', () => {
                this.close();
            });
        }

        // Close button
        const closeBtn = document.querySelector('.mobile-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        // Mobile nav links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay for better UX
                setTimeout(() => {
                    this.close();
                }, 200);
            });
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Prevent scroll when menu is open
        document.addEventListener('touchmove', (e) => {
            if (this.isOpen && !this.mobileMenu.contains(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (!this.mobileMenu || this.isOpen) return;

        this.isOpen = true;
        
        // Add active classes
        this.mobileMenu.classList.add('active');
        this.mobileBackdrop.classList.add('active');
        this.mobileToggle.classList.add('active');
        
        // Push navbar back
        if (this.navbar) {
            this.navbar.classList.add('menu-open');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add animation delay for menu items
        this.animateMenuItems();
        
        // Focus management
        this.trapFocus();
    }

    close() {
        if (!this.mobileMenu || !this.isOpen) return;

        this.isOpen = false;
        
        // Remove active classes
        this.mobileMenu.classList.remove('active');
        this.mobileBackdrop.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        
        // Reset navbar position
        if (this.navbar) {
            this.navbar.classList.remove('menu-open');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        if (this.mobileToggle) {
            this.mobileToggle.focus();
        }
    }

    animateMenuItems() {
        const menuItems = document.querySelectorAll('.mobile-nav-link');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50 + 100);
        });
    }

    trapFocus() {
        const focusableElements = this.mobileMenu.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        // Handle tab navigation
        this.mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    handleResize() {
        window.addEventListener('resize', () => {
            // Close menu on resize to larger screen
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });
    }

    // Public method to close menu (for external use)
    forceClose() {
        this.close();
    }
}

// Initialize mobile menu manager
const mobileMenuManager = new MobileMenuManager();

// Global function for backward compatibility
function toggleMobileMenu() {
    mobileMenuManager.toggle();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileMenuManager;
}

// Make available globally
window.MobileMenuManager = MobileMenuManager;
window.mobileMenuManager = mobileMenuManager; 