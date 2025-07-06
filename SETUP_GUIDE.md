# 🚀 Running Textified Locally - Setup Guide

This guide will help you set up and run Textified on your own machine.

## Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Spotify Account** (free or premium)
- **Git** - [Download here](https://git-scm.com/)

## Step 1: Create Your Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the details:
   - **App Name**: "Textified Local" (or any name you prefer)
   - **App Description**: "Local Spotify library management"
   - **Redirect URI**: `http://localhost:8888/callback` (IMPORTANT!)
   - **APIs Used**: Check "Web API"
5. Click "Save"
6. In your app settings, find and copy:
   - **Client ID**
   - **Client Secret** (click "View client secret")

## Step 2: Clone and Setup the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/prahlaadr/textified.git
   cd textified
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   This automatically installs both client and server dependencies.

3. **Create your environment file**
   ```bash
   cd server
   touch .env
   ```

4. **Edit the .env file** (use any text editor)
   ```env
   SPOTIFY_CLIENT_ID=paste_your_client_id_here
   SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
   SPOTIFY_SCOPE=user-library-read user-library-modify playlist-read-private playlist-modify-private playlist-modify-public
   ```

## Step 3: Run the Application

1. **Go back to project root**
   ```bash
   cd ..
   ```

2. **Start both servers**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Go to http://localhost:3000
   - You should see the Textified login page!

## Step 4: Using Textified

1. Click "Log in with Spotify"
2. Authorize the app (you'll see what permissions it needs)
3. Start managing your music!

### Quick Test
Try pasting this into the text box:
```
Blinding Lights - The Weeknd
Flowers by Miley Cyrus
Anti-Hero
```

Then click "Add to Liked Songs" - all three should be added!

## Troubleshooting

### "Cannot GET /callback"
- Make sure your redirect URI in .env matches exactly: `http://localhost:8888/callback`
- Check that it's also added in your Spotify app settings

### "Missing access token"
- You need to log in first
- Try refreshing the page and logging in again

### "Error fetching playlists"
- Your token might have expired (happens after 1 hour)
- Just log in again

### Port already in use
Run these commands to kill processes:
```bash
# Mac/Linux
lsof -ti :3000 | xargs kill -9 2>/dev/null
lsof -ti :8888 | xargs kill -9 2>/dev/null

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8888
# Then kill the process with: taskkill /PID <process_id> /F
```

### Changes not showing
- The app hot-reloads, but sometimes you need to refresh
- For major changes, restart the servers (Ctrl+C, then `npm run dev`)

## Project Structure

```
textified/
├── client/          # React frontend
│   └── src/
│       └── App.js   # Main app logic
├── server/          # Express backend
│   ├── index.js     # API endpoints
│   └── .env         # Your Spotify credentials (create this!)
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

## Security Notes

⚠️ **IMPORTANT**: Never share your .env file or commit it to Git!
- The `.env` file contains your secret credentials
- It's already in `.gitignore` to prevent accidental commits
- Each person needs their own Spotify app credentials

## Need Help?

1. Check the [main README](README.md) for feature documentation
2. Look at [TESTING_GUIDE.md](TESTING_GUIDE.md) for testing tips
3. Open an issue on GitHub if you find bugs

---

Happy music organizing! 🎵
