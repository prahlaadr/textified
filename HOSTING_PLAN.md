# Textified Hosting Plan

## Current Architecture Problems for Hosting

1. **Spotify OAuth Redirect URI**
   - Currently hardcoded to `http://localhost:8888/callback`
   - Need to support multiple environments (local, production)

2. **CORS Issues**
   - Frontend hardcoded to call `http://localhost:8888`
   - Need environment-based API URLs

3. **Environment Variables**
   - Currently only in server/.env
   - Need to handle both local and production configs

## Vercel Deployment Strategy

### Phase 1: Prepare for Multi-Environment Support

1. **Update Backend (server/index.js)**
   ```javascript
   // Add environment-based configuration
   const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
   const API_URL = process.env.API_URL || 'http://localhost:8888';
   
   // Update CORS
   app.use(cors({
     origin: CLIENT_URL,
     credentials: true
   }));
   
   // Update redirect after OAuth
   res.redirect(`${CLIENT_URL}?access_token=${accessToken}`);
   ```

2. **Update Frontend (client/src/App.js)**
   ```javascript
   // Create API base URL
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8888';
   
   // Update all API calls
   axios.get(`${API_BASE_URL}/profile?access_token=${accessToken}`)
   ```

3. **Create Vercel Configuration**
   - `vercel.json` for routing
   - Convert Express endpoints to serverless functions

### Phase 2: Spotify App Configuration

1. **Create Production Spotify App** (or update existing)
   - Add production redirect URI: `https://your-app.vercel.app/api/callback`
   - Keep localhost URI for development

2. **Handle Multiple Redirect URIs**
   ```javascript
   // Smart redirect URI selection
   const REDIRECT_URI = process.env.NODE_ENV === 'production' 
     ? process.env.SPOTIFY_REDIRECT_URI_PROD 
     : process.env.SPOTIFY_REDIRECT_URI_DEV;
   ```

### Phase 3: File Structure for Vercel

```
textified/
├── api/                    # Serverless functions (backend)
│   ├── login.js
│   ├── callback.js
│   ├── profile.js
│   ├── search.js
│   ├── playlists.js
│   └── ... (other endpoints)
├── client/                 # React app (unchanged)
├── vercel.json            # Vercel configuration
├── package.json           # Root package.json
└── README.md
```

### Phase 4: Environment Variables for Vercel

**Production (.env.production)**
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI_PROD=https://textified.vercel.app/api/callback
CLIENT_URL=https://textified.vercel.app
```

**Local (.env.development)**
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI_DEV=http://localhost:8888/callback
CLIENT_URL=http://localhost:3000
```

## Making It Work for Others Who Clone

### Option 1: Use Their Own Spotify App (Current Approach)
**Pros:** Full control, no rate limits
**Cons:** Requires Spotify Developer account

**Setup Instructions:**
1. Clone repo
2. Create Spotify App
3. Add redirect URI
4. Create .env file
5. Run locally

### Option 2: Shared Spotify App (Not Recommended)
**Pros:** Easier setup
**Cons:** Rate limits, security issues, against Spotify ToS

### Option 3: OAuth Proxy Service (Advanced)
**Pros:** Hide credentials, easier for users
**Cons:** Complex to implement, needs backend service

## Recommended Approach

1. **For Hosting:** Use Vercel with environment-based configuration
2. **For Cloners:** Provide detailed setup guide with Spotify app creation
3. **Bonus:** Create a "Deploy to Vercel" button for one-click deployment

## Implementation Steps

1. Refactor code for environment variables
2. Create serverless function structure
3. Test locally with production-like setup
4. Deploy to Vercel
5. Update documentation

## Security Considerations

1. **Never expose Spotify Client Secret** in frontend code
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** to prevent abuse
4. **Add user session management** for production
5. **Consider implementing refresh token flow**

## Cost Analysis

**Vercel Free Tier:**
- 100GB bandwidth/month
- Serverless function execution: 100GB-hours
- Perfect for personal projects

**Estimated Usage:**
- ~1000 users/month possible on free tier
- Each user session ~10 API calls
- Well within limits

## Next Steps

1. Decide on hosting approach
2. Refactor code for multi-environment support
3. Create Vercel configuration
4. Test deployment
5. Update documentation
