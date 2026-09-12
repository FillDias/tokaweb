export function extrairCodigoDoSlug(slug: string): string {
  return slug.split('-').at(-1)!.toUpperCase()
}
