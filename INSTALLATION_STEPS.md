# 📦 Installation Steps for Visitor Approval System

## ⚠️ Important: Run These Commands Manually

There was an npm authentication issue. Please run these commands manually in your terminal:

```bash
cd /Users/saprem.shah/src/github.com/saprem/community-connect-app

# Install required packages
npx expo install expo-notifications expo-camera expo-image-picker

# If you get authentication errors, try:
npm config delete email
npm config delete _auth

# Then retry:
npx expo install expo-notifications expo-camera expo-image-picker
```

## 📋 What These Packages Do

1. **expo-notifications** - Push notifications for visitor approvals
2. **expo-camera** - Take visitor photos at security gate
3. **expo-image-picker** - Alternative to camera (select from gallery)

## ✅ After Installation

Once packages are installed, restart Expo:

```bash
npx expo start --clear
```

Then the new features will be available!
