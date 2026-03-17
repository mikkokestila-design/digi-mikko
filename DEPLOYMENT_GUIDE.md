# Digi-Mikko Deployment Guide

## 🚀 Publishing to GitHub and Netlify

Follow these steps to get your website live on the internet!

---

## Step 1: Install Git

### Option A: Download and Install
1. Go to: https://git-scm.com/download/win
2. Download the installer
3. Run the installer (use default settings)
4. Restart your terminal/VS Code after installation

### Option B: Using Winget (Windows Package Manager)
Open PowerShell and run:
```powershell
winget install --id Git.Git -e --source winget
```

After installation, restart your terminal and verify:
```powershell
git --version
```

---

## Step 2: Create GitHub Account (if you don't have one)

1. Go to: https://github.com/signup
2. Create a free account
3. Verify your email address

---

## Step 3: Initialize Git Repository

Open PowerShell in the digi-mikko folder and run these commands:

```powershell
# Navigate to project folder
cd C:\Users\mikko\digi-mikko

# Initialize Git repository
git init

# Configure your identity (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Digi-Mikko website"
```

---

## Step 4: Create GitHub Repository

### Option A: Using GitHub Website
1. Go to: https://github.com/new
2. Repository name: `digi-mikko`
3. Description: "Digital support service website for elderly people"
4. Keep it **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README (we already have files)
6. Click "Create repository"

### Option B: Using GitHub CLI (if installed)
```powershell
gh repo create digi-mikko --public --source=. --remote=origin --push
```

---

## Step 5: Push to GitHub

After creating the repository on GitHub, you'll see commands. Run these:

```powershell
# Add GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/digi-mikko.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

---

## Step 6: Deploy to Netlify (Easiest Method)

### Method 1: Netlify Drop (No Account Needed - Temporary)
1. Go to: https://app.netlify.com/drop
2. Drag the entire `digi-mikko` folder onto the page
3. Your site is live instantly!
4. ⚠️ Note: This is temporary unless you claim it

### Method 2: Netlify with GitHub (Recommended)
1. Go to: https://app.netlify.com/signup
2. Sign up with GitHub account
3. Click "Add new site" → "Import an existing project"
4. Choose "Deploy with GitHub"
5. Authorize Netlify to access your repositories
6. Select `digi-mikko` repository
7. Build settings (default is fine):
   - Build command: (leave empty)
   - Publish directory: (leave empty or put `/`)
8. Click "Deploy site"
9. Your site will be live in 1-2 minutes!

---

## Step 7: Custom Domain (Optional)

### Free Netlify Subdomain
Your site gets a free URL like: `random-name-12345.netlify.app`

To customize it:
1. Go to Site settings → Domain management
2. Click "Options" → "Edit site name"
3. Change to: `digi-mikko.netlify.app` (if available)

### Custom Domain (.fi or .com)
1. Purchase domain from: Louhi.fi, Namecheap, or Google Domains
2. In Netlify: Site settings → Domain management → Add custom domain
3. Follow DNS configuration instructions
4. Netlify provides free SSL certificate automatically

---

## Alternative: GitHub Pages (Free Hosting)

If you prefer GitHub Pages instead of Netlify:

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "main" branch
4. Click "Save"
5. Your site will be live at: `https://YOUR-USERNAME.github.io/digi-mikko/`

---

## Quick Command Reference

```powershell
# Check git status
git status

# Add new changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

---

## Troubleshooting

### Git not recognized
- Make sure Git is installed
- Restart terminal/VS Code
- Check if Git is in PATH: `$env:PATH`

### Authentication error when pushing
1. GitHub now requires personal access token, not password
2. Create token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token with `repo` scope
4. Use token as password when prompted

### Or use GitHub Desktop (easier)
Download from: https://desktop.github.com/

### Site not updating on Netlify
- Trigger manual deploy in Netlify dashboard
- Check build logs for errors
- Clear browser cache

---

## Updating Your Website

After making changes to your files:

```powershell
# 1. Add changes
git add .

# 2. Commit with message
git commit -m "Updated contact information"

# 3. Push to GitHub
git push
```

If using Netlify with GitHub integration, your site will automatically update within 1-2 minutes!

---

## Next Steps After Deployment

1. ✅ Test all pages and links
2. ✅ Test contact form
3. ✅ Test on mobile devices
4. ✅ Add Google Analytics (optional)
5. ✅ Submit to Google Search Console
6. ✅ Set up email forwarding for contact@digi-mikko.fi
7. ✅ Create social media accounts
8. ✅ Add reCAPTCHA to contact form

---

## Need Help?

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Help:** https://docs.github.com
- **Netlify Docs:** https://docs.netlify.com
- **Netlify Community:** https://answers.netlify.com

---

**Your website will be live and accessible to everyone once deployed! 🎉**
