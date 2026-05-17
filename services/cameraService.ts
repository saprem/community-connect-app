// Camera Service for Visitor Photo Capture

import { Platform, Alert } from 'react-native';

// Will be installed: npx expo install expo-camera expo-image-picker
let Camera: any;
let ImagePicker: any;

try {
  Camera = require('expo-camera');
} catch (error) {
  console.warn('expo-camera not installed. Run: npx expo install expo-camera');
}

try {
  ImagePicker = require('expo-image-picker');
} catch (error) {
  console.warn('expo-image-picker not installed. Run: npx expo install expo-image-picker');
}

export interface PhotoResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

/**
 * Request camera permissions
 */
export const requestCameraPermissions = async () => {
  if (!Camera) {
    Alert.alert('Camera not available', 'Please install expo-camera');
    return { granted: false };
  }

  try {
    const { status } = await Camera.Camera.requestCameraPermissionsAsync();
    return { granted: status === 'granted' };
  } catch (error) {
    console.error('Error requesting camera permissions:', error);
    return { granted: false };
  }
};

/**
 * Request media library permissions
 */
export const requestMediaLibraryPermissions = async () => {
  if (!ImagePicker) {
    Alert.alert('Image Picker not available', 'Please install expo-image-picker');
    return { granted: false };
  }

  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return { granted: status === 'granted' };
  } catch (error) {
    console.error('Error requesting media library permissions:', error);
    return { granted: false };
  }
};

/**
 * Take photo with camera
 */
export const takePhoto = async (): Promise<PhotoResult | null> => {
  if (!ImagePicker) {
    Alert.alert('Camera not available', 'Please install expo-image-picker');
    return null;
  }

  try {
    // Request permissions
    const { granted } = await requestCameraPermissions();

    if (!granted) {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access to take visitor photos'
      );
      return null;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
      base64: false,
    });

    if (result.canceled) {
      return null;
    }

    return {
      uri: result.assets[0].uri,
      width: result.assets[0].width,
      height: result.assets[0].height,
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
    return null;
  }
};

/**
 * Pick photo from gallery
 */
export const pickPhoto = async (): Promise<PhotoResult | null> => {
  if (!ImagePicker) {
    Alert.alert('Image Picker not available', 'Please install expo-image-picker');
    return null;
  }

  try {
    // Request permissions
    const { granted } = await requestMediaLibraryPermissions();

    if (!granted) {
      Alert.alert(
        'Photo Library Permission Required',
        'Please allow photo library access to select visitor photos'
      );
      return null;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
      base64: false,
    });

    if (result.canceled) {
      return null;
    }

    return {
      uri: result.assets[0].uri,
      width: result.assets[0].width,
      height: result.assets[0].height,
    };
  } catch (error) {
    console.error('Error picking photo:', error);
    Alert.alert('Error', 'Failed to select photo. Please try again.');
    return null;
  }
};

/**
 * Show photo selection options (Camera or Gallery)
 */
export const selectPhoto = (): Promise<PhotoResult | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Select Photo',
      'Choose how to add visitor photo',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const photo = await takePhoto();
            resolve(photo);
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const photo = await pickPhoto();
            resolve(photo);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true }
    );
  });
};

/**
 * Upload photo to Firebase Storage
 */
export const uploadVisitorPhoto = async (
  photoUri: string,
  visitorId: string
): Promise<string | null> => {
  try {
    // Import Firebase storage
    const { storage } = require('./firebase.config');

    if (!storage) {
      console.warn('Firebase Storage not initialized');
      // Return the local URI for now (in production, upload to storage)
      return photoUri;
    }

    // Import Firebase storage functions
    const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

    // Convert URI to blob
    const response = await fetch(photoUri);
    const blob = await response.blob();

    // Create storage reference
    const storageRef = ref(storage, `visitors/${visitorId}/photo.jpg`);

    // Upload file
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    console.log('✅ Photo uploaded:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    // Return local URI as fallback
    return photoUri;
  }
};

/**
 * Delete visitor photo from Firebase Storage
 */
export const deleteVisitorPhoto = async (visitorId: string): Promise<boolean> => {
  try {
    const { storage } = require('./firebase.config');

    if (!storage) {
      return false;
    }

    const { ref, deleteObject } = require('firebase/storage');

    const storageRef = ref(storage, `visitors/${visitorId}/photo.jpg`);
    await deleteObject(storageRef);

    console.log('✅ Photo deleted');
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
};
