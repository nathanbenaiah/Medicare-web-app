# 🏥 MediCare+ - Medication & Appointment Reminder Web App

A modern, secure healthcare management web application built with HTML5, JavaScript, Supabase, and deployed on Netlify.

## 🌟 Features

- 💊 **Medication Reminders** - Set up daily medication schedules
- 🏥 **Appointment Management** - Book and track medical appointments  
- 🔐 **Secure Authentication** - Google OAuth & Email login
- 📱 **Responsive Design** - Works on all devices
- ☁️ **Cloud Database** - Real-time data sync with Supabase
- 🔔 **Smart Notifications** - Never miss your medication or appointments

## 🚀 Quick Start Guide

### Prerequisites
- GitHub account
- Netlify account  
- Supabase account
- Google Cloud Console access (for OAuth)

---

## 📂 Project Structure

```
medicare-plus/
├── public/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   │   ├── supabaseClient.js    # Database connection
│   │   ├── auth.js              # Authentication logic
│   │   ├── reminders.js         # Medication management
│   │   └── appointments.js      # Appointment management
│   └── images/        # Static assets
├── views/
│   ├── index.html           # Landing page
│   ├── dashboard.html       # Main dashboard
│   ├── login.html           # Login page
│   ├── signup.html          # Registration page
│   ├── reminders.html       # Medication reminders
│   └── appointments.html    # Appointment booking
├── package.json             # Dependencies
├── netlify.toml             # Netlify deployment config
├── supabase-schema.sql      # Database schema
└── .gitignore              # Git ignore rules
```

---

## 🛠️ Step-by-Step Setup

### **STEP 1: GitHub Repository**

1. **Create Repository**
   ```bash
   # Go to github.com → New Repository
   # Name: medicare-plus
   # Public/Private: Your choice
   # ✅ Add README file
   ```

2. **Upload Files**
   - Download/Clone this project
   - Upload all files to your new repository
   - Commit: "Initial commit - MediCare+ Web App"

### **STEP 2: Supabase Database Setup**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - New Project → Name: `medicare-plus-db`
   - Choose region closest to you
   - Set strong database password

2. **Run Database Schema**
   - In Supabase Dashboard → SQL Editor
   - Copy entire `supabase-schema.sql` content
   - Click "Run" to create all tables

3. **Get Credentials**
   - Settings → API
   - Copy **Project URL** and **anon public key**
   - Keep these safe - you'll need them!

### **STEP 3: Google OAuth Setup**

1. **Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project: "MediCare Plus"
   - Enable "Google+ API"

2. **Create OAuth Credentials**
   - Credentials → Create Credentials → OAuth 2.0 Client IDs
   - Application type: "Web application"
   - Authorized JavaScript origins: `https://your-site-name.netlify.app`
   - Authorized redirect URIs: `https://your-supabase-url.supabase.co/auth/v1/callback`
   - Save **Client ID** and **Client Secret**

### **STEP 4: Configure Supabase Authentication**

1. **Enable Google Provider**
   - Supabase Dashboard → Authentication → Providers
   - Enable "Google"
   - Enter your Google **Client ID** and **Client Secret**
   - Site URL: `https://your-site-name.netlify.app`
   - Redirect URLs: `https://your-site-name.netlify.app/views/dashboard.html`

### **STEP 5: Update Your Code**

1. **Update Supabase Credentials**
   - Edit `public/js/supabaseClient.js`
   - Replace with your real Supabase URL and anon key:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co'
   const SUPABASE_ANON_KEY = 'your-anon-key-here'
   ```

2. **Commit Changes**
   - Commit message: "Update Supabase credentials"

### **STEP 6: Deploy to Netlify**

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git → GitHub
   - Select your `medicare-plus` repository

2. **Build Settings**
   - Branch: `main`
   - Build command: `npm install`
   - Publish directory: `views`
   - Deploy site!

3. **Environment Variables (Recommended)**
   - Site settings → Environment variables
   - Add:
     - `SUPABASE_URL` = your Supabase URL
     - `SUPABASE_ANON_KEY` = your anon key

### **STEP 7: Test Your App**

1. **Visit Your Live Site**
   - Use the Netlify URL provided
   - Test user registration
   - Try Google login
   - Add medication reminders
   - Book appointments

2. **Verify Database**
   - Check Supabase Table Editor
   - Your data should appear in `reminders` and `appointments` tables

---

## 🔧 Configuration Files Explained

### **netlify.toml**
```toml
[build]
  publish = "views"          # Serves HTML files from views folder
  command = "npm install"    # Installs dependencies

[[redirects]]
  from = "/*"
  to = "/index.html"         # SPA routing
  status = 200
```

### **supabase-schema.sql**
Creates these tables:
- `reminders` - Medication schedules
- `appointments` - Medical appointments
- `reminder_logs` - Track medication compliance
- `user_preferences` - User settings
- `pharmacies` - Pharmacy directory

---

## 🔐 Security Features

- **Row Level Security (RLS)** - Users only see their own data
- **OAuth Authentication** - Secure Google login
- **Environment Variables** - Credentials stored securely
- **HTTPS Encryption** - All data transmitted securely

---

## 🎯 Usage Guide

### **For Users:**
1. **Sign Up** - Create account with email or Google
2. **Add Medications** - Set name, dosage, time, frequency
3. **Book Appointments** - Doctor, date, time, reason
4. **Get Reminders** - Automatic notifications
5. **Track Progress** - Mark medications as taken

### **For Developers:**
1. **Customize UI** - Edit HTML/CSS in `views/` and `public/css/`
2. **Add Features** - Extend JavaScript in `public/js/`
3. **Modify Database** - Update schema in Supabase dashboard
4. **Deploy Changes** - Git push automatically deploys via Netlify

---

## 🆘 Troubleshooting

### **Common Issues:**

**Authentication not working?**
- Check Google OAuth redirect URLs
- Verify Supabase auth settings
- Ensure site URL matches deployment URL

**Database not saving data?**
- Confirm schema was run successfully
- Check RLS policies are enabled
- Verify Supabase credentials in code

**Site not loading?**
- Check Netlify build logs
- Ensure `views` is publish directory
- Verify all file paths are correct

### **Getting Help:**
- 📖 [Supabase Docs](https://docs.supabase.com)
- 🌐 [Netlify Docs](https://docs.netlify.com)
- 💬 [Discord Communities](https://discord.supabase.com)

---

## 🎉 Success!

**Congratulations!** You now have a fully functional healthcare management web app with:

✅ User authentication  
✅ Real-time database  
✅ Responsive design  
✅ Automatic deployments  
✅ Professional hosting  

**Your app is live and ready to help people manage their health!** 🚀💊

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Pull requests welcome! Please read contributing guidelines first.

---

**Built with ❤️ for better healthcare management**
