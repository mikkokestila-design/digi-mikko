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
    
    // ===================================
    // AI CHATBOT FUNCTIONALITY
    // ===================================
    
    const chatbotWidget = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotMinimize = document.getElementById('chatbotMinimize');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    
    if (chatbotWidget) {
        // Conversation history for context
        const chatHistory = [];
        
        // Toggle chatbot open/close
        chatbotToggle.addEventListener('click', function() {
            chatbotWidget.classList.remove('minimized');
            chatbotWidget.classList.add('open');
            chatbotInput.focus();
        });
        
        // Minimize chatbot
        chatbotMinimize.addEventListener('click', function() {
            chatbotWidget.classList.remove('open');
            chatbotWidget.classList.add('minimized');
        });
        
        // Send message function
        async function sendMessage() {
            const message = chatbotInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            addMessage(message, 'user');
            chatbotInput.value = '';
            chatbotInput.disabled = true;
            chatbotSend.disabled = true;
            
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'bot-message typing-indicator';
            typingDiv.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
            chatbotMessages.appendChild(typingDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Add to history
            chatHistory.push({ role: 'user', content: message });
            
            try {
                // Call serverless function
                const response = await fetch('/.netlify/functions/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: message,
                        history: chatHistory.slice(-6)
                    })
                });
                
                // Remove typing indicator
                typingDiv.remove();
                
                if (response.ok) {
                    const data = await response.json();
                    const botReply = data.response;
                    addMessage(botReply, 'bot');
                    chatHistory.push({ role: 'assistant', content: botReply });
                } else {
                    throw new Error('API error');
                }
            } catch (error) {
                // Remove typing indicator
                typingDiv.remove();
                // Fallback if serverless function fails
                const fallback = getLocalFallback(message);
                addMessage(fallback, 'bot');
                chatHistory.push({ role: 'assistant', content: fallback });
            }
            
            chatbotInput.disabled = false;
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }
        
        // Add message to chat with markdown-like formatting
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
            
            // Simple formatting: **bold**, numbered lists, bullet points
            let formatted = text
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/^(\d+)\.\s/gm, '<br>$1. ')
                .replace(/^•\s/gm, '<br>• ')
                .replace(/\n/g, '<br>');
            
            messageDiv.innerHTML = formatted;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        
        // Local fallback if API is unavailable
        function getLocalFallback(message) {
            const m = message.toLowerCase();
            if (/^(hei|moi|terve|huomenta)/i.test(m)) return 'Hei! Olen Digi-Mikkon AI-avustaja 🤖 Miten voin auttaa sinua?';
            if (/hinta|maksa|paljonko/.test(m)) return 'Etätuki 40€/h, Kotikäynti 50€/h, Tietoturva 60€/h. Ensimmäiset 15 min pikatuesta ilmaiseksi! Soita 040 123 4567.';
            if (/salasana/.test(m)) return 'Hyvä salasana on vähintään 12 merkkiä ja sisältää isoja/pieniä kirjaimia, numeroita ja erikoismerkkejä. Vaihda: Asetukset → Turvallisuus → Vaihda salasana.';
            if (/wifi|wlan|netti/.test(m)) return 'WiFi-yhteys: Klikkaa WiFi-kuvaketta → Valitse verkko → Syötä salasana → Yhdistä. Salasana löytyy usein reitittimen pohjasta.';
            if (/kiitos/.test(m)) return 'Ole hyvä! 😊 Kysy rohkeasti lisää!';
            return 'Kiitos kysymyksestäsi! Soita 040 123 4567 niin autamme sinua henkilökohtaisesti. Palvelemme ma-pe 9-18 ja la 10-14.';
        }
        
        // Send button click
        chatbotSend.addEventListener('click', sendMessage);
        
        // Enter key to send
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

