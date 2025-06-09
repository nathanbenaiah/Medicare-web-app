# Environment Variables Setup for Netlify + Supabase

## Required Environment Variables

Set these in **Netlify Dashboard > Site settings > Environment variables**:

### Supabase Configuration
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Google OAuth (Optional)
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Site Configuration
```
VITE_SITE_URL=https://your-site-name.netlify.app
```

## Where to Find These Values

### Supabase Values:
1. Go to your Supabase Dashboard
2. Select your project
3. Go to **Settings > API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys > anon public** → `VITE_SUPABASE_ANON_KEY`

### Google OAuth (if needed):
1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Copy your OAuth 2.0 Client ID

### Site URL:
- Will be provided by Netlify after deployment
- Format: `https://your-site-name.netlify.app` 