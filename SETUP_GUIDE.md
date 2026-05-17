# Community Connect - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
```bash
# Check if you have Node.js installed (v16+)
node --version

# Check if you have npm installed
npm --version

# Install Expo CLI globally
npm install -g expo-cli
```

### Step 1: Initialize Project
```bash
# Navigate to project directory
cd community-connect-app

# Create Expo app with TypeScript template
npx create-expo-app@latest . --template expo-template-blank-typescript

# Or if directory is not empty:
npx create-expo-app@latest community-connect --template expo-template-blank-typescript
```

### Step 2: Install Dependencies
```bash
# Core dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-paper react-native-vector-icons
npm install @react-native-async-storage/async-storage
npm install react-hook-form
npm install date-fns

# Expo specific
npx expo install expo-camera expo-image-picker expo-notifications
npx expo install expo-barcode-scanner expo-local-authentication
npx expo install expo-document-picker expo-file-system

# Firebase
npm install firebase
npm install @react-native-firebase/app @react-native-firebase/auth
npm install @react-native-firebase/firestore @react-native-firebase/storage
npm install @react-native-firebase/messaging

# Additional utilities
npm install axios react-native-qrcode-svg
npm install react-native-paper-dates
```

### Step 3: Run the App
```bash
# Start Expo development server
npx expo start

# Scan QR code with Expo Go app on your phone
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

## 📱 Testing on Physical Device

### Android
1. Install **Expo Go** from Play Store
2. Scan QR code from terminal
3. App loads instantly!

### iOS
1. Install **Expo Go** from App Store
2. Scan QR code from Camera app or terminal
3. App loads instantly!

## 🔥 Firebase Setup (Free Backend)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Name it: `community-connect`
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Register Your App
1. In Firebase console, click iOS/Android icon
2. Register app with package name: `com.yourname.communityconnect`
3. Download `google-services.json` (Android) or `GoogleService-Info.plist` (iOS)
4. Place in project root

### Step 3: Enable Services

#### Authentication
1. Go to Authentication → Sign-in method
2. Enable:
   - Email/Password
   - Phone (for OTP)
   - Google (optional)

#### Firestore Database
1. Go to Firestore Database
2. Click "Create Database"
3. Start in **Test Mode** (change later)
4. Choose location closest to your users

#### Storage
1. Go to Storage
2. Click "Get Started"
3. Start in **Test Mode**

#### Cloud Messaging (Push Notifications)
1. Go to Cloud Messaging
2. Note down Server Key
3. Will use for push notifications

### Step 4: Configure Firebase in App

Create `firebase.config.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## 🎨 Project Structure Created

```
community-connect-app/
├── app/                      # Main app directory
├── components/              # Reusable components
├── services/                # API services
├── contexts/                # State management
├── hooks/                   # Custom hooks
├── types/                   # TypeScript definitions
├── constants/               # App constants
├── utils/                   # Helper functions
├── assets/                  # Images, fonts
├── docs/                    # Documentation
└── README.md
```

## 🔐 Security Rules (Firestore)

Add these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Community members can read community data
    match /communities/{communityId} {
      allow read: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.communityId == communityId;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Visitors - allow read/write for community members
    match /visitors/{visitorId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.hostUserId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['security', 'admin']);
    }

    // Payments - users can read their own, admin can read all
    match /payments/{paymentId} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Community posts - all members can read, create
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.authorId == request.auth.uid;
    }
  }
}
```

## 📊 Initial Database Structure

### Seed Data Script

Create `scripts/seedData.ts`:
```typescript
import { db } from '../firebase.config';
import { collection, doc, setDoc } from 'firebase/firestore';

async function seedDatabase() {
  // Create sample community
  await setDoc(doc(db, 'communities', 'comm1'), {
    name: 'Green Valley Apartments',
    address: '123 Main St, Mumbai',
    totalFlats: 120,
    blocks: ['A', 'B', 'C', 'D'],
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Park'],
    createdAt: new Date()
  });

  // Create sample admin user
  await setDoc(doc(db, 'users', 'admin1'), {
    communityId: 'comm1',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@greenvalley.com',
    phone: '+91 98765 43210',
    block: 'A',
    flatNumber: '101',
    verified: true,
    createdAt: new Date()
  });

  console.log('Database seeded successfully!');
}

seedDatabase();
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests (after setting up Detox)
npm run test:e2e
```

## 📦 Building for Production

### Android APK
```bash
# Build APK
eas build -p android --profile preview

# Build AAB for Play Store
eas build -p android --profile production
```

### iOS IPA
```bash
# Build for TestFlight
eas build -p ios --profile production
```

## 🚀 Deployment Options

### 1. Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform all
```

### 2. Direct APK Distribution
- Build APK with Expo
- Share via link or Firebase App Distribution
- Users download and install directly

### 3. App Stores
- Google Play Store: $25 one-time fee
- Apple App Store: $99/year

## 🔧 Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- React Native Tools
- Firebase Explorer
- GitLens

### Useful Commands
```bash
# Clear Expo cache
npx expo start -c

# Reset Metro bundler
npm start -- --reset-cache

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## 📱 Design Resources

### Color Palette (Based on MyGate)
```typescript
export const Colors = {
  primary: '#0052CC',      // Trust Blue
  secondary: '#FFA500',    // Warm Orange
  success: '#00A86B',      // Confirmation Green
  danger: '#FF0000',       // Alert Red
  warning: '#FFC107',      // Warning Yellow
  info: '#00BCD4',         // Info Cyan
  background: '#F5F5F5',   // Light Gray
  surface: '#FFFFFF',      // White
  text: '#212121',         // Dark Gray
  textSecondary: '#757575' // Medium Gray
};
```

### Typography Scale
```typescript
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32
};
```

## 🐛 Troubleshooting

### Common Issues

**1. Metro bundler error**
```bash
watchman watch-del-all
rm -rf node_modules
npm install
npx expo start -c
```

**2. Firebase not connecting**
- Check `google-services.json` is in correct location
- Verify Firebase config in `firebase.config.ts`
- Ensure Firebase services are enabled in console

**3. Cannot find module errors**
```bash
npm install
npx expo install
```

**4. Android build fails**
- Update `android/build.gradle`
- Check Java version (should be 11+)
- Clear Gradle cache

## 📚 Learning Resources

- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Firebase Docs: https://firebase.google.com/docs
- React Navigation: https://reactnavigation.org/

## 💡 Pro Tips

1. **Use Expo Go** for rapid development
2. **Test on real devices** frequently
3. **Set up Git** from day one
4. **Use TypeScript** for type safety
5. **Implement offline** support early
6. **Add analytics** to track usage
7. **Regular backups** of Firebase data
8. **Monitor Firebase** usage to stay in free tier

## 🎯 Next Steps After Setup

1. ✅ Run `npx expo start` and verify app loads
2. ✅ Set up Firebase project
3. ✅ Create authentication flow
4. ✅ Build user profile screen
5. ✅ Implement visitor management
6. ✅ Add community features
7. ✅ Test with real users
8. ✅ Deploy MVP

---

**Estimated Setup Time**: 30-60 minutes
**Ready to code?** Follow the Quick Start section above!
