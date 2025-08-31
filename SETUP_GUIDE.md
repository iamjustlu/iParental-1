# iParental App - Complete Setup Guide

This guide will walk you through setting up the complete iParental app infrastructure, including Supabase database, NextDNS content filtering, and the React Native application.

## 🏗️ Architecture Overview

The iParental app uses a distributed architecture:

- **Parent App**: React Native app for parents to manage and monitor
- **Child App**: Simplified React Native app for children (same codebase, different UI)
- **Supabase**: Backend database and authentication
- **NextDNS**: Content filtering and DNS-level protection
- **Cloud Functions**: Server-side logic for data processing

## 📋 Prerequisites

Before starting, ensure you have:

- Node.js 16+ installed
- React Native development environment set up
- Supabase account (free tier available)
- NextDNS account (free tier available)
- iOS Developer Account (for iOS deployment)
- Google Play Console Account (for Android deployment)

## 🚀 Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Sign in to your account
3. Click "New Project"
4. Fill in project details:
   - Name: `iParental`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Wait for project creation (2-3 minutes)

### 1.2 Configure Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click **Run** to execute the schema
5. Verify tables were created in **Table Editor**

### 1.3 Configure Authentication

1. Go to **Authentication** > **Settings**
2. Enable email authentication
3. Disable email confirmations for development (re-enable for production)
4. Configure redirect URLs for deep linking (if needed)

### 1.4 Update App Configuration

Update `src/services/supabaseClient.ts` with your project details:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Found in Project Settings
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Found in Project API Settings
```

## 🛡️ Step 2: NextDNS Setup

### 2.1 Create NextDNS Account

1. Go to [https://nextdns.io](https://nextdns.io)
2. Sign up for an account
3. Create your first configuration
4. Note your configuration ID (e.g., `9cc4e8`)

### 2.2 Configure Age-Based Profiles

Create separate configurations for each age group:

#### Preschool Configuration (3-5 years)
1. **Blocklists**: Enable all family protection lists
2. **Allowlists**: Add educational sites (pbskids.org, khanacademy.org)
3. **Settings**: 
   - Enable Safe Search
   - Enable YouTube Restricted Mode
   - Block all social media
   - Block online gaming

#### Child Configuration (6-12 years)
1. **Blocklists**: Adult content, gambling, dating
2. **Allowlists**: Educational and appropriate entertainment sites
3. **Settings**:
   - Enable Safe Search
   - Enable YouTube Restricted Mode
   - Allow limited social media with supervision

#### Teen Configuration (13-17 years)
1. **Blocklists**: Adult content, illegal content
2. **Allowlists**: More freedom with monitoring
3. **Settings**:
   - Enable Safe Search
   - Optional YouTube Restricted Mode
   - Allow most social media

### 2.3 Get API Access

1. Go to NextDNS Account Settings
2. Generate API key
3. Update `src/services/nextdnsService.ts`:

```typescript
private readonly apiKey: string = 'YOUR_NEXTDNS_API_KEY';
private readonly configId = 'YOUR_BASE_CONFIG_ID';
```

## 📱 Step 3: React Native App Setup

### 3.1 Install Dependencies

```bash
cd iParental
npm install

# Install additional dependencies for Supabase
npm install @supabase/supabase-js@^2.39.0

# Install React Hook Form for better forms
npm install react-hook-form

# Install date picker for child profiles
npm install @react-native-community/datetimepicker

# iOS specific
cd ios && pod install && cd ..
```

### 3.2 Configure Environment

Create `.env` file in project root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTDNS_API_KEY=your_nextdns_api_key
NEXTDNS_BASE_CONFIG=your_base_config_id
```

### 3.3 Update Configuration Files

Update `src/services/supabaseClient.ts` and `src/services/nextdnsService.ts` with your actual credentials.

## 🔧 Step 4: Test the Setup

### 4.1 Start the Development Server

```bash
npm start
```

### 4.2 Run on iOS Simulator

```bash
npm run ios
```

### 4.3 Run on Android Emulator

```bash
npm run android
```

### 4.4 Test Core Features

