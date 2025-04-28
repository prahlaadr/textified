import React from 'react';

function msToMinSec(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

export default function PlaylistTracksTable({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return <div style={{ marginTop: 20 }}>No tracks in this playlist.</div>;
  }
  return (
    <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '90%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '4px' }}>#</th>
          <th style={{ border: '1px solid #ccc', padding: '4px' }}>Title</th>
          <th style={{ border: '1px solid #ccc', padding: '4px' }}>Artist</th>
          <th style={{ border: '1px solid #ccc', padding: '4px' }}>Album</th>
          <th style={{ border: '1px solid #ccc', padding: '4px' }}>Duration</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track, idx) => (
          <tr key={track.id || idx}>
            <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>{idx + 1}</td>
            <td style={{ border: '1px solid #ccc', padding: '4px' }}>{track.title}</td>
            <td style={{ border: '1px solid #ccc', padding: '4px' }}>{track.artist}</td>
            <td style={{ border: '1px solid #ccc', padding: '4px' }}>{track.album}</td>
            <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>{msToMinSec(track.duration_ms)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
