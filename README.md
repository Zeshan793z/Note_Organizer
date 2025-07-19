# 📝 Note Organizer App

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application with **TypeScript** that helps users create, categorize, update, search, and pin notes. It supports **user authentication**, **image uploads**, **autosaving**, and **a responsive modern UI** built with **Tailwind CSS**.



## ✨ Features

- 🔐 **Authentication** (Register, Login, Logout)
- 📝 **Create, Edit, Delete Notes**
- 📸 **Upload Images** with Notes
- 📁 **Predefined Categories**: Work, Personal, Random
- 🔍 **Search** by title/content
- 🧾 **Filter** notes by category
- 📌 **Pin Notes** to top
- ⏱️ **Autosave** on edit/create
- 📆 **Last Edited Timestamps**
- 🎨 **Responsive UI** with Tailwind CSS
- 🛡️ **Protected Routes** for logged-in users

## 🧪 Technologies

| Layer      | Tech Stack                                       |
|------------|--------------------------------------------------|
| Frontend   | React, TypeScript, React Router, Tailwind CSS    |
| Backend    | Node.js, Express, TypeScript                     |
| Database   | MongoDB                                          |
| Auth       | JWT-based Authentication                         |
| File Upload| express-fileupload                               |
| Dev Tools  | Vite, ts-node-dev, React Hot Toast               |

## 🗂️ Project Structure

note-organizer/
├── note-organizer-backend/       # Backend server
│   ├── src/
│   │   ├── config/               # Database configuration
│   │   ├── controllers/          # Route controllers
│   │   ├── middleware/           # Authentication middleware
│   │   ├── models/               # MongoDB models
│   │   ├── routes/               # API routes
│   │   ├── types/                # Type definitions
│   │   ├── utils/                # Utility functions
│   │   └── server.ts             # Express server
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── note-organizer-frontend/      # Frontend application
    ├── src/
    │   ├── components/           # React components
    │   ├── constants/            # Application constants
    │   ├── context/              # Auth context
    │   ├── pages/                # Application pages
    │   ├── types/                # Type definitions
    │   ├── utils/                # Utility functions
    │   ├── App.tsx               # Main App component
    │   └── main.tsx              # Application entry point
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── vite.config.ts


## 🛠️ Installation
1. Clone the repository

git clone https://github.com/Zeshan793z/Note_Organizer.git
cd note-organizer

2. Set up the backend

cd note-organizer-backend
npm install

3. Configure environment variables
Create a .env file in the backend directory:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

4. Set up the frontend

cd ../note-organizer-frontend
npm install

5. Run the application

In one terminal (backend):

cd ../note-organizer-backend
npm run dev

In another terminal (frontend):

cd ../note-organizer-frontend
npm run dev

6. Access the application
Open your browser and navigate to http://localhost:5173

