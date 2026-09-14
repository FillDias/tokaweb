const NOME_PROVEDOR: Record<string, string> = {
  google: 'Google',
  line: 'Line',
  apple: 'Apple',
  email: 'Email e senha'
}

export function nomeProvedor(provedor: string): string {
  return NOME_PROVEDOR[provedor] ?? provedor
}
