// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],
  routeRules: {
    '/': { ssr: true }, // feed de instalações recentes — não pode ser estático
    '/peca/**': { isr: 60 * 60 * 12 }, // catálogo: estático
    '/buscar': { ssr: true },
    '/garagem/**': { ssr: true }, // área logada: dinâmica
    '/admin/**': { ssr: false } // painel: SPA
  },
  runtimeConfig: {
    public: {
      // botão de um provedor só aparece se a credencial existir — ver CONTEXT.md
      authAppleHabilitado: !!process.env.NUXT_OAUTH_APPLE_CLIENT_ID
    }
  }
})
