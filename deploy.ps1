# Digi-Mikko - Quick Deployment Script
# Run this script to publish your website

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DIGI-MIKKO DEPLOYMENT HELPER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is initialized
if (Test-Path .git) {
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✗ Git not initialized" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "YOUR WEBSITE IS READY TO PUBLISH!" -ForegroundColor Yellow
Write-Host ""

# Get current status
Write-Host "Current Git status:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 1: CREATE GITHUB REPOSITORY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "I'll open GitHub for you in your browser..." -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Login to GitHub (or create account if needed)" -ForegroundColor White
Write-Host "2. Repository name: digi-mikko" -ForegroundColor White
Write-Host "3. Description: Digital support service for elderly" -ForegroundColor White
Write-Host "4. Keep it PUBLIC" -ForegroundColor White
Write-Host "5. DO NOT initialize with README" -ForegroundColor White
Write-Host "6. Click 'Create repository'" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 2
Start-Process "https://github.com/new"

Write-Host "Press ENTER after you've created the GitHub repository..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 2: CONNECT TO GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Enter your GitHub username:" -ForegroundColor Yellow
$username = Read-Host

if ($username) {
    # Set branch to main
    Write-Host ""
    Write-Host "Renaming branch to 'main'..." -ForegroundColor Cyan
    git branch -M main
    
    Write-Host "Adding GitHub remote..." -ForegroundColor Cyan
    $remoteUrl = "https://github.com/$username/digi-mikko.git"
    git remote add origin $remoteUrl 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Remote already exists, updating..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl
    }
    
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    Write-Host "(You may be asked to login to GitHub)" -ForegroundColor Yellow
    Write-Host ""
    
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your repository: https://github.com/$username/digi-mikko" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "✗ Push failed. You may need to authenticate." -ForegroundColor Red
        Write-Host ""
        Write-Host "Try again with:" -ForegroundColor Yellow
        Write-Host "  git push -u origin main" -ForegroundColor White
        Write-Host ""
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 3: DEPLOY TO NETLIFY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose your deployment method:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. EASY: Netlify Drop (drag & drop)" -ForegroundColor White
Write-Host "2. RECOMMENDED: Netlify + GitHub (auto-updates)" -ForegroundColor White
Write-Host ""
Write-Host "Press 1 or 2:" -ForegroundColor Yellow
$choice = Read-Host

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Opening Netlify Drop..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Instructions:" -ForegroundColor Yellow
    Write-Host "1. Drag the 'digi-mikko' folder onto the page" -ForegroundColor White
    Write-Host "2. Your site will be live instantly!" -ForegroundColor White
    Write-Host ""
    Start-Process "https://app.netlify.com/drop"
} else {
    Write-Host ""
    Write-Host "Opening Netlify..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Instructions:" -ForegroundColor Yellow
    Write-Host "1. Sign up/Login with GitHub" -ForegroundColor White
    Write-Host "2. Click 'Add new site' > 'Import an existing project'" -ForegroundColor White
    Write-Host "3. Choose 'Deploy with GitHub'" -ForegroundColor White
    Write-Host "4. Select 'digi-mikko' repository" -ForegroundColor White
    Write-Host "5. Click 'Deploy site'" -ForegroundColor White
    Write-Host "6. Wait 1-2 minutes - your site will be live!" -ForegroundColor White
    Write-Host ""
    Start-Sleep -Seconds 2
    Start-Process "https://app.netlify.com/start"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your website files are ready to go live!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "• Update contact information in HTML files" -ForegroundColor White
Write-Host "• Test all pages after deployment" -ForegroundColor White
Write-Host "• Get a custom domain (optional)" -ForegroundColor White
Write-Host "• Add Google Analytics (optional)" -ForegroundColor White
Write-Host ""
Write-Host "For detailed help, see: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Open deployment guide
Write-Host ""
Write-Host "Would you like to open the full deployment guide? (Y/N)" -ForegroundColor Yellow
$openGuide = Read-Host

if ($openGuide -eq "Y" -or $openGuide -eq "y") {
    Start-Process "DEPLOYMENT_GUIDE.md"
}

Write-Host ""
Write-Host "Thank you for using Digi-Mikko! 🚀" -ForegroundColor Green
Write-Host ""
