# 🚪 Visitor Approval System - Complete Implementation Guide

## 📋 Overview

This system implements a **MyGate-style visitor approval flow** with:
1. **Security Guard** enters visitor details with photo
2. **Resident** receives real-time notification for approval/rejection
3. **Visitor status** tracked (Pending → Approved/Rejected)
4. **Gate Entry** allowed only after approval

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Security App   │────────▶│  Firebase        │────────▶│  Resident App   │
│  (Add Visitor)  │         │  (Firestore +    │         │  (Notification) │
│  - Photo        │         │   FCM)           │         │  - Approve/     │
│  - Details      │         │                  │         │    Reject       │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │                            │
        └────────────────────────────┴────────────────────────────┘
                    Real-time Sync & Notifications
```

---

## 🔧 Required Setup

### **1. Install Required Packages**

```bash
cd /Users/saprem.shah/src/github.com/saprem/community-connect-app

# Expo Notifications
npx expo install expo-notifications

# Expo Camera for photo capture
npx expo install expo-camera

# Expo Image Picker (alternative to camera)
npx expo install expo-image-picker

# Firebase Cloud Messaging (already included in firebase)
npm install firebase
```

### **2. Configure Firebase Cloud Messaging (FCM)**

**A. Enable FCM in Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `community-connect-8fcf8`
3. Go to **Project Settings** → **Cloud Messaging**
4. Enable **Cloud Messaging API (Legacy)** if not enabled
5. Note down the **Server Key** (for backend, if needed)

**B. Configure app.json for Push Notifications:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "NSCameraUsageDescription": "Allow camera to take visitor photos",
        "NSPhotoLibraryUsageDescription": "Allow photo library access for visitor photos"
      }
    }
  }
}
```

### **3. Firebase Phone Auth Setup**

**Note:** Firebase Phone Auth requires:
- **Web:** reCAPTCHA verification (works in Expo)
- **Native:** APNs (iOS) or FCM (Android) - requires EAS Build or standalone app

**For Development:**
- Use test phone numbers in Firebase Console
- Or use email/password auth for testing

**To Add Test Phone Numbers:**
1. Firebase Console → Authentication → Sign-in method
2. Phone → Add test phone number
3. Add: `+91 9999999999` with code `123456`

---

## 📱 Implementation

### **File Structure**

```
app/
├── security/
│   ├── index.tsx              # Security dashboard
│   ├── add-visitor.tsx        # Add visitor with camera
│   └── visitor-list.tsx       # Security's visitor list
├── visitors/
│   ├── index.tsx              # Resident's visitor list (updated)
│   ├── [id].tsx               # Visitor detail (updated)
│   ├── add.tsx                # Pre-approve visitor (existing)
│   └── pending-approval.tsx   # Pending approvals screen
├── notifications/
│   └── NotificationHandler.tsx # Handle incoming notifications
services/
├── notifications.ts           # Push notification service
├── visitorService.ts          # Visitor CRUD with real-time
└── cameraService.ts           # Camera & photo handling
```

---

## 🔐 User Roles & Permissions

### **Security Role:**
- ✅ Add visitor entry with photo
- ✅ View all visitors for all residents
- ✅ Cannot approve/reject (only residents can)
- ✅ Mark visitor as "Exited" after they leave

### **Resident Role:**
- ✅ Receive notifications for visitor approvals
- ✅ Approve/Reject visitors
- ✅ Pre-approve visitors (existing feature)
- ✅ View their own visitors only

### **Admin Role:**
- ✅ All security permissions
- ✅ View all visitors across community
- ✅ Override approvals if needed

---

## 🚀 Implementation Steps

### **Step 1: Install Dependencies**

```bash
npx expo install expo-notifications expo-camera expo-image-picker
```

### **Step 2: Configure Firebase Firestore Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Visitors collection
    match /visitors/{visitorId} {
      // Security can create and update
      allow create: if isSignedIn() && isSecurity();

      // Resident (host) can read their own visitors and update status
      allow read: if isSignedIn() &&
        (resource.data.hostUserId == request.auth.uid || isSecurity() || isAdmin());

      allow update: if isSignedIn() &&
        (resource.data.hostUserId == request.auth.uid || isSecurity() || isAdmin());

      // Only admin can delete
      allow delete: if isAdmin();
    }

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isSecurity() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'security';
    }

    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### **Step 3: Update Visitor Data Model**

