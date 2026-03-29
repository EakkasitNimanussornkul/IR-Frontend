import axios from 'axios'
import router from '../router'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: clear token
      localStorage.removeItem('access_token')

      // Redirect to login
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default api
