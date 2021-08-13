import axios from "axios"

let baseURL = process.env.NEXT_PUBLIC_VERCEL_URL

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
    }
})

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        console.log("Unauthorized")
    }
    return error
})

export default axiosInstance