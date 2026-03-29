import api from '@/services/api'

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export const authService = {
  register(userData: RegisterPayload) {
    return api.post('/auth/register', userData)
  },

  // OPTION 1: Sending standard JSON
  async login(email: string, password: string) {
    // We send a normal object here, Axios converts it to JSON automatically
    const response = await api.post('/auth/login', {
      email: email,
      password: password,
    })

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
    }
    return response
  },

  logout() {
    localStorage.removeItem('access_token')
  },
}
