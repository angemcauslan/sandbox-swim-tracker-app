# GitHub Pages Deployment Instructions

## Quick Deploy Method

### Option 1: Upload All Files Directly

1. **Go to your GitHub repository**
   - Navigate to `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME`

2. **Delete old files (if updating)**
   - Click on each old file
   - Click the trash icon to delete
   - Commit the deletion

3. **Upload new files**
   - Click "Add file" → "Upload files"
   - Drag ALL files from the `swim-tracker-deploy` folder into the upload area
   - **Important:** Make sure to upload:
     - `.nojekyll` file (this is important!)
     - `.gitignore` file
     - All other files
   - Commit the changes

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch
   - Select "/ (root)" folder
   - Click Save

5. **Wait 2-3 minutes**
   - GitHub Pages takes a few minutes to build
   - Your site will be available at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Option 2: Using Git Command Line

If you're comfortable with command line:

```bash
# Navigate to your repository folder
cd path/to/your-repo

# Remove old files (be careful!)
rm -rf *

# Copy new files
# (Unzip the swim-tracker-deploy.zip and copy all contents including hidden files)

# Add all files
git add .

# Commit
git commit -m "Update swim tracker with refined design"

# Push to GitHub
git push origin main
```

## Troubleshooting GitHub Pages

### Issue: "404 - File not found"
- **Solution:** Make sure you uploaded ALL files, especially `index.html`
- Check that GitHub Pages is enabled in Settings → Pages
- Wait 3-5 minutes for GitHub to build the site

### Issue: "Page shows old version"
- **Solution:** 
  - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  - Clear browser cache
  - Try in incognito/private window
  - Wait a few minutes for GitHub's cache to clear

### Issue: "JavaScript not loading"
- **Solution:** 
  - Make sure `.nojekyll` file exists in your repository
  - This prevents GitHub from using Jekyll processing
  - Re-upload if missing

### Issue: "Service Worker errors"
- **Solution:**
  - Must use HTTPS (GitHub Pages provides this automatically)
  - Check browser console (F12) for specific errors
  - Clear service worker: Chrome DevTools → Application → Service Workers → Unregister

## Verifying Your Deployment

After uploading, verify these files exist in your repository:
- ✅ index.html
- ✅ app.js
- ✅ manifest.json
- ✅ service-worker.js
- ✅ icon-192.png
- ✅ icon-512.png
- ✅ info.html
- ✅ .nojekyll (important!)
- ✅ .gitignore
- ✅ README.md
- ✅ INSTALLATION_GUIDE.md
- ✅ TECHNICAL_GUIDE.md
- ✅ QUICK_START.md
- ✅ DEPLOYMENT_CHECKLIST.md

## Testing Your Site

1. Open your GitHub Pages URL
2. Open browser console (F12)
3. Check for any error messages
4. Try adding a test class
5. Try adding a test student
6. Verify data persists after refresh

## Common GitHub Pages Settings

- **Custom Domain:** You can add a custom domain in Settings → Pages
- **HTTPS:** Automatically enabled by GitHub
- **Build Time:** Usually 2-5 minutes
- **Updates:** Changes take 2-5 minutes to appear

## Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Verify all files uploaded correctly
3. Make sure GitHub Pages is enabled
4. Try accessing in incognito mode
5. Wait 5 minutes and try again

## What's New in This Version

✨ **Refined Design:**
- More sophisticated color palette
- Better typography and spacing
- Professional card designs
- Improved shadows and borders

⏱️ **New Feature:**
- Class duration field (15-90 minutes)
- Edit existing class durations
- Duration displayed in class details

## Your GitHub Pages URL

After deployment, your app will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

---

**Pro Tip:** Bookmark your GitHub Pages URL for easy access!
