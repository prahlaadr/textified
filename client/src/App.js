import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaylistTracksTable from './PlaylistTracksTable';

function App() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  // New state for playlist tracks
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loadingPlaylistTracks, setLoadingPlaylistTracks] = useState(false);
  const [playlistTracksError, setPlaylistTracksError] = useState('');
  // Track search results
  const [searchResults, setSearchResults] = useState({ found: 0, notFound: [] });

  // Parse the access token from URL
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');

  // Fetch user profile & playlists when logged in
  useEffect(() => {
    if (accessToken) {
      axios.get("http://localhost:8888/profile?access_token=" + accessToken)
        .then(res => setProfile(res.data))
        .catch(err => console.error("Error fetching profile:", err));
      axios.get("http://localhost:8888/playlists?access_token=" + accessToken)
        .then(res => setPlaylists(res.data))
        .catch(err => console.error("Error fetching playlists:", err));
    }
  }, [accessToken]);

  // Fetch playlist tracks when selectedPlaylistId changes
  useEffect(() => {
    if (!selectedPlaylistId) {
      setPlaylistTracks([]);
      setPlaylistTracksError('');
      return;
    }
    setLoadingPlaylistTracks(true);
    setPlaylistTracksError('');
    axios.get(`http://localhost:8888/playlist-tracks?playlistId=${selectedPlaylistId}&access_token=${accessToken}`)
      .then(res => {
        setPlaylistTracks(res.data);
        setLoadingPlaylistTracks(false);
      })
      .catch(err => {
        setPlaylistTracks([]);
        setPlaylistTracksError('Failed to fetch playlist tracks.');
        setLoadingPlaylistTracks(false);
      });
  }, [selectedPlaylistId, accessToken]);

  // Utility: Parse bulk input and retrieve track IDs via /search endpoint
  const parseBulkAndGetTrackIds = async () => {
    const lines = bulkInput.split('\n').filter(line => line.trim() !== '');
    const trackIds = [];
    const notFound = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      let searchQuery = '';
      let title = '';
      let artist = '';
      
      // Try different formats
      // Format 1: "Song Title - Artist" or "Artist - Song Title"
      if (trimmedLine.includes(' - ')) {
        const parts = trimmedLine.split(' - ').map(p => p.trim());
        if (parts.length === 2) {
          // We'll try both interpretations
          searchQuery = trimmedLine;
        }
      }
      // Format 2: "Song Title by Artist"
      else if (trimmedLine.toLowerCase().includes(' by ')) {
        const parts = trimmedLine.split(/\s+by\s+/i).map(p => p.trim());
        if (parts.length === 2) {
          title = parts[0];
          artist = parts[1];
          searchQuery = `${title} ${artist}`;
        }
      }
      // Format 3: Just the song title (no separator)
      else {
        searchQuery = trimmedLine;
      }
      
      try {
        const resp = await axios.post("http://localhost:8888/search", {
          query: searchQuery,
          title: title,
          artist: artist,
          access_token: accessToken
        });
        if (resp.data.trackId) {
          trackIds.push(resp.data.trackId);
        } else {
          notFound.push(line);
        }
      } catch (error) {
        console.error("Error searching track:", error);
        notFound.push(line);
      }
    }
    
    // Update search results state
    setSearchResults({ found: trackIds.length, notFound });
    
    return trackIds;
  };

  // Handler for adding tracks to a playlist
  const handleAddToPlaylist = async () => {
    const trackIds = await parseBulkAndGetTrackIds();
    if (trackIds.length === 0) {
      alert("No valid tracks found in input.");
      return;
    }
    if (!selectedPlaylistId) {
      // If no playlist is selected, create a new one using playlistName
      if (!playlistName.trim()) {
        alert("Please enter a name for the new playlist.");
        return;
      }
      try {
        const createResp = await axios.post("http://localhost:8888/playlist/create", {
          name: playlistName.trim(),
          access_token: accessToken
        });
        const newPlaylistId = createResp.data.id;
        setPlaylists(prev => [...prev, createResp.data]);
        setSelectedPlaylistId(newPlaylistId);
        alert("New playlist created: " + createResp.data.name);
        // Add tracks to the new playlist
        await axios.post("http://localhost:8888/playlist/add", {
          playlistId: newPlaylistId,
          trackIds,
          access_token: accessToken
        });
        alert("Tracks added to the new playlist!");
      } catch (error) {
        console.error("Error creating playlist and adding tracks:", error);
        alert("Failed to create playlist and add tracks.");
      }
    } else {
      // Playlist is selected; simply add tracks
      try {
        await axios.post("http://localhost:8888/playlist/add", {
          playlistId: selectedPlaylistId,
          trackIds,
          access_token: accessToken
        });
        alert("Tracks added to the selected playlist!");
      } catch (error) {
        console.error("Error adding tracks to playlist:", error);
        alert("Failed to add tracks to the selected playlist.");
      }
    }
  };

  // Handler for removing tracks from a playlist
  const handleRemoveFromPlaylist = async () => {
    const trackIds = await parseBulkAndGetTrackIds();
    if (trackIds.length === 0) {
      alert("No valid tracks found in input.");
      return;
    }
    if (!selectedPlaylistId) {
      alert("Please select a playlist from which to remove tracks.");
      return;
    }
    try {
      await axios.post("http://localhost:8888/playlist/remove", {
        playlistId: selectedPlaylistId,
        trackIds,
        access_token: accessToken
      });
      alert("Tracks removed from the selected playlist!");
    } catch (error) {
      console.error("Error removing tracks from playlist:", error);
      alert("Failed to remove tracks from the selected playlist.");
    }
  };

  // Liked Songs Handlers
  const handleAddLiked = async () => {
    const trackIds = await parseBulkAndGetTrackIds();
    if (trackIds.length === 0) {
      alert("No valid tracks found in input.");
      return;
    }
    try {
      await axios.post("http://localhost:8888/liked/add", {
        trackIds,
        access_token: accessToken
      });
      alert("Tracks added to Liked Songs!");
    } catch (error) {
      console.error("Error adding liked songs:", error);
      alert("Failed to add tracks to Liked Songs.");
    }
  };

  const handleRemoveLiked = async () => {
    const trackIds = await parseBulkAndGetTrackIds();
    if (trackIds.length === 0) {
      alert("No valid tracks found in input.");
      return;
    }
    try {
      await axios.post("http://localhost:8888/liked/remove", {
        trackIds,
        access_token: accessToken
      });
      alert("Tracks removed from Liked Songs!");
    } catch (error) {
      console.error("Error removing liked songs:", error);
      alert("Failed to remove tracks from Liked Songs.");
    }
  };

  // Basic styling
  const containerStyle = {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    margin: '0 auto',
    maxWidth: '600px',
    padding: '20px'
  };

  const headerStyle = {
    marginBottom: '0.5em'
  };

  const subHeaderStyle = {
    marginTop: '0',
    color: '#666'
  };

  const textAreaStyle = {
    width: '100%',
    height: '100px',
    margin: '10px 0'
  };

  const buttonBarStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  };

  const addButtonStyle = {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const removeButtonStyle = {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const playlistButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const rowContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px'
  };

  const selectStyle = {
    maxHeight: '150px',
    overflowY: 'auto',
    width: '200px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Textify: Spotify Library Management Tool</h1>
      <p style={subHeaderStyle}>Add or remove songs from your Spotify library or playlists</p>
      {!accessToken ? (
        <>
          <p>No user logged in</p>
          <a href="http://localhost:8888/login">
            <button>Log in with Spotify</button>
          </a>
        </>
      ) : (
        <>
          <p>{profile ? `Hello, ${profile.display_name}!` : "Loading user info..."}</p>

          <textarea
            style={textAreaStyle}
            placeholder={'Enter songs, one per line:\n' +
                       'Bad Guy - Billie Eilish\n' +
                       'Ed Sheeran - Shape of You\n' +
                       'Blinding Lights by The Weeknd\n' +
                       'Bohemian Rhapsody'}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
          />
          
          {/* Format Help Text */}
          <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Supported formats: "Song - Artist", "Artist - Song", "Song by Artist", or just "Song Title"
          </div>

          {/* Search Results Display */}
          {searchResults.found > 0 && (
            <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
              Found {searchResults.found} tracks
              {searchResults.notFound.length > 0 && (
                <details style={{ marginTop: '5px' }}>
                  <summary style={{ color: '#d9534f', cursor: 'pointer' }}>
                    {searchResults.notFound.length} tracks not found
                  </summary>
                  <ul style={{ fontSize: '12px', marginTop: '5px' }}>
                    {searchResults.notFound.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {/* Liked Songs Buttons */}
          <div style={buttonBarStyle}>
            <button style={addButtonStyle} onClick={handleAddLiked}>
              Add to Liked Songs
            </button>
            <button style={removeButtonStyle} onClick={handleRemoveLiked}>
              Remove from Liked Songs
            </button>
          </div>

          {/* Playlist Buttons */}
          <div style={buttonBarStyle}>
            <button style={playlistButtonStyle} onClick={handleAddToPlaylist}>
              Add Tracks to Playlist
            </button>
            <button style={playlistButtonStyle} onClick={handleRemoveFromPlaylist}>
              Remove Tracks from Playlist
            </button>
          </div>

          {/* New Playlist Name & Playlist Dropdown on the same row */}
          <div style={rowContainerStyle}>
            <input
              type="text"
              placeholder="New Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <div>
              <label style={{ marginRight: '5px' }}>Select a Playlist:</label>
              <select
                style={selectStyle}
                value={selectedPlaylistId}
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
              >
                <option value="">-- Choose a Playlist --</option>
                {playlists.map(pl => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name} ({pl.tracks.total} tracks)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Playlist Tracks Table */}
          {selectedPlaylistId && (
            <div>
              {loadingPlaylistTracks ? (
                <div style={{ marginTop: 20 }}>Loading playlist tracks...</div>
              ) : playlistTracksError ? (
                <div style={{ marginTop: 20, color: 'red' }}>{playlistTracksError}</div>
              ) : (
                <PlaylistTracksTable tracks={playlistTracks} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
