import { AxiosInstance, default as ax } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

const axios: AxiosInstance = ax.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'http://localhost:4000',
});

axios.interceptors.request.use(
  (config) => {
    const token = getCookie('access-token');
    if (token) {
      config.headers!['x-access-token'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function replace(path: string, res: any) {
  if (typeof window !== 'undefined') {
    window.location.replace(path);
  }
  res.writeHead(302, { Location: path });
}
async function getRefreshToken() {
  return await ax({
    url: `http://localhost:4000/auth/refresh`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getCookie('refresh-token'),
    },
  });
}

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const refreshToken = getCookie('refresh-token');
    const accessToken = getCookie('access-token');
    if (!refreshToken) {
      console.log('No Refresh Token Available, Redirecting to login');
      setCookie(
        'redirect-reason',
        JSON.stringify({
          messages: 'Your session has expired.\n Please login again.',
          status: 401,
        })
      );
      Promise.reject(error);
      replace('/login', error.response);
    }

    console.log('Intercepted Error', error.request);
    if (error.request.responseURL.includes('auth/refresh')) {
      return Promise.reject(error);
    }
    // if error unauthorized check if refreshToken exists refresh it
    if (error.response?.status === 401 && refreshToken && !accessToken) {
      console.log('Refreshing token');
      //refresh token through /GET /auth/refresh
      const tokens = await fetch(`http://localhost:4000/auth/refresh`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + refreshToken,
        },
      })
        .then((res) => res.json())
        .catch((e) => {
          return Promise.reject(e);
        });
      //set new tokens in cookies
      setCookie('access-token', (tokens as any).accessToken);
      setCookie('refresh-token', (tokens as any).refreshToken);
      //retry request
      return axios.request(error.config);
    }

    console.log('Intercepted Error', error);
    return Promise.reject(error);
  }
);

export default axios;
