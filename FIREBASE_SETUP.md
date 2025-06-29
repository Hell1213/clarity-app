# Firebase Setup Guide for Clarity App

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `clarity-wellness-app` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## 🔧 Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

## 🔑 Step 3: Get Your Firebase Config

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter app nickname: `clarity-web-app`
6. Click "Register app"
7. Copy the config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

## 📝 Step 4: Create Environment File

1. In your project root, create a `.env` file:

```bash
touch .env
```

2. Add your Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## 🔒 Step 5: Set Up Security Rules (Optional but Recommended)

1. In Firestore Database, go to "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /focusSessions/{document} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    match /journalEntries/{document} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## 🧪 Step 6: Test Your Setup

1. Start your development server:

```bash
npm run dev
```

2. Open the app and try:
   - Creating a focus session
   - Adding a journal entry
   - Check Firebase Console to see data being saved

## ✅ What You'll Get

- **Real-time data sync** across devices
- **Offline support** with automatic sync when online
- **Secure data** with user-based access control
- **Scalable infrastructure** that grows with your app

## 🎯 Next Steps

1. **Authentication**: Add user login/signup
2. **Real-time updates**: Enable live data updates
3. **Analytics**: Track user engagement
4. **Deployment**: Deploy to production

## 🆘 Troubleshooting

**If you see "Firebase not available" messages:**

- Check your `.env` file has correct values
- Restart your dev server after adding `.env`
- Verify Firebase project is created and Firestore is enabled

**If data isn't saving:**

- Check Firestore security rules
- Verify you're in "test mode" or have proper auth
- Check browser console for errors

Your Clarity app is now ready to use Firebase! 🚀
