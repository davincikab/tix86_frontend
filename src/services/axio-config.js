import axios from 'axios';

export const BASE_URL = "http://localhost:3000/";
// export const BASE_URL = 'https://davincikab.pythonanywhere.com/';
const instance = axios.create({
  baseURL:BASE_URL
});

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     // config.headers['x-access-token'] = token;
//   }
//   return config;
// });

instance.interceptors.request.use(request => {
  const accessToken = localStorage.getItem('token');
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
}, error => {
  return Promise.reject(error);
});

// refresh token
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        const response = await axios.post("/api/v1/auth/refresh/", {refresh:refreshToken});

        console.log(response);
        let { access, refresh } = response.data;

        // let accessToken
        localStorage.setItem('token', access);
        localStorage.setItem('refresh', refresh);

        // Update the authorization header with the new access token.
        instance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');

        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)

export default instance;