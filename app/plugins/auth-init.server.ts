import type { ApiResponse, AuthResponse } from '~/types'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const auth_store = useAuthStore()
  const headers = useRequestHeaders(['cookie'])
  const refreshCookie = headers.cookie || ''
  console.log('注册插件加载')

  if (refreshCookie.includes('__refresh_token'))
    try {
      const res = await $fetch<ApiResponse<AuthResponse>>(`${config.apiServerBase}/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { cookie: refreshCookie },
      })
      auth_store.token = res.data.access_token
      console.log('服务端加载token', auth_store.token)
    } catch {
      /* empty */
    }
})
