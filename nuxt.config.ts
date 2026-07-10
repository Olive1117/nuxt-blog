// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/app.css'],
  modules: [
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@comark/nuxt',
  ],
  devServer: { port: 3000 },
  runtimeConfig: {
    apiServerBase: 'http://localhost:8080/api/v1',

    public: {
      apiClientBase: '/api/v1',
    },
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    dataValue: 'theme',
  },
  routeRules: {
    '/': { prerender: true },
    '/blog/post/**': {
      cache: {
        swr: true,
        maxAge: 60 * 60,
        staleMaxAge: 60,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['reka-ui', 'reka-ui/namespaced'],
    },
  },
  nitro: {
    devProxy: {
      '/api/v1': {
        target: 'http://localhost:8080/api/v1',
        changeOrigin: true,
        cookieDomainRewrite: { '*': 'localhost' },
      },
    },
  },
})