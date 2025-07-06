# Testing the New Search Format Support

## Test Cases

Copy and paste these into the textified app to test all supported formats:

```
Bad Guy - Billie Eilish
Ed Sheeran - Shape of You
Blinding Lights by The Weeknd
Bohemian Rhapsody
Taylor Swift - Anti-Hero
Flowers by Miley Cyrus
As It Was
Heat Waves - Glass Animals
unholy by Sam Smith
Levitating
```

## What's Happening

1. **"Bad Guy - Billie Eilish"** - Traditional format (Song - Artist)
2. **"Ed Sheeran - Shape of You"** - Reversed format (Artist - Song)
3. **"Blinding Lights by The Weeknd"** - "by" format
4. **"Bohemian Rhapsody"** - Just song title (will search all artists)
5. **"Taylor Swift - Anti-Hero"** - Another reversed format
6. **"Flowers by Miley Cyrus"** - Another "by" format
7. **"As It Was"** - Just song title (should find Harry Styles version)
8. **"Heat Waves - Glass Animals"** - Traditional format
9. **"unholy by Sam Smith"** - Lowercase "by" format
10. **"Levitating"** - Just song title (should find Dua Lipa version)

## Expected Results

- All formats should work seamlessly
- Songs with just titles should find the most popular version
- The search is now more flexible and forgiving
- Users can paste from different sources without reformatting

## Benefits

1. **More Flexible** - Users can paste from various sources
2. **Less Errors** - Works even if users forget the artist
3. **Better UX** - No need to reformat every song
4. **Smarter Search** - Uses Spotify's search algorithm effectively
