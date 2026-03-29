import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const userEmail = ref<string | null>(localStorage.getItem('user_email'))

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(accessToken: string, email: string) {
    token.value = accessToken
    userEmail.value = email
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('user_email', email)
  }

  function clearAuth() {
    token.value = null
    userEmail.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_email')
  }

  return { token, userEmail, isLoggedIn, setAuth, clearAuth }
})
