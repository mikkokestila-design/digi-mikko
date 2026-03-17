// DIGI-MIKKO - JavaScript functionality

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Update aria-label for accessibility
            const isOpen = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Sulje valikko' : 'Avaa valikko');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && mobileMenuToggle) {
            if (!event.target.closest('nav')) {
                navMenu.classList.remove('active');
            }
        }
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // In a real application, you would send this to a server
            console.log('Form submitted:', data);
            
            // Show success message
            contactForm.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            
            // Scroll to success message
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth' });
            
            // In production, you would do something like:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     // Handle success
            // })
            // .catch(error => {
            //     // Handle error
            // });
        });
    }
    
    // Help articles search and filter
    const helpSearch = document.getElementById('helpSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const helpArticles = document.querySelectorAll('.help-article');
    
    if (helpSearch) {
        helpSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            helpArticles.forEach(article => {
                const title = article.querySelector('h2').textContent.toLowerCase();
                const content = article.querySelector('.article-content').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    }
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                helpArticles.forEach(article => {
                    if (category === 'all' || article.getAttribute('data-category') === category) {
                        article.style.display = 'block';
                    } else {
                        article.style.display = 'none';
                    }
                });
                
                // Clear search when filtering
                if (helpSearch) {
                    helpSearch.value = '';
                }
            });
        });
    }
    
    // Pre-select service from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const serviceSelect = document.getElementById('service');
    
    if (serviceParam && serviceSelect) {
        serviceSelect.value = serviceParam;
    }
    
    // Smooth scroll to section from URL hash
    if (window.location.hash) {
        setTimeout(function() {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Highlight the article briefly
                target.style.backgroundColor = '#fef3c7';
                setTimeout(() => {
                    target.style.backgroundColor = '';
                    target.style.transition = 'background-color 1s ease';
                }, 2000);
            }
        }, 100);
    }
    
    // Accessibility: Add keyboard navigation for buttons
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Form validation - Additional client-side validation
    if (contactForm) {
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        
        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                const phoneValue = this.value.trim();
                // Basic phone validation for Finnish numbers
                const phonePattern = /^[\d\s\-\+\(\)]{7,}$/;
                
                if (phoneValue && !phonePattern.test(phoneValue)) {
                    this.style.borderColor = '#ef4444';
                    if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-msg')) {
                        const errorMsg = document.createElement('small');
                        errorMsg.className = 'error-msg';
                        errorMsg.style.color = '#ef4444';
                        errorMsg.textContent = 'Tarkista puhelinnumero';
                        this.parentNode.appendChild(errorMsg);
                    }
                } else {
                    this.style.borderColor = '';
                    const errorMsg = this.parentNode.querySelector('.error-msg');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailValue = this.value.trim();
                // Basic email validation
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (emailValue && !emailPattern.test(emailValue)) {
                    this.style.borderColor = '#ef4444';
                    if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-msg')) {
                        const errorMsg = document.createElement('small');
                        errorMsg.className = 'error-msg';
                        errorMsg.style.color = '#ef4444';
                        errorMsg.textContent = 'Tarkista sähköpostiosoite';
                        this.parentNode.appendChild(errorMsg);
                    }
                } else {
                    this.style.borderColor = '';
                    const errorMsg = this.parentNode.querySelector('.error-msg');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        }
    }
    
    // Add print button functionality for help articles
    const helpArticleElements = document.querySelectorAll('.help-article');
    helpArticleElements.forEach((article, index) => {
        // Add a subtle print button to each article (optional enhancement)
        const articleHeader = article.querySelector('.article-header');
        if (articleHeader && window.innerWidth > 768) {
            const printBtn = document.createElement('button');
            printBtn.className = 'btn btn-secondary';
            printBtn.style.fontSize = '14px';
            printBtn.style.padding = '0.5rem 1rem';
            printBtn.innerHTML = '🖨️ Tulosta';
            printBtn.setAttribute('aria-label', 'Tulosta tämä ohje');
            
            printBtn.addEventListener('click', function() {
                // Create a print-friendly version
                const printWindow = window.open('', '', 'width=800,height=600');
                printWindow.document.write('<html><head><title>Digi-Mikko - Ohje</title>');
                printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;line-height:1.6;}h2{color:#2563eb;}ol,ul{margin-left:20px;}</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write('<h1>Digi-Mikko</h1>');
                printWindow.document.write(article.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            });
            
            // Don't add print button to mobile view
            // articleHeader.appendChild(printBtn);
        }
    });
    
    // Analytics tracking (placeholder - would use Google Analytics or similar in production)
    function trackEvent(category, action, label) {
        console.log('Analytics Event:', { category, action, label });
        // In production: gtag('event', action, { event_category: category, event_label: label });
    }
    
    // Track button clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('Button', 'Click', this.textContent.trim());
        });
    });
    
    // Track phone link clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Contact', 'Phone Link Click', this.href);
        });
    });
    
    // Track email link clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Contact', 'Email Link Click', this.href);
        });
    });
});

// Service Worker registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA features
    // window.addEventListener('load', function() {
    //     navigator.serviceWorker.register('/sw.js').then(function(registration) {
    //         console.log('ServiceWorker registration successful');
    //     }, function(err) {
    //         console.log('ServiceWorker registration failed: ', err);
    //     });
    // });
}
