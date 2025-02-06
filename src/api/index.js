import axios from 'axios';

const api = axios.create({
  baseURL: 'https://67a06c8b24322f8329c62362.mockapi.io/',
});

api.interceptors.request.use((config) => {
  // handle before request is sent
  return config;
}, (error) => {
  // handle request error
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
     // handle response data
     return response;
    }, (error) => {
      // handle response un-authen error
    //   if (error.response.status === 401) {
    //     navigate("/");
    //   }
      return Promise.reject(error);
    });

export const getUsers = async () => {
  try {
    const response = await api.get('/User');
    console.log(response.data)
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPost = async () => {
  try {
    const response = await api.get('/Post')
    console.log(response.data)
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export default api;