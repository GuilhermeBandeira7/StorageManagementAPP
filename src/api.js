import axios from 'axios'

const api = axios.create({
    //baseURL: "http://172.233.25.218:85"
    baseURL: "https://localhost:7245"
})

export default api;