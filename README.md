# Digi-Mikko - Digital Support Service for Elderly

A comprehensive, accessible website for a handyman service specializing in digital support for elderly people.

## 🎯 Project Overview

Digi-Mikko is a professional service website designed to help elderly people with their digital problems. The website features:

- **Service information** - Detailed descriptions of various digital support services
- **Self-help section** - Step-by-step guides for common digital problems
- **Contact forms** - Easy ways for customers to get in touch
- **Accessibility-first design** - Large fonts, high contrast, simple navigation

## 📁 Project Structure

```
digi-mikko/
│
├── index.html          # Home page with overview and CTA
├── services.html       # Detailed service offerings and pricing
├── self-help.html      # Self-help guides and tutorials
├── contact.html        # Contact form and information
├── style.css           # Complete styling with accessibility focus
├── script.js           # Interactive features and form handling
└── README.md          # This file
```

## ✨ Features

### For Users
- **Easy Navigation** - Simple, clear menu structure
- **Large Text** - Readable fonts sized for elderly users
- **High Contrast** - Colors chosen for maximum readability
- **Step-by-Step Guides** - Clear instructions with numbered steps
- **Multiple Contact Options** - Phone, email, form, WhatsApp
- **Mobile Responsive** - Works on all devices

### Technical Features
- **Semantic HTML5** - Proper structure for accessibility
- **CSS Grid & Flexbox** - Modern, responsive layouts
- **Vanilla JavaScript** - No dependencies, fast loading
- **Form Validation** - Client-side validation for better UX
- **Search & Filter** - Find help articles quickly
- **Print-Friendly** - Help articles can be printed

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic text editor (VS Code, Notepad++, etc.)
- Optional: Local web server for testing

### Installation

1. **Navigate to the project folder:**
   ```bash
   cd C:\Users\mikko\digi-mikko
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
   
   **Using Python:**
   ```bash
   python -m http.server 8000
   ```
   Then visit: http://localhost:8000

   **Using Node.js:**
   ```bash
   npx http-server
   ```

   **Using VS Code:**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

## 📝 Customization Guide

### Update Contact Information

1. **Edit all HTML files** - Search for these placeholders:
   - `040 123 4567` → Your actual phone number
   - `mikko@digi-mikko.fi` → Your actual email
   - `+358401234567` → Your phone in tel: format

2. **Update service area** in `contact.html`:
   ```html
   <ul class="area-list">
       <li>Your City</li>
       <li>Your Area</li>
   </ul>
   ```

### Modify Pricing

Edit prices in `services.html`:
```html
<div class="pricing">
    <span class="price">Your Price €/tunti</span>
    <span class="price-note">Additional notes</span>
</div>
```

### Add New Help Articles

In `self-help.html`, add new article:
```html
<article class="help-article" id="your-topic" data-category="computer">
    <div class="article-header">
        <h2>📌 Your Topic Title</h2>
        <span class="difficulty easy">Helppo</span>
    </div>
    <div class="article-content">
        <h3>Instructions:</h3>
        <ol class="step-list">
            <li>
                <strong>Step 1</strong>
                <p>Description...</p>
            </li>
        </ol>
    </div>
</article>
```

### Change Colors

In `style.css`, modify the color scheme:
```css
:root {
    --primary-color: #2563eb;      /* Main brand color */
    --secondary-color: #10b981;     /* Secondary actions */
    --accent-color: #f59e0b;        /* Highlights */
    --text-dark: #1f2937;           /* Main text */
}
```

### Adjust Font Sizes

In `style.css`:
```css
:root {
    --font-base: 18px;    /* Base text size */
    --font-lg: 20px;      /* Larger text */
    --font-xl: 24px;      /* Headings */
    --font-2xl: 32px;     /* Large headings */
    --font-3xl: 42px;     /* Hero headings */
}
```

## 🔧 Backend Integration

The contact form currently displays a success message client-side. To actually send emails:

### Option 1: FormSpree (Easiest)
1. Sign up at https://formspree.io
2. Update form action:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Option 2: Email Service (e.g., EmailJS)
1. Sign up at https://www.emailjs.com
2. Add EmailJS SDK to `contact.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
3. Update form handler in `script.js`

### Option 3: Custom Backend
Create a server endpoint (Node.js/Python/PHP) to handle form submissions:

**Example with Node.js/Express:**
```javascript
app.post('/api/contact', (req, res) => {
    const { name, phone, email, message } = req.body;
    // Send email using nodemailer
    // Save to database
    res.json({ success: true });
});
```

## 📱 Mobile Optimization

The site is fully responsive and mobile-friendly:
- Touch-friendly buttons (min 44px)
- Collapsible mobile menu
- Optimized images
- Fast loading times

## ♿ Accessibility Features

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** colors (WCAG AA compliant)
- **Large touch targets** for mobile
- **Semantic HTML** structure
- **Focus indicators** for keyboard users

## 🔒 Security Considerations

Before going live:

1. **Add HTTPS** - Use SSL/TLS certificate
2. **Form validation** - Server-side validation required
3. **CAPTCHA** - Add reCAPTCHA to prevent spam
4. **Input sanitization** - Prevent XSS attacks
5. **Rate limiting** - Prevent form abuse

## 📊 Analytics Setup

To track visitor behavior:

1. **Google Analytics:**
   Add to end of `<head>` in all HTML files:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free)
1. Create GitHub repository
2. Push code to repository
3. Enable GitHub Pages in repository settings
4. Your site will be live at `username.github.io/digi-mikko`

### Option 2: Netlify (Free)
1. Sign up at https://www.netlify.com
2. Drag and drop your folder
3. Your site is live with custom domain support

### Option 3: Traditional Web Hosting
1. Purchase hosting and domain
2. Upload files via FTP
3. Configure domain DNS settings

## 🛠️ Future Enhancements

Possible additions:
- [ ] Online booking system with calendar
- [ ] Payment integration (Stripe/PayPal)
- [ ] Customer testimonials section
- [ ] Blog for digital tips
- [ ] Multi-language support (Swedish, English)
- [ ] Live chat support
- [ ] Video tutorials
- [ ] FAQ with search
- [ ] Service area map

## 📄 License

This project is created for personal/commercial use. Modify as needed.

## 👤 Contact

For questions about this website template:
- Create an issue on GitHub
- Email: [Your contact]

## 🙏 Credits

- Icons: Emoji (built-in)
- Fonts: System fonts for maximum compatibility
- Colors: Custom palette optimized for accessibility
- Layout: Custom CSS Grid and Flexbox

---

**Made with ❤️ for helping elderly people navigate the digital world**
