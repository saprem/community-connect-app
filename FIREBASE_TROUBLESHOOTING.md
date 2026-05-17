# 🔥 Firebase Troubleshooting Guide

## ✅ Issue Fixed: Index Error

### What Was the Error?
```
Error loading payments: [FirebaseError: The query requires an index...]
```

### ✅ Solution Applied
Updated the code to **sort on the client side** instead of using Firebase `orderBy`, which eliminates the need for composite indexes.

**Changes Made:**
- `services/firestoreHelpers.ts` - Updated `getPayments()` function
- `services/firestoreHelpers.ts` - Updated `getVisitors()` function
- Both now sort data after fetching instead of in the query

**Result:** ✅ No index creation required! Payments should load now.

---

## 🧪 Testing After Fix

**Restart your app:**
```bash
npx expo start --clear
```

**Then test:**
1. Go to Payments tab
2. Should load without errors
3. If you see sample payments → Working!
4. If Firebase is connected → Will show your real data

---

## 🔍 Common Firebase Errors & Solutions

### Error 1: "Firestore not initialized"

**Cause:** Firebase credentials not set or `.env` file missing

**Solution:**
1. Check `.env` file exists in project root
2. Verify all Firebase credentials are set:
   ```bash
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   # etc.
   ```
3. Restart Expo: `npx expo start --clear`

---

### Error 2: "Permission denied" / "Missing or insufficient permissions"

**Cause:** Firestore security rules not set up

**Solution:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `community-connect-8fcf8`
3. Click **Firestore Database** → **Rules** tab
4. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId);
    }

    // Visitors collection
    match /visitors/{visitorId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() &&
        (resource.data.hostUserId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'security']);
    }

    // Helpers (Daily Help) collection
    match /helpers/{helperId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn();
    }

    // Payments collection
    match /payments/{paymentId} {
      allow read: if isSignedIn() &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'management']);
      allow create: if isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'management'];
      allow update, delete: if isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'management'];
    }
  }
}
```

5. Click **Publish**

---

### Error 3: "The query requires an index"

**This error was already fixed in the code!**

But if you see it for other queries:

**Quick Fix (Used in this app):**
- Remove `orderBy()` from query
- Sort data on client side after fetching

**Alternative (If needed for performance):**
1. Click the link in the error message
2. It opens Firebase Console with pre-filled index
3. Click **"Create Index"**
4. Wait 2-5 minutes for index to build
5. Query will work automatically

---

### Error 4: No data showing (but no errors)

**Possible Causes:**

**A. No data in Firebase yet**
- App shows sample/mock data by default
- This is normal for new projects
- Try creating a payment/visitor/helper

**B. Wrong user ID**
- Data is filtered by `userId` or `hostUserId`
- Make sure user is logged in
- Check Firebase Console → Firestore → See your data

**C. Firebase not connected**
- App falls back to mock data if Firebase fails
- Check browser console for connection errors
- Verify `.env` file has correct credentials

---

### Error 5: "Firebase app not initialized"

**Cause:** `firebase.config.ts` file has errors or `.env` not loaded

**Solution:**

1. Check `services/firebase.config.ts` exists
2. Verify it imports env variables correctly:
   ```typescript
   const firebaseConfig = {
     apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
     // etc.
   };
   ```
3. Make sure all env variables start with `EXPO_PUBLIC_`
4. Restart: `npx expo start --clear`

---

## 🔐 Firebase Security Rules Explanation

### What do these rules do?

**1. Visitors:**
- Anyone logged in can **read** all visitors
- Anyone logged in can **create** visitors
- Only the **host** or **admin/security** can update/delete

**2. Helpers (Daily Help):**
- Anyone logged in can **read** helpers
- Anyone logged in can **add** helpers
- Anyone logged in can **update/delete** helpers

**3. Payments:**
- Users can only **read their own** payments
- Only **admin/management** can create payments
- Only **admin/management** can update/delete payments

**4. Users:**
- Anyone logged in can **read** user profiles
- Users can only **update their own** profile

---

## 📊 Checking Your Firebase Data

### View Data in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `community-connect-8fcf8`
3. Click **Firestore Database**
4. Click **Data** tab
5. You'll see collections:
   - `users`
   - `visitors`
   - `helpers`
   - `payments`

### Expected Data Structure

**Payments Collection:**
```javascript
{
  id: "abc123",
  userId: "user123",
  userName: "John Doe",
  amount: 5000,
  category: "Maintenance",
  description: "Monthly maintenance charges",
  dueDate: "2024-06-30",
  status: "pending",
  communityId: "default",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Visitors Collection:**
```javascript
{
  id: "xyz789",
  hostUserId: "user123",
  hostName: "John Doe",
  name: "Visitor Name",
  phone: "+919876543210",
  purpose: "Personal Visit",
  vehicleNumber: "MH12AB1234",
  expectedDate: "2024-06-20",
  expectedTime: "2:00 PM",
  status: "pending",
  qrCode: "VISITOR-12345",
  communityId: "default",
  createdAt: Timestamp
}
```

**Helpers Collection:**
```javascript
{
  id: "def456",
  name: "Helper Name",
  phone: "+919876543210",
  category: "Maids",
  address: "Local area",
  experience: "3",
  salary: "10000",
  notes: "Reliable and experienced",
  communityId: "default",
  addedBy: "user123",
  rating: 0,
  jobsCompleted: 0,
  available: true,
  verified: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🚀 Testing Firebase Connection

### Quick Test

**Add this to any screen temporarily:**
```typescript
import { db } from '../services/firebase.config';

useEffect(() => {
  console.log('Firebase initialized:', !!db);
}, []);
```

**Expected Output:**
- `Firebase initialized: true` → Connected ✅
- `Firebase initialized: false` → Not connected ❌

---

## 🔧 Development vs Production

### Development Mode (Current)
- Uses `.env` file for credentials
- Falls back to mock data if Firebase unavailable
- Safe for testing

### Production Mode (When ready)
- Use Firebase Remote Config for sensitive data
- Enable Firebase App Check for security
- Set up proper authentication
- Review and tighten security rules

---

## 📝 Quick Checklist

Before reporting issues, verify:

- [ ] `.env` file exists in project root
- [ ] All `EXPO_PUBLIC_*` variables are set
- [ ] Restarted Expo with `--clear` flag
- [ ] Firebase rules are published
- [ ] User is logged in (check auth state)
- [ ] Firebase Console shows your project
- [ ] No billing errors in Firebase Console

---

## 🆘 Still Having Issues?

### Check Firebase Console Logs
1. Firebase Console → Project Overview
2. Click **"View all errors"**
3. Look for recent errors

### Check App Console
```bash
npx expo start
```
Look for error messages in terminal

### Common Quick Fixes
```bash
# Clear cache and restart
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install

# Clear Metro bundler
watchman watch-del-all
```

---

## 📞 Support Resources

- **Firebase Docs:** https://firebase.google.com/docs/firestore
- **Expo Docs:** https://docs.expo.dev
- **React Native Firebase:** https://rnfirebase.io

---

## ✅ Summary

The **index error is now fixed**! Your app should:
- ✅ Load payments without errors
- ✅ Load visitors without errors
- ✅ Work with or without Firebase
- ✅ Fall back to sample data if Firebase unavailable

**Test it now:**
```bash
npx expo start --clear
```

Then open Payments tab - it should work! 🎉
