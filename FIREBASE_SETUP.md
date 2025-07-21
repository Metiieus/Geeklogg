# 🔥 Firebase Setup Instructions

## Quick Setup

1. **Create Firebase Project** (if you don't have one)
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or use existing "geeklog-26b2c"

2. **Get Firebase Configuration**
   - In Firebase Console, go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click "Web app" icon (</>)
   - Copy the config values

3. **Update Environment Variables**
   - Open the `.env` file in your project root
   - Replace the placeholder values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id
```

4. **Enable Services**
   - **Authentication**: Enable Email/Password provider
   - **Firestore**: Create database in production mode
   - **Storage**: Set up for file uploads

5. **Restart Development Server**
   ```bash
   npm run dev
   ```

## Current Status

✅ App is configured to run in "offline mode" when Firebase is not properly configured
✅ You'll see a warning notification until Firebase is set up
✅ All features will work locally, but data won't persist

## Need Help?

- Check the console for detailed error messages
- Verify all environment variables are set correctly
- Make sure there are no spaces or quotes around the values
- Restart the dev server after changing .env file
