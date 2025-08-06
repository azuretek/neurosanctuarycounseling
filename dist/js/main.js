/**
 * Main JavaScript file for the website
 * Organized with proper initialization and modular functions
 */

(function($) {
    'use strict';

    // Configuration object
    const CONFIG = {
        breakpoints: {
            mobile: 1199
        },
        scroll: {
            threshold: 1,
            offset: 90
        },
        animation: {
            duration: 500
        }
    };

    // Header functionality module
    const Header = {
        init: function() {
            this.bindEvents();
            this.handleResize();
        },

        bindEvents: function() {
            // Mobile menu toggle
            $('.phone-menu').on('click', this.toggleMobileMenu);
            
            // Window resize handler
            $(window).on('resize', this.handleResize);
            
            // Scroll handler for fixed header
            $(window).on('load scroll resize orientationchange', this.handleScroll);
        },

        toggleMobileMenu: function() {
            $(this).toggleClass('change');
            $('header').toggleClass('active');
            $('.menu-holder').slideToggle();
        },

        handleResize: function() {
            const windowWidth = $(window).innerWidth();
            
            if (windowWidth < CONFIG.breakpoints.mobile) {
                $('.phone-menu').show();
                $('.menu-holder').hide();
            } else {
                $('.phone-menu').hide();
                $('.menu-holder').show();
            }

            // Reset mobile menu state on resize
            $('.phone-menu').removeClass('change');
            $('header').removeClass('active');
        },

        handleScroll: function() {
            const scrollTop = $(document).scrollTop();
            
            if (scrollTop > CONFIG.scroll.threshold) {
                $('header').addClass('scrolled');
            } else {
                $('header').removeClass('scrolled');
            }
        }
    };

    // Navigation functionality module
    const Navigation = {
        init: function() {
            this.bindSmoothScroll();
        },

        bindSmoothScroll: function() {
            $('a[href*="#"]')
                .not('[href="#"]')
                .not('.card-link')
                .not('[href="#0"]')
                .on('click', this.handleSmoothScroll);
        },

        handleSmoothScroll: function(event) {
            // Check if it's an on-page link
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
                location.hostname === this.hostname) {
                
                const target = Navigation.getScrollTarget(this.hash);
                
                if (target.length) {
                    event.preventDefault();
                    Navigation.animateScroll(target);
                }
            }
        },

        getScrollTarget: function(hash) {
            let target = $(hash);
            return target.length ? target : $('[name=' + hash.slice(1) + ']');
        },

        animateScroll: function(target) {
            $('html, body').animate({
                scrollTop: target.offset().top - CONFIG.scroll.offset
            }, CONFIG.animation.duration, function() {
                Navigation.setFocus(target);
            });
        },

        setFocus: function(target) {
            const $target = $(target);
            $target.focus();
            
            if (!$target.is(':focus')) {
                $target.attr('tabindex', '-1');
                $target.focus();
            }
        }
    };

    // Slider functionality module
    const Slider = {
        init: function() {
            this.initTestimonialsSlider();
        },

        initTestimonialsSlider: function() {
            const $testimonialsSlider = $('.testimonials-slider');
            
            if ($testimonialsSlider.length && $testimonialsSlider.width() > 1) {
                $testimonialsSlider.slick({
                    infinite: true,
                    centerMode: true,
                    centerPadding: '0px',
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: false,
                    variableWidth: true,
                    prevArrow: '.prev-testimonials-btn',
                    nextArrow: '.next-testimonials-btn',
                    // dots: true,
                    responsive: [
                        {
                            breakpoint: 992,
                            settings: {
                                arrows: true,
                                centerMode: true,
                                centerPadding: '0px',
                                slidesToShow: 3,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: true,
                                centerMode: false,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                infinite: true,
                                fade: false,
                                speed: 600,
                                variableWidth: false
                            }
                        }
                    ]
                });
            }
        }
    };

    // Form functionality module
    const Form = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $('#contactForm').on('submit', this.handleSubmit);
        },

        handleSubmit: function(event) {
            event.preventDefault();
            
            const $form = $(this);
            const $submitBtn = $form.find('.form-submit-btn');
            const $successMessage = $form.find('.success-message');
            const $errorMessage = $form.find('.error-message');
            
            // Hide any existing messages
            $successMessage.hide();
            $errorMessage.hide();
            
            // Disable submit button and show loading state
            $submitBtn.prop('disabled', true).text('Sending...');
            
            // Get form data
            const formData = {
                name: $form.find('#name').val(),
                email: $form.find('#email').val(),
                phone: $form.find('#phone').val(),
                message: $form.find('#message').val()
            };
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(function() {
                // Simulate random success/error for demo
                const isSuccess = Math.random() > 0.3; // 70% success rate for demo
                
                if (isSuccess) {
                    Form.showSuccess($form, $successMessage, $submitBtn);
                } else {
                    Form.showError($form, $errorMessage, $submitBtn);
                }
            }, 1500);
        },

        showSuccess: function($form, $successMessage, $submitBtn) {
            $successMessage.fadeIn();
            $submitBtn.prop('disabled', false).text('Send Message');
            
            // Reset form
            $form[0].reset();
            
            // Hide success message after 5 seconds
            setTimeout(function() {
                $successMessage.fadeOut();
            }, 5000);
        },

        showError: function($form, $errorMessage, $submitBtn) {
            $errorMessage.fadeIn();
            $submitBtn.prop('disabled', false).text('Send Message');
            
            // Hide error message after 5 seconds
            setTimeout(function() {
                $errorMessage.fadeOut();
            }, 5000);
        }
    };

    // Animation functionality module
    const Animation = {
        init: function() {
            this.bindEvents();
            this.checkViewport(); // Check initial state
        },

        bindEvents: function() {
            // Use throttled scroll event for better performance
            $(window).on('scroll', Utils.throttle(this.checkViewport, 100));
            $(window).on('resize', Utils.throttle(this.checkViewport, 100));
        },

        checkViewport: function() {
            const $animationElements = $('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right').not('.animate, .triggered');
            
            $animationElements.each(function() {
                const $element = $(this);
                
                if (Animation.isElementInViewport($element[0])) {
                    // Mark as triggered to prevent multiple triggers
                    $element.addClass('triggered');
                    
                    // Get delay from element classes
                    const delay = Animation.getElementDelay($element);
                    
                    if (delay > 0) {
                        // Use setTimeout for delayed animations
                        setTimeout(function() {
                            $element.addClass('animate');
                        }, delay);
                    } else {
                        // No delay, animate immediately
                        $element.addClass('animate');
                    }
                }
            });
        },

        getElementDelay: function($element) {
            const delayClasses = [
                'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500',
                'delay-600', 'delay-700', 'delay-800', 'delay-900', 'delay-1000', 'delay-1200'
            ];
            
            for (let i = 0; i < delayClasses.length; i++) {
                if ($element.hasClass(delayClasses[i])) {
                    // Extract number from class name and convert to milliseconds
                    const delayValue = parseInt(delayClasses[i].replace('delay-', ''));
                    return delayValue;
                }
            }
            
            return 0; // No delay class found
        },

        isElementInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const threshold = 100; // pixels before element enters viewport
            
            return (
                rect.top <= windowHeight - threshold &&
                rect.bottom >= threshold &&
                rect.left >= 0 &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

    // Utility functions
    const Utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // Main application initialization
    const App = {
        init: function() {
            console.log('Initializing application...');
            
            // Initialize modules
            Header.init();
            Navigation.init();
            Slider.init();
            Form.init();
            Animation.init();
            
            console.log('Application initialized successfully');
        }
    };

    // Document ready initialization
    $(document).ready(function() {
        App.init();
    });

    // Expose modules to global scope if needed
    window.App = App;
    window.Header = Header;
    window.Navigation = Navigation;
    window.Slider = Slider;
    window.Form = Form;
    window.Animation = Animation;

})(jQuery);
