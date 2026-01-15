# Technical Guide - Swim Student Tracker

## Architecture

This is a Progressive Web App (PWA) built with:
- **React 18** - UI framework
- **Tailwind CSS** - Styling (via CDN)
- **LocalStorage API** - Data persistence
- **Service Workers** - Offline functionality & caching
- **Web App Manifest** - PWA installability
- **Claude API** - Optional AI report generation

## File Structure

```
swim-tracker-deploy/
├── index.html              # Main HTML entry point
├── app.js                  # React application code
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── icon-192.png           # App icon (192x192)
├── icon-512.png           # App icon (512x512)
├── INSTALLATION_GUIDE.md  # End-user documentation
├── TECHNICAL_GUIDE.md     # This file
└── README.md              # Project overview
```

## How It Works

### 1. Application Loading

When a user visits `index.html`:
1. HTML loads React, ReactDOM, Babel, and Tailwind from CDNs
2. Babel transpiles the JSX in `app.js` at runtime
3. React renders the SwimTracker component
4. Service worker registers for offline functionality

### 2. Data Persistence

Data is stored in browser's localStorage:

```javascript
// Storage key: 'swimTrackerData'
{
  classes: [
    {
      id: string,
      name: string,
      levels: string[],
      day: string,
      time: string,
      year: number,
      season: string
    }
  ],
  students: [
    {
      id: string,
      name: string,
      classId: string,
      studentLevel: string,
      pronouns: string,
      progress: {
        [skillId]: 'not-started' | 'in-progress' | 'achieved'
      }
    }
  ]
}
```

### 3. Offline Support

The service worker caches:
- All static assets (HTML, JS, CSS)
- External CDN resources (React, Tailwind, Babel)
- App icons

Cache strategy: Cache-first with network fallback

### 4. PWA Installability

Requirements met:
- ✅ HTTPS (when deployed properly)
- ✅ Web App Manifest with icons
- ✅ Service Worker registered
- ✅ Start URL defined
- ✅ Appropriate display mode (`standalone`)

## Deployment Options

### Option 1: GitHub Pages (Recommended)

**Pros:**
- Free
- HTTPS by default
- Simple versioning via Git
- Custom domain support
- Reliable uptime

**Steps:**
1. Create GitHub repository
2. Upload all files to main branch
3. Enable GitHub Pages in repository settings
4. Access at: `https://username.github.io/repo-name/`

**URL Structure:**
```
https://username.github.io/repo-name/
├── index.html
├── app.js
├── manifest.json
├── service-worker.js
└── icons/
```

### Option 2: Netlify

**Pros:**
- Free tier generous
- Automatic HTTPS
- Continuous deployment
- Custom domains
- Faster than GitHub Pages

**Steps:**
1. Sign up at netlify.com
2. Drag folder to deploy area
3. Get instant URL: `https://random-name.netlify.app`

### Option 3: Vercel

Similar to Netlify, optimized for frontend apps.

### Option 4: Traditional Web Hosting

Upload files to any web host with HTTPS support.

**Important:** PWAs require HTTPS. Most modern hosts provide this free via Let's Encrypt.

## Browser Compatibility

### Full Support
- ✅ Chrome/Edge 90+ (all platforms)
- ✅ Safari 15+ (macOS, iOS)
- ✅ Firefox 90+ (all platforms)

### Install Support by Platform

| Platform | Browser | Install Method |
|----------|---------|----------------|
| iOS | Safari | Add to Home Screen |
| Android | Chrome | Install app prompt |
| macOS | Safari/Chrome | Add to Dock / Install |
| Windows | Chrome/Edge | Install app |
| Linux | Chrome/Firefox | Install app |

## API Integration

### Claude API (Optional)

Used for generating report card comments.

**Configuration:**
Users need to provide their own Anthropic API key in the app settings.

**API Call:**
```javascript
fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: promptText }]
  })
});
```

**Security Note:** 
API key is stored in localStorage. This is acceptable for a client-side app where users bring their own API keys. For production with shared keys, implement a backend proxy.

## Customization

### Changing Colors

Edit `index.html`:
```html
<meta name="theme-color" content="#3B82F6"> <!-- Change hex color -->
```

Edit `manifest.json`:
```json
{
  "theme_color": "#3B82F6",  // Change hex color
  "background_color": "#ffffff"
}
```

### Changing App Name

Edit `manifest.json`:
```json
{
  "name": "Your Custom Name",
  "short_name": "Short Name"
}
```

