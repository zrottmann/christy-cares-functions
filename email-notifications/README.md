# Email Notifications Function

This Appwrite function handles email notifications for the Christy Cares platform.

## 🚀 Features

- **Appointment Notifications**: Send email alerts for new, updated, or cancelled appointments
- **Message Notifications**: Email notifications for new messages between caregivers and patients
- **System Alerts**: Administrative emails and system notifications
- **Test Mode**: Uses Ethereal Email for development and testing
- **Production Ready**: Easy to configure with any SMTP provider

## 📦 Deployment

### 1. Appwrite Console Method (Recommended)

1. Go to your Appwrite Console: `https://cloud.appwrite.io/console/project-{PROJECT_ID}/functions`
2. Click **"Create Function"**
3. Fill in the details:
   - **Name**: `Email Notifications`
   - **Function ID**: `email-notifications`
   - **Runtime**: `Node.js 18.0`
   - **Entrypoint**: `index.js`
   - **Execute**: `users`
4. Upload this folder
5. Deploy the function

### 2. Appwrite CLI Method

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy the function
appwrite deploy function
```

## 🔧 Configuration

### Environment Variables

Set these in your Appwrite Function settings:

#### For Testing (Default)
No additional configuration needed. Uses Ethereal Email for testing.

#### For Production
Add these environment variables in Appwrite Console:

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
EMAIL_FROM=noreply@christy-cares.com
```

### Example Production Configuration

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-user
SMTP_PASS=your-mailgun-password
```

## 📨 Usage

### Function Payload

Send a POST request to your function with this payload:

```json
{
  "to": "recipient@example.com",
  "subject": "Your Appointment Confirmation",
  "content": "Your appointment has been confirmed for tomorrow at 2 PM.",
  "from": "noreply@christy-cares.com"
}
```

### From Flutter App

```dart
await appwriteService.functions.createExecution(
  functionId: 'email-notifications',
  body: jsonEncode({
    'to': patient.email,
    'subject': 'Appointment Confirmation',
    'content': 'Your appointment with ${caregiver.name} has been confirmed.',
  }),
);
```

## 🧪 Testing

### Test with Ethereal Email

1. Deploy the function (uses Ethereal Email by default)
2. Call the function with test data
3. Check the function logs for the preview URL
4. Open the preview URL to see the sent email

### Test Payload Example

```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "content": "This is a test email from Christy Cares!"
}
```

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "messageId": "unique-message-id",
  "previewUrl": "https://ethereal.email/message/xxx" // Only in test mode
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message details"
}
```

## 🔒 Security

- Function only executes for authenticated users
- Email addresses are validated
- SMTP credentials are stored securely in environment variables
- No sensitive data is logged

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check SMTP credentials
   - Ensure app passwords are used for Gmail
   - Verify SMTP server settings

2. **"Function timeout"**
   - Check network connectivity
   - Verify SMTP server is reachable
   - Increase function timeout in Appwrite Console

3. **"Invalid email format"**
   - Validate email addresses before sending
   - Check for proper email formatting

### Debug Mode

To enable debug logging, set `DEBUG=true` in environment variables.

## 📄 License

MIT License - Part of the Christy Cares platform.