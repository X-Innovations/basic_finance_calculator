import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const baseURL = `${import.meta.env.VITE_API_DOMAIN}${import.meta.env.VITE_API_PATH}`

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    })

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error) => {
        // could track errors with a dedicated API
        console.error(`${error}`)
        return Promise.reject(error)
    }
)

export default api