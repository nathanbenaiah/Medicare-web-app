// Qless-Inspired Interactive Features JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Features Carousel functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.feature-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;

    function showSlide(index) {
        const slidesContainer = document.getElementById('featuresSlides');
        if (slidesContainer) {
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
            currentSlide = index;
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-advance slides every 6 seconds
    let autoAdvanceInterval = setInterval(nextSlide, 6000);

    // Pause auto-advance on hover
    const featuresCarousel = document.querySelector('.features-carousel');
    if (featuresCarousel) {
        featuresCarousel.addEventListener('mouseenter', () => {
            clearInterval(autoAdvanceInterval);
        });
        
        featuresCarousel.addEventListener('mouseleave', () => {
            autoAdvanceInterval = setInterval(nextSlide, 6000);
        });
    }

    // Animate statistics on scroll
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    const suffix = text.replace(/[0-9]/g, '');
                    
                    let current = 0;
                    const increment = number / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            current = number;
                            clearInterval(timer);
                        }
                        target.textContent = Math.floor(current) + suffix;
                    }, 30);
                    
                    observer.unobserve(target);
                }
            });
        });
        
        stats.forEach(stat => observer.observe(stat));
    }

    // Add testimonials carousel functionality
    function initTestimonialsCarousel() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                if (i === index) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.boxShadow = '0 12px 40px rgba(0, 123, 255, 0.2)';
                } else {
                    card.style.opacity = '0.7';
                    card.style.transform = 'scale(0.95)';
                    card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }
            });
        }
        
        // Auto-rotate testimonials
        if (testimonialCards.length > 0) {
            setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
                showTestimonial(currentTestimonial);
            }, 4000);
        }
    }

    // Add enhanced hover effects
    function addHoverEffects() {
        // Testimonial cards hover effect
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 50px rgba(0, 123, 255, 0.25)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            });
        });

        // CTA button effects
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.05)';
                button.style.boxShadow = '0 12px 40px rgba(0, 123, 255, 0.5)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
                button.style.boxShadow = '0 4px 20px rgba(0, 123, 255, 0.3)';
            });
        });

        // Feature icon pulse animation
        const featureIcons = document.querySelectorAll('.feature-icon-container i');
        featureIcons.forEach(icon => {
            setInterval(() => {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = 'iconPulse 2s ease-in-out infinite';
                }, 10);
            }, 8000);
        });
    }

    // Add parallax effect to hero sections
    function addParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSections = document.querySelectorAll('.qless-hero-enhancement, .qless-stats');
            
            heroSections.forEach(section => {
                const rate = scrolled * -0.3;
                section.style.backgroundPositionY = rate + 'px';
            });
        });
    }

    // Add intersection observer for fade-in animations
    function initFadeInAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for animations
        const animatedElements = document.querySelectorAll('.qless-testimonials, .qless-features, .qless-stats, .qless-cta');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Add smooth scrolling for internal links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Initialize all functions
    animateStats();
    initTestimonialsCarousel();
    addHoverEffects();
    addParallaxEffects();
    initFadeInAnimations();
    initSmoothScrolling();

    // Add keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.features-carousel:hover')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });

    console.log('🎯 Qless-inspired features initialized successfully!');
});

// Export functions for external use
window.QlessFeatures = {
    showSlide: (index) => {
        const slidesContainer = document.getElementById('featuresSlides');
        if (slidesContainer) {
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        }
    },
    
    nextSlide: () => {
        const slides = document.querySelectorAll('.feature-slide');
        const currentSlide = parseInt(document.getElementById('featuresSlides').style.transform.replace(/[^0-9]/g, '') || '0') / 100;
        const nextIndex = (currentSlide + 1) % slides.length;
        window.QlessFeatures.showSlide(nextIndex);
    }
}; 