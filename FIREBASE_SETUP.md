# Firebase Setup Guide

## What was Fixed

The app was experiencing a runtime error:
```
TypeError: Cannot read properties of null (reading 'container')
```

This occurred because Firebase Storage was being initialized with a `null` app instance when Firebase configuration was missing.

## Changes Made

1. **Fixed storage initialization** - Storage is now only initialized when Firebase app is valid
2. **Added error handling** - Profile service now handles storage upload failures gracefully  
3. **Added utility method** - StorageClient now has `isAvailable()` to check storage status
4. **Set placeholder environment variables** - App runs in offline mode when Firebase isn't configured

## Current Status

�� **App is running in offline mode** - Data is saved locally in browser storage  
⚠️ **To enable cloud features**, configure Firebase (see below)

## How to Configure Firebase (Optional)

To enable cloud storage, authentication, and data sync:

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication, Firestore, and Storage

### Step 2: Get Configuration Values
1. Go to Project Settings > General > Your apps
2. Add a web app or view existing web app config
3. Copy the configuration values

### Step 3: Set Environment Variables
Use these commands to set your real Firebase configuration:

```bash
# Replace with your actual values from Firebase Console
DevServerControl.set_env_variable("VITE_FIREBASE_API_KEY", "your_actual_api_key")
DevServerControl.set_env_variable("VITE_FIREBASE_AUTH_DOMAIN", "your_project.firebaseapp.com")
DevServerControl.set_env_variable("VITE_FIREBASE_PROJECT_ID", "your_project_id")
DevServerControl.set_env_variable("VITE_FIREBASE_STORAGE_BUCKET", "your_project.appspot.com")
DevServerControl.set_env_variable("VITE_FIREBASE_MESSAGING_SENDER_ID", "your_sender_id")
DevServerControl.set_env_variable("VITE_FIREBASE_APP_ID", "your_app_id")
```

Then restart the dev server.

### Step 4: Configure Firebase Rules
Update your Firestore and Storage security rules as needed for your use case.

## Offline vs Online Mode

**Offline Mode (Current)**:
- ✅ App works without internet
- ✅ Data saved in browser localStorage
- ❌ No data sync between devices
- ❌ No authentication
- ❌ No cloud backup

**Online Mode (With Firebase)**:
- ✅ Data synced across devices
- ✅ User authentication
- ✅ Cloud backup
- ✅ Real-time updates
- ❌ Requires internet connection

## Error Handling

The app now gracefully handles:
- Missing Firebase configuration
- Storage upload failures
- Network connectivity issues
- Authentication errors

All storage operations are wrapped in try/catch blocks and will continue working even if uploads fail.
