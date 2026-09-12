// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  routeRules: {
    '/': { prerender: true },
    '/peca/**': { isr: 60 * 60 * 12 }, // catálogo: estático
    '/buscar': { ssr: true },
    '/garagem/**': { ssr: true }, // área logada: dinâmica
    '/admin/**': { ssr: false } // painel: SPA
  }
})
