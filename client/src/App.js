import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [playlistName, setPlaylistName] = useState('');

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

  // Utility: Parse bulk input and retrieve track IDs via /search endpoint
  const parseBulkAndGetTrackIds = async () => {
    const lines = bulkInput.split('\n').filter(line => line.trim() !== '');
    const trackIds = [];
    for (const line of lines) {
      const [title, artist] = line.split(' - ');
      if (!title || !artist) continue;
      try {
        const resp = await axios.post("http://localhost:8888/search", {
          title: title.trim(),
          artist: artist.trim(),
          access_token: accessToken
        });
        if (resp.data.trackId) {
          trackIds.push(resp.data.trackId);
        }
      } catch (error) {
        console.error("Error searching track:", error);
      }
    }
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
            placeholder='Enter songs, one per line in the format "Song Title - Artist"'
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
          />

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
                    {pl.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
