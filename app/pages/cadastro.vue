<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
import IconeGoogle from '~/components/base/IconeGoogle.vue'
import IconeLine from '~/components/base/IconeLine.vue'
import BlocoConflitoEmail from '~/components/auth/BlocoConflitoEmail.vue'
import { cadastroManualSchema } from '~~/shared/schemas'
import { NOME_COOKIE_POS_LOGIN, caminhoInternoSeguro } from '~~/shared/redirecionamento'

definePageMeta({ layout: 'isolada' })

const route = useRoute()
const config = useRuntimeConfig()

const destino = caminhoInternoSeguro(route.query.redirect)
if (destino) {
  useCookie(NOME_COOKIE_POS_LOGIN, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 10 }).value = destino
}

const linkEntrar = computed(() => (destino ? `/entrar?redirect=${encodeURIComponent(destino)}` : '/entrar'))

const codigoErro = computed(() => route.query.erro as string | undefined)
const conflitoEmail = computed(() =>
  codigoErro.value === 'email-existe'
    ? { provedor: route.query.provedor as string, email: (route.query.email as string) ?? null }
    : null
)

const erroGeral = computed(() => {
  if (!codigoErro.value || conflitoEmail.value) return null
  const mensagens: Record<string, string> = {
    validacao: 'Confira os dados e tente de novo.',
    'email-em-uso': 'Você já tem uma conta com esse email. Entre.'
  }
  return mensagens[codigoErro.value] ?? 'Não deu pra completar o cadastro. Tenta de novo.'
})

const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const cep = ref('')
const telefone = ref('')
const erroValidacao = ref<string | null>(null)

function validarAntesDeEnviar(evento: Event) {
  const resultado = cadastroManualSchema.safeParse({
    email: email.value,
    senha: senha.value,
    confirmarSenha: confirmarSenha.value,
    cep: cep.value,
    telefone: telefone.value
  })

  if (!resultado.success) {
    evento.preventDefault()
    erroValidacao.value = resultado.error.issues[0]?.message ?? 'Confira os dados.'
  }
}

useSeoMeta({ title: 'Criar conta | TOKA', robots: 'noindex' })
</script>

<template>
  <div class="w-full max-w-[360px]">
    <p class="text-center text-[13px] text-mute mb-6">Entre para registrar suas peças</p>

    <div class="bg-paper border-[0.5px] border-line rounded-xl p-6">
      <p v-if="erroGeral" class="text-shu text-[13px] text-center mb-4">{{ erroGeral }}</p>
      <p v-if="erroValidacao" class="text-shu text-[13px] text-center mb-4">{{ erroValidacao }}</p>
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

      <p class="bg-ki-lo border border-ki-borda text-ki-txt text-[12px] rounded-lg px-3 py-2.5 my-4">
        Com o social leva um clique — você completa o resto depois.
      </p>

      <div class="flex items-center gap-3 my-5 text-[12px] text-mute">
        <div class="flex-1 h-px bg-line" />
        ou com email
        <div class="flex-1 h-px bg-line" />
      </div>

      <form
        method="post"
        action="/api/auth/email/cadastro"
        class="flex flex-col gap-3"
        @submit="validarAntesDeEnviar"
      >
        <input
          v-model="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
        >
        <input
          v-model="senha"
          name="senha"
          type="password"
          placeholder="mínimo 8 caracteres"
          required
          class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
        >
        <input
          v-model="confirmarSenha"
          name="confirmarSenha"
          type="password"
          placeholder="repita a senha"
          required
          class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
        >
        <div class="flex gap-2">
          <input
            v-model="cep"
            name="cep"
            placeholder="CEP"
            required
            class="h-10 w-[40%] border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
          >
          <input
            v-model="telefone"
            name="telefone"
            placeholder="Telefone (DDD + número)"
            required
            class="h-10 flex-1 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
          >
        </div>
        <Botao type="submit" chapado class="h-11">Criar conta</Botao>
        <p class="text-[11.5px] text-mute text-center">
          Ao criar conta você concorda com os termos de uso da TOKA.
        </p>
      </form>
    </div>

    <p class="text-center text-[13px] text-mute mt-4">
      Já tem conta? <a :href="linkEntrar" class="underline text-ki-txt decoration-2">Entrar</a>
    </p>
  </div>
</template>
