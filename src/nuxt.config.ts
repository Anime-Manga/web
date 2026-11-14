// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },
  ssr: false,

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-06-30',

  runtimeConfig:{
    urlApi: process.env.URL_API || "http://127.0.0.1:3000/"
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
