# MediCare+ - AI-Powered Healthcare Platform for Sri Lankans

<!-- Deployment Trigger: Updated 2024-01-20 - Testing authentication flow -->

An all-in-one AI-powered healthcare platform designed specifically for Sri Lankans, featuring appointment booking, health assessments, medication reminders, and 24/7 AI health assistance.

## 🌟 Features

### Core Healthcare Services
- **🤖 AI Health Assistant**: 24/7 personalized health guidance
- **📅 Smart Appointments**: Instant booking with 600+ hospitals
- **💊 Medication Management**: Smart reminders and tracking
- **📊 Health Assessments**: AI-powered symptom checker and health analytics
- **🔐 Secure Records**: HIPAA-compliant health data management

### Advanced AI Capabilities
- **Symptom Analysis**: Advanced symptom checker with ML recommendations
- **Predictive Analytics**: Health trend analysis and risk assessment
- **Telemedicine Integration**: Virtual consultations with healthcare providers
- **Document AI**: Intelligent health document processing

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **AI/ML**: OpenAI GPT, Custom health algorithms
- **Deployment**: Vercel (Static Site)
- **Authentication**: Supabase Auth with email/magic links

## 📱 Platform Architecture

### Static Site with Dynamic Features
- Modern responsive design with glassmorphism UI
- Progressive Web App (PWA) capabilities
- Offline functionality for critical features
- Real-time data synchronization

### Database Schema
- User profiles and authentication
- Health assessments and AI results
- Appointment and reminder systems
- Chat conversations and telemedicine sessions

## 🔧 Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nathanbenaiah/Medicare-web-app.git
   cd Medicare-web-app
   ```

2. **Configure Environment**
   - Copy `config/env-template.txt` to create your environment configuration
   - Set up Supabase project and add credentials to `config/supabase.js`
   - Configure OpenAI API key in `config/ai-config.js`

3. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

## 📊 Database Setup

Run the SQL schema file to set up the database:
```sql
-- Execute SUPABASE_FINAL_FIX.sql in your Supabase dashboard
-- This creates all necessary tables with proper auth integration
```

## 🏥 Healthcare Features

### AI Health Assistant
- Natural language health queries
- Symptom-based recommendations
- Medication interaction checking
- Emergency situation detection

### Appointment System
- Real-time hospital availability
- Multi-provider network integration
- Automated confirmation and reminders
- Calendar synchronization

### Health Analytics
- Personalized health dashboards
- Risk assessment algorithms
- Trend analysis and insights
- Preventive care recommendations

## 🔐 Security & Privacy

- **Data Encryption**: End-to-end encryption for all health data
- **HIPAA Compliance**: Healthcare data protection standards
- **Authentication**: Multi-factor authentication support
- **Privacy Controls**: Granular data sharing permissions

## 🌍 Sri Lankan Healthcare Integration

- **Local Hospital Network**: 600+ hospitals across all provinces
- **Sinhala/Tamil Support**: Multi-language interface
- **Local Health Guidelines**: MOH Sri Lanka compliance
- **Regional Specialists**: Location-based doctor recommendations

## 📈 Future Roadmap

- **Mobile Apps**: Native iOS and Android applications
- **Wearable Integration**: Health device data synchronization
- **Insurance Integration**: Direct billing and claims processing
- **Research Platform**: Anonymized health data insights

## 🤝 Contributing

We welcome contributions to improve healthcare accessibility in Sri Lanka:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Mission

**"Making quality healthcare accessible, affordable, and intelligent for every Sri Lankan, powered by cutting-edge AI technology."**

---

**MediCare+** - Healthcare Made Simple for Sri Lankans 🏥✨ 