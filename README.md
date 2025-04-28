# Textify: Spotify Library Management Tool

A local web application that allows you to **bulk add/remove** songs from your Spotify Liked Songs or playlists. Easily create new playlists or select an existing one, and quickly manage your Spotify library using simple text inputs.


## Features
- **OAuth Login**: Securely log in to Spotify (via the Authorization Code Flow).  
- **Add/Remove Liked Songs**: Bulk add or remove multiple tracks to/from your personal Liked Songs.  
- **Create or Select Playlists**: Instantly create a new playlist with a custom name, or pick an existing playlist from a scrollable dropdown.  
- **Add/Remove Tracks in Playlists**: Bulk add or remove multiple tracks in one click.  
- **Bulk Input**: Paste multiple lines of the format `Song Title - Artist` to quickly retrieve track IDs.  
- **Single Terminal Option**: Run both client and server simultaneously using `concurrently`.  


## Tech Stack
- **Front End**:  
  - [React](https://reactjs.org/)  
  - [Axios](https://github.com/axios/axios)  

- **Back End**:  
  - [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
  - [Axios](https://github.com/axios/axios) for Spotify API calls  
  - [dotenv](https://github.com/motdotla/dotenv) for environment variables  
  - [nodemon](https://github.com/remy/nodemon) for automatic restarts in dev

- **Spotify Web API**:  
  - Authorization Code Flow for OAuth  
  - Endpoints for user library, playlists, search, etc.

---

## Requirements
- **Node.js** (v14+ recommended)  
- **npm** (v6+ recommended)  
- A **Spotify Developer** account to get **Client ID** and **Client Secret**  
- A **Redirect URI** configured in your Spotify Developer Dashboard (e.g., `http://localhost:8888/callback`)

## Setup & Installation
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/<your-username>/textified.git
   cd textified
2. **Install Dependencies**
   Server:
   ```bash
    cd server
    npm install 
  Client:
   cd ../client
   npm install

3. - **Environment Variables Setup**:
Before running the app, you need to create a .env file inside the server directory with your Spotify API credentials and configuration.

- Create a file named .env inside the /server directory.
- Add the following contents (replace values with your own if needed):

```bash  
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
SPOTIFY_SCOPE=user-library-read user-library-modify playlist-read-private playlist-modify-private playlist-modify-public
SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET: Get these from your Spotify Developer Dashboard.
SPOTIFY_REDIRECT_URI: Must match one of the Redirect URIs registered in your Spotify app settings (e.g., http://localhost:8888/callback).
SPOTIFY_SCOPE: Leave as provided for full functionality.
```
- Register the Redirect URI in your Spotify Developer Dashboard:
- Go to your Spotify app settings.
- Add http://localhost:8888/callback (or your chosen redirect URI) to the list of Redirect URIs.

Using the App
Open http://localhost:3000

If not logged in, click “Log in with Spotify” to authenticate.
Bulk Input

Paste lines like:
nginx
Copy
Bad Guy - Billie Eilish
Shape of You - Ed Sheeran
The app calls /search for each line to get track IDs.
Liked Songs

Add to Liked Songs (green button): Bulk add all found tracks.
Remove from Liked Songs (red button): Bulk remove them.
Playlists

New Playlist: Type a name in “New Playlist Name,” leave the dropdown blank, then click “Add Tracks to Playlist.” A new playlist is created, and tracks are added.
Existing Playlist: Select a playlist in the dropdown, then click “Add Tracks to Playlist” or “Remove Tracks from Playlist.”
Profile

Displays your Spotify display name once logged in.


Known Limitations
Single-User Flow: Tokens are stored in memory, so multi-user concurrency isn’t supported.
No Token Refresh: If your token expires, simply log in again.
Ambiguous Search: Only the first track result is used if multiple tracks match.
Playlist Limit: We fetch up to 50 playlists by default. For more, you’d need pagination logic.
License
This project is provided “as is” for personal or educational use. Modify freely to suit your needs. If desired, add a LICENSE file for formal license terms.

