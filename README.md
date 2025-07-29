# ARNGREN - Advertisement website

A full-stack advertisement website built with Node.js backend and React frontend.

## 🏗️ Project Structure

```
ARNGREN/
├── BACKEND/                 # Node.js/Express backend
│   ├── Controllers/         # API controllers
│   ├── Model/              # Database models
│   ├── Routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── services/           # Business logic services
│   ├── uploads/            # File uploads directory
│   └── app.js              # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── Components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   └── package.json
└── README.md
```

## 🚀 Features

### Backend Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User, Admin, Super Admin)
  - Password encryption with bcrypt

- **Advertisement Management**
  - CRUD operations for advertisement 
  - Image upload functionality
  - Category-based organization

- **User Management**
  - User registration and login
  - Profile management
  - Role management for admins

- **Category Management**
  - Create, read, update, delete categories
  - Admin-only category management

### Frontend Features
- **Responsive Design**
  - Modern, mobile-friendly UI
  - Beautiful advertisement website interface

- **User Interface**
  - User registration and login
  - Profile management
  - Advertisement browsing and posting

- **Admin Dashboard**
  - User management
  - Advertisement management
  - Category management
  - Role management

- **Protected Routes**
  - Authentication-based routing
  - Role-based access control

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - JavaScript library
- **React Router** - Client-side routing
- **CSS3** - Styling
- **Context API** - State management
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd BACKEND
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the BACKEND directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arngren
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `arngren`
3. Update the `MONGODB_URI` in your `.env` file

## 🚀 Deployment

### Backend Deployment
1. Set up a production MongoDB instance
2. Configure environment variables for production
3. Deploy to platforms like:
   - Heroku
   - DigitalOcean
   - AWS
   - Vercel

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy to platforms like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Advertisements
- `GET /api/ads` - Get all advertisements
- `POST /api/ads` - Create new advertisement
- `GET /api/ads/:id` - Get specific advertisement
- `PUT /api/ads/:id` - Update advertisement
- `DELETE /api/ads/:id` - Delete advertisement

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Users
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js team for the backend framework
- MongoDB team for the database
- All contributors and supporters

---

**ARNGREN** - Where elegance meets technology in the world of jewelry.
