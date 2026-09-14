<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
import { completarPerfilSchema, criarSenhaSchema } from '~~/shared/schemas'
import { nomeProvedor } from '~~/shared/provedores'

definePageMeta({ layout: 'isolada' })

const route = useRoute()
const config = useRuntimeConfig()

const { data, error } = await useFetch('/api/conta')
if (error.value) {
  await navigateTo('/entrar')
}

const nome = ref(data.value?.usuario.nome ?? '')
const cep = ref(data.value?.usuario.cep ?? '')
const telefone = ref(data.value?.usuario.telefone ?? '')
const erroValidacao = ref<string | null>(null)

const provedoresVinculados = computed(() => new Set(data.value?.contas.map((c) => c.provedor) ?? []))

// email só é editável de verdade quando a conta nasceu por provedor
// social — se veio do cadastro manual, o email É a identidade do
// login e mexer nele fica pra outra etapa. Ver Tela 7 em
// docs/design/AUTENTICACAO.md
const emailDeOrigemSocial = computed(() => !provedoresVinculados.value.has('email'))

const mensagem = computed(() => {
  if (route.query.erro === 'ja-vinculada') return 'Essa conta já está vinculada a outro usuário.'
  if (route.query.erro === 'validacao') return 'Confira o CEP e o telefone.'
  if (route.query.erro === 'sem-email') return 'Sua conta não tem email cadastrado — entre por um provedor com email pra criar senha.'
  if (route.query.erro === 'validacao-senha') return 'Confira a senha e tente de novo.'
  if (route.query.vinculado) return 'Conta vinculada com sucesso.'
  return null
})

function validarAntesDeEnviar(evento: Event) {
  const resultado = completarPerfilSchema.safeParse({ cep: cep.value, telefone: telefone.value })
  if (!resultado.success) {
    evento.preventDefault()
    erroValidacao.value = resultado.error.issues[0]?.message ?? 'Confira os dados.'
  }
}

const provedoresSociais = computed(() =>
  ['google', 'line', ...(config.public.authAppleHabilitado ? ['apple'] : [])] as const
)

const mostrarFormSenha = ref(false)
const novaSenha = ref('')
const confirmarNovaSenha = ref('')
const erroSenha = ref<string | null>(null)

function validarSenhaAntesDeEnviar(evento: Event) {
  const resultado = criarSenhaSchema.safeParse({ senha: novaSenha.value, confirmarSenha: confirmarNovaSenha.value })
  if (!resultado.success) {
    evento.preventDefault()
    erroSenha.value = resultado.error.issues[0]?.message ?? 'Confira a senha.'
  }
}

useSeoMeta({ title: 'Minha conta | TOKA', robots: 'noindex' })
</script>

<template>
  <div class="w-full max-w-[520px]">
    <h1 class="font-titulo text-2xl">Minha conta</h1>
    <p class="text-mute text-[13.5px] mb-6">Seus dados e formas de entrar</p>

    <p v-if="mensagem" class="text-[13.5px] mb-4">{{ mensagem }}</p>
    <p v-if="erroValidacao" class="text-shu text-[13.5px] mb-4">{{ erroValidacao }}</p>

    <section class="bg-paper border-[0.5px] border-line rounded-xl p-5 mb-5">
      <h2 class="font-bold text-sm mb-3">Dados</h2>
      <form method="post" action="/api/conta" class="flex flex-col gap-3" @submit="validarAntesDeEnviar">
        <div class="grid grid-cols-2 gap-3">
          <label class="flex flex-col gap-1">
            <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">Nome</span>
            <input v-model="nome" name="nome" class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">Email</span>
            <input
              :value="data?.usuario.email ?? 'sem email cadastrado'"
              disabled
              class="h-10 border border-line rounded-lg px-3 text-[14px] text-mute"
              :class="emailDeOrigemSocial ? 'bg-surface' : ''"
            >
          </label>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex flex-col gap-1">
            <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">CEP</span>
            <input
              v-model="cep"
              name="cep"
              class="h-10 rounded-lg px-3 text-[14px] focus:outline-none"
              :class="cep ? 'border border-line focus:border-ki' : 'border border-ki'"
            >
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">Telefone</span>
            <input
              v-model="telefone"
              name="telefone"
              class="h-10 rounded-lg px-3 text-[14px] focus:outline-none"
              :class="telefone ? 'border border-line focus:border-ki' : 'border border-ki'"
            >
          </label>
        </div>
        <Botao type="submit" chapado class="h-11 self-start">Salvar alterações</Botao>
      </form>
    </section>

    <section class="bg-paper border-[0.5px] border-line rounded-xl p-5">
      <h2 class="font-bold text-sm mb-3">Formas de entrar</h2>
      <ul class="divide-y divide-line">
        <li v-for="provedor in provedoresSociais" :key="provedor" class="py-2.5 flex items-center justify-between text-[14.5px]">
          <span>{{ nomeProvedor(provedor) }}</span>
          <span v-if="provedoresVinculados.has(provedor)" class="text-seiji bg-seiji-lo text-[12px] font-bold rounded-md px-2.5 py-1">
            Conectado
          </span>
          <Botao v-else :href="`/api/auth/${provedor}`" variante="ghost" class="!py-1.5 !px-3 text-[12.5px]">
            Vincular
          </Botao>
        </li>
        <li class="py-2.5 flex items-center justify-between text-[14.5px]">
          <span>{{ nomeProvedor('email') }}</span>
          <span v-if="provedoresVinculados.has('email')" class="text-seiji bg-seiji-lo text-[12px] font-bold rounded-md px-2.5 py-1">
            Conectado
          </span>
          <Botao
            v-else-if="data?.usuario.email"
            type="button"
            variante="ghost"
            class="!py-1.5 !px-3 text-[12.5px]"
            @click="mostrarFormSenha = !mostrarFormSenha"
          >
            Criar senha
          </Botao>
        </li>
      </ul>

      <form
        v-if="mostrarFormSenha"
        method="post"
        action="/api/conta/senha"
        class="flex flex-col gap-3 mt-4 pt-4 border-t border-line"
        @submit="validarSenhaAntesDeEnviar"
      >
        <p v-if="erroSenha" class="text-shu text-[12.5px]">{{ erroSenha }}</p>
        <input
          v-model="novaSenha"
          name="senha"
          type="password"
          placeholder="Senha (mínimo 8 caracteres)"
          required
          class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
        >
        <input
          v-model="confirmarNovaSenha"
          name="confirmarSenha"
          type="password"
          placeholder="Confirmar senha"
          required
          class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none"
        >
        <Botao type="submit" chapado class="h-11 self-start">Salvar senha</Botao>
      </form>
    </section>
  </div>
</template>
