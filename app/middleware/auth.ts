export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn, openLogin } = useAuthStore()
  if (!isLoggedIn) {
    openLogin()
    return navigateTo(from)
  }
})
