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


axiosInstance.interceptors.request.use((config) => {
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
        const res = await axios.post(`${API_BASE_URL}/auth/refresh_token`, {
          refresh_token: refreshToken,
        });

        const { access_token } = res.data;

        accessTokenMemory = access_token;

        processQueue(null, access_token);

        originalRequest.headers.Authorization = 'Bearer ' + access_token;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authAPI.logout(); 
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
      });

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
      });

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
        await axiosInstance.post('/auth/logout', { refresh_token });
      }
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      accessTokenMemory = null;
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
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