Edit `index.html`:
```html
<title>Your Custom Name</title>
```

### Adding Features

Edit `app.js` - it's standard React code. The component structure:

```javascript
SwimTracker (main component)
├── State management (useState hooks)
├── Data persistence (useEffect)
├── Class management UI
├── Student management UI
├── Progress tracking UI
└── Report generation UI
```

## Performance Optimization

### Current Setup
- React loaded from CDN (cached by service worker)
- JSX transpiled at runtime (Babel Standalone)
- No build step required

### For Better Performance (Optional)

If you want faster load times:

1. **Use a build process:**
   ```bash
   npm create vite@latest swim-tracker -- --template react
   # Copy app.js content to src/App.jsx
   npm install
   npm run build
   # Deploy the 'dist' folder
   ```

2. **Benefits:**
   - Smaller bundle size
   - Faster initial load
   - Better caching
   - Production optimizations

3. **Trade-off:**
   - Requires Node.js and build tools
   - More complex deployment
   - Less accessible for non-developers

## Data Export/Import (Future Enhancement)

Currently not implemented. To add:

```javascript
// Export
const exportData = () => {
  const data = localStorage.getItem('swimTrackerData');
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'swim-tracker-backup.json';
  a.click();
};

// Import
const importData = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    localStorage.setItem('swimTrackerData', e.target.result);
    window.location.reload();
  };
  reader.readAsText(file);
};
```

## Security Considerations

### Data Storage
- ✅ LocalStorage is origin-specific (domain isolated)
- ✅ No cross-origin access possible
- ⚠️ Vulnerable to XSS if user installs malicious browser extensions
- ⚠️ Cleared if user clears browser data

### API Keys
- ⚠️ Stored in localStorage (visible to any script on the page)
- ✅ Acceptable for user-provided keys in client-side apps
- ❌ Never hard-code API keys in the application

### HTTPS
- ✅ Required for PWA features
- ✅ Encrypts data in transit
- ✅ Prevents MITM attacks

## Troubleshooting

### Service Worker Not Registering

**Check:**
1. HTTPS is enabled (required except localhost)
2. service-worker.js is in root directory
3. Check browser console for errors
4. Try incognito mode to rule out cache issues

**Debug:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log(registrations);
});
```

### App Not Installing

**iOS:**
- Must use Safari (Chrome doesn't support iOS PWA)
- Check manifest.json is properly formatted
- Ensure icons exist and are valid PNG files

**Android:**
- Chrome must recognize it as installable
- Check Chrome DevTools → Application → Manifest
- Verify service worker is active

**Desktop:**
- Check browser supports PWA installation
- Look for install icon in address bar
- Try different browser

### Data Lost

**Causes:**
- User cleared browser data
- Used browser's private/incognito mode
- Different browser/device

**Prevention:**
- Implement export/import feature
- Educate users about data storage
- Consider cloud backup option (future)

### Offline Not Working

**Check:**
1. Service worker registered successfully
2. Cache populated on first load
3. Network in DevTools shows cache hits
4. Try: DevTools → Application → Service Workers → Update

## Browser DevTools

### Testing PWA Features

**Chrome DevTools:**
1. F12 → Application tab
2. Check Manifest
3. Check Service Workers
4. Test offline (Network tab → Offline checkbox)
5. Simulate install (Application → Manifest → Add to home screen)

**Safari Web Inspector:**
1. Develop → Show Web Inspector
2. Check Storage
3. Check Service Workers
4. Simulate offline mode

## Updating the App

### Versioning

Change cache version in service-worker.js:
```javascript
const CACHE_NAME = 'swim-tracker-v2'; // Increment version
```

### User Updates

Service worker will:
1. Detect new version
2. Download in background
3. Activate on next app open

Users get updates automatically next time they open the app after closing it completely.

## Monitoring

### Analytics (Optional)

To add Google Analytics or similar:

```html
<!-- Add to index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

Add error boundary in React:

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
    // Send to error tracking service
  }
  
  render() {
    return this.props.children;
  }
}
```

## Contributing

This is a self-contained app. To modify:

1. Edit app.js directly (it's plain JSX)
2. Test in browser
3. Deploy updated files
4. Service worker will update users automatically

## License

Intended for personal/educational use in swim instruction.

## Further Reading

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [React Documentation](https://react.dev)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Anthropic API Documentation](https://docs.anthropic.com)
