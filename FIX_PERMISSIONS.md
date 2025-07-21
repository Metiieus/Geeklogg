# 🛠️ Fix Firebase Permission Errors

## ❌ Current Issues
- `Error deleting document: FirebaseError: Missing or insufficient permissions`
- `Erro ao seguir/deixar de seguir: FirebaseError: Missing or insufficient permissions`

## ✅ Solution: Update Firestore Security Rules

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **geeklog-26b2c**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab at the top

### Step 2: Replace the Rules
1. **Delete all existing rules** in the editor
2. **Copy and paste** the complete rules from the `firestore.rules` file in this project
3. **Click the "Publish" button**
4. **Confirm** the deployment

### Step 3: Updated Rules Summary
The new rules allow:
- ✅ Users to follow/unfollow other users
- ✅ Users to delete their own content
- ✅ Proper read/write access for all necessary operations
- ✅ Security maintained - users can only access their own data

### Step 4: Test the Fix
After deploying the rules:
1. Try following/unfollowing a user
2. Try deleting a media item or review
3. Verify that permission errors are gone

## 🚨 Important
**You MUST manually deploy these rules via Firebase Console** for the permission errors to be fixed. The app will continue to show permission errors until the rules are updated in Firebase.

## 🔧 Alternative: Quick Test Mode
If you want to test immediately, you can temporarily use these super-permissive rules (⚠️ **NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Remember to replace with proper rules after testing!**
