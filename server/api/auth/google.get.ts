import { entrarOuCriarUsuario } from '~~/server/database/queries/usuario'

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile']
  },
  async onSuccess(event, { user }) {
    const usuarioLogado = await entrarOuCriarUsuario('google', {
      idExterno: user.sub,
      email: user.email,
      nome: user.name,
      avatarUrl: user.picture
    })

    await setUserSession(event, { user: usuarioLogado })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Erro no login com Google:', error)
    return sendRedirect(event, '/entrar?erro=google')
  }
})
