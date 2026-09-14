import type { H3Event } from 'h3'
import { NOME_COOKIE_POS_LOGIN, caminhoInternoSeguro } from '~~/shared/redirecionamento'

// lê o destino guardado por /entrar ou /cadastro, apaga o cookie e
// devolve um caminho seguro — ou '/' se não havia nenhum
export function consumirRedirecionamento(event: H3Event): string {
  const guardado = getCookie(event, NOME_COOKIE_POS_LOGIN)
  if (guardado) deleteCookie(event, NOME_COOKIE_POS_LOGIN)
  return caminhoInternoSeguro(guardado) ?? '/'
}
