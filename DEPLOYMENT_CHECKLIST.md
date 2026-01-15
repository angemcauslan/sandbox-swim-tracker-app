# Deployment Checklist

## Before Deploying

- [ ] All files are in the same folder
- [ ] Icons (icon-192.png, icon-512.png) are present
- [ ] manifest.json is properly formatted (use JSONLint if unsure)
- [ ] service-worker.js is in the root directory with other files
- [ ] No files are missing

## After Deploying

### Test Basic Functionality
- [ ] Open the URL in a browser
- [ ] App loads without errors
- [ ] Can add a class
- [ ] Can add a student
- [ ] Can track progress
- [ ] Data persists after refresh

### Test PWA Features
- [ ] Manifest loads (check DevTools → Application → Manifest)
- [ ] Service worker registers (check DevTools → Application → Service Workers)
- [ ] Icons display correctly in manifest
- [ ] Install prompt appears (on supported browsers/devices)

### Test Installation

**Desktop (Chrome/Edge):**
- [ ] Install icon appears in address bar
- [ ] Can install the app
- [ ] App opens in standalone window
- [ ] Icon appears on desktop/Start Menu

**iOS (Safari):**
- [ ] Add to Home Screen option appears
- [ ] Can add to home screen
- [ ] Icon appears on home screen
- [ ] Opens without Safari UI (full screen)

**Android (Chrome):**
- [ ] Install banner appears OR
- [ ] Install option in menu
- [ ] Can install app
- [ ] Icon appears on home screen
- [ ] Opens in standalone mode

### Test Offline Functionality
- [ ] Open app while online (first time)
- [ ] Close app completely
- [ ] Turn off internet/enable airplane mode
- [ ] Reopen app
- [ ] App works offline
- [ ] Can access existing data

## Common Issues

### App won't load
- Check all files uploaded to same directory
- Check browser console for errors
- Verify URLs in index.html are correct

### Can't install
- Verify HTTPS is enabled (required for PWA)
- Check manifest.json is valid JSON
- Ensure service-worker.js is in root directory
- Try different browser

### Offline doesn't work
- Must load once while online first
- Service worker needs time to cache files
- Check service worker status in DevTools

### Icons not showing
- Verify icon-192.png and icon-512.png exist
- Check icons are valid PNG files
- Clear browser cache and reload

## Quick Test URLs

After deploying, test with these browsers:

**Desktop:**
- Chrome: chrome://version (check if latest)
- Edge: edge://version
- Safari: About Safari

**Mobile:**
- Open in Chrome (Android) or Safari (iOS)
- Check install option appears
- Install and test standalone mode

## User Acceptance Testing

Have a colleague try to:
1. Access the URL
2. Install the app
3. Add a test class
4. Add a test student
5. Mark some progress
6. Close and reopen app
7. Verify data persists

## Support Resources

If issues occur:
- Browser DevTools Console (F12)
- Application tab (check Manifest, Service Workers, Storage)
- Network tab (check if resources load)
- Lighthouse audit (Performance & PWA score)

## Final Verification

Before sharing with others:
- [ ] URL is easy to remember/share
- [ ] Installation instructions are clear
- [ ] Known issues documented
- [ ] Support contact provided (if applicable)

## Sharing Instructions Template

```
Hello!

I'm excited to share the Swim Student Tracker app with you!

📱 Access URL: [YOUR_URL_HERE]

📖 Installation Guide: 
See INSTALLATION_GUIDE.md for step-by-step instructions for your device.

Quick start:
1. Open the URL in your browser
2. Look for "Install" or "Add to Home Screen"
3. Follow the prompts
4. Start tracking your students!

Questions? Check the troubleshooting section in the Installation Guide.

Happy tracking! 🏊‍♀️
```

---

✅ Once all checkboxes are complete, your app is ready to share!
