import { entrarOuCriarUsuario } from '~~/server/database/queries/usuario'

// user.email não existe aqui: o endpoint de perfil da Line
// (v2/profile) não devolve email, mesmo com o escopo certo — ver
// CONTEXT.md
export default defineOAuthLineEventHandler({
  async onSuccess(event, { user }) {
    const usuarioLogado = await entrarOuCriarUsuario('line', {
      idExterno: user.userId,
      nome: user.displayName,
      avatarUrl: user.pictureUrl
    })

    await setUserSession(event, { user: usuarioLogado })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Erro no login com Line:', error)
    return sendRedirect(event, '/entrar?erro=line')
  }
})
