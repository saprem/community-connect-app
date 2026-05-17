# 💳 Payment System Documentation

## Overview

The Community Connect app includes a complete payment management system with **UPI (Unified Payments Interface)** integration for seamless, instant payments directly from the app.

---

## 🎯 Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PAYMENT FLOW DIAGRAM                         │
└─────────────────────────────────────────────────────────────────┘

1. Admin Creates Payment Entry
   ↓
2. User Views Pending Payment in App
   ↓
3. User Clicks "Pay via UPI"
   ↓
4. App Generates UPI Deep Link
   ↓
5. User Redirected to UPI App (GPay/PhonePe/Paytm/BHIM)
   ↓
6. User Completes Payment in UPI App
   ↓
7. User Returns to Community Connect App
   ↓
8. Payment Status Updated (Manual/Webhook)
```

---

## 📱 How UPI Integration Works

### What is UPI?
UPI (Unified Payments Interface) is India's instant real-time payment system developed by NPCI (National Payments Corporation of India). It allows instant money transfer between bank accounts using a mobile device.

### UPI Deep Linking
The app uses **UPI Deep Links** to integrate with UPI apps without requiring a payment gateway:

**Format:**
```
upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&tn=<NOTE>&cu=<CURRENCY>
```

**Parameters:**
- `pa` (Payee Address) - Your community's UPI ID (e.g., `greenvalley@paytm`)
- `pn` (Payee Name) - Community name (e.g., `Green Valley Apartments`)
- `am` (Amount) - Payment amount (e.g., `5000`)
- `tn` (Transaction Note) - Reference ID (e.g., `Maintenance-abc12345`)
- `cu` (Currency) - Currency code (always `INR` for India)

**Example UPI Link:**
```
upi://pay?pa=greenvalley@paytm&pn=Green%20Valley%20Apartments&am=5000&tn=Maintenance-abc12345&cu=INR
```

### Supported UPI Apps
- Google Pay (GPay)
- PhonePe
- Paytm
- BHIM
- Amazon Pay
- WhatsApp Pay
- Any UPI-enabled banking app

---

## 🔧 Setup Instructions

### Step 1: Get Your Community UPI ID

You have **two options**:

#### Option A: UPI ID from Payment App (Recommended for Small Communities)
1. Download **Google Pay**, **PhonePe**, or **Paytm**
2. Create a business account for your community
3. Get your UPI ID (format: `username@bankname`)
   - Example: `greenvalley@paytm` or `9876543210@paytm`

**Pros:**
- ✅ Free and instant setup
- ✅ Money directly to bank account
- ✅ No transaction fees
- ✅ Simple for small communities

**Cons:**
- ❌ Manual payment verification
- ❌ No automatic status updates
- ❌ Requires manual record keeping

#### Option B: Payment Gateway (Recommended for Large Communities)
Use payment gateways like:
- **Razorpay** (razorpay.com)
- **Cashfree** (cashfree.com)
- **PayU** (payu.in)
- **Instamojo** (instamojo.com)

**Pros:**
- ✅ Automatic payment verification
- ✅ Webhook notifications
- ✅ Dashboard and analytics
- ✅ Multiple payment methods
- ✅ Refund management

**Cons:**
- ❌ Transaction fees (1.5% - 2%)
- ❌ Requires business verification
- ❌ More complex integration

---

### Step 2: Update UPI ID in Code

Open `app/payments/index.tsx` and update line 102:

```typescript
// BEFORE (default)
const upiId = 'yourupiid@paytm';

