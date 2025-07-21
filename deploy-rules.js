#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🔥 Deploying Firestore Rules...');

// Try to deploy the rules
exec('firebase deploy --only firestore:rules --token "$FIREBASE_TOKEN"', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Deployment failed. Please deploy manually:');
    console.error('1. Go to https://console.firebase.google.com/');
    console.error('2. Select project: geeklog-26b2c');
    console.error('3. Go to Firestore Database > Rules');
    console.error('4. Copy content from firestore.rules and paste it');
    console.error('5. Click Publish');
    console.error('\nError details:', error.message);
    return;
  }

  if (stderr) {
    console.warn('⚠️ Warning:', stderr);
  }

  console.log('✅ Rules deployed successfully!');
  console.log(stdout);
});
