export type VeiculoAtivo = {
  marca: string
  modelo: string
  ano: number
  motor: string
}

const UM_ANO_EM_SEGUNDOS = 60 * 60 * 24 * 365

export function useVeiculoAtivo() {
  return useCookie<VeiculoAtivo | null>('veiculo-ativo', {
    default: () => null,
    maxAge: UM_ANO_EM_SEGUNDOS,
    sameSite: 'lax'
  })
}
