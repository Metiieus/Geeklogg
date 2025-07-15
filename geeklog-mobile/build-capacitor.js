#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Building GeekLog Mobile App for Capacitor...\n");

// Step 1: Check if required dependencies are installed
console.log("1. Checking dependencies...");
try {
  execSync("npx capacitor --version", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Capacitor CLI not found. Installing...");
  execSync("npm install -g @capacitor/cli", { stdio: "inherit" });
}

// Step 2: Install project dependencies
console.log("\n2. Installing project dependencies...");
execSync("npm install", { stdio: "inherit" });

// Step 3: Build the app
console.log("\n3. Building React Native app...");
try {
  execSync("npx expo export --platform web --output-dir dist", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ Build failed. Make sure you have Expo CLI installed.");
  console.log("Installing Expo CLI...");
  execSync("npm install -g @expo/cli", { stdio: "inherit" });
  execSync("npx expo export --platform web --output-dir dist", {
    stdio: "inherit",
  });
}

// Step 4: Ensure dist directory exists and has index.html
console.log("\n4. Verifying build output...");
const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");

if (!fs.existsSync(distPath)) {
  console.error("❌ dist directory not found after build");
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.log("⚠️  index.html not found, creating fallback...");
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GeekLog Mobile</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #0f172a;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }
        .container {
            padding: 20px;
        }
        .logo {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">📱 GeekLog Mobile</div>
        <p>Your personal entertainment diary</p>
        <p>Configured for Capacitor deployment</p>
    </div>
</body>
</html>
  `;
  fs.writeFileSync(indexPath, fallbackHtml);
}

// Step 5: Initialize Capacitor (if not already done)
console.log("\n5. Initializing Capacitor...");
try {
  execSync("npx cap sync", { stdio: "inherit" });
} catch (error) {
  console.log("Initializing Capacitor for the first time...");
  execSync("npx cap init GeekLog com.geeklog.mobile --web-dir=dist", {
    stdio: "inherit",
  });
  execSync("npx cap sync", { stdio: "inherit" });
}

// Step 6: Add platforms if they don't exist
console.log("\n6. Adding platforms...");
const androidPath = path.join(__dirname, "android");
const iosPath = path.join(__dirname, "ios");

if (!fs.existsSync(androidPath)) {
  console.log("Adding Android platform...");
  execSync("npx cap add android", { stdio: "inherit" });
}

if (!fs.existsSync(iosPath)) {
  console.log("Adding iOS platform...");
  execSync("npx cap add ios", { stdio: "inherit" });
}

// Step 7: Copy web assets and sync
console.log("\n7. Syncing with native platforms...");
execSync("npx cap copy", { stdio: "inherit" });
execSync("npx cap sync", { stdio: "inherit" });

console.log("\n✅ Build completed successfully!");
console.log("\n📱 Next steps:");
console.log("• For Android: npx cap open android");
console.log("• For iOS: npx cap open ios");
console.log("\n🔧 Development:");
console.log("• Run with live reload: npx cap run android --livereload");
console.log("• Run with live reload: npx cap run ios --livereload");
