export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile']
  },
  async onSuccess(event, { user }) {
    return processarLoginSocial(event, 'google', {
      idExterno: user.sub,
      email: user.email,
      nome: user.name,
      avatarUrl: user.picture
    })
  },
  onError(event, error) {
    console.error('Erro no login com Google:', error)
    return sendRedirect(event, '/entrar?erro=google')
  }
})
