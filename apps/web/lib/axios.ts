import axios from "axios";

// Create axios instance for the user API
export const APIUSER = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_APP_URL_AI_USER,
});

// Create axios instance for the dialer API
export const APIUSERDIAL = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_APP_URL_AI_USER_DIAL,
});

// Create axios instance for the knowledge AI API
export const AIUSER = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_APP_URL_KAI_USER,
});

// Create axios instance for the Inteliconvo API
export const INTELICONVOAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_APP_URL_INTELICONVO_API,
});
