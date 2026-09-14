import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const TAMANHO_CHAVE = 64

export async function hashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const chave = (await scrypt(senha, salt, TAMANHO_CHAVE)) as Buffer
  return `${salt}:${chave.toString('hex')}`
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  const [salt, chaveHex] = hash.split(':')
  const chaveArmazenada = Buffer.from(chaveHex, 'hex')
  const chaveDigitada = (await scrypt(senha, salt, chaveArmazenada.length)) as Buffer
  return timingSafeEqual(chaveDigitada, chaveArmazenada)
}
