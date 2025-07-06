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

1. **Clone the Repository**
   ```bash
   git clone https://github.com/prahlaadr/textified.git
   cd textified
   ```

2. **Install All Dependencies**
   ```bash
   npm install
   ```
   This installs dependencies for both client and server.

3. **Set Up Environment Variables**
   
   Create `.env` file in the `server` directory:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
   SPOTIFY_SCOPE=user-library-read user-library-modify playlist-read-private playlist-modify-private playlist-modify-public
   ```

4. **Configure Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add `http://localhost:8888/callback` to Redirect URIs

5. **Start the Application**
   ```bash
   npm run dev
   ```
   - Backend runs on http://localhost:8888
   - Frontend runs on http://localhost:3000

6. **Open in Browser**
   
   Navigate to http://localhost:3000 and log in with Spotify!

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
