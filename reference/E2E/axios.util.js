import axios from "axios";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";

// Create axios instance for the user API
const APIUSER = axios.create({
  baseURL: process.env.REACT_APP_SERVER_APP_URL_AI_USER, // Using process.env for React project
});
// Create axios instance for the user API
const APIUSERDIAL = axios.create({
  baseURL: process.env.REACT_APP_SERVER_APP_URL_AI_USER_DIAL, // Using process.env for React project
});

// Create axios instance for the knowledge AI API
const AIUSER = axios.create({
  baseURL: process.env.REACT_APP_SERVER_APP_URL_KAI_USER, // Using process.env for React project
});
// Create axios instance for the knowledge AI API
const INTELICONVOAPI = axios.create({
  baseURL: process.env.REACT_APP_SERVER_APP_URL_INTELICONVO_API, // Using process.env for React project
});

export { APIUSER, APIUSERDIAL, AIUSER, INTELICONVOAPI };
