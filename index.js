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
    // Redirect to the React app with the access token in the query string
    res.redirect(`http://localhost:3000/?access_token=${access_token}`);
  } catch (error) {
    console.error('Error fetching token:', error.response ? error.response.data : error.message);
    res.status(400).send('Error fetching token');
  }
});

// /profile endpoint: uses the access token to fetch Spotify user profile data
app.get('/profile', async (req, res) => {
  const accessToken = req.query.access_token;
  if (!accessToken) {
    return res.status(400).send('Access token required');
  }
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching profile:', error.response ? error.response.data : error.message);
    res.status(400).send('Error fetching profile');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
