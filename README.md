# iParental - Family Digital Wellbeing App

A comprehensive family-oriented digital wellbeing app with robust parental controls to manage and monitor children's device usage.

## 🚀 Features

### ✅ Completed
- **Modern Dark UI**: Beautiful dark theme with purple (#8B5CF6) and blue (#0EA5E9) accents
- **Authentication System**: Secure parent login with biometric support and child profile management
- **Interactive Dashboard**: Real-time overview of family digital activity with animated charts
- **Cross-platform**: Built with React Native for iOS and Android

### 🔄 In Development
- **Screen Time Management**: Daily limits, scheduling, and time banking
- **App Management**: Block/allow apps with time-based controls
- **Content Filtering**: Age-appropriate web filtering with custom rules
- **Location Tracking**: Real-time GPS with geofencing and safety alerts
- **Task Manager**: Assign tasks with rewards and completion tracking
- **Analytics & Reporting**: Detailed insights and weekly reports

## 🛠 Tech Stack

- **Frontend**: React Native 0.72.6 with TypeScript
- **State Management**: Zustand with persistence
- **Navigation**: React Navigation 6
- **Authentication**: React Native Biometrics + Keychain
- **Charts**: React Native Chart Kit
- **UI Components**: Custom component library
- **Icons**: React Native Vector Icons (Ionicons)
- **Styling**: StyleSheet with theme system

## 📱 Installation

### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- CocoaPods (for iOS)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iparental
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Android Setup**
   - Open Android Studio
   - Open the `android` folder
   - Let Gradle sync

### Running the App

**iOS**
```bash
npm run ios
```

**Android**
```bash
npm run android
```

**Start Metro Bundler**
```bash
npm start
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── dashboard/      # Dashboard-specific components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── dashboard/     # Dashboard screens
│   └── ...            # Other feature screens
├── navigation/         # Navigation configuration
├── services/          # API and external services
├── store/             # State management (Zustand)
├── types/             # TypeScript type definitions
├── theme/             # Theme configuration
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── assets/            # Images, fonts, etc.
```

## 🎨 Design System

### Colors
- **Primary**: #8B5CF6 (Purple)
- **Secondary**: #0EA5E9 (Blue)
- **Background**: Dark theme with multiple shades
- **Status**: Success (#10B981), Warning (#F59E0B), Error (#EF4444)

### Typography
- **Font Family**: System fonts
- **Sizes**: xs (12px) to 5xl (48px)
- **Weights**: Light to ExtraBold

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Gradient backgrounds with shadows
- **Charts**: Interactive with smooth animations

## 🔐 Security Features

- **Biometric Authentication**: Face ID, Touch ID, Fingerprint
- **Secure Storage**: Keychain for sensitive data
- **End-to-end Encryption**: All communications encrypted
- **COPPA & GDPR Compliant**: Privacy-by-design approach

## 📊 Features Roadmap

### Phase 1 (Completed)
- ✅ Project setup and structure
- ✅ Authentication system
- ✅ Dark theme implementation
- ✅ Dashboard with real-time overview

### Phase 2 (Next)
- 🔄 Screen time management
- 🔄 App blocking and control
- 🔄 Content filtering system

### Phase 3
- 📅 Location tracking and geofencing
- 📅 Task management and rewards
- 📅 Advanced analytics

### Phase 4
- 📅 Premium features
- 📅 Cross-platform sync
- 📅 Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Developer**: Neo Technologies

## 📞 Support

For support and questions, please contact:
- Email: support@neotechnologies.com
- Website: [iParental App](https://iparental.app)

---

**iParental** - Protecting families in the digital age 🛡️
