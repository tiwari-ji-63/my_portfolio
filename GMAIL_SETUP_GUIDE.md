# Gmail Setup Guide for Portfolio Admin

## Step-by-Step Instructions:

### 1. Enable 2-Factor Authentication
- Go to: https://myaccount.google.com/security
- Find "2-Step Verification" and turn it ON
- Follow the setup process

### 2. Generate App Password
- In the same Security page, find "App passwords"
- Click "Select app" → Choose "Mail"
- Click "Select device" → Choose "Other" → Type "Portfolio Admin"
- Click "Generate"
- Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### 3. Update .env File
Replace this line in backend/.env:
```
EMAIL_PASS=your-gmail-app-password-here
```

With:
```
EMAIL_PASS=your-16-character-app-password
```

### 4. Restart the Server
After updating .env:
- Stop the backend server (Ctrl+C)
- Start it again: npm start

### 5. Test Forgot Password
- Go to: http://localhost:3000/admin-forgot-password
- Enter username: ashu63
- Check your Gmail inbox!

## Important Notes:
- Use the APP PASSWORD, not your regular Gmail password
- The app password has no spaces when you enter it in .env
- Example: EMAIL_PASS=abcdefghijklmnop

## Alternative (Current Setup):
If you can't set up Gmail right now, you can still test with the preview URL:
- Use forgot password feature
- Check console logs for preview URL
- Copy the URL to see the email content