// AFTER (your actual UPI ID)
const upiId = 'greenvalley@paytm'; // or your UPI ID
```

**Where to find this in code:**
```
app/payments/index.tsx:102
```

### Step 3: Test the Integration

1. Run the app: `npx expo start`
2. Go to Payments tab
3. Click "Pay via UPI" on any payment
4. Verify it opens your UPI app correctly
5. Complete a test payment
6. Verify money reaches your account

---

## 💻 Code Structure

### Files Involved

```
app/
├── payments/
│   ├── index.tsx          # Main payments list screen (UPI integration here)
│   ├── add.tsx            # Create payment entry (admin only)
│   └── [id].tsx           # Payment detail screen (future)
├── (tabs)/
│   ├── payments.tsx       # Payments tab (redirects to payments/index)
│   └── home.tsx           # Home screen (Pay Dues button)
services/
└── firestoreHelpers.ts    # Payment CRUD functions
```

### Key Functions

#### 1. Create Payment (Admin)
```typescript
// services/firestoreHelpers.ts
export const createPayment = async (paymentData: Partial<Payment>) => {
  const paymentsRef = collection(db, 'payments');
  const paymentRef = doc(paymentsRef);
  await setDoc(paymentRef, {
    ...paymentData,
    id: paymentRef.id,
    createdAt: Timestamp.now(),
    status: 'pending',
  });
};
```

#### 2. UPI Payment Handler
```typescript
// app/payments/index.tsx:99
const handlePayViaUPI = (payment: Payment) => {
  const upiId = 'yourupiid@paytm';
  const upiUrl = `upi://pay?pa=${upiId}&pn=Community&am=${amount}&tn=${note}&cu=INR`;

  Linking.openURL(upiUrl)
    .then(() => {
      // User redirected to UPI app
      Alert.alert('Payment Initiated', 'Complete payment in your UPI app');
    })
    .catch(() => {
      Alert.alert('Error', 'No UPI app found');
    });
};
```

#### 3. Get Payments
```typescript
// services/firestoreHelpers.ts
export const getPayments = async (userId: string) => {
  const paymentsRef = collection(db, 'payments');
  const q = query(
    paymentsRef,
    where('userId', '==', userId),
    orderBy('dueDate', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

---

## 🔄 Payment Workflow

### For Residents (Users)

1. **View Payments**
   - Open app → Payments tab
   - See all payments with status (Pending/Overdue/Paid)
   - View stats: Total Pending, Total Overdue

2. **Pay via UPI**
   - Click "Pay via UPI" button
   - Review payment details in alert
   - Click "Open UPI App"
   - Complete payment in UPI app
   - Return to Community Connect app

3. **Confirmation**
   - Payment reflects in 5-10 minutes (bank processing time)
   - Screenshot UTR number for records
   - Status updates to "Paid" (manual/automatic)

### For Admin/Management

1. **Create Payment Entry**
   - Open Payments → + button
   - Select category (Maintenance, Security, Utilities, etc.)
   - Enter amount and description
   - Set due date
   - Create entry

2. **Verify Payments**
   - Check bank account for incoming payments
   - Match transaction note with payment ID
   - Update payment status in app (manual)
   - OR: Use payment gateway webhooks (automatic)

3. **Track Payments**
   - View all pending payments
   - See overdue amounts
   - Filter by status
   - Search by category/description

---

## 🎨 UI Components

### Payment Card
```
┌─────────────────────────────────────────┐
│ 🏠  Maintenance             ⏳          │
│     Monthly maintenance charges          │
│                                          │
│     Amount: ₹5,000                      │
│     Due: 30 Jun 2024                    │
│                                          │
│     [Pay via UPI →]                     │
└─────────────────────────────────────────┘
```

### Quick Pay Banner
```
┌─────────────────────────────────────────┐
│ 💳 Quick Pay                            │
│ Total Due: ₹6,500                       │
│                                          │
│          [Pay via UPI]                  │
└─────────────────────────────────────────┘
```

### Stats Cards
```
┌──────────────┐  ┌──────────────┐
│   ₹5,000     │  │   ₹1,500     │
│   Pending    │  │   Overdue    │
└──────────────┘  └──────────────┘
```

---

## 🔐 Payment Verification Methods

### Method 1: Manual Verification (Current Implementation)

**Process:**
1. User completes UPI payment
2. Admin checks bank account
3. Admin manually updates payment status in Firebase

**Update Payment Status:**
```typescript
// In Firebase Console or via code
await updatePayment(paymentId, {
  status: 'paid',
  paymentMethod: 'UPI',
  transactionId: 'UTR123456789', // From bank statement
  paidAt: new Date().toISOString(),
});
```

**Pros:**
- Free
- Simple
- No technical complexity

**Cons:**
- Manual work
- Delay in status update
- Risk of human error

---

### Method 2: Payment Gateway with Webhooks (Advanced)

For **automatic payment verification**, integrate a payment gateway:

#### Razorpay Integration Example

**1. Install Razorpay SDK**
```bash
npm install react-native-razorpay
```

**2. Update Payment Handler**
```typescript
import RazorpayCheckout from 'react-native-razorpay';

const handlePayViaRazorpay = (payment: Payment) => {
  const options = {
    description: payment.description,
    image: 'https://your-logo.png',
    currency: 'INR',
    key: 'YOUR_RAZORPAY_KEY_ID',
    amount: payment.amount * 100, // Amount in paise
    name: 'Community Connect',
    prefill: {
      email: user.email,
      contact: user.phone,
      name: user.name
    },
    theme: { color: '#6366F1' }
  };

  RazorpayCheckout.open(options)
    .then((data) => {
      // Payment successful
      updatePayment(payment.id, {
        status: 'paid',
        paymentMethod: 'Razorpay',
        transactionId: data.razorpay_payment_id,
        paidAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Payment completed successfully!');
    })
    .catch((error) => {
      Alert.alert('Payment Failed', error.description);
    });
};
```

**3. Setup Webhook (Backend Required)**
- Create webhook endpoint in your backend
- Razorpay sends payment confirmation to your server
- Server updates Firebase payment status
- App reflects updated status automatically

**Webhook Example (Node.js):**
```javascript
app.post('/razorpay-webhook', (req, res) => {
  const secret = 'YOUR_WEBHOOK_SECRET';
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    // Valid webhook
    const paymentId = req.body.payload.payment.entity.id;
    const notes = req.body.payload.payment.entity.notes;

    // Update Firebase
    updatePayment(notes.payment_id, {
      status: 'paid',
      transactionId: paymentId,
      paidAt: new Date().toISOString(),
    });
  }

  res.json({ status: 'ok' });
});
```

---

## 📊 Payment Categories

The system supports multiple payment categories:

| Category | Icon | Use Case | Example |
|----------|------|----------|---------|
| Maintenance | 🏠 | Monthly maintenance charges | ₹5,000/month |
| Security | 🔒 | Security guard charges | ₹1,500/quarter |
| Utilities | 💡 | Water, electricity, common area | ₹2,000/month |
| Parking | 🚗 | Parking slot charges | ₹500/month |
| Club House | 🏊 | Gym, pool, amenities | ₹3,000/month |
| Event | 🎉 | Festival celebrations, events | ₹1,000 one-time |
| Other | 💰 | Miscellaneous charges | Variable |

**Add Custom Categories:**
Edit `app/payments/add.tsx:8`:
```typescript
const CATEGORIES = [
  'Maintenance',
  'Security',
  'Utilities',
  'Parking',
  'Club House',
  'Event',
  'Repairs',      // Add custom
  'Insurance',    // Add custom
  'Other'
];
```

---

## 🐛 Troubleshooting

### Issue 1: "UPI App Not Found" Error

**Cause:** No UPI app installed or deep linking not working

**Solution:**
1. Install any UPI app (GPay, PhonePe, Paytm)
2. For Android: Ensure UPI apps are set as default payment apps
3. For iOS: Check if app URL schemes are configured

### Issue 2: Payment Doesn't Redirect to UPI App

**Cause:** Invalid UPI ID format or URL encoding

**Solution:**
1. Verify UPI ID format: `username@bankname`
2. Check special characters are encoded
3. Test UPI link manually:
   ```bash
   # Android
   adb shell am start -W -a android.intent.action.VIEW -d "upi://pay?pa=test@paytm&pn=Test&am=1&cu=INR"
   ```

### Issue 3: Payment Status Not Updating

**Cause:** Manual verification required (no webhook)

**Solution:**
- Manually update in Firebase Console
- Or implement payment gateway with webhooks
- Or check bank statement and update via admin panel

### Issue 4: "Unmatched Route" Error on Payments

**Cause:** Incorrect route path in navigation

**Solution:**
- Use `/payments` instead of `/payments/index`
- Restart Expo dev server: `npx expo start --clear`

---

## 🚀 Advanced Features (Optional)

### 1. Payment Reminders (Push Notifications)
```typescript
// Send reminder 3 days before due date
const sendPaymentReminder = async (payment: Payment) => {
  const dueDate = new Date(payment.dueDate);
  const reminderDate = new Date(dueDate);
  reminderDate.setDate(reminderDate.getDate() - 3);

  // Schedule notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Payment Due Soon',
      body: `${payment.description} - ₹${payment.amount} due on ${dueDate.toLocaleDateString()}`,
    },
    trigger: { date: reminderDate },
  });
};
```

### 2. Payment History Export
```typescript
// Export to CSV
const exportPaymentHistory = (payments: Payment[]) => {
  const csv = [
    'Date,Category,Description,Amount,Status',
    ...payments.map(p =>
      `${p.dueDate},${p.category},${p.description},${p.amount},${p.status}`
    )
  ].join('\n');

  // Share CSV file
  FileSharing.shareAsync('payment-history.csv', csv);
};
```

### 3. Recurring Payments
```typescript
// Auto-create monthly maintenance payment
const createRecurringPayment = async () => {
  const payment = {
    category: 'Maintenance',
    description: 'Monthly maintenance charges',
    amount: 5000,
    dueDate: getNextMonthDate(),
    recurring: true,
  };

  await createPayment(payment);

  // Schedule next month's payment
  scheduleNextRecurring(payment);
};
```

---

## 📈 Analytics & Reports

Track payment metrics:

```typescript
// Calculate payment statistics
const getPaymentStats = (payments: Payment[]) => {
  return {
    totalPending: payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),

    totalOverdue: payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0),

    totalCollected: payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),

    collectionRate: (payments.filter(p => p.status === 'paid').length / payments.length) * 100,
  };
};
```

---

## 🔒 Security Best Practices

1. **Never Store Sensitive Data**
   - Don't store UPI PIN or card details
   - Don't log transaction data in plain text

2. **Validate Payment Amounts**
   ```typescript
   if (amount <= 0 || amount > 1000000) {
     Alert.alert('Invalid amount');
     return;
   }
   ```

3. **Verify Transactions**
   - Always match transaction ID with bank statement
   - Implement double-entry verification
   - Keep audit logs

4. **Secure UPI ID**
   - Store UPI ID in environment variables
   - Don't hardcode in source code
   - Use Firebase Remote Config for dynamic updates

---

## 📞 Support

### For Users
- Contact management for payment issues
- Keep UTR number for reference
- Screenshot payment confirmation

### For Admins
- Razorpay Support: support@razorpay.com
- Cashfree Support: support@cashfree.com
- UPI/NPCI Issues: https://www.npci.org.in/

---

## 📝 Summary

| Feature | Status | Method |
|---------|--------|--------|
| View Payments | ✅ Working | Firebase Firestore |
| Create Payments | ✅ Working | Admin only |
| UPI Integration | ✅ Working | Deep linking |
| Payment Status | ⚠️ Manual | Need webhook for auto |
| Search & Filter | ✅ Working | Client-side |
| Categories | ✅ Working | 7 categories |
| Push to UPI App | ✅ Working | Linking API |
| Auto Verification | ❌ Not yet | Requires payment gateway |

---

## 🎯 Next Steps

1. **Update UPI ID** in `app/payments/index.tsx:102`
2. **Test payment flow** end-to-end
3. **Consider payment gateway** for large communities (>50 flats)
4. **Setup Firebase rules** for payment security
5. **Train admin users** on manual verification process

---

**Questions?** Contact the development team or refer to code comments in `app/payments/index.tsx`.
