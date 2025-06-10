# 🏥 Medicare+ Web Application

A comprehensive healthcare management platform with user authentication, profile management, medication database, and pharmacy network integration.

## 🚀 **Key Features**

### 🔐 **Authentication & User Management**
- **Google OAuth 2.0** integration for secure sign-in
- **Profile completion flow** with comprehensive user data collection
- **Session persistence** across browser sessions
- **Enhanced security** with Row Level Security (RLS) policies

### 👤 **User Profile System**
- **Complete profile management** with profile picture upload
- **Skills and interests** tagging system
- **Professional information** tracking
- **Real-time profile updates** with server-side validation

### 💊 **Comprehensive Medication Database**
- **8 detailed medications** with full pharmaceutical information
- **Advanced search functionality** with real-time results
- **Detailed medication information** including:
  - Generic names and categories
  - Common dosages and descriptions
  - Side effects and drug interactions
  - Warnings and storage instructions
- **Interactive medication details** modal with comprehensive data

### 🏪 **Pharmacy Network**
- **10 pharmacies** across Sri Lanka with complete contact information
- **Location-based data** with coordinates for future map integration
- **Operating hours** and contact details
- **Network expansion** ready infrastructure

### 📊 **Analytics & Insights**
- **User activity tracking** with event logging
- **Search analytics** for medication queries
- **Profile completion** metrics
- **Session management** and user engagement data

### 🔔 **Notification System**
- **System-wide announcements** and health tips
- **Medication reminders** infrastructure
- **Appointment notifications** ready
- **Priority-based** notification management

## 🗄️ **Enhanced Database Schema**

### **Core Tables**
```sql
-- User profiles with comprehensive data
user_profiles (
  id, email, full_name, phone_number, bio, 
  address, occupation, skills[], profile_picture,
  is_profile_complete, created_at, updated_at
)

-- Detailed medications database
medications_db (
  id, name, generic_name, category, description,
  common_dosages[], side_effects[], interactions[],
  warnings[], storage_instructions, created_at
)

-- Pharmacy network
pharmacies (
  id, name, address, city, phone, hours,
  latitude, longitude, created_at
)

-- User analytics and tracking
user_analytics (
  id, event_type, event_data, timestamp
)

-- Notification system
notifications (
  id, type, title, message, priority,
  user_id, scheduled_for, expires_at, read_at
)
```

### **Advanced Database Functions**
- `create_user_profile()` - Enhanced profile creation with validation
- `update_user_profile()` - Comprehensive profile updates
- `validate_profile_data()` - Server-side data validation
- `is_user_profile_complete()` - Profile completion checking
- `find_users_by_skills()` - Skill-based user discovery
- `get_user_profile()` - Enhanced profile retrieval

## 📁 **Project Structure**

```
Medicare+ Web App/
├── 📄 Database & Setup
│   ├── supabase-schema.sql       # Complete database schema with sample data
│   ├── SETUP.md                  # Comprehensive setup guide
│   └── DEPLOYMENT_CHECKLIST.md   # Deployment checklist
├── 🌐 Frontend Pages
│   ├── html/
│   │   ├── index.html           # Landing page with auth
│   │   ├── signup.html          # User registration form
│   │   ├── profile.html         # Profile management + medication search
│   │   ├── dashboard.html       # Data visualization dashboard
│   │   └── test.html           # Development testing
├── ⚡ JavaScript Modules
│   ├── js/
│   │   ├── db.js               # Enhanced database client
│   │   ├── auth.js             # Authentication manager
│   │   ├── form.js             # Form handling with validation
│   │   └── profile.js          # Profile + medication functionality
└── 📊 Sample Data
    ├── 8 detailed medications   # Complete pharmaceutical data
    ├── 10 Sri Lankan pharmacies # Network coverage
    ├── System notifications     # Health tips and announcements
    └── Analytics events         # User interaction tracking
```

## 🔧 **Technology Stack**

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Storage)
- **Authentication**: Google OAuth 2.0
- **Database**: PostgreSQL with advanced functions
- **Storage**: Supabase Cloud Storage for profile pictures
- **Hosting**: Netlify (deployment ready)

## 🎯 **New Functionality**

### **Medication Search & Discovery**
```javascript
// Real-time medication search
await dbClient.searchMedications('aspirin')

// Detailed medication information
await dbClient.getMedication(medicationId)

// Category-based browsing
await dbClient.getMedicationCategories()
```

### **Enhanced Analytics**
```javascript
// Track user interactions
await dbClient.logEvent('medication_search', {
  query: 'lisinopril',
  results_count: 3,
  user_id: userId
})

// Profile completion tracking
await dbClient.logEvent('profile_completed', {
  fields_completed: 8,
  has_profile_picture: true
})
```

### **Pharmacy Integration**
```javascript
// Load pharmacy network
await dbClient.getAllPharmacies()

// Future: Location-based search
await dbClient.getNearbyPharmacies(lat, lng, radius)
```

## 🚀 **Quick Start**

### **1. Database Setup**
```bash
# Import the complete schema with sample data
psql -h your-supabase-host -U postgres -d postgres < supabase-schema.sql
```

### **2. Environment Configuration**
```javascript
// Update js/db.js with your Supabase credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key-here'
```

### **3. Google OAuth Setup**
1. Create Google Cloud Project
2. Configure OAuth 2.0 credentials
3. Add authorized redirect URIs
4. Update Supabase Auth settings

### **4. Deployment**
```bash
# Deploy to Netlify
git push origin main  # Auto-deployment configured

# Or manual deployment
npm run build && netlify deploy --prod
```

## 📊 **Sample Data Included**

### **Medications Database**
- **8 comprehensive medications** with detailed pharmaceutical information
- **Categories**: ACE Inhibitors, Diabetes, Statins, PPIs, Calcium Channel Blockers, NSAIDs, Thyroid Hormones, Anticoagulants
- **Complete data**: Dosages, side effects, interactions, warnings, storage instructions

### **Pharmacy Network**
- **10 pharmacies** across major Sri Lankan cities
- **Coverage**: Colombo, Kandy, Galle, Negombo, Jaffna, Matara, Anuradhapura, Batticaloa
- **Details**: Complete addresses, phone numbers, operating hours, coordinates

### **System Features**
- **User analytics** with event tracking
- **Notification system** with health tips
- **Profile completion** workflow
- **Search functionality** with real-time results

## 🔮 **Future Enhancements**

- **Medication reminders** with scheduling
- **Appointment booking** system
- **Doctor network** integration
- **Health records** management
- **Prescription tracking**
- **Location-based services** with maps
- **Mobile app** development
- **API integration** with healthcare providers

## 📈 **Analytics & Monitoring**

The system includes comprehensive analytics tracking:
- User registration and authentication events
- Profile completion metrics
- Medication search patterns
- Feature usage statistics
- Error tracking and monitoring

## 🛡️ **Security Features**

- **Row Level Security (RLS)** for data protection
- **Google OAuth 2.0** for secure authentication
- **Input validation** and sanitization
- **Image upload** security with compression
- **Session management** with secure tokens

## 📞 **Support & Documentation**

- **Setup Guide**: See `SETUP.md` for detailed instructions
- **Deployment Guide**: See `DEPLOYMENT_CHECKLIST.md`
- **Database Schema**: See `supabase-schema.sql`
- **API Documentation**: Built-in function documentation

---

**Medicare+** - *Comprehensive Healthcare Management Platform*
Built with ❤️ for better health management and accessibility.
