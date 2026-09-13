<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'

const route = useRoute()
const config = useRuntimeConfig()

const mensagemErro: Record<string, string> = {
  google: 'Não deu pra entrar com o Google. Tenta de novo.',
  line: 'Não deu pra entrar com o Line. Tenta de novo.',
  apple: 'Não deu pra entrar com a Apple. Tenta de novo.'
}

const erro = computed(() => mensagemErro[route.query.erro as string] ?? null)

useSeoMeta({ title: 'Entrar | TOKA', robots: 'noindex' })
</script>

<template>
  <div class="max-w-[420px] mx-auto px-5 py-24">
    <h1 class="font-titulo text-2xl mb-6 text-center">Entrar</h1>

    <p v-if="erro" class="text-shu text-[13.5px] text-center mb-4">{{ erro }}</p>

    <div class="flex flex-col gap-3">
      <Botao href="/api/auth/google" variante="ghost">Entrar com Google</Botao>
      <Botao href="/api/auth/line" variante="ghost">Entrar com Line</Botao>
      <Botao v-if="config.public.authAppleHabilitado" href="/api/auth/apple" variante="ghost">
        Entrar com Apple
      </Botao>
    </div>
  </div>
</template>
