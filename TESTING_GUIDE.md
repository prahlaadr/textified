# Textified Testing Checklist

## 1. Login Test
- [ ] Click "Log in with Spotify"
- [ ] Authorize the app
- [ ] Verify you see "Hello, [Your Name]!" at the top

## 2. Test Search Format Support

### Test Case A: Traditional Format
```
Bad Guy - Billie Eilish
Shape of You - Ed Sheeran
```
- [ ] Paste these into the text area
- [ ] Click "Add to Liked Songs"
- [ ] Verify it shows "Found 2 tracks"

### Test Case B: Reversed Format
```
Taylor Swift - Anti-Hero
The Weeknd - Blinding Lights
```
- [ ] Clear text area and paste these
- [ ] Click "Add to Liked Songs"
- [ ] Verify both tracks are found

### Test Case C: "By" Format
```
Flowers by Miley Cyrus
As It Was by Harry Styles
unholy by sam smith
```
- [ ] Test with both uppercase and lowercase "by"
- [ ] Verify all tracks are found

### Test Case D: Just Song Title
```
Bohemian Rhapsody
Levitating
Heat Waves
```
- [ ] Paste just song titles
- [ ] Verify it finds the most popular versions

### Test Case E: Mixed Formats
```
Bad Guy - Billie Eilish
Ed Sheeran - Perfect
Flowers by Miley Cyrus
Levitating
Anti-Hero - Taylor Swift
drivers license by Olivia Rodrigo
```
- [ ] Paste this mixed format list
- [ ] Verify all 6 tracks are found

### Test Case F: Invalid Formats
```
This is not a valid song
Random text without format
- Just dashes -
Song by
by Artist
```
- [ ] Verify these show up in "X tracks not found"
- [ ] Click the dropdown to see which ones failed

## 3. Test Playlist Features

### A. Playlist Dropdown
- [ ] Look at the playlist dropdown
- [ ] Verify each playlist shows "(X tracks)" next to its name
- [ ] Example: "My Playlist (25 tracks)"

### B. Create New Playlist
- [ ] Enter a playlist name: "Textified Test Playlist"
- [ ] Leave dropdown on "-- Choose a Playlist --"
- [ ] Add some songs:
```
Cruel Summer - Taylor Swift
good 4 u - Olivia Rodrigo
Stay - The Kid LAROI
```
- [ ] Click "Add Tracks to Playlist"
- [ ] Verify new playlist is created

### C. Add to Existing Playlist
- [ ] Select the playlist you just created from dropdown
- [ ] Add more songs:
```
Peaches by Justin Bieber
Montero by Lil Nas X
```
- [ ] Click "Add Tracks to Playlist"
- [ ] Verify tracks are added

## 4. Test Error Handling

### A. Empty Input
- [ ] Clear the text area
- [ ] Click any button
- [ ] Verify you get "No valid tracks found" message

### B. Misspelled Songs
```
Billlie Eyelash - Bad Guy
Shap of U - Ed Sheran
Blindingg Lites - Weekend
```
- [ ] Verify these show as "not found"
- [ ] Fix the spelling and try again

## 5. Test Liked Songs

### A. Add to Liked Songs
```
Heat Waves - Glass Animals
Good Ones - Charli XCX
Industry Baby - Lil Nas X
```
- [ ] Add these to liked songs
- [ ] Go to Spotify app and verify they appear

### B. Remove from Liked Songs
- [ ] Use the same songs
- [ ] Click "Remove from Liked Songs"
- [ ] Verify they're removed in Spotify

## 6. Visual/UI Tests

- [ ] Verify placeholder text shows example formats
- [ ] Verify help text appears below textarea
- [ ] Verify search results counter appears after searching
- [ ] Verify "not found" tracks are collapsible

## Performance Tests

### Large Batch Test
```
[Paste 20-30 songs in various formats]
```
- [ ] Verify it processes all songs
- [ ] Check if any timeout or fail

## Expected Results Summary

✅ All format types should work
✅ Track counter should show accurate counts
✅ Not found tracks should be listed
✅ Playlist dropdown shows track counts
✅ No console errors in browser
✅ Server doesn't crash

## Common Issues to Watch For

1. **Server Errors**: Check terminal for any red error messages
2. **API Rate Limits**: If searching too many songs quickly
3. **Token Expiration**: If you've been testing for >1 hour
4. **Console Errors**: Open browser console (F12) and check for red errors
