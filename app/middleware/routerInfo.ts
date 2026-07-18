export default defineNuxtRouteMiddleware((to, from) => {
  if (from && from.fullPath && from.fullPath !== '/') {
    const fromPath = useState('router:from', () => from.fullPath)
    const fromName = useState('router:name', () => from.meta.title)
    fromPath.value = from.fullPath
    fromName.value = from.meta.title
  }
})
