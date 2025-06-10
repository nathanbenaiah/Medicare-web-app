# 🏥 **Medicare Web App - Complete Setup Guide**

This guide will help you set up the Medicare Web App with Google Authentication, Supabase backend, and full user profile management.

## 📋 **Prerequisites**

- [Supabase Account](https://supabase.com)
- [Google Cloud Console](https://console.cloud.google.com) access
- [Netlify Account](https://netlify.com) (for hosting)
- [GitHub Account](https://github.com) (for deployment)

---

## 🗄️ **Step 1: Supabase Database Setup**

### 1.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name**: `medicare-web-app`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 1.2 Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire content from `supabase-schema.sql`
3. Paste and run the SQL script
4. Verify tables are created in **Database** > **Tables**

### 1.3 Configure Storage
1. Go to **Storage** in Supabase dashboard
2. The `profile-pics` bucket should be automatically created
3. If not, create it manually with public access

---

## 🔐 **Step 2: Google OAuth Setup**

### 2.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Google+ API** and **People API**

### 2.2 Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - **App name**: Medicare Web App
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add authorized domains:
   - `localhost` (for development)
   - Your Netlify domain (e.g., `medicarewebapp.netlify.app`)

### 2.3 Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized origins:
   ```
   http://localhost:3000
   https://your-app-name.netlify.app
   ```
5. Add redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://your-project-id.supabase.co/auth/v1/callback
   https://your-app-name.netlify.app/auth/callback
   ```
6. Save and copy the **Client ID** and **Client Secret**

---

## ⚙️ **Step 3: Supabase Authentication Configuration**

### 3.1 Enable Google Provider
1. Go to **Authentication** > **Providers** in Supabase
2. Enable **Google** provider
3. Enter your Google **Client ID** and **Client Secret**
4. Set **Site URL**: `https://your-app-name.netlify.app`
5. Add **Redirect URLs**:
   ```
   https://your-app-name.netlify.app/html/
   http://localhost:3000/html/
   ```

### 3.2 Configure Authentication Settings
1. Go to **Authentication** > **Settings**
2. Set **Site URL**: Your main domain
3. Enable **Email confirmations** (optional)
4. Configure **Session timeout** as needed

---

## 🔧 **Step 4: Update Application Configuration**

### 4.1 Update Supabase Credentials
Edit `js/db.js`:

```javascript
// Replace with your actual Supabase credentials
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'
```

**Find your credentials:**
1. Go to **Settings** > **API** in Supabase dashboard
2. Copy **Project URL** and **anon/public key**

### 4.2 Verify File Structure
Ensure your project has this structure:
```
├── html/
│   ├── index.html
│   ├── signup.html
│   ├── profile.html
│   └── dashboard.html
├── js/
│   ├── db.js
│   ├── auth.js
│   ├── form.js
│   └── profile.js
├── css/
│   └── styles.css
├── images/
└── supabase-schema.sql
```

---

## 🚀 **Step 5: Local Development**

### 5.1 Start Local Server
```bash
# Option 1: Python
python -m http.server 3000

# Option 2: Node.js
npx serve . -p 3000

# Option 3: Live Server (VS Code extension)
# Right-click index.html > "Open with Live Server"
```

### 5.2 Test Authentication Flow
1. Open `http://localhost:3000/html/index.html`
2. Click "Sign In with Google"
3. Complete Google OAuth flow
4. Should redirect to signup form
5. Fill out profile information
6. Should redirect to profile page

---

## 🌐 **Step 6: Deploy to Netlify**

### 6.1 Connect GitHub Repository
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" > "Import from Git"
4. Connect your GitHub repository
5. Configure build settings (usually auto-detected)

### 6.2 Configure Environment Variables
In Netlify dashboard > **Site settings** > **Environment variables**:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 6.3 Update Domain Configuration
1. Note your Netlify domain (e.g., `random-name-123.netlify.app`)
2. Update Google OAuth redirect URIs with your new domain
3. Update Supabase redirect URLs with your new domain

---

## 🎯 **Step 7: Testing & Verification**

### 7.1 Test Complete User Flow
1. **Sign In**: Google OAuth works
2. **Profile Creation**: New users can complete signup
3. **Profile Editing**: Users can update information
4. **Image Upload**: Profile pictures upload to Supabase Storage
5. **Session Persistence**: Users stay logged in across sessions

### 7.2 Test Database Operations
Check Supabase dashboard:
1. **user_profiles** table has new entries
2. **Storage** has uploaded images
3. **Authentication** shows signed-in users

---

## 🔧 **Troubleshooting**

### Common Issues

**"Supabase client not loaded"**
- Check that `js/db.js` loads before `js/auth.js`
- Verify Supabase CDN is accessible
- Check browser console for errors

**"Failed to sign in with Google"**
- Verify OAuth redirect URIs are correct
- Check Google OAuth consent screen is published
- Ensure domains are authorized in Google Console

**"Profile not found"**
- Check database schema was applied correctly
- Verify RLS policies are set up
- Check user permissions in Supabase

**"Image upload failed"**
- Verify storage bucket exists and is public
- Check storage policies are configured
- Ensure file size is under limit (5MB)

### Debug Mode
Add to `js/db.js` for debugging:
```javascript
// Enable debug mode
const DEBUG = true
if (DEBUG) {
    console.log('Supabase URL:', SUPABASE_URL)
    console.log('User:', await supabase.auth.getUser())
}
```

---

## 🎉 **Success!**

Your Medicare Web App should now have:
- ✅ Google OAuth authentication
- ✅ Complete user profile system
- ✅ Image upload functionality
- ✅ Secure database with RLS
- ✅ Session management
- ✅ Responsive design

---

## 📱 **Features Included**

### Authentication System
- Google OAuth integration
- Session persistence
- Automatic profile creation
- Secure logout

### Profile Management
- Extended signup form
- Profile editing
- Image upload/preview
- Skills management
- Form validation

### Database Features
- Row Level Security (RLS)
- User profile storage
- Image storage
- Session tracking
- Data validation

### User Experience
- Loading states
- Error handling
- Success notifications
- Responsive design
- Professional UI

---

## 🛠️ **Next Steps**

Once everything is working:
1. Customize styling in `css/styles.css`
2. Add more profile fields as needed
3. Implement medication/appointment features
4. Add email notifications
5. Set up analytics tracking

---

## 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Verify all configuration steps
3. Test in incognito/private mode
4. Check Supabase logs in dashboard

---

**Happy coding! 🚀**

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