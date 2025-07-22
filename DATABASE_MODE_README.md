# Portfolio Application - Database Mode

## 🚀 Quick Start

### Windows Users:
```bash
# Double-click or run in Command Prompt
start.bat
```

### Linux/Mac Users:
```bash
# Make executable and run
chmod +x start.sh
./start.sh
```

### Manual Start:

1. **Start Backend:**
```bash
cd backend
npm install  # First time only
npm start    # Starts on port 5000
```

2. **Start Frontend:**
```bash
cd client
npm install  # First time only  
npm start    # Starts on port 3000
```

## 📊 Database Requirements

- **MongoDB** must be running
- **Database Name:** portfolio (or as configured in .env)
- **Collections:** educations, experiences, projects, etc.

## 🔗 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin

## 🎓 Education Management

1. **Add Education:**
   - Go to Admin Panel → Education Tab
   - Click "Add Education"
   - Fill in all fields (title, institution, degree, period, description, grade, location)
   - Click "Add"

2. **View Education:**
   - Go to Home Page → Education Section
   - Data loads directly from MongoDB
   - Interactive selection with detailed view

## ⚠️ Important Notes

- **No Mock Data:** Application only works with real database data
- **Backend Required:** Frontend will show error if backend is not running
- **MongoDB Required:** Backend needs MongoDB connection to function

## 🔧 Troubleshooting

**If Education section shows "No education information available":**
1. Check if backend server is running (port 5000)
2. Check if MongoDB is running and accessible
3. Add education data through Admin Panel
4. Refresh the page

**If you see "Backend server not available" error:**
1. Start the backend server: `cd backend && npm start`
2. Check if port 5000 is available
3. Check database connection in backend logs

## 🗄️ Database Schema

Education documents should have:
```javascript
{
  title: String,        // Required
  institution: String,  // Required  
  degree: String,       // Required
  period: String,       // Required
  description: String,  // Required
  grade: String,        // Optional
  location: String      // Optional
}
```
