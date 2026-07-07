export default defineNuxtPlugin(() => {
  const { token } = useAuth()
  const api = $fetch.create({
    onRequest({ request, options }) {
      if (token.value) {
        options.headers = options.headers || {}
        options.headers.append('Authorization', `Bearer ${token.value}`)
      }
      console.log('请求:', request, 'opt', options)
    },
    onResponse({ response, options }) {
      if (response.status === 401) {
        const { logout, openLogin } = useAuth()
        logout()
        openLogin()
      }
      console.log('响应:', response._data, 'opt', options.query)
    },
  })
  return {
    provide: {
      api,
    },
  }
})
