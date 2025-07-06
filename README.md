# Textified: Spotify Library Management Tool

A powerful web application that allows you to **bulk add/remove** songs from your Spotify Liked Songs or playlists. Easily create new playlists or manage existing ones, and quickly organize your Spotify library using flexible text inputs.

## ✨ Features

### Core Functionality
- **🔐 Secure OAuth Login**: Authenticate safely with Spotify using Authorization Code Flow
- **❤️ Liked Songs Management**: Bulk add or remove tracks from your Liked Songs
- **📋 Playlist Management**: Create new playlists or manage existing ones
- **🎵 Bulk Operations**: Add/remove multiple tracks with a single click
- **🚀 One-Command Start**: Run both frontend and backend with `npm run dev`

### New Features (v1.1.0)
- **🔍 Flexible Search Formats**: Multiple input formats supported:
  - `Song Title - Artist` (traditional)
  - `Artist - Song Title` (reversed)
  - `Song Title by Artist` (natural language)
  - Just `Song Title` (searches all artists)
- **📊 Search Results Counter**: See how many tracks were found/not found
- **🔢 Playlist Track Counts**: View track counts in playlist dropdown
- **💡 Smart Feedback**: Detailed information about failed searches
- **🎯 Better UX**: Improved placeholders and help text

## 🛠️ Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js, Express, Axios
- **API**: Spotify Web API
- **Development**: Nodemon, Concurrently, dotenv

## 📋 Requirements

- **Node.js** v14+ 
- **npm** v6+
- **Spotify Developer Account** (for Client ID & Secret)
- **Redirect URI** configured in Spotify Dashboard

## 🚀 Quick Start

### For Users
**Coming Soon:** Hosted version at textified.vercel.app

### For Developers
Want to run Textified locally? See our **[Setup Guide](SETUP_GUIDE.md)** for step-by-step instructions!

**Quick Overview:**
1. Clone this repo
2. Create a Spotify App in the [Developer Dashboard](https://developer.spotify.com/dashboard)
3. Copy `.env.example` to `.env` and add your credentials
4. Run `npm install` then `npm run dev`
5. Open http://localhost:3000

Full details in [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📖 How to Use

### 1. **Login**
Click "Log in with Spotify" and authorize the app.

### 2. **Input Songs** 
Paste songs in any of these formats:
```
Bad Guy - Billie Eilish
Ed Sheeran - Shape of You
Flowers by Miley Cyrus
Bohemian Rhapsody
Taylor Swift - Anti-Hero
unholy by sam smith
```

### 3. **Manage Liked Songs**
- **Green Button**: Add tracks to Liked Songs
- **Red Button**: Remove tracks from Liked Songs

### 4. **Manage Playlists**
- **Create New**: Enter playlist name, leave dropdown empty, click "Add Tracks"
- **Add to Existing**: Select playlist from dropdown (shows track count)
- **Remove from Playlist**: Select playlist and click "Remove Tracks"

### 5. **View Results**
- See "Found X tracks" after searching
- Expand "X tracks not found" to see failed searches
- Fix typos and try again!

## 🎯 Supported Input Formats

| Format | Example |
|--------|---------|
| Song - Artist | `Blinding Lights - The Weeknd` |
| Artist - Song | `The Weeknd - Blinding Lights` |
| Song by Artist | `Blinding Lights by The Weeknd` |
| Just Song Title | `Blinding Lights` |

Mix and match formats - the app handles them all!

## 📊 Features in Detail

### Search Intelligence
- Automatically detects input format
- Searches Spotify's API for best matches
- Returns top result for each query
- Case-insensitive "by" detection

### Visual Feedback
- Track counter shows successful searches
- Failed searches listed for correction
- Playlist dropdown shows track counts
- Clear error messages for better debugging

### Performance
- Batch processing for multiple songs
- Efficient API usage
- Real-time search results
- No page refreshes needed

## 🧪 Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing instructions.

## 🚧 Known Limitations

- **Single User**: No multi-user support (tokens in memory)
- **Token Expiry**: Re-login required after ~1 hour
- **Search Accuracy**: Uses first search result only
- **Playlist Limit**: Shows first 50 playlists
- **Rate Limits**: Spotify API limits may apply for large batches

## 🌐 Deployment Options

### Currently Available
- **Local Development**: Full setup guide in [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Each user runs their own instance with their own Spotify app

### Coming Soon
- **Hosted Version**: Planning Vercel deployment
- **One-Click Deploy**: Deploy your own instance to Vercel
- See [HOSTING_PLAN.md](HOSTING_PLAN.md) for technical details

## 🤝 Contributing

Feel free to fork and enhance! Some ideas:
- Add duplicate detection
- Implement track preview player
- Add token refresh logic
- Support playlist pagination
- Add export/import features

## 📄 License

This project is provided "as is" for personal or educational use. Feel free to modify and distribute.

## 🙏 Acknowledgments

- Built using [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- Inspired by the need for better Spotify library management
- Thanks to all contributors and testers!

---

Made with ❤️ by [prahlaadr](https://github.com/prahlaadr)
