# 🔄 How to Clear Cache and See Your Updates

## The Problem
Your browser cached the old version of the app. Even though you uploaded new files to GitHub, your browser is still showing the old version.

## The Solution - Upload This Package

**This package includes an updated service worker (v2) that will force your browser to clear the old cache.**

### Steps:

1. **Delete ALL old files from your GitHub repository**
   - Go to your repository on GitHub
   - Delete every single file (especially service-worker.js and app.js)
   - Commit the deletions

2. **Upload ALL files from this new package**
   - Extract the swim-tracker-deploy.zip
   - Upload all files to your GitHub repository
   - Make sure to upload service-worker.js (this has the new cache version!)
   - Commit the upload

3. **Force refresh your browser**
   - **Chrome/Edge (Windows/Linux):** Press `Ctrl + Shift + R`
   - **Chrome/Edge (Mac):** Press `Cmd + Shift + R`
   - **Safari (Mac):** Press `Cmd + Option + R`
   - **Firefox:** Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)

4. **Clear service worker manually (if hard refresh doesn't work):**

   **Chrome/Edge:**
   - Press F12 to open DevTools
   - Go to "Application" tab
   - Click "Service Workers" in left sidebar
   - Click "Unregister" next to your app
   - Close DevTools
   - Refresh the page (F5)

   **Firefox:**
   - Press F12 to open DevTools
   - Go to "Application" or "Storage" tab
   - Click "Service Workers"
   - Click "Unregister"
   - Close DevTools
   - Refresh the page (F5)

   **Safari:**
   - Open Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"
   - Go to Develop → Empty Caches
   - Close and reopen Safari

5. **Verify the update worked:**
   - Open the app
   - Try creating a new student
   - Check if there's a "General Comments" text box visible when the student card is collapsed
   - Check Adult 2 level - it should now have 20 skills instead of 10

## What Changed in This Version:

✅ **service-worker.js** - Cache version updated from v1 to v2 (THIS IS CRITICAL!)
✅ **app.js** - All your requested fixes:
   - Session length field (4-12 weeks) instead of class duration
   - Skills have dropdown + comment box
   - General comments box always visible when collapsed
   - Adult 1, 2, 3 skills corrected to official RLSS standards

## Still Not Working?

If you still see the old version after all these steps:

1. **Try incognito/private mode:**
   - Chrome: Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
   - Firefox: Ctrl+Shift+P (Windows) or Cmd+Shift+P (Mac)
   - Safari: Cmd+Shift+N
   - Open your GitHub Pages URL in incognito mode

2. **Check what's actually on GitHub:**
   - Go to your repository
   - Click on service-worker.js
   - Look at line 1 - it should say `const CACHE_NAME = 'swim-tracker-v2';`
   - If it still says v1, you need to re-upload the new service-worker.js

3. **Wait 5 minutes:**
   - Sometimes GitHub Pages takes a few minutes to update
   - Wait, then try a hard refresh again

## Pro Tip for Future Updates:

Every time you make changes and upload to GitHub:
1. Update the cache version in service-worker.js (v2 → v3 → v4, etc.)
2. Upload the new service-worker.js
3. Do a hard refresh in your browser

This forces browsers to load the new version instead of using the cached old version.
