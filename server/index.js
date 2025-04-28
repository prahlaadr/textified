require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Enable CORS for requests from localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// GET /playlists: fetch the current user's playlists
app.get('/playlists', async (req, res) => {
  const accessToken = req.query.access_token;
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token required' });
  }
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    // Return an array of playlists
    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching playlists:', error.response?.data || error.message);
    res.status(400).send('Error fetching playlists');
  }
});

const PORT = process.env.PORT || 8888;

// Home route for testing
app.get('/', (req, res) => {
  res.send('Hello from Textified server!');
});

// /login endpoint: redirects to Spotify's authorization page
app.get('/login', (req, res) => {
  const scopes = process.env.SPOTIFY_SCOPE;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  res.redirect(authUrl);
});

// /callback endpoint: exchanges code for access token and redirects to React app
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const authOptions = {
    method: 'post',
    url: tokenUrl,
    data: new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    }
  };

  try {
    const response = await axios(authOptions);
    const { access_token } = response.data;
    res.redirect(`http://localhost:3000/?access_token=${access_token}`);
  } catch (error) {
    console.error('Error fetching token:', error.response ? error.response.data : error.message);
    res.status(400).send('Error fetching token');
  }
});

// /profile endpoint: fetch Spotify user profile data
app.get('/profile', async (req, res) => {
  const accessToken = req.query.access_token;
  if (!accessToken) return res.status(400).send('Access token required');
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching profile:', error.response ? error.response.data : error.message);
    res.status(400).send('Error fetching profile');
  }
});

// POST /search: search for a track by title and artist
app.post('/search', async (req, res) => {
  const { title, artist, access_token } = req.body;
  if (!title || !artist || !access_token) {
    return res.status(400).send('Missing title, artist, or access token');
  }
  try {
    const q = `${title} ${artist}`;
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${access_token}` },
      params: { q, type: 'track', limit: 1 }
    });
    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      res.json({ trackId: tracks[0].id });
    } else {
      res.status(404).send('No track found');
    }
  } catch (error) {
    console.error('Error searching track:', error.response ? error.response.data : error.message);
    res.status(400).send('Error searching track');
  }
});

// POST /liked/add: add tracks to Liked Songs
app.post('/liked/add', async (req, res) => {
  const { trackIds, access_token } = req.body;
  if (!trackIds || !access_token) return res.status(400).send('Missing trackIds or access token');
  try {
    await axios.put('https://api.spotify.com/v1/me/tracks', { ids: trackIds }, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    res.send('Tracks added to Liked Songs');
  } catch (error) {
    console.error('Error adding liked songs:', error.response ? error.response.data : error.message);
    res.status(400).send('Error adding liked songs');
  }
});

// POST /liked/remove: remove tracks from Liked Songs
app.post('/liked/remove', async (req, res) => {
  const { trackIds, access_token } = req.body;
  if (!trackIds || !access_token) return res.status(400).send('Missing trackIds or access token');
  try {
    await axios.delete('https://api.spotify.com/v1/me/tracks', {
      headers: { Authorization: `Bearer ${access_token}` },
      data: { ids: trackIds }
    });
    res.send('Tracks removed from Liked Songs');
  } catch (error) {
    console.error('Error removing liked songs:', error.response ? error.response.data : error.message);
    res.status(400).send('Error removing liked songs');
  }
});

// POST /playlist/create: create a new playlist
app.post('/playlist/create', async (req, res) => {
  const { name, access_token } = req.body;
  if (!access_token) return res.status(400).send('Missing access token');
  try {
    // Get current user id
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userId = userResponse.data.id;
    // Create playlist
    const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      name: name || 'New Playlist'
    }, {
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' }
    });
    res.json(playlistResponse.data);
  } catch (error) {
    console.error('Error creating playlist:', error.response ? error.response.data : error.message);
    res.status(400).send('Error creating playlist');
  }
});

// POST /playlist/add: add tracks to a playlist
app.post('/playlist/add', async (req, res) => {
  const { playlistId, trackIds, access_token } = req.body;
  if (!playlistId || !trackIds || !access_token) {
    return res.status(400).send('Missing playlistId, trackIds, or access token');
  }
  try {
    const uris = trackIds.map(id => `spotify:track:${id}`);
    await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { uris }, {
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' }
    });
    res.send('Tracks added to playlist');
  } catch (error) {
    console.error('Error adding tracks to playlist:', error.response ? error.response.data : error.message);
    res.status(400).send('Error adding tracks to playlist');
  }
});

// POST /playlist/remove: remove tracks from a playlist
app.post('/playlist/remove', async (req, res) => {
  const { playlistId, trackIds, access_token } = req.body;
  if (!playlistId || !trackIds || !access_token) {
    return res.status(400).send('Missing playlistId, trackIds, or access token');
  }
  try {
    const tracks = trackIds.map(id => ({ uri: `spotify:track:${id}` }));
    await axios.request({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      method: 'delete',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      data: { tracks }
    });
    res.send('Tracks removed from playlist');
  } catch (error) {
    console.error('Error removing tracks from playlist:', error.response ? error.response.data : error.message);
    res.status(400).send('Error removing tracks from playlist');
  }
});

// GET /playlist-tracks: fetch tracks in a playlist
app.get('/playlist-tracks', async (req, res) => {
  const { playlistId, access_token } = req.query;
  if (!playlistId || !access_token) {
    return res.status(400).json({ error: 'Missing playlistId or access_token' });
  }
  try {
    let tracks = [];
    let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;
    while (nextUrl) {
      const response = await axios.get(nextUrl, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      // Flatten and simplify track info
      const items = response.data.items.map((item, idx) => {
        const t = item.track;
        return {
          id: t.id,
          title: t.name,
          artist: t.artists.map(a => a.name).join(', '),
          album: t.album?.name || '',
          duration_ms: t.duration_ms,
          uri: t.uri
        };
      });
      tracks = tracks.concat(items);
      nextUrl = response.data.next;
    }
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.response?.data || error.message);
    res.status(400).send('Error fetching playlist tracks');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
