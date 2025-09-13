# Christy Cares - Appwrite Functions

This repository contains all Appwrite Functions for the Christy Cares platform.

## 🚀 Functions

### 📧 Email Notifications (`email-notifications/`)
Handles sending email notifications for appointments, messages, and system alerts.

**Features:**
- Email notifications for new appointments
- Message notifications via email
- System alerts and reminders
- Test mode using Ethereal Email
- Production mode with real SMTP providers

### 📱 SMS Notifications (`sms-notifications/`) [Coming Soon]
Handles SMS notifications using Twilio or other providers.

### 🔔 Push Notifications (`push-notifications/`) [Coming Soon]
Handles push notifications for mobile apps.

## 🛠️ Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd christy-cares-functions
   ```

2. **Install dependencies for each function:**
   ```bash
   cd email-notifications
   npm install
   ```

3. **Deploy to Appwrite:**
   - Go to your Appwrite Console
   - Create a new function
   - Upload the function folder
   - Configure environment variables

## 📁 Structure

```
christy-cares-functions/
├── email-notifications/
│   ├── index.js
│   ├── package.json
│   └── README.md
├── sms-notifications/
│   ├── index.js
│   ├── package.json
│   └── README.md
└── push-notifications/
    ├── index.js
    ├── package.json
    └── README.md
```

## 🔧 Environment Variables

Each function may require specific environment variables. Check individual function READMEs for details.

## 📚 Documentation

- [Appwrite Functions Documentation](https://appwrite.io/docs/functions)
- [Christy Cares Platform Repository](../caregiver_platform)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test the function locally
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.