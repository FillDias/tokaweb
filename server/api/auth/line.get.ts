// user.email não existe aqui: o endpoint de perfil da Line
// (v2/profile) não devolve email, mesmo com o escopo certo — ver
// CONTEXT.md
export default defineOAuthLineEventHandler({
  async onSuccess(event, { user }) {
    return processarLoginSocial(event, 'line', {
      idExterno: user.userId,
      nome: user.displayName,
      avatarUrl: user.pictureUrl
    })
  },
  onError(event, error) {
    console.error('Erro no login com Line:', error)
    return sendRedirect(event, '/entrar?erro=line')
  }
})
