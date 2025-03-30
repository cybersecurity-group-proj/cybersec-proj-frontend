import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

let accessTokenMemory = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});


axiosInstance.interceptors.request.use(async (config) => {

  if (config.authRequired === false) return config;

  if (typeof window !== 'undefined') {
    if (!accessTokenMemory) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.get(`${BASE_URL}/auth/refresh_token`, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const { access_token } = res.data;
          accessTokenMemory = access_token;
          console.log('Refreshed access token');
        } catch (err) {
          console.error('Refresh failed', err);
        }
      } else {
        console.warn('No refresh token found');
      }
    }
  }

  if (typeof window !== 'undefined' && accessTokenMemory) {
    config.headers.Authorization = `Bearer ${accessTokenMemory}`;
  }
  return config;
});

// Handle token expiration and retry logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;
      console.log(error.response?.status)
      if (isRefreshing) {
        
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refresh_token');

      try {
        const res = await axios.get(`${BASE_URL}/auth/refresh_token`,  {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        }});

        const { access_token } = res.data;

        accessTokenMemory = access_token;

        processQueue(null, access_token);

        originalRequest.headers.Authorization = 'Bearer ' + access_token;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('refresh_token');
        alert('Your session has expired. Please log in again.');
        window.location.href = '/auth/signin'
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      },
      {authRequired: false});

      const { access_token, refresh_token, user } = response.data;

      accessTokenMemory = access_token;
      localStorage.setItem('refresh_token', refresh_token);
    

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Login failed',
      };
    }
  },

  register: async ({ username, password, name }) => {
    try {
      const response = await axiosInstance.post('/auth/signup', {
        username,
        password,
        name,
      },
      {authRequired: false});

      const { access_token, refresh_token, user } = response.data;

      accessTokenMemory = access_token;
      localStorage.setItem('refresh_token', refresh_token);


      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Registration failed',
      };
    }
  },

  logout: async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        await axiosInstance.get('/auth/logout', { headers: {
          Authorization: `Bearer ${refresh_token}`,
        }});
      }
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      accessTokenMemory = null;
      localStorage.removeItem('refresh_token');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/current');


      return { success: true, user: response.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Failed to fetch user data',
      };
    }
  },
  

  getAccessToken: () => accessTokenMemory,

  setAccessToken: (token) => {
    accessTokenMemory = token;
  },
};


export const postsAPI = {
  getPosts: async () => {
    try {
      const res = await axiosInstance.get('/posts', {authRequired: false});

      const posts = res.data.map((post) => ({
        id: post.uid,
        title: post.title,
        content: post.text, 
        userId: post.author.uid, 
        username: post.author.name,
        createdAt: post.time, 
      }));
      return { success: true, posts};
    } catch (err) {
      return { success: false, message: 'Failed to fetch posts' };
    }
  },

  createPost: async ({ title, content }) => {
    try {
      const res = await axiosInstance.post('/posts', { 
        title,
        text:content 
      });
      return { success: true, post: res.data };
    } catch (err) {
      return { success: false, message: 'Failed to create post' };
    }
  },

  updatePost: async (postId, { title, content }) => {
    try {
      const res = await axiosInstance.put(`/posts/${postId}`, { title, content });
      return { success: true, post: res.data };
    } catch (err) {
      return { success: false, message: 'Failed to update post' };
    }
  },

  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Failed to delete post' };
    }
  },
};