# 🔥 Deploy Firestore Rules

## Automatic Deployment (If Firebase CLI works)

```bash
# Login to Firebase (if not already logged in)
firebase login

# Deploy only the firestore rules
firebase deploy --only firestore:rules
```

## Manual Deployment via Firebase Console

If automatic deployment doesn't work, follow these steps:

1. **Open Firebase Console**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `geeklog-26b2c`

2. **Navigate to Firestore**
   - Click on "Firestore Database" in the left menu
   - Click on "Rules" tab

3. **Copy and Paste the Rules**
   - Delete all existing rules
   - Copy the content from `firestore.rules` file
   - Paste it in the rules editor

4. **Publish the Rules**
   - Click "Publish" button
   - Confirm the deployment

## What the Updated Rules Fix

✅ **Following/Unfollowing**: Users can now write to other users' followers/following collections when following/unfollowing

✅ **Activity Deletion**: Users can now delete their own activities

✅ **Proper Permissions**: The rules now allow the necessary operations while maintaining security

## Test After Deployment

1. Try following/unfollowing a user
2. Try deleting an activity or media item
3. Check that the permission errors are resolved

The rules have been updated to fix the permission issues while maintaining security.
