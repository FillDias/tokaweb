import { entrarOuCriarUsuario } from '~~/server/database/queries/usuario'

// Em espera: exige conta de desenvolvedor Apple paga (99 USD/ano).
// Sem NUXT_OAUTH_APPLE_CLIENT_ID/TEAM_ID/KEY_ID/PRIVATE_KEY, essa
// rota nunca é alcançada — o botão não aparece (ver CONTEXT.md e
// nuxt.config.ts, authAppleHabilitado)
export default defineOAuthAppleEventHandler({
  async onSuccess(event, { user, payload }) {
    const nome = user.name ? `${user.name.firstName ?? ''} ${user.name.lastName ?? ''}`.trim() || null : null

    const usuarioLogado = await entrarOuCriarUsuario('apple', {
      idExterno: payload.sub,
      email: user.email ?? payload.email ?? null,
      nome
    })

    await setUserSession(event, { user: usuarioLogado })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Erro no login com Apple:', error)
    return sendRedirect(event, '/entrar?erro=apple')
  }
})
