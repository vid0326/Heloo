# Hello - Real-Time Chat Application

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io. Features direct messaging, channels, file sharing, and a modern UI.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Authentication**: User registration and login with JWT tokens
- **Real-time Messaging**: Instant messaging using Socket.io
- **Direct Messages**: Private conversations between users
- **Channels**: Group chat functionality with multiple members
- **File Sharing**: Upload and share files in messages
- **User Profiles**: Customizable profiles with avatars and bios
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI
- **Emoji Support**: Emoji picker for expressive messaging
- **Message Status**: Read receipts for direct messages
- **Channel Management**: Create and manage channels with admin controls

## Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Emoji Picker React** - Emoji selection
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## Project Structure

```
chatAPP/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── app/           # Redux store and constants
│   │   ├── assets/        # Images and icons
│   │   ├── components/    # Reusable UI components
│   │   │   └── ui/        # Shadcn/ui components
│   │   ├── context/       # React context providers
│   │   ├── features/      # Feature-based modules
│   │   │   ├── auth/      # Authentication
│   │   │   ├── chat/      # Chat functionality
│   │   │   └── profile/   # User profiles
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── main.jsx       # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads directory
│   ├── server.js         # Main server file
│   ├── socket.js         # Socket.io configuration
│   └── package.json
├── .gitignore
└── README.md
```

## Database Schema

### User Model

```javascript
{
  username: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: null },
  bio: { type: String, default: "bio" },
  color: { type: Number, default: 0 },
  createdAt: Date,
  updatedAt: Date
}
```

### Channel Model

```javascript
{
  handle: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  members: [{ type: ObjectId, ref: "Users", required: true }],
  admin: { type: ObjectId, ref: "Users", required: true },
  messages: [{ type: ObjectId, ref: "channelMessages" }],
  bio: { type: String, default: "bio" },
  profileImage: { type: String, default: null },
  color: { type: Number, default: 0 },
  createdAt: Date,
  updatedAt: Date
}
```

### ChannelMessage Model

```javascript
{
  sender: { type: ObjectId, ref: "Users", required: true },
  messageType: { type: String, enum: ["text", "file"], required: true },
  content: { type: String, required: function() { return this.messageType === "text" } },
  fileURL: { type: String, required: function() { return this.messageType === "file" } },
  timestamp: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
}
```

### DirectMessage Model

```javascript
{
  sender: { type: ObjectId, ref: "Users", required: true },
  receiver: { type: ObjectId, ref: "Users", required: true },
  messageType: { type: String, enum: ["text", "file"], required: true },
  content: { type: String, required: function() { return this.messageType === "text" } },
  fileURL: { type: String, required: function() { return this.messageType === "file" } },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
}
```

## API Endpoints

### Authentication Routes (`/auth`)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### User Routes (`/user`) - Protected

- `GET /user/get-all-users` - Get all users
- `GET /user/get-user/:id` - Get user by ID

### Profile Routes (`/profile`) - Protected

- `GET /profile/get-profile` - Get current user profile
- `PUT /profile/update-profile` - Update user profile
- `POST /profile/upload-profile-image` - Upload profile image

### Contact Routes (`/contacts`) - Protected

- `GET /contacts/get-dm-contacts` - Get direct message contacts
- `GET /contacts/get-channel-contacts` - Get channel contacts

### Message Routes (`/messages`) - Protected

- `POST /messages/send-dm` - Send direct message
- `GET /messages/get-dm-messages/:receiverId` - Get direct messages
- `PUT /messages/mark-dm-read/:senderId` - Mark DM as read

### Channel Routes (`/channels`) - Protected

- `POST /channels/create-channel` - Create new channel
- `GET /channels/get-user-channels` - Get user's channels
- `GET /channels/get-channel-details/:channelId` - Get channel details
- `PUT /channels/update-channel/:channelId` - Update channel
- `DELETE /channels/delete-channel/:channelId` - Delete channel
- `POST /channels/add-member/:channelId` - Add member to channel
- `DELETE /channels/remove-member/:channelId/:memberId` - Remove member from channel
- `POST /channels/send-channel-message/:channelId` - Send channel message
- `GET /channels/get-channel-messages/:channelId` - Get channel messages

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd chatAPP
   ```

2. **Install server dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

## Environment Variables

Create `.env` files in both `server/` and `client/` directories.

### Server (.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hello-chat
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=http://localhost:5173
```

### Client (.env)

```
VITE_API_URL=http://localhost:5000
```

## Running the Application

1. **Start MongoDB** (Make sure MongoDB is running locally or update MONGO_URI)

2. **Start the server:**

   ```bash
   cd server
   npm start
   ```

   Server will run on http://localhost:5000

3. **Start the client:**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Start Chatting**:
   - **Direct Messages**: Click on a user to start a private conversation
   - **Channels**: Create or join channels for group discussions
4. **Customize Profile**: Update your profile picture, bio, and color theme
5. **File Sharing**: Upload files by clicking the attachment button in message input
6. **Real-time Updates**: Messages appear instantly without page refresh

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

---
LIVE-DEMO https://heloo-phi.vercel.app/
Made with ❤️ by Vidhut
