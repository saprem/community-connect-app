// Push Notification Service
// Handles real-time notifications for visitor approvals

import { Platform } from 'react-native';

// Will be installed: npx expo install expo-notifications
let Notifications: any;
try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.warn('expo-notifications not installed. Run: npx expo install expo-notifications');
}

// Configure notification behavior
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });
}

/**
 * Request permission for push notifications
 */
export const requestNotificationPermissions = async () => {
  if (!Notifications) {
    console.warn('Notifications not available');
    return { granted: false };
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return { granted: false };
    }

    return { granted: true };
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return { granted: false };
  }
};

/**
 * Get the Expo push token for this device
 */
export const getExpoPushToken = async () => {
  if (!Notifications) {
    console.warn('Notifications not available');
    return null;
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    console.log('📱 Expo Push Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * Configure notification channels for Android
 */
export const configureNotificationChannels = async () => {
  if (!Notifications || Platform.OS !== 'android') {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync('visitor-approvals', {
      name: 'Visitor Approvals',
      description: 'Notifications for visitor approval requests',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'notification-sound.wav',
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    await Notifications.setNotificationChannelAsync('visitor-status', {
      name: 'Visitor Status Updates',
      description: 'Updates on visitor entry/exit status',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });

    console.log('✅ Notification channels configured');
  } catch (error) {
    console.error('Error configuring notification channels:', error);
  }
};

/**
 * Schedule a local notification (for testing)
 */
export const scheduleLocalNotification = async (title: string, body: string, data?: any) => {
  if (!Notifications) {
    console.warn('Notifications not available');
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'notification-sound.wav',
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 250, 250, 250],
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

/**
 * Send notification to specific user (requires backend)
 * For now, this is a placeholder that uses Firestore to trigger notifications
 */
export const sendVisitorApprovalNotification = async (
  residentUserId: string,
  visitorData: {
    id: string;
    name: string;
    purpose: string;
    photoUrl?: string;
  }
) => {
  // In production, this would call your backend API to send push notification
  // Backend would use Firebase Admin SDK to send to specific user's token

  console.log(`📬 Notification queued for user ${residentUserId}:`, {
    title: '🚪 Visitor Approval Required',
    body: `${visitorData.name} is at the gate. Purpose: ${visitorData.purpose}`,
    data: {
      type: 'visitor_approval',
      visitorId: visitorData.id,
      screen: 'visitors/pending-approval',
    },
  });

  // For development, schedule a local notification to simulate
  if (Notifications) {
    await scheduleLocalNotification(
      '🚪 Visitor Approval Required',
      `${visitorData.name} is at the gate. Purpose: ${visitorData.purpose}`,
      {
        type: 'visitor_approval',
        visitorId: visitorData.id,
        screen: 'visitors/pending-approval',
      }
    );
  }
};

/**
 * Listen for notification taps and handle navigation
 */
export const setupNotificationListeners = (router: any) => {
  if (!Notifications) {
    console.warn('Notifications not available');
    return () => {};
  }

  // Handle notification tap when app is in foreground
  const notificationListener = Notifications.addNotificationReceivedListener((notification: any) => {
    console.log('📬 Notification received:', notification);
  });

  // Handle notification tap when app is in background
  const responseListener = Notifications.addNotificationResponseReceivedListener((response: any) => {
    console.log('👆 Notification tapped:', response);

    const data = response.notification.request.content.data;

    if (data.type === 'visitor_approval') {
      // Navigate to pending approvals screen
      router.push(`/visitors/pending-approval`);
    } else if (data.screen) {
      router.push(data.screen);
    }
  });

  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

/**
 * Get notification badge count
 */
export const getBadgeCount = async () => {
  if (!Notifications) return 0;

  try {
    const count = await Notifications.getBadgeCountAsync();
    return count;
  } catch (error) {
    return 0;
  }
};

/**
 * Set notification badge count
 */
export const setBadgeCount = async (count: number) => {
  if (!Notifications) return;

  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async () => {
  if (!Notifications) return;

  try {
    await Notifications.dismissAllNotificationsAsync();
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};
