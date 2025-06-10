# HTML, CSS, and JS File Reference Guide

## Overview
This document defines the correct CSS and JS file references for each HTML page in the Medicare Web App. All paths are relative to the project root.

## CSS File Structure
```
css/
├── blog.css              # Blog-specific styles
├── buttons.css           # Button components and styles
├── dashboard.css         # Dashboard-specific styles
├── forms.css            # Form components and validation styles
├── mobile-responsive.css # Mobile responsiveness framework
├── modern.css           # Modern UI components and animations
├── reminders.css        # Reminders page specific styles
├── schedule.css         # Schedule/calendar specific styles
├── style.css            # Base styles and utilities
└── utilities.css        # Utility classes and helpers
```

## JS File Structure
```
js/
├── animations.js        # UI animations and transitions
├── appointments.js      # Appointment management functionality
├── auth.js             # Authentication logic
├── auth-manager.js     # Authentication state management
├── button-manager.js   # Button interactions and states
├── calendar.js         # Calendar widget functionality
├── common.js           # Shared utility functions
├── dashboard.js        # Dashboard-specific functionality
├── db.js              # Database operations and queries
├── form.js            # Form handling and validation
├── forms.js           # Advanced form components
├── mobile-menu.js     # Mobile navigation functionality
├── modern.js          # Modern UI interactions
├── notifications.js   # Notification system
├── profile.js         # User profile management
├── reminders.js       # Medication reminders functionality
├── schedule.js        # Schedule management
├── supabaseClient.js  # Supabase client configuration
└── validation.js      # Form validation utilities
```

## HTML Page Configurations

### 1. index.html (Home Page)
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- Inline styles for custom home page design

**JS Files:**
- `https://unpkg.com/aos@2.3.1/dist/aos.js` - Animation library
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client
- `/js/mobile-menu.js` - Mobile navigation
- `/js/auth-manager.js` - Authentication management
- `/js/db.js` - Database operations
- `/js/auth.js` - Authentication logic

### 2. login.html
**CSS Files:**
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/forms.css` - Form styling
- `/css/style.css` - Base styles
- `/css/mobile-responsive.css` - Mobile support

**JS Files:**
- `/js/modern.js` - Modern UI interactions
- `/js/forms.js` - Form handling
- `/js/validation.js` - Form validation
- `/js/auth.js` - Authentication logic
- `/js/mobile-menu.js` - Mobile navigation

### 3. signup.html
**CSS Files:**
- `/css/style.css` - Base styles
- `/css/forms.css` - Form styling
- `/css/mobile-responsive.css` - Mobile support

**JS Files:**
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client
- `/js/db.js` - Database operations
- `/js/auth.js` - Authentication logic
- `/js/form.js` - Form handling

### 4. forgot-password.html
**CSS Files:**
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/forms.css` - Form styling
- `/css/style.css` - Base styles
- `/css/mobile-responsive.css` - Mobile support

**JS Files:**
- `/js/modern.js` - Modern UI interactions
- `/js/forms.js` - Form handling
- `/js/validation.js` - Form validation
- `/js/auth.js` - Authentication logic
- `/js/mobile-menu.js` - Mobile navigation

### 5. dashboard.html
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- `/css/dashboard.css` - Dashboard-specific styles
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/style.css` - Base styles

**JS Files:**
- `https://unpkg.com/@supabase/supabase-js@2` - Supabase client
- `/js/db.js` - Database operations
- `/js/mobile-menu.js` - Mobile navigation
- `/js/supabaseClient.js` - Supabase configuration
- `/js/dashboard.js` - Dashboard functionality
- `/js/auth.js` - Authentication logic

### 6. profile.html
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/forms.css` - Form styling
- `/css/style.css` - Base styles

**JS Files:**
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client
- `/js/db.js` - Database operations
- `/js/mobile-menu.js` - Mobile navigation
- `/js/supabaseClient.js` - Supabase configuration
- `/js/auth.js` - Authentication logic
- `/js/profile.js` - Profile management

### 7. appointments.html
**CSS Files:**
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/forms.css` - Form styling
- `/css/style.css` - Base styles
- `/css/mobile-responsive.css` - Mobile support

**JS Files:**
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client
- `/js/modern.js` - Modern UI interactions
- `/js/mobile-menu.js` - Mobile navigation
- `/js/supabaseClient.js` - Supabase configuration
- `/js/appointments.js` - Appointment management
- `/js/auth.js` - Authentication logic

