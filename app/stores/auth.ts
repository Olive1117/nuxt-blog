import type { ApiResponse, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string>('')
  const showLoginDialog = ref<boolean>(false)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  const openLogin = () => {
    showLoginDialog.value = true
  }

  const closeLogin = () => {
    showLoginDialog.value = false
  }
  const login = async (credentials: { username: string; password: string }) => {
    const config = useRuntimeConfig()
    const res = await $fetch<ApiResponse<AuthResponse>>(`${config.public.apiClientBase}/login`, {
      method: 'POST',
      body: credentials,
    })
    token.value = res.data.access_token
    console.log('登录成功')

    showLoginDialog.value = false
  }

  const logout = () => {
    token.value = ''
  }
  return {
    token,
    showLoginDialog,
    isLoggedIn,
    openLogin,
    closeLogin,
    login,
    logout,
  }
})