1. **Registration**: Create a parent account
2. **Child Profile**: Add a child profile (this should create a NextDNS config)
3. **Database**: Verify data appears in Supabase tables
4. **Authentication**: Test login/logout flows

## 📊 Step 5: Dashboard Integration

### 5.1 Enable Real-time Analytics

1. In NextDNS dashboard, enable analytics for your configurations
2. Test the analytics API integration in the reporting screen
3. Verify charts display data correctly

### 5.2 Test Content Filtering

1. Create a child profile
2. Follow device setup instructions
3. Configure DNS on a test device
4. Verify blocked content shows NextDNS block page

## 🔒 Step 6: Security and Privacy

### 6.1 Row Level Security (RLS)

The provided schema includes RLS policies. Verify:

1. Parents can only see their own children's data
2. Authentication is required for all operations
3. Sensitive data is properly protected

### 6.2 API Security

1. Rotate Supabase anon key if exposed
2. Keep NextDNS API key secure
3. Enable rate limiting in production

### 6.3 Data Encryption

1. Enable encryption at rest in Supabase (automatic)
2. Use HTTPS for all API calls (automatic)
3. Store sensitive data encrypted in the app

## 🚀 Step 7: Production Deployment

### 7.1 Build for Production

```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

### 7.2 Configure App Store/Play Store

1. Update app icons and metadata
2. Configure in-app purchases (for premium features)
3. Set up app signing
4. Submit for review

### 7.3 Backend Configuration

1. Switch Supabase to production mode
2. Enable email confirmations
3. Configure custom SMTP for emails
4. Set up monitoring and alerting

## 📈 Step 8: Monitoring and Analytics

### 8.1 Application Monitoring

Consider integrating:
- Crashlytics for crash reporting
- Analytics for user behavior
- Performance monitoring

### 8.2 Infrastructure Monitoring

1. Monitor Supabase usage and performance
2. Track NextDNS API usage
3. Set up alerts for service outages

## 🆘 Troubleshooting

### Common Issues

#### Supabase Connection Failed
- Verify URL and API key are correct
- Check network connectivity
- Ensure RLS policies are properly configured

#### NextDNS API Errors
- Verify API key is valid and has required permissions
- Check rate limiting
- Ensure configuration ID exists

#### Child Profile Creation Fails
- Check if NextDNS config creation succeeded
- Verify parent has proper permissions
- Look at Supabase logs for database errors

#### Device Setup Not Working
- Verify DNS servers are correctly configured
- Test with a simple blocked domain
- Check if device has DNS over HTTPS enabled

### Support Resources

- Supabase Documentation: https://supabase.com/docs
- NextDNS Help Center: https://help.nextdns.io
- React Native Troubleshooting: https://reactnative.dev/docs/troubleshooting

## 🔄 Updates and Maintenance

### Regular Tasks

1. **Weekly**: Review user feedback and crash reports
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and update content filtering rules
4. **Annually**: Security audit and compliance review

### Feature Updates

When adding new features:
1. Update database schema if needed
2. Add appropriate RLS policies
3. Update API integrations
4. Test thoroughly before deployment

## 📝 Additional Configuration

### Child App Configuration

For the child-side app, you may want to:
1. Create a simplified UI
2. Limit available features
3. Add device management profiles
4. Implement location tracking

### Advanced Features

Consider implementing:
1. **Push Notifications**: For alerts and reminders
2. **Offline Sync**: Cache important data locally
3. **Multi-language Support**: Internationalization
4. **Advanced Analytics**: Custom dashboards and insights

## 🎯 Next Steps

After completing the basic setup:

1. **User Testing**: Get feedback from real families
2. **Performance Optimization**: Monitor and improve app performance
3. **Feature Expansion**: Add requested features
4. **Compliance**: Ensure COPPA and GDPR compliance
5. **Marketing**: Prepare for app store launch

---

**Important Notes:**

- Always test thoroughly in a development environment first
- Keep all API keys and credentials secure
- Follow platform-specific guidelines for family apps
- Ensure compliance with children's privacy laws
- Consider hiring security experts for production deployments

This setup provides a solid foundation for the iParental app with real cloud services integration. The modular architecture allows for easy scaling and feature additions as your user base grows.
