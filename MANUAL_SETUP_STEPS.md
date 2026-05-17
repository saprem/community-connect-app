# 📝 Manual Setup Steps for Firebase Integration

Everything has been prepared for you! Just follow these **3 simple steps** to connect your app to Firebase.

---

## ✅ What's Already Done (Automated)

I've completed all the code setup for you:
- ✅ Firebase configuration with environment variables support
- ✅ Authentication helpers (Email, Phone, Google)
- ✅ Firestore database helpers (Users, Visitors, Helpers, Payments)
- ✅ AuthContext updated to use real Firebase when configured
- ✅ Fallback to mock mode when Firebase isn't configured
- ✅ All screens ready for real authentication

**The app works in mock mode right now, so you can test it immediately!**

---

## 📋 What You Need to Do Manually (3 Steps)

### **Step 1: Create Firebase Project** (5 minutes)

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Click **"Add project"**
3. Enter project name: `community-connect` (or your choice)
4. Click **"Continue"** → **"Continue"** → **"Create project"**
5. Wait 30 seconds, then click **"Continue"**

---

### **Step 2: Register Your App & Get Credentials** (2 minutes)

1. In Firebase Console, click the **Web icon** `</>`
2. App nickname: `Community Connect`
3. Click **"Register app"**
4. You'll see code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "community-connect-xxxxx.firebaseapp.com",
  projectId: "community-connect-xxxxx",
  storageBucket: "community-connect-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

5. **COPY ALL 6 VALUES** from your screen

---

### **Step 3: Add Credentials to Your App** (1 minute)

**Option A: Using .env file (Recommended)**

1. In your project folder, create a file named `.env` (no extension)
2. Paste this template and fill in YOUR values:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=community-connect-xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=community-connect-xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=community-connect-xxxxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

3. Save the file
4. Restart Expo: `npx expo start --clear`

**Option B: Direct in code (Quick test)**

