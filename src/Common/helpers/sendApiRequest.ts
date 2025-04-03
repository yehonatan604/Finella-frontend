import axios from 'axios';
import { HTTPMethodTypes } from '../types/HTTPMethodTypes';
const { VITE_BASE_API_URL: URL } = import.meta.env;

axios.defaults.baseURL = URL;

const sendApiRequest = async (url: string, method: HTTPMethodTypes, data?: unknown) => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["auth-token"] = token;
    return await axios({ url, method, data });
};

export { sendApiRequest };