### 8. reminders.html
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- `/css/reminders.css` - Reminders-specific styles
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/style.css` - Base styles

**JS Files:**
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client
- `/js/button-manager.js` - Button interactions
- `/js/reminders.js` - Reminders functionality
- `/js/notifications.js` - Notification system
- `/js/mobile-menu.js` - Mobile navigation
- `/js/auth.js` - Authentication logic

### 9. schedule.html
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- `/css/schedule.css` - Schedule-specific styles
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/style.css` - Base styles

**JS Files:**
- `https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js` - Calendar library
- `https://unpkg.com/aos@2.3.1/dist/aos.js` - Animation library
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client
- `/js/schedule.js` - Schedule management
- `/js/calendar.js` - Calendar functionality
- `/js/mobile-menu.js` - Mobile navigation
- `/js/auth.js` - Authentication logic

### 10. blog.html
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- `/css/blog.css` - Blog-specific styles
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/style.css` - Base styles

**JS Files:**
- `/js/common.js` - Shared utilities
- `/js/modern.js` - Modern UI interactions
- `/js/mobile-menu.js` - Mobile navigation

### 11. about.html
**CSS Files:**
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/style.css` - Base styles
- `/css/mobile-responsive.css` - Mobile support

**JS Files:**
- `/js/common.js` - Shared utilities
- `/js/modern.js` - Modern UI interactions
- `/js/mobile-menu.js` - Mobile navigation

### 12. test.html
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/style.css` - Base styles

**JS Files:**
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client
- `/js/db.js` - Database operations
- `/js/auth.js` - Authentication logic
- `/js/mobile-menu.js` - Mobile navigation

### 13. test-auth.html
**CSS Files:**
- Basic inline styles only

**JS Files:**
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js` - Supabase client

### 14. 404.html
**CSS Files:**
- `/css/mobile-responsive.css` - Mobile responsiveness
- `/css/modern.css` - Modern UI components
- `/css/buttons.css` - Button styles
- `/css/style.css` - Base styles

**JS Files:**
- `/js/mobile-menu.js` - Mobile navigation

## Common External Libraries

### CSS Libraries
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- **Boxicons**: `https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css`
- **Google Fonts**: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap`
- **AOS Animation**: `https://unpkg.com/aos@2.3.1/dist/aos.css`
- **FullCalendar**: `https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css`

### JS Libraries
- **Supabase**: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js`
- **AOS Animation**: `https://unpkg.com/aos@2.3.1/dist/aos.js`
- **FullCalendar**: `https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js`

## File Loading Order

### CSS Loading Order (in `<head>`):
1. External font libraries (Google Fonts)
2. External icon libraries (Font Awesome, Boxicons)
3. External component libraries (FullCalendar, AOS)
4. Custom CSS files in this order:
   - `/css/mobile-responsive.css`
   - Page-specific CSS (e.g., `/css/blog.css`)
   - `/css/modern.css`
   - `/css/buttons.css`
   - `/css/forms.css` (if needed)
   - `/css/style.css`
   - `/css/utilities.css` (if needed)

### JS Loading Order (before `</body>`):
1. External libraries (Supabase, FullCalendar, AOS)
2. Core functionality:
   - `/js/db.js`
   - `/js/supabaseClient.js`
   - `/js/auth.js`
3. UI components:
   - `/js/mobile-menu.js`
   - `/js/modern.js`
   - `/js/forms.js`
4. Page-specific functionality:
   - `/js/[page-name].js`
5. Utility scripts:
   - `/js/common.js`
   - `/js/validation.js`

## Notes

1. **Path Consistency**: All internal CSS and JS files use absolute paths starting with `/css/` and `/js/`
2. **Mobile First**: All pages include `mobile-responsive.css` for consistent mobile experience
3. **Authentication**: Most pages include authentication-related scripts for user management
4. **Supabase Integration**: Database-connected pages include Supabase client and configuration
5. **Modern UI**: Most pages use the modern CSS framework for consistent styling
6. **Error Handling**: All pages should gracefully handle missing files and network errors

## Validation Checklist

- [ ] All CSS files exist in the `/css/` directory
- [ ] All JS files exist in the `/js/` directory  
- [ ] External CDN links are accessible and up-to-date
- [ ] File paths are consistent across all HTML pages
- [ ] Mobile responsiveness is included on all pages
- [ ] Authentication is properly configured where needed
- [ ] Database connections are established for data-driven pages
- [ ] Error handling is implemented for missing resources 