<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
import IconeGoogle from '~/components/base/IconeGoogle.vue'
import IconeLine from '~/components/base/IconeLine.vue'
import BlocoConflitoEmail from '~/components/auth/BlocoConflitoEmail.vue'
import { nomeProvedor } from '~~/shared/provedores'
import { NOME_COOKIE_POS_LOGIN, caminhoInternoSeguro } from '~~/shared/redirecionamento'

definePageMeta({ layout: 'isolada' })

const route = useRoute()
const config = useRuntimeConfig()

// guarda pra onde voltar depois do login — restaurado no servidor ao
// terminar qualquer um dos caminhos (social ou email). Ver "Voltar
// para onde estava" em docs/design/AUTENTICACAO.md
const destino = caminhoInternoSeguro(route.query.redirect)
if (destino) {
  useCookie(NOME_COOKIE_POS_LOGIN, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 10 }).value = destino
}

const linkCadastro = computed(() => (destino ? `/cadastro?redirect=${encodeURIComponent(destino)}` : '/cadastro'))

const codigoErro = computed(() => route.query.erro as string | undefined)
const conflitoEmail = computed(() =>
  codigoErro.value === 'email-existe'
    ? { provedor: route.query.provedor as string, email: (route.query.email as string) ?? null }
    : null
)
const credencialInvalida = computed(() => codigoErro.value === 'login-invalido')

const erroSocial = computed(() => {
  if (!codigoErro.value || conflitoEmail.value || credencialInvalida.value) return null
  const mensagens: Record<string, string> = {
    google: 'Não deu pra entrar com o Google. Tenta de novo.',
    line: 'Não deu pra entrar com o Line. Tenta de novo.',
    apple: 'Não deu pra entrar com a Apple. Tenta de novo.'
  }
  return mensagens[codigoErro.value] ?? 'Não deu pra entrar. Tenta de novo.'
})

useSeoMeta({ title: 'Entrar | TOKA', robots: 'noindex' })
</script>

<template>
  <div class="w-full max-w-[360px]">
    <p class="text-center text-[13px] text-mute mb-6">Entre para registrar suas peças</p>

    <div class="bg-paper border-[0.5px] border-line rounded-xl p-6">
      <p v-if="erroSocial" class="text-shu text-[13px] text-center mb-4">{{ erroSocial }}</p>
      <BlocoConflitoEmail v-if="conflitoEmail" :provedor="conflitoEmail.provedor" :email="conflitoEmail.email" />

      <div class="flex flex-col gap-2">
        <Botao href="/api/auth/google" variante="ghost" chapado class="h-11 gap-2 !border-[#DADCE0]">
          <IconeGoogle />
          Entrar com Google
        </Botao>
        <Botao href="/api/auth/line" variante="ghost" chapado class="h-11 gap-2 !bg-[#06C755] !border-[#06C755] !text-white">
          <IconeLine />
          Entrar com Line
        </Botao>
        <Botao
          v-if="config.public.authAppleHabilitado"
          href="/api/auth/apple"
          variante="ghost"
          chapado
          class="h-11 !bg-sumi !border-sumi !text-white"
        >
          Entrar com Apple
        </Botao>
      </div>

      <div class="flex items-center gap-3 my-5 text-[12px] text-mute">
        <div class="flex-1 h-px bg-line" />
        ou com email
        <div class="flex-1 h-px bg-line" />
      </div>

      <form method="post" action="/api/auth/email/login" class="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
        >
        <input
          name="senha"
          type="password"
          placeholder="Senha"
          required
          class="h-10 border rounded-lg px-3 text-[14px] focus:outline-none"
          :class="credencialInvalida ? 'border-shu' : 'border-line focus:border-ki'"
        >
        <p v-if="credencialInvalida" class="text-shu text-[12.5px]">Email ou senha incorretos. Tente de novo.</p>
        <Botao type="submit" chapado class="h-11">Entrar</Botao>
      </form>
    </div>

    <p class="text-center text-[13px] text-mute mt-4">
      Ainda não tem conta? <a :href="linkCadastro" class="underline text-ki-txt decoration-2">Cadastre-se</a>
    </p>
  </div>
</template>
