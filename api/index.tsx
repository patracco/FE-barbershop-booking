import axios, { AxiosRequestConfig } from 'axios';

// Using __DEV__ to determine the environment in React Native
const baseApiUrl = !__DEV__
  ? 'https://server.performtraining.it/api/v1/'
  : 'http://localhost:3000/api/v1/';

const config: AxiosRequestConfig = {
  baseURL: baseApiUrl,
  // Additional Axios configuration options can go here
};

export const axiosInstance = axios.create(config);
