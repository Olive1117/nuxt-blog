import type { ApiResponse, AuthResponse } from '~/types'

export default defineNuxtPlugin({
  name: 'auth-init',
  parallel: true,
  async setup() {
    const auth_store = useAuthStore()

    // 1. 服务端独有逻辑：刷 token
    if (import.meta.server) {
      const config = useRuntimeConfig()
      const headers = useRequestHeaders(['cookie'])
      const refreshCookie = headers.cookie || ''
      console.log('服务端插件加载')

      if (refreshCookie.includes('__refresh_token')) {
        try {
          const res = await $fetch<ApiResponse<AuthResponse>>(`${config.apiServerBase}/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { cookie: refreshCookie },
          })
          auth_store.token = res.data.access_token
          console.log('服务端加载token成功')
        } catch {
          /* empty */
        }
      }
    }

    // 2. 客户端独有逻辑
    if (import.meta.client) {
      console.log('客户端加载token', auth_store.token)
    }
  },
})
