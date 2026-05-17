# 🔥 Firebase Setup - Visual Step-by-Step Guide

## Question 1: Which Database?

**Answer: Firestore ✅**

When you see these options:
```
PostgreSQL (SQL Connect)
Firestore (NoSQL)
Realtime Database (NoSQL)
Storage (Object storage)
```

**Click on "Firestore"** - It will show "Firestore Database" or just say "NoSQL Firestore"

---

## Question 2: Where is the Rules Tab?

**The Rules tab appears AFTER you create the database. Follow this exact sequence:**

---

## 📋 Complete Step-by-Step Process

### **Step 1: Go to Firebase Console**

Link: https://console.firebase.google.com/project/community-connect-8fcf8

You should see your project dashboard.

---

### **Step 2: Enable Authentication First**

1. **Look at the left sidebar** (might be collapsed)
2. **Click "Build"** to expand it (if collapsed)
3. **Click "Authentication"**
4. **Click the blue "Get started" button** in the center

Now you're in the Authentication section.

5. **Click "Sign-in method" tab** at the top (next to "Users" tab)

You'll see a list of providers:
- Email/Password
- Google
- Phone
- Apple
- etc.

6. **Click on "Email/Password"** row
7. You'll see a toggle switch - **Turn it ON** (should turn blue)
8. **Click "Save"** button

✅ Email authentication enabled!

9. **Click on "Google"** row (same list)
10. **Turn the toggle ON**
11. **Select your email** from the "Project support email" dropdown
12. **Click "Save"**

✅ Google authentication enabled!

---

### **Step 3: Create Firestore Database**

1. **Go back to left sidebar**
2. **Click "Firestore Database"** (under "Build" section)
3. You'll see a page that says "Cloud Firestore" with a **"Create database" button**
4. **Click "Create database"**

A modal/dialog will appear with 2 steps:

**Dialog Step 1: Secure rules**
- You'll see two options:
  - "Start in production mode" (recommended)
  - "Start in test mode"
- **Select "Start in production mode"** (radio button)
- **Click "Next"** button

**Dialog Step 2: Location**
- You'll see a dropdown to choose location
- **Select "asia-south1 (Mumbai)"** (best for India)
- **Click "Enable"** button

Now wait 30-60 seconds. You'll see a loading animation.

---

### **Step 4: Rules Tab Appears NOW**

After the database is created, you'll see the Firestore Database page with:

**Top Navigation Tabs:**
```
Data | Rules | Indexes | Usage
```

**Click the "Rules" tab** (second tab)

---

### **Step 5: Add Security Rules**

You'll see a code editor with default rules that look like:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Do this:**
1. **Click in the editor and press Ctrl+A** (or Cmd+A on Mac) to select all
2. **Press Delete** to remove everything
3. **Paste this code:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Visitors - user can manage their own visitors
    match /visitors/{visitorId} {
      allow read, create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.hostUserId == request.auth.uid;
    }

    // Helpers - all authenticated users can access
    match /helpers/{helperId} {
      allow read, write: if request.auth != null;
    }

    // Payments - users can only see their own
    match /payments/{paymentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

4. **Click the blue "Publish" button** at the top right

You'll see a success message!

✅ Security rules configured!

---

## ✅ Verification Checklist

After completing all steps, verify:

**1. Check Authentication:**
- Go to: Build → Authentication
- Click "Sign-in method" tab
- You should see:
  - Email/Password: **Enabled** ✅ (blue badge)
  - Google: **Enabled** ✅ (blue badge)

**2. Check Firestore Database:**
- Go to: Build → Firestore Database
- You should see the "Data" tab (currently empty - that's normal)
- Click "Rules" tab
- You should see your custom rules (not the default ones)
- Should say "Published" with a timestamp

---

## 🚀 Now Restart Your App

```bash
# In terminal, stop Expo (Ctrl+C)
cd /Users/saprem.shah/src/github.com/saprem/community-connect-app
npx expo start --clear
```

**Look for this line in terminal:**
```
✅ Firebase initialized successfully
```

If you see that, you're ready to test!

---

## 📱 Test on Phone

1. **Scan QR code** in Expo Go
2. Tap **"Get Started"**
3. Scroll down and tap **"Sign in with Email"**
4. Tap **"Sign Up"** toggle
5. Create account:
   - Email: `your.email@gmail.com`
   - Phone: `9876543210`
   - Password: `password123`
   - Confirm: `password123`
6. Tap **"Sign Up"**

**You should see:** "Account created! Please verify your email."

---

## 🎯 Verify It Worked

**Go back to Firebase Console:**

1. **Authentication → Users tab**
   - You should see your email in the list! ✅

2. **Firestore Database → Data tab**
   - You should see a "users" collection
   - Click it → You'll see a document with your user data! ✅

---

## 🆘 Troubleshooting

### "I don't see Firestore Database in sidebar"
- Click "Build" in the sidebar to expand it
- Firestore Database is under "Build" section

### "I don't see the Rules tab"
- The Rules tab only appears AFTER you create the database
- Make sure you clicked "Enable" and waited for creation to complete
- Try refreshing the page

### "When I click Publish, nothing happens"
- Make sure you selected ALL the old text and deleted it
- Make sure you pasted the new rules correctly
- Try clicking Publish again

### "Terminal still shows 'Firebase not configured'"
- Make sure you restarted with `--clear` flag
- Check that .env file exists: `ls -la .env`
- Try: `npx expo start --clear` again

---

## 📊 What Each Service Does

**Authentication:**
- Handles user sign up, login, logout
- Stores email, password securely
- Manages sessions
- Provides user ID

**Firestore Database:**
- Stores all your app data (users, visitors, helpers, payments)
- Like tables in a database
- Syncs in real-time
- Works offline

**Security Rules:**
- Controls who can read/write data
- Prevents unauthorized access
- Like permissions/guards

**Storage (NOT NEEDED YET):**
- For uploading files (profile pictures, documents)
- We'll add this later if needed

---

## 🎉 Summary

1. ✅ Choose **Firestore** (not PostgreSQL or others)
2. ✅ Create the database first
3. ✅ Rules tab appears AFTER database is created
4. ✅ Paste the security rules
5. ✅ Click Publish
6. ✅ Restart Expo
7. ✅ Test!

**Total time: 10 minutes**

---

**If you're stuck on any step, tell me exactly what you see on screen and I'll guide you!**
