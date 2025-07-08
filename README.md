# Notes App

A full-stack notes application built with React, Node.js, MongoDB, and TypeScript featuring OTP-based authentication and JWT token management.

## Features

- **OTP-based Sign-in**: Secure authentication via Gmail OTP verification
- **JWT Authentication**: Token-based authentication stored in localStorage
- **Protected Dashboard**: Displays welcome card with user's name and email
- **Note Management**: Create, view, and delete notes with a clean interface
- **Login/Logout**: Complete authentication flow with session management
- **Responsive Design**: Modern UI with intuitive user experience

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for development and build
- CSS3 for styling
- Axios for API requests

**Backend:**
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- Nodemailer for OTP email delivery

## Project Structure

```
backend
├── .env
├── .gitignore
├── node_modules
├── package-lock.json
├── package.json
└── server.js

frontend
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── public
│   ├── container.png
│   ├── icon.svg
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── Pages
│   │   ├── DashBoard.tsx
│   │   └── SignUpPage.tsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── auth
│   │   │   ├── AuthBackground.tsx
│   │   │   ├── AuthForm.tsx
│   │   │   └── AuthHeader.tsx
│   │   ├── dashboard
│   │   │   ├── CreateNoteButton.tsx
│   │   │   ├── CreateNoteModal.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NotesSection.tsx
│   │   │   └── WelcomeCard.tsx
│   │   └── ui
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Logo.tsx
│   │       ├── Modal.tsx
│   │       └── TextArea.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── services
│   │   ├── AuthService.ts
│   │   └── NoteService.ts
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mitengala51/Notes-Web-App.git
cd notes-app
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following configuration:

```env
PORT=5000
MONGODB_URI="mongodb+srv://mitengala51:YTtmwrtSSH06NrrL@cluster0.okjqigr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="CSA9LPdAjtlT9!s!RNEH&lJ#iFE%xElo4aK"
JWT_EXPIRE="7d"
FRONTEND_URL="http://localhost:5173"

EMAIL_USER="collegeinfo582@gmail.com"
EMAIL_PASS="vdmo zese qyxp hpsy"
EMAIL_SERVICE="gmail"
```


### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

### 4. Configure API URLs for Local Development

**Important:** For local testing, you must update the API URLs in the following files:

- `src/services/AuthService.ts`
- `src/services/NoteService.ts`

Change `REACT_APP_API_URL` to point to your local backend:

```typescript
const API_URL = 'http://localhost:5000/api'; // Update this for local development
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend development server will run on `http://localhost:5173`

## Environment Variables

Ensure you have the following environment variables configured in your backend `.env` file:

```env
PORT=5000
MONGODB_URI="mongodb+srv://mitengala51:YTtmwrtSSH06NrrL@cluster0.okjqigr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="CSA9LPdAjtlT9!s!RNEH&lJ#iFE%xElo4aK"
JWT_EXPIRE="7d"
FRONTEND_URL="http://localhost:5173"

EMAIL_USER="collegeinfo582@gmail.com"
EMAIL_PASS="vdmo zese qyxp hpsy"
EMAIL_SERVICE="gmail"
```

## Usage

1. **Sign Up/Login**: Enter your email address to receive an OTP
2. **OTP Verification**: Enter the 6-digit OTP sent to your email
3. **Dashboard**: Access your protected dashboard with welcome card
4. **Create Notes**: Click the "Create Note" button to add new notes
5. **Manage Notes**: View and delete your notes from the dashboard
6. **Logout**: Use the logout functionality to end your session

## Production Deployment

The application is already deployed and running in production. These setup instructions are specifically for local development and testing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
