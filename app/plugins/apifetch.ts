export default defineNuxtPlugin({
  name: 'apifetch-create',
  dependsOn: ['auth-init'],
  async setup() {
    const config = useRuntimeConfig()
    const baseURL = import.meta.server ? config.apiServerBase : config.public.apiClientBase
    const auth_store = useAuthStore()
    console.log('api创建', baseURL)
    const api = $fetch.create({
      baseURL,
      onRequest({ request, options }) {
        console.log('请求:', request, 'opt', options.body)
        // console.log('请求:', request)

        options.headers = options.headers || {}
        const headers =
          options.headers instanceof Headers ? options.headers : new Headers(options.headers)
        if (auth_store.token) {
          headers.set('Authorization', `Bearer ${auth_store.token}`)
        } else {
          headers.delete('Authorization')
        }
        options.headers = headers
      },
      onResponse({ response, options }) {
        if (response.status === 401) {
          auth_store.logout()
          auth_store.openLogin()
        }
        // console.log('响应:', response._data, 'opt', options.query)
      },
    })
    return {
      provide: {
        api,
      },
    }
  },
})
