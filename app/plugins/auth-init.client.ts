export default defineNuxtPlugin(() => {
  const auth_store = useAuthStore()
  console.log('客户端加载token', auth_store.token)
})
