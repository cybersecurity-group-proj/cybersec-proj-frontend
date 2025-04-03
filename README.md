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
  - **Banned**: Revokes all permissions
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
    └── api.js            # Api calls
```

## Demo Account

For testing purposes, the application includes these demo accounts:

- **Admin**: username `admin`, password `Admin@1234`

you can create more accounts through the sign up and then promote them when logged in as an admin 

## Getting Started

1. Clone the repository
2. Create .env.local and set NEXT_PUBLIC_API_BASE_URL variable to the backend url (http://localhost:8000/api/v1 if you are using our backend)
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
- **Styling**: Tailwind CSS with custom color variables for responsive design
- **Data Consistency**: Automatic refresh of data and optimistic UI updates

