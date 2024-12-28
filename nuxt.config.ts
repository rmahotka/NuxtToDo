// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: "NuxtToDo",
    },
  },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Nunito: {
        wght: "400..900",
      },
    },
  },
})
