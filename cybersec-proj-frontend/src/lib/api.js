'use client';

// Check if running in browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize mock data
const initMockData = () => {
  // Default mock users
  let MOCK_USERS = [
    { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: '2', username: 'mod', password: 'mod123', role: 'moderator', name: 'Moderator User' },
    { id: '3', username: 'user1', password: 'user123', role: 'user', name: 'Regular User' },
  ];

  // Default mock posts
  let MOCK_POSTS = [
    { id: '1', title: 'First Post', content: 'This is the first post content', userId: '3', username: 'Regular User', createdAt: new Date().toISOString() },
    { id: '2', title: 'Moderation Post', content: 'This post is from a moderator', userId: '2', username: 'Moderator User', createdAt: new Date().toISOString() },
    { id: '3', title: 'Admin Announcement', content: 'Important announcement from admin', userId: '1', username: 'Admin User', createdAt: new Date().toISOString() },
  ];

  // Default ID counters
  let nextUserId = 4;
  let nextPostId = 4;

  // Only attempt localStorage access in browser
  if (isBrowser) {
    try {
      // Check if we already have data in localStorage
      const storedUsers = localStorage.getItem('mockUsers');
      const storedPosts = localStorage.getItem('mockPosts');
      const storedUserIdCounter = localStorage.getItem('nextUserId');
      const storedPostIdCounter = localStorage.getItem('nextPostId');
      
      // Use stored data if available
      if (storedUsers) {
        MOCK_USERS = JSON.parse(storedUsers);
      }
      
      if (storedPosts) {
        MOCK_POSTS = JSON.parse(storedPosts);
      }
      
      if (storedUserIdCounter) {
        nextUserId = parseInt(storedUserIdCounter);
      }
      
      if (storedPostIdCounter) {
        nextPostId = parseInt(storedPostIdCounter);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }

  return { MOCK_USERS, MOCK_POSTS, nextUserId, nextPostId };
};

// Initialize or load data
const { MOCK_USERS, MOCK_POSTS } = initMockData();
let { nextUserId, nextPostId } = initMockData();

// Save data to localStorage
const saveData = () => {
  if (isBrowser) {
    try {
      localStorage.setItem('mockUsers', JSON.stringify(MOCK_USERS));
      localStorage.setItem('mockPosts', JSON.stringify(MOCK_POSTS));
      localStorage.setItem('nextUserId', nextUserId.toString());
      localStorage.setItem('nextPostId', nextPostId.toString());
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

// Helper to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate a unique ID for posts
const generateUniquePostId = () => {
  const id = String(nextPostId++);
  saveData(); // Save counter update
  return id;
};

// Helper to generate a unique ID for users
const generateUniqueUserId = () => {
  const id = String(nextUserId++);
  saveData(); // Save counter update
  return id;
};

// Check for and fix any duplicate IDs
const checkAndFixDuplicateIds = () => {
  // First approach: Check for duplicate IDs
  const idCounts = {};
  const duplicateIds = [];
  
  // Count occurrences of each ID
  MOCK_POSTS.forEach(post => {
    idCounts[post.id] = (idCounts[post.id] || 0) + 1;
    if (idCounts[post.id] > 1) {
      duplicateIds.push(post.id);
    }
  });
  
  // Get unique duplicate IDs
  const uniqueDuplicateIds = [...new Set(duplicateIds)];
  
  if (uniqueDuplicateIds.length > 0) {
    console.warn(`Found duplicate post IDs: ${uniqueDuplicateIds.join(', ')}`);
    
    // Create a new array to hold fixed posts
    const fixedPosts = [];
    const seenIds = new Set();
    
    // Process each post
    MOCK_POSTS.forEach(post => {
      // If it's a duplicate ID and we've seen this ID before, generate a new ID
      if (uniqueDuplicateIds.includes(post.id) && seenIds.has(post.id)) {
        const newId = generateUniquePostId();
        console.log(`Reassigning post ID from ${post.id} to ${newId}`);
        fixedPosts.push({ ...post, id: newId });
      } else {
        // Otherwise, keep the post as is and mark its ID as seen
        seenIds.add(post.id);
        fixedPosts.push(post);
      }
    });
    
    // Replace the MOCK_POSTS array with the fixed version
    MOCK_POSTS.length = 0;
    MOCK_POSTS.push(...fixedPosts);
    
    // Make sure nextPostId is greater than any existing post ID
    const maxId = Math.max(...MOCK_POSTS.map(p => parseInt(p.id) || 0));
    nextPostId = Math.max(nextPostId, maxId + 1);
    console.log(`Updated nextPostId to ${nextPostId}`);
    
    // Save changes
    saveData();
  }

  // Remove any malformed posts (just in case)
  const validPosts = MOCK_POSTS.filter(post => post && post.id && post.title && post.content);
  if (validPosts.length !== MOCK_POSTS.length) {
    MOCK_POSTS.length = 0;
    MOCK_POSTS.push(...validPosts);
    saveData();
  }
};

// Run check on initial load in browser environment
if (isBrowser) {
  // Use setTimeout to ensure this runs after hydration
  setTimeout(() => {
    checkAndFixDuplicateIds();
  }, 0);
}

// Auth API
export const authAPI = {
  login: async (username, password) => {
    await delay(500); // Simulate network delay
    
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid credentials' };
  },
  
  register: async (userData) => {
    await delay(500);
    
    // Check if username exists
    if (MOCK_USERS.some((u) => u.username === userData.username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Create new user with unique ID
    const newUser = {
      id: generateUniqueUserId(),
      username: userData.username,
      password: userData.password,
      role: 'user', // Default role
      name: userData.name || userData.username,
    };
    
    MOCK_USERS.push(newUser);
    saveData(); // Save changes
    
    const { password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  },
};

// Posts API
export const postsAPI = {
  getPosts: async () => {
    await delay(300);
    // Check for any duplicates before returning
    if (isBrowser) {
      checkAndFixDuplicateIds();
    }
    console.log('Fetching posts, current count:', MOCK_POSTS.length);
    return { success: true, posts: MOCK_POSTS };
  },
  
  createPost: async (postData, userId, username) => {
    await delay(400);
    
    const newPost = {
      id: generateUniquePostId(),
      title: postData.title,
      content: postData.content,
      userId,
      username,
      createdAt: new Date().toISOString(),
    };
    
    console.log('Creating new post:', newPost);
    MOCK_POSTS.push(newPost);
    saveData(); // Save changes
    console.log('MOCK_POSTS length after adding:', MOCK_POSTS.length);
    
    return { success: true, post: newPost };
  },
  
  updatePost: async (postId, postData) => {
    await delay(400);
    
    const postIndex = MOCK_POSTS.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return { success: false, message: 'Post not found' };
    }
    
    MOCK_POSTS[postIndex] = {
      ...MOCK_POSTS[postIndex],
      title: postData.title,
      content: postData.content,
    };
    
    saveData(); // Save changes
    return { success: true, post: MOCK_POSTS[postIndex] };
  },
  
  deletePost: async (postId) => {
    await delay(400);
    
    const postIndex = MOCK_POSTS.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return { success: false, message: 'Post not found' };
    }
    
    const filteredPosts = MOCK_POSTS.filter((p) => p.id !== postId);
    MOCK_POSTS.length = 0;
    MOCK_POSTS.push(...filteredPosts);
    
    saveData(); // Save changes
    return { success: true };
  },
};

// User management API (admin only)
export const userAPI = {
  getUsers: async () => {
    await delay(500);
    
    const usersWithoutPasswords = MOCK_USERS.map(({ password, ...user }) => user);
    return { success: true, users: usersWithoutPasswords };
  },
  
  updateUserRole: async (userId, newRole) => {
    await delay(500);
    
    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }
    
    MOCK_USERS[userIndex].role = newRole;
    saveData(); // Save changes
    
    const { password, ...userWithoutPassword } = MOCK_USERS[userIndex];
    return { success: true, user: userWithoutPassword };
  },
  
  deleteUser: async (userId) => {
    await delay(500);
    
    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }
    
    const filteredUsers = MOCK_USERS.filter((u) => u.id !== userId);
    MOCK_USERS.length = 0;
    MOCK_USERS.push(...filteredUsers);
    
    const filteredPosts = MOCK_POSTS.filter((p) => p.userId !== userId);
    MOCK_POSTS.length = 0;
    MOCK_POSTS.push(...filteredPosts);
    
    saveData(); // Save changes
    
    return { success: true };
  },
}; 