# Firebase Setup Guide for Community Connect App

This guide will help you set up Firebase for your Community Connect app with Authentication, Firestore Database, and Storage.

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Click "Add project" or "Create a project"

2. **Enter Project Details**
   - Project name: `community-connect` (or your preferred name)
   - Click "Continue"

3. **Google Analytics** (Optional)
   - You can enable or disable Google Analytics
   - Click "Create project"
   - Wait for project creation (takes ~30 seconds)
   - Click "Continue" when done

---

## Step 2: Register Your App

1. **Add an App to Your Project**
   - In the Firebase Console, click the **Web icon** `</>`
   - App nickname: `Community Connect Web`
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

2. **Copy Firebase Configuration**
   - You'll see a code snippet that looks like this:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "community-connect-xxxxx.firebaseapp.com",
     projectId: "community-connect-xxxxx",
     storageBucket: "community-connect-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdefghijklmnop"
   };
   ```

   - **Copy this entire object** - you'll need it in Step 5

3. **Click "Continue to console"**

---

## Step 3: Enable Authentication Methods

### 3.1 Enable Phone Authentication (OTP)

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"** (if first time)
3. Go to **"Sign-in method"** tab
4. Click on **"Phone"**
5. Toggle the **Enable** switch
6. Click **"Save"**

**Important for Phone Auth:**
- For testing, add test phone numbers:
  - Click "Phone" again
  - Scroll to "Phone numbers for testing"
  - Add: `+91 1234567890` with code `123456`
  - This allows testing without real SMS

### 3.2 Enable Email/Password Authentication

1. In **"Sign-in method"** tab
2. Click on **"Email/Password"**
3. Toggle **Enable** for "Email/Password"
4. (Optional) Enable "Email link" if you want passwordless
5. Click **"Save"**

### 3.3 Enable Google Authentication

1. In **"Sign-in method"** tab
2. Click on **"Google"**
3. Toggle the **Enable** switch
4. Enter **Project support email**: your-email@example.com
5. Click **"Save"**

**For React Native (Expo):**
- Google Sign-In requires additional setup with OAuth Client IDs
- For now, we'll use the web configuration
- Full native setup requires Android/iOS OAuth credentials

---

## Step 4: Set Up Firestore Database

1. In Firebase Console, click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. **Choose Location:**
   - Select **Production mode** (we'll add rules later)
   - Choose location closest to your users (e.g., `asia-south1` for India)
   - Click **"Enable"**

4. **Set Up Security Rules:**
   - Go to **"Rules"** tab
   - Replace default rules with:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow authenticated users to read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }

       // Allow authenticated users to read community data
       match /communities/{communityId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }

       // Visitors - accessible by user and security
       match /visitors/{visitorId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update: if request.auth != null &&
           (resource.data.hostUserId == request.auth.uid ||
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'security');
       }

       // Daily Help - accessible by all authenticated users
       match /helpers/{helperId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. Click **"Publish"**

---

## Step 5: Set Up Storage (for profile pictures, documents)

1. In Firebase Console, click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Review security rules (we'll customize later)
4. Click **"Next"**
5. Choose same location as Firestore
6. Click **"Done"**

7. **Set Storage Rules:**
   - Go to **"Rules"** tab
   - Replace with:

   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/{allPaths=**} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }

       match /helpers/{helperId}/{allPaths=**} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```

8. Click **"Publish"**

---

## Step 6: Update Your App Configuration

1. **Open the file:** `services/firebase.config.ts`

2. **Replace the placeholder config** with your actual Firebase config from Step 2:

   ```typescript
   // Firebase Configuration
   export const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY_HERE",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123def456"
   };

   // Uncomment these imports
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const app = initializeApp(firebaseConfig);

   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);

   export default app;
   ```

3. **Remove the mock exports** at the bottom:
   ```typescript
   // DELETE THESE LINES:
   // export const auth = null;
   // export const db = null;
   // export const storage = null;
   ```

---

## Step 7: Update AuthContext to Use Real Firebase

After adding Firebase credentials, update `contexts/AuthContext.tsx`:

```typescript
import {
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase.config';

// In signInWithPhone:
const appVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
// Store confirmationResult for OTP verification

// In verifyOTP:
const result = await confirmationResult.confirm(otp);
const user = result.user;

// In signInWithGoogle:
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const user = result.user;

// In signInWithEmail:
const result = await signInWithEmailAndPassword(auth, email, password);
const user = result.user;

// In signUp:
const result = await createUserWithEmailAndPassword(auth, email, password);
await setDoc(doc(db, 'users', result.user.uid), {
  email, phone, createdAt: new Date()
});
```

---

## Step 8: Test Your Setup

1. **Restart your Expo server:**
   ```bash
   npx expo start --clear
   ```

2. **Test Authentication:**
   - Try phone OTP with test number: +91 1234567890, OTP: 123456
   - Try email sign up with any email
   - Try Google sign-in

3. **Check Firebase Console:**
   - Go to **Authentication** → **Users** tab
   - You should see new users appearing after successful sign-ups

---

## Important Notes

### Security Considerations:

1. **Never commit Firebase credentials to public repositories**
   - Add `.env` file to `.gitignore`
   - Use environment variables for sensitive data

2. **API Key Exposure:**
   - Firebase API keys are safe to expose in client code
   - They're restricted by Firebase Security Rules
   - Rules protect your data, not the API key

3. **Security Rules:**
   - The rules provided are basic
   - Review and tighten them for production
   - Test rules in Firebase Console before deploying

### For Production:

1. **Enable App Check** (prevents abuse)
2. **Set up billing** (Firebase free tier has limits)
3. **Configure authorized domains** (in Authentication settings)
4. **Set up email templates** (for password reset, verification)
5. **Enable monitoring** (in Firebase Console)

### Cost Expectations (Free Tier):

- **Authentication:** 10,000 phone verifications/month (₹0.01/SMS after)
- **Firestore:** 1GB storage, 50K reads, 20K writes/day
- **Storage:** 5GB storage, 1GB/day downloads
- **Enough for 100-500 active users initially**

---

## Quick Reference

**Firebase Console:** https://console.firebase.google.com
**Documentation:** https://firebase.google.com/docs
**Pricing:** https://firebase.google.com/pricing

**Project Settings:**
- Firebase Console → Project Settings (gear icon) → Your apps

**Where to find things:**
- API Keys: Project Settings → General
- Auth Settings: Authentication → Settings
- Database Rules: Firestore Database → Rules
- Storage Rules: Storage → Rules

---

## Troubleshooting

### "Firebase app not initialized"
- Check if firebase.config.ts has correct imports uncommented
- Ensure initializeApp() is called

### Phone Auth not working
- Add test phone numbers in Firebase Console
- Check reCAPTCHA is properly configured (for web)

### "Permission denied" errors
- Check Firestore/Storage security rules
- Verify user is authenticated
- Check userId matches in rules

### Google Sign-In fails
- Verify Google is enabled in Firebase Console
- Check authorized domains in Authentication settings
- For mobile: Add SHA-1/SHA-256 keys (Android) or OAuth client ID (iOS)

---

## Need Help?

- Firebase Support: https://firebase.google.com/support
- Community Forums: https://stackoverflow.com/questions/tagged/firebase
- Expo Firebase Docs: https://docs.expo.dev/guides/using-firebase/

---

**Ready to go live?** Once you add your Firebase credentials and test authentication, your app will have a fully functional backend! 🚀
