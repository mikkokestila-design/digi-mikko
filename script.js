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
        // Toggle chatbot open/close
        chatbotToggle.addEventListener('click', function() {
            chatbotWidget.classList.remove('minimized');
            chatbotWidget.classList.add('open');
        });
        
        // Minimize chatbot
        chatbotMinimize.addEventListener('click', function() {
            chatbotWidget.classList.remove('open');
            chatbotWidget.classList.add('minimized');
        });
        
        // Send message function
        function sendMessage() {
            const message = chatbotInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Simulate bot response (in production, this would call an AI API)
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 1000);
        }
        
        // Add message to chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
            messageDiv.textContent = text;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        
        // Get bot response based on keywords
        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // Knowledge base responses
            if (lowerMessage.includes('hinta') || lowerMessage.includes('maksa') || lowerMessage.includes('kustann')) {
                return 'Kotikäynti on 50€/tunti + matkakulut. Etätuki on 40€/tunti ilman matkakuluja. Ensimmäinen 15 min pikatuesta on ilmaista! Katso kaikki hinnastosta: https://digi-mikko.netlify.app/services.html';
            }
            
            if (lowerMessage.includes('aika') || lowerMessage.includes('varaa') || lowerMessage.includes('sopimus')) {
                return 'Voit varata ajan soittamalla numeroon 040 123 4567 tai lähettämällä viestin yhteystietolomakkeella. Olen käytettävissä ma-pe 9-18 ja la 10-14.';
            }
            
            if (lowerMessage.includes('puhelin') || lowerMessage.includes('älypuhelin') || lowerMessage.includes('iphone') || lowerMessage.includes('android')) {
                return 'Autan mielellään älypuhelimien kanssa! Opetan peruskäytön, sovellusten asennuksen, kuvien ottamisen ja paljon muuta. Katso ilmaiset ohjeet: https://digi-mikko.netlify.app/self-help.html';
            }
            
            if (lowerMessage.includes('tietokone') || lowerMessage.includes('windows') || lowerMessage.includes('pc')) {
                return 'Tietokoneiden kanssa olen kotoissani! Autan käyttöönotossa, ongelmien ratkaisussa ja peruskäytön opetuksessa. Voin tulla kotiin tai auttaa etänä.';
            }
            
            if (lowerMessage.includes('sähköposti') || lowerMessage.includes('gmail') || lowerMessage.includes('outlook')) {
                return 'Sähköposti on tärkeä! Opetan sinulle miten lähetetään viestejä, liitetään tiedostoja ja pidetään sähköposti turvallisena. Meillä on myös ilmainen ohje: https://digi-mikko.netlify.app/self-help.html#send-email';
            }
            
            if (lowerMessage.includes('pankki') || lowerMessage.includes('verkkopankki') || lowerMessage.includes('e-lasku')) {
                return 'Verkkopankin käyttö turvallisesti on tärkeää! Opetan sinulle kaikki turvallisuusvinkit ja perustoiminnot. Katso myös turvallisuusohje: https://digi-mikko.netlify.app/self-help.html#online-banking';
            }
            
            if (lowerMessage.includes('turva') || lowerMessage.includes('huijaus') || lowerMessage.includes('salasana')) {
                return 'Tietoturva on erittäin tärkeää! Tarjoan tietoturvapalveluja joissa käydään läpi kaikki turvallisuusasetukset, salasanojen hallinta ja huijausten tunnistaminen. Uusi palvelumme: Tietoturvatarkastus 60€/tunti.';
            }
            
            if (lowerMessage.includes('tekoäly') || lowerMessage.includes('ai') || lowerMessage.includes('chatgpt')) {
                return 'Tekoäly on tulevaisuutta! Tarjoan tekoäly-opastusta jossa opit käyttämään ChatGPT:tä, kuvageneraattoreita ja muita AI-työkaluja. Tämä on uusi palvelumme 50€/tunti. Kiinnostaako?';
            }
            
            if (lowerMessage.includes('zoom') || lowerMessage.includes('teams') || lowerMessage.includes('videokeskustelu') || lowerMessage.includes('videoyhteys')) {
                return 'Videoyhteydet ovat hienoja pitämään yhteyttä läheisiin! Opetan sinulle Zoomin, Teamsin ja WhatsApp-videon käytön. Katso ohje: https://digi-mikko.netlify.app/self-help.html#zoom-call';
            }
            
            if (lowerMessage.includes('kiitos') || lowerMessage.includes('hyvä') || lowerMessage.includes('mahtava')) {
                return 'Ole hyvä! Olen iloinen voidessani auttaa. Jos tarvitset lisäapua, ota rohkeasti yhteyttä!';
            }
            
            if (lowerMessage.includes('hei') || lowerMessage.includes('moi') || lowerMessage.includes('terve')) {
                return 'Hei! Kiva kun olet täällä. Miten voin auttaa sinua tänään? Voin kertoa palveluistamme, hinnoista tai antaa neuvoja digitaalisiin ongelmiin.';
            }
            
            // Default response
            return 'Kiitos viestistäsi! Voin auttaa sinua monenlaisissa asioissa. Kysy minulta palveluistamme, hinnoista tai digitaalisista ongelmista. Tai soita suoraan numeroon 040 123 4567 niin jutellaan lisää!';
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

