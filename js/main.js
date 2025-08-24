// Header Scroll (keep navbar visible, apply blur/shrink on scroll)
let nav = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (document.documentElement.scrollTop > 20 || currentScroll > 20) {
        nav.classList.add("header-scrolled");
    } else {
        nav.classList.remove("header-scrolled");
    }
});

// nav hide 
let navBar = document.querySelectorAll(".nav-link");
let navCollapse = document.querySelector(".navbar-collapse.collapse");
navBar.forEach(function (a){
    a.addEventListener("click", function(){
        navCollapse.classList.remove("show");
    })
})

// Smooth scrolling for navbar links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20; // Extra 20px buffer
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll spy functionality
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
        
        let current = '';
        const scrollPosition = window.pageYOffset + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Skip footer section to avoid conflicts with contact
            if (sectionId === 'footer') return;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            // Handle contact section specifically
            if (current === 'contact' && linkHref === '#contact') {
                link.classList.add('active');
            } else if (linkHref === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link on page load
    updateActiveNavLink();
});
 
// Enhanced Modal Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all portfolio modals with enhanced carousel functionality
    const portfolioModals = document.querySelectorAll('.portfolio-modal');
    
    portfolioModals.forEach(modal => {
        const carousel = modal.querySelector('.carousel');
        if (carousel) {
            initializeCarousel(carousel);
        }
    });
    
    // Enhanced carousel initialization
    function initializeCarousel(carousel) {
        const carouselElement = new bootstrap.Carousel(carousel, {
            interval: 5000,
            pause: 'hover',
            wrap: true,
            keyboard: true,
            touch: true
        });
        
        // Pause autoplay on hover
        carousel.addEventListener('mouseenter', function() {
            carouselElement.pause();
        });
        
        carousel.addEventListener('mouseleave', function() {
            carouselElement.cycle();
        });
        
        // Handle image loading for smooth transitions
        const images = carousel.querySelectorAll('.modal-carousel-img');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
                
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    console.warn('Failed to load carousel image:', this.src);
                });
            }
        });
        
        // Enhanced touch/swipe support for mobile
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    carouselElement.next();
                } else {
                    // Swipe right - previous slide
                    carouselElement.prev();
                }
            }
        }
        
        // Keyboard navigation
        carousel.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    carouselElement.prev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    carouselElement.next();
                    break;
                case 'Escape':
                    e.preventDefault();
                    const modal = carousel.closest('.modal');
                    if (modal) {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                    }
                    break;
            }
        });
        
        // Accessibility improvements
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    carouselElement.to(index);
                }
            });
        });
        
        // Performance optimization: pause autoplay when modal is not visible
        const modal = carousel.closest('.modal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function() {
                carouselElement.pause();
            });
            
            modal.addEventListener('shown.bs.modal', function() {
                carouselElement.cycle();
            });
        }
    }
    
    // Enhanced modal animations
    const modals = document.querySelectorAll('.portfolio-modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            // Add loading state
            const carousel = this.querySelector('.carousel');
            if (carousel) {
                carousel.style.opacity = '0.7';
                setTimeout(() => {
                    carousel.style.opacity = '1';
                }, 300);
            }
        });
        
        modal.addEventListener('hidden.bs.modal', function() {
            // Reset carousel to first slide when modal closes
            const carousel = this.querySelector('.carousel');
            if (carousel) {
                const carouselInstance = bootstrap.Carousel.getInstance(carousel);
                if (carouselInstance) {
                    carouselInstance.to(0);
                }
            }
        });
    });
    
    // Preload carousel images for smoother experience
    function preloadCarouselImages() {
        const carouselImages = document.querySelectorAll('.modal-carousel-img');
        carouselImages.forEach(img => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = img.src;
            document.head.appendChild(preloadLink);
        });
    }
    
    // Call preload function after a short delay
    setTimeout(preloadCarouselImages, 1000);
});
 


