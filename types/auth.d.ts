declare module '#auth-utils' {
  interface User {
    id: string
    email: string | null
    nome: string | null
    avatarUrl: string | null
    cep: string | null
    telefone: string | null
    perfilLembreteDispensado: boolean
  }
}

export {}
