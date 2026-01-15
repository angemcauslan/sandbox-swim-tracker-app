# 🏊‍♀️ Swim Student Tracker

A Progressive Web App for tracking student progress in swimming lessons.

## Features

- Track multiple classes and students
- Progress monitoring across all RLSS Swim for Life levels
- AI-powered report card generation (optional)
- Works offline
- Installs like a native app
- Cross-platform (iOS, Android, Mac, Windows)

## Quick Start

1. **Deploy:** Upload all files to a web host (GitHub Pages, Netlify, etc.)
2. **Install:** Open in browser and add to home screen/desktop
3. **Use:** Start adding classes and tracking student progress!

## Files Included

- `index.html` - Main HTML file
- `app.js` - Application code (React)
- `manifest.json` - PWA manifest for installability
- `service-worker.js` - Enables offline functionality
- `icon-192.png`, `icon-512.png` - App icons
- `INSTALLATION_GUIDE.md` - Detailed setup instructions for non-technical users
- `TECHNICAL_GUIDE.md` - Technical documentation

## For End Users

See **INSTALLATION_GUIDE.md** for step-by-step instructions.

## For Developers

See **TECHNICAL_GUIDE.md** for technical details.

## Technology Stack

- React 18
- Tailwind CSS
- LocalStorage for data persistence
- Claude API for AI-generated reports (optional)
- Service Workers for offline support

## Data Storage

All data is stored locally in the browser's localStorage. Nothing is stored on external servers (except when using the optional Claude API for report generation).

## License

Personal use for swimming instruction.

## Support

For issues or questions, refer to the troubleshooting section in INSTALLATION_GUIDE.md.
