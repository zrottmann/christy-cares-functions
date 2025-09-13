# Christy Cares - Email Function

This repository contains the Email Notification function for the Christy Cares platform.

## 🚀 Function: Email Notifications

Handles sending email notifications for appointments, messages, and system alerts.

**Features:**
- ✅ Email notifications for new appointments
- ✅ Message notifications via email
- ✅ System alerts and reminders
- ✅ Test mode using Ethereal Email
- ✅ Professional HTML templates with Christy Cares branding
- ✅ Ready for production SMTP providers

## 📁 Repository Structure

```
christy-cares-functions/
├── index.js          # Main function code (entry point)
├── package.json      # Dependencies
├── README.md         # This file
└── email-notifications/  # Original development files
```

## 🚀 Deploy to Appwrite

### Method 1: GitHub Integration (Recommended)

1. **Connect GitHub to Appwrite:**
   - Go to your function: https://cloud.appwrite.io/console/project-christy-cares-app/functions/68c5c9dc0036c5a66172
   - Click "Deploy" tab
   - Select "Git" deployment
   - Connect to GitHub: `zrottmann/christy-cares-functions`
   - Branch: `master`
   - Root Directory: `/` (repository root)
   - Entrypoint: `index.js`

2. **Auto-deploy:**
   - Pushes to `master` branch will auto-deploy
   - Check deployment logs in Appwrite Console

### Method 2: Manual Upload

1. Upload `index.js` and `package.json` directly to Appwrite Console

## 🧪 Test Function

Use this payload:
```json
{
  "to": "test@example.com",
  "subject": "Test Email from Christy Cares",
  "content": "Hello!\n\nThis is a test email from your deployed function."
}
```

Expected response:
```json
{
  "success": true,
  "messageId": "unique-id",
  "previewUrl": "https://ethereal.email/message/xxx"
}
```

## ⚙️ Function Settings

- **Runtime**: Node.js 18.0
- **Entrypoint**: `index.js`
- **Execute**: `users`
- **Timeout**: 30 seconds

## 🔗 Links

- **Main App Repository**: https://github.com/zrottmann/caregiver
- **Function Console**: https://cloud.appwrite.io/console/project-christy-cares-app/functions/68c5c9dc0036c5a66172