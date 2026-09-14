// Guarda pra onde voltar depois do login — ver "Voltar para onde estava"
// em docs/design/AUTENTICACAO.md e CONTEXT.md. /entrar e /cadastro
// guardam ?redirect= num cookie ao carregar; o servidor lê o mesmo
// cookie ao terminar o login e manda a pessoa de volta pra lá.
export const NOME_COOKIE_POS_LOGIN = 'toka_pos_login'

// só aceita caminho interno — bloqueia URL absoluta ou
// protocolo-relativa (//evil.com), que seria um open redirect
export function caminhoInternoSeguro(valor: unknown): string | null {
  if (typeof valor !== 'string' || !valor.startsWith('/') || valor.startsWith('//')) return null
  return valor
}
