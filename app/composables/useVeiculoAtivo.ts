import type { VeiculoAtivo } from '~~/shared/veiculo'

const UM_ANO_EM_SEGUNDOS = 60 * 60 * 24 * 365

export function useVeiculoAtivo() {
  return useCookie<VeiculoAtivo | null>('veiculo-ativo', {
    default: () => null,
    maxAge: UM_ANO_EM_SEGUNDOS,
    sameSite: 'lax'
  })
}
