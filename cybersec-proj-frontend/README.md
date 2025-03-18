# Social Feed Application with RBAC

A React-based social feed application with Role-Based Access Control (RBAC) built with Next.js and Tailwind CSS.

## Features

- **Authentication**: User registration and login
- **Post Management**: Create, read, update, and delete posts
- **Role-Based Access Control (RBAC)**:
  - **Guests**: Can view all posts without logging in
  - **Users**: Can create posts and edit/delete their own posts
  - **Moderators**: Can delete any post
  - **Admins**: Can manage users (delete/assign roles) and edit/delete any post
- **Persistent Data**: Uses localStorage to persist data between sessions
- **Real-time Updates**: Automatically refreshes posts every 5 seconds

## Project Structure

```
src/
├── app/                  # Next.js app router
│   ├── auth/             # Authentication pages
│   │   ├── signin/       # Sign in page
│   │   └── signup/       # Sign up page
│   ├── dashboard/        # User dashboard
│   │   └── users/        # User management (admin only)
│   ├── posts/            # Post-related pages
│   │   └── create/       # Dedicated post creation page
│   ├── globals.css       # Global CSS with custom color variables
│   ├── layout.js         # Root layout with theme configuration
│   └── page.js           # Home/Feed page
├── components/           # Reusable components
│   ├── feed/             # Feed components
│   │   ├── CreatePost.js # Post creation form
│   │   └── Post.js       # Individual post component
│   └── layout/           # Layout components
│       └── Navbar.js     # Navigation bar
├── context/              # React Context
│   └── AuthContext.js    # Authentication context
└── lib/                  # Utility functions
    └── api.js            # Mock API with localStorage persistence
```

## Demo Accounts

For testing purposes, the application includes these demo accounts:

- **Admin**: username `admin`, password `admin123`
- **Moderator**: username `mod`, password `mod123`
- **Regular User**: username `user1`, password `user123`

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Role-Based Access Control

The application demonstrates RBAC through the `AuthContext` provider, which manages:

- User authentication state
- Role-based permissions
- Access control for actions like editing or deleting posts

Each component checks user permissions before rendering action buttons or allowing operations.

## Implementation Details

- **Frontend**: Next.js 13+ (App Router), React, Tailwind CSS
- **State Management**: React Context API and React Hooks
- **Data Storage**: Mock API with localStorage persistence
- **Styling**: Tailwind CSS with custom color variables for responsive design
- **Data Consistency**: Automatic refresh of data and optimistic UI updates

## Connecting to Backend

The frontend is designed to be easily connected to a backend API:

1. Modify the functions in `src/lib/api.js` to make actual HTTP requests
2. Replace localStorage operations with API calls
3. Update authentication methods to use JWT or session-based auth
4. Keep the same response structure to maintain compatibility with components

The mock API follows RESTful conventions and can be adapted to work with various backend technologies.
