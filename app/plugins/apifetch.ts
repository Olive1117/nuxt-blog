export default defineNuxtPlugin(() => {
  const auth_store = useAuthStore()
  const api = $fetch.create({
    onRequest({ request, options }) {
      if (auth_store.token) {
        options.headers = options.headers || {}
        options.headers.append('Authorization', `Bearer ${auth_store.token}`)
      }
      console.log('请求:', request, 'opt', options)
    },
    onResponse({ response, options }) {
      if (response.status === 401) {
        auth_store.logout()
        auth_store.openLogin()
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