```typescript
interface Visitor {
  id: string;
  hostUserId: string;           // Resident's user ID
  hostName: string;             // Resident's name
  hostFlatNumber: string;       // e.g., "A-101"
  hostPhone: string;            // Resident's phone

  // Visitor details
  name: string;
  phone: string;
  purpose: string;
  vehicleNumber?: string;
  photoUrl?: string;            // Photo from camera

  // Entry details
  expectedDate: string;
  expectedTime: string;
  actualEntryTime?: string;     // When security adds them
  exitTime?: string;

  // Status tracking
  status: 'pending' | 'approved' | 'rejected' | 'entered' | 'exited';

  // Approval details
  approvedBy?: string;          // User ID of approver
  approvedAt?: string;
  rejectionReason?: string;

  // Metadata
  addedBy: string;              // 'resident' | 'security'
  securityUserId?: string;      // Security guard who added
  communityId: string;
  qrCode?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 📝 Code Implementation

I'll create the following files:

1. **Notification Service** (`services/notifications.ts`)
2. **Visitor Service with Real-time** (`services/visitorService.ts`)
3. **Camera Service** (`services/cameraService.ts`)
4. **Security Dashboard** (`app/security/index.tsx`)
5. **Add Visitor (Security)** (`app/security/add-visitor.tsx`)
6. **Pending Approvals (Resident)** (`app/visitors/pending-approval.tsx`)
7. **Updated Visitor List** (Update `app/visitors/index.tsx`)
8. **Notification Handler** (`app/notifications/NotificationHandler.tsx`)

---

## 🔔 Notification Flow

### **1. When Security Adds Visitor:**
```
Security App                Firebase                 Resident App
     │                          │                          │
     ├──(Add Visitor)──────────▶│                          │
     │                          ├──(Create Document)       │
     │                          ├──(Trigger FCM)          │
     │                          │                          │
     │                          ├─────(Push Notification)─▶│
     │                          │                          ├─(Show Alert)
     │                          │                          ├─(Open App)
     │                          │                          └─(Approve/Reject Screen)
```

### **2. When Resident Approves:**
```
Resident App               Firebase                 Security App
     │                          │                          │
     ├──(Approve)──────────────▶│                          │
     │                          ├──(Update Status)         │
     │                          ├──(Real-time Listener)───▶│
     │                          │                          ├─(Update UI)
     │                          │                          └─(Allow Entry)
```

---

## 🎨 UI Screens

### **Security Dashboard:**
- 📋 List of today's visitors
- ➕ Add Visitor button
- 🟢 Approved visitors (green)
- 🔴 Pending visitors (yellow)
- ⚫ Rejected visitors (red)
- 🚪 Mark as Entered/Exited

### **Add Visitor (Security):**
- 📸 Camera to take photo
- 📝 Visitor details form
- 🏠 Flat number selector
- 📞 Auto-fetch resident details
- ✅ Submit → Send notification

### **Pending Approvals (Resident):**
- 🔔 List of pending visitors
- 📷 Visitor photo
- ℹ️ Visitor details
- ✅ Approve button
- ❌ Reject button with reason

### **Visitor Detail:**
- Full visitor information
- Timeline of events
- Photo display
- Status badge
- Actions based on status

---

## 🧪 Testing Flow

### **As Security:**
1. Login with security role
2. Go to Security Dashboard
3. Click "Add Visitor"
4. Take photo or select from gallery
5. Enter visitor details
6. Select resident flat number
7. Submit → Notification sent

### **As Resident:**
1. Receive push notification
2. Tap notification → Opens app
3. See "Pending Approval" badge
4. Review visitor details & photo
5. Approve or Reject
6. Security receives real-time update

### **Gate Entry:**
1. Security sees "Approved" status
2. Allows entry
3. Marks as "Entered"
4. Visitor gets QR code (optional)

---

## 🚨 Important Notes

### **Phone Auth (Real OTP):**
- **Web/Expo Go:** Works with reCAPTCHA
- **Native:** Requires EAS Build or standalone build
- **Alternative:** Use Email/Password for testing

### **Push Notifications:**
- **Expo Go:** Works for testing
- **Production:** Need FCM server key
- **iOS:** Requires APNs certificate

### **Camera:**
- **Expo Go:** Works
- **Permissions:** Automatically requested
- **Fallback:** Image picker if camera unavailable

---

## 📦 Quick Start Commands

```bash
# Install dependencies
npx expo install expo-notifications expo-camera expo-image-picker

# Run with notifications enabled
npx expo start

# For testing notifications locally
npx expo start --dev-client
```

---

## 🔮 Future Enhancements

- [ ] QR code generation for approved visitors
- [ ] Face recognition for repeat visitors
- [ ] Visitor history & analytics
- [ ] Bulk visitor approval
- [ ] Scheduled visitor entry times
- [ ] Emergency contact notification
- [ ] Integration with gate automation
- [ ] SMS fallback if app not installed

---

## ✅ Summary

This system provides a complete MyGate-style visitor management with:
- ✅ Security guard adds visitors with photo
- ✅ Real-time notifications to residents
- ✅ Approve/Reject flow
- ✅ Status tracking (Pending/Approved/Rejected)
- ✅ Gate entry control
- ✅ Role-based permissions

**Ready to implement!** 🚀
