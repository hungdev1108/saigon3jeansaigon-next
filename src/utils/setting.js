const config = {
  development: {
    baseURL: 'http://localhost:5000',
    timeout: 5000
  },
  production: {
    baseURL: 'https://saigon3jeansaigon.com',
    timeout: 10000
  }
};

const environment = process.env.NODE_ENV || 'development';

export const API_CONFIG = config[environment];
export const BACKEND_DOMAIN = config[environment].baseURL;
