import { randomBytes } from 'node:crypto'
import { Resend } from 'resend'
import { definirTokenConfirmacaoEmail } from '~~/server/database/queries/usuario'

const VALIDADE_TOKEN_HORAS = 24

// Mesmo padrão do Apple: esqueleto pronto, ligado só quando a
// variável de ambiente existir. Plano gratuito do Resend cobre 3 mil
// emails por mês — ver CONTEXT.md
export function confirmacaoEmailHabilitada(): boolean {
  return !!process.env.RESEND_API_KEY
}

export async function enviarEmailConfirmacaoSeHabilitado(usuarioAlvo: { id: string; email: string | null }) {
  if (!confirmacaoEmailHabilitada() || !usuarioAlvo.email) return

  const token = randomBytes(32).toString('hex')
  const expiraEm = new Date(Date.now() + VALIDADE_TOKEN_HORAS * 60 * 60 * 1000)
  await definirTokenConfirmacaoEmail(usuarioAlvo.id, token, expiraEm)

  const resend = new Resend(process.env.RESEND_API_KEY)
  const url = `${process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/confirmar-email?token=${token}`

  await resend.emails.send({
    from: 'TOKA <nao-responda@toka.com.br>',
    to: usuarioAlvo.email,
    subject: 'Confirme seu email na TOKA',
    html: `<p>Clique pra confirmar seu email na TOKA: <a href="${url}">${url}</a></p>`
  })
}
