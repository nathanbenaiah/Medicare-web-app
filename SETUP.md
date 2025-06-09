# 🏥 **Medication & Appointment Reminder - Complete Setup Guide**

This guide will help you set up the complete system with Google OAuth authentication, user data management, and analytics tracking.

## 📋 **Prerequisites**

- Supabase account ([supabase.com](https://supabase.com))
- Google Cloud Console account ([console.cloud.google.com](https://console.cloud.google.com))
- Netlify account ([netlify.com](https://netlify.com))
- GitHub repository (already created: `nathanbenaiah/Medicare-web-app`)

## 🗄️ **Step 1: Supabase Database Setup**

### 1.1 Create New Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose organization and enter:
   - **Project Name**: `Medicare Web App`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"

### 1.2 Import Database Schema
1. Wait for project creation (2-3 minutes)
2. Go to **SQL Editor** in left sidebar
3. Click "New query"
4. Copy the entire contents of `supabase-schema.sql` from your project
5. Paste it into the SQL editor
6. Click "Run" to execute the schema
7. Verify tables are created in **Table Editor**

### 1.3 Configure Row Level Security (RLS)
The schema already includes RLS policies, but verify:
1. Go to **Authentication** → **Policies**
2. You should see policies for all tables
3. If not, run the RLS commands from the schema again

## 🔐 **Step 2: Google OAuth Setup**

### 2.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing one
3. Enable **Google+ API** and **OAuth2 API**

### 2.2 Configure OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: **Web application**
4. Name: `Medicare Web App`
5. **Authorized redirect URIs**:
   ```
   https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback
   https://medicarewebapp.netlify.app/auth/callback
   http://localhost:3000/auth/callback
   ```
6. Save and copy **Client ID** and **Client Secret**

### 2.3 Configure Supabase Authentication
1. In Supabase, go to **Authentication** → **Providers**
2. Find **Google** provider and click configure
3. Enable Google provider
4. Paste your **Client ID** and **Client Secret**
5. Click "Save"

## ⚙️ **Step 3: Environment Configuration**

### 3.1 Update Supabase Configuration
1. In Supabase, go to **Settings** → **API**
2. Copy your:
   - **Project URL**
   - **anon public key**

### 3.2 Update Your Code
1. Open `js/supabaseClient.js`
2. Replace the placeholder values:
```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key-here'
```

## 🚀 **Step 4: Deploy to Netlify**

### 4.1 Connect Repository
1. Go to [Netlify](https://netlify.com) and sign in
2. Since you already have the site `medicarewebapp.netlify.app`, go to Site Settings
3. Go to **Build & Deploy** → **Continuous Deployment**
4. Click "Link repository"
5. Connect to GitHub and select `nathanbenaiah/Medicare-web-app`

### 4.2 Configure Build Settings
```
Build command: (leave empty for static site)
Publish directory: html
```

### 4.3 Deploy
1. Click "Deploy site"
2. Wait for deployment to complete
3. Your site will be live at `https://medicarewebapp.netlify.app`

## 🔧 **Step 5: Test the Complete System**

### 5.1 Test Authentication
1. Visit your deployed site
2. Click "Sign In" button
3. Should redirect to Google OAuth
4. After successful login, should redirect to dashboard
5. Check Supabase **Authentication** → **Users** to see new user

### 5.2 Test User Data
1. After sign-in, user profile should be created automatically
2. Check Supabase **Table Editor** → **user_profiles**
3. Should see new user record with Google data

### 5.3 Test Analytics
1. Navigate through the app
2. Check **user_analytics** table
3. Should see event tracking records

### 5.4 Test Reminders
1. Go to Reminders page
2. Try adding a new reminder
3. Check **reminders** table in Supabase
4. Mark medication as taken
5. Check **reminder_logs** table

## 📊 **Step 6: Verify Analytics Dashboard**

### 6.1 User Statistics
The system automatically tracks:
- Sign-in events
- Page views
- Reminder creation/updates
- Medication taken events
- User engagement metrics

### 6.2 Database Functions
Run these queries in Supabase SQL Editor to test analytics:

```sql
-- Get user statistics
SELECT get_user_stats('USER_UUID_HERE');

-- Get user adherence rate
SELECT get_user_adherence_rate('USER_UUID_HERE', 30);

-- View analytics events
SELECT * FROM user_analytics 
WHERE user_id = 'USER_UUID_HERE' 
ORDER BY timestamp DESC;
```

## 🛠️ **Step 7: Ongoing Maintenance**

### 7.1 Data Cleanup
The system includes automatic cleanup. To run manually:
```sql
SELECT cleanup_old_data();
```

### 7.2 Monitor Performance
- Check Supabase **Logs** for any errors
- Monitor **Database** usage in Supabase dashboard
- Review **Analytics** in Netlify for site performance

## 🔍 **Troubleshooting**

### Common Issues:

1. **Google OAuth not working**:
   - Verify redirect URIs match exactly
   - Check Google Cloud Console credentials
   - Ensure Google provider is enabled in Supabase

2. **Database errors**:
   - Check if all tables were created successfully
   - Verify RLS policies are in place
   - Check user permissions

3. **Authentication redirect issues**:
   - Verify `supabaseClient.js` has correct URLs
   - Check network tab for API calls
   - Ensure Netlify deployment is successful

4. **Analytics not tracking**:
   - Check browser console for JavaScript errors
   - Verify user_analytics table exists
   - Check RLS policies allow inserts

## 📞 **Need Help?**

- Check browser console for error messages
- Review Supabase logs in dashboard
- Verify all environment variables are correct
- Test with different browsers/devices

## 🎉 **You're Ready!**

Your complete medication reminder system is now live with:
- ✅ Google OAuth authentication
- ✅ User profile management
- ✅ Real-time data synchronization
- ✅ Analytics tracking
- ✅ No dummy data
- ✅ Secure user-specific data

Users can now sign in with Google and have their own personalized medication and appointment tracking system!

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