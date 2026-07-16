// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  app: {
    head: {
      title: '首页',
      titleTemplate: '%s - 小榄博客',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  $production: {
    devtools: { enabled: false },
    vite: {
      esbuild: {
        drop: ['debugger', 'console'],
      },
    },
  },
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
    'nuxt-codemirror',
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
    '/': { isr: true },
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