1. Open `services/firebase.config.ts`
2. Replace the values in `firebaseConfig` object:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE",  // Paste here
  authDomain: "your-project.firebaseapp.com",  // Paste here
  projectId: "your-project-id",  // Paste here
  storageBucket: "your-project.appspot.com",  // Paste here
  messagingSenderId: "123456789012",  // Paste here
  appId: "1:123456789012:web:abc123"  // Paste here
};
```

3. Save and restart Expo

---

## 🔥 Enable Firebase Services (5 minutes)

After adding credentials, enable these Firebase features:

### **A. Enable Email Authentication**

1. In Firebase Console, click **"Authentication"** in sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"**
6. Click **"Save"**

### **B. Enable Google Authentication**

1. In **"Sign-in method"** tab
2. Click **"Google"**
3. Toggle **"Enable"**
4. Enter your email in "Project support email"
5. Click **"Save"**

### **C. Enable Phone Authentication (Optional)**

1. In **"Sign-in method"** tab
2. Click **"Phone"**
3. Toggle **"Enable"**
4. Click **"Save"**

**For testing without SMS:**
- Scroll to "Phone numbers for testing"
- Add test number: `+91 1234567890` with code: `123456`
- This lets you test without real SMS

### **D. Create Firestore Database**

1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select location: **asia-south1** (India) or closest to you
5. Click **"Enable"**

6. **Set Security Rules:**
   - Go to **"Rules"** tab
   - Click **"Edit rules"**
   - Replace ALL content with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // All authenticated users can read/create visitors
    match /visitors/{visitorId} {
      allow read, create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.hostUserId == request.auth.uid;
    }

    // All authenticated users can read/write helpers
    match /helpers/{helperId} {
      allow read, write: if request.auth != null;
    }

    // Users can read/write their own payments
    match /payments/{paymentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

7. Click **"Publish"**

---

## ✅ Test Your Setup (2 minutes)

1. **Restart Expo completely:**
   ```bash
   # Stop the current server (Ctrl+C)
   cd /Users/saprem.shah/src/github.com/saprem/community-connect-app
   npx expo start --clear
   ```

2. **Check the terminal for:**
   ```
   ✅ Firebase initialized successfully
   ```
   (If you see "⚠️ Firebase not configured", check your .env or firebase.config.ts)

3. **Test Authentication:**
   - Open the app on your phone
   - Try **Email Sign Up**:
     - Email: test@example.com
     - Password: password123
     - Phone: 1234567890
   - You should see "Account created!" message

4. **Verify in Firebase Console:**
   - Go to **Authentication** → **Users** tab
   - You should see your test user listed!

---

## 🎉 You're Done!

Once you see "✅ Firebase initialized successfully" and can create an account, everything is working!

### What Works Now:

- ✅ Real email/password authentication
- ✅ Real Google Sign-In
- ✅ User data stored in Firestore
- ✅ Session persistence (stays logged in)
- ✅ Profile updates synced to cloud
- ✅ Ready for production!

### What's Still Mock Mode:

- ⚠️ Phone OTP (requires additional Expo config + reCAPTCHA)
- ⚠️ Visitor/Helper data (will be real once you add them)
- ⚠️ Payments (will be real once you add them)

Phone OTP requires extra setup for React Native. For now, use Email or Google authentication!

---

## 🆘 Troubleshooting

### "Firebase not initialized" in terminal
- Check your `.env` file exists and has correct values
- Make sure values don't have quotes: `EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...` not `"AIzaSy..."`
- Restart Expo with `--clear` flag

### "Invalid API key" error
- Double-check you copied the ENTIRE API key from Firebase Console
- Make sure there are no extra spaces
- Try Option B (paste directly in firebase.config.ts)

### "Permission denied" in Firestore
- Make sure you clicked "Publish" after pasting security rules
- Check the Rules tab shows the new rules (not default)

### Sign-up works but profile not saving
- Check Firestore Database is created and enabled
- Verify security rules are published
- Check Firebase Console → Firestore → Data (you should see collections appearing)

### Can't see my data in Firestore
- Go to Firebase Console → Firestore Database → Data tab
- Click on "users" collection
- You should see documents with your user IDs

---

## 📊 Monitoring Your App

**Check Usage:**
- Firebase Console → Usage and billing
- See how many users, reads, writes you're using
- Free tier is generous for small communities (100-500 users)

**View Users:**
- Firebase Console → Authentication → Users
- See all registered users
- Can manually disable/delete users if needed

**View Data:**
- Firebase Console → Firestore Database → Data
- Browse all collections and documents
- Can manually edit/delete data if needed

---

## 🔐 Security Notes

✅ **Safe to commit:**
- `.env.example` (template with no real values)
- `firebase.config.ts` (already in your code)

❌ **NEVER commit:**
- `.env` (contains your real credentials)
- Already added to `.gitignore` for safety

🔒 **Your API keys are safe:**
- Firebase API keys can be public (they're not secret)
- Security comes from Firestore Rules (not API key)
- Rules prevent unauthorized data access

---

## 📚 Next Steps (Optional)

Once basic auth works, you can:

1. **Add Phone OTP** (requires Expo config + reCAPTCHA)
2. **Deploy to App Store/Play Store** (requires Expo EAS)
3. **Add Firebase Storage** (for profile pictures)
4. **Add Firebase Cloud Messaging** (for push notifications)
5. **Add Firebase Analytics** (track app usage)

But for now, **email authentication is perfect for testing and development!**

---

## 🚀 Quick Reference

**Firebase Console:** https://console.firebase.google.com
**Your project:** Click "community-connect" (or your project name)

**Key locations:**
- Authentication settings: Authentication → Settings
- Database rules: Firestore Database → Rules
- User list: Authentication → Users
- Data browser: Firestore Database → Data

**Need to change something?**
- Update `.env` file
- Or update `services/firebase.config.ts`
- Then restart Expo with `--clear` flag

---

**Questions? The app logs helpful messages to the console. Look for:**
- ✅ Green checkmarks = Success
- ⚠️ Yellow warnings = Configuration needed
- ❌ Red errors = Something went wrong (check troubleshooting)

**You're all set! Start testing your app with real authentication!** 🎉
