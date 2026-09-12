import { normalizarCodigo } from './codigoNorm'

export function extrairCodigoDoSlug(slug: string): string {
  return slug.split('-').at(-1)!.toUpperCase()
}

export function montarSlug(fabricante: string, nome: string, codigo: string): string {
  const texto = `${fabricante} ${nome}`
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `${texto}-${normalizarCodigo(codigo).toLowerCase()}`
}
