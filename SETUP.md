# ⚡ Quick Setup Guide - MediCare+

## 🚀 5-Minute Deployment

### 1. GitHub (2 minutes)
```bash
# Create new repository: medicare-plus
# Upload all project files
# Commit: "Initial MediCare+ deployment"
```

### 2. Supabase (1 minute)  
```bash
# Create project: medicare-plus-db
# SQL Editor → Paste supabase-schema.sql → Run
# Settings → API → Copy URL + anon key
```

### 3. Netlify (1 minute)
```bash
# New site from Git → Select your repo
# Build settings: publish=views, command=npm install
# Deploy!
```

### 4. Update Credentials (1 minute)
```javascript
// Edit: public/js/supabaseClient.js
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'
```

### 5. Google OAuth (Optional)
```bash
# Google Cloud Console → New project
# OAuth 2.0 Client → Web app
# Add your Netlify URL to authorized origins
# Add Supabase callback URL
# Enable in Supabase Auth settings
```

## ✅ That's it! Your app is live!

**Test:** Visit your Netlify URL → Sign up → Add medication → Book appointment

---

## 📋 Final File Structure

```
medicare-plus/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   ├── index.html
│   ├── dashboard.html
│   ├── reminders.html
│   └── appointments.html
├── package.json
├── netlify.toml
├── supabase-schema.sql
├── README.md
├── SETUP.md
└── .gitignore
```

## 🎯 Key URLs You'll Need

- **Your Netlify App:** `https://your-app.netlify.app`
- **Supabase Dashboard:** `https://app.supabase.com`  
- **Google Cloud Console:** `https://console.cloud.google.com`

---

**Need detailed instructions? Check `README.md`** 📖 