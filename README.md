# Portfolio Web Application This is Create Web Applications By ❤️ Ashutosh Tiwari

A full-stack portfolio website built with React.js frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Admin Panel**: Secure admin authentication and content management
- **Dynamic Content**: Real-time portfolio data management
- **Social Integration**: LinkedIn and other social media integration
- **Contact System**: Email contact form with nodemailer
- **File Uploads**: Resume and image upload functionality
- **Theme Support**: Light/dark theme toggle
- **SEO Optimized**: Proper meta tags and structure

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Ant Design** - UI components
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Nodemailer** - Email service
- **Puppeteer** - Web scraping (for social stats)

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── config/
│   │   └── dbConfig.js
│   ├── models/
│   │   ├── portfolioModel.js
│   │   ├── userModel.js
│   │   └── contactModel.js
│   ├── routes/
│   │   ├── portfolioRoute.js
│   │   └── contactRoute.js
│   ├── services/
│   │   ├── linkedinService.js
│   │   └── universalSocialService.js
│   ├── utils/
│   │   └── emailService.js
│   ├── server.js
│   ├── createAdmin.js
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Database Setup
```bash
cd ../backend
node createAdmin.js  # Create admin user
```

## 🚀 Running the Application

### Development Mode (Recommended)
```bash
# Start both frontend and backend
cd backend
npm run dev
```

### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start backend
cd ../backend
npm start
```

### Individual Services
```bash
# Backend only (Port 5000)
cd backend
npm start

# Frontend only (Port 3000)
cd client
npm start
```

## 🔐 Admin Access

1. Create admin user:
```bash
cd backend
node createAdmin.js
```

2. Access admin panel:
```
http://localhost:3000/admin
```

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password
3. Update `.env` with credentials

### Other Email Providers
Update EMAIL_HOST and EMAIL_PORT in `.env` file.

## 🌐 Deployment

### Heroku Deployment
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

### Vercel/Netlify (Frontend)
1. Build the client
2. Deploy the `client/build` folder
3. Set backend API URL in environment variables

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run serve` - Start development server with nodemon
- `npm run dev` - Start both backend and frontend
- `npm run create-admin` - Create admin user

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development|production
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   # Kill process using port 5000
   netstat -ano | findstr :5000
   taskkill /F /PID <PID>
   ```

2. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify database permissions

3. **npm start fails**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Made with ❤️ using React & Node.js**


**Create Web Applications By ❤️ Ashutosh Tiwari**