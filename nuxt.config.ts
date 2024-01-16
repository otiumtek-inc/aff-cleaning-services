// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  colorMode: {
    preference: 'light'
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui'
  ],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  components: [{ path: '~/components', pathPrefix: false }],
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm'
    }
  }
})
