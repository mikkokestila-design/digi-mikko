# How to Add Your Own Image to Digi-Mikko

## Quick Guide: Replace the Emoji with Your Photo

### Step 1: Prepare Your Image

1. **Get a photo** - ideally a professional headshot or friendly portrait
2. **Recommended size:** 400x400 pixels (square)
3. **Format:** JPG or PNG
4. **Name it:** `mikko-avatar.jpg` (or .png)

### Step 2: Add Image to Website

1. **Save your image** to: `C:\Users\mikko\digi-mikko\`
2. Place it in the same folder as `index.html`

### Step 3: Update the HTML

Open `index.html` and **replace this:**

```html
<div class="hero-avatar">
    <span class="avatar-emoji">👨‍💻</span>
</div>
```

**With this:**

```html
<div class="hero-avatar">
    <img src="mikko-avatar.jpg" alt="Mikko - Digi-auttaja">
</div>
```

### Step 4: Update the CSS

Open `style.css` and **find this section** (around line 230):

```css
/* If you want to use a real image instead, uncomment this and add your image:
.hero-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
*/
```

**Remove the comment symbols** so it looks like:

```css
.hero-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
```

### Step 5: Push Changes to GitHub

```powershell
cd C:\Users\mikko\digi-mikko
git add .
git commit -m "Added profile image"
git push
```

Your site will auto-update on Netlify in 1-2 minutes!

---

## Alternative: Use AI-Generated Image

### Free AI Image Generators:

1. **DALL-E** - https://openai.com/dall-e-2
   - Prompt: "Friendly Finnish tech support person helping elderly with computers, professional portrait, warm smile"

2. **Midjourney** - https://www.midjourney.com
   - Similar prompt

3. **Canva** - https://www.canva.com
   - Use their AI image generator or templates
   - Search for "professional headshot" or "tech support avatar"

4. **This Person Does Not Exist** - https://thispersondoesnotexist.com
   - Free AI-generated faces (refresh for new face)
   - Right-click and save

### Quick Emoji/Icon Alternatives:

Instead of a photo, you can also use these emojis in the HTML:
- 👨‍💻 (current - tech person)
- 🧑‍🔧 (handyman)
- 👨‍🏫 (teacher)
- 🤝 (helping hands)
- 💡 (ideas/solutions)

Just replace `👨‍💻` with any emoji you prefer!

---

## Need Help?

If you need help adding the image, just ask! I can guide you through each step.
