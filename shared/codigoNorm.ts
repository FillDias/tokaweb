export function normalizarCodigo(valor: string): string {
  return valor.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}
