# 🏥 MediCare+ Healthcare Platform

An AI-powered healthcare web application for Sri Lankans, providing comprehensive health services including AI health assessments, symptom checking, and telemedicine capabilities.

## 🚀 Live Demo

**Deployed on Vercel**: [Your Vercel URL]

## ✨ Features

### 🤖 AI Health Services
- **AI Health Chat** - Interactive health consultations
- **Symptom Checker** - AI-powered symptom analysis
- **Diet Planner** - Personalized nutrition recommendations
- **Health Assessments** - Comprehensive health evaluations

### 👥 User Management
- **User Registration & Authentication** via Supabase
- **Personal Health Profiles** with medical history
- **Secure Data Storage** with Row Level Security

### 📅 Healthcare Management
- **Appointment Booking** with healthcare providers
- **Health Document Management**
- **Medication Reminders** (coming soon)
- **Telemedicine Sessions** (future feature)

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Deployment**: Vercel
- **AI Integration**: DeepSeek API
- **Design**: Modern responsive UI with glassmorphism effects

## 🏗 Project Structure

```
MediCare+/
├── index.html              # Main homepage
├── html/                   # All HTML pages
│   ├── auth.html          # Authentication
│   ├── user-dashboard.html # User dashboard
│   ├── ai-features.html   # AI health features
│   └── ...
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
├── assets/                 # Images and static assets
├── config/                 # Configuration files
└── services/              # Service modules
```

## 🚀 Deployment

This project is optimized for **Vercel** deployment:

1. **Fork this repository**
2. **Connect to Vercel**
3. **Deploy automatically** - no build step needed!

### Environment Variables

Set these in your Vercel dashboard:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nathanbenaiah/Medicare-web-app.git
   ```

2. **Set up Supabase**
   - Run the SQL script in `SUPABASE_FINAL_FIX.sql`
   - Configure your environment variables

3. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Deploy instantly (static site)

## 📊 Database Schema

Complete integration with Supabase including:

- ✅ User profiles and authentication
- ✅ AI chat conversations
- ✅ Health assessment responses
- ✅ AI analysis results
- ✅ Appointment management
- ✅ Telemedicine sessions (ready)

## 🔐 Security

- **Row Level Security** on all database tables
- **User data isolation** and privacy protection
- **Secure authentication** via Supabase Auth
- **HTTPS enforcement** and security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Check the [Integration Guide](SUPABASE_INTEGRATION_GUIDE.md)
- Review the [Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)
- Open an issue in this repository

---

**Built with ❤️ for the Sri Lankan healthcare community** 