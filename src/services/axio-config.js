import axios from 'axios';

export const BASE_URL = "http://localhost:3000/";
// export const BASE_URL = 'https://test.tix86.com/';
const instance = axios.create({
  baseURL:BASE_URL
});

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     // config.headers['x-access-token'] = token;
//   }
//   return config; +1 858 699 0029
// });

instance.interceptors.request.use(request => {
  const accessToken = localStorage.getItem('accessToken');
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
    console.log(error);

    if(error['code'] == "ERR_NETWORK") {
      throw error;
    }
    
    if(error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      window.location.href = '/signin';

      // try {
      //   const refreshToken = localStorage.getItem("refreshToken");
      //   const response = await axios.post(`${BASE_URL}refresh`, {refresh:refreshToken});

      //   let { access, refresh } = response.data;

      //   // let accessToken
      //   localStorage.setItem('accessToken', access);
      //   localStorage.setItem('refreshToken', refresh);

      //   // Update the authorization header with the new access token.
      //   instance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // } catch (error) {
      //   console.error('Token refresh failed:', error);
        
      //   localStorage.removeItem("user");
      //   localStorage.removeItem("accessToken");
      //   localStorage.removeItem("refreshToken");

      //   window.location.href = '/signin';
      //   return Promise.reject(error);
      // }
    }

    return Promise.reject(error);
  }
)

export default instance;